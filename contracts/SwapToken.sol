// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.7.0 <0.9.0;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract SingleSwapToken {
    ISwapRouter public immutable swapRouter;

    constructor(ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
    }

    // address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    // address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    // address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    /**
     * 函数是一个精确输入类型的单笔交换操作，
     * 意味着用户希望以固定数量的 token1 交换尽可能多的 token2
     * @param amountIn 想要交换的token1数量
     */
    function swapExactInputSingle(
        address token1,
        address token2,
        uint amountIn
    ) external returns (uint amountOut) {
        /**
         * 从 msg.sender 地址（即调用该函数的用户的地址）转移 amountIn 数量的 token1 到当前合约地址
         */
        TransferHelper.safeTransferFrom(
            token1,
            msg.sender,
            address(this),
            amountIn
        );
        //授权给交换路由器进行交换
        TransferHelper.safeApprove(token1, address(swapRouter), amountIn);

        /**
         * 定义一个 ExactInputSingleParams 结构体，其中包含了一系列参数
         * 输入代币 token1、 输出代币 token2、手续费、接收地址、截止时间、输入量、最低输出量、价格限制等信息。
         * 这些参数将被传递给 swapRouter.exactInputSingle 函数，完成 token1 到 token2 的交换操作。
         */
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: token1,
                tokenOut: token2,
                fee: 3000,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        /**
         * 当前合约地址通过 safeTransfer 函数将获取的 amountOut 数量的 token2
         * 转移回 msg.sender 地址（即调用该函数的用户地址）
         */
        amountOut = swapRouter.exactInputSingle(params);
        // TransferHelper.safeApprove(token2, address(swapRouter), amountOut);
        // TransferHelper.safeTransfer(token2, msg.sender, amountOut);
    }

    /**
     * 函数是一个精确输出类型的单笔交换操作，意味着用户希望
     * 用尽可能少的 token1 购买特定数量的 token2。
     * 该函数需要传入两个参数：
     * amountOut 代表想要获得的 token2 数量，amountInMaximum 代表最多允许兑换的 token1 数量
     */
    function swapExactOutputSingle(
        address token1,
        address token2,
        uint amountOut,
        uint amountInMaximum
    ) external returns (uint amountIn) {
        TransferHelper.safeTransferFrom(
            token1,
            msg.sender,
            address(this),
            amountInMaximum
        );
        TransferHelper.safeApprove(
            token1,
            address(swapRouter),
            amountInMaximum
        );

        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter
            .ExactOutputSingleParams({
                tokenIn: token1,
                tokenOut: token2,
                fee: 3000,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            });

        amountIn = swapRouter.exactOutputSingle(params);
        if (amountIn < amountInMaximum) {
            TransferHelper.safeApprove(token1, address(swapRouter), 0);
            TransferHelper.safeTransfer(
                token1,
                msg.sender,
                amountInMaximum - amountIn
            );
        }
    }
}
