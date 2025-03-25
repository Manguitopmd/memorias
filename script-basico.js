// Control de música de fondo
const audio = document.getElementById('backgroundMusic');
audio.volume = 0.5;

// Intentar reproducir el audio automáticamente al cargar la página
function tryAutoPlay() {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log("Audio reproduciéndose automáticamente.");
            })
            .catch(error => {
                console.log("Autoplay bloqueado por el navegador: ", error);
                // Intentar de nuevo tras un retraso
                setTimeout(() => {
                    audio.play().catch(err => {
                        console.log("Segundo intento fallido: ", err);
                        // Tercer intento tras interacción mínima
                        document.addEventListener('click', function playOnInteraction() {
                            audio.play().then(() => {
                                console.log("Audio iniciado tras interacción del usuario.");
                            }).catch(e => {
                                console.log("Fallo tras interacción: ", e);
                            });
                            document.removeEventListener('click', playOnInteraction);
                        }, { once: true });
                    });
                }, 1000);
            });
    }
}

window.addEventListener('DOMContentLoaded', tryAutoPlay);

// Botón para pausar/reproducir manualmente
const toggleButton = document.getElementById('toggleMusic');
toggleButton.addEventListener('click', () => {
    if (audio.paused) {
        audio.play().then(() => {
            toggleButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        }).catch(err => {
            console.log("Error al reproducir manualmente: ", err);
        });
    } else {
        audio.pause();
        toggleButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
});

// Inicializar AOS
AOS.init({ duration: 1000, once: true });

// Animación de Recuerdos Principales
const slides = document.querySelectorAll('.memory-slide');
let currentSlide = 0;

function getRandomRotation() {
    const maxAngle = 5;
    return (Math.random() * maxAngle * 2) - maxAngle;
}

function showNextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    const polaroid = slides[currentSlide].querySelector('.polaroid');
    polaroid.style.transform = `rotate(${getRandomRotation()}deg)`;
    slides[currentSlide].classList.add('active');
}

const firstPolaroid = slides[currentSlide].querySelector('.polaroid');
firstPolaroid.style.transform = `rotate(${getRandomRotation()}deg)`;
slides[currentSlide].classList.add('active');
setInterval(showNextSlide, 4000);

// Animación de Palabras del Corazón
const messages = document.querySelectorAll('.heart-message');
let currentMessage = 0;

function showNextMessage() {
    messages[currentMessage].classList.remove('active');
    currentMessage = (currentMessage + 1) % messages.length;
    messages[currentMessage].classList.add('active');
}

messages[currentMessage].classList.add('active');
setInterval(showNextMessage, 8000);