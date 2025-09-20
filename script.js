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
});