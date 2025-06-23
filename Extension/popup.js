// popup.js
document.getElementById('clickme').addEventListener('click', () => {
  alert('The Alert is being taken care of ! ');
});

// Show threat alerts if present
window.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['threatAlert'], (result) => {
    const alertDiv = document.getElementById('threat-alert');
    if (result.threatAlert) {
      const { url, details, timestamp } = result.threatAlert;
      alertDiv.innerHTML =
        '<div style="color: red; font-weight: bold;">⚠️ Threat Detected!</div>' +
        '<div><b>URL:</b> ' + url + '</div>' +
        '<div><b>Details:</b><ul>' + details.map(d => '<li>' + d + '</li>').join('') + '</ul></div>' +
        '<div style="font-size: small;">' + new Date(timestamp).toLocaleString() + '</div>';
    } else {
      alertDiv.innerHTML = '<div style="color: green;">No threats detected on the current page.</div>';
    }
  });
});
