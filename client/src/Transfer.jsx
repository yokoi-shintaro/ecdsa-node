import { useState } from "react";
import server from "./server";
import { ethers } from 'ethers';

function Transfer({ address, setBalance, privateKey}) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

//    console.log('transfer');
    try {
      const wallet = new ethers.Wallet(privateKey);
      const message = `send ${sendAmount} to ${recipient} from ${address}`;
      const signature = await wallet.signMessage(message);
      const signerAddress = ethers.utils.verifyMessage(message, signature);

//      console.log('message', message);
//      console.log('signature', signature);
//      console.log('address', address);

//      console.log('signerAddress', signerAddress);
//      console.log('wallet.address', wallet.address);

      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        signature: signature,
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert("Error during transfer: " + (ex.response?.data?.message || ex.message));
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
