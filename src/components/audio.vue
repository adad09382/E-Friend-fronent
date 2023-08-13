<template>
  <!-- 音訊播放器的主容器 -->
  <div class="audio-player">
    <!-- 時間軸容器 -->
    <div class="timeline">
      <!-- 表示播放進度的區塊 -->
      <div class="progress"></div>
    </div>
    <!-- 控制區域 -->
    <div class="controls">
      <div class="play-container">
        <!-- 播放/暫停按鈕 -->
        <div class="toggle-play play"></div>
      </div>
      <!-- 顯示目前時間和音訊總長度 -->
      <div class="time">
        <div class="current">0:00</div>
        <div class="divider">/</div>
        <div class="length"></div>
      </div>
      <!-- 音樂名稱 -->
      <div class="name">Music Song</div>
      <!-- 音量控制區塊 -->
      <div class="volume-container">
        <div class="volume-button">
          <!-- 音量圖示 -->
          <v-icon></v-icon>
          <div class="volume mdi-volumeMedium"></div>
        </div>
        <!-- 音量滑動條 -->
        <div class="volume-slider">
          <!-- 表示當前音量的區塊 -->
          <div class="volume-percentage"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ==============刻出來的audio==================

const audioPlayer = document.querySelector(".audio-player");
// 創建一個新的音訊對象並指定音訊源
const audio = new Audio(
  "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/backsound.mp3",
);
//credit for song: Adrian kreativaweb@gmail.com

console.dir(audio);

// 當音訊加載時，更新總時長和設置音量
audio.addEventListener(
  "loadeddata",
  () => {
    audioPlayer.querySelector(".time .length").textContent = getTimeCodeFromNum(
      audio.duration,
    );
    audio.volume = 0.75;
  },
  false,
);

// 點擊時間軸以跳到指定時間
//click on timeline to skip around
const timeline = audioPlayer.querySelector(".timeline");
timeline.addEventListener(
  "click",
  (e) => {
    const timelineWidth = window.getComputedStyle(timeline).width;
    const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * audio.duration;
    audio.currentTime = timeToSeek;
  },
  false,
);

// 點擊音量滑動條以改變音量
//click volume slider to change volume
const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
volumeSlider.addEventListener(
  "click",
  (e) => {
    const sliderWidth = window.getComputedStyle(volumeSlider).width;
    const newVolume = e.offsetX / parseInt(sliderWidth);
    audio.volume = newVolume;
    audioPlayer.querySelector(".controls .volume-percentage").style.width =
      newVolume * 100 + "%";
  },
  false,
);

// 設置一個定時器以定期更新播放進度和當前時間
//check audio percentage and update time accordingly
setInterval(() => {
  const progressBar = audioPlayer.querySelector(".progress");
  progressBar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
  audioPlayer.querySelector(".time .current").textContent = getTimeCodeFromNum(
    audio.currentTime,
  );
}, 500);

// 點擊播放/暫停按鈕以切換播放狀態
//toggle between playing and pausing on button click
const playBtn = audioPlayer.querySelector(".controls .toggle-play");
playBtn.addEventListener(
  "click",
  () => {
    if (audio.paused) {
      playBtn.classList.remove("play");
      playBtn.classList.add("pause");
      audio.play();
    } else {
      playBtn.classList.remove("pause");
      playBtn.classList.add("play");
      audio.pause();
    }
  },
  false,
);
// 點擊音量按鈕以靜音或取消靜音
audioPlayer.querySelector(".volume-button").addEventListener("click", () => {
  const volumeEl = audioPlayer.querySelector(".volume-container .volume");
  audio.muted = !audio.muted;
  if (audio.muted) {
    volumeEl.classList.remove("icono-volumeMedium");
    volumeEl.classList.add("icono-volumeMute");
  } else {
    volumeEl.classList.add("icono-volumeMedium");
    volumeEl.classList.remove("icono-volumeMute");
  }
});
// 將秒數轉換為時分秒格式的函數
//turn 128 seconds into 2:08
function getTimeCodeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;

  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(
    seconds % 60,
  ).padStart(2, 0)}`;
}

const playAiResponse = () => {
  // 先判斷是否合成播放狀態
  if (playingState.value === speechSynthesisState.start) {
    console.log("暫停合成");
    synth.pause();
  } else if (playingState.value === speechSynthesisState.pause) {
    console.log("恢復合成");
    synth.resume();
  } else if (playingState.value === speechSynthesisState.end) {
    console.log("製作合成並撥放");
    // 創建語音合成檔案 Object
    const toSpeak = new SpeechSynthesisUtterance();
    // 被語音合成內容設定
    toSpeak.text = props.chat.content; // 將傳進來的props 中的chat object content 輸入為合成內容
    toSpeak.lang = "en-US"; // 設定合成語言
    toSpeak.voice = voice; // 設定合成語音
    toSpeak.rate = 1.5; // 設置語速，0.1（最慢）到 10（最快）
    toSpeak.pitch = 1; // 設置音高， 0（最低）到 2（最高）
    toSpeak.volume = 0.8; // 設置音量，0（靜音）到 1（最大音量）
    // 開始合成將合成狀態設為 start
    toSpeak.onstart = () => {
      playingState.value = speechSynthesisState.start;
    };
    // 恢復合成將合成狀態設為 start
    speechSynthesis.onresume = () => {
      playingState.value = speechSynthesisState.start;
    };
    // 結束合成將合成狀態設為 end
    toSpeak.onend = () => {
      playingState.value = speechSynthesisState.end;
    };
    // 暫停合成將合成狀態設為 pause
    speechSynthesis.onpause = () => {
      playingState.value = speechSynthesisState.pause;
    };

    // 開始語音合成並撥放
    synth.speak(toSpeak);
    console.log(playingState.value);
  }
};
</script>

<style scoped>
/*  刻出來的 audio */
/* 定義音訊播放器的外觀，如大小、背景顏色和其他樣式 */
.audio-player {
  height: 50px;
  width: 350px;
  background: #444;
  box-shadow: 0 0 20px 0 #000a;
  font-family: arial;
  color: white;
  font-size: 0.75em;
  overflow: hidden;
  display: grid;
  grid-template-rows: 6px auto;
}
/* 定義播放時間軸和進度條的樣式 */
.audio-player .timeline {
  background: white;
  width: 100%;
  position: relative;
  cursor: pointer;
  box-shadow: 0 2px 10px 0 #0008;
}
.audio-player .timeline .progress {
  background: coral;
  width: 0%;
  height: 100%;
  transition: 0.25s;
}
/* 定義控制面板區域的樣式 */
.audio-player .controls {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 0 20px;
}
/* 定義播放和暫停按鈕的樣式 */
.audio-player .controls > * {
  display: flex;
  justify-content: center;
  align-items: center;
}
.audio-player .controls .toggle-play.play {
  cursor: pointer;
  position: relative;
  left: 0;
  height: 0;
  width: 0;
  border: 7px solid #0000;
  border-left: 13px solid white;
}
.audio-player .controls .toggle-play.play:hover {
  transform: scale(1.1);
}
.audio-player .controls .toggle-play.pause {
  height: 15px;
  width: 20px;
  cursor: pointer;
  position: relative;
}
.audio-player .controls .toggle-play.pause:before {
  position: absolute;
  top: 0;
  left: 0px;
  background: white;
  content: "";
  height: 15px;
  width: 3px;
}
.audio-player .controls .toggle-play.pause:after {
  position: absolute;
  top: 0;
  right: 8px;
  background: white;
  content: "";
  height: 15px;
  width: 3px;
}
.audio-player .controls .toggle-play.pause:hover {
  transform: scale(1.1);
}
/* 目前播放時間與音訊總長CSS */
.audio-player .controls .time {
  display: flex;
}
.audio-player .controls .time > * {
  padding: 2px;
}

/* 定義音量的CSS */
.audio-player .controls .volume-container {
  cursor: pointer;
  position: relative;
  z-index: 2;
}
.audio-player .controls .volume-container .volume-button {
  height: 26px;
  display: flex;
  align-items: center;
}
.audio-player .controls .volume-container .volume-button .volume {
  transform: scale(0.7);
}
.audio-player .controls .volume-container .volume-slider {
  position: absolute;
  left: -3px;
  top: 15px;
  z-index: -1;
  width: 0;
  height: 15px;
  background: white;
  box-shadow: 0 0 20px #000a;
  transition: 0.25s;
}
.audio-player .controls .volume-container .volume-slider .volume-percentage {
  background: coral;
  height: 100%;
  width: 75%;
}
.audio-player .controls .volume-container:hover .volume-slider {
  left: -123px;
  width: 120px;
}
</style>
