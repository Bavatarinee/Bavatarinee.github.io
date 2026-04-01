/* ─────────────────────────────────────────
   main.js — Bavatarinee Portfolio
   Pastel Theme + Flip Cards + GitHub Sync
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

// ─── HERO CANVAS — PASTEL PARTICLE FIELD ─────────
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); }, { passive: true });

// Pastel particle colors: lavender, rose, mint, peach, sky
const PASTEL_HUES = [
    { h: 265, s: 55, l: 80 }, // lavender
    { h: 340, s: 70, l: 82 }, // rose
    { h: 174, s: 45, l: 72 }, // mint
    { h: 35,  s: 80, l: 80 }, // peach
    { h: 210, s: 70, l: 80 }, // sky blue
];

class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
        this.x = Math.random() * W;
        this.y = initial ? Math.random() * H : H + 10;
        this.r = Math.random() * 2 + 0.5;
        this.vy = -(Math.random() * 0.35 + 0.1);
        this.vx = (Math.random() - 0.5) * 0.25;
        this.alpha = Math.random() * 0.55 + 0.15;
        this.life = Math.random() * 220 + 120;
        this.age = 0;
        const c = PASTEL_HUES[Math.floor(Math.random() * PASTEL_HUES.length)];
        this.hue = c.h + (Math.random() * 20 - 10);
        this.sat = c.s;
        this.l = c.l + (Math.random() * 10 - 5);
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.age++;
        if (this.age > this.life || this.y < -10) this.reset();
    }
    draw() {
        const t = this.age / this.life;
        const a = this.alpha * (t < 0.12 ? t / 0.12 : t > 0.75 ? (1 - t) / 0.25 : 1);
        ctx.save();
        ctx.globalAlpha = a;
        ctx.fillStyle = `hsl(${this.hue}, ${this.sat}%, ${this.l}%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function initParticles() {
    particles = Array.from({ length: 90 }, () => new Particle());
}
initParticles();

let mouseX = W / 2, mouseY = H / 2;
document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}, { passive: true });

function animateCanvas() {
    ctx.clearRect(0, 0, W, H);

    // Soft pastel radial gradient bg
    const bg = ctx.createRadialGradient(W * 0.4, H * 0.35, 0, W / 2, H / 2, Math.max(W, H) * 0.8);
    bg.addColorStop(0, 'rgba(245,240,255,0.98)');
    bg.addColorStop(0.4, 'rgba(243,240,252,0.95)');
    bg.addColorStop(0.75, 'rgba(250,248,255,0.97)');
    bg.addColorStop(1, 'rgba(250,248,255,1)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Subtle mouse-reactive glow
    const glow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 280);
    glow.addColorStop(0, 'rgba(167,139,250,0.06)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Soft grid
    ctx.save();
    ctx.strokeStyle = 'rgba(167,139,250,0.055)';
    ctx.lineWidth = 1;
    const step = 90;
    for (let x = 0; x < W; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    ctx.restore();

    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateCanvas);
}
animateCanvas();

// ─── SCROLL REVEAL ───────────────────────────────
function addReveal(selector, delay = 0) {
    document.querySelectorAll(selector).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${delay + i * 65}ms`;
    });
}
addReveal('.about-text > *');
addReveal('.about-education > *');
addReveal('.skill-category', 0);
addReveal('.contact-text > *');
addReveal('.contact-link-card', 0);

const revealObs = new IntersectionObserver(
    (entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 80);
                revealObs.unobserve(e.target);
            }
        });
    },
    { threshold: 0.07, rootMargin: '0px 0px -20px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// Fallback
setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
}, 3500);

// ─── COUNTER ANIMATION ───────────────────────────
function animateCounter(el, target, duration = 1200) {
    if (target === '∞') return;
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

// ─── SKILL BAR ANIMATION ─────────────────────────
// Animate progress bars when they scroll into view
const skillBarsObs = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
                    const pct = bar.getAttribute('data-pct') || '0';
                    // Small delay so the CSS transition fires after paint
                    setTimeout(() => { bar.style.width = pct + '%'; }, 80);
                });
                skillBarsObs.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);
document.querySelectorAll('.skill-card').forEach(card => skillBarsObs.observe(card));

// Reveal animations for skill cards and cert cards
addReveal('.skill-card', 0);
addReveal('.cert-card', 0);

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

// ─── GITHUB PROFILE LOADER ───────────────────────
async function loadGitHubProfile() {
    const GITHUB_USER = 'Bavatarinee';
    const cacheKey = 'gh_profile_v1_' + GITHUB_USER;
    let profile = null;

    // Try cache
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < 3600000) { // 1hr cache
            profile = parsed.data;
        }
    }

    if (!profile) {
        try {
            const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`, {
                headers: { 'Accept': 'application/vnd.github.v3+json' }
            });
            if (res.ok) {
                profile = await res.json();
                localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: profile }));
            }
        } catch (e) {
            console.warn('GitHub profile fetch failed:', e);
        }
    }

    if (profile) {
        // Hero avatar
        const heroAvatarWrap = document.getElementById('hero-avatar-wrap');
        const heroAvatar = document.getElementById('hero-avatar');
        if (heroAvatar && profile.avatar_url) {
            heroAvatar.src = profile.avatar_url;
            heroAvatar.onload = () => { heroAvatarWrap.style.display = ''; };
        }

        // About section GitHub card
        const profileCard = document.getElementById('github-profile-card');
        if (profileCard) {
            document.getElementById('gh-avatar').src = profile.avatar_url || '';
            document.getElementById('gh-name').textContent = profile.name || profile.login;
            document.getElementById('gh-company').textContent = profile.company
                ? profile.company.replace('@', '') + ' · ' + (profile.location || '')
                : profile.location || 'GitHub';
            document.getElementById('gh-repos').textContent = profile.public_repos || 0;
            document.getElementById('gh-followers').textContent = profile.followers || 0;
            document.getElementById('gh-following').textContent = profile.following || 0;
            profileCard.style.display = '';
        }
    }
}
loadGitHubProfile();

// ─── GITHUB API — FLIP CARD PROJECTS ─────────────
(async function loadGitHubProjects() {
    const GITHUB_USER = 'Bavatarinee';
    const grid = document.getElementById('projects-grid');
    const syncStatus = document.getElementById('sync-status');
    const repoCountEl = document.getElementById('hero-repo-count');
    let rateLimited = false;

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

    async function getRepoLanguages(repo) {
        const cacheKey = `gh_langs_v3_${repo.id}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < 86400000) return parsed.data;
        }
        try {
            const res = await fetch(repo.languages_url, {
                headers: { 'Accept': 'application/vnd.github.v3+json' }
            });
            if (res.status === 403) rateLimited = true;
            if (res.ok) {
                const data = await res.json();
                const langs = Object.keys(data);
                localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: langs }));
                return langs;
            }
        } catch (e) {
            console.warn(`Failed to fetch languages for ${repo.name}:`, e);
        }
        return [];
    }

    function combineTechStack(repo, fetchedLangs) {
        const stack = new Set();
        if (fetchedLangs && fetchedLangs.length > 0) fetchedLangs.forEach(l => stack.add(l));
        if (repo.language) stack.add(repo.language);
        if (repo.topics && Array.isArray(repo.topics)) {
            repo.topics.forEach(topic => {
                const lower = topic.toLowerCase();
                if (topic.length < 15 && !['project', 'data', 'repository'].includes(lower)) {
                    stack.add(topic.charAt(0).toUpperCase() + topic.slice(1));
                }
            });
        }
        const name = (repo.name || '').toLowerCase();
        const desc = (repo.description || '').toLowerCase();
        const combined = (name + ' ' + desc).replace(/-/g, ' ').replace(/_/g, ' ');
        if (combined.includes('javascript') || combined.includes('react') || combined.includes('html') || combined.includes('website') || combined.includes('ecommerce')) {
            stack.add('JavaScript'); stack.add('HTML'); stack.add('CSS');
        }
        if (combined.includes('python') || combined.includes('ml') || combined.includes('learning') || combined.includes('detection') || combined.includes('prediction')) {
            stack.add('Python');
            if (combined.includes('deep') || combined.includes('cnn') || combined.includes('tensorflow') || combined.includes('keras')) {
                stack.add('TensorFlow');
            }
        }
        if (combined.includes('sql') || combined.includes('database') || combined.includes('analytics')) {
            stack.add('SQL');
        }
        if (combined.includes('nlp') || combined.includes('chatbot') || combined.includes('text')) {
            stack.add('NLP');
        }

        // Normalize
        const result = new Set();
        stack.forEach(s => {
            if (typeof s === 'string' && s.length > 1) {
                let val = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
                if (val.toLowerCase() === 'javascript') val = 'JavaScript';
                if (val.toLowerCase() === 'html') val = 'HTML';
                if (val.toLowerCase() === 'css') val = 'CSS';
                if (val.toLowerCase() === 'pyspark') val = 'PySpark';
                if (val.toLowerCase() === 'nlp') val = 'NLP';
                if (val.toLowerCase() === 'sql') val = 'SQL';
                if (val.toLowerCase() === 'ml') val = 'ML';
                if (val.toLowerCase() === 'tensorflow') val = 'TensorFlow';
                result.add(val);
            }
        });
        return [...result].slice(0, 5);
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function buildFlipCard(repo, index, languages) {
        const num = String(index + 1).padStart(2, '0');
        const category = deriveCategory(repo);
        const stars = repo.stargazers_count > 0 ? `⭐ ${repo.stargazers_count}` : '⭐ New';
        const desc = repo.description
            ? repo.description.slice(0, 180) + (repo.description.length > 180 ? '…' : '')
            : 'Explore this project on GitHub.';
        const langTags = languages.map(l => `<span>${l}</span>`).join('');
        const featured = index % 3 === 0 ? ' project-card--featured' : '';
        const primaryLink = repo.homepage || repo.html_url;
        const repoName = repo.name.replace(/-/g, ' ').replace(/_/g, ' ');
        const updated = formatDate(repo.updated_at);
        
        // Hide Live Demo for eye disease (or specific) projects even if they have a homepage set
        const hideDemo = repoName.toLowerCase().includes('disease') || repoName.toLowerCase().includes('eye');
        const showDemo = repo.homepage && !hideDemo;

        return `
        <div class="project-flip-wrap${featured}" id="proj-flip-${repo.id}"
             style="transition-delay:${index * 55}ms;"
             tabindex="0" role="button" aria-label="Flip card for ${repoName}">
            <div class="project-flip">

                <!-- FRONT -->
                <div class="project-front">
                    <div class="project-number">${num}</div>
                    <div class="project-category">${category}</div>
                    <h3 class="project-title">
                        <a href="${repo.html_url}" target="_blank" rel="noopener"
                           onclick="event.stopPropagation()">${repoName}</a>
                    </h3>
                    <div class="project-stack project-stack--front">${langTags}</div>
                    <div class="project-footer">
                        <div class="project-stars">${stars}</div>
                        <div class="flip-hint">&#10022; hover to flip</div>
                    </div>
                </div>

                <!-- BACK -->
                <div class="project-back">
                    <div>
                        <div class="project-back-title">${repoName}</div>
                        <div class="project-category" style="margin-bottom:1rem;">${category}</div>
                        <p class="project-back-desc">${desc}</p>
                    </div>
                    <div>
                        <div class="project-links">
                            <a href="${repo.html_url}" target="_blank" rel="noopener"
                               class="project-link project-link--ghost"
                               onclick="event.stopPropagation()">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                </svg>
                                GitHub
                            </a>
                            ${showDemo ? `
                            <a href="${repo.homepage}" target="_blank" rel="noopener"
                               class="project-link project-link--primary"
                               onclick="event.stopPropagation()">
                                Live Demo ↗
                            </a>` : ''}
                        </div>
                        ${updated ? `<div class="project-updated">Last updated ${updated}</div>` : ''}
                    </div>
                </div>

            </div>
        </div>`;
    }

    // Attach flip toggle on click/keyboard
    function attachFlipEvents(wrap) {
        wrap.addEventListener('click', () => wrap.classList.toggle('flipped'));
        wrap.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                wrap.classList.toggle('flipped');
            }
        });
    }

    try {
        const res = await fetch(
            `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated&type=public`,
            { headers: { 'Accept': 'application/vnd.github.v3+json' } }
        );
        if (!res.ok) throw new Error(`GitHub API ${res.status}`);
        const repos = await res.json();

        const filtered = repos.filter(r =>
            !r.fork &&
            r.name.toLowerCase() !== GITHUB_USER.toLowerCase() &&
            !r.name.toLowerCase().includes('config') &&
            !r.name.toLowerCase().includes('.github') &&
            !r.name.toLowerCase().endsWith('.github.io')
        );
        if (filtered.length === 0) throw new Error('No repos found');

        // Fetch languages in parallel
        const allTechStacks = await Promise.all(filtered.map(async (repo) => {
            const fetched = await getRepoLanguages(repo);
            return combineTechStack(repo, fetched);
        }));

        // Render flip cards
        grid.innerHTML = filtered.map((repo, i) => buildFlipCard(repo, i, allTechStacks[i])).join('');

        // Attach events & reveal animation
        grid.querySelectorAll('.project-flip-wrap').forEach((wrap, i) => {
            attachFlipEvents(wrap);
            wrap.classList.add('reveal');
            setTimeout(() => wrap.classList.add('visible'), 100 + i * 60);
        });

        // Update hero project count
        if (repoCountEl) {
            repoCountEl.textContent = filtered.length;
        }

        // Sync badge
        if (syncStatus) {
            const now = new Date();
            const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (rateLimited) {
                syncStatus.textContent = `Partially synced — API limit reached · ${time}`;
            } else {
                syncStatus.textContent = `Live — synced from GitHub · ${filtered.length} repos · ${time}`;
            }
        }

    } catch (err) {
        console.warn('GitHub API fetch failed:', err.message);
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
