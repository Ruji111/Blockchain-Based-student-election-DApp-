// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract UniversityElection {
    address public owner;
    bool public electionOpen;

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    struct Voter {
        bool registered;
        bool voted;
        uint256 vote;
    }

    Candidate[] public candidates;
    mapping(address => Voter) public voters;

    event CandidateAdded(uint256 indexed candidateId, string name);
    event VoterRegistered(address indexed voter);
    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event ElectionOpened();
    event ElectionClosed();

    modifier onlyOwner() {
        require(msg.sender == owner, "Owner only");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addCandidate(string calldata name) external onlyOwner {
        candidates.push(Candidate({id: candidates.length, name: name, voteCount: 0}));
        emit CandidateAdded(candidates.length - 1, name);
    }

    function registerVoter(address voter) external onlyOwner {
        require(!voters[voter].registered, "Already registered");
        voters[voter] = Voter({registered: true, voted: false, vote: 0});
        emit VoterRegistered(voter);
    }

    function openElection() external onlyOwner {
        electionOpen = true;
        emit ElectionOpened();
    }

    function closeElection() external onlyOwner {
        electionOpen = false;
        emit ElectionClosed();
    }

    function vote(uint256 candidateId) external {
        require(electionOpen, "Election closed");
        require(voters[msg.sender].registered, "Not registered");
        require(!voters[msg.sender].voted, "Already voted");
        require(candidateId < candidates.length, "Invalid candidate");

        voters[msg.sender].voted = true;
        voters[msg.sender].vote = candidateId;
        candidates[candidateId].voteCount += 1;

        emit VoteCast(msg.sender, candidateId);
    }

    function getCandidateCount() external view returns (uint256) {
        return candidates.length;
    }

    function getCandidates() external view returns (Candidate[] memory) {
        return candidates;
    }

    function getVoter(address account) external view returns (Voter memory) {
        return voters[account];
    }
}
