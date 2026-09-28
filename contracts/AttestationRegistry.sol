// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AttestationRegistry
 * @dev Stores verification attestation claims (IDENTITY_VERIFIED, OWNERSHIP_VERIFIED,
 *      PROFESSIONALLY_INSPECTED, MANUFACTURER_VERIFIED) anchored on MST blockchain.
 */
contract AttestationRegistry {
    struct Attestation {
        string passportId;
        string claim;
        bytes32 evidenceHash;
        address issuer;
        uint256 timestamp;
    }

    mapping(string => Attestation[]) private attestations;

    event AttestationAdded(
        string indexed passportId,
        string claim,
        bytes32 evidenceHash,
        address indexed issuer,
        uint256 timestamp
    );

    /**
     * @dev Add a verification attestation for a passport.
     * @param _passportId The passport to attest
     * @param _claim Claim type (e.g. "IDENTITY_VERIFIED")
     * @param _evidenceHash Hash of evidence document supporting the claim
     */
    function addAttestation(
        string calldata _passportId,
        string calldata _claim,
        bytes32 _evidenceHash
    ) external {
        attestations[_passportId].push(Attestation({
            passportId: _passportId,
            claim: _claim,
            evidenceHash: _evidenceHash,
            issuer: msg.sender,
            timestamp: block.timestamp
        }));

        emit AttestationAdded(
            _passportId,
            _claim,
            _evidenceHash,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @dev Get number of attestations for a passport.
     */
    function getAttestationCount(string calldata _passportId)
        external
        view
        returns (uint256)
    {
        return attestations[_passportId].length;
    }

    /**
     * @dev Get a specific attestation by index.
     */
    function getAttestation(string calldata _passportId, uint256 _index)
        external
        view
        returns (
            string memory claim,
            bytes32 evidenceHash,
            address issuer,
            uint256 timestamp
        )
    {
        require(_index < attestations[_passportId].length, "Index out of bounds");
        Attestation storage a = attestations[_passportId][_index];
        return (a.claim, a.evidenceHash, a.issuer, a.timestamp);
    }
}
