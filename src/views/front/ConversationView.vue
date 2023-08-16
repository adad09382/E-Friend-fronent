<template>
  <!-- 對話聊天視窗選單 -->
  <v-list class="conversation-list">
    <template v-for="(item, index) in conversations" :key="conversations._id">
      <v-list-item :to="item._id">
        <v-list-item-title v-text="item.topic" />
      </v-list-item>
      <v-divider class="my-0" />
    </template>
  </v-list>
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
          <v-text-field
            v-model="question"
            label="type_a_message"
            type="text"
            outlined
            append-inner-icon="mdi-send"
            @click:append-inner="fetchAnswer"
            @keyup.enter="fetchAnswer"
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
const fetchAnswer = conversationsStore.fetchAnswer;
const waitThreeSeconds = conversationsStore.waitThreeSeconds;
const findConversationIdHistory = conversationsStore.findConversationIdHistory;
// ==============首次進入頁面執行的操作===================

const firstConversation_Id = ref(route.params.id); // 第一次進入頁面的 route.params.id
Conversation_Id.value = firstConversation_Id.value; // 更新 pinia 儲存的Conversation_Id
findConversationIdHistory(Conversation_Id.value); // 取得進入時所在conversation 的history

// 監控路由改變，路由改變時，改變pinia 儲存的當年聊天室id
watch(
  () => route.params.id,
  (newId) => {
    console.log("監控到route路徑改變");
    Conversation_Id.value = newId;
    findConversationIdHistory(newId); //  route 路徑改變改變時，取得改變後的history
  },
);
// 立即執行函式，去後端撈數據
// 撈到指定用戶的所有conversation
// 還要將指定conversation 中的history 呈現在頁面
(async () => {
  try {
    console.log("開始執行IIFE");
    await getUserIdAllConversation(); // 獲得指定用戶的所有對話
    findConversationIdHistory(route.params.id); // 獲得目前對話中的所有history
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
  width: 15%;
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
}

.chat-responsive {
  overflow-y: hidden;
  height: 500px;
}

.chat-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-text {
  height: 500px;
  overflow-y: auto;
}

.input-field {
  flex-grow: 0;
}

.ai {
  /* 這裡可以添加 AI 聊天消息的樣式 */
}

.wrapper {
  flex-shrink: 1;
  overflow-y: auto;
}
</style>
