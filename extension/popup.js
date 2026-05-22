import init, { eth_generate, solana_generate } from "./pkg/ex_chrome.js";

const wasmPromise = init().catch((err) =>
  console.error("WASM init failed:", err),
);

const contentEl = document.getElementById("content");
const ethBtn = document.getElementById("runEtherum");
const solanaBtn = document.getElementById("runSolana");
const cleanBtn = document.getElementById("runClean");

let wallets = [];

document.addEventListener("DOMContentLoaded", async () => {
  const data = await chrome.storage.local.get({ wallets: [] });
  wallets = data.wallets;
  renderWallets();
});

ethBtn.addEventListener("click", () => generateWallet("ETH"));
solanaBtn.addEventListener("click", () => generateWallet("Solana"));
cleanBtn.addEventListener("click", clearWallets);

async function generateWallet(network) {
  try {
    await wasmPromise;

    const result = network === "ETH" ? eth_generate() : solana_generate();

    const newWallet = {
      network,
      privateKey: result.private_key,
      address: result.address,
      timestamp: Date.now() + Math.random(),
      marked: false,
    };

    wallets.push(newWallet);
    await saveToStorage();
    renderWallets();
  } catch (error) {
    console.error(`Failed to generate ${network} wallet:`, error);
  }
}

async function clearWallets() {
  wallets = [];
  await saveToStorage();
  renderWallets();
}

async function deleteWallet(timestamp) {
  wallets = wallets.filter((wallet) => wallet.timestamp !== timestamp);
  await saveToStorage();
  renderWallets();
}

async function toggleMarkWallet(timestamp) {
  wallets = wallets.map((wallet) => {
    if (wallet.timestamp === timestamp) {
      return { ...wallet, marked: !wallet.marked };
    }
    return wallet;
  });
  await saveToStorage();
  renderWallets();
}

function saveWalletToFile(network, address, privateKey) {
  const textContent = `Network: ${network}\nAddress: ${address}\nPrivate Key: ${privateKey}`;
  const blob = new Blob([textContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${network}_wallet_${address.substring(0, 8)}.txt`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function saveToStorage() {
  await chrome.storage.local.set({ wallets });
}

function renderWallets() {
  contentEl.textContent = "";
  const fragment = document.createDocumentFragment();

  wallets.forEach(({ network, privateKey, address, timestamp, marked }) => {
    const card = document.createElement("div");
    card.className = `wallet-card ${network.toLowerCase()}${marked ? " marked" : ""}`;

    const badge = document.createElement("div");
    badge.className = "network-badge";
    badge.textContent = network;
    card.appendChild(badge);

    const saveBtn = document.createElement("button");
    saveBtn.className = "save-btn";
    saveBtn.innerHTML = "&#128190;";
    saveBtn.title = "Save wallet to TXT";
    saveBtn.addEventListener("click", () =>
      saveWalletToFile(network, address, privateKey),
    );
    card.appendChild(saveBtn);

    const markBtn = document.createElement("button");
    markBtn.className = "mark-btn";
    markBtn.innerHTML = marked ? "&#9733;" : "&#9734;";
    markBtn.title = "Mark wallet";
    markBtn.addEventListener("click", () => toggleMarkWallet(timestamp));
    card.appendChild(markBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "&times;";
    deleteBtn.title = "Delete wallet";
    deleteBtn.addEventListener("click", () => deleteWallet(timestamp));
    card.appendChild(deleteBtn);

    card.appendChild(createField("Private Key", privateKey));
    card.appendChild(createField("Address", address));

    fragment.appendChild(card);
  });

  contentEl.appendChild(fragment);
}

function createField(label, value) {
  const container = document.createElement("div");

  const labelEl = document.createElement("span");
  labelEl.className = "label";
  labelEl.textContent = label;

  const valueEl = document.createElement("div");
  valueEl.className = "value";
  valueEl.textContent = value;

  container.appendChild(labelEl);
  container.appendChild(valueEl);
  return container;
}
