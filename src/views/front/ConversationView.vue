<template>
  <v-row class="h-100 no-gutters elevation-4">
    <!-- <v-col cols="12">
      <h2>{{ $route.params.id }}</h2>
      <p>{{ conversation }}</p>
    </v-col> -->
    <!-- 對話聊天視窗選單 -->
    <v-col
      cols="3"
      sm="2"
      class="flex-grow-1 flex-shrink-0"
      style="border-right: 1px solid #0000001f"
    >
      <v-responsive class="overflow-y-auto fill-height" height="500">
        <v-list subheader>
          <template
            v-for="(item, index) in conversations"
            :key="conversations._id"
          >
            <v-list-item :to="item._id">
              <v-list-item-title v-text="item.topic" />
            </v-list-item>
            <v-divider class="my-0" />
          </template>
        </v-list>
      </v-responsive>
    </v-col>

    <!-- 對話內容框 -->
    <v-col cols="auto" class="flex-grow-1 flex-shrink-0">
      <v-responsive class="overflow-y-hidden fill-height" height="500">
        <v-card flat class="d-flex flex-column fill-height">
          <!-- 使用 v-for 創建迴圈，每个 chat object和索引作為参数 -->
          <!-- 若 chat.isAi 為 true，添加一個名為 ai 的 class -->
          <v-card-text>
            <template
              v-for="(chat, i) in wrapper"
              :key="i"
              :class="{ ai: chat.isAi }"
              class="flex-shrink-1 overflow-y-auto wrapper"
            >
              <!-- 將chat object 傳遞給子組件Chat使用  -->
              <Chat :chat="chat" /> </template
          ></v-card-text>
          <v-card-text class="flex-grow-0">
            <v-text-field
              v-model="question"
              label="type_a_message"
              type="text"
              no-details
              outlined
              append-inner-icon="mdi-send"
              @click:append-inner="fetchAnswer"
              @keyup.enter="fetchAnswer"
              :append-icon="
                audioRunning ? 'mdi-microphone-off' : 'mdi-microphone'
              "
              @click:append="startRecordAndRecognition"
              hide-details
            />
          </v-card-text>
        </v-card>
      </v-responsive>
    </v-col>
    <v-col cols="12">
      <div>Audio Field</div>
      <v-divider></v-divider>
      <audio v-if="audioUrl" controls :src="audioUrl"></audio>
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
} = storeToRefs(conversationsStore);
// 引入ConversationsStore  中的指定函式
const getIdConversation = conversationsStore.getIdConversation;
const getUserIdAllConversation = conversationsStore.getUserIdAllConversation; // 獲得某UserId的所有Conversation
const startRecordAndRecognition = conversationsStore.startRecordAndRecognition; //開始錄音與語音識別
const fetchAnswer = conversationsStore.fetchAnswer;
const waitThreeSeconds = conversationsStore.waitThreeSeconds;

// =================================

const firstConversation_Id = ref(route.params.id); // 第一次進入頁面的 route.params.id
Conversation_Id.value = firstConversation_Id.value;

// 監控路由改變，路由改變時，改變Pinia 儲存的當年聊天室id
watch(
  () => route.params.id,
  (newId) => {
    console.log("監控到route 路徑改變");
    Conversation_Id.value = newId;
  },
);
// 立即執行函式，去後端撈數據
(async () => {
  try {
    console.log("開始執行IIFE");
    await getUserIdAllConversation();
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
