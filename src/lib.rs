use ethers::core::rand::thread_rng;
use ethers::signers::{LocalWallet, Signer};
use serde::Serialize;
use wasm_bindgen::prelude::*;

#[derive(Serialize)]
pub struct Pair {
    pub private_key: String,
    pub address: String,
}

#[wasm_bindgen]
pub fn eth_generate() -> JsValue {
    let wallet = LocalWallet::new(&mut thread_rng());

    let private_key_hex = hex::encode(wallet.signer().to_bytes());
    let address = format!("{:?}", wallet.address());

    let pair = Pair {
        private_key: format!("0x{}", private_key_hex),
        address,
    };

    serde_wasm_bindgen::to_value(&pair).unwrap()
}
