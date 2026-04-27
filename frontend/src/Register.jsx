import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [voterId, setVoterId] = useState("");
  const [password, setPassword] = useState("");
  const [account, setAccount] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (!window.ethereum) {
      setMessage("MetaMask is required.");
      return;
    }
    try {
      const [selectedAccount] = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(selectedAccount);
      setMessage("Wallet connected.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const register = async () => {
    if (!voterId || !password || !account) {
      setMessage("Enter all fields and connect wallet.");
      return;
    }
    try {
      const response = await fetch("http://localhost:4000/api/register-voter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterId, password, address: account }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Registered successfully. You can now login.");
        navigate("/login");
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="panel">
      <h2>Voter Registration</h2>
      <div>
        <input
          type="text"
          placeholder="Voter ID"
          value={voterId}
          onChange={(e) => setVoterId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={connectWallet}>
          {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect MetaMask"}
        </button>
        <button onClick={register}>Register</button>
      </div>
      <p>{message}</p>
    </section>
  );
}

export default Register;