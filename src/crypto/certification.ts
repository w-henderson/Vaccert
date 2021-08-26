import Keystore from "./keystore";
import { ClientData, StaffData, Vaccert } from "../types";

export function certify(data: ClientData, staff: StaffData): Vaccert {
  let dataString = JSON.stringify(data);
  let signature = staff.privateKey.sign(dataString);

  return {
    data,
    signatureId: staff.id,
    signature
  }
}

export function verify(cert: Vaccert): Promise<boolean> {
  let dataString = JSON.stringify(cert.data);
  let keystore = new Keystore();

  return keystore.getKey(cert.signatureId).then(key => {
    return key.verify(dataString, cert.signature);
  }).catch(_ => {
    return false;
  });
}