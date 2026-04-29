# University Election DApp - Installation Manual

## Prerequisites

- Node.js 18+ and npm
- Git
- MetaMask browser extension
- Basic knowledge of blockchain and React

## Quick Setup

### 1. Clone and Install

```bash
git clone https://github.com/Ruji111/Blockchain-Based-student-election-DApp-.git
cd Blockchain-Based-student-election-DApp
npm install
```

### 2. Configure Environment

Create `backend/.env`:

```env
RPC_URL=http://127.0.0.1:8545
ADMIN_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
CONTRACT_ADDRESS=0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=4000
```

### 3. Start Application

```bash
npm run dev
```

This starts Hardhat node (port 8545), backend (port 4000), and frontend (port 5173).

## MetaMask Setup

1. Install MetaMask extension
2. Add Hardhat network:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Symbol: ETH
3. Import test accounts from `/keys` page using private keys

## Usage Guide

### Voter Registration
1. Visit `http://127.0.0.1:5173`
2. Click "Register"
3. Connect MetaMask wallet
4. Enter Voter ID and password
5. Click "Register"

### Login & Voting
1. Click "Login"
2. Enter credentials
3. Switch to Hardhat network in MetaMask
4. Click "Vote" next to candidate
5. Confirm transaction

### Admin Functions
1. Click "Admin"
2. Add candidates by name
3. Open/close election
4. Monitor results

## Testing

### Automated Tests
```bash
npm run test
```

### Manual Testing
- Frontend: `http://127.0.0.1:5173`
- Backend: `http://127.0.0.1:4000/api/status`
- Blockchain: `http://127.0.0.1:8545`

### API Testing
```bash
# Status check
curl http://127.0.0.1:4000/api/status

# Register voter
curl -X POST http://127.0.0.1:4000/api/register-voter \
  -H "Content-Type: application/json" \
  -d '{"voterId":"test","password":"pass","address":"0x..."}'
```


### Port Conflicts
- Frontend: Edit `frontend/vite.config.js` port
- Backend: Change PORT in `backend/.env`

### Reset Data
```bash
rm backend/voters.json
npx hardhat run scripts/deploy.js --network localhost
npm run dev
```



## File Structure

```
Blockchain-Based-student-election-DApp/
├── contracts/          # Smart contracts
├── scripts/           # Deployment scripts
├── backend/           # Express.js API server
│   ├── server.js      # Main server file
│   ├── voters.json    # Voter data storage
│   └── .env          # Environment config
├── frontend/          # React application
│   ├── src/          # Source code
│   └── vite.config.js # Build config
├── test/             # Smart contract tests
└── package.json      # Workspace config
```

## API Reference

### Endpoints

- `GET /api/status` - Election status and candidate count
- `GET /api/candidates` - List all candidates
- `GET /api/voter/:address` - Voter information
- `POST /api/register-voter` - Register new voter
- `POST /api/login` - Authenticate voter
- `POST /api/add-candidate` - Add election candidate (admin)
- `POST /api/open-election` - Start voting (admin)
- `POST /api/close-election` - End voting (admin)

### Authentication
- JWT tokens required for voting
- Admin functions use server-side private key

## Development Notes

### Contract Redeployment
For development changes to smart contracts:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### Environment Variables
- `RPC_URL`: Hardhat node URL (default: http://127.0.0.1:8545)
- `ADMIN_PRIVATE_KEY`: Private key for admin operations
- `CONTRACT_ADDRESS`: Deployed contract address
- `JWT_SECRET`: Secret for JWT token signing
- `PORT`: Backend server port (default: 4000)

### Test Accounts
Available Hardhat test accounts (accessible via `/keys` page):
- Account 0: Admin account for contract deployment
- Accounts 1-4: Test voter accounts

## Support

- **Repository**: https://github.com/Ruji111/Blockchain-Based-student-election-DApp-
- **Documentation**: See `TECHNICAL_REPORT.md`
- **Issues**: GitHub Issues for bugs/features

---

**Version**: 1.0.0 | **Date**: April 30, 2026 | **Platforms**: Windows, macOS, Linux</content>
<parameter name="filePath">INSTALLATION_MANUAL.md