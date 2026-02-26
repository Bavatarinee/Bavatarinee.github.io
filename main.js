/* ─────────────────────────────────────────
   main.js — Bavatarinee Portfolio
   Interactive features & animations
   ───────────────────────────────────────── */

'use strict';

// ─── CUSTOM CURSOR ───────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
});

(function animateCursor() {
    fx += (mx - fx) * 0.1;
    fy += (my - fy) * 0.1;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animateCursor);
})();

// ─── NAV SCROLL ──────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ─── HAMBURGER ───────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
    });
});

// ─── HERO CANVAS — PARTICLE FIELD ────────────────
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [], animFrameId;

function resizeCanvas() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); }, { passive: true });

class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
        this.x = Math.random() * W;
        this.y = initial ? Math.random() * H : H + 10;
        this.r = Math.random() * 1.2 + 0.2;
        this.vy = -(Math.random() * 0.4 + 0.12);
        this.vx = (Math.random() - 0.5) * 0.2;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.life = Math.random() * 200 + 100;
        this.age = 0;
        this.hue = Math.random() > 0.7 ? 90 : 135; // olive or sage
        this.sat = Math.random() * 20 + 35;
        this.l = Math.random() * 20 + 45;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.age += 1;
        if (this.age > this.life || this.y < -10) this.reset();
    }
    draw() {
        const t = this.age / this.life;
        const a = this.alpha * (t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1);
        ctx.save();
        ctx.globalAlpha = a;
        ctx.fillStyle = `hsl(${this.hue}, ${this.sat}%, ${this.l}%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Grid lines
function drawGrid() {
    ctx.save();
    ctx.strokeStyle = 'rgba(125, 155, 118, 0.04)';
    ctx.lineWidth = 1;
    const step = 80;
    for (let x = 0; x < W; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    ctx.restore();
}

// Horizontal scan line
let scanY = 0;
function drawScanLine() {
    const grad = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
    grad.addColorStop(0, 'rgba(125, 155, 118, 0)');
    grad.addColorStop(0.5, 'rgba(125, 155, 118, 0.025)');
    grad.addColorStop(1, 'rgba(125, 155, 118, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, scanY - 60, W, 120);
    scanY += 0.5;
    if (scanY > H + 60) scanY = -60;
}

function initParticles() {
    particles = Array.from({ length: 80 }, () => new Particle());
}
initParticles();

function animateCanvas() {
    ctx.clearRect(0, 0, W, H);
    // Dark gradient bg
    const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H));
    bg.addColorStop(0, 'rgba(20, 30, 22, 0.95)');
    bg.addColorStop(0.6, 'rgba(14, 20, 16, 0.98)');
    bg.addColorStop(1, 'rgba(10, 14, 11, 1)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    drawGrid();
    drawScanLine();

    particles.forEach(p => { p.update(); p.draw(); });
    animFrameId = requestAnimationFrame(animateCanvas);
}
animateCanvas();

// ─── ADD REVEAL CLASS TO ELEMENTS (must happen BEFORE observer is created) ───
function addReveal(selector, delay = 0) {
    document.querySelectorAll(selector).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${delay + i * 60}ms`;
    });
}
addReveal('.about-text > *');
addReveal('.about-visual');
addReveal('.skill-category', 0);
addReveal('.project-card', 0);
addReveal('.contact-text > *');
addReveal('.contact-link-card', 0);

// ─── SCROLL REVEAL ───────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(
    (entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 80);
                revealObs.unobserve(e.target);
            }
        });
    },
    { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
);
reveals.forEach(el => revealObs.observe(el));

// ─── SAFETY FALLBACK: make everything visible after 3s ───────────────────────
setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        el.classList.add('visible');
    });
}, 3000);

// ─── PROJECT CARD HOVER GLOW ─────────────────────
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
        const glow = card.querySelector('.project-card-glow');
        if (glow) {
            glow.style.background = `radial-gradient(ellipse at ${x}% ${y}%, rgba(125,155,118,0.1), transparent 65%)`;
        }
    });
});

// ─── COUNTER ANIMATION ───────────────────────────
function animateCounter(el, target, duration = 1200) {
    const isInfinity = target === '∞';
    if (isInfinity) return;
    const isFrac = target.includes('+') || target.includes('.');
    const num = parseFloat(target);
    const suffix = target.replace(/[\d.]/g, '');
    let start = null;
    function step(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(num * ease) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    }
    requestAnimationFrame(step);
}

const metaObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            document.querySelectorAll('.meta-num').forEach(el => {
                animateCounter(el, el.textContent.trim());
            });
            metaObs.disconnect();
        }
    });
}, { threshold: 0.5 });

const heroMeta = document.querySelector('.hero-meta');
if (heroMeta) metaObs.observe(heroMeta);

// ─── SMOOTH SCROLL WITH OFFSET ───────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ─── ACTIVE NAV LINK ON SCROLL ───────────────────
const sections = document.querySelectorAll('section[id]');
const navLinksEl = document.querySelectorAll('.nav-link');
const linkMap = {};
navLinksEl.forEach(l => { linkMap[l.getAttribute('href').slice(1)] = l; });

const activeSectionObs = new IntersectionObserver(
    (entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                navLinksEl.forEach(l => l.classList.remove('active'));
                const link = linkMap[e.target.id];
                if (link) link.classList.add('active');
            }
        });
    },
    { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach(s => activeSectionObs.observe(s));

// ─── NAV ACTIVE LINK STYLE ───────────────────────
const style = document.createElement('style');
style.textContent = `.nav-link.active { color: var(--white) !important; }`;
document.head.appendChild(style);

// ─── PROJECT TILT EFFECT ─────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        const y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        card.style.transform = `translateY(-6px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
        card.style.transition = 'transform 0.1s, box-shadow 0.1s';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s';
    });
});

// ─── GITHUB API AUTO-SYNC ────────────────────────
(async function loadGitHubProjects() {
    const GITHUB_USER = 'Bavatarinee';
    const grid = document.getElementById('projects-grid');
    const syncStatus = document.getElementById('sync-status');
    const metaNum = document.querySelector('.hero-meta .meta-item:first-child .meta-num');

    // Helper: derive a category label from repo language/topics/name
    function deriveCategory(repo) {
        const name = (repo.name || '').toLowerCase();
        const lang = (repo.language || '').toLowerCase();

        if (name.includes('voice') || name.includes('spoof') || name.includes('audio')) return 'Audio Security · ML';
        if (name.includes('eye') || name.includes('disease')) return 'Healthcare · Deep Learning';
        if (name.includes('medicine') || name.includes('overdose') || name.includes('health')) return 'Healthcare · ML';
        if (name.includes('agriculture') || name.includes('crop') || name.includes('farm')) return 'Agriculture · Deep Learning';
        if (name.includes('forest') || name.includes('fire')) return 'Environment · ML';
        if (name.includes('paint') || name.includes('tamil') || name.includes('heritage')) return 'Cultural Heritage · CV';
        if (name.includes('chatbot') || name.includes('qa') || name.includes('nlp') || name.includes('question')) return 'NLP · Chatbot';
        if (name.includes('ecommerce') || name.includes('shop') || name.includes('store')) return 'Web · JavaScript';
        if (name.includes('portfolio')) return 'Web · Personal';
        if (lang === 'python') return 'Python · ML';
        if (lang === 'javascript') return 'Web · JavaScript';
        if (lang === 'r') return 'Data Analysis · R';
        if (lang === 'jupyter notebook') return 'Data Science · Notebook';
        return lang ? `${repo.language} · Project` : 'Project';
    }

    // Helper: build a card HTML for a repo
    function buildCard(repo, index) {
        const num = String(index + 1).padStart(2, '0');
        const category = deriveCategory(repo);
        const stars = repo.stargazers_count > 0 ? `⭐ ${repo.stargazers_count}` : '⭐ New';
        const desc = repo.description
            ? repo.description.slice(0, 160) + (repo.description.length > 160 ? '…' : '')
            : 'Explore this project on GitHub.';
        const langTag = repo.language ? `<span>${repo.language}</span>` : '';
        const featured = index % 3 === 0 ? ' project-card--featured' : '';

        return `
        <article class="project-card${featured} reveal" id="proj-gh-${repo.id}" style="transition-delay:${index * 60}ms">
            <div class="project-card-inner">
                <div class="project-number">${num}</div>
                <div class="project-category">${category}</div>
                <h3 class="project-title">${repo.name.replace(/-/g, ' ').replace(/_/g, ' ')}</h3>
                <p class="project-desc">${desc}</p>
                <div class="project-stack">${langTag}</div>
                <div class="project-footer">
                    <div class="project-stars">${stars}</div>
                    <a href="${repo.html_url}" target="_blank" rel="noopener"
                       class="project-link" aria-label="View ${repo.name} on GitHub">
                        View Project ↗
                    </a>
                </div>
            </div>
            <div class="project-card-glow"></div>
        </article>`;
    }

    try {
        // Fetch all repos (up to 100, sorted by last updated)
        const res = await fetch(
            `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated&type=public`,
            { headers: { 'Accept': 'application/vnd.github.v3+json' } }
        );

        if (!res.ok) throw new Error(`GitHub API ${res.status}`);

        const repos = await res.json();

        // Filter out forked repos and very small/meta repos
        const filtered = repos.filter(r =>
            !r.fork &&
            r.name.toLowerCase() !== GITHUB_USER.toLowerCase() &&
            !r.name.toLowerCase().includes('config') &&
            !r.name.toLowerCase().includes('.github')
        );

        if (filtered.length === 0) throw new Error('No repos found');

        // Render cards
        grid.innerHTML = filtered.map(buildCard).join('');

        // Update hero counter
        if (metaNum) metaNum.textContent = filtered.length;

        // Update sync badge
        if (syncStatus) {
            const now = new Date();
            syncStatus.textContent = `Live — synced from GitHub · ${filtered.length} repos · updated ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }

        // Apply reveal animation to new cards
        const newCards = grid.querySelectorAll('.project-card');
        newCards.forEach(card => {
            revealObs.observe(card);
            // Re-attach tilt effect
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
                const y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
                card.style.transform = `translateY(-6px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
                card.style.transition = 'transform 0.1s, box-shadow 0.1s';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s';
            });
            // Glow effect
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const px = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
                const py = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
                const glow = card.querySelector('.project-card-glow');
                if (glow) glow.style.background = `radial-gradient(ellipse at ${px}% ${py}%, rgba(125,155,118,0.1), transparent 65%)`;
            });
        });

    } catch (err) {
        console.warn('GitHub API fetch failed:', err.message);
        // On error — show graceful fallback
        grid.innerHTML = `
        <div class="github-error-card">
            <p>📡 Could not load live GitHub data right now.</p>
            <p style="margin-top:0.75rem">
                <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener">
                    View all projects on GitHub ↗
                </a>
            </p>
        </div>`;
        if (syncStatus) syncStatus.textContent = 'Could not sync — see GitHub';
    }
})();

