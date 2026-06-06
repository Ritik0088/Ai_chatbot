import { apikey } from "./config.js";
 
const chatbox = document.getElementById("chat-box")
const userInput = document.getElementById("user-Input")
const sendBtn = document.getElementById("send-btn");

window.onload=() => {
    const savedChat= localStorage.getItem("chatHistory");
    console.log({savedChat});
    if(savedChat) chatbox.innerHTML=savedChat;
    chatbox.scrollTop = chatbox.scrollHeight
}

function addMessage (message,classNme){
    const msgDiv=document.createElement("div");
    msgDiv.classList.add("message",classNme);
    msgDiv.textContent=message;  
    chatbox.appendChild(msgDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function showTyping() {
    const typingDiv = document.createElement("div")
    typingDiv.classList.add("message","bot-message");
    typingDiv.textContent="Ai is typing...";
    chatbox.appendChild(typingDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
    return typingDiv;
}

async function getbotreplay(usermessage){
const url = `https://api.groq.com/openai/v1/chat/completions`;

   try {
      const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apikey}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "user",
                        content: usermessage
                    }
                ]
            })
        });
    const data = await response.json();
    console.log("Status:", response.status);
console.log("Data:", data);

    if (!response.ok) {
        console.error("API Error", data);
        return data?.error?.message || "Error fetching response"
    }
    return (
        data.choices?.[0]?.message?.content || "Sorry I couldn't get that"
    )
   }
   catch(error) {
     console.error(error);
    return "Something went wrong";

   }
}

 sendBtn.onclick = async () => {
    const message = userInput.value.trim();
    if (message === "") return;
    addMessage(message,"user-message");
    userInput.value= ""

    const typingDiv = showTyping();

    const botReplay = await getbotreplay(message);
    typingDiv.remove();
    addMessage(botReplay,"bot-message");

    localStorage.setItem("chatHistory",chatbox.innerHTML);

 }

 userInput.addEventListener("keypress",(e)=> {
    if (e.key === "Enter") sendBtn.click();

 })
