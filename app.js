/* ================================================================
   app.js – Tribute · Vse Olanrewaju Macaulay
   Candles, Condolences, Social Sharing
   ================================================================ */

'use strict';

let db = null;
let condRef = null;
let metaRef = null;

try {
  if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
    db = firebase.firestore();
    condRef = db.collection('condolences');
    metaRef = db.doc('meta/site');
  }
} catch (e) {
  console.warn("Firebase running in offline/local mode:", e);
}

// ── UTILITY ─────────────────────────────────────────────────────
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtDate(ts) {
  if (!ts) return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const d = (ts.toDate) ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

// ── CANDLES ─────────────────────────────────────────────────────
const candlesRow = document.getElementById('candlesRow');
const candleTally = document.getElementById('candleTally');
const lightBtn = document.getElementById('lightCandleBtn');

let totalCandles = parseInt(localStorage.getItem('tribute_candles_count') || '5', 10);

function makeCandle() {
  const el = document.createElement('div');
  el.className = 'candle';
  const height = Math.round(40 + Math.random() * 36);
  const delay = (Math.random() * 1.2).toFixed(2);
  el.innerHTML = `
    <div class="flame" style="animation-delay:${delay}s"></div>
    <div class="wick"></div>
    <div class="candle-body" style="height:${height}px"></div>
  `;
  return el;
}

function renderCandles(n) {
  if (!candlesRow) return;
  candlesRow.innerHTML = '';
  const show = Math.min(n, 24);
  for (let i = 0; i < show; i++) candlesRow.appendChild(makeCandle());
  if (candleTally) {
    candleTally.textContent = n > 0
      ? `${n.toLocaleString()} candle${n !== 1 ? 's' : ''} lit in remembrance`
      : '';
  }
}

async function initCandles() {
  if (metaRef) {
    try {
      const snap = await metaRef.get();
      if (snap.exists && snap.data().candles) {
        totalCandles = snap.data().candles;
      }
    } catch (_) { /* local fallback */ }
  }
  renderCandles(totalCandles);
}

if (lightBtn) {
  lightBtn.addEventListener('click', async () => {
    totalCandles += 1;
    localStorage.setItem('tribute_candles_count', totalCandles);
    renderCandles(totalCandles);
    if (metaRef) {
      try {
        await metaRef.set({ candles: totalCandles }, { merge: true });
      } catch (_) { /* silent */ }
    }
  });
}

initCandles();

// ── CONDOLENCES ─────────────────────────────────────────────────
const condForm = document.getElementById('condolenceForm');
const nameInput = document.getElementById('condolenceName');
const msgInput = document.getElementById('condolenceMessage');
const submitBtn = document.getElementById('submitBtn');
const feedback = document.getElementById('formFeedback');
const feed = document.getElementById('condolencesFeed');

const localCondolences = JSON.parse(localStorage.getItem('tribute_local_condolences') || '[]');

function makeCard({ name, message, createdAt }) {
  const div = document.createElement('div');
  div.className = 'condolence-card';
  div.innerHTML = `
    <p class="c-name">${esc(name)}</p>
    <p class="c-date">${fmtDate(createdAt)}</p>
    <p class="c-msg">${esc(message)}</p>
  `;
  return div;
}

function renderLocalCondolences() {
  if (!feed) return;
  feed.innerHTML = '';
  if (localCondolences.length === 0) {
    feed.innerHTML = '<p class="state-text">Be the first to leave a condolence.</p>';
    return;
  }
  localCondolences.forEach(item => feed.appendChild(makeCard(item)));
}

if (condRef) {
  condRef
    .orderBy('createdAt', 'desc')
    .limit(60)
    .onSnapshot(
      (snap) => {
        if (!feed) return;
        feed.innerHTML = '';
        if (snap.empty) {
          renderLocalCondolences();
          return;
        }
        snap.forEach((doc) => feed.appendChild(makeCard(doc.data())));
      },
      () => {
        renderLocalCondolences();
      }
    );
} else {
  renderLocalCondolences();
}

if (condForm) {
  condForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const message = msgInput.value.trim();
    if (!name || !message) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    feedback.textContent = '';

    let success = false;
    if (condRef) {
      try {
        await condRef.add({
          name,
          message,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        success = true;
      } catch (err) {
        console.warn("Firestore save failed, fallback to local:", err);
      }
    }

    if (!success) {
      localCondolences.unshift({ name, message, createdAt: new Date() });
      localStorage.setItem('tribute_local_condolences', JSON.stringify(localCondolences));
      renderLocalCondolences();
    }

    nameInput.value = '';
    msgInput.value = '';
    feedback.textContent = 'Thank you for your condolence 🕊️';
    setTimeout(() => { if (feedback) feedback.textContent = ''; }, 3500);

    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Condolence';
  });
}

// ── SHARE ───────────────────────────────────────────────────────
const PAGE_URL = encodeURIComponent(window.location.href);
const PAGE_TITLE = encodeURIComponent('In Loving Memory of Vse Olanrewaju Macaulay (1959 – 2026)');

window.shareOn = function (platform) {
  const links = {
    whatsapp: `https://wa.me/?text=${PAGE_TITLE}%20${PAGE_URL}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${PAGE_URL}`,
    twitter: `https://twitter.com/intent/tweet?text=${PAGE_TITLE}&url=${PAGE_URL}`,
  };
  if (links[platform]) {
    window.open(links[platform], '_blank', 'noopener,noreferrer,width=600,height=520');
  }
};

window.copyLink = function () {
  const confirm = document.getElementById('copyConfirm');
  navigator.clipboard.writeText(window.location.href)
    .then(() => {
      if (confirm) {
        confirm.textContent = 'Link copied to clipboard ✓';
        setTimeout(() => { if (confirm) confirm.textContent = ''; }, 3000);
      }
    })
    .catch(() => {
      if (confirm) confirm.textContent = 'Could not copy — please copy URL from address bar.';
    });
};

// ── NAV MOBILE TOGGLE ───────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isShowing = navLinks.style.display === 'flex';
    if (isShowing) {
      navLinks.style.display = '';
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'rgba(15,13,10,0.96)';
      navLinks.style.padding = '1.5rem 2rem';
      navLinks.style.gap = '1.2rem';
    }
  });
}