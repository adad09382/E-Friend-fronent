<template>
  <div class="chat" ref="currentMessage">
    <!-- 如果chat.role === 'assistant' 為 false，顯示用户的訊息 -->
    <template v-if="chat.role !== 'assistant'">
      <div class="message" style="text-align: end">
        <template v-if="chat?.audioLink">
          <audio :src="chat?.audioLink" controls></audio>
        </template>
        <div class="audio-text">
          <span v-show="!active"> {{ chat.content }} </span>
          <button class="btn" @click="active = !active">文</button>
        </div>
      </div>
      <div class="profile">
        <!-- 根據chat.role === 'assistant' 的值顯示不同的頭貼圖片 -->
        <img src="@/assets/user.svg" alt="" />
      </div>
    </template>
    <!-- 如果chat.role === 'assistant' 為 true，顯示AI回覆的的訊息 -->
    <template v-else>
      <div class="profile" style="background-color: #19c37d">
        <img src="@/assets/bot.svg" alt="" />
      </div>
      <div class="message">
        <!-- 音訊播放器的主容器 -->
        <div class="audio-player" ref="audioPlayer">
          <!-- 控制區域 -->
          <div class="controls">
            <div class="play-container">
              <!-- 播放/暫停按鈕 -->
              <v-icon
                @click="throttledPlayAiResponse"
                :icon="
                  playingState === speechSynthesisState.start
                    ? 'mdi-pause'
                    : 'mdi-play'
                "
                size="x-large"
              ></v-icon>
            </div>
            <!-- 顯示目前時間和音訊總長度 -->
            <div class="time">
              <div class="current">0:00</div>
              <div class="divider">/</div>
              <div class="length">{{ duration }}</div>
            </div>
            <!-- 音量控制區塊 -->
            <div class="volume-container">
              <div class="volume-button">
                <!-- 音量圖示 -->
                <v-icon
                  class="volume"
                  icon="mdi-volume-high"
                  size="x-large"
                ></v-icon>
              </div>
              <!-- 音量滑動條 -->
              <div class="volume-slider">
                <!-- 表示當前音量的區塊 -->
                <div class="volume-percentage"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="audio-text">
          <button class="bot-btn" @click="active = !active">文</button>
          <span v-show="!active"> {{ chat.content }} </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, reactive, defineProps, watch } from "vue";
// 定義 chat 屬性，是一個物件(Object)
const props = defineProps({
  chat: Object,
});
// currentMessage 用於獲取 DOM 元素
const currentMessage = ref(null);
const btn = ref(null);

const active = ref(false);

// 在组件掛載後，scroll 到最新的消息
onMounted(async () => {
  await nextTick();
  const div = currentMessage.value;
  div.scrollIntoView({ behavior: "smooth" });
});

function click() {
  console.log("按了icon");
}

// ==============刻出來的audio==================

// 獲取整個audioPlay element
const audioPlayer = ref(null);
const playButton = ref(null);

// 點擊音量滑動條以改變音量
//click volume slider to change volume
// const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
// volumeSlider.addEventListener(
//   "click",
//   (e) => {
//     const sliderWidth = window.getComputedStyle(volumeSlider).width;
//     const newVolume = e.offsetX / parseInt(sliderWidth);
//     audio.volume = newVolume;
//     audioPlayer.querySelector(".controls .volume-percentage").style.width =
//       newVolume * 100 + "%";
//   },
//   false,
// );

// ============== 語音合成Function ==================
// 創建語音合成撥放器Object
const synth = window.speechSynthesis;
// 儲存可用voices 列表
let voices = [];
let voice = null; // 定義一個全局的 voice 變量
synth.onvoiceschanged = function () {
  voices = synth.getVoices();
  // 這裡確保你在語音已載入後再進行語音查找
  voice = voices.find(
    (voice) => voice.name === "Microsoft Zira - English (United States)",
  );
};

// 語音合成狀態
const speechSynthesisState = reactive({
  start: "0",
  end: "1",
  pause: "2",
  resume: "3",
});
// 目前語音合成狀態
const playingState = ref(speechSynthesisState.end);
// 監聽 Speak 按鈕的點擊事件
// 合成並撥放語音
const playAiResponse = () => {
  // 先判斷是否合成播放狀態
  if (playingState.value === speechSynthesisState.start) {
    console.log("暫停合成");
    synth.pause();
  } else if (playingState.value === speechSynthesisState.pause) {
    console.log("恢復合成");
    synth.resume();
  } else if (playingState.value === speechSynthesisState.end) {
    // 若已有合成在序列中，取消前一個序列
    if (synth.speaking || playingState.value === speechSynthesisState.pause) {
      console.log("已有語音合成物件在序列中，取消前一序列");
      synth.cancel();
      playingState.value = speechSynthesisState.end; // 將狀態重設為結束
    }
    console.log("製作合成並撥放");
    // 紀錄個別錄音檔案總時長
    let startTime = null; // 記錄開始時間
    let pausedTime = null; // 記錄暫停時間
    let totalPausedDuration = 0; // 記錄暫停的總時間
    let endTime = null; // 記錄結束時間
    // 創建語音合成檔案 Object
    const toSpeak = new SpeechSynthesisUtterance();
    // 被語音合成內容設定
    toSpeak.text = props.chat.content; // 將傳進來的props 中的chat object content 輸入為合成內容
    toSpeak.lang = "en-US"; // 設定合成語言
    toSpeak.voice = voice; // 設定合成語音
    toSpeak.rate = 1.5; // 設置語速，0.1（最慢）到 10（最快）
    toSpeak.pitch = 1; // 設置音高， 0（最低）到 2（最高）
    toSpeak.volume = 0.8; // 設置音量，0（靜音）到 1（最大音量）

    // start合成將合成狀態設為 start
    toSpeak.onstart = () => {
      console.log("觸發 start 事件");
      startTime = Date.now(); // 設定當前時間為開始時間
      playingState.value = speechSynthesisState.start;
    };
    // resume合成將合成狀態設為 start
    toSpeak.onresume = () => {
      console.log("觸發resume 事件");
      if (pausedTime) {
        totalPausedDuration += Date.now() - pausedTime; // 更新暫停總時間
        pausedTime = null; // 重置暫停時間
      }
      playingState.value = speechSynthesisState.start;
    };
    // end合成將合成狀態設為 end
    toSpeak.onend = () => {
      console.log("觸發 end 事件");
      endTime = Date.now(); // 設定當前時間為結束時間
      const duration = ref(
        formaTime(endTime - startTime - totalPausedDuration),
      ); // 計算實際播放時間
      playingState.value = speechSynthesisState.end;
    };
    // pause合成將合成狀態設為 pause
    toSpeak.onpause = () => {
      console.log("觸發 pause 事件");
      pausedTime = Date.now(); // 記錄當前時間為暫停時間

      playingState.value = speechSynthesisState.pause;
    };
    // 合成出現錯誤時將合成狀態設為 end，並取消合成
    toSpeak.onerror = (error) => {
      console.log("語音合成出錯:", error);
      playingState.value = speechSynthesisState.end;
      synth.cancel();
    };

    // 若已有合成在序列中，取消前一個序列
    if (synth.speaking) {
      synth.cancel();
    }
    // 開始語音合成並撥放
    setTimeout(() => {
      synth.speak(toSpeak);
    }, 200); // 增加 100 毫秒的延遲，您可以根據情況調整
  }
};

// 將PlayAiResponse 包進節流函式中
const throttledPlayAiResponse = throttle(playAiResponse, 500);

// ================ throttle節流函式 =================
function throttle(func, delay) {
  let lastFunc;
  let lastRan;
  return function (...args) {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        function () {
          if (Date.now() - lastRan >= delay) {
            func(...args);
            lastRan = Date.now();
          }
        },
        delay - (Date.now() - lastRan),
      );
    }
  };
}
// ================ 毫秒/時間格式化函式 =================

function formaTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
</script>

<style scoped>
.wrapper {
  width: 100%;
  padding: 15px;
}
.ai {
  background: #5436da;
}
.chat {
  width: 100%;
  max-width: 1280px;
  margin: 1rem auto;

  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
}

.profile {
  width: 36px;
  height: 36px;
  border-radius: 5px;

  background: #5436da;

  display: flex;
  justify-content: center;
  align-items: center;
}

.ai .profile {
  background: #10a37f;
}

.profile img {
  width: 60%;
  height: 60%;
  object-fit: contain;
}

.message {
  flex: 1;
  color: #000;
  font-size: 1rem;
  max-width: 100%;
  overflow-x: scroll;
  white-space: pre-wrap;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.message::-webkit-scrollbar {
  display: none;
}

.audio-text {
  margin-top: 0.25rem;
}
.btn {
  margin-left: 1rem;
  font-size: 0.25rem;
  padding: 0.05rem 0.25rem;
  border: 1px solid black;
  border-radius: 80%;
}

.bot-btn {
  margin-right: 1rem;
  font-size: 0.25rem;
  padding: 0.05rem 0.25rem;
  border: 1px solid black;
  border-radius: 80%;
}

/*  刻出來的 audio */
/* 定義音訊播放器的外觀，如大小、背景顏色和其他樣式 */
.audio-player {
  height: 50px;
  width: 300px;
  background: #f1f3f4;
  font-family: arial;
  color: #000;
  font-size: 0.75em;
  overflow: hidden;
  display: grid;
  grid-template-rows: 6px auto;
  border-radius: 1.5rem;
}
/* 定義控制面板區域的樣式 */
.audio-player .controls {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin-top: 1.5rem;
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
  border-left: 13px solid black;
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
  padding-right: 10rem;
  justify-content: start;
  color: red;
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
  top: -8px;
  z-index: -1;
  width: 0;
  height: 15px;
  background: white;
  transition: 0.25s;
}
.audio-player .controls .volume-container .volume-slider .volume-percentage {
  background: #545555;
  height: 100%;
  width: 75%;
}
.audio-player .controls .volume-container:hover .volume-slider {
  left: -123px;
  width: 120px;
}
</style>
