## pip install eth_account
## python3 hash.py 

import time
import sys
from eth_utils import keccak

DELEGATE_ADDRESS = sys.argv[1]
totp = int(time.time()) // 3600
deledate_hash_to_sign = keccak(text=DELEGATE_ADDRESS + str(totp))

print("deledate_hash_to_sign: " + deledate_hash_to_sign.hex())
