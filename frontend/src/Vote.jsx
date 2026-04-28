import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "./contractInfo";
import { Navigate } from "react-router-dom";

function Vote({ voterToken }) {
  const [candidates, setCandidates] = useState([]);
  const [electionOpen, setElectionOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [voterAddress, setVoterAddress] = useState("");

  useEffect(() => {
    if (voterToken) {
      const decoded = JSON.parse(atob(voterToken.split(".")[1]));
      setVoterAddress(decoded.address);
      loadData();
    }
  }, [voterToken]);

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

  return (
    <section className="panel">
      <h2>{electionOpen ? "Vote Now" : "Election Results"}</h2>
      {candidates.length === 0 ? (
        <p>No candidates.</p>
      ) : (
        <ul>
          {candidates.map((candidate) => (
            <li key={candidate.id}>
              <strong>{candidate.name}</strong>
              <span>{candidate.voteCount} votes</span>
              {electionOpen && <button onClick={() => vote(candidate.id)}>Vote</button>}
            </li>
          ))}
        </ul>
      )}
      <p>{message}</p>
    </section>
  );
}

export default Vote;