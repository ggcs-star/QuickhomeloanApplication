let currentAudio = null;

export const playAudio = async (url) => {
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(url);
    await audio.play();

    currentAudio = audio;

    setupMediaSession(audio);

    return audio;
  } catch (err) {
    console.log("Audio error:", err);
  }
};

export const pauseAudio = () => {
  if (currentAudio) currentAudio.pause();
};

export const stopAudio = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};