// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Minimal, non-upgradeable, no-owner proxy that acts as Permit2 `spender`.
/// It forwards Permit2 signature transfers directly to an immutable TARGET.
///
/// Security properties:
/// - No owner/admin.
/// - No upgrade mechanism.
/// - TARGET is immutable.
/// - Can only move tokens using a valid Permit2 signature from `owner`.

struct TokenPermissions {
    address token;
    uint256 amount;
}

struct PermitTransferFrom {
    TokenPermissions permitted;
    uint256 nonce;
    uint256 deadline;
}

struct SignatureTransferDetails {
    address to;
    uint256 requestedAmount;
}

interface IPermit2 {
    function permitTransferFrom(
        PermitTransferFrom calldata permitted,
        SignatureTransferDetails calldata transferDetails,
        address owner,
        bytes calldata signature
    ) external;
}

contract Permit2SpenderProxy {
    address public immutable PERMIT2;
    address public immutable TARGET;

    error ZeroAddress();
    error Permit2Reverted(bytes reason);

    constructor(address permit2, address target) {
        if (permit2 == address(0) || target == address(0)) revert ZeroAddress();
        PERMIT2 = permit2;
        TARGET = target;
    }

    /// @notice Moves `requestedAmount` of `token` from `owner` to immutable TARGET using Permit2.
    /// @dev The `to` field in `transferDetails` is ignored and replaced with TARGET.
    function claim(
        PermitTransferFrom calldata permitted,
        SignatureTransferDetails calldata transferDetails,
        address owner,
        bytes calldata signature
    ) external {
        SignatureTransferDetails memory details = SignatureTransferDetails({
            to: TARGET,
            requestedAmount: transferDetails.requestedAmount
        });

        try IPermit2(PERMIT2).permitTransferFrom(permitted, details, owner, signature) {
            // ok
        } catch (bytes memory reason) {
            revert Permit2Reverted(reason);
        }
    }
}
