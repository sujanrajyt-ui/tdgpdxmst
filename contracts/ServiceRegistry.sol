// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ServiceRegistry
 * @dev Records authorized service center attestations (battery replacements,
 *      repairs, refurbishments) directly onto the product passport.
 */
contract ServiceRegistry {
    struct ServiceRecord {
        string passportId;
        string serviceType;
        bytes32 documentHash;
        address serviceCenter;
        uint256 timestamp;
    }

    mapping(string => ServiceRecord[]) private serviceRecords;

    event ServiceRecorded(
        string indexed passportId,
        string serviceType,
        bytes32 documentHash,
        address indexed serviceCenter,
        uint256 timestamp
    );

    /**
     * @dev Record a verified service event.
     * @param _passportId The passport being serviced
     * @param _serviceType Type of service (e.g. "BATTERY_REPLACEMENT")
     * @param _documentHash Hash of the service documentation
     */
    function recordService(
        string calldata _passportId,
        string calldata _serviceType,
        bytes32 _documentHash
    ) external {
        serviceRecords[_passportId].push(ServiceRecord({
            passportId: _passportId,
            serviceType: _serviceType,
            documentHash: _documentHash,
            serviceCenter: msg.sender,
            timestamp: block.timestamp
        }));

        emit ServiceRecorded(
            _passportId,
            _serviceType,
            _documentHash,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @dev Get number of service records for a passport.
     */
    function getServiceCount(string calldata _passportId)
        external
        view
        returns (uint256)
    {
        return serviceRecords[_passportId].length;
    }

    /**
     * @dev Get a specific service record by index.
     */
    function getServiceRecord(string calldata _passportId, uint256 _index)
        external
        view
        returns (
            string memory serviceType,
            bytes32 documentHash,
            address serviceCenter,
            uint256 timestamp
        )
    {
        require(_index < serviceRecords[_passportId].length, "Index out of bounds");
        ServiceRecord storage s = serviceRecords[_passportId][_index];
        return (s.serviceType, s.documentHash, s.serviceCenter, s.timestamp);
    }
}
