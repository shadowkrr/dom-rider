chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'executeScript') {
    executeScript(message.code)
      .then((result) => {
        sendResponse({ success: true, result: result });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});

async function executeScript(code) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab) {
    throw new Error('No active tab found');
  }

  const tabId = tab.id;

  return new Promise((resolve, reject) => {
    chrome.debugger.attach({ tabId: tabId }, '1.3', () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      chrome.debugger.sendCommand(
        { tabId: tabId },
        'Runtime.evaluate',
        {
          expression: code,
          userGesture: true
        },
        (result) => {
          const lastError = chrome.runtime.lastError;

          chrome.debugger.detach({ tabId: tabId }, () => {});

          if (lastError) {
            reject(new Error(lastError.message));
            return;
          }

          if (result && result.exceptionDetails) {
            const ex = result.exceptionDetails;
            const errorMsg = ex.exception?.description || ex.text || 'Script error';
            reject(new Error(errorMsg));
            return;
          }

          resolve(result?.result?.value);
        }
      );
    });
  });
}
