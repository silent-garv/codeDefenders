# CyberSentinel: CodeDefenders Suite

This repository contains three main components:

- **Extension**: Chrome extension (CyberSentinel) for real-time cybersecurity threat detection and protection.
- **frontend**: Next.js-based dashboard and UI for monitoring, alerting, and configuration.
- **server**: Node.js backend for logging, alerting, and integration with external threat intelligence APIs.

---

## 1. Extension

**CyberSentinel Chrome Extension**

- **Purpose:**
  - Protects users from cybersecurity threats (malicious domains, phishing, SQLi, etc.) using static and dynamic detection.
  - Provides real-time alerts, logging, and a responsive popup UI.
  - Complies with Chrome Manifest V3, using Declarative Net Request (DNR) for blocking.

- **Key Features:**
  - Static and dynamic threat detection (phishing, SQLi, insecure cookies, etc.).
  - Real-time alerts and logs, with rotating/shuffled keyword sets for each alert.
  - Domain reputation checks using Google Safe Browsing and AbuseIPDB APIs.
  - All blocking handled by DNR (rules.json); no forbidden webRequest blocking.
  - User-friendly popup with color-coded, priority-based alerts and instant log updates.

- **Main Files:**
  - `background.js`: Main logic for detection, alerting, keyword rotation, and API checks.
  - `content.js`: Injected into web pages for in-page threat detection.
  - `popup.js` & `popup.html`: Popup UI for real-time alerts and logs.
  - `manifest.json`: Chrome extension manifest (Manifest V3 compliant).
  - `rules.json`: DNR rules for domain blocking.

- **Setup:**
  1. Go to `chrome://extensions` and enable Developer Mode.
  2. Click "Load unpacked" and select the `Extension/` folder.
  3. The extension will run in the background and show alerts in the popup.

---

## 2. frontend

**Next.js Dashboard & UI**

- **Purpose:**
  - Provides a modern dashboard for monitoring alerts, viewing logs, and configuring settings for CyberSentinel.
  - Includes charts, tables, and real-time updates for security events.

- **Key Features:**
  - Built with Next.js, React, and Tailwind CSS.
  - Modular component structure (`components/`, `app/`, `hooks/`, etc.).
  - Real-time alert and log display, user authentication, and settings management.
  - Responsive design for desktop and mobile.

- **Main Files/Folders:**
  - `app/`: Next.js app directory (pages, layouts, etc.).
  - `components/`: UI and dashboard components.
  - `hooks/`, `lib/`, `styles/`: Custom hooks, utilities, and global styles.
  - `public/`: Static assets (logos, images).
  - `package.json`, `tailwind.config.ts`, etc.: Project configuration.

- **Setup:**
  1. Navigate to the `frontend/` folder.
  2. Install dependencies: `pnpm install` (or `npm install` if using npm).
  3. Start the dev server: `pnpm dev` or `npm run dev`.
  4. Open `http://localhost:3000` in your browser.

---

## 3. server

**Node.js Backend**

- **Purpose:**
  - Handles logging, alerting, and integration with external threat intelligence APIs.
  - Receives alerts from the extension and provides data to the frontend dashboard.

- **Key Features:**
  - Express.js server for REST API endpoints.
  - Receives and stores alerts/logs from the extension.
  - Can be extended to support authentication, user management, and more.

- **Main Files:**
  - `index.js`: Main server entry point.
  - `database.js`: Simple database or in-memory storage for logs/alerts.
  - `package.json`: Project dependencies and scripts.

- **Setup:**
  1. Navigate to the `server/` folder.
  2. Install dependencies: `npm install`.
  3. Start the server: `npm start` or `node index.js`.
  4. The server will listen for incoming alerts and provide data to the frontend.

---

## Development & Contribution

- PRs and issues are welcome! Please ensure your code is well-documented and tested.
- For questions or support, open an issue or contact the maintainers.

---

## License

This project is licensed under the MIT License.
