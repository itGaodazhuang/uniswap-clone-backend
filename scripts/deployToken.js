const { ethers } = require("hardhat")
const fs = require("fs")

async function main() {
    const [owner] = await ethers.getSigners()

    Shoaib = await ethers.getContractFactory("Shoaib")
    shoaib = await Shoaib.deploy()

    Rayyan = await ethers.getContractFactory("Rayyan")
    rayyan = await Rayyan.deploy()

    PopUp = await ethers.getContractFactory("PopUp")
    popUp = await PopUp.deploy()

    console.log("shoaibAddress=", shoaib.address)
    console.log("rayyanAddress=", rayyan.address)
    console.log("popUpAddress=", popUp.address)

    fs.writeFileSync(
        "scripts/address.js",
        `export const shoaibAddress= "${shoaib.address}"\nexport const rayyanAddress= "${rayyan.address}"\nexport const popUpAddress= "${popUp.address}"\n`,
        { flag: "a" },
        (err) => {
            if (err) {
                console.log(err)
            }
        }
    )

    fs.writeFileSync(
        "/home/zd_lzy/hh-fcc/hardhat-uniswap-fcc/scripts/address.node.js",
        `module.exports.shoaibAddress= "${shoaib.address}"\nmodule.exports.rayyanAddress= "${rayyan.address}"\nmodule.exports.popUpAddress= "${popUp.address}"\n`,
        { flag: "a" },
        (err) => {
            if (err) {
                console.log(err)
            }
        }
    )
}

/**
 * yarn hardhat run scripts/deployToken.js --network localhost
 */

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
