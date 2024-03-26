const log = (...item) => console.log(`[ENCRYPTEDTTV]`, ...item);
const logError = (item) => console.error(`[ENCRYPTEDTTV]`, item);

(async () => {
  const { key } = await chrome.storage.local.get("key");

  if (!key) throw new Error("No key found");

  const keyInputElement = document.createElement("input");
  keyInputElement.setAttribute("type", "hidden");
  keyInputElement.value = key;
  keyInputElement.id = "etv-key";
  document.body.appendChild(keyInputElement);

  // wait for the chat to load
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const chatContainer = document.querySelector(
    `[data-test-selector="chat-scrollable-area__message-container"]`
  );

  chatContainer.addEventListener("DOMNodeInserted", async (e) => {
    const newElement = e.target;
    const messageElement = newElement.querySelector(".message");

    if (!messageElement.innerText.startsWith("[ETV]")) return;

    const content = messageElement.innerText;
    const contentWithoutMark = content.replace("[ETV] ", "");

    const decryptedMessage = await CryptoJS.AES.decrypt(
      contentWithoutMark,
      key
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedMessage) {
      messageElement.innerHTML = `${decryptedMessage} <span style="opacity: 0.5">Decrypted</span>`;
    } else {
      messageElement.innerHTML = `${content.slice(
        0,
        25
      )}... <span style="color: red;">(Decryption key mismatch)</span>`;
    }
  });
})();
