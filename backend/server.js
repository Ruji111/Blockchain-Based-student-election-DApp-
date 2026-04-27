const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

console.log("CONTRACT_ADDRESS from env:", process.env.CONTRACT_ADDRESS);

const app = express();
app.use(cors());
app.use(express.json());

const jwtSecret = process.env.JWT_SECRET || "your-secret-key"; // Change in production

// In-memory voter storage: voterId -> { passwordHash, address }
const voters = new Map();

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
    console.log("contractAddress:", contractAddress);
    const contract = getContract();
    const electionOpen = await contract.electionOpen();
    const candidateCount = await contract.getCandidateCount();
    console.log("electionOpen:", electionOpen, typeof electionOpen);
    console.log("candidateCount:", candidateCount, typeof candidateCount);
    res.json({ contractAddress, electionOpen, candidateCount: Number(candidateCount) });
  } catch (error) {
    console.error("Error in /api/status:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/candidates", async (req, res) => {
  try {
    const contract = getContract();
    const candidates = await contract.getCandidates();
    res.json(candidates.map((candidate) => ({ id: Number(candidate.id), name: candidate.name, voteCount: Number(candidate.voteCount) })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/voter/:address", async (req, res) => {
  try {
    const contract = getContract();
    const voter = await contract.getVoter(req.params.address);
    res.json({ registered: voter.registered, voted: voter.voted, vote: Number(voter.vote) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/register-voter", async (req, res) => {
  try {
    const { voterId, password, address } = req.body;
    if (!voterId || !password || !address) {
      return res.status(400).json({ error: "Missing voterId, password, or address" });
    }
    if (voters.has(voterId)) {
      return res.status(400).json({ error: "Voter ID already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    voters.set(voterId, { passwordHash, address });

    // Register on blockchain if admin signer available
    if (adminSigner) {
      const contract = getContract(adminSigner);
      const tx = await contract.registerVoter(address);
      await tx.wait();
    }

    res.json({ success: true, voterId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { voterId, password } = req.body;
    if (!voterId || !password) {
      return res.status(400).json({ error: "Missing voterId or password" });
    }
    const voter = voters.get(voterId);
    if (!voter || !(await bcrypt.compare(password, voter.passwordHash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ voterId, address: voter.address }, jwtSecret, { expiresIn: "1h" });
    res.json({ token, address: voter.address });
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

app.post("/api/open-election", async (req, res) => {
  try {
    if (!adminSigner) {
      throw new Error("ADMIN_PRIVATE_KEY is required for write operations.");
    }
    const contract = getContract(adminSigner);
    const tx = await contract.openElection();
    await tx.wait();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/close-election", async (req, res) => {
  try {
    if (!adminSigner) {
      throw new Error("ADMIN_PRIVATE_KEY is required for write operations.");
    }
    const contract = getContract(adminSigner);
    const tx = await contract.closeElection();
    await tx.wait();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
