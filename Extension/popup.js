document.getElementById("send-alert").addEventListener("click", () => {
  const status = document.getElementById("status");
  status.textContent = "Sending alert...";

  fetch("https://codedefenders-cih-2-0.onrender.com/alert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "🚨 Manual alert triggered from popup",
      timestamp: new Date().toISOString()
    })
  })
  .then(res => res.json())
  .then(data => {
    status.textContent = "✅ Alert sent!";
    console.log("✅ Sent to backend:", data);
  })
  .catch(err => {
    status.textContent = "❌ Failed to send alert";
    console.error("❌ Error sending alert:", err);
  });
});