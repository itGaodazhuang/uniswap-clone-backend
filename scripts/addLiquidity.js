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

const artifacts = {
    NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
    Shoaib: require("../artifacts/contracts/Shoaib.sol/Shoaib.json"),
    Rayyan: require("../artifacts/contracts/Rayyan.sol/Rayyan.json"),
    UniswapV3Pool: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"),
}

const { Contract } = require("ethers")
const { Token } = require("@uniswap/sdk-core")
const { Pool, Position, nearestUsableTick } = require("@uniswap/v3-sdk")
const { ethers, waffle } = require("hardhat")

async function getPoolData(poolContract) {
    const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
        poolContract.tickSpacing(),
        poolContract.fee(),
        poolContract.liquidity(),
        poolContract.slot0(),
    ])

    return {
        tickSpacing: tickSpacing,
        fee: fee,
        liquidity: liquidity,
        sqrtPriceX96: slot0[0],
        tick: slot0[1],
    }
}

async function main() {
    const [owner, signer2] = await ethers.getSigners()
    const provider = waffle.provider

    const ShoaibContract = new Contract(
        shoaibAddress,
        artifacts.Shoaib.abi,
        provider
    )

    const RayyanContract = new Contract(
        rayyanAddress,
        artifacts.Rayyan.abi,
        provider
    )

    await ShoaibContract.connect(signer2).approve(
        positionManagerAddress,
        ethers.utils.parseEther("1000")
    )
    await RayyanContract.connect(signer2).approve(
        positionManagerAddress,
        ethers.utils.parseEther("1000")
    )

    const poolContract = new Contract(
        SHO_RAY,
        artifacts.UniswapV3Pool.abi,
        provider
    )

    const poolData = await getPoolData(poolContract)

    const ShoaibToken = new Token(31337, shoaibAddress, 18, "Shoaib", "")
    const RayyanToken = new Token(31337, rayyanAddress, 18, "Rayyan", "Rayyand")

    const pool = new Pool(
        ShoaibToken,
        RayyanToken,
        poolData.fee,
        poolData.sqrtPriceX96.toString(),
        poolData.liquidity.toString(),
        poolData.tick
    )

    const position = new Position({
        pool: pool,
        liquidity: ethers.utils.parseEther("1"),
        tickLower:
            nearestUsableTick(poolData.tick, poolData.tickSpacing) -
            poolData.tickSpacing * 2,
        tickUpper:
            nearestUsableTick(poolData.tick, poolData.tickSpacing) +
            poolData.tickSpacing * 2,
    })

    const { amount0: amount0Desired, amount1: amount1Desired } =
        position.mintAmounts

    const params = {
        token0: shoaibAddress,
        token1: rayyanAddress,
        fee: poolData.fee,
        tickLower:
            nearestUsableTick(poolData.tick, poolData.tickSpacing) -
            poolData.tickSpacing * 2,
        tickUpper:
            nearestUsableTick(poolData.tick, poolData.tickSpacing) +
            poolData.tickSpacing * 2,
        amount0Desired: amount0Desired.toString(),
        amount1Desired: amount1Desired.toString(),
        amount0Min: 0,
        amount1Min: 0,
        recipient: signer2.address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10,
    }

    const nonfungiblePositionManager = new Contract(
        positionManagerAddress,
        artifacts.NonfungiblePositionManager.abi,
        provider
    )

    const tx = await nonfungiblePositionManager
        .connect(signer2)
        .mint(params, { gasLimit: "1000000" })
    const receipt = await tx.wait()
    console.log(receipt)
}

/**
 * yarn hardhat run scripts/addLiquidity.js --network localhost
 */

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
