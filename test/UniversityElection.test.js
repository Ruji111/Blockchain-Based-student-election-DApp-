const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UniversityElection", function () {
  let election;
  let owner;
  let voter;

  beforeEach(async function () {
    [owner, voter] = await ethers.getSigners();
    const Election = await ethers.getContractFactory("UniversityElection");
    election = await Election.deploy();
    await election.waitForDeployment();
  });

  it("lets owner add a candidate and register a voter", async function () {
    await election.addCandidate("Alice");
    expect(await election.getCandidateCount()).to.equal(1);

    const candidate = (await election.getCandidates())[0];
    expect(candidate.name).to.equal("Alice");

    await election.registerVoter(voter.address);
    const voterData = await election.getVoter(voter.address);
    expect(voterData.registered).to.be.true;
  });

  it("lets registered voters vote when election is open", async function () {
    await election.addCandidate("Alice");
    await election.registerVoter(voter.address);
    await election.openElection();

    await election.connect(voter).vote(0);
    const candidate = (await election.getCandidates())[0];
    expect(candidate.voteCount).to.equal(1);

    const voterData = await election.getVoter(voter.address);
    expect(voterData.voted).to.be.true;
  });

  it("prevents voting before the election opens", async function () {
    await election.addCandidate("Alice");
    await election.registerVoter(voter.address);
    await expect(election.connect(voter).vote(0)).to.be.revertedWith("Election closed");
  });
});
