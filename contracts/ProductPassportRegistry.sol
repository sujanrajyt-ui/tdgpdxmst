// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ProductPassportRegistry
 * @dev Registers persistent product passport identities on MST blockchain.
 *      Each product gets a permanent Passport ID that survives ownership changes.
 */
contract ProductPassportRegistry {
    struct Passport {
        string passportId;
        bytes32 identifierHash;
        address registrant;
        uint256 registeredAt;
        bool exists;
    }

    mapping(string => Passport) private passports;
    string[] private passportIds;

    event PassportRegistered(
        string indexed passportId,
        bytes32 identifierHash,
        address indexed registrant,
        uint256 timestamp
    );

    /**
     * @dev Register a new product passport.
     * @param _passportId Unique passport identifier (e.g. "PP-82941")
     * @param _identifierHash Keccak256 hash of the product's physical identifier (serial/IMEI)
     */
    function registerPassport(
        string calldata _passportId,
        bytes32 _identifierHash
    ) external {
        require(!passports[_passportId].exists, "Passport already registered");

        passports[_passportId] = Passport({
            passportId: _passportId,
            identifierHash: _identifierHash,
            registrant: msg.sender,
            registeredAt: block.timestamp,
            exists: true
        });

        passportIds.push(_passportId);

        emit PassportRegistered(
            _passportId,
            _identifierHash,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @dev Get passport details by ID.
     */
    function getPassport(string calldata _passportId)
        external
        view
        returns (
            bytes32 identifierHash,
            address registrant,
            uint256 registeredAt
        )
    {
        require(passports[_passportId].exists, "Passport not found");
        Passport storage p = passports[_passportId];
        return (p.identifierHash, p.registrant, p.registeredAt);
    }

    /**
     * @dev Check if a passport exists.
     */
    function passportExists(string calldata _passportId)
        external
        view
        returns (bool)
    {
        return passports[_passportId].exists;
    }

    /**
     * @dev Get total number of registered passports.
     */
    function totalPassports() external view returns (uint256) {
        return passportIds.length;
    }
}
