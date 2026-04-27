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
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const items = await contract.getCandidates();
      setCandidates(
        items.map((item) => ({
          id: item.id.toNumber(),
          name: item.name,
          voteCount: item.voteCount.toNumber()
        }))
      );
      setElectionOpen(await contract.electionOpen());
    } catch (error) {
      setMessage("Unable to load data.");
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