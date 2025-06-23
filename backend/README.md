# CyberSentinel Real-time Security Dashboard

A comprehensive real-time cybersecurity monitoring dashboard built with React frontend and Node.js backend, featuring browser extension integration for threat detection.

## 🚀 Features

- **Real-time Dashboard**: Live monitoring of security alerts and metrics
- **Multi-page Interface**: Monitoring, Alerts, People, and Settings pages
- **Interactive Charts**: Line, Bar, and Doughnut charts using Chart.js
- **Dark/Light Mode**: Beautiful theme switching with persistent preferences
- **Browser Extension**: Real-time threat detection and alert generation
- **WebSocket Integration**: Live data updates without page refresh
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Chart.js** - Interactive charts and visualizations
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **Socket.io** - Real-time bidirectional communication
- **SQLite** - Lightweight database
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

### Browser Extension
- **Manifest V3** - Modern extension architecture
- **Content Scripts** - Page monitoring and threat detection
- **Background Scripts** - Persistent monitoring

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd cybersentinel-dashboard
\`\`\`

2. **Install dependencies**
\`\`\`bash
# Install root dependencies
npm install

# Install all dependencies (client + server)
npm run install-all
\`\`\`

3. **Start the development servers**
\`\`\`bash
# Start both frontend and backend
npm run dev
\`\`\`

This will start:
- Backend server on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

### Manual Setup (Alternative)

If you prefer to run servers separately:

\`\`\`bash
# Terminal 1 - Backend
cd server
npm install
npm start

# Terminal 2 - Frontend
cd client
npm install
npm start
\`\`\`

## 🔧 Browser Extension Setup

1. **Load the extension in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension` folder

2. **Test the extension**:
   - Visit any website
   - The extension will automatically monitor for threats
   - Check the dashboard for real-time alerts

## 📊 Dashboard Pages

### 1. Dashboard (Home)
- Overview of security metrics
- Real-time alert trends
- Threat category distribution
- Recent alerts list

### 2. Monitoring
- Security incident trends
- Threat metrics by category
- System health status
- Real-time performance metrics

### 3. Alerts
- Complete list of security alerts
- Filtering by severity (High, Medium, Low)
- Search functionality
- Real-time alert updates

### 4. People
- User management interface
- Risk level assessment
- Activity monitoring
- Alert count per user

### 5. Settings
- Notification preferences
- Security configuration
- Data retention settings
- System information

## 🔌 API Endpoints

### Alerts
- `POST /api/alerts` - Create new alert (used by extension)
- `GET /api/alerts` - Get all alerts

### People
- `GET /api/people` - Get all people
- `PUT /api/people/:id` - Update person risk level

### Metrics
- `GET /api/metrics` - Get dashboard metrics

### Settings
- `GET /api/settings` - Get current settings
- `PUT /api/settings` - Update settings

### Health
- `GET /health` - Server health check

## 🌐 WebSocket Events

### Client → Server
- `connection` - Client connects to server
- `disconnect` - Client disconnects

### Server → Client
- `initial-data` - Send initial dashboard data
- `new-alert` - Broadcast new alert to all clients
- `metrics-update` - Send updated metrics
- `people-update` - Send updated people data
- `settings-update` - Send updated settings

## 🎨 Theming

The dashboard supports both light and dark modes with:
- Persistent theme preference (localStorage)
- Smooth transitions between themes
- Consistent color schemes across all components
- Accessible color contrasts

## 🔒 Security Features

### Browser Extension Detection
- Suspicious link detection
- Insecure form monitoring
- Malicious download prevention
- Phishing content analysis

### Dashboard Security
- CORS protection
- Helmet security headers
- Input validation
- SQL injection prevention

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- Desktop computers (1920px+)
- Laptops (1024px+)
- Tablets (768px+)
- Mobile phones (320px+)

## 🚀 Deployment

### Frontend (React)
\`\`\`bash
cd client
npm run build
# Deploy the 'build' folder to your hosting service
\`\`\`

### Backend (Node.js)
\`\`\`bash
cd server
# Set environment variables
export PORT=5000
npm start
\`\`\`

### Environment Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## 🧪 Testing the System

1. **Start the servers** using `npm run dev`
2. **Load the browser extension** in Chrome
3. **Visit the dashboard** at `http://localhost:3000`
4. **Browse suspicious websites** to trigger alerts
5. **Watch real-time updates** in the dashboard

### Sample Test Scenarios
- Visit a page with suspicious keywords
- Click on shortened URLs (bit.ly, tinyurl)
- Try to download .exe files
- Submit forms on non-HTTPS pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the GitHub issues
- Review the documentation
- Contact the development team

---

**CyberSentinel** - Protecting your digital world, one alert at a time. 🛡️
\`\`\`

This completes the comprehensive CyberSentinel real-time dashboard system! The solution includes:

## 🎯 **Key Features Delivered:**

1. **Complete React Frontend** with routing, charts, and real-time updates
2. **Node.js Backend** with Express, WebSocket, and SQLite database
3. **Browser Extension** that detects threats and sends alerts
4. **Real-time Communication** using Socket.io
5. **Beautiful UI** with Tailwind CSS and dark/light mode
6. **Interactive Charts** using Chart.js
7. **Responsive Design** that works on all devices
8. **Complete Setup Instructions** and documentation

## 🚀 **To Get Started:**

1. **Install dependencies**: `npm run install-all`
2. **Start development**: `npm run dev`
3. **Load browser extension** in Chrome
4. **Visit dashboard** at `http://localhost:3000`
5. **Test threat detection** by browsing suspicious content

The system provides real-time monitoring, beautiful visualizations, and comprehensive security alert management - exactly what you requested for your CyberSentinel dashboard!
