// Configuration for phishing detection
const config = {
    suspiciousKeywords: [
        'login', 'verify', 'update', 'password', 'bank', 'account', 'secure',
        'credentials', 'validate', 'reset', 'unlock', 'confirm', 'authenticate',
        'security', 'alert', 'warning', 'important', 'urgent', 'restricted',
        'paypal', 'irs', 'recovery', 'billing', 'invoice', 'ssn', 'social security',
        'payment', 'suspended', 'breach', 'access', 'locked', 'statement',
        'transfer', 'redeem', 'click here', 'act now', 'confirm identity',
        'dear user', 'suspicious activity', 'security check', 'account update',
        'verify identity', 'credit card', 'login attempt', 'personal info',
        're-authenticate', 'compromise', 'required action', 'account review',
        'system notice', 'sign-in', 'login now', 'security alert', 'action required',
        'account verify', 'session expired', 'temporary hold', 'verify details'
    ],
    suspiciousDomains: [
        'phishysite.com', 'malicious-site.net', 'secure-login.com', 'accountverify.net',
        'paypal-alerts.com', 'mybank-secure.com', 'login-fb.net', 'update-account.info',
        'verify-paypal.com', 'secure-msg.com', 'importantnotice.org', 'bankalert.com',
        'quick-update.net', 'signin-warning.com', 'recovery-login.net', 'auth-failed.net',
        'reset-now.com', 'logon-alert.com', 'secure-idcheck.com', 'cloud-login.net',
        'id-verification.org', 'locked-profile.net', 'access-hold.com',
        'alert-authentication.com', 'important-message.net', 'safety-check.org',
        'suspicious-activity.net', 'validate-login.com', 'customerreview.net',
        'securitysupport.org', 'bank-lock.com', 'irs-notice.net', 'password-reset.link'
    ]
};

// Export the configuration
if (typeof module !== 'undefined' && module.exports) {
    // For Node.js/CommonJS
    module.exports = config;
} else {
    // For browser/extension
    window.PhishingConfig = config;
}
