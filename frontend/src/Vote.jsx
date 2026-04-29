import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "./contractInfo";
import { Navigate } from "react-router-dom";

function Vote({ voterToken, walletAddress, chainId }) {
  const [candidates, setCandidates] = useState([]);
  const [electionOpen, setElectionOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [voterAddress, setVoterAddress] = useState("");
  const [mismatchWarning, setMismatchWarning] = useState("");

  useEffect(() => {
    if (voterToken) {
      const decoded = JSON.parse(atob(voterToken.split(".")[1]));
      setVoterAddress(decoded.address);
      loadData();
    }
  }, [voterToken]);

  useEffect(() => {
    if (chainId && chainId !== "31337") {
      setMismatchWarning("MetaMask is not connected to the Hardhat local network. Switch MetaMask to the Hardhat local network (chain id 31337).");
      return;
    }

    if (voterAddress && walletAddress) {
      if (voterAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        setMismatchWarning("MetaMask account does not match the registered voter address. Switch MetaMask to the correct private key account.");
      } else {
        setMismatchWarning("");
      }
    } else if (!walletAddress) {
      setMismatchWarning("MetaMask is not connected. Connect to the account that matches your registered voter address.");
    }
  }, [chainId, walletAddress, voterAddress]);

  const loadData = async () => {
    try {
      const statusResponse = await fetch("http://localhost:4000/api/status");
      const statusData = await statusResponse.json();
      if (statusData.error) {
        throw new Error(statusData.error);
      }
      setElectionOpen(statusData.electionOpen);

      const candidateResponse = await fetch("http://localhost:4000/api/candidates");
      const candidateData = await candidateResponse.json();
      if (candidateData.error) {
        throw new Error(candidateData.error);
      }
      setCandidates(candidateData);
      setMessage("");
    } catch (error) {
      setMessage(error.message || "Unable to load data.");
    }
  };

  const vote = async (candidateId) => {
    if (!window.ethereum) {
      setMessage("MetaMask required.");
      return;
    }
    if (mismatchWarning) {
      setMessage("Please switch MetaMask to the correct voter account before voting.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.vote(candidateId);
      setMessage("Voting...");
      await tx.wait();
      setMessage("Vote recorded.");
      loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (!voterToken) {
    return <Navigate to="/login" />;
  }

  const canVote = electionOpen && walletAddress && voterAddress && !mismatchWarning;

  return (
    <section className="panel">
      <h2>{electionOpen ? "Vote Now" : "Election Results"}</h2>
      <p>Registered voter address: <code>{voterAddress || "Not set"}</code></p>
      <p>MetaMask account: <code>{walletAddress || "Not connected"}</code></p>
      <p>Network: <code>{chainId ? (chainId === "31337" ? "Hardhat Local (31337)" : chainId) : "Not connected"}</code></p>
      {mismatchWarning && <p className="warning">{mismatchWarning}</p>}
      {candidates.length === 0 ? (
        <p>No candidates.</p>
      ) : (
        <ul>
          {candidates.map((candidate) => (
            <li key={candidate.id}>
              <strong>{candidate.name}</strong>
              <span>{candidate.voteCount} votes</span>
              {electionOpen ? (
                <button onClick={() => vote(candidate.id)} disabled={!canVote}>
                  Vote
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      {!electionOpen && <p>The election is currently closed.</p>}
      <p>{message}</p>
    </section>
  );
}

export default Vote;