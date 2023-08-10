<template>
  <div>
    <div v-if="!isSupported">
      Your browser does not support SpeechRecognition API,
      <a href="https://caniuse.com/mdn-api_speechrecognition" target="_blank"
        >more details</a
      >
    </div>
    <div v-else>
      <div space-x-4>
        <label class="radio">
          <input v-model="lang" value="en-US" type="radio" />
          <span>English (US)</span>
        </label>
        <label class="radio">
          <input v-model="lang" value="zh-TW" type="radio" />
          <span>Mandarin (TW)</span>
        </label>
        <label class="radio">
          <input v-model="lang" value="fr" type="radio" />
          <span>French</span>
        </label>
        <label class="radio">
          <input v-model="lang" value="es" type="radio" />
          <span>Spanish</span>
        </label>
      </div>
      <p>{{ isListening }}</p>
      <v-btn v-if="!isListening" color="green" @click="startRecord"
        >Press and talk</v-btn
      >
      <v-btn v-if="isListening" color="red" @click="endRecord">Stop</v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useSpeechRecognition } from "@vueuse/core";

const lang = ref("zh-TW");

const speech = useSpeechRecognition({
  lang: lang.value,
  interimResults: true,
  continuous: true,
});
const { isSupported, isListening, isFinal, result } = speech;

if (speech.isSupported.value) {
  const SpeechGrammarList =
    window.SpeechGrammarList || window.webkitSpeechGrammarList;
  const speechRecognitionList = new SpeechGrammarList();
  speech.recognition.grammars = speechRecognitionList;
}

watch(result, () => {
  console.log(result.value);
});

function startRecord() {
  console.log("點擊了開始錄音按鈕");
  console.log(`點前錄音狀態為${isListening.value}`);
  speech.result.value = "";
  speech.start();
  console.log(`點後錄音狀態為${isListening.value}`);
}

function endRecord() {
  console.log("點擊了結束錄音按鈕");
  console.log(`點前錄音狀態為${isListening.value}`);
  speech.stop();
  console.log(`點後錄音狀態為${isListening.value}`);
  console.log(`最後錄音結果為`);
  console.log(`==================`);
  console.log(result.value);
}

// ================== 語音識別用變數與Function ==================
// 語音識別變數
let recognition;
let recognitionResultTemp = ref(""); // 儲存語音識別暫存結果
let recognitionResult = ref(""); // 儲存語音識別最終結果

// 語音識別Object 實例初始化設定
const recognitionSetting = () => {
  console.log("初始化語音識別實例");
  window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  // 創建語音識別Object 與屬性設置
  recognition = new window.SpeechRecognition();
  // 添加事件監聽器
  // 當result 事件被觸發時，調用handleResult
  recognition.addEventListener("result", handleResult);
  recognition.addEventListener("error", (e) => {
    console.error("語音識別錯誤：", e);
  });
  recognition.addEventListener("nomatch", () => {
    console.log("語音識別未匹配到任何結果");
  });
};

//處理語音識別結果
function handleResult(e) {
  console.log("處理 TTS Object，解析出結果的涵式，語音識別結果ing");
  recognitionResultTemp.value = Array.from(e.results)
    .map((result) => result[0].transcript)
    .join("");
  console.log("-----目前識別結果-----");
  console.log(recognitionResultTemp.value);
}
//切換開始與結束語音識別狀態
function toggleSpeechRecognition() {
  if (audioRunning.value) {
    // 重新初始化語音識別實例
    console.log("開始初始化語音識別設定");
    recognitionSetting();
    console.log("開始語音識別");
    recognition.start();
  } else {
    console.log("結束語音識別");
    recognition.stop();
    recognitionResult.value = recognitionResultTemp.value;
    console.log("-----最終識別結果-----");
    console.log(recognitionResult.value);
  }
}

// 檢查錄音時是否沉默超過10s的相關變數
let silenceTimer; // 檢查沉默的timer
const silenceThreshold = 10000; // 10秒的沉默閾值
const startSoundDetection = (stream) => {
  // 創建一個新的 AudioContext 實例
  const audioContext = new AudioContext();
  // 使用音訊流來創建一個 MediaStreamAudioSourceNode。
  // 這個節點可以用來處理來自音訊輸入設備（如麥克風）的音訊資料
  const source = audioContext.createMediaStreamSource(stream);
  // 創建一個新的 AnalyserNode。這個節點可以用來對音訊資料進行頻譜分析
  const analyser = audioContext.createAnalyser();
  // 將原始音訊節點連接到分析節點
  source.connect(analyser);
  // 將 AnalyserNode 的 fftSize 屬性設置為 1024，這將決定頻譜資料的精度
  analyser.fftSize = 1024;
  // 從 AnalyserNode 獲取頻譜資料的數組大小
  const bufferLength = analyser.frequencyBinCount;
  // 創建一個新的 Uint8Array，其大小等於頻譜資料的數組大小
  // 此數組將用於存儲從 AnalyserNode 獲取的頻譜資料
  const dataArray = new Uint8Array(bufferLength);
  // 檢查是否有聲音的函數
  const checkSound = () => {
    // 從 AnalyserNode 獲取頻譜資料，並將其存儲在先前創建的數組中
    analyser.getByteFrequencyData(dataArray);
    // 檢查數組中是否有值大於 0，即是否有聲音
    const hasSound = dataArray.some((value) => value > 0);
    // 如果有聲音，則重置沉默計時器
    if (hasSound) {
      clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        stopRecording();
      }, silenceThreshold);
    }
  };
  // 每 100 毫秒檢查一次是否有聲音
  setInterval(checkSound, 100);
};
</script>
