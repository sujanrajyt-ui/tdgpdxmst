import type { Signer } from 'ethers';
import type { MarketplaceListing, ProductCategory, ProductPassport, UserRole } from '../types';

export interface ApiUser {
    id: string;
    walletAddress: string;
    name: string;
    role: UserRole;
    sellerStatus: 'NOT_APPLIED' | 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(path, {
        ...init,
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json', ...init.headers },
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error = new Error(body.message || body.error || `Request failed (${response.status}).`);
        Object.assign(error, { status: response.status, code: body.error });
        throw error;
    }
    return body as T;
}

export async function signInWithWallet(walletAddress: string, signer: Signer): Promise<ApiUser> {
    const challenge = await request<{ message: string }>('/api/auth/nonce', {
        method: 'POST',
        body: JSON.stringify({ walletAddress }),
    });
    const signature = await signer.signMessage(challenge.message);
    const result = await request<{ user: ApiUser }>('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ walletAddress, message: challenge.message, signature }),
    });
    return result.user;
}

export async function getWalletSession(): Promise<ApiUser | null> {
    try {
        const result = await request<{ user: ApiUser }>('/api/me');
        return result.user;
    } catch {
        return null;
    }
}

export async function signOutFromApi(): Promise<void> {
  try { await request('/api/auth/logout', { method: 'POST', body: '{}' }); } catch { /* Local wallet disconnect still succeeds. */ }
}

export async function applyToSell(businessName: string): Promise<void> {
    await request('/api/seller-applications', { method: 'POST', body: JSON.stringify({ businessName }) });
}

export interface AdminReviewQueue {
    listings: Array<{ id: string; passportId: string; title: string; price: number; location: string; sellerWallet: string; status: string }>;
    sellerApplications: Array<{ wallet_address: string; business_name: string; submitted_at: string }>;
}

export async function getAdminReviewQueue(): Promise<AdminReviewQueue> {
    return request('/api/admin/review-queue');
}

export async function reviewSeller(walletAddress: string, decision: 'APPROVE' | 'REJECT'): Promise<void> {
    await request(`/api/admin/sellers/${encodeURIComponent(walletAddress)}`, { method: 'PATCH', body: JSON.stringify({ decision }) });
}

export async function reviewListing(listingId: string, decision: 'APPROVE' | 'REJECT', note = ''): Promise<void> {
    await request(`/api/admin/listings/${encodeURIComponent(listingId)}`, { method: 'PATCH', body: JSON.stringify({ decision, note }) });
}

export async function createPassportRecord(input: {
    passportId: string;
    category: ProductCategory;
    brand: string;
    model: string;
    releaseYear: number;
    imageUrl: string;
    identifierHash: string;
}): Promise<ProductPassport> {
    const result = await request<{ passport: ProductPassport }>('/api/passports', { method: 'POST', body: JSON.stringify(input) });
    return result.passport;
}

export async function createListingRecord(input: {
    passportId: string;
    price: number;
    location: string;
    title: string;
    description: string;
}): Promise<MarketplaceListing> {
    const result = await request<{ listing: MarketplaceListing }>('/api/listings', { method: 'POST', body: JSON.stringify(input) });
    return result.listing;
}

export async function getPublicMarketplace(): Promise<{ passports: ProductPassport[]; listings: MarketplaceListing[] }> {
    const [passportResult, listingResult] = await Promise.all([
        request<{ passports: ProductPassport[] }>('/api/passports'),
        request<{ listings: MarketplaceListing[] }>('/api/listings'),
    ]);
    return { passports: passportResult.passports, listings: listingResult.listings };
}

export async function getMyMarketplace(): Promise<{ passports: ProductPassport[]; listings: MarketplaceListing[] }> {
    return request('/api/my/marketplace');
}
