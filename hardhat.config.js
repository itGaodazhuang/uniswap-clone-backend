require("@nomiclabs/hardhat-waffle")
require("dotenv").config()

module.exports = {
    solidity: {
        version: "0.7.6",
        settings: {
            optimizer: {
                enabled: true,
                runs: 5000,
                details: { yul: false },
            },
        },
    },
    networks: {
        hardhat: {
            forking: {
                url: process.env.ALCHEMY_API,
            },
        },
    },
}
