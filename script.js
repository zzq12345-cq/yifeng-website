/* =============================================
   宜丰电子科技 – 交互脚本（多页版）
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    headerScroll();
    heroSlider();
    scrollReveal();
    smoothScroll();
    backToTop();
    mobileMenu();
    contactForm();
    activeNav();
    kpiCounter();
    certCarousel();
});

/* ---------- Header ---------- */
function headerScroll() {
    const h = document.getElementById('header');
    if (!h) return;

    // 子页面没有 hero，header 直接显示白底
    const hasHero = !!document.querySelector('.hero');

    if (!hasHero) {
        h.classList.add('scrolled');
        return;
    }

    const update = () => {
        h.classList.toggle('scrolled', scrollY > 60);
    };
    addEventListener('scroll', update, { passive: true });
    update();
}

/* ---------- Active Nav (pathname) ---------- */
function activeNav() {
    const path = location.pathname.split('/').pop() || 'index.html';
    const map = {
        'index.html': '首页',
        '': '首页',
        'about.html': '关于我们',
        'divisions.html': '业务板块',
        'advantages.html': '核心优势',
        'partners.html': '合作伙伴',
        'contact.html': '联系我们'
    };
    const current = map[path];
    if (!current) return;

    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.toggle('active', l.textContent.trim() === current);
    });
}

/* ---------- Hero Slider ---------- */
function heroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    if (!slides.length || !dots.length) return;

    let cur = 0, timer;

    function go(i) {
        slides[cur].classList.remove('active');
        dots[cur].classList.remove('active');
        cur = i;
        slides[cur].classList.add('active');
        dots[cur].classList.add('active');
    }

    function auto() { timer = setInterval(() => go((cur + 1) % slides.length), 6000); }
    function stop() { clearInterval(timer); }

    dots.forEach(d => d.addEventListener('click', () => {
        stop(); go(+d.dataset.i); auto();
    }));

    // Touch
    let sx = 0;
    const el = document.querySelector('.hero');
    if (el) {
        el.addEventListener('touchstart', e => { sx = e.changedTouches[0].screenX; stop(); }, { passive: true });
        el.addEventListener('touchend', e => {
            const d = sx - e.changedTouches[0].screenX;
            if (Math.abs(d) > 50) go(d > 0 ? (cur + 1) % slides.length : (cur - 1 + slides.length) % slides.length);
            auto();
        }, { passive: true });
    }

    auto();
}

/* ---------- Scroll Reveal ---------- */
function scrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => obs.observe(el));
}

/* ---------- Smooth Scroll ---------- */
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (!href || href === '#') return;
            const t = document.querySelector(href);
            if (t) {
                e.preventDefault();
                const y = t.getBoundingClientRect().top + scrollY - 56;
                scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });
}

/* ---------- Back to Top ---------- */
function backToTop() {
    const b = document.getElementById('btt');
    if (!b) return;
    addEventListener('scroll', () => b.classList.toggle('visible', scrollY > 500), { passive: true });
    b.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- Mobile Menu ---------- */
function mobileMenu() {
    const btn = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => {
        btn.classList.toggle('open');
        nav.classList.toggle('open');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });
    nav.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
        btn.classList.remove('open');
        nav.classList.remove('open');
        document.body.style.overflow = '';
    }));
}

/* ---------- Contact Form ---------- */
function contactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('.submit-btn');
        const txt = btn.textContent;
        btn.textContent = '提交中…';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = '✓ 已提交';
            btn.style.background = '#00875a';
            setTimeout(() => { form.reset(); btn.textContent = txt; btn.disabled = false; btn.style.background = ''; }, 2000);
        }, 800);
    });
}

/* ---------- KPI Counter Animation ---------- */
function kpiCounter() {
    const kpis = document.querySelectorAll('.kpi strong[data-target]');
    if (!kpis.length) return;

    const animate = (el) => {
        const target = el.dataset.target;
        const isNum = /^\d+$/.test(target);
        if (!isNum) { el.textContent = target; return; }

        const end = parseInt(target, 10);
        const duration = 1600;
        const start = performance.now();

        const step = (now) => {
            const t = Math.min((now - start) / duration, 1);
            // easeOutExpo
            const ease = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            el.textContent = Math.round(end * ease);
            if (t < 1) requestAnimationFrame(step);
            else el.textContent = el.dataset.display || target;
        };
        requestAnimationFrame(step);
    };

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                animate(e.target);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });

    kpis.forEach(el => {
        el.textContent = '0';
        obs.observe(el);
    });
}

/* ---------- Cert 3D Carousel ---------- */
function certCarousel() {
    const wrap = document.getElementById('certCarousel');
    if (!wrap) return;

    const items = wrap.querySelectorAll('.cert-carousel-item');
    const dots = wrap.querySelectorAll('.cert-dot');
    const prevBtn = wrap.querySelector('.cert-prev');
    const nextBtn = wrap.querySelector('.cert-next');
    const total = items.length;
    if (!total) return;

    let cur = 0, timer;
    const angle = 360 / total;
    const radius = 360; // px from center

    function place() {
        items.forEach((item, i) => {
            let diff = ((i - cur) % total + total) % total;
            if (diff > total / 2) diff -= total;

            // Linear offset for smooth side-to-side motion
            const tx = diff * 380;
            const sc = diff === 0 ? 1 : 0.78;
            const op = diff === 0 ? 1 : 0.45;

            item.style.transform = `translateX(${tx}px) scale(${sc})`;
            item.style.opacity = op;
            item.style.filter = diff === 0 ? 'none' : 'brightness(.55)';
            item.style.zIndex = diff === 0 ? 10 : 5 - Math.abs(diff);
            item.style.pointerEvents = Math.abs(diff) <= 1 ? 'auto' : 'none';

            item.classList.remove('active', 'prev', 'next', 'hidden');
            if (diff === 0) item.classList.add('active');
            else if (diff === -1) item.classList.add('prev');
            else if (diff === 1) item.classList.add('next');
            else item.classList.add('hidden');
        });

        dots.forEach((d, i) => d.classList.toggle('active', i === cur));
    }

    function go(i) {
        cur = ((i % total) + total) % total;
        place();
    }

    function autoPlay() { timer = setInterval(() => go(cur + 1), 4000); }
    function stopPlay() { clearInterval(timer); }

    // Events
    prevBtn.addEventListener('click', () => { stopPlay(); go(cur - 1); autoPlay(); });
    nextBtn.addEventListener('click', () => { stopPlay(); go(cur + 1); autoPlay(); });
    dots.forEach(d => d.addEventListener('click', () => {
        stopPlay(); go(+d.dataset.i); autoPlay();
    }));

    // Click on side items to navigate
    items.forEach(item => item.addEventListener('click', () => {
        const i = +item.dataset.i;
        if (i !== cur) { stopPlay(); go(i); autoPlay(); }
    }));

    // Touch support
    let sx = 0;
    wrap.addEventListener('touchstart', e => { sx = e.changedTouches[0].screenX; stopPlay(); }, { passive: true });
    wrap.addEventListener('touchend', e => {
        const d = sx - e.changedTouches[0].screenX;
        if (Math.abs(d) > 40) go(d > 0 ? cur + 1 : cur - 1);
        autoPlay();
    }, { passive: true });

    place();
    autoPlay();
}
