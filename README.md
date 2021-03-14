# HIVE-HSC-BRIDGE Protocol
Teleport your HIVE tokens to HSC HRC-20 Tokens (or any ETH sidechain or fork - such as WAX, TELOS, or BOS, BnB).

[中文版](README-CH.MD)

## Summary

HIVE-HSC is a protocol to enable cross-chain ⛓ token movement between ETH and EOS.

* HIVE <--> HIVE(HRC20) <--> ETH(ERC20) --> Any ETH Chain (BNB tokens and whatnot)

The goal of this protocol is to provide a standard for app developers to move their tokens and apps between chains.

## Prerequisites
* [node.js](https://nodejs.org) - Javascript runtime (tested with v8.10 and 10.11)
* [cmake](https://cmake.org/) - Packaging

## HIVE-HSC-BRIDGE Overview

We believe that any token should be able to move as the developers desire or require as their apps may be best run on different chains at different times.

Typically, the way this has been done is by using what we call the "snapshot" method. 📸  This method is commonly used by token "airdrops" to send to accounts on HSC or HIVE chains that match certain criteria such as having an address with at least X balance of the chain's native token. The HIVE native token generation from the HRC20 was a snapshot airdrop. HIVE was able to do this by expiring their HRC20 contract thereby making the HRC20 HIVE tokens non-fungible.

In the HSC21 protocol, we are providing another option for HRC20 contracts that do not have a built-in pause/expiry function but who want to move their token to another chain. We are calling this action: teleportation. To teleport a token from one chain to another, it will exist on the destination chain, but no longer exist in a fungible form on the source chain.

#### The HIVE-HSC-BRIDGE Protocol has 3 Dimensions

* **Dimension 1** is on the source chain, Ethereum. There is a Gloryhole 🌌 contract on HSC to perform the absorption of HRC20 tokens and also to receive account information for the destination chain (HIVE). This information can either be configured to use the HIVE Account name or an HIVE Public Key. In the second case, the oracle must be changed to create an HIVE account for the user.
* **Dimension 2** is an Oracle 🔮 program that runs off-chain to watch the HIVE transactions and authorize the distribution of HIVE tokens (in a future version of this protocol, the Oracle could be run entirely on HSC).
* **Dimension 3** is the destination chain, EOSIO. The EOSIO token contract which distributes the tokens to the 📩  destination EOS account sent by the token holders in Layer 1.

The standard Gloryhole contract has 2 functions - be authorized to receive token Y from HSC and then receive the HIVE account info the tokens to be distributed on the destination chain via the Oracle.

Once a user sends their tokens and destination account to the Gloryhole, the HRC20 tokens will become non-fungible and the HIVE tokens will be teleported to their destination account on the HIVE chain.

The developer can choose to either send the tokens to a @null address and thereby burn them, or hold them in the Gloryhole contract until another user decides to go back from HSC HIVE to standard HIVE.


##### HIVE-HSC-BRIDGE Github Inventory
* **HIVE-HSC-BRIDGE/hsc21.js** - Oracle for managing teleportation of tokens from HIVE <-> HSC
* **HIVE-HSC-BRIDGE/[config.json](https://github.com/KLYE-Dev/HIVE-HSC-BRIDGE/blob/master/config.json)** - configuration file for gloryhole and oracle contracts
* **HIVE-HSC-BRIDGE/gloryhole/contracts/** - gloryhole contracts listed below
    * **GloryHole.sol**	- gloryhole contract that will attract HRC20 tokens
    * **GloryHoleHiveAccount.sol**	- gloryhole contract that takes an HIVE Account as an input to activate a teleportation
    * **GloryHoleHivePublicKey.sol** - takes an HIVE public key as an input to activate a teleportation (you will need to create accounts using a modified oracle for account creation)
    * **TestERC20Token.sol** - used to specify ElementToken.sol for test deployments
    * **TestElementToken.sol** - default ElementToken contract for HRC20 tokens
    * **HiveValidator.sol** - validates HIVE account or key


* **eos21/gloryhole/migrations/** - scripts for deploying truffle test
* **eos21/gloryhole/test/** - truffle tests of the gloryhole
* **eos21/eosio.token/** - standard EOSIO token contracts for testing from EOS.IO github
* **eos21/utils/** - error checking script.
* **eos21/package.json** - NPM installer for test suite

# Contributing

Pleaes read [CONTRIBUTING.md](CONTRIBUTING.md)

*HSC21 is open-source and we encourage you to customize, fork, and use the code. We built this as a example case. Some of the ideas we have include:*

* *HSC21 contracts could be modified to power a snapshot distribution using registration of HIVE accounts or keys.*
* *HSC21 "teleporter" or "oracle" could be written to run entirely on the HSC side chain (instead of node.js) and simplified payment verification (SPV) could be done entirely on-chain.*
* *HSC21 contracts could be modified to burn HIVE tokens by sending them to a 0x00 address after the Oracle successfully moves them to EOS.*
* *HSC21 could be modified to allow tokens to travel both ways in the Teleporter HIVE ↔ HSC HIVE by using a "2-way-peg" of tokens locking the tokens inside of a contract on each chain.*
* *HSC21 could create public keys on either chain which share the same private key.*
* *HSC21 could be used to authenticate ETH transactions using HIVE / HSC or vice-versa.*
* *HSC21 can be used to move tokens between graphene sister-chains.*
* *HSC21 GloryHole contract could be rewritten to support other Ethereum forks chains such as GoChain, or other chains that support tokens such as Stellar.*


# End-to-End Testing

*For testing, we will use a local Ethereum chain via Ganache and the EOS Jungle Testnet.*

### Overview for Testing

*Our scripts automate some of this process, but this is to help you understand what each step is in the process.*

1. **Create a new official HIVE token on Hive Side Chain.** *Truffle does this. (4 tokens will be notated as 40000 with 4 decimals in Ethereum contract - configure this in the [config.json](https://github.com/sheos-org/eos21/blob/master/config.json)).*
2. **Distribute new tokens to fresh HSC account.** *Truffle does this.*
3. **Deploy gloryhole contract.** *Contract address will automatically update in the truffle config file).*
4. **Deploy standard eosio.token contract on Jungle Testnet.**
5. **Issue HIVE token via eosio.token contract.** *Parameters are configured in [config.json](https://github.com/sheos-org/eos21/blob/master/config.json)*
6. **Start teleport_oracle on node.js server.**
7. **Source Hive Smart Chain account must send 2 actions.**
    * Authorize gloryhole to teleport an amount of HRC20 tokens.
    * Send HIVE account name to activate teleportation.
8. **Oracle will catch the event on Hive Smart Chain and send the tokens to the HIVE account specified in step 7.**
9. **Close gloryhole.**

### Ganache / Jungle Testing Prerequisites
* [Truffle](https://truffleframework.com) - `npm install -g truffle`
* [Ganache](https://truffleframework.com/ganache) - One click local Ethereum blockchain  
    * *Ganache should be configured to run locally on port 8545 (you may need to set this port in Ganache preferences or edit [config.json](https://github.com/sheos-org/eos21/blob/master/config.json) to match the port number.)*

* **Setup HIVE wallet**
    * `cleos wallet create --name "<name of wallet>" --to-console`


* **Import private key for account**
    * `cleos wallet import --private-key <EOS private key>--name "<name of wallet>"`


* **Buy ram to deploy HIVE token contract.** *This requires about 300kb of RAM, so 20 EOS should be enough on the testnet. For the mainnet, use [EOS NY's EOS Resource Planner](https://www.eosrp.io/) to estimate pricing*
    * `cleos -u http://dev.cryptolions.io:38888 system buyram <EOSTokenCreatorAccount> <EOSTokenCreatorAccount> "20.0000 EOS"`


## Step 1: Truffle Deployment of Hive Smart Chain Contracts (HRC20 token + Glorykhole)

* **Clone HIVE-HSC-BRIDGE repository**
   * `git clone https://github.com/KLYE-Dev/HSC-HIVE-BRIDGE.git`

* ** Compile the EOS token contract**
   * `cd eosio.token`
   * `mkdir build`
   * `cd build`
   * `cmake .. -DEOSIO_CDT_ROOT=/usr/local/eosio.cdt && make`


* ** Change directories to root of project**
    * `cd ../../`


* ** Install npm for project**
    * `npm install`


* ** Install truffle infrastructure **
    * `npm install -g truffle`


* ** Compile gloryhole contract**
    * `cd gloryhole && truffle compile`


* ** Test all contracts**
    * `truffle test`


* ** Deploy HRC20 contract and the gloryhole contract defined in [config.json](https://github.com/sheos-org/eos21/blob/master/config.json)**
    * `truffle migrate --reset --network ganache`
    * *This process will also send your newly created HRC20 tokens to your first account in the Ganache interface.*

## Step 2: Deploy Oracle
* ** Start the oracle from the root of the EOS21 project**
  * *Open another session - or even better [screen](https://www.rackaid.com/blog/linux-screen-tutorial-and-how-to/) the command.*
  * `node ./hsc21.js`

## Step 3: Deploy EOSIO Token Contract
* ** Deploy standard EOSIO.token contract**
  * `cleos -u http://dev.cryptolions.io:38888 set contract <EOSTokenCreatorAccount> ./eosio.token`

* ** Issue custom EOS Token via eosio.token contract** *You may need to unlock wallet first)*
`cleos -u http://dev.cryptolions.io:38888 push action <EOSTokenCreatorAccount> create '["<EOSTokenCreatorAccount>","4.0000 <EOSTokenName>"]' -p <EOSTokenCreatorAccount>@active`

## Step 4: Test Teleportation
* ** Enter ganache console**
  * `truffle console --network ganache`

* ** Get the HRC20 HIVE token contract address**
  * `ERC20Token.deployed().then(i => erc20=i)`
  * *Search in the results of the above command, you will get the public key of the HRC20 token in the "from" field. Take note of this, you will need this in a minute 0x52... will be the ERC20PublicKey we in 2 steps*
  * **HRC20PublicKey Example:**

		class_defaults:
		{ from: '0x52410180254b53a0816e77082ec0578d7a141c5c',


* ** Use Gloryhole Contract**
    * `GloryHoleHiveAccount.deployed().then(i => gloryhole=i)`


* ** Send Approval to Gloryhole to Attract Tokens**
    * `erc20.approve(gloryhole.address, 40000, {from:'<HRC20PublicKey>'})`
    * *this is the 0x52... address from the example above, your address will be different.*


* ** Teleport tokens by entering destination EOS account**
    * `gloryhole.teleport("<DestinationHIVEAccount>")`
    *  *You should see the action happen in the console of your oracle!*


* ** Check balance of HIVE Tokens in the Destination HIVE account**
    *  `cleos -u http://dev.cryptolions.io:38888 get table <EOSTokenCreatorAccount> <DestinationEOSAccount> accounts`

### Your test tokens have been teleported!


# Mainnet Deployment

## WARNING !
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

#### *We strongly recommend testing first using the Ganache / Jungle Guide outlined above.*

#### Testing Preparation
* You must have HRC20 token deployed on Hive Smart Chain, HIVE token Available on HIVE, and have the keys that have permission to transfer the HSC HIVE token loaded in a wallet where the oracle will be running.
* In [config.json](https://github.com/sheos-org/eos21/blob/master/config.json) configure `gloryhole` and `eosiotoken` sections to your token parameters.
    * `websocket_provider` will point to HSC node - on mainnet use `wss://mainnet.infura.io/ws`
    * `critic_block` will be the HSC block number that you want the gloryhole contract to expire, set to 0 if it never expires.
    * `decimals` `symbol` and `tokens` will be the number of decimals defined in your HRC20 token contract, the symbol of your HRC20 token, and the maximum amount of tokens in your HRC20 contract.
    * `chain_id` will be the HIVE chain ID - for HIVE mainnet it will be `aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906`
    * `http_endpoint` points to an HIVE API node
    * `account` is the account that has transfer permission of your issued HIVE token address
    * `private_key` private key that can has permission to transfer the HIVE token
* Install `HSC-HIVE-BRIDGE/gloryhole/contracts/GloryHoleHiveAccount.sol` or `gloryhole/contracts/BlackHoleEosPublicKey.sol` on the HSC
* Start the Oracle 🔮 HSC-HIVE-BRIDGE/oracle/TeleportOracle.js
* From an HIVE Side Chain account containing tokens you want to teleport, authorize the gloryhole to attract tokens from your account, then send your HIVE account name to the contract "teleport" action to initiate the movement of tokens to HIVE. *This process could be made really simple through very good UX/UI design for an interface.*

# People

## Authors

* **Ben Sigman** - *architecture, testing, and documentation* - [bensig](https://github.com/bensig)
* **Alessandro Siniscalchi** - *Solidity/js/C++ heavy lifting* - [asiniscalchi](https://github.com/asiniscalchi)

## Contributors

* **Angel Jose** - *js Guidance*
[ajose01](https://github.com/ajose01)
* **Vladimir Venediktov** - *js/C++ Guidance*
[venediktov](https://github.com/venediktov)


## Adapted for HIVE usage:

* **@KLYE** - *js Hive <-> HSC rewrite*
[KLYE](https://github.com/KLYE-Dev)


# License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
