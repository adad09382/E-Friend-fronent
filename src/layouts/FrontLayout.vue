<template>
  <v-app-bar color="#fff">
    <v-btn class="logoBtn" :active="false" to="/">
      <v-img
        src="@/assets/ai-friend-logo_darkblue.svg"
        alt="logo"
        max-width="30%"
      ></v-img>
      <v-app-bar-title class="web-title">E-Friend </v-app-bar-title>
    </v-btn>

    <v-spacer></v-spacer>

    <v-app-bar-nav-icon
      v-if="isMobile"
      @click="drawer = !drawer"
    ></v-app-bar-nav-icon>
    <template v-if="!isMobile">
      <template v-for="navItem in navItems" :key="navItem.to">
        <v-btn
          :active="false"
          v-if="navItem.show"
          :to="navItem.to"
          :prepend-icon="navItem.icon"
        >
          {{ navItem.text }}</v-btn
        >
      </template>
      <template v-if="isLogin">
        <v-btn prepend-icon="mdi-forum" @click="navigateToLatestConversation"
          >我的對話</v-btn
        >
        <v-btn v-if="isAdmin" prepend-icon="mdi-cog" to="/admin">管理</v-btn>
        <v-btn prepend-icon="mdi-logout" @click="logout">登出</v-btn>
      </template>
    </template>
  </v-app-bar>
  <v-navigation-drawer
    v-if="isMobile"
    v-model="drawer"
    location="right"
    temporary
  >
    <v-list>
      <template v-for="navItem in navItems" :key="navItem.to">
        <v-list-item v-if="navItem.show" :to="navItem.to">
          <template v-slot:prepend>
            <v-icon :icon="navItem.icon"></v-icon>
            <v-list-item-title>{{ navItem.text }}</v-list-item-title>
          </template>
        </v-list-item>
      </template>
      <v-list-item v-if="isLogin" @click="navigateToLatestConversation">
        <template v-slot:prepend>
          <v-icon icon="mdi-forum"></v-icon>
          <v-list-item-title>我的對話</v-list-item-title>
        </template>
      </v-list-item>
      <v-list-item v-if="isLogin && isAdmin" to="/admin">
        <template v-slot:prepend>
          <v-icon icon="mdi-cog"></v-icon>
          <v-list-item-title>管理</v-list-item-title>
        </template>
      </v-list-item>
      <v-list-item v-if="isLogin" @click="logout">
        <template v-slot:prepend>
          <v-icon icon="mdi-logout"></v-icon>
          <v-list-item-title>登出</v-list-item-title>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-main>
    <router-view></router-view>
  </v-main>
</template>

<script setup>
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useSnackbar } from "vuetify-use-dialog";
import { useUserStore } from "@/store/user.js";
import { apiAuth } from "@/plugins/axios.js";

const router = useRouter();

const user = useUserStore();
const { isLogin, isAdmin } = storeToRefs(user);

const createSnackbar = useSnackbar();

const { mobile } = useDisplay();
const isMobile = computed(() => mobile.value);

const drawer = ref(false);
const navItems = computed(() => {
  return [
    { to: "/", text: "HOME", icon: "mdi-home", show: true },
    {
      to: "/topic",
      text: "探索話題",
      icon: "mdi-message",
      show: isLogin.value,
    },
    {
      to: "/news",
      text: "新聞話題",
      icon: "mdi-newspaper",
      show: isLogin.value,
    },
    {
      to: "/register",
      text: "註冊",
      icon: "mdi-account-plus",
      show: !isLogin.value,
    },
    { to: "/login", text: "登入", icon: "mdi-login", show: !isLogin.value },
  ];
});

const logout = async () => {
  try {
    await apiAuth.delete("/users/logout"); // 後端執行登出
    user.logout(); // 前端 pinia 執行登出
    createSnackbar({
      text: "登出成功",
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: "green",
        location: "bottom",
      },
    });
    router.push("/"); //跳轉回HOME PAGE
  } catch (error) {
    console.log(error);
    createSnackbar({
      text: error.message.data.message,
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: "red ",
        location: "bottom",
      },
    });
  }
};

const fetchLatestConversationId = async () => {
  try {
    const { data } = await apiAuth.get("conversation/latest");
    const latestConversationId = data.result._id;
    return latestConversationId;
  } catch (error) {
    console.error("Error fetching the latest conversation ID: ", error);
    return null;
  }
};

const navigateToLatestConversation = async () => {
  const latestConversationId = await fetchLatestConversationId();
  console.log(latestConversationId);
  if (latestConversationId) {
    router.push(`/conversation/${latestConversationId}`); //跳到最新的Conversation PAGE
  } else {
    createSnackbar({
      text: "您目前尚無創建對話話題，請從探索話題開始選擇話題",
      showCloseButton: false,
      snackbarProps: {
        timeout: 5000,
        color: "red",
        location: "bottom",
      },
    });
    console.error(
      "Failed to navigate to the latest conversation due to missing ID.",
    );
  }
};
</script>

<style scoped>
.web-title {
  width: 170px;
  color: #045a69;

  font-size: 2rem;
}

.logoBtn {
  width: 180px;
  margin-bottom: 0.5rem;
}
</style>
