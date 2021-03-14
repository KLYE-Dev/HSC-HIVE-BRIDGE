const fs = require('fs');
const check = require('../../utils/Check');

var ERC20Token = artifacts.require("./ERC20Token.sol");
var GloryHole = artifacts.require("./GloryHoleHiveAccount.sol")

module.exports = function (deployer) {
  const configFile = "../config.json";
  //check(fs.existsSync(configFile), "configuration file: " + configFile);
  const config = JSON.parse(fs.readFileSync(configFile));
  //console.log(config)
  const name = "ERC20 Test";
  const symbol = config.gloryhole.symbol;
  const decimals = config.gloryhole.decimals;
  const tokens = config.gloryhole.tokens;
  const genesisBlock = config.gloryhole.critic_block;
  const minimumAmount = config.gloryhole.minimum_amount;

  check(name, "ERC20 name: " + name);
  check(symbol, "ERC20 symbol: " + symbol);
  check(tokens, "ERC20 tokens: " + tokens);
  check(decimals, "ERC20 decimals: " + decimals);
  check(genesisBlock, "BlackHole critical block: " + genesisBlock);
  check(minimumAmount, "BlackHole minimum amount: " + minimumAmount);

  deployer.deploy(ERC20Token, name, symbol, tokens, decimals).then(() => {
    return deployer.deploy(GloryHole, ERC20Token.address, genesisBlock, minimumAmount);
  })
    .then(() => {
      fs.writeFileSync('../erc20_address', ERC20Token.address);
      fs.writeFileSync('../gloryhole_address', GloryHole.address);
    })
};
