async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatLog = document.getElementById("chat-log");
  const message = input.value;
  
  if (!message) return;

  chatLog.innerHTML += `<p><strong>Toi:</strong> ${message}</p>`;
  input.value = "";

  const response = await fetch("http://localhost:5000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  const data = await response.json();
  const reply = data.reply || "[erreur IA dépressive]";
  chatLog.innerHTML += `<p><strong>IA:</strong> ${reply}</p>`;
  chatLog.scrollTop = chatLog.scrollHeight;
}
