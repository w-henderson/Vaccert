import PrivateKey from "./crypto/privatekey";

interface Vaccert {
  data: ClientData,
  signatureId: string,
  signature: string
}

interface ClientData {
  name: string,
  nhsNumber: string,
  dateOfBirth: number,
  expiryDate?: number,
  vaccinations: Vaccination[]
}

interface Vaccination {
  date: number,
  vaccine: string,
  batch: string
}

interface StaffData {
  name: string,
  id: string,
  key: PrivateKey
}