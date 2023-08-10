<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center">
        <h1>在這裡你可以盡情地與AI暢談!</h1>
      </v-col>
      <v-col cols="12">
        <v-combobox
          label="Combobox"
          :items="[
            '日常話題',
            '興趣話題',
            '旅遊話題',
            '職場話題',
            '考試口說',
            '情境話題',
          ]"
          variant="underlined"
        ></v-combobox
      ></v-col>
      <template v-for="topicItem in topicsArray" :key="topicItem._id">
        <v-col cols="4">
          <v-card>
            <v-img :src="topicItem.image" height="200px" cover></v-img>
            <v-card-title class="text-center">{{
              topicItem.topic
            }}</v-card-title>
            <!-- 不知道該不該顯示說明>? -->
            <!-- <v-card-text> {{ topicItem.content }} </v-card-text> -->
            <v-card-actions class="d-flex justify-center">
              <v-btn
                @click="createConversation(topicItem.topic, topicItem.content)"
                >進入對話</v-btn
              >
            </v-card-actions>
            <v-card-text>{{ topicItem.topic }}</v-card-text>
            <v-card-text>{{ topicItem.content }}</v-card-text>
          </v-card></v-col
        >
      </template>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { apiAuth } from "@/plugins/axios";
import { useSnackbar } from "vuetify-use-dialog";
import { storeToRefs } from "pinia";
import { useTopicsStore } from "@/store/topics.js";
import { useConversationsStore } from "@/store/conversations";
import { useRouter } from "vue-router";

const router = useRouter();
const createSnackbar = useSnackbar();
const topics = useTopicsStore();
const { topicsArray } = storeToRefs(topics);
const conversations = useConversationsStore();

let conversationResult = ref();
// 載入後端 Prompt 對話資料
const cardLoadItems = async () => {
  try {
    topics.getTopics();
    console.log("前端話題頁面，成功獲得get prompt到前端");
  } catch (error) {
    createSnackbar({
      text: error.response?.data.message || "發生錯誤",
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: "red",
        location: "bottom",
      },
    });
  }
};
cardLoadItems();

// 創建Conversation 並跳轉進 conversation 頁面
const createConversation = async (topic, content) => {
  conversationResult.value = await conversations.createConversation(
    topic,
    content,
  );
  console.log("即將跳轉是conversation path");
  router.push("/conversation/" + conversationResult.value._id);
};
</script>
