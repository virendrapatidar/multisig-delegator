"use strict";
const ethers = require("ethers");
const fetch = require("node-fetch");
const LedgerSigner = require("@anders-t/ethers-ledger").LedgerSigner;
const provider = new ethers.providers.JsonRpcProvider(process.env.NODE_URL);
const path = "m/44'/60'/1'/0/0"; // using account 1 from ledger as ledger account 1 is safe owner in my case.
const signer = new LedgerSigner(provider, path);

const multisigSafe = "0xB6F812c919c514f961118b968DcEEC6E2873Bf9d";
const delegate = "0x21a860526Ebff4DB5d70CaFf8C83c30fb2284f05";

// prepare message hash
const totp = (Date.now() / 1000 / 3600).toFixed(0);
console.log("totp " + totp);
console.log("delegate+totp", delegate + totp);
const msgHash = ethers.utils.keccak256(delegate + totp);

// got msgHash it using `python3 hash.py 0x21a860526Ebff4DB5d70CaFf8C83c30fb2284f05`
// const msgHash = "0b920a188db5d7f4c96cb673bcb4ecc9bce3e3993f0842f58534b3389d1f8ba7"

console.log("msgHash " + msgHash);

async function createDelegate() {
  const delegator = await signer.getAddress();
  console.log("signer " + delegator);
  const delegatesUrl =
    "https://safe-transaction.goerli.gnosis.io/api/v1/delegates/";
  const signature = await signer.signMessage(msgHash);
  console.log("signature " + signature);
  const data = {
    safe: multisigSafe,
    delegate: delegate,
    delegator: delegator,
    // refer https://github.com/gnosis/safe-contracts/blob/main/src/utils/execution.ts#L97
    signature: signature.replace(/1b$/, "1f").replace(/1c$/, "20"), // Tried signature: signature as well
    label: "Vesper delegator",
  };
  console.log({ data });

  // send request to add delegator
  const response = await fetch(delegatesUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  response.json().then((data) => {
    console.log(data);
  });
}

createDelegate();
