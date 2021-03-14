const BigNumber = web3.BigNumber;
require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .use(require('chai-as-promised'))
    .should();

const GloryHole = artifacts.require('GloryHole');
const ERC20Token = artifacts.require('ERC20Token');

contract('GloryHole', accounts => {
    const erc20ContractAddress = 0x0;
    const criticBlock = 0;
    const minimumAmount = 0;

    it('correct deployed', async () => {
        const gloryHole = await GloryHole.new(erc20ContractAddress, criticBlock, minimumAmount);
        gloryHole.should.not.equal(null);
    });

    it('criticBlock set correctly', async () => {
        const criticBlock = 1000;
        const gloryHole = await GloryHole.new(erc20ContractAddress, criticBlock, minimumAmount);
        const result = await blackHole.criticBlock();
        result.should.be.bignumber.equal(criticBlock);
    })

    it("new gloryHole isn't closed", async () => {
        const gloryHole = await GloryHole.new(erc20ContractAddress, criticBlock, minimumAmount);
        const closed = await blackHole.closed();
        closed.should.equal(false);
    });

    it("gloryHole can close after criticBlock", async () => {
        const gloryHole = await GloryHole.new(erc20ContractAddress, criticBlock, minimumAmount);
        await gloryHole.close();
        const closed = await blackHole.closed();
        closed.should.equal(true);
    });

    it ("can't teleport if gloryHole is closed", async () => {
        const gloryHole = await GloryHole.new(erc20ContractAddress, criticBlock, minimumAmount);
        await gloryHole.close();
        await gloryHole.teleport("Give me a pizza").should.be.rejected;
    });

    it("teleport with invalid ERC20Contract", async () => {
        const gloryHole = await GloryHole.new(0x0, criticBlock, minimumAmount);
        await gloryHole.teleport("Give me another pizza").should.be.rejected;
    });

    it("gloryHole can't close before criticBlock", async () => {
        const criticBlock = web3.eth.blockNumber + 1000;
        const gloryHole = await GloryHole.new(erc20ContractAddress, criticBlock, minimumAmount);
        await gloryHole.close().should.be.rejected;
        const closed = await gloryHole.closed();
        closed.should.equal(false);
    });

    it("close when already closed throw", async () => {
        const gloryHole = await GloryHole.new(erc20ContractAddress, criticBlock, minimumAmount);
        gloryHole.close();
        await gloryHole.close().should.be.rejected;
    });

    it('teleport with less than minimum balance', async () => {
        const name = 'ERC20 test';
        const symbol = 'SNS';
        const decimals = 8;
        const tokens = 100;

        const erc20Token = await ERC20Token.new(name, symbol, tokens, decimals);
        const gloryHole = await BlackHole.new(erc20Token.address, criticBlock, 10000000001);

        await erc20Token.approve(gloryHole.address, 10000000000);
        await gloryHole.teleport("Now a caffe").should.be.rejected;
    });
});
