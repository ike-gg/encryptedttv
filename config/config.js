const FORM_ELEMENT = document.querySelector("form");
const INPUT_ELEMENT = document.querySelector("input");
const FEEDBACK_ELEMENT = document.querySelector(".feedback");

(async () => {
  const { key } = await chrome.storage.local.get("key");
  if (key) INPUT_ELEMENT.value = key;
})();

FORM_ELEMENT.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const key = formData.get("key");
  chrome.storage.local.set({ key });
  FEEDBACK_ELEMENT.innerText = "Key saved!";
});
