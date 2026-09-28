// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LifecycleRegistry
 * @dev Immutable historical record of all lifecycle events for a product passport.
 *      Events include: PURCHASED, INSPECTED, SERVICED, LISTED, SOLD,
 *      TRANSFERRED, DISPUTED, FLAGGED, STOLEN, RECOVERED, RETIRED.
 */
contract LifecycleRegistry {
    struct LifecycleEvent {
        string passportId;
        string eventType;
        bytes32 payloadHash;
        address actor;
        uint256 timestamp;
    }

    mapping(string => LifecycleEvent[]) private lifecycleEvents;

    event LifecycleEventLogged(
        string indexed passportId,
        string eventType,
        bytes32 payloadHash,
        address indexed actor,
        uint256 timestamp
    );

    /**
     * @dev Log an immutable lifecycle event.
     * @param _passportId The passport this event belongs to
     * @param _eventType Type of lifecycle event (e.g. "PURCHASED", "TRANSFERRED")
     * @param _payloadHash Hash of the event payload/details
     */
    function logEvent(
        string calldata _passportId,
        string calldata _eventType,
        bytes32 _payloadHash
    ) external {
        lifecycleEvents[_passportId].push(LifecycleEvent({
            passportId: _passportId,
            eventType: _eventType,
            payloadHash: _payloadHash,
            actor: msg.sender,
            timestamp: block.timestamp
        }));

        emit LifecycleEventLogged(
            _passportId,
            _eventType,
            _payloadHash,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @dev Get number of lifecycle events for a passport.
     */
    function getEventCount(string calldata _passportId)
        external
        view
        returns (uint256)
    {
        return lifecycleEvents[_passportId].length;
    }

    /**
     * @dev Get a specific lifecycle event by index.
     */
    function getEvent(string calldata _passportId, uint256 _index)
        external
        view
        returns (
            string memory eventType,
            bytes32 payloadHash,
            address actor,
            uint256 timestamp
        )
    {
        require(_index < lifecycleEvents[_passportId].length, "Index out of bounds");
        LifecycleEvent storage e = lifecycleEvents[_passportId][_index];
        return (e.eventType, e.payloadHash, e.actor, e.timestamp);
    }
}
