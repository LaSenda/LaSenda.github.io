// script.js

// Ocultar/mostrar la barra de navegación al hacer scroll 
const navbar = document.querySelector('.navbar');
const navbarHeight = navbar.offsetHeight; // Obtiene la altura real de la barra

let lastScrollTop = 0;

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Si el scroll baja Y la barra está visible, la ocultamos.
    if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
        navbar.style.top = `-${navbarHeight}px`;
    } 
    // Si el scroll sube O el usuario está arriba del todo, la mostramos.
    else if (scrollTop < lastScrollTop || scrollTop <= 0) {
        navbar.style.top = "0";
    }

    lastScrollTop = scrollTop;
});

// Cambiar el texto de amor aleatoriamente al cargar la página
window.addEventListener('load', () => {
    const loveTexts = [
        "Te quiero ❤️",
        "I love you ❤️",
        "我爱你 ❤️",
        "Je t'aime ❤️",
        "Ti amo ❤️",
        "愛してる ❤️",
        "사랑해 ❤️",
        "Я тебя люблю ❤️",
        "أحبك ❤️",
        "Ich liebe dich ❤️",
        "Eu te amo ❤️",
        "Ik hou van jou ❤️",
        "Szeretlek ❤️",
        "Te iubesc ❤️",
        "Jeg elsker dig ❤️",
        "Aš tave myliu ❤️",
        "Mahal kita ❤️",
        "Kocham cię ❤️",
        "Σ'αγαπώ ❤️",
        "Ma armastan sind ❤️",
        "Seni seviyorum ❤️",
        "मैं तुमसे प्यार करता हूँ ❤️",
        "मैं तुमसे प्यार करती हूँ ❤️",
        "Ana behibek ❤️",
        "Ngiyakuthanda ❤️",
        "Nakupenda ❤️",
        "Anh yêu em ❤️",
        "Em yêu anh ❤️"
    ];

    const randomIndex = Math.floor(Math.random() * loveTexts.length);
    document.getElementById('love-text').textContent = loveTexts[randomIndex];
}); // ← ESTE BRACKET FALTABA

/*
// Todo el código del video fog comentado
document.addEventListener('DOMContentLoaded', () => {
  const vid = document.getElementById('fog-video');
  if (!vid) return;

  vid.addEventListener('canplay', () => {
    vid.play();
    vid.playbackRate = 0.1;     
    vid.style.filter = 'blur(1px) opacity(0.3)';
    vid.style.transition = 'opacity 3s ease-in-out';

    let aumentando = true;
    setInterval(() => {
      vid.style.opacity = aumentando ? '0.8' : '0.5';
      aumentando = !aumentando;
    }, 10000);
  });
});

const video = document.getElementById('fog-video');
video.playbackRate = 0.5;
*/
// ============================= 
// VIDEO DE NIEBLA ALEATORIO CON DURACIÓN LIMITADA Y TRANSICIÓN GRADUAL
// =============================

const videoSources = [
    'Assets/img/gif,videos/stockvideo_01055.mp4'
];

const minTime = 180000;  // 3 minutos
const maxTime = 480000;  // 8 minutos

// Duración corta: 15 segundos
const fogDuration = 15000;

function getRandomTime() {
    return Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
}

function changeVideoRandom() {
    const video = document.getElementById('bg-video');
    if (!video) return;
    
    const randomVideo = videoSources[Math.floor(Math.random() * videoSources.length)];
    
    // Transición suave de entrada
    video.style.opacity = '0';
    
    setTimeout(() => {
        video.src = randomVideo;
        video.load();
        video.onloadeddata = () => {
            video.style.transition = 'opacity 2s ease-in';
            video.style.opacity = '0.4';
            video.play();
            
            // Terminar con transición gradual suave
            setTimeout(() => {
                // Transición suave de salida
                video.style.transition = 'opacity 3s ease-out';
                video.style.opacity = '0';
                
                // Pausar después de la transición
                setTimeout(() => {
                    video.pause();
                    video.style.transition = '';
                    console.log('Niebla terminada con transición suave');
                }, 3000);
                
            }, fogDuration - 3000); // Resta 3 segundos para la transición de salida
        };
    }, 500);
    
    const nextTime = getRandomTime();
    console.log(`Próxima niebla en ${Math.round(nextTime/60000)} minutos por ${fogDuration/1000} segundos`);
    setTimeout(changeVideoRandom, nextTime);
}

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('bg-video');
    if (video) {
        // Asegurar que el video empiece invisible y sin fuente
        video.style.opacity = '0';
        video.src = '';
        
        const firstTime = getRandomTime();
        console.log(`Primera niebla aparecerá en ${Math.round(firstTime/60000)} minutos por ${fogDuration/1000} segundos`);
        setTimeout(changeVideoRandom, firstTime);
        
        console.log('Sistema de niebla iniciado - esperando...');
    }
});

