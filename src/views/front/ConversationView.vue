<template>
  <!-- 對話聊天視窗選單 -->
  <v-list class="conversation-list">
    <template v-for="(item, index) in sortedConversations" :key="item._id">
      <v-list-item :to="item._id">
        <v-list-item-title v-text="item.topic" />
      </v-list-item>
      <v-divider class="my-0" />
    </template>
  </v-list>
  <!-- 對話內容框 -->
  <v-row class="chat-container">
    <!-- 對話內容框 -->
    <v-col class="chat-content">
      <v-card flat class="chat-card">
        <!-- 使用 v-for 創建迴圈，每个 chat object和索引作為参数 -->
        <!-- 若 chat.isAi 為 true，添加一個名為 ai 的 class -->
        <v-card-text class="chat-text">
          <template v-for="(chat, i) in wrapper" :key="i">
            <!-- 將chat object 傳遞給子組件Chat使用  -->
            <Chat v-bind="chat" /> </template
        ></v-card-text>
        <v-card-text class="input-field">
          <button class="promptBtn" @click="dialog = !dialog">P</button>
          <v-text-field
            v-model="question"
            label="type_a_message"
            type="text"
            outlined
            append-inner-icon="mdi-send"
            @click:append-inner="handleChat"
            @keyup.enter="handleChat"
            :append-icon="
              audioRunning ? 'mdi-microphone-off' : 'mdi-microphone'
            "
            @click:append="startRecordAndRecognition"
            hide-details
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <!-- 測試audio用 -->
  <!-- <v-col cols="12">
        <template v-if="audioUrl">
          <audio :src="audioUrl" controls></audio>
        </template>
      </v-col> -->
  <!-- dialog -->

  <div class="text-center">
    <v-dialog v-model="dialog" activator="parent" width="auto">
      <v-card>
        <v-card-text>
          <b>Situation</b> <br />
          {{ promptSituation }} <br />
          <b>Object</b> <br />

          {{ promptObject }}</v-card-text
        >
        <v-card-actions>
          <v-btn color="primary" block @click="dialog = false"
            >Close Dialog</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import Chat from "@/components/Chat.vue";
import { useRoute } from "vue-router";

import { storeToRefs } from "pinia";
import { useConversationsStore } from "@/store/conversations.js";
import { useSnackbar } from "vuetify-use-dialog";
import { apiAuth } from "@/plugins/axios";
import { useSpeechRecognition } from "@vueuse/core";

const route = useRoute();
const createSnackbar = useSnackbar();
const dialog = ref(false);
const conversationsStore = useConversationsStore();
// 引入ConversationsStore 中的指定變數
const {
  Conversation_Id,
  conversations,
  audioRunning,
  question,
  wrapper,
  loading,
  audioUrl,
  conversationIdHistory,
  fd,
} = storeToRefs(conversationsStore);
// 引入ConversationsStore  中的指定函式
const getIdConversation = conversationsStore.getIdConversation;
const getUserIdAllConversation = conversationsStore.getUserIdAllConversation; // 獲得某UserId的所有Conversation
const startRecordAndRecognition = conversationsStore.startRecordAndRecognition; //開始錄音與語音識別
const handleChat = conversationsStore.handleChat;
const fetchAiResponse = conversationsStore.fetchAiResponse;
const waitThreeSeconds = conversationsStore.waitThreeSeconds;
const findConversationIdHistory = conversationsStore.findConversationIdHistory;
// ==============首次進入頁面執行的操作===================

const firstConversation_Id = ref(route.params.id); // 第一次進入頁面的 route.params.id
Conversation_Id.value = firstConversation_Id.value; // 更新 pinia 儲存的Conversation_Id
findConversationIdHistory(Conversation_Id.value); // 取得進入時所在conversation 的history

// 監控路由改變，路由改變時，改變pinia 儲存的當年聊天室id
watch(
  () => route.params.id,
  async (newId) => {
    console.log("監控到route路徑改變");
    Conversation_Id.value = newId;
    await getUserIdAllConversation(); // 獲得指定用戶的所有對話
    findConversationIdHistory(newId); //  route 路徑改變改變時，取得改變後的history
  },
);

// 每頁的Prompt，要依據每頁route 去找history
const promptSituation = computed(() => {
  const foundHistory = conversations.value.find(
    (conversation) => conversation._id === Conversation_Id.value,
  );

  if (
    !foundHistory ||
    !foundHistory.history[0] ||
    !foundHistory.history[0].content
  ) {
    return null;
  }

  const content = foundHistory.history[0].content;
  const startSituation = content.indexOf("Situation:");
  const startObjective = content.indexOf("Objective:");

  if (startSituation !== -1 && startObjective !== -1) {
    return content
      .substring(startSituation + "Situation:".length, startObjective)
      .trim();
  }

  return null;
});

const promptObject = computed(() => {
  const foundHistory = conversations.value.find(
    (conversation) => conversation._id === Conversation_Id.value,
  );

  if (
    !foundHistory ||
    !foundHistory.history[0] ||
    !foundHistory.history[0].content
  ) {
    return null;
  }

  const content = foundHistory.history[0].content;
  const startObjective = content.indexOf("Objective:");
  const end = content.indexOf("Note:");

  if (startObjective !== -1 && end !== -1) {
    return content.substring(startObjective + "Objective:".length, end).trim();
  }

  return null;
});

// 聊天列表排序，最後更新排序最上方
const sortedConversations = computed(() => {
  return conversations.value.slice().sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
});

// 立即執行函式，去後端撈數據
// 撈到指定用戶的所有conversation
// 還要將指定conversation 中的history 呈現在頁面
(async () => {
  try {
    console.log("開始執行IIFE");
    await getUserIdAllConversation(); // 獲得指定用戶的所有對話
    findConversationIdHistory(route.params.id); // 獲得目前對話中的所有history
    // 如果對話沒有長度的話，讓AI先說話
    if (wrapper.value.length === 0) {
      await fetchAiResponse();
    }
  } catch (error) {
    console.log("前端IIFE失敗");
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
})();
</script>

<style scoped>
.conversation-list {
  overflow-y: scroll;
  height: 100vh;
  width: 20%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  margin-top: 64px;
}

.chat-container {
  height: 100% !important;
}
.chat-content {
  flex-grow: 1;
  flex-shrink: 0;
  margin-left: 20%;
  height: 100% !important;
}

.chat-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-text {
  overflow-y: auto;
}

.input-field {
  position: relative;
  flex-grow: 0;
}

.ai {
  /* 這裡可以添加 AI 聊天消息的樣式 */
}

.wrapper {
  flex-shrink: 1;
  overflow-y: auto;
}

.promptBtn {
  position: absolute;
  top: -5%;
  right: 1.5%;
  font-size: 0.25rem;
  padding: 0.05rem 0.45rem;
  border: 1px solid black;
  border-radius: 80%;
}
</style>
