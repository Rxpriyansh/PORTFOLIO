/* ┌─────────────────────────────────────────────────────────┐
   │                script.js  — Portfolio                   │
   └─────────────────────────────────────────────────────────┘ */

/* ══════════════════════════════════════════════════════════
   1. BOOT SCREEN
   ══════════════════════════════════════════════════════════ */
(function bootSequence() {
    const screen = document.getElementById('bootScreen');
    const log = document.getElementById('bootLog');
    const bar = document.getElementById('bootBar');

    const lines = [
        { txt: 'BIOS v2.0.26  —  Initializing hardware...', cls: '', delay: 0 },
        { txt: '[  OK  ] mounted /dev/portfolio', cls: 'ok', delay: 200 },
        { txt: '[  OK  ] loading kernel modules: react, node, spring', cls: 'ok', delay: 450 },
        { txt: '[  OK  ] starting network services', cls: 'ok', delay: 700 },
        { txt: '[ WARN ] port 8080 already in use, rebinding...', cls: 'warn', delay: 950 },
        { txt: '[  OK  ] database connection: postgresql@5432', cls: 'ok', delay: 1150 },
        { txt: '[  OK  ] redis cache: CONNECTED', cls: 'ok', delay: 1350 },
        { txt: '[  OK  ] microservices mesh: HEALTHY', cls: 'ok', delay: 1550 },
        { txt: '[  OK  ] loading UI components...', cls: 'ok', delay: 1750 },
        { txt: '[  OK  ] boot complete — welcome, visitor', cls: 'ok', delay: 1950 },
    ];

    lines.forEach(({ txt, cls, delay }, i) => {
        setTimeout(() => {
            const p = document.createElement('p');
            p.textContent = txt;
            if (cls) p.className = cls;
            log.appendChild(p);
            log.scrollTop = log.scrollHeight;
            bar.style.width = `${((i + 1) / lines.length) * 100}%`;
        }, delay);
    });

    setTimeout(() => {
        screen.classList.add('hidden');
    }, 2800);
})();

/* ══════════════════════════════════════════════════════════
   2. CUSTOM CURSOR + TRAIL SPARKS
   ══════════════════════════════════════════════════════════ */
const cursorGlow = document.getElementById('cursorGlow');
const cursorDot = document.getElementById('cursorDot');
let mx = 0, my = 0;

document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursorGlow.style.left = mx + 'px';
    cursorGlow.style.top = my + 'px';
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top = my + 'px';
    spawnSpark(mx, my);
});

document.addEventListener('mousedown', () => cursorDot.classList.add('clicking'));
document.addEventListener('mouseup', () => cursorDot.classList.remove('clicking'));

let lastSpark = 0;
function spawnSpark(x, y) {
    const now = Date.now();
    if (now - lastSpark < 40) return;
    lastSpark = now;

    const spark = document.createElement('div');
    spark.className = 'trail-spark';
    const size = Math.random() * 5 + 2;
    const colors = ['#00FF88', '#00D4FF', '#7B61FF', '#FFD93D'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const ox = (Math.random() - 0.5) * 14;
    const oy = (Math.random() - 0.5) * 14;

    spark.style.cssText = `
    left:${x + ox}px; top:${y + oy}px;
    width:${size}px; height:${size}px;
    background:${color};
    box-shadow: 0 0 6px ${color};
    animation-duration:${Math.random() * 0.3 + 0.3}s;
  `;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 700);
}

/* ══════════════════════════════════════════════════════════
   3. NAVBAR SCROLL + ACTIVE LINK
   ══════════════════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) link.style.color = 'var(--accent)';
    });
}, { passive: true });

/* ══════════════════════════════════════════════════════════
   4. MOBILE MENU
   ══════════════════════════════════════════════════════════ */
document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => document.getElementById('mobileMenu').classList.remove('open'));
});

/* ══════════════════════════════════════════════════════════
   5. SMOOTH SCROLL
   ══════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
        const t = document.querySelector(this.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
});

/* ══════════════════════════════════════════════════════════
   6. TYPING EFFECT — hero terminal
   ══════════════════════════════════════════════════════════ */
const phrases = [
    'whoami', 'cat skills.json', 'git log --oneline',
    'ls -la ~/projects', 'node server.js',
    'docker build -t portfolio .', 'ssh user@distributed.system',
    'kubectl get pods --all-namespaces',
];
let pIdx = 0, cIdx = 0, del = false;
const typedEl = document.getElementById('typedText');

function typeLoop() {
    const cur = phrases[pIdx];
    if (!del) {
        typedEl.textContent = cur.slice(0, ++cIdx);
        if (cIdx === cur.length) { del = true; setTimeout(typeLoop, 1800); return; }
        setTimeout(typeLoop, 90);
    } else {
        typedEl.textContent = cur.slice(0, --cIdx);
        if (cIdx === 0) { del = false; pIdx = (pIdx + 1) % phrases.length; setTimeout(typeLoop, 400); return; }
        setTimeout(typeLoop, 45);
    }
}
typeLoop();

/* ══════════════════════════════════════════════════════════
   7. MATRIX RAIN
   ══════════════════════════════════════════════════════════ */
(function initMatrix() {
    const container = document.getElementById('matrixBg');
    const canvas = document.createElement('canvas');
    canvas.id = 'matrixCanvas';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resize() { canvas.width = container.offsetWidth; canvas.height = container.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 14;
    const drops = [];
    const chars = 'アイウエオカキクケコサシスセ01ABCDabcd{}[]()<>/\\|@#';

    function frame() {
        ctx.fillStyle = 'rgba(8,11,20,0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const cols = Math.floor(canvas.width / fontSize);
        while (drops.length < cols) drops.push(Math.random() * -50);
        ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
        for (let i = 0; i < cols; i++) {
            const ch = chars[Math.floor(Math.random() * chars.length)];
            ctx.globalAlpha = Math.random() * 0.7 + 0.3;
            ctx.fillStyle = Math.random() > 0.96 ? '#FFFFFF' : '#00FF88';
            ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
            ctx.globalAlpha = 1;
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(frame, 55);
})();

/* ══════════════════════════════════════════════════════════
   8. COMMAND PALETTE (Ctrl+K)
   ══════════════════════════════════════════════════════════ */
const palette = document.getElementById('cmdPalette');
const cmdInput = document.getElementById('cmdInput');
const cmdList = document.getElementById('cmdList');
const allCmdItems = Array.from(cmdList.querySelectorAll('.cmd-item'));

function openPalette() {
    palette.classList.remove('hidden');
    cmdInput.value = '';
    cmdInput.focus();
    filterCmdItems('');
    setActiveItem(0);
}
function closePalette() { palette.classList.add('hidden'); }

document.getElementById('cmdOpenBtn').addEventListener('click', openPalette);
document.getElementById('cmdBackdrop').addEventListener('click', closePalette);

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); palette.classList.contains('hidden') ? openPalette() : closePalette(); }
    if (!palette.classList.contains('hidden')) {
        if (e.key === 'Escape') closePalette();
        if (e.key === 'ArrowDown') { e.preventDefault(); moveActive(1); }
        if (e.key === 'ArrowUp') { e.preventDefault(); moveActive(-1); }
        if (e.key === 'Enter') { e.preventDefault(); executeActive(); }
    }
});

cmdInput.addEventListener('input', () => {
    filterCmdItems(cmdInput.value.toLowerCase());
    setActiveItem(0);
});

function filterCmdItems(q) {
    allCmdItems.forEach(item => {
        item.style.display = item.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
}
function visibleItems() { return allCmdItems.filter(i => i.style.display !== 'none'); }
function setActiveItem(idx) {
    visibleItems().forEach((item, i) => item.classList.toggle('active', i === idx));
}
function moveActive(dir) {
    const vis = visibleItems();
    if (!vis.length) return;
    const cur = vis.findIndex(i => i.classList.contains('active'));
    const next = (cur + dir + vis.length) % vis.length;
    vis.forEach((item, i) => item.classList.toggle('active', i === next));
}
function executeActive() {
    const active = visibleItems().find(i => i.classList.contains('active'));
    if (active) executeCmdAction(active.dataset.action);
}

allCmdItems.forEach(item => {
    item.addEventListener('click', () => executeCmdAction(item.dataset.action));
});

function executeCmdAction(action) {
    closePalette();
    switch (action) {
        case 'home': document.getElementById('home').scrollIntoView({ behavior: 'smooth' }); break;
        case 'about': document.getElementById('about').scrollIntoView({ behavior: 'smooth' }); break;
        case 'skills': document.getElementById('skills').scrollIntoView({ behavior: 'smooth' }); break;
        case 'experience': document.getElementById('experience').scrollIntoView({ behavior: 'smooth' }); break;
        case 'projects': document.getElementById('projects').scrollIntoView({ behavior: 'smooth' }); break;
        case 'contact': document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }); break;
        case 'github': window.open('https://github.com/Rxpriyansh', '_blank'); break;
        case 'cli': toggleCli(); break;
    }
}

/* ══════════════════════════════════════════════════════════
   9. FLOATING INTERACTIVE CLI
   ══════════════════════════════════════════════════════════ */
const floatCli = document.getElementById('floatCli');
const cliInputEl = document.getElementById('cliInput');
const cliOutput = document.getElementById('cliOutput');
const cliToggle = document.getElementById('cliToggleBtn');
const cliCloseBtn = document.getElementById('cliClose');
const cliFullBtn = document.getElementById('cliFullBtn');

let cliOpen = false, cliHistory = [], cliHistIdx = -1;

function toggleCli() {
    cliOpen = !cliOpen;
    floatCli.classList.toggle('hidden', !cliOpen);
    if (cliOpen) { cliInputEl.focus(); }
}
cliToggle.addEventListener('click', toggleCli);
cliCloseBtn.addEventListener('click', () => { cliOpen = false; floatCli.classList.add('hidden'); });
cliFullBtn.addEventListener('click', () => floatCli.classList.toggle('fullscreen'));

// CLI commands
const CLI_COMMANDS = {
    help: () => `
Available commands:
  <span class="cli-acc">about</span>       — who is Priyansh Gandharv
  <span class="cli-acc">skills</span>      — list tech stack
  <span class="cli-acc">projects</span>    — list projects
  <span class="cli-acc">contact</span>     — contact info
  <span class="cli-acc">goto [section]</span> — scroll to section
  <span class="cli-acc">date</span>        — show current date
  <span class="cli-acc">uptime</span>      — portfolio uptime
  <span class="cli-acc">clear</span>       — clear terminal
  <span class="cli-acc">exit</span>        — close this terminal`,

    about: () => `PRIYANSH GANDHARV — Full Stack Software Engineer
Specializing in distributed systems, real-time architecture, and high-performance applications.
3+ years · 20+ projects · 10K+ req/sec handled`,

    skills: () => `{
  "frontend":  ["React", "Next.js", "TypeScript", "Tailwind"],
  "backend":   ["Node.js", "Java", "Spring Boot", "GraphQL"],
  "infra":     ["Docker", "Kubernetes", "AWS", "CI/CD"],
  "database":  ["PostgreSQL", "MongoDB", "Redis"]
}`,

    projects: () => `drwxr-xr-x  e-commerce-api      Node.js · PostgreSQL · Redis · Docker
drwxr-xr-x  analytics-dashboard React · D3.js · WebSocket · Node.js
drwxr-xr-x  ai-chat-platform    Python · OpenAI · React · FastAPI

→ <a href="https://github.com/Rxpriyansh" target="_blank" class="cli-acc">github.com/Momin-786</a>`,

    contact: () => `email    : <a href="mailto:priyanshgandharv529@gmail.com" class="cli-acc">priyanshgandharv529@gmail.com</a>
github   : <a href="https://github.com/Rxpriyansh" target="_blank" class="cli-acc">@Rxpriyansh</a>
linkedin : <a href="https://www.linkedin.com/in/priyansh-gandharv" target="_blank" class="cli-acc">linkedin.com/in/priyansh-gandharv</a>
instagram: <a href="https://www.instagram.com/rx_priyansh" target="_blank" class="cli-acc">@rx_priyansh</a>`,

    date: () => new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'medium' }),

    uptime: () => {
        const ms = performance.now();
        const secs = Math.floor(ms / 1000);
        const mins = Math.floor(secs / 60);
        return `Portfolio uptime: ${mins}m ${secs % 60}s  (since page load)`;
    },

    clear: () => { cliOutput.innerHTML = ''; return null; },
    exit: () => { toggleCli(); return null; },
};

cliInputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const raw = cliInputEl.value.trim();
        if (!raw) return;

        cliHistory.unshift(raw);
        cliHistIdx = -1;
        cliInputEl.value = '';

        // Echo command
        const cmdLine = document.createElement('p');
        cmdLine.innerHTML = `<span class="t-prompt">visitor@portfolio:~$</span> <span class="cli-out-cmd">${escHtml(raw)}</span>`;
        cliOutput.appendChild(cmdLine);

        // Parse
        const parts = raw.toLowerCase().split(/\s+/);
        const cmd = parts[0];

        if (cmd === 'goto' && parts[1]) {
            const target = document.getElementById(parts[1]);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                appendCLIOut(`Navigating to <span class="cli-acc">#${parts[1]}</span>...`);
            } else {
                appendCLIOut(`<span class="cli-err">Section not found: ${escHtml(parts[1])}</span>`);
            }
        } else if (CLI_COMMANDS[cmd]) {
            const result = CLI_COMMANDS[cmd]();
            if (result !== null && result !== undefined) appendCLIOut(result);
        } else {
            appendCLIOut(`<span class="cli-err">command not found: ${escHtml(raw)}</span>  Type <span class="cli-acc">help</span>`);
        }

        appendCLIOut('');
        cliOutput.scrollTop = cliOutput.scrollHeight;
    }

    // Command history
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (cliHistIdx < cliHistory.length - 1) cliHistIdx++;
        cliInputEl.value = cliHistory[cliHistIdx] || '';
    }
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (cliHistIdx > 0) cliHistIdx--;
        else { cliHistIdx = -1; cliInputEl.value = ''; return; }
        cliInputEl.value = cliHistory[cliHistIdx] || '';
    }
});

function appendCLIOut(html) {
    const p = document.createElement('p');
    p.className = 'cli-out-txt';
    p.innerHTML = html;
    cliOutput.appendChild(p);
}
function escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Draggable CLI
(function makeDraggable() {
    const handle = document.getElementById('cliDragHandle');
    let ox = 0, oy = 0, startX, startY;

    handle.addEventListener('mousedown', (e) => {
        if (floatCli.classList.contains('fullscreen')) return;
        startX = e.clientX - ox;
        startY = e.clientY - oy;

        function onMove(e) {
            ox = e.clientX - startX;
            oy = e.clientY - startY;
            floatCli.style.transform = `translate(${ox}px, ${oy}px)`;
        }
        function onUp() {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    });
})();

/* ══════════════════════════════════════════════════════════
   10. SCROLL FADE-IN ANIMATIONS
   ══════════════════════════════════════════════════════════ */
const fadeEls = document.querySelectorAll(
    '.section-header, .about-terminal, .about-stats, .stat-card, ' +
    '.skill-bar-item, .skill-group, .timeline-item, .project-card, ' +
    '.contact-terminal, .contact-form'
);
fadeEls.forEach(el => el.classList.add('fade-in'));

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 60);
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
fadeEls.forEach(el => fadeObserver.observe(el));

/* ══════════════════════════════════════════════════════════
   11. ANIMATED SKILL BARS (trigger on scroll)
   ══════════════════════════════════════════════════════════ */
const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fill = entry.target.querySelector('.sb-fill');
            if (fill) fill.style.width = fill.dataset.pct + '%';
            barObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-bar-item').forEach(item => barObserver.observe(item));

/* ══════════════════════════════════════════════════════════
   12. COUNTING STATS (number animation)
   ══════════════════════════════════════════════════════════ */
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-num[data-target]').forEach(el => {
                const target = +el.dataset.target;
                let cur = 0;
                const step = Math.ceil(target / 30);
                const timer = setInterval(() => {
                    cur = Math.min(cur + step, target);
                    el.textContent = cur;
                    if (cur >= target) clearInterval(timer);
                }, 40);
            });
            countObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.about-stats').forEach(el => countObserver.observe(el));

/* ══════════════════════════════════════════════════════════
   13. 3D TILT on project cards
   ══════════════════════════════════════════════════════════ */
document.querySelectorAll('.tilt-card').forEach(card => {
    // Add spotlight element
    const spot = document.createElement('div');
    spot.className = 'card-spotlight';
    card.appendChild(spot);

    card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const cx = r.width / 2;
        const cy = r.height / 2;
        const rotX = ((y - cy) / cy) * -10;
        const rotY = ((x - cx) / cx) * 10;
        const inner = card.querySelector('.tilt-inner');
        if (inner) inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
        spot.style.left = x + 'px';
        spot.style.top = y + 'px';
    });

    card.addEventListener('mouseleave', () => {
        const inner = card.querySelector('.tilt-inner');
        if (inner) inner.style.transform = '';
    });
});

/* ══════════════════════════════════════════════════════════
   14. FLOATING PARTICLES
   ══════════════════════════════════════════════════════════ */
function spawnParticle() {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    const clrs = ['#00FF88', '#00D4FF', '#7B61FF'];
    const color = clrs[Math.floor(Math.random() * clrs.length)];
    p.style.cssText = `
    width:${size}px; height:${size}px;
    left:${Math.random() * 100}vw;
    background:${color};
    box-shadow:0 0 6px ${color};
    animation-duration:${Math.random() * 15 + 10}s;
    animation-delay:${Math.random() * 4}s;
  `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 25000);
}
setInterval(spawnParticle, 3000);
for (let i = 0; i < 6; i++) spawnParticle();

/* ══════════════════════════════════════════════════════════
   15. CONTACT FORM SUBMIT
   ══════════════════════════════════════════════════════════ */
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span class="btn-icon">✓</span> Message sent!';
    btn.style.cssText = 'background:#00FF88;color:#000;';
    btn.disabled = true;
    setTimeout(() => { btn.innerHTML = orig; btn.style.cssText = ''; btn.disabled = false; this.reset(); }, 3500);
});


