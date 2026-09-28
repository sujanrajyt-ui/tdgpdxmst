import { User } from '../../types';

export interface IdentityProvider {
    authenticateUser(email: string, name: string): Promise<User>;
    getMSTIdentity(userId: string): string;
}

export class MSTSaralProvider implements IdentityProvider {
    public async authenticateUser(email: string, name: string): Promise<User> {
        // Simulates SARAL keyless onboarding (SSO / Passkey -> MST DID derivation)
        const seed = email.toLowerCase().trim();
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = (hash << 5) - hash + seed.charCodeAt(i);
            hash |= 0;
        }
        const didSuffix = Math.abs(hash).toString(16).padStart(8, '0');
        const mstIdentityDid = `did:mst:saral:${didSuffix}`;

        return {
            id: `USR-${Math.floor(10000 + Math.random() * 90000)}`,
            name,
            email,
            role: 'CONSUMER',
            mstIdentityDid,
            saralVerified: true,
            reputationScore: 98,
            avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`
        };
    }

    public getMSTIdentity(userId: string): string {
        return `did:mst:saral:${userId.replace('USR-', '').toLowerCase()}`;
    }
}

export class MockSaralProvider implements IdentityProvider {
    public async authenticateUser(email: string, name: string): Promise<User> {
        return {
            id: `USR-MOCK-101`,
            name,
            email,
            role: 'CONSUMER',
            mstIdentityDid: `did:mst:mock:identity-101`,
            saralVerified: false,
            reputationScore: 85,
        };
    }

    public getMSTIdentity(userId: string): string {
        return `did:mst:mock:${userId}`;
    }
}
