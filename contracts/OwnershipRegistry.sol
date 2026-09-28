// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title OwnershipRegistry
 * @dev Manages verifiable ownership transfers with dual-confirmation escrow.
 *      The passport ID persists while ownership changes hands.
 */
contract OwnershipRegistry {
    enum TransferStatus { NONE, INITIATED, COMPLETED }

    struct OwnerRecord {
        address owner;
        uint256 acquiredAt;
        bytes32 transferTxRef;
    }

    struct PendingTransfer {
        string passportId;
        address seller;
        address buyer;
        TransferStatus status;
        uint256 initiatedAt;
    }

    mapping(string => OwnerRecord) private currentOwners;
    mapping(string => PendingTransfer) private pendingTransfers;

    event OwnershipRegistered(string indexed passportId, address indexed owner, uint256 timestamp);
    event TransferInitiated(string indexed passportId, address indexed seller, address indexed buyer, uint256 timestamp);
    event TransferCompleted(string indexed passportId, address indexed newOwner, uint256 timestamp);

    /**
     * @dev Register initial ownership when creating a passport.
     */
    function registerOwnership(string calldata _passportId) external {
        require(currentOwners[_passportId].owner == address(0), "Ownership already registered");

        currentOwners[_passportId] = OwnerRecord({
            owner: msg.sender,
            acquiredAt: block.timestamp,
            transferTxRef: bytes32(0)
        });

        emit OwnershipRegistered(_passportId, msg.sender, block.timestamp);
    }

    /**
     * @dev Initiate a transfer (called by seller). Buyer address must be known.
     */
    function initiateTransfer(
        string calldata _passportId,
        address _buyer
    ) external {
        require(currentOwners[_passportId].owner == msg.sender, "Not the owner");
        require(_buyer != address(0), "Invalid buyer address");
        require(
            pendingTransfers[_passportId].status != TransferStatus.INITIATED,
            "Transfer already pending"
        );

        pendingTransfers[_passportId] = PendingTransfer({
            passportId: _passportId,
            seller: msg.sender,
            buyer: _buyer,
            status: TransferStatus.INITIATED,
            initiatedAt: block.timestamp
        });

        emit TransferInitiated(_passportId, msg.sender, _buyer, block.timestamp);
    }

    /**
     * @dev Complete the transfer (called by buyer to confirm handover).
     */
    function completeTransfer(string calldata _passportId) external {
        PendingTransfer storage pt = pendingTransfers[_passportId];
        require(pt.status == TransferStatus.INITIATED, "No pending transfer");
        require(pt.buyer == msg.sender, "Not the designated buyer");

        currentOwners[_passportId] = OwnerRecord({
            owner: msg.sender,
            acquiredAt: block.timestamp,
            transferTxRef: keccak256(abi.encodePacked(_passportId, pt.seller, msg.sender, block.timestamp))
        });

        pt.status = TransferStatus.COMPLETED;

        emit TransferCompleted(_passportId, msg.sender, block.timestamp);
    }

    /**
     * @dev Get current owner of a passport.
     */
    function getOwner(string calldata _passportId)
        external
        view
        returns (address owner, uint256 acquiredAt)
    {
        OwnerRecord storage r = currentOwners[_passportId];
        return (r.owner, r.acquiredAt);
    }
}
