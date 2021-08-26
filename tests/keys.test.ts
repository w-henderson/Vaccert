import PublicKey from "../src/crypto/publickey";
import PrivateKey from "../src/crypto/privatekey";

test("signs and verifies arbitrary string", () => {
  const DUMMY_PUBLIC_KEY = "-----BEGIN PUBLIC KEY----- MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDUh6Aea3D9oWavYhKK6ms6f0R4 g2zL+53ZylF8Gb6IRdwxbLvNrdJiMoPnhdX5d5V1d9YdaJNcXMpYCYjntOq1mGSL u+4fJ8lJvAcYbszcv4U08s35vNqcMV/WGSpXfeCFh6WxirwDH08W4havXFLk+PtC ZZEqoNO5GmacPV330wIDAQAB -----END PUBLIC KEY-----";
  const DUMMY_PRIVATE_KEY = "-----BEGIN RSA PRIVATE KEY----- MIICXQIBAAKBgQDUh6Aea3D9oWavYhKK6ms6f0R4g2zL+53ZylF8Gb6IRdwxbLvN rdJiMoPnhdX5d5V1d9YdaJNcXMpYCYjntOq1mGSLu+4fJ8lJvAcYbszcv4U08s35 vNqcMV/WGSpXfeCFh6WxirwDH08W4havXFLk+PtCZZEqoNO5GmacPV330wIDAQAB AoGAHqozADCgbPgMyOFtq32HWzlht8G+wO/dJr96Yl2UkDUEQF1f+51I7cI8Jfu5 k/UdK4XO7w9Xs8vvpiQ6DLSd6LJ0Lu8JhA8PbRiZwb4YvbqSiTEmYvwc4Jg0ZPpo WWz7L9tt9LEaMsx0m6k3wQbfLhylVGhTU8spC8D/z2DKR4ECQQDq9WvcR8XCyCkM rdPlavW86UUYISI43gaJoRHbtLU0F5wg18YHk5xIqZwKn7tlNZUfcfufc90/S28T lfOTUl4vAkEA55AB5esjczRYWIfE+UnCGf4pzGRkOetY3+vkU5+MDXM7FylQdw8s LmDR920lYhm2MIJRO7nHkv+nwFRUnTjbnQJBALxPGDRC/be/zk6QHqzXTb4rQyo0 nAXxxFGX2wU4TqZCaepUpS07W91Mung1Tu6txCegpedE6ESrQ4nx+3bOZBcCQEh3 2wA3bGq7cQKTyuMxYBt+XVpn+K3fp3q8ekJpZg03iMCg31vDVdJV3qAOemqPHWNl BUMpyvmIJNmeCrUBfEkCQQDq4l+1ssU4CG3aDYHUGDYkVR2WFFLxbV1pEf2DMrs5 h5nZp/QcmuyEWMLXuvEi5iUmQdLqKyuH3CLgOq7oS2qw -----END RSA PRIVATE KEY-----";

  let publicKey = new PublicKey(DUMMY_PUBLIC_KEY, "William Henderson");
  let privateKey = new PrivateKey(DUMMY_PRIVATE_KEY);

  let str = "Hello, world!";
  let signature = privateKey.sign(str);

  let verified = publicKey.verify(str, signature);

  expect(verified).toEqual(true);
});