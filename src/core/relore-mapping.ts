import type { MarketplaceListing, ProductPassport } from "@/types";
import { products, type Product, type Condition, type ListingState, type PassportStatus, type TimelineEvent } from "@/lib/relore-market-data";

const imageFor = (category: ProductPassport["category"]): string => {
  const sample = products.find((product) =>
    category === "FURNITURE" ? product.category === "Furniture" :
    category === "CAMERA" ? product.category === "Cameras" :
    category === "SMARTPHONE" ? product.category === "Phones" : product.category === "Laptops",
  );
  return sample?.image ?? products[0]?.image ?? "";
};

const displayCategory = (category: string): string => ({
  SMARTPHONE: "Phones", LAPTOP: "Laptops", CAMERA: "Cameras", FURNITURE: "Furniture",
} as Record<string, string>)[category] ?? category.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (letter: string) => letter.toUpperCase());

const displayCondition = (value?: string): Condition => {
  if (value === "EXCELLENT") return "Excellent";
  if (value === "FAIR" || value === "POOR") return "Fair";
  if (value === "GOOD") return "Good";
  return "Very good";
};

const displayPassportStatus = (passport: ProductPassport): PassportStatus =>
  ["OWNERSHIP_VERIFIED", "PROFESSIONALLY_INSPECTED", "MANUFACTURER_VERIFIED"].includes(passport.verificationLevel)
    ? "Verified"
    : passport.verificationLevel === "SELLER_REPORTED" ? "Seller-provided" : "Not verified";

const displayListingState = (status: string): ListingState => ({
  DRAFT: "Draft", PENDING_REVIEW: "Pending review", ACTIVE: "Live", RESERVED: "Reserved", SOLD: "Sold",
} as Record<string, ListingState>)[status] ?? "Draft";

const dateLabel = (value?: string): string => value
  ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
  : "Not recorded";

const trustForPassport = (passport: ProductPassport): TimelineEvent["trust"] =>
  displayPassportStatus(passport) === "Verified" ? "verified" : "seller";

export function toReloreProduct(passport: ProductPassport, listing: MarketplaceListing): Product {
  const serviceEvents = passport.serviceRecords ?? [];
  const history = passport.lifecycleHistory ?? [];
  const observations = passport.conditionReport?.observations ?? [];
  const timeline: TimelineEvent[] = history.map((event) => ({
    year: String(new Date(event.timestamp).getFullYear()),
    label: event.title || event.eventType.replace(/_/g, " "),
    detail: event.description || "Recorded in the product passport.",
    trust: event.mstTxHash ? "verified" : trustForPassport(passport),
  }));
  if (timeline.length === 0) {
    timeline.push({
      year: String(new Date(passport.createdAt).getFullYear()),
      label: "Passport created",
      detail: "Product identity registered. Review the evidence and verification level shown in this passport.",
      trust: "seller",
    });
  }

  return {
    id: listing.id,
    passportId: passport.passportId,
    objectId: passport.passportId,
    name: listing.title || (passport.brand + " " + passport.model),
    brand: passport.brand,
    category: displayCategory(passport.category),
    condition: displayCondition(passport.conditionReport?.display),
    price: listing.price,
    seller: listing.sellerName || "Marketplace seller",
    sellerSince: dateLabel(listing.createdAt || listing.listedAt).slice(-4),
    sellerResponse: "Response time not yet established",
    sellerTransfers: passport.ownershipHistory?.length ?? 0,
    passport: displayPassportStatus(passport),
    state: displayListingState(listing.status),
    image: passport.imageUrl || imageFor(passport.category),
    description: listing.description || "No description provided by the seller.",
    conditionDetails: observations.length ? observations : ["No condition notes have been added yet."],
    included: [],
    delivery: "Contact the seller to confirm delivery options.",
    pickup: "Pickup · " + (listing.location || "Location not provided"),
    firstRegistered: dateLabel(passport.createdAt),
    owners: Math.max(1, passport.ownershipHistory?.length ?? 0),
    serviceEvents: serviceEvents.length,
    timeline,
    sellerWallet: listing.sellerWallet,
  };
}

export function toReloreProducts(data: { passports: ProductPassport[]; listings: MarketplaceListing[] }): Product[] {
  const passports = new Map(data.passports.map((passport) => [passport.passportId, passport]));
  return data.listings.flatMap((listing) => {
    const passport = passports.get(listing.passportId);
    return passport && listing.status === "ACTIVE" ? [toReloreProduct(passport, listing)] : [];
  });
}
