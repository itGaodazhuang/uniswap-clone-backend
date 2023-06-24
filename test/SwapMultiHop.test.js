const { expect } = require("chai")
const { ethers } = require("hardhat")

const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
const WETH9 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

describe("SwapMultiHop", () => {
    let swapMultiHop, accounts, weth, dai, usdc

    before(async () => {
        accounts = await ethers.getSigners()

        const SwapMultiHop = await ethers.getContractFactory("SwapMultiHop")
        swapMultiHop = await SwapMultiHop.deploy()

        weth = await ethers.getContractAt("IWETH", WETH9)
        dai = await ethers.getContractAt("IERC20", DAI)
        usdc = await ethers.getContractAt("IERC20", USDC)
    })

    // console.log(weth)
    // console.log(dai)
    // console.log(usdc)
    // console.log(accounts)
    // console.log(swapMultiHop)

    it("swapExactInputMultihop", async () => {
        const amountIn = 10n ** 18n

        //授权和存钱
        await weth.deposit({ value: amountIn })
        await weth.approve(swapMultiHop.address, amountIn)

        //交换
        await swapMultiHop.swapExactInputMultihop(amountIn)
        console.log("Dai balance", await dai.balanceOf(accounts[0].address))
    })

    it("swapExactOutputMultihop", async () => {
        const wethAmountInMax = 10n ** 18n
        const daiAmountOut = 100n * 10n ** 18n

        //存钱
        await weth.deposit({ value: wethAmountInMax })
        await weth.approve(swapMultiHop.address, wethAmountInMax)

        //交换
        await swapMultiHop.swapExactOutputMultihop(
            daiAmountOut,
            wethAmountInMax
        )
        console.log(accounts[0].address)
        console.log("Dai balance:", await dai.balanceOf(accounts[0].address))
        // console.log("Dai balance:", await dai.balanceOf(accounts[1].address))
    })
})
