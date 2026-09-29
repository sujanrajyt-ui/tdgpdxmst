import camera from "@/assets/relore/obj-camera.jpg";
import chair from "@/assets/relore/obj-chair.jpg";
import laptop from "@/assets/relore/hero-laptop-open.jpg";

export type Condition = "Excellent" | "Very good" | "Good" | "Fair";
export type PassportStatus = "Verified" | "Seller-provided" | "Not verified";
export type ListingState = "Draft" | "Pending review" | "Live" | "Reserved" | "Sold";
export type TrustLevel = "verified" | "seller" | "unverified";

export type TimelineEvent = {
  year: string;
  label: string;
  detail: string;
  trust: TrustLevel;
};

export type Product = {
  id: string;
  passportId?: string;
  isPreview?: boolean;
  sellerWallet?: string;
  objectId: string;
  name: string;
  brand: string;
  category: string;
  condition: Condition;
  price: number;
  seller: string;
  sellerSince: string;
  sellerResponse: string;
  sellerTransfers: number;
  passport: PassportStatus;
  state: ListingState;
  image: string;
  description: string;
  conditionDetails: string[];
  included: string[];
  delivery: string;
  pickup: string;
  firstRegistered: string;
  owners: number;
  serviceEvents: number;
  timeline: TimelineEvent[];
  chainTransactions?: Array<{ label: string; hash: string }>;
};

const baseTimeline = (y0: string): TimelineEvent[] => [
  {
    year: y0,
    label: "First owner",
    detail: "Registered by original purchaser with proof of purchase on file.",
    trust: "verified",
  },
  {
    year: String(Number(y0) + 1),
    label: "Service event",
    detail: "Workshop service logged by the owner. Invoice attached, not independently checked.",
    trust: "seller",
  },
  {
    year: String(Number(y0) + 2),
    label: "Ownership transfer",
    detail: "Passport transferred to the second owner through RELORE.",
    trust: "verified",
  },
  {
    year: "2026",
    label: "Listed on RELORE",
    detail: "Current listing created with updated condition report and photos.",
    trust: "verified",
  },
];

export const products: Product[] = [
  {
    id: "macbook-pro-14",
    objectId: "RM-004821",
    name: 'MacBook Pro 14"',
    brand: "Apple",
    category: "Laptops",
    condition: "Excellent",
    price: 92000,
    seller: "Arjun",
    sellerSince: "2023",
    sellerResponse: "Usually replies within a day",
    sellerTransfers: 4,
    passport: "Verified",
    state: "Live",
    image: laptop,
    description:
      "M2 Pro, 16GB memory, 512GB storage. Used as a personal machine, kept in a sleeve, never travelled without a case. Battery health recorded at 91% at listing.",
    conditionDetails: [
      "No dents on the chassis; two faint micro-scratches on the lid.",
      "Screen free of scratches, no pressure marks.",
      "Keyboard and trackpad fully functional, no key shine.",
      "Battery cycle count 214 as recorded by the owner.",
    ],
    included: ["Original 96W charger", "Original box", "Purchase invoice", "Sleeve"],
    delivery: "Insured courier across India · 2-4 working days",
    pickup: "Pickup available in Bengaluru",
    firstRegistered: "18 / 09 / 2023",
    owners: 2,
    serviceEvents: 3,
    timeline: baseTimeline("2023"),
  },
  {
    id: "rangefinder-35mm",
    objectId: "RM-002140",
    name: "35mm Rangefinder",
    brand: "Leica",
    category: "Cameras",
    condition: "Very good",
    price: 148000,
    seller: "Meera",
    sellerSince: "2022",
    sellerResponse: "Usually replies within hours",
    sellerTransfers: 9,
    passport: "Seller-provided",
    state: "Live",
    image: camera,
    description:
      "Film rangefinder with a 50mm f/2 lens. Serviced twice, shutter speeds checked by an independent technician in 2024. Brass showing through on the edges.",
    conditionDetails: [
      "Honest brassing on the top plate corners.",
      "Viewfinder clean, rangefinder patch bright and aligned.",
      "Lens glass free of fungus or haze; light cleaning marks on the front element.",
      "Shutter accurate at all speeds per the 2024 service sheet.",
    ],
    included: ["50mm f/2 lens", "Leather half case", "Two lens caps", "Service sheet"],
    delivery: "Insured courier across India · 3-5 working days",
    pickup: "Pickup available in Mumbai",
    firstRegistered: "04 / 02 / 2022",
    owners: 3,
    serviceEvents: 2,
    timeline: baseTimeline("2022"),
  },
  {
    id: "plywood-lounge-chair",
    objectId: "RM-003377",
    name: "Plywood Lounge Chair",
    brand: "Herman Miller",
    category: "Furniture",
    condition: "Good",
    price: 54000,
    seller: "Devika",
    sellerSince: "2024",
    sellerResponse: "Usually replies within two days",
    sellerTransfers: 1,
    passport: "Verified",
    state: "Live",
    image: chair,
    description:
      "Walnut moulded plywood lounge chair, low height. Lived in a studio apartment, used daily. Structurally sound with visible patina on the seat.",
    conditionDetails: [
      "Patina and light surface marks on the seat shell.",
      "All shock mounts intact, no separation.",
      "Feet glides replaced in 2025.",
      "No wobble; joints tight.",
    ],
    included: ["Chair only", "Original label photographed"],
    delivery: "Crated freight · 5-8 working days",
    pickup: "Pickup available in Delhi",
    firstRegistered: "22 / 07 / 2023",
    owners: 2,
    serviceEvents: 1,
    timeline: baseTimeline("2023"),
  },
  {
    id: "thinkpad-x1",
    objectId: "RM-005512",
    name: "ThinkPad X1 Carbon",
    brand: "Lenovo",
    category: "Laptops",
    condition: "Good",
    price: 46500,
    seller: "Kabir",
    sellerSince: "2023",
    sellerResponse: "Usually replies within a day",
    sellerTransfers: 6,
    passport: "Seller-provided",
    state: "Live",
    image: laptop,
    description:
      "Gen 9, i7, 16GB memory, 1TB storage. Corporate machine, professionally wiped and re-imaged. Keyboard replaced in 2025.",
    conditionDetails: [
      "Lid shows even wear from a laptop bag.",
      "Keyboard replaced with an OEM part in 2025.",
      "Battery replaced in 2025, health recorded at 97%.",
      "One port cover missing.",
    ],
    included: ["65W USB-C charger", "Re-imaging report"],
    delivery: "Insured courier across India · 2-4 working days",
    pickup: "Pickup available in Pune",
    firstRegistered: "11 / 05 / 2022",
    owners: 2,
    serviceEvents: 3,
    timeline: baseTimeline("2022"),
  },
  {
    id: "compact-film-camera",
    objectId: "RM-006090",
    name: "Compact Film Camera",
    brand: "Contax",
    category: "Cameras",
    condition: "Excellent",
    price: 76000,
    seller: "Nila",
    sellerSince: "2021",
    sellerResponse: "Usually replies within hours",
    sellerTransfers: 12,
    passport: "Verified",
    state: "Reserved",
    image: camera,
    description:
      "Point and shoot with a fixed 38mm lens. Stored in a dry cabinet, shot roughly twice a year. Original strap and pouch retained.",
    conditionDetails: [
      "Body free of dents; minimal handling marks.",
      "Flash fires reliably; light meter accurate against a reference.",
      "Battery door clasp firm.",
      "Lens clean throughout.",
    ],
    included: ["Original pouch", "Wrist strap", "Fresh battery"],
    delivery: "Insured courier across India · 3-5 working days",
    pickup: "Pickup available in Chennai",
    firstRegistered: "30 / 11 / 2021",
    owners: 2,
    serviceEvents: 1,
    timeline: baseTimeline("2021"),
  },
  {
    id: "oak-writing-desk",
    objectId: "RM-007455",
    name: "Oak Writing Desk",
    brand: "Independent maker",
    category: "Furniture",
    condition: "Very good",
    price: 38000,
    seller: "Rohan",
    sellerSince: "2025",
    sellerResponse: "Response time not yet established",
    sellerTransfers: 0,
    passport: "Not verified",
    state: "Live",
    image: chair,
    description:
      "Solid oak desk built by a workshop in Goa. Oiled finish, refreshed in 2025. Two drawers running on wooden runners.",
    conditionDetails: [
      "Top re-oiled in 2025, small ring mark near the left edge.",
      "Drawers run smoothly.",
      "No structural movement in the frame.",
    ],
    included: ["Desk only"],
    delivery: "Crated freight · 5-8 working days",
    pickup: "Pickup available in Goa",
    firstRegistered: "09 / 03 / 2024",
    owners: 1,
    serviceEvents: 1,
    timeline: baseTimeline("2024"),
  },
  {
    id: "demo-dell-xps-13",
    isPreview: true,
    objectId: "DEMO-DEVICE-01",
    name: "XPS 13 Laptop · Demo",
    brand: "Dell",
    category: "Laptops",
    condition: "Very good",
    price: 52000,
    seller: "Demo seller",
    sellerSince: "2026",
    sellerResponse: "Preview item only",
    sellerTransfers: 0,
    passport: "Seller-provided",
    state: "Live",
    image: laptop,
    description: "Fictional preview listing. Not a real device and not for sale.",
    conditionDetails: ["Sample condition details for the marketplace preview."],
    included: ["Sample listing only"],
    delivery: "Not available · Demo item",
    pickup: "Preview only",
    firstRegistered: "Preview only",
    owners: 1,
    serviceEvents: 0,
    timeline: [{ year: "2026", label: "Demo listing", detail: "Fictional preview data. No real passport or seller record.", trust: "unverified" }],
  },
  {
    id: "demo-asus-zenbook-14",
    isPreview: true,
    objectId: "DEMO-DEVICE-02",
    name: "Zenbook 14 · Demo",
    brand: "ASUS",
    category: "Laptops",
    condition: "Good",
    price: 44500,
    seller: "Demo seller",
    sellerSince: "2026",
    sellerResponse: "Preview item only",
    sellerTransfers: 0,
    passport: "Seller-provided",
    state: "Live",
    image: laptop,
    description: "Fictional preview listing. Not a real device and not for sale.",
    conditionDetails: ["Sample condition details for the marketplace preview."],
    included: ["Sample listing only"],
    delivery: "Not available · Demo item",
    pickup: "Preview only",
    firstRegistered: "Preview only",
    owners: 1,
    serviceEvents: 0,
    timeline: [{ year: "2026", label: "Demo listing", detail: "Fictional preview data. No real passport or seller record.", trust: "unverified" }],
  },
  {
    id: "demo-sony-alpha-a6400",
    isPreview: true,
    objectId: "DEMO-DEVICE-03",
    name: "Alpha A6400 Camera · Demo",
    brand: "Sony",
    category: "Cameras",
    condition: "Excellent",
    price: 58500,
    seller: "Demo seller",
    sellerSince: "2026",
    sellerResponse: "Preview item only",
    sellerTransfers: 0,
    passport: "Seller-provided",
    state: "Live",
    image: camera,
    description: "Fictional preview listing. Not a real device and not for sale.",
    conditionDetails: ["Sample condition details for the marketplace preview."],
    included: ["Sample listing only"],
    delivery: "Not available · Demo item",
    pickup: "Preview only",
    firstRegistered: "Preview only",
    owners: 1,
    serviceEvents: 0,
    timeline: [{ year: "2026", label: "Demo listing", detail: "Fictional preview data. No real passport or seller record.", trust: "unverified" }],
  },
];

export const categories = ["Laptops", "Cameras", "Furniture"];
export const brands = Array.from(new Set(products.map((p) => p.brand)));
export const conditions: Condition[] = ["Excellent", "Very good", "Good", "Fair"];

export const formatPrice = (n: number) => "₹" + n.toLocaleString("en-IN");

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const myObjects = [
  {
    id: "macbook-pro-14",
    name: 'MacBook Pro 14"',
    objectId: "RM-004821",
    state: "Live" as ListingState,
  },
  {
    id: "rangefinder-35mm",
    name: "35mm Rangefinder",
    objectId: "RM-002140",
    state: "Draft" as ListingState,
  },
];

export const myListings = [
  {
    id: "macbook-pro-14",
    name: 'MacBook Pro 14"',
    objectId: "RM-004821",
    price: 92000,
    state: "Live" as ListingState,
  },
  {
    id: "compact-film-camera",
    name: "Compact Film Camera",
    objectId: "RM-006090",
    price: 76000,
    state: "Reserved" as ListingState,
  },
  {
    id: "oak-writing-desk",
    name: "Oak Writing Desk",
    objectId: "RM-007455",
    price: 38000,
    state: "Pending review" as ListingState,
  },
];
