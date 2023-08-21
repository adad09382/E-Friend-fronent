import { defineStore } from "pinia";
import { ref, reactive, watch } from "vue";
import UserRole from "@/enum/userRole.js";
import { apiAuth } from "@/plugins/axios.js";
import { useSpeechRecognition } from "@vueuse/core";

export const useConversationsStore = defineStore("conversations", () => {
  const Conversation_Id = ref(""); // 目前用戶active 的 conversation Id
  // ================== 創建Conversation用變數與Function ==================
  const createConversation = async (topic, content) => {
    // 向後端發起創建Conversation 的請求
    console.log(`創建話題，話題的topic為：${topic}`);
    console.log(`創建話題，話題的prompt為：${content}`);
    try {
      // 向後端發起製作conversation model請求
      const result = await apiAuth.post("/conversation", {
        topic: topic,
        prompt: content,
      });
      const conversationResult = result.data.result;
      console.log(conversationResult);
      return conversationResult;
    } catch (error) {
      console.log("失敗");
      console.log(error);
    }
  };

  // ================== 載入用戶的Conversation紀錄用變數與Function ==================
  //某userId的所有conversations Array
  const conversations = ref([]);
  const conversation = ref({
    _id: "",
    user: "",
    history: [{}],
  });

  const getIdConversation = async (Conversation_Id) => {
    try {
      console.log("開始執行get 指定Conversation Id的內容(id user history )");
      console.log(`指定Conversaiton id是：${Conversation_Id}`);
      const { data } = await apiAuth.get("/conversation/" + Conversation_Id);
      conversation.value._id = data.result._id;
      conversation.value.user = data.result.user;
      conversation.value.history = data.result.history;
      document.title = "E-Friend | " + conversation.value.history[0].content;
    } catch (error) {
      console.log("pinia get指定ConversationId的內容(id user history)失敗");
      console.log(error);
    }
  };
  //get 所有conversation
  //get 指定userId 的所有conversation
  //get 指定conversation id 的 的所有conversation
  const getUserIdAllConversation = async () => {
    try {
      console.log("開始get 指定User Id的所有conversation");
      const { data } = await apiAuth.get("/conversation");
      console.log(data.result);
      conversations.value = data.result;
    } catch (error) {
      console.log("get 指定User Id的所有conversation失敗");
      console.log(error);
      createSnackbar({
        text: error.response.data.message,
        showCloseButton: false,
        snackbarProps: {
          timeout: 2000,
          color: "red",
          location: "bottom",
        },
      });
    }
  };

  let conversationIdHistory = ref([]);
  // 將目前用戶停留的Conversation id 中的history 呈現在頁面中
  const findConversationIdHistory = (conversationId) => {
    console.log("開始從conversations中找尋指定id的history");
    // 尋找符合 "_id" 的 item
    const foundConversation = conversations.value.find(
      (conversation) => conversation._id === conversationId,
    );
    // 如果找到了對應的對話，則返回它的 "history"，否則返回一個空陣列
    conversationIdHistory.value = foundConversation
      ? foundConversation.history
      : [];
    wrapper.value = conversationIdHistory.value.slice(); // 使用 slice() 進行淺拷貝，達到操作wrapper時不會變動到conversationIdHistory
    wrapper.value.shift();
  };

  // ================== 將message & audio 傳往後端的用變數與Function ==================
  // Coversation GPT 來的
  // 用戶輸入框的內容
  const question = ref("");

  /*
    裝聊天內容的Array[Object]
    { isAi: true,
      value: parseData}
  */
  const wrapper = ref([]);
  const loading = ref(false); // ai 是否正在loading回答
  const fd = new FormData(); // 創建一個FormData 作為patch用物件

  // ================== 向後端發送信息修改 conversation History ==================
  // const fetchAnswer = async () => {
  //   try {
  //     // 若question長度小於三則無法送出
  //     if (question.value.length < 3) {
  //       console.log("question的內容小於3");
  //       return;
  //     }
  //     loading.value = true; // 是否正在loading 為 true
  //     // 向後端發送patch請求，儲存新的聊天紀錄
  //     // 新增conversation history用的message 用FormData儲存並傳送到後端
  //     clearFormData(fd); // 每次向後端傳patch前，先清除FormData的殘留
  //     fd.append("role", "user"); // user 設定
  //     fd.append("content", question.value); // user內容設定
  //     console.log("向後端傳送修改請求");
  //     const { data } = await apiAuth.patch(
  //       "/conversation/" + Conversation_Id.value,
  //       fd,
  //     ); // 向後端傳去新增 conversation history 內容
  //     const userLastChat = data.result.history[data.result.history.length - 1]; // 取得history 中最近一個object
  //     const messageRole = userLastChat.role;
  //     const audioLink = userLastChat?.audioLink;
  //     // 將用戶傳來的text & audio link 傳進 Chat vue 組件
  //     wrapper.value.push({
  //       role: messageRole,
  //       content: question.value,
  //       audioLink: audioLink,
  //     });
  //     question.value = "";

  //     // 讓聊天窗出現Loading
  //     wrapper.value.push({
  //       role: "assistant",
  //       content: "Loading....",
  //     });

  //     // 向 openAi發請請求
  //     console.log("向gpt發出請求");
  //     const aiResResult = await apiAuth.patch(
  //       "/conversation/" + Conversation_Id.value + "/response",
  //     );
  //     console.log(aiResResult);

  //     wrapper.value.pop(); // 收到ai回覆後將 loading 窗刪掉
  //     // push Ai的回答
  //     wrapper.value.push({
  //       role: "assistant",
  //       content:
  //         aiResResult.data.result.history[
  //           aiResResult.data.result.history.length - 1
  //         ].content,
  //     }); // 取得history 中最近一個object
  //   } catch (error) {
  //     console.log("向後端傳送修改請求，失敗");
  //     console.log(error);
  //   } finally {
  //     loading.value = false;
  //   }
  // };
  // 用戶送出信息修改conversation History，再由AI修改
  async function handleChat() {
    await sendUserMessage();
    await fetchAiResponse();
  }

  // 用戶送出信息，將用戶信息新增到conversation History
  const sendUserMessage = async () => {
    try {
      if (question.value.length < 3) {
        console.log("question的內容小於3");
        return;
      }

      fd.append("role", "user");
      fd.append("content", question.value);
      console.log("向後端傳送修改請求");

      const { data } = await apiAuth.patch(
        "/conversation/" + Conversation_Id.value,
        fd,
      );

      const userLastChat = data.result.history[data.result.history.length - 1];
      const messageRole = userLastChat.role;
      const audioLink = userLastChat?.audioLink;

      wrapper.value.push({
        role: messageRole,
        content: question.value,
        audioLink: audioLink,
      });

      question.value = "";
    } catch (error) {
      console.log("向後端傳送修改請求，失敗");
      console.log(error);
    }
  };
  // AI回應信息，將AI信息新增到conversation History
  const fetchAiResponse = async () => {
    try {
      loading.value = true;
      wrapper.value.push({
        role: "assistant",
        content: "Loading....",
      });

      console.log("向gpt發出請求");

      const aiResResult = await apiAuth.patch(
        "/conversation/" + Conversation_Id.value + "/response",
      );
      console.log(aiResResult);

      wrapper.value.pop();

      wrapper.value.push({
        role: "assistant",
        content:
          aiResResult.data.result.history[
            aiResResult.data.result.history.length - 1
          ].content,
      });
    } catch (error) {
      console.log("獲取AI回覆失敗");
      console.log(error);
    } finally {
      loading.value = false;
    }
  };

  // 等待3秒回應的 promise
  const waitThreeSeconds = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("3秒過去了");
      }, 3000);
    });
  };
  // 清除 FormData
  const clearFormData = (formData) => {
    const keysArray = [...formData.keys()]; // 將迭代器轉換為數組
    if (keysArray.length > 0) {
      console.log("刪除fd的role & content");
      for (const key of keysArray) {
        formData.delete(key);
      }
    } else {
      console.log("fd是空的不用清空");
    }
  };
  // ================== 同時調用錄音與語音識別用變數與Function ==================
  const audioRunning = ref(false); // 是否正在錄音的狀態
  /*
  1. 調用一次性function，設定語音識別基本
  2. 多次調用開始錄音與開始識別
  */
  const startRecordAndRecognition = () => {
    console.log(
      `開始切換語音狀態，將語音狀態由${
        audioRunning.value
      }切換為${!audioRunning.value}`,
    );
    audioRunning.value = !audioRunning.value; // 切換錄音狀態
    toggleSpeechRecognition(); // 開始語音識別
    toggleRecording(); // 開始錄音
  };

  // ================== 錄音用變數與Function ==================
  // click錄音鍵後
  // 錄音相關變數設置
  let recorder; // timer
  let recordedChunks = []; // 儲存錄音片段的array
  let audioUrl = ref(null); // audio link
  // 開始錄音Fn
  const toggleRecording = async () => {
    if (audioRunning.value) {
      try {
        console.log("開始錄音，創建錄音實例");
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        recorder = new MediaRecorder(stream); // 創建錄音實例 Object
        recorder.addEventListener(
          "dataavailable",
          (
            e, // 在recorder.start()後，每timeslice毫秒會將收集的audio數據push進recordedChunks Array
          ) => recordedChunks.push(e.data),
        );
        recorder.start();
        // 啟動聲音檢測
        // startSoundDetection(stream);
      } catch (error) {
        console.error("錄音失敗：", error);
      }
    } else {
      recorder.onstop = async () => {
        console.log("將錄製的recordedChunks 製作成audio/webm 的blob");
        const blob = new Blob(recordedChunks, { type: "audio/webm" });
        console.log("製作Blob錄音檔url");
        audioUrl.value = URL.createObjectURL(blob);
        recordedChunks = []; // 重設 recordedChunks
        createAudioFileFromRecordedBlob(blob);
      };
      console.log("錄音結束");
      recorder.stop();
    }
  };

  // 將recordedChunks 製作成audio/webm 的blob，再將blob存成檔案
  // 首先要將blob 儲存到Cloudinary，將Cloudinary的url
  // Cloudinary的url作為前端audio的link，將audio link使用slot方式傳遞到子組件中
  // 將Cloudinary的url link存到mongodb message資料庫中
  const createAudioFileFromRecordedBlob = async (blob) => {
    console.log("將audio/webm 的blob寫成audio/webm files");
    const uniqueFilename = `recorded_${Date.now()}_${Math.floor(
      Math.random() * 10000,
    )}.webm`;
    const file = new File([blob], uniqueFilename, { type: "audio/webm" }); // 將 Blob object 轉換為 File object
    // 加入語音前先刪光fd
    clearFormData(fd);
    // 建立一個 FormData object並將檔案加入到其中
    console.log("將audio/webm加入到FormData中");
    fd.append("audio", file);
    handleChat();
    // 向後端發起Conversation 發起patch，改動該對話的history ，新增message進去
    // console.log(
    //   "後端Conversation 發起patch，改動該對話的history ，新增message object進去",
    // );
    // await apiAuth.patch("/prompts/" + conversation.id, fd); // conversation.id 怎麼獲取是個謎
  };

  // ================== VueUse 語音識別用變數與Function ==================

  const lang = ref("en-US"); // 設置辨識語言
  const recognitionResult = ref(""); // 用於送往後端的語音辨識結果text

  const speech = useSpeechRecognition({
    lang: lang.value,
    interimResults: true,
    continuous: true,
  });
  // 設置變數
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

  const toggleSpeechRecognition = () => {
    if (audioRunning.value) {
      console.log("點擊了開始錄音按鈕");
      speech.result.value = "";
      speech.start();
    } else {
      console.log("點擊了結束錄音按鈕");
      speech.stop();
      recognitionResult.value = result.value;
      console.log(`最後語音識別結果為： ` + recognitionResult.value);
      question.value = recognitionResult.value;
    }
  };

  return {
    Conversation_Id,
    conversation,
    conversations,
    createConversation,
    getUserIdAllConversation,
    findConversationIdHistory, // 取出指定conversation Id 取出history
    conversationIdHistory, // 被取出的指定conversation Id history Array
    question,
    wrapper,
    loading,
    waitThreeSeconds,
    audioRunning,
    recorder,
    recordedChunks,
    audioUrl,
    toggleRecording,
    createAudioFileFromRecordedBlob,
    startRecordAndRecognition, // 開始錄音與識別
    handleChat, // 文字送出和後端互動
    fetchAiResponse, // ai回應更新conversation history
    fd,
  };
});
