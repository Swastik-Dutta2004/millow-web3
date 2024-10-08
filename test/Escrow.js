const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Escrow', () => {
    let buyer, seller, inspector, lender
    let realEstate
    let escrow
    
        beforeEach(async () => {
            // Setup accounts
            [buyer, seller, inspector, lender] = await ethers.getSigners()
    
            // Deploy Real Estate
            const RealEstate = await ethers.getContractFactory('RealEstate')
            realEstate = await RealEstate.deploy()
    
            // Mint 
            let transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmQJc3tWrenPYqqHHWFVTTNxBww3Zagyr2udhPGCYn6mze?filename=1.json")
            await transaction.wait()
    
            // Deploy Escrow
            const Escrow = await ethers.getContractFactory('Escrow')
            escrow = await Escrow.deploy(
                realEstate.address,
                seller.address,
                inspector.address,
                lender.address
            )
    
            // Approve Property
            transaction = await realEstate.connect(seller).approve(escrow.address, 1)
            await transaction.wait()
    
            // List Property
            transaction = await escrow.connect(seller).list(1, buyer.address, tokens(10), tokens(5))
            await transaction.wait()
    })

    describe("Deployment", () => {
        it("Returns NFT address", async() => {
            const result = await escrow.nftAddress()
            expect(result).to.be.equal(realEstate.address)
        })
        it("Returns seller address", async() => {
            const result = await escrow.seller()
            expect(result).to.be.equal(seller.address)
        })
        it("Returns inspector address", async() => {
            const result = await escrow.inspector()
            expect(result).to.be.equal(inspector.address)
        })
        it("Returns lender address", async() => {
            const result = await escrow.lender()
            expect(result).to.be.equal(lender.address)  
     })
})


describe("Listing", () => {
    it ('updates as listed',async() => {
        const result = await escrow.isListed(1)
        expect(result).to.be.equal(true)
    })

    it("updates ownership", async() => {
        expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address)
    })

    it("Return purchase price", async() => {
        const result = await escrow.purchaseprice(1)
        expect(result).to.be.equal(tokens(10))
    })

    it("Return purchase amount", async() => {
        const result = await escrow.escrowAmount(1)
        expect(result).to.be.equal(tokens(5))
    })
    
    it("Return purchase address", async() => {
        const result = await escrow.buyer(1)
        expect(result).to.be.equal(buyer.address)
    })
   
    })

    describe('desposits', ()=>{
        it ('updates contract balance', async() =>{
            const transaction = await escrow.connect(buyer).depositEarnest(1,{
                value:tokens(5) })
                await transaction.wait ()
                const result = await escrow.getBalance()
                expect(result).to.be.equal(tokens(5))
        })
    })
})