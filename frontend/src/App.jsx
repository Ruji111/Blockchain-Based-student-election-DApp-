import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Admin from "./Admin";
import Keys from "./Keys";
import Login from "./Login";
import Register from "./Register";
import Vote from "./Vote";

function App() {
  const [account, setAccount] = useState("");
  const [connected, setConnected] = useState(false);
  const [voterToken, setVoterToken] = useState(localStorage.getItem("voterToken") || "");

  useEffect(() => {
    if (window.ethereum) {
      checkConnection();
    }
  }, []);

  const checkConnection = async () => {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setConnected(true);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is required.");
      return;
    }
    try {
      const [selectedAccount] = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(selectedAccount);
      setConnected(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const logout = () => {
    setVoterToken("");
    localStorage.removeItem("voterToken");
  };

  const disconnectWallet = () => {
    setAccount("");
    setConnected(false);
  };

  return (
    <div className="app-shell">
      <header>
        <h1>University Election DApp</h1>
        <nav>
          <Link to="/register">Register</Link> | <Link to="/login">Login</Link> | <Link to="/vote">Vote</Link> | <Link to="/admin">Admin</Link> | <Link to="/keys">Keys</Link>
        </nav>
        {connected ? (
          <button onClick={disconnectWallet} className="connect-button">
            Disconnect Wallet
          </button>
        ) : (
          <button onClick={connectWallet} className="connect-button">
            Connect Wallet
          </button>
        )}
        {voterToken && <button onClick={logout}>Logout</button>}
      </header>

      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setVoterToken={setVoterToken} />} />
        <Route path="/vote" element={<Vote voterToken={voterToken} />} />
        <Route path="/keys" element={<Keys />} />
        <Route path="/" element={<Navigate to="/register" />} />
      </Routes>
    </div>
  );
}

export default App;
