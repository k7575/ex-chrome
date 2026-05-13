use ethers::core::rand::thread_rng;
use ethers::signers::{LocalWallet, Signer};
use serde::Serialize;
use solana_sdk::bs58;
use solana_sdk::signer::Signer as SignerSolana;
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
    let private_key = format!("0x{}", private_key_hex);
    let address = format!("{:?}", wallet.address());

    let pair = Pair {
        private_key,
        address,
    };

    serde_wasm_bindgen::to_value(&pair).unwrap()
}

#[wasm_bindgen]
pub fn solana_generate() -> JsValue {
    let wallet = solana_sdk::signer::keypair::Keypair::new();
    let private_key = bs58::encode(wallet.to_bytes()).into_string();
    let address = wallet.pubkey().to_string();
    let pair = Pair {
        private_key,
        address,
    };
    serde_wasm_bindgen::to_value(&pair).unwrap()
}
