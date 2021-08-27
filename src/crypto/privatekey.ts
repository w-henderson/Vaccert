import JSEncrypt from "jsencrypt";
import CryptoJS from "crypto-js";

class PrivateKey {
  key: string;

  constructor(key: string) {
    this.key = key;
  }

  sign(value: string): string {
    let encrypt = new JSEncrypt();
    encrypt.setPrivateKey(this.key);

    return encrypt.sign(value, (str: string) => CryptoJS.SHA256(str).toString(), "sha256") || "";
  }
}

export default PrivateKey;