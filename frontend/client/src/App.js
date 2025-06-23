import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import { SocketProvider } from "./contexts/SocketContext"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Monitoring from "./pages/Monitoring"
import Alerts from "./pages/Alerts"
import People from "./pages/People"
import Settings from "./pages/Settings"

function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        <Router>
          <div className="App">
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/monitoring" element={<Monitoring />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/people" element={<People />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          </div>
        </Router>
      </SocketProvider>
    </ThemeProvider>
  )
}

export default App
