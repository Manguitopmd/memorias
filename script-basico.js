// Control de música de fondo
const audio = document.getElementById('backgroundMusic');
audio.volume = 0.5;

function tryAutoPlay() {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise
            .then(() => console.log("Audio reproduciéndose automáticamente."))
            .catch(error => {
                console.log("Autoplay bloqueado: ", error);
                setTimeout(() => {
                    audio.play().catch(err => {
                        console.log("Segundo intento fallido: ", err);
                        document.addEventListener('click', function playOnInteraction() {
                            audio.play().then(() => console.log("Audio iniciado tras interacción.")).catch(e => console.log("Fallo tras interacción: ", e));
                            document.removeEventListener('click', playOnInteraction);
                        }, { once: true });
                    });
                }, 1000);
            });
    }
}

window.addEventListener('DOMContentLoaded', tryAutoPlay);

const toggleButton = document.getElementById('toggleMusic');
toggleButton.addEventListener('click', () => {
    if (audio.paused) {
        audio.play().then(() => toggleButton.innerHTML = '<i class="fas fa-volume-up"></i>').catch(err => console.log("Error al reproducir: ", err));
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

// Animación y controles de Mi Historia
const chapters = document.querySelectorAll('.history-chapter');
let currentChapter = 0;

function showChapter(index) {
    chapters.forEach(ch => ch.classList.remove('active'));
    chapters[index].classList.add('active');
    currentChapter = index;

    const prevButton = document.getElementById('prevChapter');
    const nextButton = document.getElementById('nextChapter');
    prevButton.disabled = currentChapter === 0;
    nextButton.disabled = currentChapter === chapters.length - 1;
}

const prevChapterButton = document.getElementById('prevChapter');
const nextChapterButton = document.getElementById('nextChapter');

prevChapterButton.addEventListener('click', () => {
    if (currentChapter > 0) {
        currentChapter--;
        showChapter(currentChapter);
    }
});

nextChapterButton.addEventListener('click', () => {
    if (currentChapter < chapters.length - 1) {
        currentChapter++;
        showChapter(currentChapter);
    }
});

showChapter(currentChapter);

// Animación de Palabras del Corazón con fade
const messages = document.querySelectorAll('.heart-message');
const messageContainer = document.getElementById('mensaje-container');
let currentMessage = 0;

function setContainerHeight() {
    let maxHeight = 0;
    messages.forEach(message => {
        const originalStyle = message.style.cssText;
        message.style.opacity = '1';
        message.style.position = 'static';
        const height = message.offsetHeight;
        if (height > maxHeight) maxHeight = height;
        message.style.cssText = originalStyle;
    });
    messageContainer.style.height = `${maxHeight + 32}px`; // +32px por el padding
}

setContainerHeight();
messages[currentMessage].classList.add('active');

function showNextMessage() {
    messages[currentMessage].classList.remove('active');
    
    setTimeout(() => {
        currentMessage = (currentMessage + 1) % messages.length;
        messages[currentMessage].classList.add('active');
    }, 1000);
}

setInterval(showNextMessage, 8000);

// Tiempo desde el fallecimiento
const deathDate = new Date('2023-03-24'); // Fecha de ejemplo, cámbiala por la real
const timeSinceElement = document.getElementById('time-since');

function updateTimeSince() {
    const now = new Date();
    const diff = now - deathDate;
    
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
    
    let timeString = '';
    if (years > 0) timeString += `${years} año${years > 1 ? 's' : ''} `;
    if (months > 0) timeString += `${months} mes${months > 1 ? 'es' : ''} `;
    if (days > 0 || timeString === '') timeString += `${days} día${days > 1 ? 's' : ''}`;
    
    timeSinceElement.textContent = `Han pasado ${timeString} desde tu partida.`;
}

updateTimeSince();
setInterval(updateTimeSince, 86400000);

// Control del reproductor de "Mi Canción Favorita"
const favoriteSong = document.getElementById('favoriteSong');
const playFavoriteButton = document.getElementById('playFavoriteSong');
let isPlaying = false;

playFavoriteButton.addEventListener('click', () => {
    if (!isPlaying) {
        favoriteSong.play().then(() => {
            audio.pause(); // Pausar la música de fondo
            playFavoriteButton.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        }).catch(err => console.log("Error al reproducir canción favorita: ", err));
    } else {
        favoriteSong.pause();
        playFavoriteButton.innerHTML = '<i class="fas fa-play"></i>';
        isPlaying = false;
        if (!audio.paused) audio.play().catch(err => console.log("Error al reanudar fondo: ", err));
    }
});

favoriteSong.addEventListener('ended', () => {
    playFavoriteButton.innerHTML = '<i class="fas fa-play"></i>';
    isPlaying = false;
    audio.play().catch(err => console.log("Error al reanudar fondo tras fin: ", err));
});