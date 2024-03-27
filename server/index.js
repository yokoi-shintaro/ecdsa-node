const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { ethers } = require("ethers");

app.use(cors());
app.use(express.json());

const balances = {
  "0x029dB58A99129425c0b31a4B518F074B1fA4797f": 100,
  "0x7f7B0E8a539A9589B60A1D4C44F4F3155410C215": 50,
  "0xC3dFFAd46c40233FeF5bC6632b0aA872bcaf925F": 75,
};

/*
Private Key: 0x665fae37d272810c729d10617fc29a104ba995607f44373f7538842eb336e2d4
Public Key: 0x04589d6c121c2eba5e414bfb3b83e47c513a4de63f440a3d9e98575faa279f065e92619ff433b6b7d53799eb2a8fcd39042b0a6a4a6aebf35170a48d496460cf52
Address: 0x029dB58A99129425c0b31a4B518F074B1fA4797f

Private Key: 0x043377a1e4845c4bcbf9fa96635e14ab97d14d4f132decd606e4832aab69bb8a
Public Key: 0x04c4836b2bb1b2ec434a92f5d36f7ea6c3abf8dd93107f67d0603f573d8c0ab8c91ee636beb1b1cceb59997435ca620c6e8829220950344855717857078257e9e7
Address: 0x7f7B0E8a539A9589B60A1D4C44F4F3155410C215

Private Key: 0xb3fa40a27b733617a8f415a67dbefe785365c0f068047691777148e10c030b39
Public Key: 0x044f5b65e74d5919c9f9b972ee0dabf0c7297f0c066038e5ae6c156b05e6aeae14526be4b250bde73c1a60fdfa66085dbd3539a61b764614f0e3ed957efe8e3dc9
Address: 0xC3dFFAd46c40233FeF5bC6632b0aA872bcaf925F

*/

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
//  console.log('balance/address', address);
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const message = `send ${amount} to ${recipient} from ${sender}`;

  //console.log('server message', message);
  //console.log('server signature', signature);
  // recover the public address from the signature
  const signerAddress = ethers.utils.verifyMessage(message, signature);

  //console.log('signerAddress', signerAddress);
  //console.log('sender', sender);

  if (signerAddress.toLowerCase() !== sender.toLowerCase()) {
    return res.status(403).send({ message: "Signature verification failed." });
  }

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

