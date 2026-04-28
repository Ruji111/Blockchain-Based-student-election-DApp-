function Keys() {
  const accounts = [
    {
      address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    },
    {
      address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
    },
    {
      address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      privateKey: "0x5de4111afa1a4b94908f83103eb7f1706367c2e68ca870fc3fb9a804cdab365a"
    },
    {
      address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      privateKey: "0x7c852118294e51e653712a81e05800f4191417518f605c371e15141b007a6"
    },
    {
      address: "0x15d34AAf54267D7d7c367839AAf71A00a2C6A65",
      privateKey: "0x47e179ec197488593b187f80a00eb0da91f9d0b13f8733639f19c30a34926a"
    },
    {
      address: "0x9965507D1a55bcC269C58ba16FB37d819B0A4ec",
      privateKey: "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318c3f29e8c94ef6d1b073b5d"
    },
    {
      address: "0x976EA74026E726554dB657fA54763abd0C3A0a2",
      privateKey: "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0e832b4ec1564e"
    },
    {
      address: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
      privateKey: "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24e4f61e8f3a84f44cd13d9"
    },
    {
      address: "0x23618e81E3f5cdF7f54C3d65f7FB37d819B0A4ec",
      privateKey: "0xdbda182b8a1b4b51d54a8bba5f9d5dc1d1bdbeb4acc7b15c85d0b4bf11648f61"
    },
    {
      address: "0xa0Ee7A142d267C1f36714E4a8f75612F20A79720",
      privateKey: "0x2a871d079397bfa93dc9fceafc49c0fafc5c0b90fdccadaf6565483f4ca3be87"
    }
  ];

  return (
    <section className="panel">
      <h2>Test Account Private Keys</h2>
      <p>Use these Hardhat test account private keys to import into MetaMask for voting tests.</p>
      <ul>
        {accounts.map((account) => (
          <li key={account.address}>
            <strong>{account.address}</strong>
            <br />
            <code>{account.privateKey}</code>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Keys;
