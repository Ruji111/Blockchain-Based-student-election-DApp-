# University Election DApp

A decentralized university voting app with:
- Solidity smart contract
- Hardhat development environment
- Express backend API with authentication
- Vite + React frontend with routing

## Features

- **Admin Page**: Add candidates, open/close elections
- **Login Page**: Voter authentication with ID/password
- **Voting Page**: Cast votes or view results

## Setup

1. Install dependencies from the workspace root:
   ```bash
   npm install
   ```

2. Start a local Hardhat node:
   ```bash
   npm run node
   ```

3. Deploy the contract to the local network:
   ```bash
   npm run deploy:local
   ```

4. Copy the deployed contract address into `backend/.env` or use `backend/contractAddress.json`.
   - `backend/.env.example` is provided as a template.

5. Start the backend and frontend in separate terminals:
   ```bash
   npm run start:backend
   npm run start:frontend
   ```

## Development commands

- `npm run test` - run Hardhat contract tests
- `npm run lint` - run ESLint across the project
- `npm run format` - format files with Prettier
- `npm run dev` - run backend and frontend together

## Usage

- Visit http://localhost:5173
- Connect MetaMask wallet
- Use /admin to manage election
- Voters login at /login with ID/password
- Vote at /vote (shows results when election closed)
