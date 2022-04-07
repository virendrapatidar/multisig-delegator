### Steps

### Run below commands

1. `pip3 install eth_account flask`
2. `python3 hash.py <<delegate address>>`  // This will print delegate hash on console. This hash will be signed later using Metamask.
3. `python3 main.py`
4. Connect Metamask with address which is owner for multisig.
5. Open URL http://localhost:8011
6. Enter delegate address and delegate hash on step 2 and press enter.
7. Open below URL and see if new delegate is added

- Testnet : https://safe-transaction.goerli.gnosis.io/api/v1/safes/0xB6F812c919c514f961118b968DcEEC6E2873Bf9d/delegates/

