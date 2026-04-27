# University Election DApp

A starter scaffold for a decentralized university voting app with:
- Solidity smart contract
- Hardhat development environment
- Express backend API
- Vite + React frontend
- Basic code quality scripts and tests

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

## Notes

- The frontend is configured to use MetaMask for vote transactions.
- The backend includes read endpoints plus admin actions for candidate and voter registration.
- Update `frontend/src/contractInfo.js` with the deployed contract address after deployment.
