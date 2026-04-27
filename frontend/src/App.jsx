import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "./contractInfo";

function App() {
  const [account, setAccount] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      loadCandidates();
    }
  }, []);

  async function connectWallet() {
    if (!window.ethereum) {
      setMessage("MetaMask is required for voting.");
      return;
    }

    try {
      const [selectedAccount] = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(selectedAccount);
      setConnected(true);
      setMessage("Wallet connected.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function loadCandidates() {
    if (!window.ethereum) {
      return;
    }

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
    } catch (error) {
      setMessage("Unable to load candidates. Make sure the contract is deployed.");
    }
  }

  async function vote(candidateId) {
    if (!connected) {
      setMessage("Please connect your wallet first.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.vote(candidateId);
      setMessage("Sending vote transaction...");
      await tx.wait();
      setMessage("Vote recorded successfully.");
      loadCandidates();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="app-shell">
      <header>
        <h1>University Election DApp</h1>
        <button onClick={connectWallet} className="connect-button">
          {connected ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
        </button>
      </header>

      <section className="panel">
        <h2>Candidates</h2>
        {candidates.length === 0 ? (
          <p>No candidates found. Deploy the contract and add candidates.</p>
        ) : (
          <ul>
            {candidates.map((candidate) => (
              <li key={candidate.id}>
                <strong>{candidate.name}</strong>
                <span>{candidate.voteCount} votes</span>
                <button onClick={() => vote(candidate.id)}>Vote</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer>
        <p>{message}</p>
        <p>
          Contract address: <code>{contractAddress}</code>
        </p>
      </footer>
    </div>
  );
}

export default App;
