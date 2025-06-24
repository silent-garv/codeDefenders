document.addEventListener('DOMContentLoaded', () => {
  const sendBtn = document.getElementById('send-alert');
  const alertBox = document.getElementById('alert');
  const spinner = document.getElementById('spinner');
  const keywordsList = document.getElementById('keywords-list');
  const logsList = document.getElementById('logs-list');

  function showAlert(message, type = 'success', priority = 'normal') {
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type} show`;
    if (type === 'error') {
      alertBox.style.color = '#c0392b'; // Red text for error
      alertBox.style.fontWeight = 'bold';
    } else {
      alertBox.style.color = '';
      alertBox.style.fontWeight = '';
    }
    if (priority === 'high') {
      alertBox.innerHTML = `<span style='color:#c0392b;font-weight:bold;'>[HIGH PRIORITY]</span> ` + alertBox.innerHTML;
    }
    setTimeout(() => {
      alertBox.classList.remove('show');
      setTimeout(() => { alertBox.style.display = 'none'; }, 400);
    }, 2200);
    alertBox.style.display = 'block';
  }

  function renderKeywords(keywords) {
    keywordsList.innerHTML = '';
    keywords.forEach(k => {
      const li = document.createElement('li');
      li.textContent = k;
      keywordsList.appendChild(li);
    });
  }

  function renderLogs(logs) {
    logsList.innerHTML = '';
    logs.forEach(log => {
      const li = document.createElement('li');
      li.textContent = log;
      logsList.appendChild(li);
    });
  }

  function fetchData() {
    chrome.runtime.sendMessage({ type: 'GET_DATA' }, (response) => {
      if (response) {
        renderKeywords(response.keywords || []);
        renderLogs(response.logs || []);
      }
    });
  }

  // Listen for real-time threat alerts from background
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg && msg.type === 'THREAT_ALERT') {
      // If the reason contains 'blocklist' or 'AbuseIPDB', mark as high priority
      const isHighPriority = /blocklist|AbuseIPDB/i.test(msg.reason);
      showAlert(`Threat detected: ${msg.reason}<br><span style='font-size:0.95em;'>${msg.url}</span>`, 'error', isHighPriority ? 'high' : 'normal');
      fetchData();
    }
  });

  sendBtn.addEventListener('click', () => {
    spinner.style.display = 'inline-block';
    sendBtn.disabled = true;
    alertBox.classList.remove('show');
    alertBox.style.display = 'none';

    chrome.runtime.sendMessage({ type: 'SEND_ALERT', reason: 'Manual' }, (res) => {
      spinner.style.display = 'none';
      sendBtn.disabled = false;
      if (res && res.success) {
        showAlert('✅ Alert sent successfully!', 'success');
        fetchData();
      } else {
        showAlert('❌ Failed to send alert', 'error');
      }
    });
  });

  fetchData();
});