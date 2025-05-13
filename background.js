chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkData") {
      try {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tab = tabs[0];
          if (!tab || !tab.id) {
            sendResponse({ error: "Tab info unavailable" });
            return;
          }
  
          chrome.scripting.executeScript(
            {
              target: { tabId: tab.id },
              func: () => {
                const cookies = document.cookie.split(";").filter(c => c.trim() !== "");
                const localStorageUsed = Object.keys(localStorage).length > 0;
                return {
                  cookieCount: cookies.length,
                  localStorage: localStorageUsed
                };
              }
            },
            (results) => {
              if (chrome.runtime.lastError) {
                sendResponse({ error: chrome.runtime.lastError.message });
              } else {
                sendResponse(results[0].result);
              }
            }
          );
        });
  
        // Return true to indicate async response
        return true;
      } catch (e) {
        sendResponse({ error: e.message });
      }
    }
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "checkGeolocation") {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            if (!tab || !tab.id) {
              sendResponse("Tab unavailable");
              return;
            }
      
            chrome.scripting.executeScript(
              {
                target: { tabId: tab.id },
                func: () => {
                  return navigator.geolocation ? "Requested" : "Not Requested";
                },
              },
              (results) => {
                if (chrome.runtime.lastError || !results || !results[0]) {
                  sendResponse("Error detecting geolocation");
                } else {
                  sendResponse(results[0].result);
                }
              }
            );
          });
          return true; // Important: keep the message port open
        }
      
        // Other actions go here...
      });
      
    // Add more actions here as needed...
  });
  