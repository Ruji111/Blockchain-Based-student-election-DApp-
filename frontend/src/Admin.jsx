import { useState } from "react";

function Admin() {
  const [candidateName, setCandidateName] = useState("");
  const [message, setMessage] = useState("");

  const addCandidate = async () => {
    if (!candidateName) {
      setMessage("Enter candidate name.");
      return;
    }
    try {
      const response = await fetch("http://localhost:4000/api/add-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: candidateName }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Candidate added.");
        setCandidateName("");
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const openElection = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/open-election", {
        method: "POST",
      });
      const data = await response.json();
      setMessage(data.success ? "Election opened." : data.error);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const closeElection = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/close-election", {
        method: "POST",
      });
      const data = await response.json();
      setMessage(data.success ? "Election closed." : data.error);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="panel">
      <h2>Admin Panel</h2>
      <div>
        <input
          type="text"
          placeholder="Candidate Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
        />
        <button onClick={addCandidate}>Add Candidate</button>
      </div>
      <div>
        <button onClick={openElection}>Open Election</button>
        <button onClick={closeElection}>Close Election</button>
      </div>
      <p>{message}</p>
    </section>
  );
}

export default Admin;