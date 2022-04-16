"use strict";
const ethers = require("ethers");
const fetch = require("node-fetch");

// Change below values.
const TX_SERVICE_BASE_URL = "https://safe-transaction.goerli.gnosis.io/api/v1/delegates/";  // Goerli testnet
let OWNER_PRIVATE_KEY = "...."
const SAFE_ADDRESS = "0xB6F812c919c514f961118b968DcEEC6E2873Bf9d";
const DELEGATE_ADDRESS = "0x76E111C8b6d2dCa50755B6e30cCDFE00b39d7a3B";

let signer = new ethers.Wallet(OWNER_PRIVATE_KEY);

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
    label: "Vesper delegator ethers",
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
