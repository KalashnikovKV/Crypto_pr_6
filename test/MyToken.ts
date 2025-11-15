import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("MyToken", function () {
  it("Should deploy with correct initial supply", async function () {
    const [deployer] = await ethers.getSigners();
    const initialSupply = ethers.parseEther("1000000");

    const myToken = await ethers.deployContract("MyToken", [initialSupply]);
    await myToken.waitForDeployment();

    const deployerBalance = await myToken.balanceOf(deployer.address);
    expect(deployerBalance).to.equal(initialSupply);
  });

  it("Should have correct name and symbol", async function () {
    const initialSupply = ethers.parseEther("1000000");
    const myToken = await ethers.deployContract("MyToken", [initialSupply]);
    await myToken.waitForDeployment();

    expect(await myToken.name()).to.equal("MyToken");
    expect(await myToken.symbol()).to.equal("MTK");
  });

  it("Should have correct total supply", async function () {
    const initialSupply = ethers.parseEther("1000000");
    const myToken = await ethers.deployContract("MyToken", [initialSupply]);
    await myToken.waitForDeployment();

    const totalSupply = await myToken.totalSupply();
    expect(totalSupply).to.equal(initialSupply);
  });

  it("Should allow transfer of tokens", async function () {
    const [deployer, recipient] = await ethers.getSigners();
    const initialSupply = ethers.parseEther("1000000");
    const transferAmount = ethers.parseEther("100");

    const myToken = await ethers.deployContract("MyToken", [initialSupply]);
    await myToken.waitForDeployment();

    await myToken.transfer(recipient.address, transferAmount);

    const recipientBalance = await myToken.balanceOf(recipient.address);
    expect(recipientBalance).to.equal(transferAmount);

    const deployerBalance = await myToken.balanceOf(deployer.address);
    expect(deployerBalance).to.equal(initialSupply - transferAmount);
  });

  it("Should allow owner to mint new tokens", async function () {
    const [owner, recipient] = await ethers.getSigners();
    const initialSupply = ethers.parseEther("1000000");
    const mintAmount = ethers.parseEther("50000");

    const myToken = await ethers.deployContract("MyToken", [initialSupply]);
    await myToken.waitForDeployment();

    await myToken.mint(recipient.address, mintAmount);

    const recipientBalance = await myToken.balanceOf(recipient.address);
    expect(recipientBalance).to.equal(mintAmount);

    const totalSupply = await myToken.totalSupply();
    expect(totalSupply).to.equal(initialSupply + mintAmount);
  });

  it("Should prevent non-owner from minting tokens", async function () {
    const [owner, nonOwner] = await ethers.getSigners();
    const initialSupply = ethers.parseEther("1000000");
    const mintAmount = ethers.parseEther("50000");

    const myToken = await ethers.deployContract("MyToken", [initialSupply]);
    await myToken.waitForDeployment();

    // Попытка минтинга от не-владельца должна быть отклонена
    await expect(
      (myToken.connect(nonOwner) as any).mint(nonOwner.address, mintAmount)
    ).to.be.revertedWithCustomError(myToken, "OwnableUnauthorizedAccount");
  });

  it("Should revert when transferring more tokens than available balance", async function () {
    const [deployer, recipient] = await ethers.getSigners();
    const initialSupply = ethers.parseEther("1000000");
    const excessiveAmount = ethers.parseEther("2000000"); // Больше, чем есть на балансе

    const myToken = await ethers.deployContract("MyToken", [initialSupply]);
    await myToken.waitForDeployment();

    // Попытка перевода большего количества, чем доступно, должна быть отклонена
    await expect(
      myToken.transfer(recipient.address, excessiveAmount)
    ).to.be.revertedWithCustomError(myToken, "ERC20InsufficientBalance");
  });

  it("Should revert when transferring from account with zero balance", async function () {
    const [deployer, recipient, thirdParty] = await ethers.getSigners();
    const initialSupply = ethers.parseEther("1000000");
    const transferAmount = ethers.parseEther("100");

    const myToken = await ethers.deployContract("MyToken", [initialSupply]);
    await myToken.waitForDeployment();

    // Попытка перевода от аккаунта без токенов должна быть отклонена
    await expect(
      (myToken.connect(thirdParty) as any).transfer(recipient.address, transferAmount)
    ).to.be.revertedWithCustomError(myToken, "ERC20InsufficientBalance");
  });

  it("Should handle transfer of zero tokens", async function () {
    const [deployer, recipient] = await ethers.getSigners();
    const initialSupply = ethers.parseEther("1000000");

    const myToken = await ethers.deployContract("MyToken", [initialSupply]);
    await myToken.waitForDeployment();

    // Перевод нулевого количества должен пройти успешно
    const tx = await myToken.transfer(recipient.address, 0n);
    await tx.wait();

    const recipientBalance = await myToken.balanceOf(recipient.address);
    expect(recipientBalance).to.equal(0n);
    
    // Баланс отправителя не должен измениться
    const deployerBalance = await myToken.balanceOf(deployer.address);
    expect(deployerBalance).to.equal(initialSupply);
  });

  it("Should allow owner to mint to multiple addresses", async function () {
    const [owner, recipient1, recipient2] = await ethers.getSigners();
    const initialSupply = ethers.parseEther("1000000");
    const mintAmount1 = ethers.parseEther("10000");
    const mintAmount2 = ethers.parseEther("20000");

    const myToken = await ethers.deployContract("MyToken", [initialSupply]);
    await myToken.waitForDeployment();

    await myToken.mint(recipient1.address, mintAmount1);
    await myToken.mint(recipient2.address, mintAmount2);

    expect(await myToken.balanceOf(recipient1.address)).to.equal(mintAmount1);
    expect(await myToken.balanceOf(recipient2.address)).to.equal(mintAmount2);

    const totalSupply = await myToken.totalSupply();
    expect(totalSupply).to.equal(initialSupply + mintAmount1 + mintAmount2);
  });
});

