const BigNumber = web3.BigNumber;
require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .use(require('chai-as-promised'))
    .should();

const HiveValidator = artifacts.require('HiveValidator');

contract('HiveValidator', accounts => {
    it("valid account name", async () => {
        const HiveValidator = await HiveValidator.new();
        await HiveValidator.isValidAccount("te.mgr5ymass").should.eventually.be.true;
        await HiveValidator.isValidAccount("teamgreymas").should.eventually.be.false;
        await HiveValidator.isValidAccount("teamgreymasss").should.eventually.be.false;
        await HiveValidator.isValidAccount("0eamgreymass").should.eventually.be.false;
        await HiveValidator.isValidAccount("teAmgreymass").should.eventually.be.false;
        await HiveValidator.isValidAccount("te6mgreymass").should.eventually.be.false;
        await HiveValidator.isValidAccount("teamgreyZass").should.eventually.be.false;
    });

    it("valid public key", async () => {
        const HiveValidator = await HiveValidator.new();
        await HiveValidator.isValidKey("EOS7M38bvCoL7N3mBDbQyqePcK128G2b3so7XBa9hJn9uuKDN7we8").should.eventually.be.true;
        await HiveValidator.isValidKey("EOS77M38bvCoL7N3mBDbQyqePcK128G2b3so7XBa9hJn9uuKDN7we8").should.eventually.be.false; // size
        await HiveValidator.isValidKey("EOSM38bvCoL7N3mBDbQyqePcK128G2b3so7XBa9hJn9uuKDN7we8").should.eventually.be.false; // size
        await HiveValidator.isValidKey("EOW7M38bvCoL7N3mBDbQyqePcK128G2b3so7XBa9hJn9uuKDN7we8").should.eventually.be.false; // not starting EOS
        await HiveValidator.isValidKey("EOS7M38bvCoL7N3mBDbQyqePcK128G2b3so70Ba9hJn9uuKDN7we8").should.eventually.be.false; // 0
        await HiveValidator.isValidKey("EOS7M38bvCoO7N3mBDbQyqePcK128G2b3so7XBa9hJn9uuKDN7we8").should.eventually.be.false; // O
        await HiveValidator.isValidKey("EOS7M38bvCoL7N3mBDbQyqePcK128G2b3so7XBa9hJnIuuKDN7we8").should.eventually.be.false; // I
        await HiveValidator.isValidKey("EOS7M38bvCoL7N3mBDbQyqePcKl28G2b3so7XBa9hJn9uuKDN7we8").should.eventually.be.false; // l
    });
});