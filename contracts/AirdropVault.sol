// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title AirdropVault
/// @notice Contract for distributing ZORA-created ERC20 tokens with fixed ETH fee
contract AirdropVault is Ownable {
    /// @notice Configuration for each supported token
    struct TokenConfig {
        bool enabled;
        uint256 claimAmount;
    }

    /// @notice Fee in ETH (wei) required for each claim
    /// Default: 0.00003 ETH = 30000000000000 wei (~$0.05-0.06)
    uint256 public feeEth = 0.00003 ether;

    /// @notice Address that receives the ETH fees
    address public feeReceiver;

    /// @notice Mapping: token address => token configuration
    mapping(address => TokenConfig) public tokenConfig;

    /// @notice Mapping: token => wallet => has claimed
    mapping(address => mapping(address => bool)) public claimed;

    /// @notice Emitted when a user claims tokens
    event Claimed(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 feePaid
    );

    /// @notice Emitted when token config is updated
    event TokenConfigUpdated(
        address indexed token,
        bool enabled,
        uint256 claimAmount
    );

    /// @notice Emitted when fee is updated
    event FeeUpdated(uint256 newFee);

    /// @notice Emitted when fee receiver is updated
    event FeeReceiverUpdated(address newReceiver);

    /// @notice Emitted when tokens are deposited
    event Deposited(address indexed token, uint256 amount);

    error TokenNotEnabled();
    error AlreadyClaimed();
    error InsufficientVaultBalance();
    error IncorrectFeeAmount();
    error FeeTransferFailed();
    error TokenTransferFailed();
    error ZeroAddress();
    error ZeroAmount();

    /// @param _feeReceiver Address that receives ETH fees
    constructor(address _feeReceiver) Ownable(msg.sender) {
        if (_feeReceiver == address(0)) revert ZeroAddress();
        feeReceiver = _feeReceiver;
    }

    /// @notice Set configuration for a token
    /// @param token ERC20 token address
    /// @param enabled Whether claiming is enabled for this token
    /// @param claimAmount How many tokens to give per claim
    function setToken(
        address token,
        bool enabled,
        uint256 claimAmount
    ) external onlyOwner {
        if (token == address(0)) revert ZeroAddress();
        tokenConfig[token] = TokenConfig({
            enabled: enabled,
            claimAmount: claimAmount
        });
        emit TokenConfigUpdated(token, enabled, claimAmount);
    }

    /// @notice Set the ETH fee amount
    /// @param newFee New fee in wei
    function setFeeEth(uint256 newFee) external onlyOwner {
        feeEth = newFee;
        emit FeeUpdated(newFee);
    }

    /// @notice Set the fee receiver address
    /// @param newReceiver New address to receive fees
    function setFeeReceiver(address newReceiver) external onlyOwner {
        if (newReceiver == address(0)) revert ZeroAddress();
        feeReceiver = newReceiver;
        emit FeeReceiverUpdated(newReceiver);
    }

    /// @notice Deposit tokens to the vault (requires prior approval)
    /// @param token Token to deposit
    /// @param amount Amount to deposit
    function deposit(address token, uint256 amount) external {
        if (token == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        bool success = IERC20(token).transferFrom(
            msg.sender,
            address(this),
            amount
        );
        if (!success) revert TokenTransferFailed();

        emit Deposited(token, amount);
    }

    /// @notice Claim tokens by paying ETH fee
    /// @param token Token to claim
    function claim(address token) external payable {
        TokenConfig memory config = tokenConfig[token];

        if (!config.enabled) revert TokenNotEnabled();
        if (claimed[token][msg.sender]) revert AlreadyClaimed();
        if (msg.value != feeEth) revert IncorrectFeeAmount();

        uint256 vaultTokenBalance = IERC20(token).balanceOf(address(this));
        if (vaultTokenBalance < config.claimAmount) revert InsufficientVaultBalance();

        // Mark as claimed BEFORE external calls (reentrancy protection)
        claimed[token][msg.sender] = true;

        // Transfer fee to fee receiver
        (bool feeSuccess, ) = payable(feeReceiver).call{value: feeEth}("");
        if (!feeSuccess) revert FeeTransferFailed();

        // Transfer tokens to user
        bool tokenSuccess = IERC20(token).transfer(
            msg.sender,
            config.claimAmount
        );
        if (!tokenSuccess) revert TokenTransferFailed();

        emit Claimed(msg.sender, token, config.claimAmount, feeEth);
    }

    /// @notice Check if a wallet has claimed a specific token
    /// @param token Token address
    /// @param wallet Wallet address
    /// @return True if wallet has claimed this token
    function hasClaimed(address token, address wallet)
        external
        view
        returns (bool)
    {
        return claimed[token][wallet];
    }

    /// @notice Get vault balance for a specific token
    /// @param token Token address
    /// @return Balance of this contract for the token
    function vaultBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    /// @notice Allow owner to rescue stuck ETH (emergency only)
    function rescueETH() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            (bool success, ) = payable(owner()).call{value: balance}("");
            if (!success) revert FeeTransferFailed();
        }
    }

    /// @notice Allow owner to rescue stuck tokens (emergency only)
    /// @param token Token to rescue
    /// @param amount Amount to rescue
    function rescueTokens(address token, uint256 amount) external onlyOwner {
        bool success = IERC20(token).transfer(owner(), amount);
        if (!success) revert TokenTransferFailed();
    }

    receive() external payable {}
}
