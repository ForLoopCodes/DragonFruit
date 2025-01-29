document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("api-key-input");
  const status = document.getElementById("status");

  // Load existing key from popup's localStorage
  const savedKey = localStorage.getItem("mistral_api_key");
  if (savedKey) input.value = savedKey;

  // Save key to both popup and active tab
  input.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      const apiKey = input.value;
      localStorage.setItem("mistral_api_key", apiKey);
      status.textContent = "API Key is Saved!";
      status.style.opacity = "1";
      setTimeout(() => {
        status.style.opacity = "0";
        status.textContent = " ";
      }, 2000);

      // Save key to active tab's localStorage
      let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: (key) => localStorage.setItem("mistral_api_key", key),
          args: [apiKey],
        });
      }
    }
  });
});
