import init, { eth_generate } from "/pkg/ex_chrome.js";
const wasmPromise = init();

async function runWasm() {
  await wasmPromise;
  const result = eth_generate();
  document.getElementById("status").innerHTML = `
    <p><b>Etherum</b></p>
    <hr/>
    <p><b>Private Key:</b> ${result.private_key}</p>
    <p><b>Address:</b> ${result.address}</p>
  `;
}

document.getElementById("runEtherum").addEventListener("click", runWasm);
