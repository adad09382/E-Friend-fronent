<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center">
        <h1>在這裡你可以盡情地與AI暢談!</h1>
      </v-col>
      <v-col cols="12">
        <v-combobox
          label="過濾口說主題"
          :items="promptTopic"
          v-model="selectedTopic"
          variant="underlined"
        ></v-combobox>
        <h2 class="text-center">
          選擇您想要與AI對談的主題，點擊Let's talk開始對話!
        </h2>
      </v-col>

      <template v-for="topicItem in filteredTopics" :key="topicItem._id">
        <v-col cols="12" sm="6" md="4">
          <v-card class="card">
            <v-img :src="topicItem.image" height="200px" cover></v-img>
            <span class="category">{{ topicItem.category }}</span>
            <v-card-text class="text-center topic-tittle">{{
              topicItem.topic
            }}</v-card-text>
            <!-- 不知道該不該顯示說明>? -->
            <!-- <v-card-text> {{ topicItem.content }} </v-card-text> -->
            <v-card-actions class="d-flex justify-center">
              <v-btn
                @click="createConversation(topicItem.topic, topicItem.content)"
                >Let's talk</v-btn
              >
            </v-card-actions>
            <!-- <v-card-text>{{ topicItem.content }}</v-card-text> -->
          </v-card></v-col
        >
      </template>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
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
const promptTopic = ref([
  "全部話題",
  "情境話題",
  "日常話題",
  "興趣話題",
  "旅遊話題",
  "職場話題",
  "考試口說",
]);
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

// 過濾 prompt 主題
const selectedTopic = ref(null);
const filteredTopics = computed(() => {
  if (!selectedTopic.value || selectedTopic.value === "全部話題") {
    return topicsArray.value;
  }
  return topicsArray.value.filter(
    (topicItem) => topicItem.category === selectedTopic.value,
  );
});

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

<style scoped>
.topic-tittle {
  font-size: 1rem;
  font-weight: bold;
}
.card {
  height: 310px;
  position: relative;
}
.category {
  position: absolute;
  top: 2.5%;
  right: 1.5%;
  background-color: #eee;
  border-radius: 1rem;
  padding: 0.25rem;
}
</style>
