// ====== Menu Mobile ======
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// Fechar menu ao clicar fora
document.addEventListener('click', (e) => {
    if (navLinks && hamburger && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// ====== CTA Button ======
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
    });
}

// ====== Animação ao scrollar ======
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer para cards de skills
document.querySelectorAll('.skill-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

const skillColumnObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-column').forEach(column => {
    skillColumnObserver.observe(column);
});

const skillProgressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progress = entry.target;
            const level = Number(progress.dataset.level || 0);
            progress.style.width = `${level}%`;
        }
    });
}, { threshold: 0.4 });

document.querySelectorAll('.skill-progress').forEach(progress => {
    skillProgressObserver.observe(progress);
});

// Observer para cards de projetos
document.querySelectorAll('.project-card').forEach((card, index) => {
    card.style.transition = `opacity 0.8s ease ${index * 0.3}s, transform 0.8s ease ${index * 0.3}s`;
    observer.observe(card);
});

const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.25 });

document.querySelectorAll('.project-card').forEach(card => {
    projectObserver.observe(card);
});

// ====== Form Handling ======
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (!submitButton) return;

        submitButton.disabled = true;
        submitButton.innerHTML = 'Enviando...';

        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Enviar Mensagem <i class="fa-solid fa-paper-plane"></i>';
        }, 2000);
    });
}

// ====== Lightbox para imagens ======
const imageModal = document.getElementById('imageModal');
const imageModalImg = document.getElementById('imageModalImg');
const imageModalClose = document.querySelector('.image-modal-close');
const imageModalPause = document.getElementById('imageModalPause');
let galleryImages = [];
let galleryIndex = 0;
let galleryTimer = null;
let isGalleryPaused = false;

const openImageModal = (src, alt, images = [], startIndex = 0) => {
    if (!imageModal || !imageModalImg) return;

    galleryImages = images;
    galleryIndex = startIndex;
    isGalleryPaused = false;

    if (galleryImages.length > 1) {
        imageModalImg.src = galleryImages[galleryIndex];
        imageModalImg.alt = alt || 'Imagem ampliada';
        imageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (imageModalPause) {
            imageModalPause.textContent = '⏸ Pausar';
            imageModalPause.style.display = 'inline-flex';
        }

        if (galleryTimer) clearInterval(galleryTimer);
        galleryTimer = setInterval(() => {
            if (isGalleryPaused) return;
            galleryIndex = (galleryIndex + 1) % galleryImages.length;
            imageModalImg.src = galleryImages[galleryIndex];
            imageModalImg.alt = galleryImages[galleryIndex].split('/').pop() || 'Imagem ampliada';
        }, 3000);
    } else {
        imageModalImg.src = src;
        imageModalImg.alt = alt || 'Imagem ampliada';
        imageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (imageModalPause) imageModalPause.style.display = 'none';
    }
};

const closeImageModal = () => {
    if (!imageModal || !imageModalImg) return;
    if (galleryTimer) clearInterval(galleryTimer);
    galleryTimer = null;
    galleryImages = [];
    galleryIndex = 0;
    isGalleryPaused = false;
    imageModal.classList.remove('active');
    imageModalImg.src = '';
    imageModalImg.alt = '';
    document.body.style.overflow = '';
};

document.querySelectorAll('.gallery-image').forEach((img) => {
    img.addEventListener('click', () => {
        const gallery = Array.from(img.closest('.skill-card').querySelectorAll('.gallery-image'));
        const images = gallery.map((item) => item.getAttribute('src'));
        const index = images.indexOf(img.getAttribute('src'));
        openImageModal(img.getAttribute('src'), img.getAttribute('alt'), images, index >= 0 ? index : 0);
    });

    img.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const gallery = Array.from(img.closest('.skill-card').querySelectorAll('.gallery-image'));
            const images = gallery.map((item) => item.getAttribute('src'));
            const index = images.indexOf(img.getAttribute('src'));
            openImageModal(img.getAttribute('src'), img.getAttribute('alt'), images, index >= 0 ? index : 0);
        }
    });
});

if (imageModalClose) {
    imageModalClose.addEventListener('click', closeImageModal);
}

if (imageModalPause) {
    imageModalPause.addEventListener('click', () => {
        isGalleryPaused = !isGalleryPaused;
        imageModalPause.textContent = isGalleryPaused ? '▶ Continuar' : '⏸ Pausar';
    });
}

if (imageModal) {
    imageModal.addEventListener('click', (event) => {
        if (event.target === imageModal) {
            closeImageModal();
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && imageModal?.classList.contains('active')) {
        closeImageModal();
    }
});

// ====== Navbar Background on Scroll ======
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// ====== Efeito Paralax ======
window.addEventListener('scroll', () => {
    const floatingBox = document.querySelector('.floating-box');
    if (floatingBox) {
        floatingBox.style.transform = `translateY(${window.scrollY * 0.5}px)`;
    }
});

// ====== Contador animado ======
const animateCounter = (element, target, duration = 2000) => {
    if (element.__counterFrame) {
        cancelAnimationFrame(element.__counterFrame);
    }

    const startTime = performance.now();

    const step = (timestamp) => {
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentValue = Math.floor(progress * target);
        element.textContent = `${currentValue}`;

        if (progress < 1) {
            element.__counterFrame = requestAnimationFrame(step);
        } else {
            element.textContent = `${target}`;
            element.__counterFrame = null;
        }
    };

    element.textContent = '0';
    element.__counterFrame = requestAnimationFrame(step);
};

// Observer para ativar contadores
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValue = entry.target.querySelector('.stat-value');
            const target = parseInt(statValue?.dataset.count || '0', 10);

            if (statValue) {
                animateCounter(statValue, target);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    counterObserver.observe(stat);
});

const highlightCounterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            const number = entry.target.querySelector('.highlight-number');
            const target = parseInt(number?.dataset.count || '0', 10);

            if (number) {
                animateCounter(number, target);
            }
        }
    });
}, { threshold: 0.35 });

document.querySelectorAll('.highlight-card').forEach(card => {
    highlightCounterObserver.observe(card);
});

// ====== Validação de Email ======
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ====== Efeito de digitação ======
const typeWriter = (element, text, speed = 100) => {
    let index = 0;
    element.textContent = '';
    
    const type = () => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    };
    
    type();
};

// Aplicar efeito de digitação no título
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});

// ====== Scroll para seções ======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ====== Efeito Ripple em botões ======
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ====== Dark Mode Toggle (Opcional) ======
const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
};

// Check if dark mode was previously enabled
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// ====== Dados dos Projetos (para futura integração com API) ======
const projects = [
    {
        id: 1,
        title: 'Projeto 1',
        description: 'Uma aplicação web de e-commerce desenvolvida com React e Node.js',
        technologies: ['React', 'Node.js', 'MongoDB'],
        link: '#'
    },
    {
        id: 2,
        title: 'Projeto 2',
        description: 'App mobile de controle de gastos pessoais',
        technologies: ['React Native', 'Firebase', 'Charts'],
        link: '#'
    },
    {
        id: 3,
        title: 'Projeto 3',
        description: 'Dashboard de análise de dados com visualizações interativas',
        technologies: ['Vue.js', 'D3.js', 'Python'],
        link: '#'
    }
];

// ====== Dados de Habilidades ======
const skills = [
    {
        category: 'Frontend',
        icon: 'fab fa-html5',
        technologies: 'HTML,CSS e JavaScript'
    },
    {
        category: 'Backend',
        icon: 'fab fa-python',
        technologies: 'Python e Java'
    },
    {
        category: 'Banco de Dados',
        icon: 'fas fa-database',
        technologies: 'MySQL'
    },
    {
        category: 'Software',
        icon: 'fas fa-laptop-code',
        technologies: 'Windows,kali linux e linux'
    },
    {
        category: 'Conhecimentos',
        icon: 'fas fa-paint-brush',
        technologies: 'Frameworks de Gestão de T.I ITIL e COBIT,Gerenciamento de Projetos,Infraestrutura de T.I,Segurança da Informação,Análise de Requisitos,Desenvolvimento de projetos de TI e Análise de processos de tecnologia'
    },
    {
        category: 'Ferramentas',
        icon: 'fab fa-git',
        technologies: 'VS Code,Excel,Canva,Google Sites,Drawio,Project Libre,Cisco Packet Tracer,Power BI,Figma,Virtualbox.'
    },
    {
        category: 'Metodologias',
        icon: 'fas fa-cogs',
        technologies: 'Scrum, Kanban,melhoria continua,Metodologias Ágeis.'
    }
];

// ====== Log de inicialização ======
console.log('%cPortfólio carregado com sucesso! 🚀', 'color: #6366f1; font-size: 14px; font-weight: bold;');
console.log('%cObrigado por visitar meu portfólio.', 'color: #ec4899; font-size: 12px;');
