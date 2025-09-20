// Ocultar/mostrar la barra de navegación al hacer scroll
//
// Mejoras:
// - Usa una variable para la altura de la navbar, así no tienes que cambiar el valor en dos sitios
// - Usa un "dataset" o una clase para el estado de la navbar, que es una práctica más moderna y limpia que manipular el estilo directamente.
// - Controla el tamaño de la navbar dinámicamente.

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

// Mostrar mensaje de amor aleatorio
//
// Mejoras:
// - Eliminar los prefijos de traducción si no se usan
// - Mejorar la sintaxis para que sea más clara

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

    document.addEventListener('DOMContentLoaded', () => {
  const vid = document.getElementById('fog-video');
  if (!vid) return;

  vid.addEventListener('canplay', () => {
    // Arranca la reproducción y ajusta velocidad y estilo
    vid.play();
    vid.playbackRate = 0.1;     
    vid.style.filter = 'blur(1px) opacity(0.3)';
    vid.style.transition = 'opacity 3s ease-in-out';

    // Efecto de respiración: alterna opacidad cada 10 segundos
    let aumentando = true;
    setInterval(() => {
      vid.style.opacity = aumentando ? '0.8' : '0.5';
      aumentando = !aumentando;
    }, 10000);
  });
});
});



    // Selecciona el elemento de video por su ID
    const video = document.getElementById('fog-video');

    // Cambia la velocidad de reproducción.
    // 0.5 = 50% de la velocidad normal (la mitad de lento).
    // 0.25 = 25% de la velocidad normal (muy lento).
    video.playbackRate = 0.5; // Cambia este valor para ajustar la velocidad
