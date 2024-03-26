const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0263a0a364871bf955b4ca795f609902c8e51134a70bcd87d90b677a6456d86148": 100,
  "02004ff20315a8375e1922a0a1f5cb92a61bde86b212344e73002b62c2e42485bd": 50,
  "02b123040d1e31a4f7163e0acab059a69b406755f018b6700e79a06bd88aca1e96": 75,
};

/*
private key:  a6a76a42daa8a37cb542e2ba3708c241258e101204a9a84127405bfe50d34a76
public key:  0263a0a364871bf955b4ca795f609902c8e51134a70bcd87d90b677a6456d86148

private key:  9331e39433db0162d02ff87977e2ed19a1c507b817029183486ec4fb42c46f91
public key:  02004ff20315a8375e1922a0a1f5cb92a61bde86b212344e73002b62c2e42485bd

private key:  874bd8c762ec91fbc28849f7dd39f170665cf137908f04385d00c0593354f4b8
public key:  02b123040d1e31a4f7163e0acab059a69b406755f018b6700e79a06bd88aca1e96
*/

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

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
