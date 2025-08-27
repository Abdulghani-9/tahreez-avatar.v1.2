// Knowledge base with simple Q&A pairs in English and Arabic
const knowledgeBase = [
  {
    patterns: [/what.*tahreez/i, /what does.*company do/i],
    en: "Tahreez is a system integrator established in 2020 that delivers advanced safety, security, communication, AIoT and audio‑visual solutions across Saudi Arabia.",
    ar: "طهريز هي شركة تكامل أنظمة تأسست في عام 2020 وتقدم حلولاً متقدمة في السلامة والأمن والاتصال وإنترنت الأشياء والأنظمة السمعية البصرية في المملكة العربية السعودية."
  },
  {
    patterns: [/who.*managing director/i, /who.*general manager/i],
    en: "Our Managing Director is Francesco Fidicaro.",
    ar: "المدير العام هو فرانشيسكو فيديكارو."
  },
  {
    patterns: [/who.*engineering director/i],
    en: "Our Engineering Director is Khalid Makki.",
    ar: "مدير الهندسة هو خالد مكي."
  },
  {
    patterns: [/who.*operations director/i],
    en: "Our Operations Director is Monzer Dannouni.",
    ar: "مدير العمليات هو منذر دنوني."
  },
  {
    patterns: [/mission/i],
    en: "Our mission is to enable safer, smarter cities and industries by integrating technology with purpose and delivering scalable, future‑proof solutions.",
    ar: "مهمتنا هي تمكين المدن والقطاعات لتكون أكثر أماناً وذكاءً من خلال دمج التكنولوجيا مع الغاية وتقديم حلول قابلة للتطوير للمستقبل."
  },
  {
    patterns: [/services|what.*offer/i],
    en: "We offer security systems, audio‑visual and ICT integration, AIoT solutions, and specialized systems such as Infant Protection and Nurse Call Systems.",
    ar: "نحن نقدم أنظمة الأمن والدمج السمعي البصري وأنظمة إنترنت الأشياء، بالإضافة إلى حلول خاصة مثل أنظمة حماية الرضع وأنظمة النداء التمريضي."
  }
];

// Detect if the query contains Arabic characters
function isArabic(text) {
  return /[\u0600-\u06FF]/.test(text);
}

function findAnswer(query, lang) {
  for (const entry of knowledgeBase) {
    for (const pat of entry.patterns) {
      if (pat.test(query)) {
        return lang === 'ar' ? entry.ar : entry.en;
      }
    }
  }
  // default fallback
  if (lang === 'ar') {
    return "آسف، لم أفهم سؤالك. هل يمكنك إعادة صياغته؟";
  }
  return "I'm sorry, I didn't understand your question. Could you please rephrase?";
}

// Text-to-speech using Web Speech API
function speak(text, lang) {
  if (!('speechSynthesis' in window)) {
    console.log('Speech synthesis not supported');
    return;
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
  utter.onstart = () => {
    document.getElementById('avatarContainer').classList.add('talking');
  };
  utter.onend = () => {
    document.getElementById('avatarContainer').classList.remove('talking');
  };
  speechSynthesis.speak(utter);
}

function appendMessage(sender, text) {
  const log = document.getElementById('chatLog');
  const div = document.createElement('div');
  div.className = sender;
  div.textContent = text;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function handleQuery() {
  const input = document.getElementById('userInput');
  const query = input.value.trim();
  if (!query) return;
  const lang = isArabic(query) ? 'ar' : 'en';
  appendMessage('user', query);
  const answer = findAnswer(query.toLowerCase(), lang);
  appendMessage('bot', answer);
  speak(answer, lang);
  input.value = '';
}

document.getElementById('sendBtn').addEventListener('click', handleQuery);

document.getElementById('userInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    handleQuery();
  }
});

// Start camera & microphone
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const videoElem = document.getElementById('cameraView');
    videoElem.srcObject = stream;
    videoElem.play();
    // Additional processing for face tracking and speech-to-text could be added here
    alert('Camera & microphone started. (In this demo, audio is only used for permissions.)');
  } catch (err) {
    console.error('Error accessing media devices:', err);
    alert('Unable to access camera or microphone. Please allow permissions.');
  }
}

document.getElementById('startBtn').addEventListener('click', startCamera);
