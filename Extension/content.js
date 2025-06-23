// content.js
console.log('Content script loaded.');

// Basic phishing/threat detection
(function detectThreats() {
    // Example: List of suspicious keywords/domains (expand as needed)
    const suspiciousKeywords = ['login', 'verify', 'update', 'password', 'bank', 'account', 'secure'];
    const suspiciousDomains = ['phishy-example.com', 'malicious-site.net'];
    let threatDetected = false;
    let threatDetails = [];

    // Check for suspicious domain
    if (suspiciousDomains.some(domain => window.location.hostname.includes(domain))) {
        threatDetected = true;
        threatDetails.push('Suspicious domain detected: ' + window.location.hostname);
    }

    // Check for suspicious keywords in page text
    const bodyText = document.body.innerText.toLowerCase();
    suspiciousKeywords.forEach(keyword => {
        if (bodyText.includes(keyword)) {
            threatDetected = true;
            threatDetails.push('Suspicious keyword found: ' + keyword);
        }
    });

    // Example: Check for password fields (phishing forms)
    if (document.querySelector('input[type="password"]')) {
        threatDetected = true;
        threatDetails.push('Password field detected on this page.');
    }

    if (threatDetected) {
        // Send message to background/popup
        chrome.storage.local.set({
            threatAlert: {
                url: window.location.href,
                details: threatDetails,
                timestamp: Date.now()
            }
        });
    }
})();
