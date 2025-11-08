// Chatbot logic for The Real Connect

// Example resources database for demo (expand as needed)
const resources = [
  {
    tags: ["therapy", "mental health", "counseling"],
    message: "Find mental health support here:<br><ul><li><a href='https://www.mentalhealth.gov/get-help' target='_blank'>National Mental Health Services</a></li><li>Contact local clinics or search for 'therapist near me' on <a href='https://www.psychologytoday.com/us/therapists' target='_blank'>Psychology Today</a></li></ul>"
  },
  {
    tags: ["food", "groceries", "pantry", "eat", "meals"],
    message: "Looking for food support? Try:<br><ul><li><a href='https://www.feedingamerica.org/find-your-local-foodbank' target='_blank'>Find Your Local Food Bank</a></li><li>Call 211 for local food distribution sites.</li></ul>"
  },
  {
    tags: ["shelter", "housing", "homeless", "emergency shelter"],
    message: "Housing and shelter resources:<br><ul><li><a href='https://www.hud.gov/findshelter' target='_blank'>Find Shelter (HUD)</a></li><li>Local agencies can help with rental and emergency assistance – try 211.</li></ul>"
  },
  {
    tags: ["job", "jobs", "work", "employment"],
    message: "Job and skill-building resources:<br><ul><li><a href='https://www.careeronestop.org/' target='_blank'>CareerOneStop</a></li><li><a href='https://www.indeed.com/' target='_blank'>Search for Jobs</a></li></ul>"
  },
  {
    tags: ["education", "training", "skills", "workshops"],
    message: "Education and training:<br><ul><li><a href='https://www.coursera.org/' target='_blank'>Free Online Courses (Coursera)</a></li><li>Check local library calendars for in-person workshops.</li></ul>"
  },
  {
    tags: ["testing", "covid", "health center"],
    message: "Testing and health services:<br><ul><li><a href='https://www.hhs.gov/coronavirus/community-based-testing-sites/index.html' target='_blank'>COVID-19 Testing Sites</a></li><li>Search 'community health center near me'.</li></ul>"
  },
];

// Simple matcher: checks for keyword in input
function findResourceReply(text) {
  const lower = text.toLowerCase();
  for (const item of resources) {
    if (item.tags.some(tag => lower.includes(tag))) {
      return item.message;
    }
  }
  return "I'm here to help! Please let me know if you need support with wellness, essentials, jobs, education, or community resources.";
}

function appendMessage(content, who) {
  const msg = document.createElement('div');
  const msgs = document.getElementById("chatbot-messages")
  msg.className = `chatbot-message ${who}`;
  msg.textContent = content;
  msgs.appendChild(msg);
  msgs.scrollTop = msgs.scrollHeight;
}

// Basic interaction/submit handler
window.handleChat = async function (e) {
  e.preventDefault();
  const input = document.getElementById('chatbot-input');
  const subBtn = document.getElementById("chatbot-submit");
  const page = window.location.pathname.split("/").pop();


  const text = input.value.trim();
  if (!text) return;
  if (page === "index.html" || page === "") {
    sessionStorage.setItem("message", text);
    window.location.href = 'bot.html';
    return
  }

  appendMessage(text, "user")
  input.value = '';
  subBtn.disabled = true;

  const fallback = findResourceReply(text);

  const history = [{ role: "system", content: "You are a helpful, concise assistant connecting people to verified, factual resources for their problems and issues." }];
  history.push({ role: "user", content: text });
  
  try {
    const res = await fetch("/api/chat", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      }, 
      body: JSON.stringify({messages: history})
    });
    if (!res.ok) throw new Error("Network Error");
    const data = await res.json();
    console.log("API Response:", data);
    const reply = data.reply || fallback || "(no response)";
    history.push({role: "assistant", content: reply})
    appendMessage(reply, "bot")
  }
  catch (err){
    console.error(err);

    appendMessage(err.message, "bot");  
  }
  finally{
    subBtn.disabled = false;
  }
};

