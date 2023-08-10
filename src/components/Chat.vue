<template>
  <div class="chat" ref="currentMessage">
    <!-- 如果 chat.isAi 為 false，顯示用户的訊息 -->
    <template v-if="!chat.isAi">
      <div class="message" style="text-align: end">
        {{ chat.value }}
      </div>
      <div class="profile">
        <!-- 根據 chat.isAi 的值顯示不同的頭貼圖片 -->
        <img v-if="chat.isAi" src="@/assets/bot.svg" alt="" />
        <img v-else src="@/assets/user.svg" alt="" />
      </div>
    </template>
    <!-- 如果 chat.isAi 為 true，顯示AI回覆的的訊息 -->
    <template v-else>
      <div class="profile">
        <img v-if="chat.isAi" src="@/assets/bot.svg" alt="" />
        <img v-else src="@/assets/user.svg" alt="" />
      </div>
      <div class="message">
        {{ chat.value }}
      </div>
    </template>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, defineProps, watch } from "vue";
// 定義 chat 屬性，是一個物件(Object)
const props = defineProps({
  chat: Object,
});
// currentMessage 用於獲取 DOM 元素
const currentMessage = ref(null);

// 在组件掛載後，scroll 到最新的消息
onMounted(async () => {
  await nextTick();
  const div = currentMessage.value;
  div.scrollIntoView({ behavior: "smooth" });
});
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
  font-size: 20px;
  max-width: 100%;
  overflow-x: scroll;
  white-space: pre-wrap;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.message::-webkit-scrollbar {
  display: none;
}
</style>
