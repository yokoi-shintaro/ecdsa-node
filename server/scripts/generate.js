const secp = require("ethereum-cryptography/secp256k1");
const ethers = require('ethers');

const wallet = ethers.Wallet.createRandom();
const privateKey = wallet.privateKey;
const publicKey = wallet.publicKey;
const address = wallet.address;

// 生成された情報を表示します。
console.log(`Private Key: ${privateKey}`);
console.log(`Public Key: ${publicKey}`);
console.log(`Address: ${address}`);