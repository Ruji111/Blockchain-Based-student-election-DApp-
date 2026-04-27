const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:8545";
const provider = new ethers.JsonRpcProvider(rpcUrl);
const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY || "";
const adminSigner = adminPrivateKey ? new ethers.Wallet(adminPrivateKey, provider) : null;

let contractAddress = process.env.CONTRACT_ADDRESS || "";
const contractPath = path.resolve(__dirname, "contractAddress.json");
if (!contractAddress && fs.existsSync(contractPath)) {
  const config = JSON.parse(fs.readFileSync(contractPath, "utf8"));
  contractAddress = config.address || contractAddress;
}

const artifactPath = path.resolve(__dirname, "..", "artifacts", "contracts", "UniversityElection.sol", "UniversityElection.json");
let contractAbi = [];
if (fs.existsSync(artifactPath)) {
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  contractAbi = artifact.abi;
}

function getContract(signerOrProvider) {
  if (!contractAddress || contractAddress.startsWith("0x000")) {
    throw new Error("Contract address not set. Update backend/contractAddress.json or .env.");
  }
  return new ethers.Contract(contractAddress, contractAbi, signerOrProvider || provider);
}

app.get("/api/status", async (req, res) => {
  try {
    const contract = getContract();
    const electionOpen = await contract.electionOpen();
    const candidateCount = await contract.getCandidateCount();
    res.json({ contractAddress, electionOpen, candidateCount: candidateCount.toNumber() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/candidates", async (req, res) => {
  try {
    const contract = getContract();
    const candidates = await contract.getCandidates();
    res.json(candidates.map((candidate) => ({ id: candidate.id.toNumber(), name: candidate.name, voteCount: candidate.voteCount.toNumber() })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/voter/:address", async (req, res) => {
  try {
    const contract = getContract();
    const voter = await contract.getVoter(req.params.address);
    res.json({ registered: voter.registered, voted: voter.voted, vote: voter.vote.toNumber() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/register-voter", async (req, res) => {
  try {
    if (!adminSigner) {
      throw new Error("ADMIN_PRIVATE_KEY is required for write operations.");
    }
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ error: "Missing address" });
    }
    const contract = getContract(adminSigner);
    const tx = await contract.registerVoter(address);
    await tx.wait();
    res.json({ success: true, address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/add-candidate", async (req, res) => {
  try {
    if (!adminSigner) {
      throw new Error("ADMIN_PRIVATE_KEY is required for write operations.");
    }
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Missing candidate name" });
    }
    const contract = getContract(adminSigner);
    const tx = await contract.addCandidate(name);
    await tx.wait();
    res.json({ success: true, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
