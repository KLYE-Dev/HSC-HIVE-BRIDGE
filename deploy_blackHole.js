const blackHoleDeployer = require('./utils/BlackHoleDeployer');

const argv = require('minimist')(process.argv.slice(2), {
    default: {
        provider: 'http://localhost:8545',
        contract_file: './blackhole/build/contracts/BlackHoleEosAccount.json',
        gas: 3000000
    },
    boolean: ['help'],
    string: ['erc20_address', 'sender']
});

if (argv.help){
    console.log("Help for BlackHole contract deployer:");
    console.log("");
    console.log("  --sender           address of account that is installing the contract");
    console.log("  --erc20_address    address of erc20 contract blackhole will teleport from");
    console.log("  --gas              amount of gas used in the transaction");
    console.log("  --critic_block     after it anyone can close the blackhole");
    console.log("  --minimum_amount   the minimum number of teportable tokens");
    console.log("  --contract_file    compiled blackhole contract");
    process.exit();
}

blackHoleDeployer(argv);