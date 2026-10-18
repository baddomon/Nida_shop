/* ============================================================
   1. WEB AUDIO SYNTHESIZER (100% Offline Sound Effects)
   ============================================================ */
let audioCtx = null;
let soundEnabled = true;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

const SoundFX = {
  // Barcode scanner "beep"
  beep() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1760, ctx.currentTime);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  },

  // Cash Register bell "ding-ding" & coin
  cashRegister() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    [2093, 2637].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.6);
    });
  },

  // Realistic cartoon chewing & crunch sound ("กรุบ! กรับ! ง่ำ ๆๆ")
  munch() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    // Generate crisp textured crunch noise
    const bufferSize = Math.floor(ctx.sampleRate * 0.08);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.022));
    }

    // 4 distinct crispy chewing bites
    const bites = [
      { time: 0.00, noiseFreq: 2400, toneFreq: 340, vol: 0.35 },
      { time: 0.14, noiseFreq: 2000, toneFreq: 280, vol: 0.30 },
      { time: 0.28, noiseFreq: 1700, toneFreq: 250, vol: 0.28 },
      { time: 0.42, noiseFreq: 1400, toneFreq: 210, vol: 0.25 }
    ];

    bites.forEach(b => {
      const startTime = ctx.currentTime + b.time;

      // 1. Crisp texture burst
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(b.noiseFreq, startTime);
      filter.Q.setValueAtTime(3.2, startTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(b.vol, startTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.06);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(startTime);
      noise.stop(startTime + 0.07);

      // 2. Chomp mouth body resonance
      const osc = ctx.createOscillator();
      const toneGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(b.toneFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(80, startTime + 0.07);

      toneGain.gain.setValueAtTime(b.vol * 0.6, startTime);
      toneGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.07);

      osc.connect(toneGain);
      toneGain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.08);
    });

    // 3. Cute swallow gulp sound at the end
    const swallowTime = ctx.currentTime + 0.54;
    const swallowOsc = ctx.createOscillator();
    const swallowGain = ctx.createGain();
    swallowOsc.type = 'sine';
    swallowOsc.frequency.setValueAtTime(280, swallowTime);
    swallowOsc.frequency.exponentialRampToValueAtTime(540, swallowTime + 0.08);
    swallowGain.gain.setValueAtTime(0.18, swallowTime);
    swallowGain.gain.exponentialRampToValueAtTime(0.001, swallowTime + 0.1);
    swallowOsc.connect(swallowGain);
    swallowGain.connect(ctx.destination);
    swallowOsc.start(swallowTime);
    swallowOsc.stop(swallowTime + 0.1);
  },

  // Boing spring sound
  boing() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.22);
    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  },

  // Giggle melody
  giggle() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [659, 784, 880, 1046];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.06 + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.06);
      osc.stop(ctx.currentTime + idx * 0.06 + 0.11);
    });
  },

  // Celebration fanfare
  fanfare() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const chord = [523.25, 659.25, 783.99, 1046.5];
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.09);
      osc.stop(ctx.currentTime + idx * 0.09 + 0.7);
    });
  }
};

/* ============================================================
   2. CONFETTI & VISUAL PARTICLES
   ============================================================ */
const canvas = document.getElementById('confettiCanvas');
const cCtx = canvas.getContext('2d');
let confettiPieces = [];
let animFrame = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

/* v2.9: size the app to the *visible* viewport so mobile browser toolbars/tab bars never cover the bottom */
function setAppHeight() {
  const vv = window.visualViewport;
  const h = Math.round(vv ? vv.height : window.innerHeight);
  if (h > 0) document.documentElement.style.setProperty('--app-h', h + 'px');
  resizeCanvas();
}
if (window.visualViewport) window.visualViewport.addEventListener('resize', setAppHeight);
window.addEventListener('resize', setAppHeight);
window.addEventListener('orientationchange', () => setTimeout(setAppHeight, 250));
setAppHeight();

function launchConfetti(count = 45, ox = null, oy = null) {
  const colors = ['#ff65a5', '#ffbe3b', '#48dbfb', '#1dd1a1', '#ff9ff3', '#feca57'];
  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x: (ox !== null ? ox : canvas.width / 2) + (Math.random() - 0.5) * 160,
      y: (oy !== null ? oy : canvas.height * 0.35) + (Math.random() - 0.5) * 80,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 12 - 4,
      size: Math.random() * 10 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      shape: Math.random() > 0.4 ? 'circle' : 'rect'
    });
  }
  if (!animFrame) updateConfetti();
}

function updateConfetti() {
  cCtx.clearRect(0, 0, canvas.width, canvas.height);
  confettiPieces.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.35;
    p.rotation += p.vRot;

    cCtx.save();
    cCtx.translate(p.x, p.y);
    cCtx.rotate((p.rotation * Math.PI) / 180);
    cCtx.fillStyle = p.color;

    if (p.shape === 'circle') {
      cCtx.beginPath();
      cCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      cCtx.fill();
    } else {
      cCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    }
    cCtx.restore();
  });

  confettiPieces = confettiPieces.filter(p => p.y < canvas.height + 40);
  if (confettiPieces.length > 0) {
    animFrame = requestAnimationFrame(updateConfetti);
  } else {
    animFrame = null;
    cCtx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function createFlyingEmoji(content, startX, startY, endX, endY, onComplete) {
  const el = document.createElement('div');
  el.className = 'flying-particle';
  if (typeof content === 'string' && content.includes('<svg')) {
    el.innerHTML = content;
    const svg = el.querySelector('svg');
    if (svg) { svg.style.width = '38px'; svg.style.height = '38px'; }
  } else {
    el.textContent = content;
  }
  el.style.left = startX + 'px';
  el.style.top = startY + 'px';
  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.style.left = endX + 'px';
    el.style.top = endY + 'px';
    el.style.transform = 'scale(1.4) rotate(20deg)';
    el.style.opacity = '0.9';
  });

  setTimeout(() => {
    el.remove();
    if (onComplete) onComplete();
  }, 550);
}

/* ============================================================
   3. SPEECH SYNTHESIS & CHARACTER CONTROLLER
   ============================================================ */
const $ = id => document.getElementById(id);
let voices = [];
let currentAction = 1;
let currentText = "ยินดีต้อนรับสู่ร้านน้องนิดาค่ะ 💕";
let actionTimer = null;
let mouthTimer = null;
let currentCharMode = 'vector'; // 'vector' or '3d'
const voiceAvailable = ('speechSynthesis' in window) && ('SpeechSynthesisUtterance' in window);

function loadVoices() {
  if (!voiceAvailable) return;
  voices = speechSynthesis.getVoices();
}
if (voiceAvailable) {
  loadVoices();
  speechSynthesis.addEventListener('voiceschanged', loadVoices);
}

function startSpeakingState() {
  $('stage').classList.add('speaking');
  // Animate mouth on vector character
  const smile = $('smile');
  const open = $('open');
  if (smile && open) {
    smile.style.display = 'none';
    open.style.display = '';
    clearInterval(mouthTimer);
    mouthTimer = setInterval(() => {
      const o = Math.random();
      const mouthE = $('mouthE');
      const tongue = $('tongue');
      if (mouthE) {
        mouthE.setAttribute('ry', 7 + o * 14);
        mouthE.setAttribute('rx', 18 + (1 - o) * 8);
      }
      if (tongue) {
        tongue.setAttribute('ry', 3 + o * 4);
      }
    }, 120);
  }
}

function stopSpeakingState() {
  $('stage').classList.remove('speaking');
  clearInterval(mouthTimer);
  mouthTimer = null;
  const smile = $('smile');
  const open = $('open');
  if (smile && open) {
    open.style.display = 'none';
    smile.style.display = '';
  }
}

function stopAll() {
  clearTimeout(actionTimer);
  stopSpeakingState();
  $('stage').className = 'stage';
  $('happyEyes').style.display = 'none';
  $('sleepyEyes').style.display = 'none';
}

let speakToken = 0, pendingFinish = null, noThaiHinted = false;
const hasThaiVoice = () => voices.some(v => /^th(-|_|$)/i.test(v.lang));

function showNoThaiHint() {
  if (noThaiHinted) return;
  noThaiHinted = true;
  const h = document.createElement('div');
  h.id = 'voiceHint';
  h.style.cssText = 'font-size:12px;text-align:center;color:#a0527a;margin-top:4px;';
  h.textContent = 'เครื่องนี้ยังไม่มีเสียงพูดภาษาไทย (ติดตั้งได้ที่ตั้งค่าเครื่อง > เสียงพูด) ตอนนี้น้องนิดาจะพูดเป็นตัวหนังสือแทนนะคะ';
  $('bubble').insertAdjacentElement('afterend', h);
}

function speakText(text, pitch = 1.45, rate = 0.88, onDone = null) {
  currentText = text;
  $('bubble').textContent = text;
  clearTimeout(actionTimer);
  const token = ++speakToken;
  // Finish any interrupted previous utterance (runs its onDone once, without stopping the new one)
  if (pendingFinish) { const f = pendingFinish; pendingFinish = null; f(); }
  if (voiceAvailable) speechSynthesis.cancel();
  if (voiceAvailable && !voices.length) loadVoices();

  let ended = false;
  const finish = () => {
    if (ended) return;
    ended = true;
    if (pendingFinish === finish) pendingFinish = null;
    if (token === speakToken) stopAll();
    if (onDone) onDone();
  };
  pendingFinish = finish;
  const silentMode = () => {
    if (token !== speakToken) return;
    startSpeakingState();
    clearTimeout(actionTimer);
    actionTimer = setTimeout(finish, Math.max(2000, text.length * 105));
  };

  // No speech engine, or voices are loaded but none is Thai -> text + mouth animation only
  const noThai = voiceAvailable && voices.length > 0 && !hasThaiVoice();
  if (!voiceAvailable || noThai) {
    if (noThai) showNoThaiHint();
    silentMode();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'th-TH';
  const thaiVoice = voices.find(v => /^th(-|_|$)/i.test(v.lang));
  if (thaiVoice) utterance.voice = thaiVoice;
  utterance.pitch = pitch;
  utterance.rate = rate;
  utterance.volume = 1;

  utterance.onstart = () => {
    if (token !== speakToken) return;
    startSpeakingState();
    clearTimeout(actionTimer);
    // Safety net: some browsers never fire onend for long/paused utterances
    actionTimer = setTimeout(finish, text.length * 220 + 4000);
  };
  utterance.onend = finish;
  utterance.onerror = (e) => {
    if (e && (e.error === 'interrupted' || e.error === 'canceled')) return;
    silentMode();
  };

  speechSynthesis.speak(utterance);
  // Watchdog: engine never started (e.g. iOS blocked it) -> fall back to silent animation
  actionTimer = setTimeout(() => { if (!ended && token === speakToken) silentMode(); }, 1600);
}

// Stop talking when the app goes to background
document.addEventListener('visibilitychange', () => { if (document.hidden) stopAll(); });

/* ============================================================
   CHARACTER SWITCHER (Vector Animated <-> 3D Photo)
   ============================================================ */
function setCharacterMode(mode) {
  currentCharMode = mode;
  const viewVector = $('viewVector');
  const view3D = $('view3D');
  const btn = $('charToggleBtn');

  if (mode === 'vector') {
    viewVector.style.display = 'flex';
    view3D.style.display = 'none';
    btn.innerHTML = '🎨<span class="lbl"> น้องขยับได้</span>';
    btn.title = 'แตะเพื่อเปลี่ยนเป็นน้อง 3D';
  } else {
    viewVector.style.display = 'none';
    view3D.style.display = 'flex';
    btn.innerHTML = '🐰<span class="lbl"> น้อง 3D</span>';
    btn.title = 'แตะเพื่อเปลี่ยนเป็นน้องขยับได้';
  }
  try { localStorage.setItem('nida_char_mode', mode); } catch(e){}
}

$('charToggleBtn').addEventListener('click', () => {
  SoundFX.boing();
  const nextMode = currentCharMode === 'vector' ? '3d' : 'vector';
  setCharacterMode(nextMode);
  speakText(nextMode === 'vector' ? "นิดาพร้อมขยับตัวเล่นกับหนูแล้วค่ะ!" : "นี่คือรูปน้องนิดาแบบสามมิตินะคะ!");
});

// Restore saved preference
try {
  const saved = localStorage.getItem('nida_char_mode');
  if (saved) setCharacterMode(saved);
} catch(e){}

/* ============================================================
   SVG ICONS (Guaranteed to display on all Windows/Mobile versions)
   ============================================================ */
const ICONS = {
  carrot: `<svg viewBox="0 0 36 36" class="ui-svg"><path d="M22 4 C24 1 30 1 31 5 C35 7 34 13 30 14 C26 15 23 11 22 4 Z" fill="#3ec992"/><path d="M7 32 C5 34 3 33 4 30 C7 23 23 7 28 8 C32 10 30 18 25 22 Z" fill="#ff7a18"/><path d="M18 15 L22 17 M13 20 L18 23 M8 26 L12 28" stroke="#d95a00" stroke-width="2" stroke-linecap="round"/></svg>`,
  cart: `<svg viewBox="0 0 36 36" class="ui-svg"><path d="M6 6 L10 6 L14 23 L28 23 L31 11 L12 11" fill="none" stroke="#ff65a5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16" cy="28" r="3" fill="#ff65a5"/><circle cx="26" cy="28" r="3" fill="#ff65a5"/></svg>`,
  milk: `<svg viewBox="0 0 36 36" class="ui-svg"><path d="M13 13 L23 13 L21 4 L15 4 Z" fill="#90caf9"/><path d="M10 13 L26 13 L25 33 L11 33 Z" fill="#e3f2fd" stroke="#64b5f6" stroke-width="2"/><rect x="13" y="17" width="10" height="9" rx="2" fill="#bbdefb"/><text x="18" y="24" font-size="7" font-weight="900" text-anchor="middle" fill="#1976d2">MILK</text></svg>`,
  bear: `<svg viewBox="0 0 36 36" class="ui-svg"><circle cx="10" cy="11" r="6" fill="#c68a4c"/><circle cx="10" cy="11" r="3" fill="#ffb8d2"/><circle cx="26" cy="11" r="6" fill="#c68a4c"/><circle cx="26" cy="11" r="3" fill="#ffb8d2"/><circle cx="18" cy="20" r="13" fill="#d49b5c"/><ellipse cx="18" cy="24" rx="6" ry="4.5" fill="#fff1d0"/><circle cx="18" cy="22" r="2" fill="#3e2723"/><circle cx="14" cy="18" r="2.2" fill="#3e2723"/><circle cx="22" cy="18" r="2.2" fill="#3e2723"/></svg>`,
  cupcake: `<svg viewBox="0 0 36 36" class="ui-svg"><path d="M10 20 L12 32 C12 33 13 33.5 14 33.5 L22 33.5 C23 33.5 24 33 24 32 L26 20 Z" fill="#f8bbd0" stroke="#f48fb1" stroke-width="1.5"/><path d="M9 20 C7 16 11 13 14 15 C16 12 20 12 22 15 C25 13 29 16 27 20 Z" fill="#ff80ab"/><circle cx="18" cy="10" r="3.5" fill="#e91e63"/><path d="M19 7 C21 4 23 4 25 5" fill="none" stroke="#880e4f" stroke-width="1.5" stroke-linecap="round"/><circle cx="13" cy="17" r="1.2" fill="#fff"/><circle cx="18" cy="16" r="1.2" fill="#ffd54f"/><circle cx="23" cy="18" r="1.2" fill="#80d8ff"/></svg>`,
  tag: `<svg viewBox="0 0 36 36" class="ui-svg"><path d="M14 6 L28 20 C29 21 29 23 28 24 L24 28 C23 29 21 29 20 28 L6 14 L6 6 Z" fill="#ff70a6"/><circle cx="11" cy="11" r="2.5" fill="#fff"/></svg>`,
  chef: `<svg viewBox="0 0 36 36" class="ui-svg"><rect x="11" y="26" width="14" height="6" rx="2" fill="#eceff1" stroke="#b0bec5" stroke-width="1.2"/><path d="M11 26 C7 23 8 15 13 15 C14 9 22 9 23 15 C28 15 29 23 25 26 Z" fill="#ffffff" stroke="#b0bec5" stroke-width="1.5"/></svg>`,
  cap: `<svg viewBox="0 0 36 36" class="ui-svg"><path d="M8 22 C8 13 17 11 25 14 C28 15 31 18 31 22 Z" fill="#42a5f5"/><ellipse cx="14" cy="23" rx="10" ry="3.5" fill="#1e88e5"/><circle cx="19" cy="12" r="2" fill="#ffd54f"/></svg>`,
  wizard: `<svg viewBox="0 0 36 36" class="ui-svg"><ellipse cx="18" cy="28" rx="14" ry="4" fill="#7e57c2"/><path d="M11 27 L18 6 L25 27 Z" fill="#5e35b1"/><polygon points="18,12 19.5,15 23,15 20,17.5 21.5,21 18,18.5 14.5,21 16,17.5 13,15 16.5,15" fill="#ffd54f"/></svg>`,
  mustache: `<svg viewBox="0 0 36 36" class="ui-svg"><path d="M18 20 C16 15 9 15 6 21 C10 24 15 23 18 21 C21 23 26 24 30 21 C27 15 20 15 18 20 Z" fill="#5d4037"/></svg>`,
  scarf: `<svg viewBox="0 0 36 36" class="ui-svg"><path d="M8 17 C8 12 28 12 28 17 C28 22 8 22 8 17 Z" fill="#ff7043"/><path d="M21 17 L23 31 L17 31 L18 17 Z" fill="#e64a19"/><line x1="17" y1="31" x2="23" y2="31" stroke="#ffd54f" stroke-width="2" stroke-dasharray="1.5,1.5"/></svg>`,
  necklace: `<svg viewBox="0 0 36 36" class="ui-svg"><path d="M9 13 Q18 28 27 13" fill="none" stroke="#cfd8dc" stroke-width="2" stroke-dasharray="2.5,2.5"/><circle cx="18" cy="21.5" r="3.5" fill="#ff4081"/><circle cx="13" cy="18" r="2.2" fill="#fff"/><circle cx="23" cy="18" r="2.2" fill="#fff"/></svg>`,
  apron: `<svg viewBox="0 0 36 36" class="ui-svg"><path d="M14 9 L22 9 L22 14 L27 18 L25 31 L11 31 L9 18 L14 14 Z" fill="#80cbc4" stroke="#00897b" stroke-width="1.5"/><rect x="14.5" y="21" width="7" height="6" rx="1.5" fill="#4db6ac"/></svg>`,
  cape: `<svg viewBox="0 0 36 36" class="ui-svg"><path d="M13 10 L23 10 L30 30 L6 30 Z" fill="#e53935"/><path d="M18 10 L20 30 L16 30 Z" fill="#c62828"/><circle cx="18" cy="9.5" r="2.5" fill="#ffd54f"/></svg>`,
  wings: `<svg viewBox="0 0 36 36" class="ui-svg"><path d="M18 18 C13 7 3 9 5 18 C7 25 15 21 18 18 Z" fill="#b388ff" opacity="0.88"/><path d="M18 18 C23 7 33 9 31 18 C29 25 21 21 18 18 Z" fill="#b388ff" opacity="0.88"/><circle cx="18" cy="18" r="2.5" fill="#ff80ab"/></svg>`
};

/* ============================================================
   4. SHOPPING & PRODUCTS
   ============================================================ */
const PRODUCTS = [
  { id: 'berry', name: 'สตรอว์เบอร์รี', icon: '🍓', price: 5, talk: 'สตรอว์เบอร์รี หวานฉ่ำ อร่อยมากค่ะ!' },
  { id: 'carrot', name: 'แครอทสด', icon: ICONS.carrot, price: 2, talk: 'แครอทกรุบกรอบ ของโปรดกระต่ายเลย!' },
  { id: 'icecream', name: 'ไอศกรีม', icon: '🍦', price: 10, talk: 'ไอศกรีมหวานเย็น ชื่นใจที่สุดค่ะ!' },
  { id: 'milk', name: 'นมสดกล่อง', icon: ICONS.milk, price: 10, talk: 'นมสดดื่มแล้วแข็งแรง ตัวโตไว ๆ นะคะ!' },
  { id: 'cake', name: 'เค้กช็อกโกแลต', icon: '🍰', price: 20, talk: 'เค้กชิ้นโต น่ากินมากเลยค่ะ!' },
  { id: 'bear', name: 'ตุ๊กตาหมี', icon: ICONS.bear, price: 25, talk: 'น้องหมีนุ่มนิ่ม น่ารักจังเลย!' },
  { id: 'apple', name: 'แอปเปิ้ล', icon: '🍎', price: 5, talk: 'แอปเปิ้ลสีแดง สดใหม่จากสวนค่ะ!' },
  { id: 'candy', name: 'อมยิ้ม', icon: '🍭', price: 5, talk: 'อมยิ้มหวาน ๆ เพิ่มความสดใสค่ะ!' },
  { id: 'banana', name: 'กล้วยหอม', icon: '🍌', price: 3, talk: 'กล้วยหอมหวาน ให้พลังงานเยอะเลยค่ะ!' },
  { id: 'cookie', name: 'คุกกี้', icon: '🍪', price: 8, talk: 'คุกกี้กรอบ ๆ หอมเนยเลยค่ะ!' },
  { id: 'cupcake', name: 'คัพเค้ก', icon: ICONS.cupcake, price: 12, talk: 'คัพเค้กหน้าสวย หวานอร่อยค่ะ!' },
  { id: 'donut', name: 'โดนัท', icon: '🍩', price: 15, talk: 'โดนัทหน้าช็อกโกแลต นุ่มฟูเลยค่ะ!' }
];

let cart = [];

function renderProducts() {
  const shelf = $('productShelf');
  shelf.innerHTML = '';
  PRODUCTS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'prod-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <div class="prod-emoji">${p.icon}</div>
      <div class="prod-name">${p.name}</div>
      <div class="prod-price">${p.price}฿</div>
    `;
    card.addEventListener('click', (e) => addToCart(p, e));
    shelf.appendChild(card);
  });
}

function addToCart(product, event) {
  getAudioContext();
  SoundFX.beep();
  cart.push(product);
  updateCartDisplay();

  // Flying icon towards bunny
  const rect = event.currentTarget.getBoundingClientRect();
  const targetRect = $('stage').getBoundingClientRect();
  createFlyingEmoji(product.icon, rect.left + rect.width / 2, rect.top, targetRect.left + targetRect.width / 2, targetRect.top + targetRect.height * 0.6);

  // Character reaction
  $('stage').className = 'stage act-2';
  speakText(product.talk);
}

function updateCartDisplay() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  $('cartCount').textContent = `ตะกร้า: ${cart.length} ชิ้น`;
  $('cartTotal').textContent = `รวม: ${total} บาท`;
  $('tagText').textContent = `${total}฿`;
  if (total > 0) {
    $('tag').classList.add('show');
  } else {
    $('tag').classList.remove('show');
  }
}

let stars = 0;
try { stars = parseInt(localStorage.getItem('nida_stars') || '0', 10) || 0; } catch(e){}
function renderStars() { let b = $('starBadge'); if (!b) { b = document.createElement('div'); b.id = 'starBadge'; $('stage').appendChild(b); } b.textContent = '⭐ ' + stars; }

function checkout() {
  if (cart.length === 0) {
    SoundFX.boing();
    speakText("ยังไม่มีของในตะกร้าเลยค่ะ ลองแตะเลือกของก่อนนะคะหนู");
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const coins = [20, 50, 100, 500].filter(c => c >= total).slice(0, 3);
  $('payTitle').textContent = `รวม ${total} บาท หนูจ่ายเท่าไหร่คะ?`;
  $('payChoices').innerHTML = '';
  coins.forEach(c => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'pay-coin'; b.textContent = c + '฿';
    b.addEventListener('click', () => { $('payOverlay').classList.remove('show'); finishCheckout(total, c - total); });
    $('payChoices').appendChild(b);
  });
  $('payOverlay').classList.add('show');
  SoundFX.boing();
  speakText(`รวม ${total} บาทค่ะ หนูจ่ายเงินเท่าไหร่คะ`);
}

function finishCheckout(total, change) {
  getAudioContext();
  SoundFX.cashRegister();
  setTimeout(SoundFX.fanfare, 280);
  launchConfetti(55);
  stars++;
  try { localStorage.setItem('nida_stars', String(stars)); } catch(e){}
  renderStars();

  $('stage').className = 'stage act-3';
  $('tag').classList.add('show');

  const changeTxt = change > 0 ? ` ทอนเงิน ${change} บาทค่ะ` : ' จ่ายพอดีเลยค่ะ เก่งมาก';
  const praises = [
    `คิดเงินเรียบร้อย รวม ${total} บาท${changeTxt} ขอบคุณลูกค้าน่ารักนะคะ!`,
    `ทั้งหมด ${total} บาทค่ะ${changeTxt} ขอให้ทานให้อร่อยนะคะ`,
    `เย้ ซื้อของครบแล้ว ${total} บาท${changeTxt} ขอบคุณน้องนิดามากค่ะ!`
  ];
  let msg = praises[Math.floor(Math.random() * praises.length)];
  if (stars % 5 === 0) {
    msg += ` ว้าว ได้ดาวครบ ${stars} ดวงแล้ว เก่งที่สุดเลย!`;
    setTimeout(() => { launchConfetti(70); SoundFX.fanfare(); }, 700);
  }
  speakText(msg, 1.4, 0.86, () => {
    cart = [];
    updateCartDisplay();
  });
}

/* ---- Dress-up (v2.9: categories, 22 items, dress colours) ---- */
const DRESS_CATS = [
  { k: 'hat',   icon: '🎩', name: 'หมวก' },
  { k: 'face',  icon: '👓', name: 'หน้า' },
  { k: 'body',  icon: '👗', name: 'ตัว' },
  { k: 'hold',  icon: '🎈', name: 'ถือ' },
  { k: 'color', icon: '🎨', name: 'สีชุด' }
];
const DRESS = [
  { k: 'Crown',   cat: 'hat',  e: '👑',           n: 'มงกุฎ',        say: 'มงกุฎสวยจังเลยค่ะ เหมือนเจ้าหญิงเลย' },
  { k: 'Chef',    cat: 'hat',  e: ICONS.chef,     n: 'หมวกเชฟ',      say: 'หมวกเชฟค่ะ วันนี้ทำขนมอร่อย ๆ กันนะคะ' },
  { k: 'Party',   cat: 'hat',  e: '🎉',           n: 'หมวกปาร์ตี้',   say: 'หมวกปาร์ตี้ค่ะ ฉลองกันเลย' },
  { k: 'Cap',     cat: 'hat',  e: ICONS.cap,      n: 'หมวกแก๊ป',      say: 'หมวกแก๊ปสีฟ้า เท่จังเลยค่ะ' },
  { k: 'Wizard',  cat: 'hat',  e: ICONS.wizard,   n: 'หมวกพ่อมด',    say: 'หมวกพ่อมดค่ะ ซิมซาลาบิม เสกขนมออกมาเลย' },
  { k: 'Flower',  cat: 'hat',  e: '🌸',           n: 'ติดดอกไม้',     say: 'ดอกไม้สวยจังเลย หอมด้วยนะคะ' },
  { k: 'Glasses', cat: 'face', e: '👓',           n: 'แว่นตา',        say: 'ใส่แว่นแล้วดูฉลาดเลยค่ะ' },
  { k: 'Shades',  cat: 'face', e: '😎',           n: 'แว่นกันแดด',    say: 'แว่นกันแดด เท่สุด ๆ ไปเลยค่ะ' },
  { k: 'HeartGlasses', cat: 'face', e: '😍',      n: 'แว่นหัวใจ',     say: 'แว่นหัวใจ น่ารักที่สุดเลยค่ะ' },
  { k: 'Mustache', cat: 'face', e: ICONS.mustache, n: 'หนวด',        say: 'ฮ่า ฮ่า หนวดเท่ ๆ เหมือนคุณลุงเลยค่ะ' },
  { k: 'Sticker', cat: 'face', e: '⭐',           n: 'สติกเกอร์แก้ม', say: 'สติกเกอร์ดาวกับหัวใจที่แก้ม น่ารักจัง' },
  { k: 'Phones',  cat: 'face', e: '🎧',           n: 'หูฟัง',         say: 'ใส่หูฟัง ฟังเพลงเพราะ ๆ กันค่ะ' },
  { k: 'Scarf',   cat: 'body', e: ICONS.scarf,    n: 'ผ้าพันคอ',      say: 'ผ้าพันคอ อุ่นสบายเลยค่ะ' },
  { k: 'Bowtie',  cat: 'body', e: '🎀',           n: 'โบว์ผูกคอ',     say: 'โบว์ผูกคอสีม่วง ดูเป็นสุภาพบุรุษเลยค่ะ' },
  { k: 'Necklace', cat: 'body', e: ICONS.necklace, n: 'สร้อยไข่มุก',  say: 'สร้อยไข่มุกสวยแวววาวเลยค่ะ' },
  { k: 'Apron',   cat: 'body', e: ICONS.apron,    n: 'ผ้ากันเปื้อน',  say: 'ผ้ากันเปื้อน พร้อมขายของแล้วค่ะ' },
  { k: 'Cape',    cat: 'body', e: ICONS.cape,     n: 'ผ้าคลุมฮีโร่',  say: 'ผ้าคลุมซุปเปอร์ฮีโร่ บินได้เลยนะคะ ฟิ้วว' },
  { k: 'Wings',   cat: 'body', e: ICONS.wings,    n: 'ปีกนางฟ้า',     say: 'ปีกนางฟ้า กระพือปีกได้ด้วยนะคะ' },
  { k: 'Wand',    cat: 'hold', e: '✨',           n: 'ไม้กายสิทธิ์',   say: 'ไม้กายสิทธิ์ค่ะ วิบ วิบ เสกให้เลย' },
  { k: 'Balloon', cat: 'hold', e: '🎈',           n: 'ลูกโป่ง',       say: 'ลูกโป่งสีแดง ลอยสูงเลยค่ะ' },
  { k: 'Lollipop', cat: 'hold', e: '🍭',          n: 'อมยิ้มยักษ์',   say: 'อมยิ้มใหญ่มาก หวานจัง' },
  { k: 'Bouquet', cat: 'hold', e: '💐',           n: 'ช่อดอกไม้',     say: 'ช่อดอกไม้ให้คุณแม่ค่ะ' }
];
const ACCS = DRESS.map(d => d.k);
// only one item per slot (hats, eyewear, neckwear, hand-held, back items)
const SLOTS = [
  ['Crown', 'Chef', 'Party', 'Cap', 'Wizard'],
  ['Glasses', 'Shades', 'HeartGlasses'],
  ['Scarf', 'Bowtie', 'Necklace'],
  ['Wand', 'Balloon', 'Lollipop', 'Bouquet'],
  ['Cape', 'Wings']
];
const SOLO = ['Flower', 'Phones', 'Mustache', 'Sticker', 'Apron'];
const ACC_SAY = { none: 'กลับมาเป็นน้องนิดาตัวเดิมแล้วค่ะ', random: 'ชุดใหม่แล้วค่ะ สวยไหมคะ' };
DRESS.forEach(d => { ACC_SAY[d.k] = d.say; });

const DRESS_COLORS = {
  pink:    { n: 'ชมพู',  stops: ['#ffb3cf', '#ff8bb5'], belt: '#ff6fa3', css: '#ff8bb5' },
  blue:    { n: 'ฟ้า',   stops: ['#a8dcff', '#6bb8ff'], belt: '#3f8fe8', css: '#6bb8ff' },
  purple:  { n: 'ม่วง',  stops: ['#d6b8ff', '#b58cff'], belt: '#8f5cf0', css: '#b58cff' },
  yellow:  { n: 'เหลือง', stops: ['#fff0a0', '#ffd84d'], belt: '#ffb100', css: '#ffd84d' },
  green:   { n: 'เขียว', stops: ['#b6f0cf', '#6fdca4'], belt: '#2fbf7e', css: '#6fdca4' },
  red:     { n: 'แดง',   stops: ['#ffb0b0', '#ff7070'], belt: '#e84040', css: '#ff7070' },
  rainbow: { n: 'สายรุ้ง', stops: ['#ff6b6b', '#ffb347', '#ffe14d', '#6fdca4', '#5ab4ff', '#b58cff'], belt: '#ff5c8a',
             css: 'linear-gradient(135deg,#ff6b6b,#ffe14d,#6fdca4,#5ab4ff,#b58cff)' }
};
let outfit = {};
try { outfit = JSON.parse(localStorage.getItem('nida_outfit') || '{}') || {}; } catch(e){}
let dressColor = 'pink';
try { const c = localStorage.getItem('nida_dress_color'); if (c && DRESS_COLORS[c]) dressColor = c; } catch(e){}
let dressCat = 'hat';

function ensureVector() { if (currentCharMode !== 'vector') setCharacterMode('vector'); }

function applyOutfit() {
  ACCS.forEach(a => {
    const el = $('acc' + a); if (el) el.style.display = outfit[a] ? '' : 'none';
    const btn = document.querySelector(`#dressGrid [data-acc="${a}"]`);
    if (btn) { btn.classList.toggle('on', !!outfit[a]); btn.setAttribute('aria-pressed', outfit[a] ? 'true' : 'false'); }
  });
  try { localStorage.setItem('nida_outfit', JSON.stringify(outfit)); } catch(e){}
}
function applyDressColor() {
  const c = DRESS_COLORS[dressColor]; if (!c) return;
  const g = $('dressG');
  if (g) g.innerHTML = c.stops.map((col, i) => `<stop offset="${(i / (c.stops.length - 1)).toFixed(2)}" stop-color="${col}"/>`).join('');
  const belt = $('dressBelt'); if (belt) belt.setAttribute('fill', c.belt);
  document.querySelectorAll('#colorGrid .swatch').forEach(b => {
    const on = b.dataset.color === dressColor;
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  try { localStorage.setItem('nida_dress_color', dressColor); } catch(e){}
}
function randomOutfit() {
  outfit = {};
  SLOTS.forEach(slot => { if (Math.random() < 0.7) outfit[slot[Math.floor(Math.random() * slot.length)]] = true; });
  SOLO.forEach(a => { if (Math.random() < 0.35) outfit[a] = true; });
  if (!Object.keys(outfit).length) outfit.Flower = true;
  const keys = Object.keys(DRESS_COLORS);
  dressColor = keys[Math.floor(Math.random() * keys.length)];
}
function toggleAcc(a) {
  ensureVector(); getAudioContext();
  const turningOn = !outfit[a];
  SLOTS.forEach(slot => { if (slot.includes(a)) slot.forEach(x => delete outfit[x]); });
  if (turningOn) outfit[a] = true;
  if (turningOn && (a === 'Wand' || a === 'Wings')) SoundFX.sparkle(); else SoundFX.boing();
  if (turningOn) launchConfetti(10);
  applyOutfit();
  speakText(turningOn ? ACC_SAY[a] : 'ถอดออกแล้วค่ะ');
}
function showDressCat(cat) {
  dressCat = cat;
  document.querySelectorAll('#dressCats .cat-chip').forEach(b => {
    const on = b.dataset.cat === cat; b.classList.toggle('active', on); b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  document.querySelectorAll('#dressGrid .dress-card').forEach(c => { c.hidden = c.dataset.cat !== cat; });
  $('dressGrid').hidden = cat === 'color';
  $('colorGrid').hidden = cat !== 'color';
}
function buildDressUI() {
  const cats = $('dressCats'), grid = $('dressGrid'), colors = $('colorGrid');
  DRESS_CATS.forEach(c => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'cat-chip'; b.dataset.cat = c.k; b.setAttribute('role', 'tab');
    b.innerHTML = `<span>${c.icon}</span><span>${c.name}</span>`;
    b.addEventListener('click', () => { getAudioContext(); SoundFX.boing(); showDressCat(c.k); });
    cats.appendChild(b);
  });
  DRESS.forEach(d => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'dress-card'; b.dataset.acc = d.k; b.dataset.cat = d.cat; b.setAttribute('aria-pressed', 'false');
    b.innerHTML = `<span class="dress-emoji">${d.e}</span>${d.n}`;
    b.addEventListener('click', () => toggleAcc(d.k));
    grid.appendChild(b);
  });
  Object.entries(DRESS_COLORS).forEach(([k, c]) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'swatch'; b.dataset.color = k; b.setAttribute('aria-pressed', 'false');
    b.innerHTML = `<i style="background:${c.css}"></i>${c.n}`;
    b.addEventListener('click', () => {
      ensureVector(); getAudioContext();
      dressColor = k; applyDressColor(); SoundFX.boing(); launchConfetti(12);
      speakText(`ชุดสี${c.n} สวยจังเลยค่ะ`);
    });
    colors.appendChild(b);
  });
  document.querySelectorAll('.dress-actions [data-acc]').forEach(btn => {
    btn.addEventListener('click', () => {
      ensureVector(); getAudioContext();
      const a = btn.dataset.acc;
      if (a === 'none') { outfit = {}; dressColor = 'pink'; SoundFX.boing(); }
      else { randomOutfit(); SoundFX.fanfare(); launchConfetti(30); }
      applyOutfit(); applyDressColor();
      speakText(ACC_SAY[a]);
    });
  });
  showDressCat(dressCat);
}
buildDressUI();
applyOutfit();
applyDressColor();
renderStars();

function clearCart() {
  if (cart.length === 0) return;
  SoundFX.boing();
  cart = [];
  updateCartDisplay();
  speakText("เริ่มเลือกรอบใหม่กันเลยค่ะ");
}

/* ============================================================
   5. FEEDING THE BUNNY
   ============================================================ */
const TREATS = [
  { name: 'แครอท', icon: ICONS.carrot, talk: 'ง่ำ ๆๆๆ แครอทกรุบกรอบ อร่อยชื่นใจที่สุดเลย!' },
  { name: 'สตรอว์เบอร์รี', icon: '🍓', talk: 'ง่ำ ๆ หวานฉ่ำ สดชื่นมาก ขอบคุณนะคะหนู!' },
  { name: 'เค้กหวาน', icon: '🍰', talk: 'ว้าว เค้กนุ่มละมุนลิ้น ฟินที่สุดเลยค่ะ!' },
  { name: 'ไอศกรีม', icon: '🍦', talk: 'เย็นเจี๊ยบ หวานหอม อร่อยชื่นใจจัง!' },
  { name: 'แอปเปิ้ล', icon: '🍎', talk: 'กรุบกรอบ วิตามินซีเต็มเปี่ยมเลยค่ะ!' },
  { name: 'คุกกี้', icon: '🍪', talk: 'คุกกี้หอมเนยมาก ๆ ขอน้องนิดากินอีกชิ้นนะคะ!' }
];

function renderFeedShelf() {
  const shelf = $('feedShelf');
  shelf.innerHTML = '';
  TREATS.forEach(t => {
    const item = document.createElement('div');
    item.className = 'feed-item';
    item.innerHTML = `
      <div class="prod-emoji">${t.icon}</div>
      <span>ป้อน ${t.name}</span>
    `;
    item.addEventListener('click', (e) => feedBunny(t, e));
    shelf.appendChild(item);
  });
}

function feedBunny(treat, event) {
  getAudioContext();
  const rect = event.currentTarget.getBoundingClientRect();
  const mouthRect = $('mouthTarget').getBoundingClientRect();
  const endX = mouthRect.left > 0 ? (mouthRect.left + mouthRect.width / 2) : (window.innerWidth * 0.22);
  const endY = mouthRect.top > 0 ? (mouthRect.top + mouthRect.height / 2) : (window.innerHeight * 0.25);

  createFlyingEmoji(treat.icon, rect.left + rect.width / 2, rect.top, endX, endY, () => {
    SoundFX.munch();
    $('stage').className = 'stage mood-eating';
    startSpeakingState();
    launchConfetti(25);
    setTimeout(() => {
      speakText(treat.talk, 1.48, 0.88);
    }, 750);
  });
}

/* ============================================================
   6. ROLEPLAY (1-4)
   ============================================================ */
const T = {
  1: [
    "สวัสดีค่ะ ยินดีต้อนรับสู่ร้านน้องนิดานะคะ",
    "สวัสดีจ้า เข้ามาเลือกของน่ารัก ๆ ได้เลยค่ะ",
    "ฮัลโหล ยินดีต้อนรับนะคะ วันนี้มีของน่ารักเต็มร้านเลย"
  ],
  2: [
    "รับอะไรเพิ่มอีกไหมคะ",
    "อยากได้ขนมหรือของเล่นอีกชิ้นไหมเอ่ย",
    "มีอะไรที่อยากเลือกเพิ่มอีกไหมคะ"
  ],
  3: [
    "ชิ้นนี้ราคาเก้าสิบเก้าบาทค่ะ",
    "ราคาเก้าสิบเก้าบาทนะคะ ขอบคุณค่ะ",
    "ทั้งหมดเก้าสิบเก้าบาทค่ะ"
  ],
  4: [
    "ขอบคุณมาก ๆ นะคะ แล้วแวะมาเล่นกันอีกนะ",
    "ขอบคุณที่มาร้านน้องนิดาค่ะ บ๊ายบาย",
    "เย้ ขอบคุณนะคะ ขอให้วันนี้เป็นวันที่สดใสค่ะ"
  ]
};

function sayRoleplay(k) {
  if (!T[k]) return;
  currentAction = Number(k);
  const options = T[k];
  const text = options[Math.floor(Math.random() * options.length)];
  $('stage').className = 'stage act-' + currentAction;
  if (k === 1) SoundFX.boing();
  if (k === 3) SoundFX.cashRegister();
  if (k === 4) { SoundFX.fanfare(); launchConfetti(30); }
  speakText(text);
}

/* ============================================================
   7. MOODS
   ============================================================ */
const MOODS = {
  happy: {
    lines: ["เย้! ดีใจที่ได้เจอหนูค่ะ", "น้องนิดามีความสุขจังเลย!", "ว้าว วันนี้สดใสจังเลยค่ะ"],
    sound: () => { SoundFX.giggle(); launchConfetti(25); }
  },
  laugh: {
    lines: ["ฮิฮิฮิ ตลกจังเลยค่ะ", "คิกคิก น้องนิดาขำแล้ว!", "ฮ่า ฮ่า ฮ่า สนุกจังเลย"],
    sound: () => SoundFX.giggle()
  },
  surprise: {
    lines: ["โอ๊ะ! มีอะไรเอ่ย", "ว้าว! น้องนิดาตกใจเลยค่ะ", "อุ๊ย! นั่นอะไรนะคะ"],
    sound: () => SoundFX.boing()
  },
  sleepy: {
    lines: ["หาววว น้องนิดาง่วงแล้วค่ะ", "ขอพักตาสักแป๊บนะคะ", "ฝันดีนะคะ หาววว"],
    sound: () => SoundFX.boing()
  },
  dance: {
    lines: ["ดุ๊กดิ๊ก ดุ๊กดิ๊ก เต้นระบำกันเถอะ!", "ลั้ลลา มาขยับตัวด้วยกันนะคะ", "โยกซ้าย โยกขวา สนุกจังเลย!"],
    sound: () => { SoundFX.fanfare(); launchConfetti(35); }
  },
  praise: {
    lines: ["หนูนิดาเก่งที่สุดในโลกเลยค่ะ!", "คนเก่งของพ่อกับแม่ ยอดเยี่ยมมาก!", "ปรบมือให้คนเก่งเลยค่ะ แปะ แปะ แปะ!"],
    sound: () => { SoundFX.fanfare(); launchConfetti(45); }
  }
};

function reactMood(moodKey) {
  const m = MOODS[moodKey];
  if (!m) return;
  $('stage').className = 'stage mood-' + moodKey;
  if (m.sound) m.sound();
  const text = m.lines[Math.floor(Math.random() * m.lines.length)];
  const pitch = moodKey === 'sleepy' ? 1.05 : 1.48;
  const rate = moodKey === 'sleepy' ? 0.72 : 0.9;
  speakText(text, pitch, rate);
}

/* ============================================================
   8. LISTENERS
   ============================================================ */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    SoundFX.boing();
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    if (typeof closePiano === 'function') closePiano();
    const panel = $('panel-' + btn.dataset.tab);
    if (panel) panel.classList.add('active');
  });
});

$('bunnyTummy').addEventListener('click', (e) => {
  e.stopPropagation();
  getAudioContext();
  SoundFX.giggle();
  $('stage').className = 'stage mood-laugh';
  speakText("คิกคิก อย่าจั๊กจี้พุงนิดาสิคะหนู!", 1.55);
});

$('stage').addEventListener('click', () => {
  getAudioContext();
  SoundFX.boing();
  launchConfetti(20);
  const hellos = [
    "สวัสดีค่ะ ดีใจที่หนูมาเล่นกับน้องนิดานะคะ 💕",
    "เย้ กอดกอดกันค่ะ วันนี้เล่นอะไรกันดีเอ่ย",
    "รักหนูจังเลย มาเล่นขายของด้วยกันต่อนะคะ"
  ];
  speakText(hellos[Math.floor(Math.random() * hellos.length)]);
});

$('soundToggle').addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  $('soundToggle').innerHTML = soundEnabled ? '🔊<span class="lbl"> เสียงเปิด</span>' : '🔇<span class="lbl"> ปิดเสียง</span>';
});

$('replayBubble').addEventListener('click', (e) => {
  e.stopPropagation();
  speakText(currentText);
});
$('bubble').addEventListener('click', () => speakText(currentText));

$('checkoutBtn').addEventListener('click', checkout);
$('clearCartBtn').addEventListener('click', clearCart);

document.querySelectorAll('#panel-roleplay .btns-grid button').forEach(b => {
  b.addEventListener('click', () => sayRoleplay(b.dataset.k));
});

document.querySelectorAll('.moods-grid button').forEach(b => {
  b.addEventListener('click', () => reactMood(b.dataset.mood));
});

window.addEventListener('keydown', e => {
  if (e.repeat || e.altKey || e.ctrlKey || e.metaKey) return;
  if (['1', '2', '3', '4'].includes(e.key)) {
    sayRoleplay(e.key);
  } else if (e.key === 'Escape') {
    if (voiceAvailable) speechSynthesis.cancel();
    stopAll();
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (voiceAvailable) speechSynthesis.cancel();
    stopAll();
  }
});

/* ============================================================
   9. PWA & SERVICE WORKER
   ============================================================ */
let deferredPrompt = null;
const installBanner = $('installBanner');
const installBtn = $('installBtn');

let bannerDismissed = false;
try { bannerDismissed = sessionStorage.getItem('nida_banner_closed') === '1'; } catch(e){}
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (!bannerDismissed) installBanner.style.display = 'flex';
});
$('installClose').addEventListener('click', () => {
  installBanner.style.display = 'none';
  try { sessionStorage.setItem('nida_banner_closed', '1'); } catch(e){}
  setTimeout(setAppHeight, 50);
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  if (choice.outcome === 'accepted') {
    installBanner.style.display = 'none';
    setTimeout(setAppHeight, 50);
  }
  deferredPrompt = null;
});

function updateOnlineStatus() {
  const pill = $('offlinePill');
  if (navigator.onLine) {
    pill.innerHTML = '<span class="status-dot"></span><span class="lbl"> ออนไลน์</span>';
    pill.style.borderColor = 'rgba(62, 201, 146, 0.4)';
  } else {
    pill.innerHTML = '<span class="status-dot offline"></span><span class="lbl"> ออฟไลน์</span>';
    pill.style.borderColor = 'rgba(255, 158, 44, 0.4)';
  }
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const hadController = !!navigator.serviceWorker.controller;
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || reloaded) return;
      reloaded = true;
      location.reload();
    });
    navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW error:', err));
  });
}

/* ============================================================
   10. FUN TAB (v2.9): balloons, piano, birthday, photo, scenes, counting
   ============================================================ */
Object.assign(SoundFX, {
  // one soft bell-like note (used by piano, birthday song, counting)
  note(freq, dur = 0.3, vol = 0.22) {
    if (!soundEnabled) return;
    const ctx = getAudioContext(); if (!ctx) return;
    const t0 = ctx.currentTime;
    [[freq, 'triangle', vol], [freq * 2, 'sine', vol * 0.25]].forEach(([f, type, v]) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = type; osc.frequency.setValueAtTime(f, t0);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(v, t0 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0008, t0 + dur + 0.18);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(t0); osc.stop(t0 + dur + 0.2);
    });
  },
  // balloon pop
  pop() {
    if (!soundEnabled) return;
    const ctx = getAudioContext(); if (!ctx) return;
    const len = Math.floor(ctx.sampleRate * 0.07);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.012));
    const src = ctx.createBufferSource(); src.buffer = buf;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 900;
    const g = ctx.createGain(); g.gain.value = 0.55;
    src.connect(hp); hp.connect(g); g.connect(ctx.destination); src.start();
    const o = ctx.createOscillator(), og = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(260, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.09);
    og.gain.setValueAtTime(0.3, ctx.currentTime); og.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    o.connect(og); og.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.11);
  },
  // camera shutter
  shutter() {
    if (!soundEnabled) return;
    const ctx = getAudioContext(); if (!ctx) return;
    [0, 0.09].forEach(off => {
      const len = Math.floor(ctx.sampleRate * 0.04);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.008));
      const src = ctx.createBufferSource(); src.buffer = buf;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = 1.2;
      const g = ctx.createGain(); g.gain.value = 0.5;
      src.connect(bp); bp.connect(g); g.connect(ctx.destination); src.start(ctx.currentTime + off);
    });
  },
  // magic sparkle
  sparkle() {
    [1318.5, 1568, 1760, 2093, 2637].forEach((f, i) => setTimeout(() => SoundFX.note(f, 0.1, 0.14), i * 70));
  }
});

const TH_NUM = ['หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า', 'สิบ'];
const rand = (a, b) => a + Math.random() * (b - a);

/* ---- Scenes ---- */
const SCENES = {
  sunny:  { icon: '🌈', n: 'วันสดใส',    say: 'วันนี้อากาศดีจังเลยค่ะ ท้องฟ้าสดใส', bg: ['#fff9e6', '#fde492'], deco: [], photo: ['⭐', '✨', '💖', '🌈'] },
  night:  { icon: '🌙', n: 'กลางคืน',    say: 'กลางคืนแล้วค่ะ ดาวเต็มท้องฟ้าเลย', bg: ['#232a6b', '#8a6fc4'],
            deco: [['🌙', 'right:8%;top:7%'], ['⭐', 'left:8%;top:10%'], ['✨', 'left:34%;top:3%'], ['✨', 'right:28%;top:20%'], ['⭐', 'left:5%;bottom:14%']] },
  beach:  { icon: '🌴', n: 'ชายหาด',    say: 'ไปเที่ยวทะเลกันค่ะ คลื่นซัดฟู่ ๆ', bg: ['#8fd8ff', '#ffd27a'],
            deco: [['☀️', 'right:7%;top:6%'], ['🌴', 'left:4%;top:20%'], ['🐚', 'right:8%;bottom:8%'], ['🌊', 'left:8%;bottom:6%']] },
  garden: { icon: '🌷', n: 'สวนดอกไม้',  say: 'สวนดอกไม้สวยจังเลยค่ะ มีผีเสื้อด้วย', bg: ['#d4f6ff', '#8fe39a'],
            deco: [['🌸', 'right:9%;top:12%'], ['🌷', 'left:6%;bottom:8%'], ['🌳', 'right:3%;bottom:10%'], ['🌼', 'left:24%;bottom:4%']] },
  snow:   { icon: '⛄', n: 'หิมะตก',     say: 'หิมะตกแล้วค่ะ หนาวจัง บรื๋ออ', bg: ['#cfe9ff', '#ffffff'], snow: true,
            deco: [['⛄', 'right:5%;bottom:8%'], ['🌲', 'left:4%;bottom:10%']] }
};
const SCENE_ORDER = ['sunny', 'night', 'beach', 'garden', 'snow'];
let currentScene = 'sunny';
try { const sv = localStorage.getItem('nida_scene'); if (sv && SCENES[sv]) currentScene = sv; } catch(e){}

function setScene(key) {
  const sc = SCENES[key]; if (!sc) return;
  currentScene = key;
  $('stage').dataset.scene = key;
  const fx = $('sceneFx'); fx.innerHTML = '';
  sc.deco.forEach(([emoji, pos], i) => {
    const d = document.createElement('span');
    d.className = 'deco'; d.textContent = emoji; d.style.cssText = pos + `;animation-delay:${(i * 0.5).toFixed(1)}s`;
    fx.appendChild(d);
  });
  if (sc.snow) {
    for (let i = 0; i < 14; i++) {
      const f = document.createElement('span');
      f.className = 'flake'; f.textContent = '❄️';
      f.style.cssText = `left:${rand(2, 94).toFixed(0)}%;animation-duration:${rand(3.5, 6.5).toFixed(1)}s;animation-delay:${rand(0, 4).toFixed(1)}s;font-size:${Math.round(rand(11, 20))}px`;
      fx.appendChild(f);
    }
  }
  $('sceneIcon').textContent = sc.icon;
  try { localStorage.setItem('nida_scene', key); } catch(e){}
}
function nextScene() {
  const next = SCENE_ORDER[(SCENE_ORDER.indexOf(currentScene) + 1) % SCENE_ORDER.length];
  setScene(next);
  if (next === 'night') SoundFX.note(392, 0.5, 0.18); else SoundFX.boing();
  launchConfetti(14);
  speakText(SCENES[next].say);
}

/* ---- Balloons: pop them in any order, bunny counts the number ---- */
const BALLOON_COLORS = ['#ff5c8a', '#ffa21f', '#2fbf7e', '#4a8dff', '#a855f7', '#ff7a5c'];
function startBalloons() {
  const layer = $('balloonLayer'); layer.innerHTML = '';
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sort(() => Math.random() - 0.5);
  let remaining = nums.length, popped = 0;
  const finishOne = () => {
    if (--remaining > 0) return;
    if (popped === nums.length) {
      stars++; try { localStorage.setItem('nida_stars', String(stars)); } catch(e){}
      renderStars();
      SoundFX.fanfare(); launchConfetti(70);
      speakText('เก่งมากเลยค่ะ แตกครบสิบลูกแล้ว ได้ดาวเพิ่มอีกหนึ่งดวง!');
    } else if (popped > 0) {
      speakText('ลูกโป่งลอยไปหมดแล้วค่ะ เล่นอีกรอบไหมคะ');
    }
  };
  nums.forEach((n, i) => {
    const el = document.createElement('div');
    el.className = 'balloon'; el.textContent = n;
    el.style.background = `radial-gradient(circle at 35% 30%, #fff8 0, transparent 38%), ${BALLOON_COLORS[i % BALLOON_COLORS.length]}`;
    el.style.left = `${rand(4, 84).toFixed(1)}%`;
    el.style.setProperty('--dur', `${rand(8, 12).toFixed(1)}s`);
    el.style.setProperty('--delay', `${(i * 0.5).toFixed(1)}s`);
    el.style.setProperty('--sway', `${Math.round(rand(14, 30))}px`);
    let gone = false;
    el.addEventListener('animationend', () => { if (gone) return; gone = true; el.remove(); finishOne(); });
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault(); if (gone) return; gone = true;
      getAudioContext();
      const r = el.getBoundingClientRect();
      // freeze the balloon exactly where it is (removing the rise animation would snap it back to the bottom)
      const m = getComputedStyle(el).transform;
      const base = m && m !== 'none' ? m + ' ' : '';
      el.style.animation = 'none';
      el.style.transform = base;
      void el.offsetWidth;
      el.classList.add('pop');
      el.style.transform = base + 'scale(1.7)';
      setTimeout(() => el.remove(), 450); // keep it in place a moment so the follow-up tap/click can't hit buttons underneath
      popped++;
      SoundFX.pop();
      launchConfetti(14, r.left + r.width / 2, r.top + r.height / 2);
      speakText(`${n} ${TH_NUM[n - 1]}`, 1.5, 0.95);
      finishOne();
    });
    el.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); });
    layer.appendChild(el);
  });
  speakText('แตะลูกโป่งให้แตก แล้วนับเลขไปด้วยกันนะคะ');
}

/* ---- Piano ---- */
const PIANO_KEYS = [
  ['โด', 261.63, '#ff5c8a'], ['เร', 293.66, '#ff9e2c'], ['มี', 329.63, '#f2b705'], ['ฟา', 349.23, '#3ec992'],
  ['ซอล', 392, '#22a6c4'], ['ลา', 440, '#5a8fff'], ['ที', 493.88, '#a855f7'], ['โด', 523.25, '#ff65a5']
];
let pianoTimer = null;
function buildPiano() {
  const box = $('piano'); box.innerHTML = '';
  PIANO_KEYS.forEach(([name, freq, color], i) => {
    const k = document.createElement('button');
    k.type = 'button'; k.className = 'pkey'; k.textContent = name; k.style.background = color;
    k.addEventListener('pointerdown', (e) => {
      e.preventDefault(); getAudioContext();
      SoundFX.note(freq, 0.42, 0.26);
      k.classList.add('hit'); setTimeout(() => k.classList.remove('hit'), 140);
      const kr = k.getBoundingClientRect(), sr = $('stage').getBoundingClientRect();
      createFlyingEmoji(['🎵', '🎶', '♪'][i % 3], kr.left + kr.width / 2 - 14, kr.top, sr.left + sr.width * (0.15 + 0.7 * i / 7), sr.top + sr.height * 0.18);
      clearTimeout(actionTimer); clearTimeout(pianoTimer);
      $('stage').className = 'stage act-1';
      pianoTimer = setTimeout(() => { $('stage').className = 'stage'; }, 420);
      $('bubble').textContent = `🎵 ${name}`;
    });
    box.appendChild(k);
  });
}
function openPiano() {
  $('panel-fun').classList.add('piano-open'); $('pianoWrap').hidden = false;
  SoundFX.note(523.25, 0.3, 0.2);
  speakText('มาเล่นเปียโนกันค่ะ แตะที่คีย์ได้เลย โด เร มี ฟา ซอล ลา ที โด');
}
function closePiano() { const p = $('panel-fun'); if (p) p.classList.remove('piano-open'); const w = $('pianoWrap'); if (w) w.hidden = true; }
$('pianoClose').addEventListener('click', () => { SoundFX.boing(); closePiano(); });

/* ---- Birthday cake ---- */
const BDAY = [[392, .75], [392, .25], [440, 1], [392, 1], [523.25, 1], [493.88, 2],
              [392, .75], [392, .25], [440, 1], [392, 1], [587.33, 1], [523.25, 2],
              [392, .75], [392, .25], [784, 1], [659.25, 1], [523.25, 1], [493.88, 1], [440, 2],
              [698.46, .75], [698.46, .25], [659.25, 1], [523.25, 1], [587.33, 1], [523.25, 2]];
let bdayToken = 0, candlesOut = false;
function playBirthdaySong() {
  const t = ++bdayToken; let i = 0;
  (function next() {
    if (t !== bdayToken || i >= BDAY.length) return;
    const [f, beats] = BDAY[i++];
    SoundFX.note(f, beats * 0.4, 0.24);
    setTimeout(next, beats * 420);
  })();
}
function openBirthday() {
  getAudioContext(); ensureVector();
  SLOTS[0].forEach(x => delete outfit[x]); outfit.Party = true; applyOutfit();
  candlesOut = false;
  $('candles').classList.remove('out');
  $('cakeTitle').textContent = '🎶 วันเกิดน้องนิดา 🎶';
  $('cakeHint').textContent = 'แตะที่เค้กเพื่อเป่าเทียน 💨';
  $('cakeOverlay').classList.add('show');
  $('stage').className = 'stage mood-dance';
  $('bubble').textContent = '🎶 แฮปปี้เบิร์ธเดย์ทูยู 🎶';
  launchConfetti(30);
  playBirthdaySong();
}
function closeBirthday() { bdayToken++; $('cakeOverlay').classList.remove('show'); }
function blowCandles() {
  if (candlesOut) return;
  candlesOut = true; bdayToken++;
  $('candles').classList.add('out');
  SoundFX.giggle(); setTimeout(SoundFX.fanfare, 250);
  launchConfetti(80);
  $('cakeTitle').textContent = '🎉 สุขสันต์วันเกิด! 🎉';
  $('cakeHint').textContent = 'เย้! เทียนดับแล้ว ขอพรได้เลย ✨';
  stars++; try { localStorage.setItem('nida_stars', String(stars)); } catch(e){}
  renderStars();
  speakText('สุขสันต์วันเกิดนะคะ ขอให้มีความสุขมาก ๆ เลยค่ะ');
  const t = bdayToken;
  setTimeout(() => { if (t === bdayToken && candlesOut) closeBirthday(); }, 4500);
}
$('cakeBtn').addEventListener('click', blowCandles);
$('cakeClose').addEventListener('click', closeBirthday);
$('cakeOverlay').addEventListener('click', (e) => { if (e.target === $('cakeOverlay')) closeBirthday(); });

/* ---- Photo booth ---- */
function drawPhoto(drawBunny) {
  const W = 720, H = 880, c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d'), sc = SCENES[currentScene];
  const g = x.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, sc.bg[0]); g.addColorStop(1, sc.bg[1]);
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.font = '64px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  const deco = sc.deco.length ? sc.deco.map(d => d[0]) : sc.photo;
  [[40, 100], [610, 100], [40, 700], [600, 700]].forEach(([px, py], i) => { if (deco[i]) x.fillText(deco[i], px, py); });
  return drawBunny(x, W, H).then(() => {
    x.fillStyle = 'rgba(255,255,255,0.92)';
    x.beginPath(); x.roundRect ? x.roundRect(120, H - 130, W - 240, 84, 42) : x.rect(120, H - 130, W - 240, 84); x.fill();
    x.fillStyle = '#d93a7c'; x.textAlign = 'center';
    x.font = 'bold 40px Mali, Sarabun, sans-serif';
    x.fillText(`ร้านน้องนิดา  ⭐ ${stars}`, W / 2, H - 76);
    return c.toDataURL('image/png');
  });
}
function takePhoto() {
  getAudioContext(); SoundFX.shutter();
  const f = $('flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
  $('stage').className = 'stage mood-happy';
  speakText('ชีส! ถ่ายรูปแล้วค่ะ');
  const bunny = (x, W, H) => new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => { x.drawImage(img, 40, 60, 640, 704); res(); };
    img.onerror = rej;
    if (currentCharMode === 'vector') {
      const svg = document.querySelector('#bunnyVectorCard svg').cloneNode(true);
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('width', '800'); svg.setAttribute('height', '880');
      img.src = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' }));
    } else {
      img.src = $('rabbitImg').src;
    }
  });
  setTimeout(() => {
    drawPhoto(bunny).then(url => {
      $('photoImg').src = url; $('photoSave').href = url;
      $('photoOverlay').classList.add('show');
      launchConfetti(30);
    }).catch(err => console.log('photo error', err));
  }, 420);
}
$('photoClose').addEventListener('click', () => $('photoOverlay').classList.remove('show'));
$('photoOverlay').addEventListener('click', (e) => { if (e.target === $('photoOverlay')) $('photoOverlay').classList.remove('show'); });

/* ---- Counting (counts the cart if it has items, otherwise 1-10) ---- */
let countToken = 0, lastCountText = '';
function startCounting() {
  getAudioContext();
  const t = ++countToken;
  const names = cart.length ? cart.slice(0, 10).map(p => p.name) : null;
  const n = names ? names.length : 10;
  const badge = $('countBadge');
  let i = 0;
  (function step() {
    if (t !== countToken) return;
    if (i > 0 && currentText !== lastCountText) { badge.classList.remove('show'); return; } // someone else spoke → stop
    if (i >= n) {
      badge.classList.remove('show');
      SoundFX.fanfare(); launchConfetti(40);
      speakText(names ? `ตะกร้ามีทั้งหมด ${cart.length} ชิ้นค่ะ` : 'นับถึงสิบแล้ว เก่งมากเลยค่ะ');
      return;
    }
    i++;
    badge.classList.remove('show'); void badge.offsetWidth;
    badge.textContent = i; badge.classList.add('show');
    SoundFX.note(PIANO_KEYS[(i - 1) % 8][1], 0.25, 0.22);
    lastCountText = names ? `${TH_NUM[i - 1]} ${names[i - 1]}` : TH_NUM[i - 1];
    speakText(lastCountText, 1.5, 0.9);
    $('stage').className = 'stage act-1';
    setTimeout(step, 1150);
  })();
}

/* ---- wire up ---- */
buildPiano();
setScene(currentScene);
const FUN_ACTIONS = { balloons: startBalloons, piano: openPiano, birthday: openBirthday, photo: takePhoto, scene: nextScene, count: startCounting };
document.querySelectorAll('[data-fun]').forEach(b => {
  b.addEventListener('click', () => { getAudioContext(); const f = FUN_ACTIONS[b.dataset.fun]; if (f) f(); });
});

renderProducts();
renderFeedShelf();
