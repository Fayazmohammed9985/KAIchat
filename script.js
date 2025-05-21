const chatInput=document.querySelector("#typing-input")
const sendBtn=document.querySelector(".send-btn")
const chatcontainer=document.querySelector(".container")

var input=null;
const createElement=(html,className)=>{
    const newdiv=document.createElement('div');
    newdiv.classList.add("chat",className)
    newdiv.innerHTML=html;
    return newdiv;
}
// const loadDataFromLocal=()=>{
//   chatcontainer.innerHTML=localStorage.getItem("all-chats");
// }
// loadDataFromLocal();
const handleOutgoingtext=()=>{
    input=chatInput.value.trim();
const html=`<div class="chat-content you-chat my-3">
  <div class="chat-details">
    <img src="images/you.png" alt="you" height="50px" width="50px" class="mb-2">
    <p style="padding-top:10px">${input}</p>
  </div>
</div>
`
      const outgoing=createElement(html,"outgoing")
      chatcontainer.appendChild(outgoing)
      chatcontainer.scrollTop = chatcontainer.scrollHeight;
      setTimeout(showTypingDots,500)
      chatInput.value = "";

}
const copysymbol=(copyBtn)=>{
  const responseText=copyBtn.parentElement.querySelector("p");
  navigator.clipboard.writeText(responseText.textContent);
  copyBtn.classList.remove("fa-copy"); 
  copyBtn.classList.add("fa-check")
  setTimeout(()=>{
    copyBtn.classList.remove("fa-check");
    copyBtn.classList.add("fa-copy");
  },1000);
}

const showTypingDots=()=>{
  const dots= `<div class="chat-content">
        <div class="chat-details">
          <img src="images/kai.png" alt="kai" height="50px" width="50px" class="mb-2">
          <div class="typing-animation">
            <div class="typing-dot" style="--delay:0.2s"></div>
            <div class="typing-dot" style="--delay:0.3s"></div>
            <div class="typing-dot"style="--delay:0.4s"></div>
          </div>
        </div>
        </div>`
        const incomingDots=createElement(dots,"incoming")
        chatcontainer.appendChild(incomingDots)
        getResponse(input, incomingDots);
      }
  const getResponse = async (input, incomingDots) => {
    const resElement=document.createElement('p');

   try {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are Karthik, a helpful AI assistant" },
          { role: "user", content: input }
        ]
      })
    });
    const data = await response.json();
    const rawText = data.choices[0].message.content;

    if (rawText.includes("```")) {
      const codeContent = rawText.match(/```(?:[a-z]*)\n([\s\S]*?)```/);
      if (codeContent) {
        resElement.innerHTML = `<pre><code>${codeContent[1]}</code></pre>`;
      } else {
        resElement.innerHTML = rawText.replace(/\n/g, "<br>");
      }
    } else {
      resElement.innerHTML = rawText.replace(/\n/g, "<br>");
    }

  } catch (err) {
    console.error(err);
    resElement.textContent="Something went wrong.Please try again."
  }
  incomingDots.querySelector(".typing-animation").remove();
  incomingDots.querySelector(".chat-details").appendChild(resElement)
setTimeout(() => {
  chatcontainer.scrollTop = chatcontainer.scrollHeight;
}, 100);
  // localStorage.setItem("all-chats",chatcontainer.innerHTML);

  const copyBtn = document.createElement("i");
  copyBtn.className = "fa-regular fa-copy copy-btn mt-2 ms-2";
  copyBtn.style.cursor = "pointer";
  copyBtn.title = "Copy";
  incomingDots.appendChild(copyBtn);

  copyBtn.addEventListener("click", () => copysymbol(copyBtn));
}

sendBtn.addEventListener('click',handleOutgoingtext)
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) { // Shift+Enter allows new line
    e.preventDefault(); // prevent newline
    handleOutgoingtext();
  }
});
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const sunIconClass = "uil-sun";
const moonIconClass = "uil-moon";

const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? "dark" : "light";

const getCurrentIcon = () =>
  themeButton.classList.contains(sunIconClass) ? "uil-sun" : "uil-moon";

if (selectedTheme) {
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](darkTheme);

  themeButton.classList.remove(sunIconClass, moonIconClass);
  themeButton.classList.add(selectedIcon);
}

themeButton.addEventListener("click", () => {
  document.body.classList.toggle(darkTheme);

  if (themeButton.classList.contains(moonIconClass)) {
    themeButton.classList.remove(moonIconClass);
    themeButton.classList.add(sunIconClass);
  } else {
    themeButton.classList.remove(sunIconClass);
    themeButton.classList.add(moonIconClass);
  }

  // Save the current theme and icon to localStorage
  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});



const micBtn = document.getElementById("mic-btn");

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  micBtn.addEventListener("click", () => {
    recognition.start();
  });

  recognition.onresult = (event) => {
    const speechToText = event.results[0][0].transcript;
    chatInput.value = speechToText;
    handleOutgoingtext();  // auto-send the message
  };

  recognition.onerror = (event) => {
    alert("Speech recognition error: " + event.error);
  };
} else {
  micBtn.style.display = "none"; // Hide mic if not supported
}


const speakBtn = document.getElementById("speak-btn");

speakBtn.addEventListener("click", () => {
  const lastResponse = document.querySelector(".incoming:last-child p");
  if (lastResponse) {
    const utterance = new SpeechSynthesisUtterance(lastResponse.textContent);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  }
});

