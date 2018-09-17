var BeverageCoin = artifacts.require("./bcct.sol");

const BigNumber = web3.BigNumber;

var chai = require('chai')
  , expect = chai.expect
  , should = chai.should();
chai.use(require('chai-bignumber')(BigNumber));

async function assertRevert (promise) {
  try {
    await promise;
  } catch (error) {
    error.message.should.include('revert', `Expected "revert", got ${error} instead`);
    return;
  }
  should.fail('Expected revert not received');
}

async function assertNoRevert (promise) {
  try {
    await promise;
  } catch (error) {
    error.message.should.include('revert', `Expected "revert", got ${error} instead`);
    should.fail('Expected not to revert');
  }
}

contract("BCCT", async function([ownerAccount, targetAccount, anotherAccount]){
    const voidAddress = '0x0000000000000000000000000000000000000000';
    const totalTokens = web3.toBigNumber(web3.toWei(150425700, "ether"));
    
    beforeEach(async function () {
        this.instance = await BeverageCoin.new();
    });
    
    describe("constructor", function (){
        it("should transfer all of the tokens to the owner account", async function() {
            (await this.instance.balanceOf(ownerAccount)).should.be.bignumber.equal(totalTokens);
        });
    });
    
    describe("fallback", function(){
        it("should not accept ETH", async function(){
            await assertRevert(this.instance.send(web3.toWei(0.1, "ether"), { from: anotherAccount}));
        });
    });
    
    describe("balanceOf", function(){
        describe("when the requested account has no tokens", function(){
            it("should return zero", async function(){
                (await this.instance.balanceOf(anotherAccount)).should.be.bignumber.equal(0);
            });
        });
    });
    
    describe("transfer", function(){
        const fromAccount = ownerAccount;
        
        describe("when the receiver is a valid address", function(){
            const toAccount = targetAccount;

            describe('when the sender does not have enough tokens', function () {
                const amount = web3.toWei(150425705, "ether");

                it('should revert', async function () {
                    await assertRevert(this.instance.transfer(toAccount, amount, { from: fromAccount }));
                });
            });
            
            describe('when the sender has enough tokens', function () {
                const amount = web3.toWei(0.5, "ether");
                
                it("should increase the receiver balance", async function(){
                    let balanceBefore = await this.instance.balanceOf(toAccount);
                    await this.instance.transfer(toAccount, amount, { from: fromAccount});
                    let balanceAfter = await this.instance.balanceOf(toAccount);
                    balanceAfter.sub(balanceBefore).should.be.bignumber.equal(amount);
                });
                
                it('should decrease the sender balance', async function(){
                    let balanceBefore = await this.instance.balanceOf(fromAccount);
                    await this.instance.transfer(toAccount, amount, { from: fromAccount});
                    let balanceAfter = await this.instance.balanceOf(fromAccount);
                    balanceBefore.sub(balanceAfter).should.to.be.bignumber.equal(amount);
                });
                
                it('should emit a transfer event', async function () {
                    const { logs } = await this.instance.transfer(toAccount, amount, { from: fromAccount});

                    logs.length.should.equal(1);
                    logs[0].event.should.equal('Transfer');
                    logs[0].args.from.should.equal(fromAccount);
                    logs[0].args.to.should.equal(toAccount);
                    logs[0].args.tokens.should.be.bignumber.equal(amount);
                });
            });
        });
        
        describe('when the receiver is the void address', function () {
            const toAccount = voidAddress;

            it('should revert', async function () {
                await assertRevert(this.instance.transfer(toAccount, 100, { from: fromAccount }));
            });
        });
        
    });
    
    describe("approve", function(){
        const tokenOwner = ownerAccount;
        
        describe("when the spender is a valid address", function(){
            const spender = targetAccount;
            
            describe("when the token owner has enough tokens", function(){
                const amount = 100;

                it('should emit an approve event', async function () {
                    const { logs } = await this.instance.approve(spender, amount, {from: tokenOwner});

                    logs.length.should.equal(1);
                    logs[0].event.should.equal('Approval');
                    logs[0].args.tokenOwner.should.equal(tokenOwner);
                    logs[0].args.spender.should.equal(spender);
                    logs[0].args.tokens.should.be.bignumber.equal(amount);
                });
                
                describe("when the spender doesn't have an approved amount", function(){
                    it("should set the appropriate amount", async function()
                    {
                        await this.instance.approve(spender, amount, {from: tokenOwner});
                        (await this.instance.allowance(tokenOwner, spender)).should.be.bignumber.equal(amount, `the approved value was not equal to the expected amount`);
                    });
                });
                
                describe("when the spender had an approved amount", function(){
                    const differentAmount = 300;
                    beforeEach(async function(){
                        await this.instance.approve(spender, differentAmount, {from: tokenOwner});
                    });
                    
                    it("should replace the old amount and set the appropriate amount", async function()
                    {
                        await this.instance.approve(spender, amount, {from: tokenOwner});
                        (await this.instance.allowance(tokenOwner, spender)).should.be.bignumber.equal(amount, `the approved value was not equal to the expected amount`);
                    });
                });
            });
            
            describe("when the token owner doesn't have enough tokens", function(){
                const amount = web3.toWei(150425705, "ether");
                
                it("should revert", async function()
                {
                    await assertRevert(this.instance.approve(spender, amount, {from: tokenOwner}));
                });
            });
        });
        
        describe("when the spender is the void address", function(){
            const spender = voidAddress;
            const amount = 100;
            
            it("should revert", async function()
            {
                await assertRevert(this.instance.approve(spender, amount, {from: tokenOwner}));
            });
        });
    });
    
    describe("transferFrom", function(){
        const tokenOwner = ownerAccount;
        const spender = targetAccount;
        const amount = 100;

        describe('when the receiver is a valid address', function () {
            const toAccount = anotherAccount;

            describe('when the spender has enough approved tokens', function () {
                
                beforeEach(async function () {
                    await this.instance.approve(spender, amount, { from: tokenOwner });
                });

                describe('when the token owner has enough tokens', function () {

                    it("should increase the receiver balance", async function(){
                        let balanceBefore = await this.instance.balanceOf(toAccount);
                        await this.instance.transferFrom(tokenOwner, toAccount, amount, { from: spender });
                        let balanceAfter = await this.instance.balanceOf(toAccount);
                        balanceAfter.sub(balanceBefore).should.be.bignumber.equal(amount);
                    });
                    
                    it('should decrease the token owner balance', async function(){
                        let balanceBefore = await this.instance.balanceOf(tokenOwner);
                        await this.instance.transferFrom(tokenOwner, toAccount, amount, { from: spender });
                        let balanceAfter = await this.instance.balanceOf(tokenOwner);
                        balanceBefore.sub(balanceAfter).should.to.be.bignumber.equal(amount);
                    });

                    it('should decrease the spender allowance', async function () {
                        await this.instance.transferFrom(tokenOwner, toAccount, amount, { from: spender });
                        (await this.instance.allowance(tokenOwner, spender)).should.be.bignumber.equal(0);
                    });

                    it('should emit a transfer event', async function () {
                        const { logs } = await this.instance.transferFrom(tokenOwner, toAccount, amount, { from: spender });

                        logs.length.should.equal(1);
                        logs[0].event.should.equal('Transfer');
                        logs[0].args.from.should.equal(tokenOwner);
                        logs[0].args.to.should.equal(toAccount);
                        logs[0].args.tokens.should.be.bignumber.equal(amount);
                    });
                });

                describe('when the token owner does not have enough tokens', function () {
                    beforeEach(async function () {
                        let balance = await this.instance.balanceOf(tokenOwner);
                        await this.instance.transfer(anotherAccount, balance, { from: tokenOwner });
                    });

                    it('should revert', async function () {
                        await assertRevert(this.instance.transferFrom(tokenOwner, toAccount, amount, { from: spender }));
                    });
                });
            });

            describe('when the spender does not have enough approved balance', function () {
                beforeEach(async function () {
                    await this.instance.approve(spender, amount - 1, { from: tokenOwner });
                });

                it('should revert', async function () {
                    await assertRevert(this.instance.transferFrom(tokenOwner, toAccount, amount, { from: spender }));
                });
            });
        });

        describe('when the receiver is the void address', function () {
            const toAccount = voidAddress;

            beforeEach(async function () {
                await this.instance.approve(spender, amount, { from: tokenOwner });
            });

            it('should revert', async function () {
                await assertRevert(this.instance.transferFrom(tokenOwner, toAccount, amount, { from: spender }));
            });
        });
    });
    
    describe("addToTransferQueue", function(){
        var amountToInsert = 1000;
        
        describe("when an address is added by the owner", function(){
            it("should insert the address into the queryAddress array", async function(){
                await this.instance.addToTransferQueue(targetAccount, amountToInsert, {from: ownerAccount});
                (await this.instance.queryAddresses(0)).should.equal(targetAccount);
            });
            
            it("should insert the amount of tokens into the queryAmounts array", async function(){
                await this.instance.addToTransferQueue(targetAccount, amountToInsert, {from: ownerAccount});
                (await this.instance.queryAmounts(0)).should.be.bignumber.equal(amountToInsert);
            });
        });
        
        describe("when an address is added not by the owner", function(){
            it("should revert", async function(){
                await assertRevert(this.instance.addToTransferQueue(targetAccount, amountToInsert, {from: anotherAccount}));
            });
        });
    });
    
    describe("transferQueue", function(){
        var amountToInsert = 1000;
        
        beforeEach(async function(){
                await this.instance.addToTransferQueue(targetAccount, amountToInsert, {from: ownerAccount});
        });
        
        describe("when the function is called by the owner", function(){
            it("should decrease the amount of owner tokens", async function(){
                let balanceBefore = await this.instance.balanceOf(ownerAccount);
                await this.instance.transferQueue({from: ownerAccount});
                let balanceAfter = await this.instance.balanceOf(ownerAccount);
                balanceBefore.sub(balanceAfter).should.to.be.bignumber.equal(amountToInsert);
            });
            
            it("should increase the amount of recevier tokens", async function(){
                let balanceBefore = await this.instance.balanceOf(targetAccount);
                await this.instance.transferQueue({from: ownerAccount});
                let balanceAfter = await this.instance.balanceOf(targetAccount);
                balanceAfter.sub(balanceBefore).should.to.be.bignumber.equal(amountToInsert);
            });
        });
        
        describe("when the function is called by not by the owner", function(){
            it("should revert", async function(){
                await assertRevert(this.instance.transferQueue({from: anotherAccount}));
            });
        });
    });
    
});