import init, { eth_generate, solana_generate } from "./pkg/ex_chrome.js";
const wasmPromise = init();

document.addEventListener("DOMContentLoaded", async () => {
  const data = await chrome.storage.local.get({ walletHistory: "" });
  document.getElementById("content").innerHTML = data.walletHistory;
});

async function saveToStorage() {
  const currentHTML = document.getElementById("content").innerHTML;
  await chrome.storage.local.set({ walletHistory: currentHTML });
}

async function runClean() {
  document.getElementById("content").innerHTML = "";
  await saveToStorage();
}

async function runEth() {
  await wasmPromise;
  const result = eth_generate();

  const htmlContent = `
    <div class="wallet-entry">
      <p><b>Ethereum</b></p>
      <p><b>Private Key:</b> ${result.private_key}</p>
      <p><b>Address:</b> ${result.address}</p>
      <hr>
    </div>
  `;

  document
    .getElementById("content")
    .insertAdjacentHTML("beforeend", htmlContent);

  await saveToStorage();
}

async function runSolana() {
  await wasmPromise;
  const result = solana_generate();

  const htmlContent = `
    <div class="wallet-entry">
      <p><b>Solana</b></p>
      <p><b>Private Key:</b> ${result.private_key}</p>
      <p><b>Address:</b> ${result.address}</p>
      <hr>
    </div>
  `;

  document
    .getElementById("content")
    .insertAdjacentHTML("beforeend", htmlContent);
  await saveToStorage();
}

document.getElementById("runEtherum").addEventListener("click", runEth);
document.getElementById("runSolana").addEventListener("click", runSolana);
document.getElementById("runClean").addEventListener("click", runClean);
