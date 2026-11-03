// Initialize Lucide Icons
lucide.createIcons();

// Scroll Fade In/Out Animation
document.addEventListener('DOMContentLoaded', () => {

    // ── Hero Background Slideshow ──────────────────────────────────────
    const slides = document.querySelectorAll('.hero-slide');
    let current  = 0;

    function nextSlide() {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }

    setInterval(nextSlide, 5000); // crossfade every 5 seconds


    // ── Sponsors Background Slideshow ──────────────────────────────────
    const sponsorSlides = document.querySelectorAll('.sponsors-slide');
    let sponsorCurrent  = 0;

    function nextSponsorSlide() {
        sponsorSlides[sponsorCurrent].classList.remove('active');
        sponsorCurrent = (sponsorCurrent + 1) % sponsorSlides.length;
        sponsorSlides[sponsorCurrent].classList.add('active');
    }

    // Offset by 2s so hero and sponsors don't change at the same time
    setTimeout(() => {
        setInterval(nextSponsorSlide, 6000);
    }, 2000);

    // ── Scroll Fade Animations ─────────────────────────────────────────
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-element').forEach(el => observer.observe(el));

    // ── Mobile Menu Toggle ─────────────────────────────────────────────
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav           = document.querySelector('.radiocast-nav');
    const iconMenu      = document.querySelector('.icon-menu');
    const iconClose     = document.querySelector('.icon-close');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            const isOpen = nav.classList.contains('active');
            iconMenu.style.display  = isOpen ? 'none'  : 'block';
            iconClose.style.display = isOpen ? 'block' : 'none';
        });
    }

    // ── Fetch Dynamic Content from API ─────────────────────────────────
    fetch('https://cupofhopeapi.onrender.com/api/content')
        .then(response => response.json())
        .then(data => {
            const ignoreKeys = ['programs', 'news', 'events', 'sponsors'];
            for (const key in data) {
                if (ignoreKeys.includes(key)) continue;
                
                const el = document.getElementById(key);
                if (el) {
                    el.innerHTML = data[key];
                }
            }

            if (data.hero_bg) {
                const heroContainer = document.getElementById('hero-background-container');
                if (heroContainer) {
                    heroContainer.innerHTML = `<div class="hero-slide active" style="background-image: url('${data.hero_bg}')"></div>`;
                }
            }

            // Render Programs
            if (data.programs) {
                const programs = JSON.parse(data.programs);
                const container = document.getElementById('programs_container');
                if (container) {
                    container.innerHTML = programs.map(p => `
                        <div class="program-card fade-element visible">
                            ${p.image && p.image !== 'null' && p.image !== 'undefined' ? `<img src="${p.image}" alt="${p.title}" class="program-img">` : ''}
                            <div class="program-info">
                                <h3>${p.title}</h3>
                                <span class="time">${p.time}</span>
                                <p>${p.desc}</p>
                            </div>
                        </div>
                    `).join('');
                }
            }

            // Render News
            if (data.news) {
                const news = JSON.parse(data.news);
                const container = document.getElementById('news_container');
                if (container) {
                    if (news.length === 0) {
                        container.innerHTML = '<div class="empty-state">No latest news available right now.</div>';
                    } else {
                        container.innerHTML = news.map((n, i) => `
                        <article class="news-item">
                            ${n.image && n.image !== 'null' && n.image !== 'undefined' ? `<img src="${n.image}" alt="${n.title}" class="news-img">` : ''}
                            <div class="news-content">
                                <h3 class="news-item-title">${n.title}</h3>
                                <span class="news-date">${n.date}</span>
                                <p class="news-snippet">${n.snippet}</p>
                                <a href="#" class="read-more" data-index="${i}">Read More <i data-lucide="arrow-right" class="sm-icon"></i></a>
                            </div>
                        </article>
                        ${i < news.length - 1 ? '<div class="news-divider"></div>' : ''}
                    `).join('');
                    }

                    // Add click listeners to "Read More" links
                    const readMoreLinks = container.querySelectorAll('.read-more');
                    readMoreLinks.forEach(link => {
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            const index = link.getAttribute('data-index');
                            const newsItem = news[index];
                            
                            const modal = document.getElementById('news-modal');
                            if (!modal) return;
                            
                            document.getElementById('modal-title').textContent = newsItem.title;
                            document.getElementById('modal-date').textContent = newsItem.date;
                            document.getElementById('modal-snippet').textContent = newsItem.snippet;
                            
                            const img = document.getElementById('modal-img');
                            if (newsItem.image && newsItem.image !== 'null' && newsItem.image !== 'undefined') {
                                img.src = newsItem.image;
                                img.style.display = 'block';
                            } else {
                                img.style.display = 'none';
                                img.src = '';
                            }
                            
                            modal.classList.add('show');
                        });
                    });
                }
            }

            // Render Events
            if (data.events) {
                const events = JSON.parse(data.events);
                const container = document.getElementById('events_container');
                if (container) {
                    if (events.length === 0) {
                        container.innerHTML = '<div class="empty-state">No upcoming events at the moment. Stay tuned!</div>';
                    } else {
                        container.innerHTML = events.map(e => {
                            if (e.type === 'primary') {
                            return `
                                <div class="event-featured-card">
                                    <div class="event-header-row">
                                        <div class="event-date-badge ${e.color}-badge">
                                            <span class="date-day">${e.day}</span>
                                            <span class="date-month">${e.month}</span>
                                        </div>
                                        <div class="event-header-info">
                                            <h3 class="event-title">${e.title}</h3>
                                            <span class="event-venue">${e.venue}</span>
                                        </div>
                                    </div>
                                    <div class="event-countdown" data-day="${e.day}" data-month="${e.month}">
                                        <div class="countdown-block"><span class="count-num cd-days">00</span><span class="count-label">Days</span></div>
                                        <div class="countdown-divider"></div>
                                        <div class="countdown-block"><span class="count-num cd-hours">00</span><span class="count-label">Hours</span></div>
                                        <div class="countdown-divider"></div>
                                        <div class="countdown-block"><span class="count-num cd-mins">00</span><span class="count-label">Mins</span></div>
                                        <div class="countdown-divider"></div>
                                        <div class="countdown-block"><span class="count-num cd-secs">00</span><span class="count-label">Secs</span></div>
                                    </div>
                                </div>
                            `;
                        } else {
                            return `
                                <div class="event-secondary-card">
                                    <div class="event-date-badge ${e.color}-badge">
                                        <span class="date-day">${e.day}</span>
                                        <span class="date-month">${e.month}</span>
                                    </div>
                                    <div class="event-header-info">
                                        <h3 class="event-title">${e.title}</h3>
                                        <span class="event-venue">${e.venue}</span>
                                    </div>
                                </div>
                            `;
                            }
                        }).join('');
                    }
                }
            }

            // Render Sponsors
            if (data.sponsors) {
                const sponsors = JSON.parse(data.sponsors);
                const container = document.getElementById('sponsors_container');
                if (container) {
                    container.innerHTML = sponsors.map(s => `
                        <div class="sponsor-logo-box">
                            ${s.image ? `<img src="${s.image}" alt="${s.name}" class="sponsor-img" style="max-height: 40px; margin-bottom: 10px;">` : ''}
                            <span>${s.name}</span>
                        </div>
                    `).join('');
                }
            }

            // Re-initialize Lucide icons for the newly injected dynamic content
            lucide.createIcons();
            
        })
        .catch(err => console.error('Error fetching content:', err));

    // ── Radio Player Logic ─────────────────────────────────────────────
    const audio = document.getElementById('radio-stream');
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const playIcon = document.querySelector('.play-icon');
    const equalizer = document.getElementById('equalizer');
    const volumeSliderBg = document.getElementById('volume-slider');
    const volumeFill = document.getElementById('volume-fill');
    const muteBtn = document.querySelector('.mute-btn');
    const volumeIcon = document.querySelector('.volume-icon');

    if (audio && playPauseBtn) {
        let isPlaying = false;

        playPauseBtn.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
                isPlaying = false;
                playIcon.setAttribute('data-lucide', 'play');
                equalizer.classList.remove('playing');
            } else {
                audio.play();
                isPlaying = true;
                playIcon.setAttribute('data-lucide', 'pause');
                equalizer.classList.add('playing');
            }
            lucide.createIcons(); // refresh icon
        });

        let currentVolume = 1;

        if (volumeSliderBg) {
            volumeSliderBg.addEventListener('click', (e) => {
                const rect = volumeSliderBg.getBoundingClientRect();
                const x = e.clientX - rect.left;
                let percentage = Math.max(0, Math.min(1, x / rect.width));
                
                audio.volume = percentage;
                volumeFill.style.width = (percentage * 100) + '%';
                currentVolume = percentage;
                updateVolumeIcon(percentage);
            });
        }
        
        if (muteBtn) {
            let isMuted = false;
            muteBtn.addEventListener('click', () => {
                if (isMuted) {
                    audio.volume = currentVolume;
                    volumeFill.style.width = (currentVolume * 100) + '%';
                    isMuted = false;
                    updateVolumeIcon(currentVolume);
                } else {
                    audio.volume = 0;
                    volumeFill.style.width = '0%';
                    isMuted = true;
                    updateVolumeIcon(0);
                }
            });
        }

        function updateVolumeIcon(vol) {
            if (vol === 0) {
                volumeIcon.setAttribute('data-lucide', 'volume-x');
            } else if (vol < 0.5) {
                volumeIcon.setAttribute('data-lucide', 'volume-1');
            } else {
                volumeIcon.setAttribute('data-lucide', 'volume-2');
            }
            lucide.createIcons();
        }
        
        audio.volume = 1;
    }

    // ── Close Modal Logic ─────────────────────────────────────────────
    const modal = document.getElementById('news-modal');
    if (modal) {
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => modal.classList.remove('show'));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('show');
        });
    }

    // ── Auto Countdown Logic ───────────────────────────────────────────
    setInterval(() => {
        const countdowns = document.querySelectorAll('.event-countdown');
        if (!countdowns.length) return;
        
        const now = new Date();
        const currentYear = now.getFullYear();

        countdowns.forEach(cd => {
            const dayStr = cd.getAttribute('data-day');
            const monthStr = cd.getAttribute('data-month');
            if (!dayStr || !monthStr) return;
            
            // Map common month abbreviations to indexes (0-11)
            const months = { 'JAN':0, 'FEB':1, 'MAR':2, 'APR':3, 'MAY':4, 'JUN':5, 'JUL':6, 'AUG':7, 'SEP':8, 'OCT':9, 'NOV':10, 'DEC':11 };
            const m = months[monthStr.toUpperCase().substring(0,3)] || 0;
            const d = parseInt(dayStr) || 1;

            let eventDate = new Date(currentYear, m, d);
            if (now > eventDate) {
                // If the date has passed this year, count to next year
                eventDate = new Date(currentYear + 1, m, d);
            }

            const diff = eventDate - now; // diff in ms
            
            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const mins = Math.floor((diff / 1000 / 60) % 60);
                const secs = Math.floor((diff / 1000) % 60);

                cd.querySelector('.cd-days').textContent = String(days).padStart(2, '0');
                cd.querySelector('.cd-hours').textContent = String(hours).padStart(2, '0');
                cd.querySelector('.cd-mins').textContent = String(mins).padStart(2, '0');
                cd.querySelector('.cd-secs').textContent = String(secs).padStart(2, '0');
            }
        });
    }, 1000);
});
