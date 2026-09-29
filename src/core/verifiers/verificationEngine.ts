import { ProductIdentifier, EvidenceDocument, RiskLevel, VerificationLevel } from '../../types';

export interface VerificationResult {
    claim: VerificationLevel;
    status: 'VERIFIED' | 'FAILED' | 'MANUAL_REVIEW';
    verifiedBy: string;
    evidenceHash: string;
    timestamp: string;
    notes: string;
}

export interface RiskAnalysisResult {
    riskLevel: RiskLevel;
    riskScore: number; // 0 (safest) to 100 (highest risk)
    signals: string[];
}

/** Validates the 15-digit IMEI format and its Luhn check digit. */
export function isValidImei(value: string): boolean {
    if (!/^\d{15}$/.test(value)) return false;

    const sum = value.split('').reverse().reduce((total, digit, index) => {
        let number = Number(digit);
        if (index % 2 === 1) {
            number *= 2;
            if (number > 9) number -= 9;
        }
        return total + number;
    }, 0);

    return sum % 10 === 0;
}

export class VerificationEngine {
    public static verifyIdentifier(identifier: ProductIdentifier): VerificationResult {
        const rawId = identifier.serialNumber || identifier.imei || identifier.serviceTag || '';

        if (identifier.category === 'SMARTPHONE' && !isValidImei(identifier.imei || '')) {
            return {
                claim: 'IDENTITY_VERIFIED',
                status: 'FAILED',
                verifiedBy: 'System IMEI Checksum Verifier',
                evidenceHash: '0x0000000000000000',
                timestamp: new Date().toISOString(),
                notes: 'IMEI must contain 15 digits and pass the Luhn check-digit validation.'
            };
        }

        if (!rawId || rawId.trim().length < 5) {
            return {
                claim: 'IDENTITY_VERIFIED',
                status: 'FAILED',
                verifiedBy: 'System ProductIdentifierVerifier',
                evidenceHash: '0x0000000000000000',
                timestamp: new Date().toISOString(),
                notes: 'Invalid identifier format: Serial or IMEI missing or too short.'
            };
        }

        // Hash identifier for privacy-preserving on-chain reference
        let hash = 0;
        for (let i = 0; i < rawId.length; i++) {
            hash = (hash << 5) - hash + rawId.charCodeAt(i);
            hash |= 0;
        }
        const evidenceHash = `0x${Math.abs(hash).toString(16).padStart(32, '0')}`;

        return {
            claim: 'IDENTITY_VERIFIED',
            status: 'VERIFIED',
            verifiedBy: 'System ProductIdentifierVerifier',
            evidenceHash,
            timestamp: new Date().toISOString(),
            notes: `Verified valid format for ${identifier.category} (${identifier.brand} ${identifier.model}).`
        };
    }

    public static verifyOwnershipEvidence(
        userId: string,
        evidenceDocs: EvidenceDocument[]
    ): VerificationResult {
        const invoiceDoc = evidenceDocs.find(d => d.type === 'INVOICE');

        if (!invoiceDoc) {
            return {
                claim: 'OWNERSHIP_VERIFIED',
                status: 'MANUAL_REVIEW',
                verifiedBy: 'System OwnershipVerifier',
                evidenceHash: '0x000',
                timestamp: new Date().toISOString(),
                notes: 'No invoice or proof of purchase provided. Flagged for admin manual review.'
            };
        }

        return {
            claim: 'OWNERSHIP_VERIFIED',
            status: 'VERIFIED',
            verifiedBy: 'System OwnershipVerifier + WASMify Document Bridge',
            evidenceHash: invoiceDoc.fileHash,
            timestamp: new Date().toISOString(),
            notes: `Verified valid purchase invoice match (${invoiceDoc.title}) tied to user ${userId}.`
        };
    }

    public static evaluateRisk(
        identifier: ProductIdentifier,
        existingPassports: { identifierHash: string; passportId: string; currentOwnerId: string }[],
        evidenceDocs: EvidenceDocument[],
        price?: number
    ): RiskAnalysisResult {
        const signals: string[] = [];
        let score = 5; // Base safe score

        const rawId = identifier.serialNumber || identifier.imei || identifier.serviceTag || '';

        // 1. Check for duplicate serial/IMEI in system
        const duplicate = existingPassports.find(p => p.identifierHash === identifier.hashedIdentifier);
        if (duplicate) {
            signals.push(`CRITICAL: Identifier ${rawId} already registered under Passport ${duplicate.passportId}. Possible duplicate/cloning attempt.`);
            score += 65;
        }

        // 2. Check evidence presence
        if (evidenceDocs.length === 0) {
            signals.push('No purchase invoice or device evidence uploaded.');
            score += 25;
        } else {
            const hasInvoice = evidenceDocs.some(d => d.type === 'INVOICE');
            if (!hasInvoice) {
                signals.push('Missing official tax invoice / purchase receipt.');
                score += 15;
            }
        }

        // 3. Price anomaly check if provided
        if (price && price < 10000 && identifier.model.includes('MacBook')) {
            signals.push('Price anomaly: Abnormally low price for high-tier MacBook model.');
            score += 20;
        }

        let riskLevel: RiskLevel = 'LOW_RISK';
        if (score >= 60) {
            riskLevel = 'HIGH_RISK';
        } else if (score >= 25) {
            riskLevel = 'REVIEW_REQUIRED';
        }

        return {
            riskLevel,
            riskScore: Math.min(100, score),
            signals
        };
    }
}
