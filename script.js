function getTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function sendMessage() {
    const input = document.getElementById("input");
    const chat = document.getElementById("chat");

    const message = input.value.trim();
    if (!message) return;

    // USER
    const user = document.createElement("div");
    user.className = "msg";
    user.innerHTML = `
        <div class="user-box">${message}</div>
        <div class="time">${getTime()}</div>
    `;
    chat.appendChild(user);

    input.value = "";

    // ANALYZING
    const analyzing = document.createElement("div");
    analyzing.className = "analyzing";
    analyzing.innerText = "ASSISTANT ANALYZING...";
    chat.appendChild(analyzing);

    chat.scrollTop = chat.scrollHeight;

    try {
        const res = await fetch("/chat", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ message })
        });

        const data = await res.json();
        analyzing.remove();

        // BOT
        const bot = document.createElement("div");
        bot.className = "msg";
        bot.innerHTML = `
            <div class="label">✦ NANIPAL ASSISTANT</div>
            <div class="bot-box">${data.reply}</div>
            <div class="time">${getTime()}</div>
        `;
        chat.appendChild(bot);

        chat.scrollTop = chat.scrollHeight;

    } catch {
        analyzing.innerText = "Error...";
    }
}