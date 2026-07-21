(() => {
  const input = document.querySelector("#input");
  const output = document.querySelector("#output");
  const inputCount = document.querySelector("#input-count");
  const outputCount = document.querySelector("#output-count");
  const status = document.querySelector("#status");
  const copyButton = document.querySelector("#copy");
  const urlSafe = document.querySelector("#url-safe");
  const labels = document.querySelectorAll(".field-head label");
  let mode = "encode";

  const encode = (value) => {
    const bytes = new TextEncoder().encode(value);
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 8192) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
    }
    let result = btoa(binary);
    if (urlSafe.checked) result = result.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    return result;
  };

  const decode = (value) => {
    const compact = value.replace(/\s/g, "");
    if (!compact) return "";
    const normalized = compact.replace(/-/g, "+").replace(/_/g, "/");
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) throw new Error("The input contains invalid Base64 characters.");
    const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  };

  const plural = (count) => count === 1 ? "character" : "characters";
  const setStatus = (message = "", success = false) => {
    status.textContent = message;
    status.classList.toggle("success", success);
  };

  const convert = () => {
    try {
      output.value = mode === "encode" ? encode(input.value) : decode(input.value);
      setStatus();
    } catch (error) {
      output.value = "";
      setStatus(error.message || "The data could not be converted.");
    }
    inputCount.textContent = `${input.value.length} ${plural(input.value.length)}`;
    outputCount.textContent = `${output.value.length} ${plural(output.value.length)}`;
    copyButton.disabled = output.value.length === 0;
  };

  document.querySelectorAll(".mode").forEach((button) => {
    button.addEventListener("click", () => {
      mode = button.dataset.mode;
      document.querySelectorAll(".mode").forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });
      labels[0].textContent = mode === "encode" ? "Text" : "Base64";
      labels[1].textContent = mode === "encode" ? "Base64" : "Text";
      input.placeholder = mode === "encode" ? "Type or paste text..." : "Paste Base64 data...";
      output.placeholder = "The result will appear here...";
      convert();
      input.focus();
    });
  });

  input.addEventListener("input", convert);
  urlSafe.addEventListener("change", convert);

  document.querySelector("#clear").addEventListener("click", () => {
    input.value = "";
    convert();
    input.focus();
  });

  document.querySelector("#swap").addEventListener("click", () => {
    if (!output.value) return;
    input.value = output.value;
    document.querySelector(`[data-mode="${mode === "encode" ? "decode" : "encode"}"]`).click();
  });

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(output.value);
      setStatus("Copied to clipboard.", true);
    } catch {
      output.select();
      document.execCommand("copy");
      setStatus("Copied to clipboard.", true);
    }
  });

  convert();
})();
