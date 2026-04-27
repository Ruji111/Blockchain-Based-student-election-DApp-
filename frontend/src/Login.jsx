import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setVoterToken }) {
  const [voterId, setVoterId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    if (!voterId || !password) {
      setMessage("Enter voter ID and password.");
      return;
    }
    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterId, password }),
      });
      const data = await response.json();
      if (data.token) {
        setVoterToken(data.token);
        localStorage.setItem("voterToken", data.token);
        setMessage("Logged in.");
        navigate("/vote");
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="panel">
      <h2>Voter Login</h2>
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
        <button onClick={login}>Login</button>
      </div>
      <p>{message}</p>
    </section>
  );
}

export default Login;