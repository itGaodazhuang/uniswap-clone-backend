const hre = require("hardhat")
const fs = require("fs")
require("dotenv").config()

const swapRouter = process.env.SWAP_ROUTER

async function main() {
    //ERC20 Boo Token
    const BooToken = await hre.ethers.getContractFactory("BooToken")
    const booToken = await BooToken.deploy()
    await booToken.deployed()
    console.log(`BooToken deployed to ${booToken.address}`)

    //ERC20 Life Token
    const LifeToken = await hre.ethers.getContractFactory("LifeToken")
    const lifeToken = await LifeToken.deploy()
    await lifeToken.deployed()
    console.log(`LifeToken deployed to ${lifeToken.address}`)

    //SingleSwapToken
    const SingleSwapToken = await hre.ethers.getContractFactory(
        "SingleSwapToken"
    )
    const singleSwapToken = await SingleSwapToken.deploy(swapRouter)
    await singleSwapToken.deployed()
    console.log(`SingleSwapToken deployed to ${singleSwapToken.address}`)

    //SwapMultiHop
    const SwapMultiHop = await hre.ethers.getContractFactory("SwapMultiHop")
    const swapMultiHop = await SwapMultiHop.deploy()
    await swapMultiHop.deployed()
    console.log(`SwapMultiHop deployed to ${swapMultiHop.address}`)

    //User Data Contract
    const UserStorageData = await hre.ethers.getContractFactory(
        "UserStorageData"
    )
    const userStorageData = await UserStorageData.deploy()
    await userStorageData.deployed()
    console.log(`UserStorageData deployed to ${userStorageData.address}`)

    fs.writeFile(
        "/home/zd_lzy/hh-fcc/hardhat-uniswap-fcc/scripts/address.js",
        `export const booTokenAddress = "${booToken.address}"\nexport const lifeTokenAddress = "${lifeToken.address}"\nexport const singleSwapTokenAddress = "${singleSwapToken.address}"\nexport const swapMultiHopAddress = "${swapMultiHop.address}"\nexport const userStorageData = "${userStorageData.address}"\n`,
        { flag: "w" },
        (err) => {
            if (err) {
                console.log(err)
            }
        }
    )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
