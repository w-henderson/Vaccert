import JSEncrypt from "jsencrypt";
import CryptoJS from "crypto-js";

class PublicKey {
  key: string;
  name: string;

  constructor(key: string, name: string) {
    this.key = key;
    this.name = name;
  }

  verify(value: string, signature: string): boolean {
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(this.key);

    return encrypt.verify(value, signature, (str: string) => CryptoJS.SHA256(str).toString());
  }
}

export default PublicKey;