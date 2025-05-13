function sendMessage(action) {
    return new Promise((resolve) => {
      if (!chrome.runtime || !chrome.runtime.sendMessage) {
        resolve("Error: chrome.runtime unavailable");
        return;
      }
  
      chrome.runtime.sendMessage({ action }, (response) => {
        if (chrome.runtime.lastError || !response) {
          resolve("Error: " + (chrome.runtime.lastError?.message || "No response"));
        } else if (response.error) {
          resolve("Error: " + response.error);
        } else {
          resolve(response);
        }
      });
    });
  }
  
  async function runChecks() {
    const results = {
      location: await sendMessage("checkGeolocation"),
      isp: await sendMessage("checkISP"),
      data: await sendMessage("checkData"),
      device: await sendMessage("checkDeviceInfo"),
      tracking: await sendMessage("checkTracking"),
      permissions: await sendMessage("checkPermissions"),
      forms: await sendMessage("checkForms"),
    };
  
    updateUI(results);
  }
  
  function updateUI(results) {
    const fields = ["location", "isp", "data", "device", "tracking", "permissions", "forms"];
    fields.forEach((key) => {
      const el = document.getElementById(key);
      if (el) {
        el.innerHTML = `<span></span>${formatResult(results[key])}`;
      }
    });
  }
  
  function formatResult(result) {
    if (typeof result === "string") return result;
    if (Array.isArray(result)) return result.length ? result.join(", ") : "None";
    if (typeof result === "object") {
      return Object.entries(result)
        .filter(([_, v]) => v)
        .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
        .join(", ") || "None";
    }
    return "None";
  }
  
  runChecks();
  