// ===== NAVBAR: shrink on scroll =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== TYPED TEXT EFFECT =====
const roles = ['AI/ML Engineer', 'Agentic AI Developer', 'RAG Systems Builder', 'Research Engineer', 'LLM Systems Architect'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-text');

function typeEffect() {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    typedEl.textContent = currentRole.substring(0, charIndex--);
  } else {
    typedEl.textContent = currentRole.substring(0, charIndex++);
  }

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === currentRole.length + 1) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 300;
  }

  setTimeout(typeEffect, delay);
}

typeEffect();

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll(
  '.stat-card, .skill-card, .project-card, .contact-item, .about-text, .about-stats'
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObserver.observe(el);
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) return;

  const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  window.location.href = `mailto:sonirahulsr1@gmail.com?subject=${subject}&body=${body}`;

  contactForm.reset();
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.style.color = scrollY >= top && scrollY < top + height
        ? 'var(--primary)'
        : '';
    }
  });
});

// ===== CHAT WIDGET =====
(function () {
  const trigger   = document.getElementById('chatTrigger');
  const window_   = document.getElementById('chatWindow');
  const closeBtn  = document.getElementById('chatClose');
  const minBtn    = document.getElementById('chatMinimize');
  const maxBtn    = document.getElementById('chatMaximize');
  const input     = document.getElementById('chatInput');
  const sendBtn   = document.getElementById('chatSend');
  const messages  = document.getElementById('chatMessages');

  let isMaximized = false;

  // Open / close
  trigger.addEventListener('click', () => {
    const isOpen = window_.classList.contains('open');
    window_.classList.toggle('open', !isOpen);
    if (!isOpen) {
      // Remove notification dot once opened
      const dot = trigger.querySelector('.chat-notification-dot');
      if (dot) dot.style.display = 'none';
      input.focus();
    }
  });

  closeBtn.addEventListener('click', () => window_.classList.remove('open'));

  // Minimize — close window but keep trigger
  minBtn.addEventListener('click', () => window_.classList.remove('open'));

  // Maximize / restore
  maxBtn.addEventListener('click', () => {
    isMaximized = !isMaximized;
    window_.classList.toggle('maximized', isMaximized);
    maxBtn.querySelector('i').className = isMaximized
      ? 'fas fa-compress-alt'
      : 'fas fa-expand-alt';
  });

  // Send message
  function sendMessage(text) {
    text = text.trim();
    if (!text) return;

    // User bubble
    appendMessage('user', text);
    input.value = '';

    // Typing indicator
    const typingEl = appendTyping();

    // Bot reply after delay
    setTimeout(() => {
      typingEl.remove();
      const reply = getBotReply(text);
      appendMessage('bot', reply);
      messages.scrollTop = messages.scrollHeight;
    }, 900 + Math.random() * 500);

    messages.scrollTop = messages.scrollHeight;
  }

  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage(input.value);
  });

  // Suggestion chips
  window.sendSuggestion = function (btn) {
    sendMessage(btn.textContent);
  };

  function appendMessage(role, html) {
    const wrapper = document.createElement('div');
    wrapper.className = `chat-msg ${role}`;
    if (role === 'bot') {
      wrapper.innerHTML = `
        <div class="chat-msg-avatar"><i class="fas fa-robot"></i></div>
        <div class="chat-msg-body">
          <div class="chat-msg-bubble">${html}</div>
          <div class="chat-msg-actions">
            <button class="chat-action-icon chat-tts-btn" title="Listen"><i class="fas fa-volume-up"></i></button>
            <button class="chat-action-icon chat-copy-btn" title="Copy"><i class="fas fa-copy"></i></button>
            <button class="chat-action-icon chat-thumb-up" title="Helpful"><i class="far fa-thumbs-up"></i></button>
            <button class="chat-action-icon chat-thumb-down" title="Not helpful"><i class="far fa-thumbs-down"></i></button>
          </div>
        </div>`;
      const plain = html.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ');
      wrapper.querySelector('.chat-tts-btn').addEventListener('click', function() {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          this.title = 'Listen';
          this.querySelector('i').className = 'fas fa-volume-up';
          this.classList.remove('active');
        } else {
          speakText(html);
          this.title = 'Stop';
          this.querySelector('i').className = 'fas fa-times';
          this.classList.add('active');
          // Reset icon when speech ends naturally
          const utt = window._currentUtt;
          if (utt) utt.onend = () => {
            this.title = 'Listen';
            this.querySelector('i').className = 'fas fa-volume-up';
            this.classList.remove('active');
          };
        }
      });
      wrapper.querySelector('.chat-copy-btn').addEventListener('click', function() {
        navigator.clipboard.writeText(plain).then(() => {
          this.title = 'Copied!';
          this.querySelector('i').className = 'fas fa-check';
          setTimeout(() => {
            this.title = 'Copy';
            this.querySelector('i').className = 'fas fa-copy';
          }, 1500);
        });
      });
      wrapper.querySelector('.chat-thumb-up').addEventListener('click', function() {
        const wasActive = this.classList.contains('active');
        this.classList.toggle('active');
        this.querySelector('i').className = wasActive ? 'far fa-thumbs-up' : 'fas fa-thumbs-up';
        const down = wrapper.querySelector('.chat-thumb-down');
        down.classList.remove('active');
        down.querySelector('i').className = 'far fa-thumbs-down';
      });
      wrapper.querySelector('.chat-thumb-down').addEventListener('click', function() {
        const wasActive = this.classList.contains('active');
        this.classList.toggle('active');
        this.querySelector('i').className = wasActive ? 'far fa-thumbs-down' : 'fas fa-thumbs-down';
        const up = wrapper.querySelector('.chat-thumb-up');
        up.classList.remove('active');
        up.querySelector('i').className = 'far fa-thumbs-up';
      });
    } else {
      wrapper.innerHTML = `<div class="chat-msg-bubble">${escapeHtml(html)}</div>`;
    }
    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
    return wrapper;
  }

  function appendTyping() {
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-msg bot chat-typing';
    wrapper.innerHTML = `
      <div class="chat-msg-avatar"><i class="fas fa-robot"></i></div>
      <div class="chat-msg-bubble">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>`;
    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
    return wrapper;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, c =>
      ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // ---- Knowledge base ----
  function getBotReply(msg) {
    const q = msg.toLowerCase();

    if (/research|paper|thesis|arxiv|zenodo|ssrn|corl/i.test(q)) {
      return `Rahul has <strong>5 research publications</strong>:<br>
        1. <a href="https://arxiv.org/abs/2603.27008" target="_blank" style="color:#93c5fd">RASPRef</a> — Prompt refinement for LRMs (arXiv)<br>
        2. <a href="https://zenodo.org/records/21012614" target="_blank" style="color:#93c5fd">Grounded Stateful AI</a> — Hallucination mitigation (Zenodo)<br>
        3. AI Hype Cycle — Reddit discourse analysis (UTSA)<br>
        4. <a href="https://ssrn.com/abstract=6760599" target="_blank" style="color:#93c5fd">HIPAA PHI Detection</a> — 99.8% accuracy (SSRN)<br>
        5. DASA-HR — Safe RL for humanoid robots (CoRL 2026)`;
    }
    if (/skill|tech|stack|language|framework|tool/i.test(q)) {
      return `Key skills:<br>
        🤖 <strong>Agentic AI:</strong> LangGraph, RAG, AutoGen, CrewAI, FAISS<br>
        🧠 <strong>ML:</strong> PyTorch, XGBoost, Hugging Face, SentenceTransformers<br>
        ☁️ <strong>Cloud:</strong> AWS (SageMaker, Bedrock, Lambda), Docker, Kubernetes<br>
        💾 <strong>DB:</strong> PostgreSQL + pgvector, MySQL<br>
        🗣 <strong>Speech AI:</strong> Whisper, Amazon Transcribe & Polly`;
    }
    if (/experience|work|job|company|wynbit|valiant|wipro|google/i.test(q)) {
      return `Work history:<br>
        🔵 <strong>Wynbit Inc</strong> — Associate Agentic AI Engineer (Jan 2025–Present)<br>
        Built KOA multi-agent platform with LangGraph + FastAPI<br><br>
        🔵 <strong>Valiant Tek</strong> — ML Engineer Intern (May 2024–Jan 2025)<br>
        Risk engine, XGBoost pipelines, AWS SageMaker<br><br>
        🔵 <strong>Wipro / Google</strong> — Associate Risk Analyst (Aug–Dec 2021)<br>
        Google Payments fraud detection`;
    }
    if (/education|degree|university|gpa|illinois|uis/i.test(q)) {
      return `🎓 <strong>MS in Management Information Systems</strong><br>
        University of Illinois at Springfield<br>
        Aug 2022 – Mar 2024 · <strong>GPA: 4.0 / 4.0</strong> 🏆<br><br>
        🏅 Student Employee of the Month — January 2024`;
    }
    if (/cert|aws|credly|credential/i.test(q)) {
      return `Rahul holds <strong>9 certifications</strong>, including:<br>
        ✅ AWS ML Specialty<br>
        ✅ AWS Generative AI Developer – Professional (Early Adopter)<br>
        ✅ AWS AI Practitioner<br>
        ✅ PCEP Python<br>
        <a href="https://www.credly.com/users/rahul-soni.eb6abc6d" target="_blank" style="color:#93c5fd">View all on Credly →</a>`;
    }
    if (/contact|email|reach|hire|available/i.test(q)) {
      return `📧 <a href="mailto:sonirahulsr1@gmail.com" style="color:#93c5fd">sonirahulsr1@gmail.com</a><br>
        💼 <a href="https://www.linkedin.com/in/srahul5/" target="_blank" style="color:#93c5fd">LinkedIn</a><br>
        💻 <a href="https://github.com/Sonirahul7" target="_blank" style="color:#93c5fd">GitHub</a><br>
        📚 <a href="https://scholar.google.com/citations?user=A-ebMZoAAAAJ" target="_blank" style="color:#93c5fd">Google Scholar</a>`;
    }
    if (/hi|hello|hey|sup/i.test(q)) {
      return `Hey there! 👋 I'm <strong>Soni AI</strong>, Rahul's portfolio assistant.<br>
        Ask me about his research, skills, experience, or how to contact him!`;
    }
    if (/rag|agentic|langraph|llm|agent/i.test(q)) {
      return `Rahul specializes in <strong>Agentic AI & RAG</strong>:<br>
        • Built a production multi-agent platform (KOA) using LangGraph + FastAPI<br>
        • Designed semantic routing with FAISS + SentenceTransformers<br>
        • Integrated Ollama/Mistral, OpenAI, and voice AI (Transcribe + Polly)<br>
        • Published on hallucination mitigation in LLMs (Zenodo)`;
    }
    return `Great question! For detailed info, feel free to reach out directly:<br>
      <a href="mailto:sonirahulsr1@gmail.com" style="color:#93c5fd">sonirahulsr1@gmail.com</a><br><br>
      Or try asking about: <em>research, skills, experience, education, certifications, or contact</em>.`;
  }

  // ===== TTS: speak bot replies =====
  function speakText(text) {
    if (!window.speechSynthesis) return;
    const plain = text.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ');
    const utt = new SpeechSynthesisUtterance(plain);
    utt.rate = 1;
    utt.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
    window._currentUtt = utt;
  }

  // ===== STT: microphone input =====
  const micBtn = document.getElementById('chatMic');
  if (micBtn && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    let listening = false;

    micBtn.addEventListener('click', () => {
      if (listening) { recognition.stop(); } else { recognition.start(); }
    });

    recognition.addEventListener('start', () => {
      listening = true;
      micBtn.classList.add('listening');
      micBtn.querySelector('i').className = 'fas fa-microphone-slash';
    });

    recognition.addEventListener('end', () => {
      listening = false;
      micBtn.classList.remove('listening');
      micBtn.querySelector('i').className = 'fas fa-microphone';
    });

    recognition.addEventListener('result', (e) => {
      const transcript = e.results[0][0].transcript;
      input.value = transcript;
      sendMessage(transcript);
    });

    recognition.addEventListener('error', () => {
      listening = false;
      micBtn.classList.remove('listening');
      micBtn.querySelector('i').className = 'fas fa-microphone';
    });
  } else if (micBtn) {
    micBtn.title = 'Voice input not supported in this browser';
    micBtn.style.opacity = '0.4';
    micBtn.style.cursor = 'not-allowed';
  }

})();
