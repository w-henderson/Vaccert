use rand::rngs::OsRng;
use rsa::{
    pkcs1::{FromRsaPrivateKey, ToRsaPrivateKey},
    pkcs8::ToPublicKey,
    RsaPrivateKey, RsaPublicKey,
};
use std::ops::Deref;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn generate_private_key(bits: usize) -> String {
    let mut rng = OsRng;
    let private_key = RsaPrivateKey::new(&mut rng, bits).unwrap();
    private_key.to_pkcs1_pem().unwrap().deref().clone()
}

#[wasm_bindgen]
pub fn generate_public_key(private_key: &str) -> String {
    let private_key = RsaPrivateKey::from_pkcs1_pem(private_key).unwrap();
    let public_key = RsaPublicKey::from(&private_key);
    public_key.to_public_key_pem().unwrap()
}
