"use strict";
const ethers = require("ethers");
const fetch = require("node-fetch");
const LedgerSigner = require("@anders-t/ethers-ledger").LedgerSigner;

// Change below values
const TX_SERVICE_BASE_URL = "https://safe-transaction.mainnet.gnosis.io/api/v1/delegates/";  // mainnet
const path = "m/44'/60'/2'/0/0"; // using account 2 from ledger as ledger account 2 is safe owner in my case.
const SAFE_ADDRESS = "0x4e3C45d6ADe7c524396D16A61921036ce25ffD50";
const DELEGATE_ADDRESS = "0x76d266DFD3754f090488ae12F6Bd115cD7E77eBD";

const provider = new ethers.providers.JsonRpcProvider();
const signer = new LedgerSigner(provider, path);

// prepare message hash
const totp = (Date.now() / 1000 / 3600).toFixed(0);
let msgHash = ethers.utils.solidityKeccak256([ "string" ], [ DELEGATE_ADDRESS + totp ]);
let messageHashBinary = ethers.utils.arrayify(msgHash);

async function createDelegate() {
  const owner = await signer.getAddress();
  let signature = await signer.signMessage(messageHashBinary);
  const data = {
    safe: SAFE_ADDRESS,
    delegate: DELEGATE_ADDRESS,
    delegator: owner,
    // refer https://github.com/gnosis/safe-contracts/blob/main/src/utils/execution.ts#L97
    signature: signature.replace(/1b$/, "1f").replace(/1c$/, "20"),
    label: "Vesper delegator ledger",
  };
  console.log({ data });

  // send request to add delegator
  const response = await fetch(TX_SERVICE_BASE_URL, {
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
