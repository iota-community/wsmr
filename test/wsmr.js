const { expect } = require("chai");

describe("wSMR basic testing", function() {

    let token;
    let owner;
    let addr1;
    let addr2;
    let addr3;
    let addr4;
    let nativeSmrBase;
    let wSmrBase;

    // This is called before each test to reset the contract
    beforeEach(async function () {
        token = await ethers.getContractFactory("wSMR");
        mc = await token.deploy();

        nativeSmrBase = ethers.BigNumber.from("1000000000000000000")
        wSmrBase =      ethers.BigNumber.from("1000000000000000000")

        signers = await ethers.getSigners();
        [owner, addr1, addr2, addr3, addr4]  = signers.slice(0, 5);
        await mc.deployed();
    });

    it("Check if token settings are as expected", async function() {
        expect(await mc.name()).to.equal("wSMR");
        expect(await mc.symbol()).to.equal("wSMR");
        expect(await mc.decimals()).to.equal(18);
    });
    
    it("Sending some tokens to wSMR", async function() {
        expect(await mc.totalSupply()).to.equal(0);
        expect(await mc.balanceOf(addr1.address)).to.equal(0);
        await addr1.sendTransaction({to: mc.address, value: nativeSmrBase});
        expect(await mc.totalSupply()).to.equal(wSmrBase);
        expect(await mc.balanceOf(addr1.address)).to.equal(wSmrBase);
    });
    
    it("Depositing some tokens to wSMR using `deposit`", async function() {
        expect(await mc.totalSupply()).to.equal(0);
        expect(await mc.balanceOf(addr1.address)).to.equal(0);
        await mc.connect(addr1).deposit({value: nativeSmrBase});
        expect(await mc.totalSupply()).to.equal(wSmrBase);
        expect(await mc.balanceOf(addr1.address)).to.equal(wSmrBase);
    });
    
    it("Withdraw", async function() {
        await expect(mc.connect(addr1).withdraw(wSmrBase)).to.be.revertedWith("Not enough wSMR to Withdraw");
        await mc.connect(addr1).deposit({value: nativeSmrBase});
        expect(await mc.totalSupply()).to.equal(wSmrBase);
        expect(await mc.balanceOf(addr1.address)).to.equal(wSmrBase);
        await expect(mc.connect(addr1).withdraw(wSmrBase)).not.to.be.reverted;
        expect(await mc.totalSupply()).to.equal(0);
        expect(await mc.balanceOf(addr1.address)).to.equal(0);
    });

});
