const { ethers } = require("hardhat");

async function main() {
  const Election = await ethers.getContractFactory("UniversityElection");
  const election = await Election.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
  console.log("Election open:", await election.electionOpen());
  console.log("Candidate count:", await election.getCandidateCount());
}

main().catch(console.error);