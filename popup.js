const list = document.getElementById('list');
const name = document.getElementById('name');
const code = document.getElementById('code');
const run = document.getElementById('run');
const runCopy = document.getElementById('runCopy');
const save = document.getElementById('save');
const deleteBtn = document.getElementById('delete');
const status = document.getElementById('status');

let scripts = {};

function showStatus(message, isError) {
  status.textContent = message;
  status.className = 'status ' + (isError ? 'error' : 'success');
  setTimeout(() => {
    status.className = 'status';
  }, 3000);
}

async function init() {
  try {
    const result = await chrome.storage.local.get('scripts');
    scripts = result.scripts || {};
    renderScriptList();
  } catch (error) {
    showStatus('Failed to load: ' + error.message, true);
  }
}

function renderScriptList() {
  list.innerHTML = '<option value="">-- New Script --</option>';

  Object.keys(scripts).forEach(scriptName => {
    const option = document.createElement('option');
    option.value = scriptName;
    option.textContent = scriptName;
    list.appendChild(option);
  });
}

list.addEventListener('change', () => {
  const selectedName = list.value;

  if (selectedName === '') {
    name.value = '';
    code.value = '';
  } else {
    name.value = selectedName;
    code.value = scripts[selectedName] || '';
  }
});

save.addEventListener('click', async () => {
  const scriptName = name.value.trim();
  const codeValue = code.value;

  if (!scriptName) {
    showStatus('Enter a script name', true);
    return;
  }

  try {
    scripts[scriptName] = codeValue;
    await chrome.storage.local.set({ scripts: scripts });
    renderScriptList();
    list.value = scriptName;
    showStatus('Saved!', false);
  } catch (error) {
    showStatus('Save failed: ' + error.message, true);
  }
});

deleteBtn.addEventListener('click', async () => {
  const scriptName = name.value.trim();

  if (!scriptName || !scripts[scriptName]) {
    showStatus('Select a script to delete', true);
    return;
  }

  try {
    delete scripts[scriptName];
    await chrome.storage.local.set({ scripts: scripts });
    renderScriptList();
    list.value = '';
    name.value = '';
    code.value = '';
    showStatus('Deleted!', false);
  } catch (error) {
    showStatus('Delete failed: ' + error.message, true);
  }
});

run.addEventListener('click', async () => {
  await executeCode(false);
});

runCopy.addEventListener('click', async () => {
  await executeCode(true);
});

async function executeCode(copyResult) {
  const codeValue = code.value;

  if (!codeValue.trim()) {
    showStatus('Enter some code', true);
    return;
  }

  try {
    const response = await chrome.runtime.sendMessage({
      action: 'executeScript',
      code: codeValue
    });

    if (!response.success) {
      showStatus('Error: ' + response.error, true);
      return;
    }

    if (copyResult && response.result !== undefined && response.result !== null) {
      const textToCopy = typeof response.result === 'string'
        ? response.result
        : JSON.stringify(response.result, null, 2);

      await navigator.clipboard.writeText(textToCopy);
      showStatus('Copied!', false);
    } else if (copyResult) {
      showStatus('No return value', true);
    } else {
      showStatus('Executed!', false);
    }
  } catch (error) {
    showStatus('Failed: ' + error.message, true);
  }
}

init();
