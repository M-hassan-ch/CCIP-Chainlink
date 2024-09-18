import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Lock", function () {
  const { ethers } = hre;
  it("Should revert with the right error if called too soon", async function () {
    const [alice] = await ethers.getSigners();
    const localSimulatorFactory = await ethers.getContractFactory("CCIPLocalSimulator");
    const CrossChainNameServiceRegisterFactory = await ethers.getContractFactory("CrossChainNameServiceRegister");
    const CrossChainNameServiceReceiverFactory = await ethers.getContractFactory("CrossChainNameServiceReceiver");
    const CrossChainNameServiceLookupFactory = await ethers.getContractFactory("CrossChainNameServiceLookup");

    const localSimulator = await localSimulatorFactory.deploy();
    const crossChainNameServiceLookup = await CrossChainNameServiceLookupFactory.deploy();

    const {
      chainSelector_,
      sourceRouter_,
      destinationRouter_
      // wrappedNative_: string;
      // linkToken_: string;
      // ccipBnM_: string;
      // ccipLnM_: string;
    } = await localSimulator.configuration();

    const crossChainNameServiceRegister = await CrossChainNameServiceRegisterFactory.deploy(
      sourceRouter_,
      await crossChainNameServiceLookup.getAddress(),
    );
    console.log(chainSelector_.toString());

    const crossChainNameServiceReceiver = await CrossChainNameServiceReceiverFactory.deploy(
      sourceRouter_,
      await crossChainNameServiceLookup.getAddress(),
      chainSelector_.toString()
    );

    await crossChainNameServiceRegister.enableChain(
      chainSelector_.toString(),
      await crossChainNameServiceReceiver.getAddress(),
      200000
    )

    // await crossChainNameServiceReceiver.

    await crossChainNameServiceLookup.setCrossChainNameServiceAddress(
      await crossChainNameServiceReceiver.getAddress(),
    )
    await crossChainNameServiceLookup.setCrossChainNameServiceAddress(
      await crossChainNameServiceRegister.getAddress(),
    )

    // await crossChainNameServiceLookup.register(
    //   'alice.ccns',
    //   alice.address
    // )

    await crossChainNameServiceRegister.register('alice.ccns');
    // expect(await crossChainNameServiceLookup.lookup('alice.ccns')).to.be.equal(alice.address);
    // console.log({ config })
  });
});
