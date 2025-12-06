const pads = document.querySelectorAll('.pad');
const body = document.body;
const volumeSlider = document.querySelector('#volume');
const volumeValue = document.querySelector('#volumeValue');
const muteBtn = document.querySelector('#muteBtn');

const audioMap = {};

let currentAudio = null;
let isMuted = false;
let lastVolume = 0.8;

pads.forEach(function(pad){
    const audioSrc = pad.getAttribute("data-src");
    const audio = new Audio(audioSrc);
    audioMap[audioSrc] = audio;
    audio.volume = lastVolume;
    audio.preload = 'auto'; 
});

pads.forEach(function(pad){
    pad.addEventListener('click', function(){
        
        if(currentAudio !== null){
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        currentAudio = audioMap[pad.getAttribute("data-src")];

        if(isMuted){
            currentAudio.volume = 0;
        } else {
            currentAudio.volume = lastVolume;
        }

        currentAudio.play();

        const genreClass = pad.getAttribute('data-genre');
        body.classList.forEach(function(cls){
            if(cls.startsWith('theme-')){
                body.classList.remove(cls);
            }
        });
        body.classList.add(genreClass);

        pads.forEach(p => p.classList.remove("active"));
        pad.classList.add("active");

        setTimeout(() => {
            pad.classList.remove("active");
        }, 500);

    });
});
 
volumeSlider.addEventListener('input', function(){
    lastVolume = volumeSlider.value / 100;
    volumeValue.textContent = volumeSlider.value + "%";

    if(currentAudio && !isMuted){
        currentAudio.volume = lastVolume;
    }

    Object.values(audioMap).forEach(audio => {
        if (!isMuted) {
            audio.volume = lastVolume;
        }
    });
});

muteBtn.addEventListener('click', function(){

    if(!isMuted){
        isMuted = true;
        muteBtn.setAttribute('aria-pressed', 'true');
        muteBtn.textContent = "🔈 muted";

        Object.values(audioMap).forEach(audio => {
            audio.volume = 0;
        });

    } else {
        isMuted = false;
        muteBtn.setAttribute('aria-pressed', 'false');
        muteBtn.textContent = "🔊 unmuted";

        Object.values(audioMap).forEach(audio => {
            audio.volume = lastVolume;
        });
    }

});