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
  },

  // Barcode scanner laser beep: crisp double tone
  scanLaser() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, ctx.currentTime);
    osc.frequency.setValueAtTime(2900, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  },

  // Thermal receipt print: rhythmic ratcheting sound
  printReceipt() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    for (let i = 0; i < 5; i++) {
      const t = ctx.currentTime + i * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140 + i * 15, t);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    }
  },

  // Cute cartoon sneeze
  sneeze() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.12);
    osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.28);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  },

  // Happy bunny purr / hum
  purr() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    [392, 440, 523.25].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.16, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.2);
    });
  },

  // Toy cash drawer release bell: rich metallic DING and drawer rolling
  cashDrawer() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1760, ctx.currentTime);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.65);

    setTimeout(() => {
      if (!ctx) return;
      const o2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      o2.type = 'triangle';
      o2.frequency.setValueAtTime(220, ctx.currentTime);
      o2.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.12);
      g2.gain.setValueAtTime(0.2, ctx.currentTime);
      g2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      o2.connect(g2);
      g2.connect(ctx.destination);
      o2.start();
      o2.stop(ctx.currentTime + 0.12);
    }, 60);
  },

  // Digital scale settling beep: double electronic beep
  scaleBeep() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    [0, 0.08].forEach(dt => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1900, ctx.currentTime + dt);
      gain.gain.setValueAtTime(0.22, ctx.currentTime + dt);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dt + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + dt);
      osc.stop(ctx.currentTime + dt + 0.05);
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
   3. SPEECH SYNTHESIS, LANGUAGE & CHARACTER CONTROLLER
   ============================================================ */
const $ = id => document.getElementById(id);
let voices = [];
let currentAction = 1;
let currentLang = 'th';
try {
  const savedLang = localStorage.getItem('nida_lang');
  if (savedLang === 'en' || savedLang === 'th') currentLang = savedLang;
} catch(e){}

let currentText = currentLang === 'en' ? "Welcome to Nida's Shop! 💕" : "ยินดีต้อนรับสู่ร้านน้องนิดาค่ะ 💕";
let actionTimer = null;
let mouthTimer = null;
let currentCharMode = 'vector'; // 'vector' or '3d'
const voiceAvailable = ('speechSynthesis' in window) && ('SpeechSynthesisUtterance' in window);

function getItemName(item) {
  if (!item) return '';
  if (typeof item.name === 'object' && item.name !== null) {
    return item.name[currentLang] || item.name['th'] || '';
  }
  return item.name || '';
}

function getItemTalk(item) {
  if (!item) return '';
  if (typeof item.talk === 'object' && item.talk !== null) {
    return item.talk[currentLang] || item.talk['th'] || '';
  }
  if (typeof item.say === 'object' && item.say !== null) {
    return item.say[currentLang] || item.say['th'] || '';
  }
  return item.talk || item.say || '';
}

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
const hasEnglishVoice = () => voices.some(v => /^en(-|_|$)/i.test(v.lang));

function showNoThaiHint() {
  if (noThaiHinted) return;
  noThaiHinted = true;
  const h = document.createElement('div');
  h.id = 'voiceHint';
  h.style.cssText = 'font-size:12px;text-align:center;color:#a0527a;margin-top:4px;';
  h.textContent = 'เครื่องนี้ยังไม่มีเสียงพูดภาษาไทย (ติดตั้งได้ที่ตั้งค่าเครื่อง > เสียงพูด) ตอนนี้น้องนิดาจะพูดเป็นตัวหนังสือแทนนะคะ';
  $('bubble').insertAdjacentElement('afterend', h);
}

function speakText(text, pitch = null, rate = null, onDone = null, langOverride = null) {
  const targetLang = langOverride || currentLang;
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

  if (!voiceAvailable) {
    silentMode();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);

  if (targetLang === 'en') {
    const enVoices = voices.filter(v => /^en(-|_|$)/i.test(v.lang));
    if (enVoices.length > 0) {
      const preferred = enVoices.find(v => /female|natural|samantha|victoria|zira|jenny|google/i.test(v.name)) || enVoices[0];
      utterance.voice = preferred;
      utterance.lang = preferred.lang || 'en-US';
    } else {
      utterance.lang = 'en-US';
    }
    utterance.pitch = pitch !== null ? pitch : 1.35;
    utterance.rate = rate !== null ? rate : 0.88;
  } else {
    const noThai = voices.length > 0 && !hasThaiVoice();
    if (noThai) {
      showNoThaiHint();
      silentMode();
      return;
    }
    utterance.lang = 'th-TH';
    const thaiVoice = voices.find(v => /^th(-|_|$)/i.test(v.lang));
    if (thaiVoice) utterance.voice = thaiVoice;
    utterance.pitch = pitch !== null ? pitch : 1.45;
    utterance.rate = rate !== null ? rate : 0.88;
  }

  utterance.volume = 1;

  utterance.onstart = () => {
    if (token !== speakToken) return;
    startSpeakingState();
    clearTimeout(actionTimer);
    actionTimer = setTimeout(finish, text.length * 220 + 4000);
  };
  utterance.onend = finish;
  utterance.onerror = (e) => {
    if (e && (e.error === 'interrupted' || e.error === 'canceled')) return;
    silentMode();
  };

  speechSynthesis.speak(utterance);
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
    btn.innerHTML = currentLang === 'en' ? '🎨<span class="lbl"> Animated</span>' : '🎨<span class="lbl"> น้องขยับได้</span>';
    btn.title = currentLang === 'en' ? 'Switch to 3D bunny' : 'แตะเพื่อเปลี่ยนเป็นน้อง 3D';
  } else {
    viewVector.style.display = 'none';
    view3D.style.display = 'flex';
    btn.innerHTML = currentLang === 'en' ? '🐰<span class="lbl"> 3D Photo</span>' : '🐰<span class="lbl"> น้อง 3D</span>';
    btn.title = currentLang === 'en' ? 'Switch to animated bunny' : 'แตะเพื่อเปลี่ยนเป็นน้องขยับได้';
  }
  try { localStorage.setItem('nida_char_mode', mode); } catch(e){}
}

$('charToggleBtn').addEventListener('click', () => {
  SoundFX.boing();
  const nextMode = currentCharMode === 'vector' ? '3d' : 'vector';
  setCharacterMode(nextMode);
  if (currentLang === 'en') {
    speakText(nextMode === 'vector' ? "Nida is ready to move and play with you!" : "Here is Nida's 3D photo!");
  } else {
    speakText(nextMode === 'vector' ? "นิดาพร้อมขยับตัวเล่นกับหนูแล้วค่ะ!" : "นี่คือรูปน้องนิดาแบบสามมิตินะคะ!");
  }
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
  // 🥦 ผักผลไม้ (fresh)
  {
    id: 'berry', cat: 'fresh',
    name: { th: 'สตรอว์เบอร์รี', en: 'Strawberry' },
    icon: '🍓', price: 5,
    talk: {
      th: 'สตรอว์เบอร์รี หวานฉ่ำ อร่อยมากค่ะ!',
      en: 'Sweet and juicy strawberry! Yummy!'
    }
  },
  {
    id: 'carrot', cat: 'fresh',
    name: { th: 'แครอทสด', en: 'Fresh Carrot' },
    icon: ICONS.carrot, price: 2,
    talk: {
      th: 'แครอทกรุบกรอบ ของโปรดกระต่ายเลย!',
      en: 'Crunchy carrot! Bunny loves it!'
    }
  },
  {
    id: 'apple', cat: 'fresh',
    name: { th: 'แอปเปิ้ล', en: 'Red Apple' },
    icon: '🍎', price: 5,
    talk: {
      th: 'แอปเปิ้ลสีแดง สดใหม่จากสวนค่ะ!',
      en: 'Fresh red apple from the farm!'
    }
  },
  {
    id: 'banana', cat: 'fresh',
    name: { th: 'กล้วยหอม', en: 'Banana' },
    icon: '🍌', price: 3,
    talk: {
      th: 'กล้วยหอมหวาน ให้พลังงานเยอะเลยค่ะ!',
      en: 'Sweet yellow banana! Gives lots of energy!'
    }
  },
  {
    id: 'orange', cat: 'fresh',
    name: { th: 'ส้มหวาน', en: 'Sweet Orange' },
    icon: '🍊', price: 4,
    talk: {
      th: 'ส้มสีส้ม หวานอมเปรี้ยว สดชื่นจังค่ะ!',
      en: 'Sweet juicy orange! So refreshing!'
    }
  },
  {
    id: 'watermelon', cat: 'fresh',
    name: { th: 'แตงโม', en: 'Watermelon' },
    icon: '🍉', price: 8,
    talk: {
      th: 'แตงโมเย็นฉ่ำ ชื่นใจที่สุดเลยค่ะ!',
      en: 'Cool and juicy watermelon! Sweet and yummy!'
    }
  },

  // 🧁 เบเกอรี่ (bakery)
  {
    id: 'cake', cat: 'bakery',
    name: { th: 'เค้กช็อกโกแลต', en: 'Chocolate Cake' },
    icon: '🍰', price: 20,
    talk: {
      th: 'เค้กชิ้นโต น่ากินมากเลยค่ะ!',
      en: 'Chocolate cake! Big and delicious!'
    }
  },
  {
    id: 'cookie', cat: 'bakery',
    name: { th: 'คุกกี้', en: 'Cookie' },
    icon: '🍪', price: 8,
    talk: {
      th: 'คุกกี้กรอบ ๆ หอมเนยเลยค่ะ!',
      en: 'Crispy buttery cookie! Smells so good!'
    }
  },
  {
    id: 'cupcake', cat: 'bakery',
    name: { th: 'คัพเค้ก', en: 'Cupcake' },
    icon: ICONS.cupcake, price: 12,
    talk: {
      th: 'คัพเค้กหน้าสวย หวานอร่อยค่ะ!',
      en: 'Pretty cupcake! Sweet and lovely!'
    }
  },
  {
    id: 'donut', cat: 'bakery',
    name: { th: 'โดนัท', en: 'Donut' },
    icon: '🍩', price: 15,
    talk: {
      th: 'โดนัทหน้าช็อกโกแลต นุ่มฟูเลยค่ะ!',
      en: 'Chocolate donut! Fluffy and sweet!'
    }
  },
  {
    id: 'bread', cat: 'bakery',
    name: { th: 'ขนมปังปิ้ง', en: 'Toast Bread' },
    icon: '🍞', price: 6,
    talk: {
      th: 'ขนมปังหอมกรุ่น นุ่มฟูมากค่ะ!',
      en: 'Warm toast bread! Soft and crispy!'
    }
  },

  // 🍭 ขนมหวาน & เครื่องดื่ม (sweet)
  {
    id: 'icecream', cat: 'sweet',
    name: { th: 'ไอศกรีม', en: 'Ice Cream' },
    icon: '🍦', price: 10,
    talk: {
      th: 'ไอศกรีมหวานเย็น ชื่นใจที่สุดค่ะ!',
      en: 'Cold and creamy ice cream! Yummy!'
    }
  },
  {
    id: 'milk', cat: 'sweet',
    name: { th: 'นมสดกล่อง', en: 'Fresh Milk' },
    icon: ICONS.milk, price: 10,
    talk: {
      th: 'นมสดดื่มแล้วแข็งแรง ตัวโตไว ๆ นะคะ!',
      en: 'Fresh milk! Drink milk and grow big and strong!'
    }
  },
  {
    id: 'candy', cat: 'sweet',
    name: { th: 'อมยิ้ม', en: 'Lollipop' },
    icon: '🍭', price: 5,
    talk: {
      th: 'อมยิ้มหวาน ๆ เพิ่มความสดใสค่ะ!',
      en: 'Sweet lollipop! Rainbow candy!'
    }
  },
  {
    id: 'pudding', cat: 'sweet',
    name: { th: 'พุดดิ้ง', en: 'Pudding' },
    icon: '🍮', price: 14,
    talk: {
      th: 'พุดดิ้งดึ๋งดั๋ง หวานละมุนลิ้นค่ะ!',
      en: 'Jiggly pudding! Sweet and smooth!'
    }
  },
  {
    id: 'chocolate', cat: 'sweet',
    name: { th: 'ช็อกโกแลต', en: 'Chocolate' },
    icon: '🍫', price: 12,
    talk: {
      th: 'ช็อกโกแลตเข้มข้น อร่อยติดใจเลยค่ะ!',
      en: 'Chocolate bar! Rich and delicious!'
    }
  },
  {
    id: 'bear', cat: 'sweet',
    name: { th: 'ตุ๊กตาหมี', en: 'Teddy Bear' },
    icon: ICONS.bear, price: 25,
    talk: {
      th: 'น้องหมีนุ่มนิ่ม น่ารักจังเลย!',
      en: 'Teddy bear! So soft, cuddly and cute!'
    }
  }
];

let cart = [];
let currentShopCat = 'all';

function setShopCat(cat) {
  currentShopCat = cat;
  document.querySelectorAll('.shop-cat-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.cat === cat);
  });
  renderProducts();
}

function renderProducts() {
  const shelf = $('productShelf');
  if (!shelf) return;
  shelf.innerHTML = '';
  const filtered = currentShopCat === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.cat === currentShopCat);

  filtered.forEach(p => {
    const pName = getItemName(p);
    const card = document.createElement('div');
    card.className = 'prod-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <div class="prod-emoji">${p.icon}</div>
      <div class="prod-name">${pName}</div>
      <div class="prod-price">${p.price}฿</div>
    `;
    card.addEventListener('click', (e) => addToCart(p, e));
    shelf.appendChild(card);
  });
}

/* ---- Shopping Quest System ---- */
let currentQuest = null;

function newQuest() {
  const pool = PRODUCTS.filter(p => p.id !== 'bear');
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  currentQuest = {
    items: shuffled.slice(0, 2),
    completed: false
  };
  renderQuest();
}

function renderQuest() {
  const box = $('questBox');
  const speech = $('questSpeech');
  const itemsBox = $('questItems');
  if (!box || !speech || !itemsBox || !currentQuest) return;

  const sep = currentLang === 'en' ? ' and ' : ' กับ ';
  const names = currentQuest.items.map(it => getItemName(it)).join(sep);
  speech.innerHTML = currentLang === 'en' 
    ? `Please put <b>${names}</b> into the basket:`
    : `ช่วยหยิบ <b>${names}</b> ใส่ตะกร้าหน่อยนะคะหนู:`;

  itemsBox.innerHTML = '';
  currentQuest.items.forEach(it => {
    const inCart = cart.some(c => c.id === it.id);
    const itName = getItemName(it);
    const chip = document.createElement('span');
    chip.className = 'quest-chip' + (inCart ? ' found' : '');
    chip.innerHTML = `${it.icon} ${itName} ${inCart ? '✓' : ''}`;
    itemsBox.appendChild(chip);
  });
}

function checkQuest() {
  if (!currentQuest || currentQuest.completed) return;
  const targetIds = currentQuest.items.map(it => it.id);
  const cartIds = cart.map(c => c.id);
  const allFound = targetIds.every(id => cartIds.includes(id));
  renderQuest();

  if (allFound) {
    currentQuest.completed = true;
    stars += 2;
    try { localStorage.setItem('nida_stars', String(stars)); } catch(e){}
    renderStars();
    SoundFX.fanfare();
    launchConfetti(50);
    $('questBox').classList.add('quest-done');
    $('questSpeech').innerHTML = currentLang === 'en'
      ? '🎉 <b>Quest Complete!</b> Found everything! +2 Stars ⭐⭐'
      : '🎉 <b>ภารกิจสำเร็จแล้ว!</b> ได้ของครบแล้ว ได้ดาวพิเศษ +2 ดวง ⭐⭐';
    speakText(currentLang === 'en'
      ? "Hooray! You found everything in the quest! You are amazing! Two bonus stars for you!"
      : "ว้าววว! ได้ของครบตามที่อยากได้แล้ว น้องนิดาเก่งที่สุดเลยค่ะ ได้ดาวพิเศษเพิ่มสองดวงเลย!");
    setTimeout(() => {
      $('questBox').classList.remove('quest-done');
      newQuest();
    }, 4500);
  }
}

function addToCart(product, event) {
  getAudioContext();
  SoundFX.scanLaser();
  cart.push(product);
  updateCartDisplay();
  checkQuest();

  // Barcode scanner laser visual on the card
  const card = event ? event.currentTarget : null;
  if (card) {
    card.classList.remove('scanned');
    void card.offsetWidth;
    card.classList.add('scanned');
    setTimeout(() => card.classList.remove('scanned'), 350);
  }

  // Flying icon towards bunny
  if (event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const targetRect = $('stage').getBoundingClientRect();
    createFlyingEmoji(product.icon, rect.left + rect.width / 2, rect.top, targetRect.left + targetRect.width / 2, targetRect.top + targetRect.height * 0.6);
  }

  // Character reaction
  $('stage').className = 'stage act-2';
  speakText(getItemTalk(product));
}

function updateCartDisplay() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  $('cartCount').textContent = currentLang === 'en' 
    ? `Cart: ${cart.length} ${cart.length === 1 ? 'item' : 'items'} 🔍`
    : `ตะกร้า: ${cart.length} ชิ้น 🔍`;
  $('cartTotal').textContent = currentLang === 'en' ? `Total: ${total} ฿` : `รวม: ${total} บาท`;
  $('tagText').textContent = `${total}฿`;
  if (total > 0) {
    $('tag').classList.add('show');
  } else {
    $('tag').classList.remove('show');
  }
}

/* ---- Shopping Basket Manager Modal ---- */
function openBasket() {
  getAudioContext();
  SoundFX.boing();
  renderBasket();
  $('basketOverlay').classList.add('show');
}

function renderBasket() {
  const list = $('basketItems');
  const sub = $('basketSubtitle');
  const totalEl = $('basketTotal');
  if (!list) return;

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  sub.textContent = currentLang === 'en' 
    ? `Total ${cart.length} ${cart.length === 1 ? 'item' : 'items'} in basket`
    : `มีสินค้าทั้งหมด ${cart.length} ชิ้น`;
  totalEl.textContent = currentLang === 'en' ? `Total: ${total} ฿` : `รวม: ${total} บาท`;

  if (cart.length === 0) {
    list.innerHTML = currentLang === 'en'
      ? '<div style="text-align:center;padding:24px 10px;color:var(--ink-light);font-size:14px;font-weight:700;">Your basket is empty! 🐰<br>Tap some treats and fruits to add them!</div>'
      : '<div style="text-align:center;padding:24px 10px;color:var(--ink-light);font-size:14px;font-weight:700;">ตะกร้ายังว่างอยู่เลยค่ะ 🐰<br>แตะเลือกขนมและผลไม้ใส่ตะกร้าได้เลยนะคะ</div>';
    return;
  }

  list.innerHTML = '';
  cart.forEach((it, idx) => {
    const row = document.createElement('div');
    row.className = 'basket-row';
    const itemName = getItemName(it);
    row.innerHTML = `
      <div class="basket-item-info">
        <span style="font-size:22px;line-height:1;">${it.icon}</span>
        <span>${itemName}</span>
        <b>${it.price}฿</b>
      </div>
      <button type="button" class="basket-remove-btn" title="${currentLang === 'en' ? 'Remove item' : 'เอาชิ้นนี้ออก'}">✕</button>
    `;
    row.querySelector('.basket-remove-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      removeFromCart(idx);
    });
    list.appendChild(row);
  });
}

function removeFromCart(idx) {
  if (idx < 0 || idx >= cart.length) return;
  getAudioContext();
  SoundFX.boing();
  const removed = cart.splice(idx, 1)[0];
  updateCartDisplay();
  renderBasket();
  checkQuest();
  const rName = getItemName(removed);
  speakText(currentLang === 'en' ? `Removed ${rName} from your basket!` : `เอา${rName}ออกจากตะกร้าแล้วค่ะ`);
}

/* ---- Digital Toy Scale System ---- */
const SCALE_FRUITS = [
  { id: 'carrot', name: { th: 'แครอทสด', en: 'Fresh Carrot' }, icon: ICONS.carrot, basePrice: 2, unitWeight: 0.5 },
  { id: 'apple', name: { th: 'แอปเปิ้ล', en: 'Red Apple' }, icon: '🍎', basePrice: 5, unitWeight: 0.6 },
  { id: 'banana', name: { th: 'กล้วยหอม', en: 'Banana' }, icon: '🍌', basePrice: 3, unitWeight: 0.8 },
  { id: 'watermelon', name: { th: 'แตงโม', en: 'Watermelon' }, icon: '🍉', basePrice: 8, unitWeight: 1.5 },
  { id: 'orange', name: { th: 'ส้มหวาน', en: 'Sweet Orange' }, icon: '🍊', basePrice: 4, unitWeight: 0.5 },
  { id: 'berry', name: { th: 'สตรอว์เบอร์รี', en: 'Strawberry' }, icon: '🍓', basePrice: 5, unitWeight: 0.4 }
];
let selectedScaleFruit = null;
let scaleWeightVal = 0;
let scalePriceVal = 0;

function openScale() {
  getAudioContext();
  SoundFX.boing();
  selectedScaleFruit = null;
  scaleWeightVal = 0;
  scalePriceVal = 0;
  $('scaleWeight').textContent = '0.00 kg';
  $('scalePrice').textContent = '0 ฿';
  $('scaleItemPlaced').innerHTML = '<span class="scale-empty-icon">🥦</span>';
  $('scaleAddBtn').disabled = true;
  $('scaleHint').textContent = currentLang === 'en' 
    ? 'Tap a fruit below to place it on the scale' 
    : 'แตะเลือกผลไม้ด้านล่างเพื่อวางบนตาชั่งค่ะ';

  const container = $('scaleFruits');
  container.innerHTML = '';
  SCALE_FRUITS.forEach(f => {
    const fName = getItemName(f);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'scale-fruit-btn';
    btn.innerHTML = `<span class="scale-fruit-emoji">${f.icon}</span><span>${fName}</span>`;
    btn.addEventListener('click', () => selectScaleFruit(f, btn));
    container.appendChild(btn);
  });

  $('scaleOverlay').classList.add('show');
  speakText(currentLang === 'en' 
    ? 'Welcome to the digital fruit scale! Tap a fruit to weigh it on the scale!'
    : 'นี่คือเครื่องชั่งผลไม้ดิจิทัลค่ะ แตะเลือกผลไม้มาวางบนตาชั่งได้เลย!');
}

function selectScaleFruit(fruit, btnEl) {
  getAudioContext();
  SoundFX.scaleBeep();
  selectedScaleFruit = fruit;
  document.querySelectorAll('.scale-fruit-btn').forEach(b => b.classList.remove('selected'));
  if (btnEl) btnEl.classList.add('selected');

  const mult = 1 + Math.floor(Math.random() * 3);
  scaleWeightVal = (fruit.unitWeight * mult).toFixed(2);
  scalePriceVal = fruit.basePrice * mult;

  const placed = $('scaleItemPlaced');
  placed.innerHTML = `<span style="font-size:46px;line-height:1;">${fruit.icon}</span>`;
  placed.classList.remove('weighing');
  void placed.offsetWidth;
  placed.classList.add('weighing');

  $('scaleWeight').textContent = `${scaleWeightVal} kg`;
  $('scalePrice').textContent = `${scalePriceVal} ฿`;
  $('scaleAddBtn').disabled = false;
  const fName = getItemName(fruit);
  $('scaleHint').textContent = currentLang === 'en'
    ? `${fName} weighs ${scaleWeightVal} kg. Price is ${scalePriceVal} ฿!`
    : `${fName} หนัก ${scaleWeightVal} กก. ราคา ${scalePriceVal} บาทค่ะ!`;

  speakText(currentLang === 'en'
    ? `${fName}! Weight is ${scaleWeightVal} kilograms, price is ${scalePriceVal} Baht!`
    : `${fName} น้ำหนัก ${scaleWeightVal} กิโลกรัม ราคา ${scalePriceVal} บาทค่ะ`);
}

function addScaleItemToCart() {
  if (!selectedScaleFruit) return;
  getAudioContext();
  SoundFX.printReceipt();
  setTimeout(SoundFX.scanLaser, 200);

  const thName = `${selectedScaleFruit.name.th || selectedScaleFruit.name} (${scaleWeightVal}กก.)`;
  const enName = `${selectedScaleFruit.name.en || selectedScaleFruit.name} (${scaleWeightVal}kg)`;

  const weightedItem = {
    id: selectedScaleFruit.id,
    name: { th: thName, en: enName },
    icon: selectedScaleFruit.icon,
    price: scalePriceVal,
    talk: {
      th: `ชั่งน้ำหนัก ${selectedScaleFruit.name.th} ${scaleWeightVal} กิโลกรัม เรียบร้อยแล้วค่ะ!`,
      en: `Weighed ${selectedScaleFruit.name.en} ${scaleWeightVal} kilograms! Ready to buy!`
    }
  };

  cart.push(weightedItem);
  updateCartDisplay();
  checkQuest();

  $('scaleOverlay').classList.remove('show');
  launchConfetti(30);
  const fName = getItemName(selectedScaleFruit);
  speakText(currentLang === 'en'
    ? `Price tag printed for ${fName}! Added to basket!`
    : `พิมพ์ป้ายราคา ${fName} ใส่ตะกร้าเรียบร้อยค่ะ!`);
}

let stars = 0;
try { stars = parseInt(localStorage.getItem('nida_stars') || '0', 10) || 0; } catch(e){}
function renderStars() { let b = $('starBadge'); if (!b) { b = document.createElement('div'); b.id = 'starBadge'; $('stage').appendChild(b); } b.textContent = '⭐ ' + stars; }

/* ---- Cash Register Drawer Checkout ---- */
function checkout() {
  if (cart.length === 0) {
    SoundFX.boing();
    speakText(currentLang === 'en' ? "Your basket is empty! Let's choose some items first!" : "ยังไม่มีของในตะกร้าเลยค่ะ ลองแตะเลือกของก่อนนะคะหนู");
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  getAudioContext();
  SoundFX.cashDrawer();

  $('payTitle').textContent = currentLang === 'en' ? `Total ${total} ฿. How much do you pay?` : `รวม ${total} บาท หนูจ่ายเท่าไหร่คะ?`;
  $('drawerHint').textContent = currentLang === 'en' ? `Total is ${total} ฿. Tap money to pay! ✨` : `ยอดรวม ${total} บาท แตะเงินที่คุณพ่อให้มาเพื่อจ่ายนะคะ ✨`;

  const billsBox = $('drawerBills');
  billsBox.innerHTML = '';
  const coinsBox = $('drawerCoins');
  coinsBox.innerHTML = '';

  const BILLS = [
    { v: 20, cls: 'bill-20', label: '20฿' },
    { v: 50, cls: 'bill-50', label: '50฿' },
    { v: 100, cls: 'bill-100', label: '100฿' },
    { v: 500, cls: 'bill-500', label: '500฿' }
  ];

  const COINS = [
    { v: 10, cls: 'coin-10', label: '10฿' },
    { v: 5, cls: 'coin-5', label: '5฿' },
    { v: 2, cls: 'coin-2', label: '2฿' },
    { v: 1, cls: 'coin-1', label: '1฿' }
  ];

  BILLS.forEach(b => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `drawer-bill ${b.cls}`;
    btn.textContent = b.label;
    btn.addEventListener('click', () => handlePayAmount(b.v, total));
    billsBox.appendChild(btn);
  });

  COINS.forEach(c => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `drawer-coin ${c.cls}`;
    btn.textContent = c.label;
    btn.addEventListener('click', () => handlePayAmount(c.v, total));
    coinsBox.appendChild(btn);
  });

  $('payOverlay').classList.add('show');
  speakText(currentLang === 'en' 
    ? `The total is ${total} Baht! The cash drawer is open. How much would you like to pay?`
    : `ยอดรวมทั้งหมด ${total} บาทค่ะ ลิ้นชักเปิดแล้ว หนูจ่ายเงินเท่าไหร่คะ`);
}

function handlePayAmount(amount, total) {
  if (amount < total) {
    getAudioContext();
    SoundFX.boing();
    const short = total - amount;
    $('drawerHint').textContent = currentLang === 'en'
      ? `${amount} ฿ is not enough (need ${short} ฿ more). Try a bigger note! ✨`
      : `เงิน ${amount} บาท ยังไม่พอนะคะ (ขาดอีก ${short} บาท) ลองเลือกแบงก์ที่มากกว่านี้นะคะ ✨`;
    speakText(currentLang === 'en'
      ? `${amount} Baht is not quite enough. The total is ${total} Baht. Let's pick a bigger bill!`
      : `เงิน ${amount} บาท ยังไม่พอนะคะ ยอดทั้งหมด ${total} บาท ลองเลือกแบงก์ที่มากกว่านี้นะคะหนู`);
    return;
  }
  $('payOverlay').classList.remove('show');
  finishCheckout(total, amount - total);
}

function showReceipt(items, total, change) {
  const meta = $('receiptMeta');
  const now = new Date();
  const loc = currentLang === 'en' ? 'en-US' : 'th-TH';
  const dStr = now.toLocaleDateString(loc) + ' ' + now.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' });
  if (meta) meta.textContent = (currentLang === 'en' ? 'Time: ' : 'เวลา: ') + dStr;

  const box = $('receiptItems');
  if (box) {
    box.innerHTML = '';
    items.forEach(it => {
      const row = document.createElement('div');
      row.className = 'receipt-line';
      const itName = getItemName(it);
      row.innerHTML = `<span>${itName}</span><span>${it.price}฿</span>`;
      box.appendChild(row);
    });
  }

  const tEl = $('receiptTotal');
  if (tEl) {
    if (currentLang === 'en') {
      tEl.textContent = `Total: ${total} ฿` + (change > 0 ? ` (Change ${change}฿)` : '');
    } else {
      tEl.textContent = `ยอดรวม: ${total} บาท` + (change > 0 ? ` (ทอน ${change}฿)` : '');
    }
  }

  const sEl = $('receiptStars');
  if (sEl) sEl.textContent = currentLang === 'en' ? `⭐ Total Stars: ${stars} ⭐` : `⭐ ดาวสะสม: ${stars} ดวง ⭐`;

  SoundFX.printReceipt();
  $('receiptOverlay').classList.add('show');
}

function finishCheckout(total, change) {
  getAudioContext();
  SoundFX.cashRegister();
  setTimeout(SoundFX.fanfare, 280);
  launchConfetti(55);
  stars++;
  try { localStorage.setItem('nida_stars', String(stars)); } catch(e){}
  renderStars();

  unlockRandomSticker();

  $('stage').className = 'stage act-3';
  $('tag').classList.add('show');

  const boughtItems = [...cart];
  let changeTxt = '';
  if (currentLang === 'en') {
    changeTxt = change > 0 ? ` Here is your change: ${change} ฿!` : ' Exact payment, well done!';
  } else {
    changeTxt = change > 0 ? ` ทอนเงิน ${change} บาทค่ะ` : ' จ่ายพอดีเลยค่ะ เก่งมาก';
  }

  const praisesTH = [
    `คิดเงินเรียบร้อย รวม ${total} บาท${changeTxt} ขอบคุณลูกค้าน่ารักนะคะ!`,
    `ทั้งหมด ${total} บาทค่ะ${changeTxt} ขอให้ทานให้อร่อยนะคะ`,
    `เย้ ซื้อของครบแล้ว ${total} บาท${changeTxt} ขอบคุณน้องนิดามากค่ะ!`
  ];
  const praisesEN = [
    `Payment complete! Total is ${total} Baht.${changeTxt} Thank you for shopping with us!`,
    `That is ${total} Baht.${changeTxt} Enjoy your yummy treats!`,
    `Hooray! All done, ${total} Baht.${changeTxt} Thank you so much!`
  ];
  const praises = currentLang === 'en' ? praisesEN : praisesTH;
  let msg = praises[Math.floor(Math.random() * praises.length)];
  if (stars % 5 === 0) {
    msg += currentLang === 'en' ? ` Wow, you earned ${stars} stars! Super clever!` : ` ว้าว ได้ดาวครบ ${stars} ดวงแล้ว เก่งที่สุดเลย!`;
    setTimeout(() => { launchConfetti(70); SoundFX.fanfare(); }, 700);
  }
  speakText(msg, 1.4, 0.86, () => {
    cart = [];
    updateCartDisplay();
    setTimeout(() => showReceipt(boughtItems, total, change), 350);
  });
}

/* ---- Dress-up (v2.9: categories, 22 items, dress colours) ---- */
const DRESS_CATS = [
  { k: 'hat',   icon: '🎩', name: { th: 'หมวก', en: 'Hats' } },
  { k: 'face',  icon: '👓', name: { th: 'หน้า', en: 'Face' } },
  { k: 'body',  icon: '👗', name: { th: 'ตัว', en: 'Body' } },
  { k: 'hold',  icon: '🎈', name: { th: 'ถือ', en: 'Hold' } },
  { k: 'color', icon: '🎨', name: { th: 'สีชุด', en: 'Dress' } }
];

const DRESS = [
  { k: 'Crown',   cat: 'hat',  e: '👑',           n: { th: 'มงกุฎ', en: 'Crown' },        say: { th: 'มงกุฎสวยจังเลยค่ะ เหมือนเจ้าหญิงเลย', en: 'Sparkling princess crown! So pretty!' } },
  { k: 'Chef',    cat: 'hat',  e: ICONS.chef,     n: { th: 'หมวกเชฟ', en: 'Chef Hat' },      say: { th: 'หมวกเชฟค่ะ วันนี้ทำขนมอร่อย ๆ กันนะคะ', en: 'Little chef hat! Let us bake yummy treats!' } },
  { k: 'Party',   cat: 'hat',  e: '🎉',           n: { th: 'หมวกปาร์ตี้', en: 'Party Hat' },   say: { th: 'หมวกปาร์ตี้ค่ะ ฉลองกันเลย', en: 'Party hat! Let us celebrate!' } },
  { k: 'Cap',     cat: 'hat',  e: ICONS.cap,      n: { th: 'หมวกแก๊ป', en: 'Cap' },      say: { th: 'หมวกแก๊ปสีฟ้า เท่จังเลยค่ะ', en: 'Cool blue baseball cap! Looking sporty!' } },
  { k: 'Wizard',  cat: 'hat',  e: ICONS.wizard,   n: { th: 'หมวกพ่อมด', en: 'Wizard Hat' },    say: { th: 'หมวกพ่อมดค่ะ ซิมซาลาบิม เสกขนมออกมาเลย', en: 'Magic wizard hat! Simzalabim, make a wish!' } },
  { k: 'Flower',  cat: 'hat',  e: '🌸',           n: { th: 'ติดดอกไม้', en: 'Flower' },     say: { th: 'ดอกไม้สวยจังเลย หอมด้วยนะคะ', en: 'Pink flower clip! Smells so sweet!' } },
  { k: 'Glasses', cat: 'face', e: '👓',           n: { th: 'แว่นตา', en: 'Glasses' },        say: { th: 'ใส่แว่นแล้วดูฉลาดเลยค่ะ', en: 'Round glasses! Looking so smart!' } },
  { k: 'Shades',  cat: 'face', e: '😎',           n: { th: 'แว่นกันแดด', en: 'Sunglasses' },    say: { th: 'แว่นกันแดด เท่สุด ๆ ไปเลยค่ะ', en: 'Cool sunglasses! Super stylish!' } },
  { k: 'HeartGlasses', cat: 'face', e: '😍',      n: { th: 'แว่นหัวใจ', en: 'Heart Glasses' },     say: { th: 'แว่นหัวใจ น่ารักที่สุดเลยค่ะ', en: 'Heart glasses! So cute and sweet!' } },
  { k: 'Mustache', cat: 'face', e: ICONS.mustache, n: { th: 'หนวด', en: 'Mustache' },        say: { th: 'ฮ่า ฮ่า หนวดเท่ ๆ เหมือนคุณลุงเลยค่ะ', en: 'Haha, a funny gentleman mustache!' } },
  { k: 'Sticker', cat: 'face', e: '⭐',           n: { th: 'สติกเกอร์แก้ม', en: 'Cheek Star' }, say: { th: 'สติกเกอร์ดาวกับหัวใจที่แก้ม น่ารักจัง', en: 'Star sticker on cheeks! So cute!' } },
  { k: 'Phones',  cat: 'face', e: '🎧',           n: { th: 'หูฟัง', en: 'Headphones' },         say: { th: 'ใส่หูฟัง ฟังเพลงเพราะ ๆ กันค่ะ', en: 'Cute headphones! Listening to fun music!' } },
  { k: 'Scarf',   cat: 'body', e: ICONS.scarf,    n: { th: 'ผ้าพันคอ', en: 'Warm Scarf' },      say: { th: 'ผ้าพันคอ อุ่นสบายเลยค่ะ', en: 'Warm red scarf! Nice and cozy!' } },
  { k: 'Bowtie',  cat: 'body', e: '🎀',           n: { th: 'โบว์ผูกคอ', en: 'Bowtie' },     say: { th: 'โบว์ผูกคอสีม่วง ดูเป็นสุภาพบุรุษเลยค่ะ', en: 'Purple bowtie! Very classy!' } },
  { k: 'Necklace', cat: 'body', e: ICONS.necklace, n: { th: 'สร้อยไข่มุก', en: 'Pearl Necklace' },  say: { th: 'สร้อยไข่มุกสวยแวววาวเลยค่ะ', en: 'Shiny pearl necklace! So elegant!' } },
  { k: 'Apron',   cat: 'body', e: ICONS.apron,    n: { th: 'ผ้ากันเปื้อน', en: 'Shop Apron' },  say: { th: 'ผ้ากันเปื้อน พร้อมขายของแล้วค่ะ', en: 'Shopkeeper apron! Ready to serve customers!' } },
  { k: 'Cape',    cat: 'body', e: ICONS.cape,     n: { th: 'ผ้าคลุมฮีโร่', en: 'Hero Cape' },  say: { th: 'ผ้าคลุมซุปเปอร์ฮีโร่ บินได้เลยนะคะ ฟิ้วว', en: 'Superhero cape! Ready to fly, whoosh!' } },
  { k: 'Wings',   cat: 'body', e: ICONS.wings,    n: { th: 'ปีกนางฟ้า', en: 'Fairy Wings' },     say: { th: 'ปีกนางฟ้า กระพือปีกได้ด้วยนะคะ', en: 'Fairy wings! Flap flap flap!' } },
  { k: 'Wand',    cat: 'hold', e: '✨',           n: { th: 'ไม้กายสิทธิ์', en: 'Magic Wand' },   say: { th: 'ไม้กายสิทธิ์ค่ะ วิบ วิบ เสกให้เลย', en: 'Magic wand! Sparkle sparkle magic!' } },
  { k: 'Balloon', cat: 'hold', e: '🎈',           n: { th: 'ลูกโป่ง', en: 'Balloon' },       say: { th: 'ลูกโป่งสีแดง ลอยสูงเลยค่ะ', en: 'Red balloon! Flying high in the sky!' } },
  { k: 'Lollipop', cat: 'hold', e: '🍭',          n: { th: 'อมยิ้มยักษ์', en: 'Giant Lollipop' },   say: { th: 'อมยิ้มใหญ่มาก หวานจัง', en: 'Giant rainbow lollipop! Super sweet!' } },
  { k: 'Bouquet', cat: 'hold', e: '💐',           n: { th: 'ช่อดอกไม้', en: 'Flower Bouquet' },     say: { th: 'ช่อดอกไม้ให้คุณแม่ค่ะ', en: 'Flower bouquet for Mommy! So lovely!' } }
];

const ACCS = DRESS.map(d => d.k);
const SLOTS = [
  ['Crown', 'Chef', 'Party', 'Cap', 'Wizard'],
  ['Glasses', 'Shades', 'HeartGlasses'],
  ['Scarf', 'Bowtie', 'Necklace'],
  ['Wand', 'Balloon', 'Lollipop', 'Bouquet'],
  ['Cape', 'Wings']
];
const SOLO = ['Flower', 'Phones', 'Mustache', 'Sticker', 'Apron'];

function getAccSay(key) {
  if (key === 'none') return currentLang === 'en' ? "Back to original cute Nida!" : 'กลับมาเป็นน้องนิดาตัวเดิมแล้วค่ะ';
  if (key === 'random') return currentLang === 'en' ? "New outfit! Looking so pretty!" : 'ชุดใหม่แล้วค่ะ สวยไหมคะ';
  const found = DRESS.find(d => d.k === key);
  return found ? getItemTalk(found) : '';
}

const DRESS_COLORS = {
  pink:    { n: { th: 'ชมพู', en: 'Pink' },  stops: ['#ffb3cf', '#ff8bb5'], belt: '#ff6fa3', css: '#ff8bb5' },
  blue:    { n: { th: 'ฟ้า', en: 'Blue' },   stops: ['#a8dcff', '#6bb8ff'], belt: '#3f8fe8', css: '#6bb8ff' },
  purple:  { n: { th: 'ม่วง', en: 'Purple' },  stops: ['#d6b8ff', '#b58cff'], belt: '#8f5cf0', css: '#b58cff' },
  yellow:  { n: { th: 'เหลือง', en: 'Yellow' }, stops: ['#fff0a0', '#ffd84d'], belt: '#ffb100', css: '#ffd84d' },
  green:   { n: { th: 'เขียว', en: 'Green' }, stops: ['#b6f0cf', '#6fdca4'], belt: '#2fbf7e', css: '#6fdca4' },
  red:     { n: { th: 'แดง', en: 'Red' },   stops: ['#ffb0b0', '#ff7070'], belt: '#e84040', css: '#ff7070' },
  rainbow: { n: { th: 'สายรุ้ง', en: 'Rainbow' }, stops: ['#ff6b6b', '#ffb347', '#ffe14d', '#6fdca4', '#5ab4ff', '#b58cff'], belt: '#ff5c8a',
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
  speakText(turningOn ? getAccSay(a) : (currentLang === 'en' ? 'Item removed!' : 'ถอดออกแล้วค่ะ'));
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
  if (!cats || !grid || !colors) return;
  cats.innerHTML = '';
  grid.innerHTML = '';
  colors.innerHTML = '';

  DRESS_CATS.forEach(c => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'cat-chip'; b.dataset.cat = c.k; b.setAttribute('role', 'tab');
    b.innerHTML = `<span>${c.icon}</span><span>${getItemName(c)}</span>`;
    b.addEventListener('click', () => { getAudioContext(); SoundFX.boing(); showDressCat(c.k); });
    cats.appendChild(b);
  });

  DRESS.forEach(d => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'dress-card'; b.dataset.acc = d.k; b.dataset.cat = d.cat; b.setAttribute('aria-pressed', 'false');
    b.innerHTML = `<span class="dress-emoji">${d.e}</span>${getItemName(d)}`;
    b.addEventListener('click', () => toggleAcc(d.k));
    grid.appendChild(b);
  });

  Object.entries(DRESS_COLORS).forEach(([k, c]) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'swatch'; b.dataset.color = k; b.setAttribute('aria-pressed', 'false');
    const colName = getItemName(c);
    b.innerHTML = `<i style="background:${c.css}"></i>${colName}`;
    b.addEventListener('click', () => {
      ensureVector(); getAudioContext();
      dressColor = k; applyDressColor(); SoundFX.boing(); launchConfetti(12);
      speakText(currentLang === 'en' ? `${colName} dress! Looks so lovely!` : `ชุดสี${colName} สวยจังเลยค่ะ`);
    });
    colors.appendChild(b);
  });

  document.querySelectorAll('.dress-actions [data-acc]').forEach(btn => {
    btn.onclick = () => {
      ensureVector(); getAudioContext();
      const a = btn.dataset.acc;
      if (a === 'none') { outfit = {}; dressColor = 'pink'; SoundFX.boing(); }
      else { randomOutfit(); SoundFX.fanfare(); launchConfetti(30); }
      applyOutfit(); applyDressColor();
      speakText(getAccSay(a));
    };
  });
  showDressCat(dressCat);
}

function clearCart() {
  if (cart.length === 0) return;
  SoundFX.boing();
  cart = [];
  updateCartDisplay();
  checkQuest();
  speakText(currentLang === 'en' ? "Cart cleared! Let's choose new goodies!" : "เริ่มเลือกรอบใหม่กันเลยค่ะ");
}

/* ============================================================
   5. FEEDING THE BUNNY
   ============================================================ */
const TREATS = [
  {
    name: { th: 'แครอท', en: 'Carrot' }, icon: ICONS.carrot,
    talk: {
      th: 'ง่ำ ๆๆๆ แครอทกรุบกรอบ อร่อยชื่นใจที่สุดเลย!',
      en: 'Munch munch munch! Crunchy carrot is so delicious!'
    }
  },
  {
    name: { th: 'สตรอว์เบอร์รี', en: 'Strawberry' }, icon: '🍓',
    talk: {
      th: 'ง่ำ ๆ หวานฉ่ำ สดชื่นมาก ขอบคุณนะคะหนู!',
      en: 'Yum yum! Sweet and juicy strawberry! Thank you so much!'
    }
  },
  {
    name: { th: 'เค้กหวาน', en: 'Sweet Cake' }, icon: '🍰',
    talk: {
      th: 'ว้าว เค้กนุ่มละมุนลิ้น ฟินที่สุดเลยค่ะ!',
      en: 'Wow, soft and delicious cake! Super yummy!'
    }
  },
  {
    name: { th: 'ไอศกรีม', en: 'Ice Cream' }, icon: '🍦',
    talk: {
      th: 'เย็นเจี๊ยบ หวานหอม อร่อยชื่นใจจัง!',
      en: 'Cold and sweet ice cream! So refreshing!'
    }
  },
  {
    name: { th: 'แอปเปิ้ล', en: 'Red Apple' }, icon: '🍎',
    talk: {
      th: 'กรุบกรอบ วิตามินซีเต็มเปี่ยมเลยค่ะ!',
      en: 'Crispy red apple! Full of healthy vitamins!'
    }
  },
  {
    name: { th: 'คุกกี้', en: 'Cookie' }, icon: '🍪',
    talk: {
      th: 'คุกกี้หอมเนยมาก ๆ ขอน้องนิดากินอีกชิ้นนะคะ!',
      en: 'Buttery crispy cookie! Can Nida have one more please?'
    }
  }
];

function renderFeedShelf() {
  const shelf = $('feedShelf');
  if (!shelf) return;
  shelf.innerHTML = '';
  TREATS.forEach(t => {
    const tName = getItemName(t);
    const item = document.createElement('div');
    item.className = 'feed-item';
    item.innerHTML = `
      <div class="prod-emoji">${t.icon}</div>
      <span>${currentLang === 'en' ? 'Feed ' + tName : 'ป้อน ' + tName}</span>
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
      speakText(getItemTalk(treat), 1.48, 0.88);
    }, 750);
  });
}

/* ============================================================
   6. ROLEPLAY (1-4)
   ============================================================ */
const T = {
  1: {
    th: [
      "สวัสดีค่ะ ยินดีต้อนรับสู่ร้านน้องนิดานะคะ",
      "สวัสดีจ้า เข้ามาเลือกของน่ารัก ๆ ได้เลยค่ะ",
      "ฮัลโหล ยินดีต้อนรับนะคะ วันนี้มีของน่ารักเต็มร้านเลย"
    ],
    en: [
      "Hello! Welcome to Nida's Shop!",
      "Welcome! Come in and look at all the lovely treats!",
      "Hi there! Welcome! We have so many goodies today!"
    ]
  },
  2: {
    th: [
      "รับอะไรเพิ่มอีกไหมคะ",
      "อยากได้ขนมหรือของเล่นอีกชิ้นไหมเอ่ย",
      "มีอะไรที่อยากเลือกเพิ่มอีกไหมคะ"
    ],
    en: [
      "What would you like to buy today?",
      "Would you like some sweet treats or toys?",
      "Can I help you find something special?"
    ]
  },
  3: {
    th: [
      "ชิ้นนี้ราคาเก้าสิบเก้าบาทค่ะ",
      "ราคาเก้าสิบเก้าบาทนะคะ ขอบคุณค่ะ",
      "ทั้งหมดเก้าสิบเก้าบาทค่ะ"
    ],
    en: [
      "This is ninety-nine Baht, please!",
      "The price is ninety-nine Baht, thank you!",
      "That will be ninety-nine Baht!"
    ]
  },
  4: {
    th: [
      "ขอบคุณมาก ๆ นะคะ แล้วแวะมาเล่นกันอีกนะ",
      "ขอบคุณที่มาร้านน้องนิดาค่ะ บ๊ายบาย",
      "เย้ ขอบคุณนะคะ ขอให้วันนี้เป็นวันที่สดใสค่ะ"
    ],
    en: [
      "Thank you so much! Please come and play again soon!",
      "Thank you for shopping at Nida's Shop! Bye bye!",
      "Hooray! Thank you! Have a bright and wonderful day!"
    ]
  }
};

function sayRoleplay(k) {
  if (!T[k]) return;
  currentAction = Number(k);
  const group = T[k][currentLang] || T[k]['th'];
  const text = group[Math.floor(Math.random() * group.length)];
  $('stage').className = 'stage act-' + currentAction;
  if (k === '1' || k === 1) SoundFX.boing();
  if (k === '3' || k === 3) SoundFX.cashRegister();
  if (k === '4' || k === 4) { SoundFX.fanfare(); launchConfetti(30); }
  speakText(text);
}

/* ============================================================
   7. MOODS
   ============================================================ */
const MOODS = {
  happy: {
    lines: {
      th: ["เย้! ดีใจที่ได้เจอหนูค่ะ", "น้องนิดามีความสุขจังเลย!", "ว้าว วันนี้สดใสจังเลยค่ะ"],
      en: ["Yay! So happy to see you!", "Nida is full of happiness today!", "What a wonderful bright day!"]
    },
    sound: () => { SoundFX.giggle(); launchConfetti(25); }
  },
  laugh: {
    lines: {
      th: ["ฮิฮิฮิ ตลกจังเลยค่ะ", "คิกคิก น้องนิดาขำแล้ว!", "ฮ่า ฮ่า ฮ่า สนุกจังเลย"],
      en: ["Hehehe, that is so funny!", "Giggle giggle, Nida is laughing!", "Ha ha ha, so much fun!"]
    },
    sound: () => SoundFX.giggle()
  },
  surprise: {
    lines: {
      th: ["โอ๊ะ! มีอะไรเอ่ย", "ว้าว! น้องนิดาตกใจเลยค่ะ", "อุ๊ย! นั่นอะไรนะคะ"],
      en: ["Oh! What is that?", "Wow! Nida was surprised!", "Ooh, look at that!"]
    },
    sound: () => SoundFX.boing()
  },
  sleepy: {
    lines: {
      th: ["หาววว น้องนิดาง่วงแล้วค่ะ", "ขอพักตาสักแป๊บนะคะ", "ฝันดีนะคะ หาววว"],
      en: ["Yaaawn, Nida is getting sleepy...", "Time for a little rest... Good night!", "Sweet dreams, yaaawn..."]
    },
    sound: () => SoundFX.boing()
  },
  dance: {
    lines: {
      th: ["ดุ๊กดิ๊ก ดุ๊กดิ๊ก เต้นระบำกันเถอะ!", "ลั้ลลา มาขยับตัวด้วยกันนะคะ", "โยกซ้าย โยกขวา สนุกจังเลย!"],
      en: ["Wiggle wiggle, let's dance together!", "La la la, time to dance and bounce!", "Dance to the left, dance to the right!"]
    },
    sound: () => { SoundFX.fanfare(); launchConfetti(35); }
  },
  praise: {
    lines: {
      th: ["หนูนิดาเก่งที่สุดในโลกเลยค่ะ!", "คนเก่งของพ่อกับแม่ ยอดเยี่ยมมาก!", "ปรบมือให้คนเก่งเลยค่ะ แปะ แปะ แปะ!"],
      en: ["You are the superstar of the whole world!", "Mom and Dad's superstar, wonderful job!", "Clap clap clap for the clever superstar!"]
    },
    sound: () => { SoundFX.fanfare(); launchConfetti(45); }
  }
};

function reactMood(moodKey) {
  const m = MOODS[moodKey];
  if (!m) return;
  $('stage').className = 'stage mood-' + moodKey;
  if (m.sound) m.sound();
  const group = m.lines[currentLang] || m.lines['th'];
  const text = group[Math.floor(Math.random() * group.length)];
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

$('bunnyHead').addEventListener('click', (e) => {
  e.stopPropagation();
  getAudioContext();
  SoundFX.purr();
  $('stage').className = 'stage mood-purr';
  const earL = $('rigEarL'), earR = $('rigEarR');
  if (earL && earR) {
    earL.style.transform = 'rotate(-12deg)';
    earR.style.transform = 'rotate(12deg)';
    setTimeout(() => { earL.style.transform = ''; earR.style.transform = ''; }, 1200);
  }
  const linesTH = [
    "อื้มมม ลูบหัวแล้วสบายจังเลยค่ะ เคลิ้มเลย",
    "งืมมม รักหนูที่สุดเลย ลูบหัวน้องนิดาอีกนะคะ",
    "น้องนิดาชอบให้ลูบหัวที่สุดเลยค่ะ มีความสุขจัง"
  ];
  const linesEN = [
    "Mmm, gentle head pats feel so nice and cozy!",
    "Aww, I love you so much! Please pat my head again!",
    "Nida loves head pats the most! So happy and sweet!"
  ];
  const lines = currentLang === 'en' ? linesEN : linesTH;
  speakText(lines[Math.floor(Math.random() * lines.length)], 1.5, 0.88);
});

$('bunnyNose').addEventListener('click', (e) => {
  e.stopPropagation();
  getAudioContext();
  SoundFX.sneeze();
  $('stage').className = 'stage mood-sneeze';
  launchConfetti(25);
  speakText(currentLang === 'en' ? "Achoooo! My bunny nose is so ticklish! 💨" : "ฮัดเช้ยยย! จมูกคันจังเลยค่ะหนู 💨", 1.6, 0.95);
  setTimeout(() => { $('stage').className = 'stage'; }, 1000);
});

$('bunnyTummy').addEventListener('click', (e) => {
  e.stopPropagation();
  getAudioContext();
  SoundFX.giggle();
  $('stage').className = 'stage mood-laugh';
  speakText(currentLang === 'en' ? "Hehehe, don't tickle Nida's tummy, it tickles so much!" : "คิกคิก อย่าจั๊กจี้พุงนิดาสิคะหนู!", 1.55);
});

$('stage').addEventListener('click', () => {
  getAudioContext();
  SoundFX.boing();
  launchConfetti(20);
  const hellosTH = [
    "สวัสดีค่ะ ดีใจที่หนูมาเล่นกับน้องนิดานะคะ 💕",
    "เย้ กอดกอดกันค่ะ วันนี้เล่นอะไรกันดีเอ่ย",
    "รักหนูจังเลย มาเล่นขายของด้วยกันต่อนะคะ"
  ];
  const hellosEN = [
    "Hello sweetie! So happy you came to play with Nida! 💕",
    "Yay, big warm hugs! What shall we play today?",
    "I love you so much! Let's play shopkeeper together!"
  ];
  const hellos = currentLang === 'en' ? hellosEN : hellosTH;
  speakText(hellos[Math.floor(Math.random() * hellos.length)]);
});

$('soundToggle').addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  $('soundToggle').innerHTML = soundEnabled 
    ? (currentLang === 'en' ? '🔊<span class="lbl"> Sound On</span>' : '🔊<span class="lbl"> เสียงเปิด</span>')
    : (currentLang === 'en' ? '🔇<span class="lbl"> Muted</span>' : '🔇<span class="lbl"> ปิดเสียง</span>');
});

$('replayBubble').addEventListener('click', (e) => {
  e.stopPropagation();
  speakText(currentText);
});
$('bubble').addEventListener('click', () => speakText(currentText));

$('checkoutBtn').addEventListener('click', checkout);
$('clearCartBtn').addEventListener('click', clearCart);

// Shopping Basket Manager
$('cartInfoBtn').addEventListener('click', openBasket);
$('basketClose').addEventListener('click', () => $('basketOverlay').classList.remove('show'));
$('basketOverlay').addEventListener('click', (e) => { if (e.target === $('basketOverlay')) $('basketOverlay').classList.remove('show'); });
$('basketClearBtn').addEventListener('click', () => { clearCart(); renderBasket(); });
$('basketPayBtn').addEventListener('click', () => { $('basketOverlay').classList.remove('show'); checkout(); });

// Digital Fruit & Veggie Scale
$('openScaleBtn').addEventListener('click', openScale);
$('scaleClose').addEventListener('click', () => $('scaleOverlay').classList.remove('show'));
$('scaleOverlay').addEventListener('click', (e) => { if (e.target === $('scaleOverlay')) $('scaleOverlay').classList.remove('show'); });
$('scaleAddBtn').addEventListener('click', addScaleItemToCart);

// Quest Reroll & Categories
$('questRerollBtn').addEventListener('click', () => {
  SoundFX.boing();
  newQuest();
  speakText(currentLang === 'en' ? "Here is a new quest! Let's see what we need!" : "เปลี่ยนรายการของใหม่แล้วค่ะ ลองดูนะคะว่าอยากได้อะไร");
});

document.querySelectorAll('.shop-cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    SoundFX.boing();
    setShopCat(btn.dataset.cat);
  });
});

// Cash Drawer Overlay Close
$('payClose').addEventListener('click', () => $('payOverlay').classList.remove('show'));
$('payOverlay').addEventListener('click', (e) => { if (e.target === $('payOverlay')) $('payOverlay').classList.remove('show'); });

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
    pill.innerHTML = `<span class="status-dot"></span><span class="lbl"> ${currentLang === 'en' ? 'Online' : 'ออนไลน์'}</span>`;
    pill.style.borderColor = 'rgba(62, 201, 146, 0.4)';
  } else {
    pill.innerHTML = `<span class="status-dot offline"></span><span class="lbl"> ${currentLang === 'en' ? 'Offline' : 'ออฟไลน์'}</span>`;
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
   10. FUN TAB: balloons, piano, birthday, photo, scenes, counting
   ============================================================ */
Object.assign(SoundFX, {
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
  sparkle() {
    [1318.5, 1568, 1760, 2093, 2637].forEach((f, i) => setTimeout(() => SoundFX.note(f, 0.1, 0.14), i * 70));
  }
});

const TH_NUM = ['หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า', 'สิบ'];
const EN_NUM = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
const rand = (a, b) => a + Math.random() * (b - a);

/* ---- Scenes ---- */
const SCENES = {
  sunny:  { icon: '🌈', n: { th: 'วันสดใส', en: 'Sunny Day' },    say: { th: 'วันนี้อากาศดีจังเลยค่ะ ท้องฟ้าสดใส', en: 'What a sunny, lovely day! Clear blue skies!' }, bg: ['#fff9e6', '#fde492'], deco: [], photo: ['⭐', '✨', '💖', '🌈'] },
  night:  { icon: '🌙', n: { th: 'กลางคืน', en: 'Starry Night' },    say: { th: 'กลางคืนแล้วค่ะ ดาวเต็มท้องฟ้าเลย', en: 'It is nighttime! The sky is full of stars!' }, bg: ['#232a6b', '#8a6fc4'],
            deco: [['🌙', 'right:8%;top:7%'], ['⭐', 'left:8%;top:10%'], ['✨', 'left:34%;top:3%'], ['✨', 'right:28%;top:20%'], ['⭐', 'left:5%;bottom:14%']] },
  beach:  { icon: '🌴', n: { th: 'ชายหาด', en: 'Sunny Beach' },    say: { th: 'ไปเที่ยวทะเลกันค่ะ คลื่นซัดฟู่ ๆ', en: 'Let us go to the beach! Splish splash waves!' }, bg: ['#8fd8ff', '#ffd27a'],
            deco: [['☀️', 'right:7%;top:6%'], ['🌴', 'left:4%;top:20%'], ['🐚', 'right:8%;bottom:8%'], ['🌊', 'left:8%;bottom:6%']] },
  garden: { icon: '🌷', n: { th: 'สวนดอกไม้', en: 'Flower Garden' },  say: { th: 'สวนดอกไม้สวยจังเลยค่ะ มีผีเสื้อด้วย', en: 'The flower garden is so beautiful with butterflies!' }, bg: ['#d4f6ff', '#8fe39a'],
            deco: [['🌸', 'right:9%;top:12%'], ['🌷', 'left:6%;bottom:8%'], ['🌳', 'right:3%;bottom:10%'], ['🌼', 'left:24%;bottom:4%']] },
  snow:   { icon: '⛄', n: { th: 'หิมะตก', en: 'Snowy Day' },     say: { th: 'หิมะตกแล้วค่ะ หนาวจัง บรื๋ออ', en: 'It is snowing! Brrr, so cool and snowy!' }, bg: ['#cfe9ff', '#ffffff'], snow: true,
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
  speakText(getItemTalk(SCENES[next]));
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
      speakText(currentLang === 'en'
        ? 'Great job! You popped all ten balloons! You get one bonus star!'
        : 'เก่งมากเลยค่ะ แตกครบสิบลูกแล้ว ได้ดาวเพิ่มอีกหนึ่งดวง!');
    } else if (popped > 0) {
      speakText(currentLang === 'en'
        ? 'The balloons flew away! Would you like to play again?'
        : 'ลูกโป่งลอยไปหมดแล้วค่ะ เล่นอีกรอบไหมคะ');
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
      const m = getComputedStyle(el).transform;
      const base = m && m !== 'none' ? m + ' ' : '';
      el.style.animation = 'none';
      el.style.transform = base;
      void el.offsetWidth;
      el.classList.add('pop');
      el.style.transform = base + 'scale(1.7)';
      setTimeout(() => el.remove(), 450);
      popped++;
      SoundFX.pop();
      launchConfetti(14, r.left + r.width / 2, r.top + r.height / 2);
      const numName = currentLang === 'en' ? EN_NUM[n - 1] : TH_NUM[n - 1];
      speakText(`${n} ${numName}`, 1.5, 0.95);
      finishOne();
    });
    el.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); });
    layer.appendChild(el);
  });
  speakText(currentLang === 'en' ? 'Tap balloons to pop them and count numbers together!' : 'แตะลูกโป่งให้แตก แล้วนับเลขไปด้วยกันนะคะ');
}

/* ---- Piano ---- */
const PIANO_KEYS = [
  ['โด', 261.63, '#ff5c8a'], ['เร', 293.66, '#ff9e2c'], ['มี', 329.63, '#f2b705'], ['ฟา', 349.23, '#3ec992'],
  ['ซอล', 392, '#22a6c4'], ['ลา', 440, '#5a8fff'], ['ที', 493.88, '#a855f7'], ['โด', 523.25, '#ff65a5']
];
let pianoTimer = null;
function buildPiano() {
  const box = $('piano'); if (!box) return; box.innerHTML = '';
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
  speakText(currentLang === 'en' ? 'Let us play piano! Do Re Mi Fa So La Ti Do!' : 'มาเล่นเปียโนกันค่ะ แตะที่คีย์ได้เลย โด เร มี ฟา ซอล ลา ที โด');
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
  $('cakeTitle').textContent = currentLang === 'en' ? "🎶 Nida's Birthday 🎶" : '🎶 วันเกิดน้องนิดา 🎶';
  $('cakeHint').textContent = currentLang === 'en' ? 'Tap the cake to blow out candles 💨' : 'แตะที่เค้กเพื่อเป่าเทียน 💨';
  $('cakeOverlay').classList.add('show');
  $('stage').className = 'stage mood-dance';
  $('bubble').textContent = currentLang === 'en' ? '🎶 Happy Birthday to You! 🎶' : '🎶 แฮปปี้เบิร์ธเดย์ทูยู 🎶';
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
  $('cakeTitle').textContent = currentLang === 'en' ? '🎉 Happy Birthday! 🎉' : '🎉 สุขสันต์วันเกิด! 🎉';
  $('cakeHint').textContent = currentLang === 'en' ? 'Hooray! Make a wish! ✨' : 'เย้! เทียนดับแล้ว ขอพรได้เลย ✨';
  stars++; try { localStorage.setItem('nida_stars', String(stars)); } catch(e){}
  renderStars();
  speakText(currentLang === 'en' ? 'Happy Birthday! Wishing you lots of joy and smiles!' : 'สุขสันต์วันเกิดนะคะ ขอให้มีความสุขมาก ๆ เลยค่ะ');
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
    x.fillText(currentLang === 'en' ? `Nida's Shop  ⭐ ${stars}` : `ร้านน้องนิดา  ⭐ ${stars}`, W / 2, H - 76);
    return c.toDataURL('image/png');
  });
}

function takePhoto() {
  getAudioContext(); SoundFX.shutter();
  const f = $('flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
  $('stage').className = 'stage mood-happy';
  speakText(currentLang === 'en' ? 'Say cheese! Taking a cute photo!' : 'ชีส! ถ่ายรูปแล้วค่ะ');
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
  const names = cart.length ? cart.slice(0, 10).map(p => getItemName(p)) : null;
  const n = names ? names.length : 10;
  const badge = $('countBadge');
  let i = 0;
  (function step() {
    if (t !== countToken) return;
    if (i > 0 && currentText !== lastCountText) { badge.classList.remove('show'); return; }
    if (i >= n) {
      badge.classList.remove('show');
      SoundFX.fanfare(); launchConfetti(40);
      if (currentLang === 'en') {
        speakText(names ? `Total ${cart.length} items in your basket!` : 'Counted to ten! You are super clever!');
      } else {
        speakText(names ? `ตะกร้ามีทั้งหมด ${cart.length} ชิ้นค่ะ` : 'นับถึงสิบแล้ว เก่งมากเลยค่ะ');
      }
      return;
    }
    i++;
    badge.classList.remove('show'); void badge.offsetWidth;
    badge.textContent = i; badge.classList.add('show');
    SoundFX.note(PIANO_KEYS[(i - 1) % 8][1], 0.25, 0.22);
    const numName = currentLang === 'en' ? EN_NUM[i - 1] : TH_NUM[i - 1];
    lastCountText = names ? `${numName} ${names[i - 1]}` : numName;
    speakText(lastCountText, 1.5, 0.9);
    $('stage').className = 'stage act-1';
    setTimeout(step, 1150);
  })();
}

/* ---- Receipt Rip & Close ---- */
const ripBtn = $('receiptCloseBtn');
if (ripBtn) {
  ripBtn.addEventListener('click', () => {
    SoundFX.boing();
    const paper = $('receiptPaper');
    if (paper) {
      paper.style.transform = 'translateY(120px) rotate(8deg)';
      paper.style.opacity = '0';
      paper.style.transition = 'all 0.35s ease-in';
      setTimeout(() => {
        $('receiptOverlay').classList.remove('show');
        paper.style.transform = '';
        paper.style.opacity = '';
        paper.style.transition = '';
      }, 360);
    } else {
      $('receiptOverlay').classList.remove('show');
    }
  });
}
$('receiptOverlay').addEventListener('click', (e) => {
  if (e.target === $('receiptOverlay')) $('receiptOverlay').classList.remove('show');
});

/* ============================================================
   STICKER ALBUM SYSTEM
   ============================================================ */
const STICKER_LIST = [
  { id: 'star_gold', icon: '⭐', name: { th: 'ดาวทอง', en: 'Gold Star' } },
  { id: 'crown', icon: '👑', name: { th: 'มงกุฎ', en: 'Crown' } },
  { id: 'rainbow', icon: '🌈', name: { th: 'สายรุ้ง', en: 'Rainbow' } },
  { id: 'heart', icon: '💖', name: { th: 'หัวใจหวาน', en: 'Sweet Heart' } },
  { id: 'trophy', icon: '🏆', name: { th: 'ถ้วยรางวัล', en: 'Trophy' } },
  { id: 'unicorn', icon: '🦄', name: { th: 'ยูนิคอร์น', en: 'Unicorn' } },
  { id: 'candy', icon: '🍭', name: { th: 'อมยิ้ม', en: 'Lollipop' } },
  { id: 'cake', icon: '🎂', name: { th: 'เค้กวันเกิด', en: 'Birthday Cake' } },
  { id: 'flower', icon: '🌸', name: { th: 'ดอกไม้หอม', en: 'Sweet Flower' } },
  { id: 'balloon', icon: '🎈', name: { th: 'ลูกโป่งแดง', en: 'Red Balloon' } },
  { id: 'sparkles', icon: '✨', name: { th: 'ประกายดาว', en: 'Sparkles' } },
  { id: 'gem', icon: '💎', name: { th: 'เพชรวิบวับ', en: 'Shiny Gem' } }
];

let myStickers = {};
try { myStickers = JSON.parse(localStorage.getItem('nida_stickers') || '{}') || {}; } catch(e){}

function renderStickerAlbum() {
  const album = $('stickerAlbum');
  if (!album) return;
  album.innerHTML = '';
  STICKER_LIST.forEach((s) => {
    const slot = document.createElement('div');
    const unlocked = !!myStickers[s.id];
    const sName = getItemName(s);
    slot.className = 'sticker-slot ' + (unlocked ? 'unlocked' : 'locked');
    slot.innerHTML = `<span>${s.icon}</span><span class="sticker-slot-name">${unlocked ? sName : '???'}</span>`;
    slot.addEventListener('click', () => {
      getAudioContext();
      if (unlocked) {
        SoundFX.boing();
        launchConfetti(20);
        speakText(currentLang === 'en' ? `${sName} sticker! So cute!` : `สติกเกอร์${sName} น่ารักจังเลยค่ะ`);
      } else {
        SoundFX.boing();
        speakText(currentLang === 'en' 
          ? `This sticker is locked! Sell items or spin gachapon to unlock it!` 
          : `สติกเกอร์นี้ยังล็อคอยู่ค่ะ ช่วยขายของหรือหมุนไข่เพื่อปลดล็อคนะคะ`);
      }
    });
    album.appendChild(slot);
  });
}

function unlockRandomSticker() {
  const locked = STICKER_LIST.filter(s => !myStickers[s.id]);
  if (locked.length === 0) return null;
  const picked = locked[Math.floor(Math.random() * locked.length)];
  myStickers[picked.id] = true;
  try { localStorage.setItem('nida_stickers', JSON.stringify(myStickers)); } catch(e){}
  return picked;
}

function openStickerBook() {
  getAudioContext();
  SoundFX.boing();
  renderStickerAlbum();
  $('stickerOverlay').classList.add('show');
  speakText(currentLang === 'en' ? "This is Nida's superstar sticker album! Let's collect them all!" : "นี่คือสมุดสติกเกอร์คนเก่งของน้องนิดาค่ะ สะสมให้ครบนะคะ!");
}

$('stickerClose').addEventListener('click', () => $('stickerOverlay').classList.remove('show'));
$('stickerOverlay').addEventListener('click', (e) => { if (e.target === $('stickerOverlay')) $('stickerOverlay').classList.remove('show'); });
$('stickerClearBtn').addEventListener('click', () => {
  myStickers = {};
  try { localStorage.removeItem('nida_stickers'); } catch(e){}
  renderStickerAlbum();
  SoundFX.boing();
  speakText(currentLang === 'en' ? "Sticker album reset! Let's collect them again!" : "เริ่มเก็บสติกเกอร์ใหม่แล้วค่ะ สู้ ๆ นะคะ!");
});

/* ============================================================
   GACHAPON SYSTEM
   ============================================================ */
let gachaSpinning = false;
const GACHA_PRIZES = [
  { text: { th: "สติกเกอร์ถ้วยรางวัลคนเก่ง 🏆", en: "Superstar Trophy Sticker 🏆" }, type: 'sticker', id: 'trophy' },
  { text: { th: "สติกเกอร์ยูนิคอร์นสายรุ้ง 🦄", en: "Rainbow Unicorn Sticker 🦄" }, type: 'sticker', id: 'unicorn' },
  { text: { th: "สติกเกอร์เพชรวิบวับ 💎", en: "Sparkling Gem Sticker 💎" }, type: 'sticker', id: 'gem' },
  { text: { th: "มงกุฎเจ้าหญิงสุดสวย 👑", en: "Princess Crown 👑" }, type: 'acc', key: 'Crown' },
  { text: { th: "ปีกนางฟ้าบินได้ 🧚", en: "Fairy Wings 🧚" }, type: 'acc', key: 'Wings' },
  { text: { th: "ไม้กายสิทธิ์เสกเวทมนตร์ ✨", en: "Magic Wand ✨" }, type: 'acc', key: 'Wand' }
];

function openGachapon() {
  getAudioContext();
  SoundFX.boing();
  $('gachaPrizeZone').style.display = 'none';
  $('gachaMachine').style.display = 'flex';
  $('gachaHint').textContent = currentLang === 'en' ? 'Tap the button to spin for a surprise! ✨' : 'แตะที่ปุ่มเพื่อหมุนไข่ลุ้นของขวัญ ✨';
  $('gachaOverlay').classList.add('show');
  speakText(currentLang === 'en' ? "Welcome to Nida's Gachapon! Turn the knob to win a prize!" : "ตู้หมุนไข่ของน้องนิดาค่ะ มาหมุนลุ้นของเล่นกันเลย!");
}

function turnGachapon() {
  if (gachaSpinning) return;
  gachaSpinning = true;
  getAudioContext();
  SoundFX.boing();
  setTimeout(SoundFX.purr, 150);

  const machine = $('gachaMachine');
  machine.classList.add('spinning');
  $('gachaHint').textContent = currentLang === 'en' ? 'Gachapon is spinning... 🌀' : 'ตู้ไข่กำลังหมุน กริ๊ก กริ๊ก กริ๊ก... 🌀';

  setTimeout(() => {
    machine.classList.remove('spinning');
    machine.style.display = 'none';
    const prizeZone = $('gachaPrizeZone');
    prizeZone.style.display = 'block';

    const p = GACHA_PRIZES[Math.floor(Math.random() * GACHA_PRIZES.length)];
    const pText = typeof p.text === 'object' ? (p.text[currentLang] || p.text.th) : p.text;
    $('gachaPrizeText').textContent = pText;
    if (p.type === 'sticker') {
      myStickers[p.id] = true;
      try { localStorage.setItem('nida_stickers', JSON.stringify(myStickers)); } catch(e){}
    } else if (p.type === 'acc') {
      outfit[p.key] = true;
      applyOutfit();
    }
    stars++;
    try { localStorage.setItem('nida_stars', String(stars)); } catch(e){}
    renderStars();

    SoundFX.fanfare();
    launchConfetti(65);
    speakText(currentLang === 'en' ? `Hooray! You won ${pText}! Fantastic!` : `เย้! ได้ ${pText} ค่ะ เก่งที่สุดเลย!`);
    $('gachaHint').textContent = currentLang === 'en' ? 'Tap the button to spin again! ✨' : 'แตะที่ปุ่มเพื่อหมุนใหม่อีกรอบได้เลยนะคะ ✨';
    gachaSpinning = false;
  }, 1100);
}

$('gachaTurnBtn').addEventListener('click', turnGachapon);
$('gachaEggAnim').addEventListener('click', () => {
  SoundFX.boing();
  launchConfetti(25);
});
$('gachaClose').addEventListener('click', () => $('gachaOverlay').classList.remove('show'));
$('gachaOverlay').addEventListener('click', (e) => { if (e.target === $('gachaOverlay')) $('gachaOverlay').classList.remove('show'); });

/* ============================================================
   11. BILINGUAL LANGUAGE SYSTEM (🇹🇭 TH <-> 🇬🇧 EN)
   ============================================================ */
function applyLanguage(lang, announce = false) {
  currentLang = (lang === 'en') ? 'en' : 'th';
  document.documentElement.lang = currentLang;

  // Language pill button
  const lBtn = $('langToggleBtn');
  if (lBtn) {
    if (currentLang === 'en') {
      lBtn.innerHTML = '🇬🇧<span class="lbl"> EN</span>';
      lBtn.title = 'Switch to Thai / สลับเป็นภาษาไทย';
    } else {
      lBtn.innerHTML = '🇹🇭<span class="lbl"> TH</span>';
      lBtn.title = 'สลับภาษา / Switch to English';
    }
  }

  // App Title
  const appTitle = $('appTitle');
  if (appTitle) appTitle.textContent = currentLang === 'en' ? "ร้านน้องนิดา Nida's Shop" : "ร้านน้องนิดา";

  // Character Switch button
  setCharacterMode(currentCharMode);

  // Sound toggle button label
  const sBtn = $('soundToggle');
  if (sBtn) {
    sBtn.innerHTML = soundEnabled 
      ? (currentLang === 'en' ? '🔊<span class="lbl"> Sound On</span>' : '🔊<span class="lbl"> เสียงเปิด</span>')
      : (currentLang === 'en' ? '🔇<span class="lbl"> Muted</span>' : '🔇<span class="lbl"> ปิดเสียง</span>');
  }

  // Offline pill label
  updateOnlineStatus();

  // Install banner
  const iTxt = $('installBannerText');
  const iBtn = $('installBtn');
  if (iTxt) iTxt.textContent = currentLang === 'en' ? '⭐ Install to home screen for full-screen play' : '⭐ ติดตั้งลงหน้าจอโฮมเพื่อเล่นแบบเต็มจอ';
  if (iBtn) iBtn.textContent = currentLang === 'en' ? 'Install' : 'ติดตั้ง';

  // Menu label & Activity Tabs
  const menuLbl = $('menuLabel');
  if (menuLbl) menuLbl.innerHTML = currentLang === 'en' ? '📋 Menu <small>Tap to switch</small>' : '📋 เมนู <small>แตะเพื่อเปลี่ยนหน้า</small>';

  const tabLabels = {
    tabBtnShop: currentLang === 'en' ? 'Shop' : 'ซื้อของ',
    tabBtnFeed: currentLang === 'en' ? 'Feed' : 'ป้อนขนม',
    tabBtnRoleplay: currentLang === 'en' ? 'Talk' : 'ชวนคุย',
    tabBtnMoods: currentLang === 'en' ? 'Moods' : 'อารมณ์',
    tabBtnDress: currentLang === 'en' ? 'Dress up' : 'แต่งตัว',
    tabBtnFun: currentLang === 'en' ? 'Fun' : 'สนุก'
  };
  Object.entries(tabLabels).forEach(([id, text]) => {
    const el = document.querySelector(`#${id} .tab-lbl`);
    if (el) el.textContent = text;
  });

  // Shop Categories
  if ($('catBtnAll')) $('catBtnAll').textContent = currentLang === 'en' ? '🌟 All' : '🌟 ทั้งหมด';
  if ($('catBtnFresh')) $('catBtnFresh').textContent = currentLang === 'en' ? '🥦 Fresh' : '🥦 ผักผลไม้';
  if ($('catBtnBakery')) $('catBtnBakery').textContent = currentLang === 'en' ? '🧁 Bakery' : '🧁 เบเกอรี่';
  if ($('catBtnSweet')) $('catBtnSweet').textContent = currentLang === 'en' ? '🍭 Sweets' : '🍭 ขนมหวาน';

  // Quest badge & reroll
  if ($('questBadge')) $('questBadge').textContent = currentLang === 'en' ? '🎯 Bunny Quest' : '🎯 ภารกิจน้องกระต่าย';
  if ($('questRerollBtn')) $('questRerollBtn').textContent = currentLang === 'en' ? '🎲 New' : '🎲 สุ่มใหม่';

  // Cart action buttons
  if ($('openScaleBtn')) $('openScaleBtn').textContent = currentLang === 'en' ? '⚖️ Scale' : '⚖️ ตาชั่ง';
  if ($('clearCartBtn')) $('clearCartBtn').textContent = currentLang === 'en' ? '🔄 Clear' : '🔄 ล้าง';
  if ($('checkoutBtn')) $('checkoutBtn').textContent = currentLang === 'en' ? '💰 Pay' : '💰 คิดเงิน';

  // Roleplay 1-4 buttons
  const rpLabels = currentLang === 'en'
    ? ['Welcome 👋', 'Can I Help? 💬', 'How Much?', 'Thank You 💖']
    : ['ต้อนรับ 👋', 'รับอะไรดี 💬', 'บอกราคา', 'ขอบคุณ 💖'];
  document.querySelectorAll('#panel-roleplay .rp-lbl').forEach((el, idx) => {
    if (rpLabels[idx]) el.textContent = rpLabels[idx];
  });

  // Mood buttons
  const moodLabels = currentLang === 'en'
    ? { happy: 'Happy', laugh: 'Laugh', surprise: 'Surprise', sleepy: 'Sleepy', dance: 'Dance', praise: 'Praise' }
    : { happy: 'ดีใจ', laugh: 'หัวเราะ', surprise: 'ตกใจ', sleepy: 'ง่วงนอน', dance: 'เต้นระบำ', praise: 'ชมคนเก่ง' };
  document.querySelectorAll('#panel-moods .mood-card').forEach(b => {
    const lbl = b.querySelector('.mood-lbl');
    if (lbl && moodLabels[b.dataset.mood]) lbl.textContent = moodLabels[b.dataset.mood];
  });

  // Dress buttons
  if ($('dressRandomBtn')) $('dressRandomBtn').textContent = currentLang === 'en' ? '🎲 Random Outfit' : '🎲 สุ่มชุดให้หน่อย';
  if ($('dressResetBtn')) $('dressResetBtn').textContent = currentLang === 'en' ? '✨ Remove All' : '✨ ถอดทั้งหมด';

  // Fun buttons
  const funLabels = currentLang === 'en'
    ? { balloons: 'Balloons', piano: 'Piano', birthday: 'Birthday', gachapon: 'Gachapon', stickers: 'Stickers', photo: 'Photo', scene: 'Scenes', count: 'Counting' }
    : { balloons: 'ลูกโป่ง', piano: 'เปียโน', birthday: 'วันเกิด', gachapon: 'หมุนไข่', stickers: 'สมุดสติกเกอร์', photo: 'ถ่ายรูป', scene: 'เปลี่ยนฉาก', count: 'นับเลข' };
  document.querySelectorAll('#panel-fun .mood-card').forEach(b => {
    const lbl = b.querySelector('.fun-lbl');
    if (lbl && funLabels[b.dataset.fun]) lbl.textContent = funLabels[b.dataset.fun];
  });
  if ($('pianoClose')) $('pianoClose').textContent = currentLang === 'en' ? '⬅️ Back' : '⬅️ กลับ';

  // Modals texts
  if ($('drawerSub')) $('drawerSub').textContent = currentLang === 'en' ? 'Tap banknotes or coins to pay' : 'แตะเลือกธนบัตรหรือเหรียญที่ต้องการจ่ายนะคะ';
  if ($('drawerSecBills')) $('drawerSecBills').textContent = currentLang === 'en' ? '💵 Banknotes' : '💵 ธนบัตร';
  if ($('drawerSecCoins')) $('drawerSecCoins').textContent = currentLang === 'en' ? '🪙 Coins' : '🪙 เหรียญ';

  if ($('basketTitle')) $('basketTitle').textContent = currentLang === 'en' ? "🛒 Nida's Basket 🛒" : '🛒 ตะกร้าของน้องนิดา 🛒';
  if ($('basketClearBtn')) $('basketClearBtn').textContent = currentLang === 'en' ? '🔄 Clear Cart' : '🔄 ล้างตะกร้า';
  if ($('basketPayBtn')) $('basketPayBtn').textContent = currentLang === 'en' ? '💰 Checkout' : '💰 ไปคิดเงินเลย';

  if ($('scaleTitle')) $('scaleTitle').textContent = currentLang === 'en' ? '⚖️ Digital Fruit Scale ⚖️' : '⚖️ เครื่องชั่งน้ำหนักผลไม้ดิจิทัล ⚖️';
  if ($('scaleSecTitle')) $('scaleSecTitle').textContent = currentLang === 'en' ? 'Choose fruit to weigh:' : 'แตะเลือกผลไม้ที่ต้องการชั่ง:';
  if ($('scaleAddBtn')) $('scaleAddBtn').textContent = currentLang === 'en' ? '🏷️ Print Price Tag & Add to Cart!' : '🏷️ พิมพ์ป้ายราคา & ใส่ตะกร้า!';

  if ($('cakeTitle')) $('cakeTitle').textContent = currentLang === 'en' ? "🎶 Nida's Birthday 🎶" : '🎶 วันเกิดน้องนิดา 🎶';
  if ($('cakeHint')) $('cakeHint').textContent = currentLang === 'en' ? 'Tap the cake to blow out candles 💨' : 'แตะที่เค้กเพื่อเป่าเทียน 💨';

  if ($('photoHint')) $('photoHint').textContent = currentLang === 'en' ? 'Mobile: Long press photo to save' : 'มือถือ: กดค้างที่รูปเพื่อบันทึกได้เลย';
  if ($('photoSave')) $('photoSave').textContent = currentLang === 'en' ? '💾 Save Photo' : '💾 บันทึกรูป';
  if ($('photoClose')) $('photoClose').textContent = currentLang === 'en' ? '✕ Close' : '✕ ปิด';

  if ($('receiptShopName')) $('receiptShopName').textContent = currentLang === 'en' ? "🐰 Nida's Shop 🐰" : '🐰 ร้านน้องนิดา 🐰';
  if ($('receiptTagline')) $('receiptTagline').textContent = currentLang === 'en' ? '✨ Super Cute Receipt ✨' : '✨ ใบเสร็จรับเงินสุดน่ารัก ✨';
  if ($('receiptThanks')) $('receiptThanks').textContent = currentLang === 'en' ? '* Thank you, lovely customer! *' : '* ขอบคุณลูกค้าน่ารักนะคะ *';
  if ($('receiptCloseBtn')) $('receiptCloseBtn').textContent = currentLang === 'en' ? '✂️ Tear Receipt / Close' : '✂️ ฉีกใบเสร็จ / ปิด';

  if ($('gachaTitle')) $('gachaTitle').textContent = currentLang === 'en' ? '🎁 Surprise Gachapon 🎁' : '🎁 ตู้หมุนไข่เซอร์ไพรส์ 🎁';
  if ($('gachaTurnLbl')) $('gachaTurnLbl').textContent = currentLang === 'en' ? 'Turn Knob!' : 'หมุนตู้ไข่!';
  if ($('gachaHint')) $('gachaHint').textContent = currentLang === 'en' ? 'Tap the button to spin for a surprise! ✨' : 'แตะที่ปุ่มเพื่อหมุนไข่ลุ้นของขวัญ ✨';

  if ($('stickerTitle')) $('stickerTitle').textContent = currentLang === 'en' ? '🌟 Superstar Sticker Album 🌟' : '🌟 สมุดสติกเกอร์คนเก่ง 🌟';
  if ($('stickerSubtitle')) $('stickerSubtitle').textContent = currentLang === 'en' ? "Nida's Album (Tap stickers to inspect)" : 'ของน้องนิดา (แตะสติกเกอร์เพื่อสะสมลงสมุด)';
  if ($('stickerClearBtn')) $('stickerClearBtn').textContent = currentLang === 'en' ? '🔄 Reset Album' : '🔄 เริ่มเก็บใหม่';

  // Re-render UI components
  renderProducts();
  renderFeedShelf();
  updateCartDisplay();
  renderQuest();
  buildDressUI();

  try { localStorage.setItem('nida_lang', currentLang); } catch(e){}

  if (announce) {
    const welcome = currentLang === 'en' 
      ? "Welcome to Nida's Shop! Let's play and learn English together!" 
      : "สลับเป็นภาษาไทยแล้วค่ะ มาเล่นด้วยกันนะ!";
    speakText(welcome);
  }
}

$('langToggleBtn').addEventListener('click', () => {
  getAudioContext();
  SoundFX.boing();
  const nextLang = currentLang === 'th' ? 'en' : 'th';
  applyLanguage(nextLang, true);
});

/* ---- wire up ---- */
buildPiano();
setScene(currentScene);
const FUN_ACTIONS = {
  balloons: startBalloons,
  piano: openPiano,
  birthday: openBirthday,
  gachapon: openGachapon,
  stickers: openStickerBook,
  photo: takePhoto,
  scene: nextScene,
  count: startCounting
};
document.querySelectorAll('[data-fun]').forEach(b => {
  b.addEventListener('click', () => { getAudioContext(); const f = FUN_ACTIONS[b.dataset.fun]; if (f) f(); });
});

buildDressUI();
applyOutfit();
applyDressColor();
renderStars();
newQuest();
applyLanguage(currentLang, false);
