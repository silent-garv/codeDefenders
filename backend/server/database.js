const sqlite3 = require("sqlite3").verbose()
const path = require("path")

class Database {
  constructor() {
    this.db = new sqlite3.Database(":memory:") // Use in-memory database for demo
    this.initializeTables()
    this.seedData()
  }

  initializeTables() {
    // Alerts table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        severity TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        source TEXT,
        timestamp TEXT NOT NULL,
        status TEXT DEFAULT 'active'
      )
    `)

    // People table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS people (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        department TEXT,
        riskLevel TEXT DEFAULT 'low',
        lastActivity TEXT,
        alertCount INTEGER DEFAULT 0
      )
    `)

    // Settings table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `)

    console.log("📊 Database tables initialized")
  }

  seedData() {
    // Seed people data
    const people = [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@company.com",
        department: "Engineering",
        riskLevel: "medium",
        lastActivity: new Date().toISOString(),
        alertCount: 3,
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@company.com",
        department: "Marketing",
        riskLevel: "low",
        lastActivity: new Date(Date.now() - 3600000).toISOString(),
        alertCount: 1,
      },
      {
        id: "3",
        name: "Mike Wilson",
        email: "mike.wilson@company.com",
        department: "Finance",
        riskLevel: "high",
        lastActivity: new Date(Date.now() - 7200000).toISOString(),
        alertCount: 7,
      },
    ]

    people.forEach((person) => {
      this.db.run(
        "INSERT OR REPLACE INTO people (id, name, email, department, riskLevel, lastActivity, alertCount) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          person.id,
          person.name,
          person.email,
          person.department,
          person.riskLevel,
          person.lastActivity,
          person.alertCount,
        ],
      )
    })

    // Seed settings
    const defaultSettings = {
      emailNotifications: "true",
      alertThreshold: "medium",
      autoBlock: "true",
      retentionDays: "30",
    }

    Object.entries(defaultSettings).forEach(([key, value]) => {
      this.db.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, value])
    })

    console.log("🌱 Database seeded with initial data")
  }

  addAlert(alert) {
    this.db.run(
      "INSERT INTO alerts (id, type, severity, title, description, source, timestamp, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        alert.id,
        alert.type,
        alert.severity,
        alert.title,
        alert.description,
        alert.source,
        alert.timestamp,
        alert.status || "active",
      ],
    )

    // Update person alert count if source matches
    if (alert.source) {
      this.db.run("UPDATE people SET alertCount = alertCount + 1, lastActivity = ? WHERE email = ?", [
        alert.timestamp,
        alert.source,
      ])
    }
  }

  getAllAlerts() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM alerts ORDER BY timestamp DESC LIMIT 100", (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })
  }

  getRecentAlerts() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM alerts ORDER BY timestamp DESC LIMIT 20", (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })
  }

  getAllPeople() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM people ORDER BY name", (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })
  }

  updatePersonRisk(id, riskLevel) {
    this.db.run("UPDATE people SET riskLevel = ? WHERE id = ?", [riskLevel, id])
  }

  getMetrics() {
    return new Promise((resolve, reject) => {
      const metrics = {
        totalAlerts: 0,
        criticalAlerts: 0,
        highRiskUsers: 0,
        threatCategories: {},
        alertTrends: [],
      }

      // Get total alerts
      this.db.get("SELECT COUNT(*) as count FROM alerts", (err, row) => {
        if (err) {
          reject(err)
          return
        }
        metrics.totalAlerts = row.count

        // Get critical alerts
        this.db.get('SELECT COUNT(*) as count FROM alerts WHERE severity = "high"', (err, row) => {
          if (err) {
            reject(err)
            return
          }
          metrics.criticalAlerts = row.count

          // Get high risk users
          this.db.get('SELECT COUNT(*) as count FROM people WHERE riskLevel = "high"', (err, row) => {
            if (err) {
              reject(err)
              return
            }
            metrics.highRiskUsers = row.count

            // Get threat categories
            this.db.all("SELECT type, COUNT(*) as count FROM alerts GROUP BY type", (err, rows) => {
              if (err) {
                reject(err)
                return
              }

              rows.forEach((row) => {
                metrics.threatCategories[row.type] = row.count
              })

              // Get alert trends (last 7 days)
              const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
              this.db.all(
                `SELECT DATE(timestamp) as date, COUNT(*) as count 
                 FROM alerts 
                 WHERE timestamp >= ? 
                 GROUP BY DATE(timestamp) 
                 ORDER BY date`,
                [sevenDaysAgo],
                (err, rows) => {
                  if (err) {
                    reject(err)
                    return
                  }
                  metrics.alertTrends = rows
                  resolve(metrics)
                },
              )
            })
          })
        })
      })
    })
  }

  updateMetrics(alert) {
    // This method returns updated metrics after a new alert
    return this.getMetrics()
  }

  getSettings() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM settings", (err, rows) => {
        if (err) {
          reject(err)
          return
        }

        const settings = {}
        rows.forEach((row) => {
          settings[row.key] = row.value
        })
        resolve(settings)
      })
    })
  }

  updateSettings(newSettings) {
    Object.entries(newSettings).forEach(([key, value]) => {
      this.db.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, String(value)])
    })
  }
}

module.exports = Database
