# Introduction

This is a uniswap clone backend project which is based Uniswap API and hardhat.
Tips: I didn't finish this backend project, it only realized little functions of Uniswap Exchange.It has a front end project in my repository called "uniswap-nextjs-fcc"

## Main function

-   swap ETH-ERC20 (I realize ETH-WETH in the front-end)
-   swap ERC20-ERC20
-   add liquidity of new published ERC20 tokens

## run

You must run this project with a front end, the contract addtress will output to the file which defined in ./scripts/deploy.js
The ERC20 token address is stored in Ethereum chain, therefore you need a mainnet forking chain.
You can run command 'yarn hardhat node' to run a localhost fork chain of Ethereum
Some relative settings you can find in hardhat.config.js.

-   deploy contract: yarn hardhat run scripts/deploy.js --network locahost
    Of course, the default network is localhost, you may needn't type it in.
