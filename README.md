<p align="center">
  <img src="assets/icon.png" width=250><br><br>
  <img src="https://img.shields.io/badge/framework-react_native-1f87a3?style=for-the-badge&logo=react" style="margin-right:5px">
  <img src="https://img.shields.io/badge/cryptosystem-rsa-1f87a3?style=for-the-badge">
</p>

# Vaccert
Vaccert is a cryptography-based vaccine certification app, built with React Native. It works in exactly the same way as the [EU Digital COVID Certificate](https://ec.europa.eu/info/live-work-travel-eu/coronavirus-response/safe-covid-19-vaccines-europeans/eu-digital-covid-certificate_en) and the [NHS COVID Pass](https://www.nhs.uk/conditions/coronavirus-covid-19/covid-pass/), but is faster, has a more modern and accessible UI, provides verification capabilities in the same app, and is completely open-source. The one Vaccert app can be used by citizens to prove their vaccination status and verify those of others, as well as by NHS staff to issue and sign vaccination certificates.

## Overview
When a person is vaccinated, a member of NHS staff will open the Vaccert app and create a new certificate. The person's name, date of birth, and NHS number will be entered, along with details of the vaccination. The certificate will then be signed using a private key stored only on the member of staff's device, and a QR code will be generated for the person to scan, importing the certificate onto their device where it will be saved.

If the person is later asked for proof of vaccination, for example when travelling abroad, they will open the Vaccert app and show their QR code. The person requesting proof will also open the Vaccert app and press the "Verify a Vaccert" button. When they scan the person's QR code, their device will retrieve the corresponding public key from the online database, and use this to verify the certificate's signature. If this process is successful, the Vaccert app will show that the certificate is valid.

## Running Locally
To run Vaccert locally, as well as cloning the repository and installing dependencies, you'll need to create a new Firebase project and put the credentials into a `.env` file with the variable names as specified in [`keystore.ts`](https://github.com/w-henderson/Vaccert/blob/master/src/crypto/keystore.ts). Realtime Database must be enabled, and you'll need to store public keys in it with the following structure (the key newlines may optionally be replaced with spaces):

```json
{
  "keys": {
    "<key id>": {
      "name": "Key holder name",
      "key": "-----BEGIN PUBLIC KEY----- abcdef..."
    }
  }
}
```

Please see the note about Firebase Realtime Database below for more information about its use.

## Tech Stack
- [React Native](https://reactnative.dev/) framework
  - [Expo](https://expo.dev/) toolchain
  - [JSEncrypt](https://github.com/travist/jsencrypt) RSA implementation
  - [CryptoJS](https://github.com/brix/crypto-js) SHA-256 implementation
- [Firebase](https://firebase.google.com/)
  - [Realtime Database](https://firebase.google.com/products/realtime-database) to store public keys for verification. **Note:** This would be inappropriate and costly to use in production so it could be easily be swapped out in the [`keystore.ts`](https://github.com/w-henderson/Vaccert/blob/master/src/crypto/keystore.ts) file for an alternative service.

## Disclaimer
Vaccert is in no way endorsed by the NHS, Department of Health and Social Care, or any other body. The NHS logo and name are trade marks owned by the Secretary of State for Health and Social Care and are reproduced here to show what Vaccert would look like in production use by the NHS. The logo was obtained from the MIT-licensed [`nhsuk/nhsuk-frontend`](https://github.com/nhsuk/nhsuk-frontend/blob/1f95b401b1d6d86fbe4b4d81835d08180760c365/packages/components/header/template.njk) repository as an SVG and was then modified and converted to a PNG in compliance with the license. Copyright for source repository: *Copyright (c) 2019 NHS Digital*.