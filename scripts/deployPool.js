const {
    wethAddress,
    factoryAddress,
    swapRouterAddress,
    nftDescriptorAddress,
    positionDescriptorAddress,
    positionManagerAddress,
    shoaibAddress,
    rayyanAddress,
    popUpAddress,
} = require("./address.node.js")
const fs = require("fs")

const artifacts = {
    UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
    NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
}

const { Contract, BigNumber } = require("ethers")
const bn = require("bignumber.js")
const { ethers } = require("hardhat")
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 })

const MAINNET_URL =
    "https://eth-mainnet.g.alchemy.com/v2/NRgQW5bcNa1oaHlJ6ROzzN6Pr1fHJ-86"

const provider = new ethers.providers.JsonRpcProvider(MAINNET_URL)

// const provider = waffle.provider

function encodePriceSqrt(reserve1, reserve0) {
    return BigNumber.from(
        new bn(reserve1.toString())
            .div(reserve0.toString())
            .sqrt()
            .multipliedBy(new bn(2).pow(96))
            .integerValue(3)
            .toString()
    )
}

const nonfungiblePositionManager = new Contract(
    positionManagerAddress,
    artifacts.NonfungiblePositionManager.abi,
    provider
)
const factory = new Contract(
    factoryAddress,
    artifacts.UniswapV3Factory.abi,
    provider
)

async function deployPool(token0, token1, fee, price) {
    const [owner] = await ethers.getSigners()
    console.log(
        "owner:",
        owner,
        "token0",
        token0,
        "token1",
        token1,
        "fee",
        fee,
        "price",
        price
    )
    await nonfungiblePositionManager
        .connect(owner)
        .createAndInitializePoolIfNecessary(token0, token1, fee, price, {
            gasLimit: 5000000,
        })

    const poolAddress = await factory
        .connect(owner)
        .getPool(token0, token1, fee)

    return poolAddress
}

async function main() {
    const shoRay = await deployPool(
        shoaibAddress,
        rayyanAddress,
        500,
        encodePriceSqrt(1, 1)
    )
    console.log("SHO_RAY=", `"${shoRay}"`)

    fs.writeFileSync(
        "scripts/address.js",
        `export const SHO_RAY= "${shoRay}"\n`,
        { flag: "a" },
        (err) => {
            if (err) {
                console.log(err)
            }
        }
    )

    fs.writeFileSync(
        "scripts/address.node.js",
        `module.exports.SHO_RAY= "${shoRay}"\n`,
        { flag: "a" },
        (err) => {
            if (err) {
                console.log(err)
            }
        }
    )
}

/**
 * yarn hardhat run scripts/deployPool.js --network localhost
 */

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
