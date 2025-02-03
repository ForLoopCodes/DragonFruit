document.addEventListener("DOMContentLoaded", () => {
  const providerSelect = document.getElementById("provider-select");
  const mistralConfig = document.getElementById("mistral-config");
  const localConfig = document.getElementById("local-config");
  const status = document.getElementById("status");

  const mistralKeyInput = document.getElementById("mistral-key-input");
  const localModelInput = document.getElementById("local-model-input");
  const localUrlInput = document.getElementById("local-url-input");
  const localKeyInput = document.getElementById("local-key-input");

  const loadSavedConfigs = () => {
    // Mistral config
    const savedMistralKey = localStorage.getItem("mistral_api_key");
    if (savedMistralKey) mistralKeyInput.value = savedMistralKey;

    // Local LLM config
    const savedLocalModel = localStorage.getItem("local_model");
    const savedLocalUrl = localStorage.getItem("local_url");
    const savedLocalKey = localStorage.getItem("local_api_key");

    if (savedLocalModel) localModelInput.value = savedLocalModel;
    if (savedLocalUrl) localUrlInput.value = savedLocalUrl;
    if (savedLocalKey) localKeyInput.value = savedLocalKey;

    // Load last selected provider
    const savedProvider = localStorage.getItem("selected_provider") || "mistral";
    providerSelect.value = savedProvider;
    updateProviderView(savedProvider);
  };

  // Show success message
  const showStatus = (message) => {
    status.textContent = message;
    status.style.opacity = "1";
    setTimeout(() => {
      status.style.opacity = "0";
      status.textContent = " ";
    }, 2000);
  };

  // Save configuration to both popup and active tab
  const saveConfig = async (key, value) => {
    localStorage.setItem(key, value);
    let [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: (k, v) => localStorage.setItem(k, v),
        args: [key, value],
      });
    }
  };

  // Update visible configuration section
  const updateProviderView = (provider) => {
    mistralConfig.classList.toggle("active", provider === "mistral");
    localConfig.classList.toggle("active", provider === "local");
  };

  // Event Listeners
  providerSelect.addEventListener("change", (e) => {
    const provider = e.target.value;
    updateProviderView(provider);
    saveConfig("selected_provider", provider);
  });

  // Mistral API Key input
  mistralKeyInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      await saveConfig("mistral_api_key", mistralKeyInput.value);
      showStatus("Mistral API Key Saved!");
    }
  });

  // Local LLM inputs
  const localInputs = {
    "local-model-input": "local_model",
    "local-url-input": "local_url",
    "local-key-input": "local_api_key",
  };

  Object.entries(localInputs).forEach(([inputId, storageKey]) => {
    document.getElementById(inputId).addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        await saveConfig(storageKey, e.target.value);
        showStatus("Local LLM Configuration Saved!");
      }
    });
  });

  // Initialize
  loadSavedConfigs();
});
