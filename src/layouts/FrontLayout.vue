<template>
  <v-app-bar color="#fff">
    <v-btn :active="false" to="/">
      <v-app-bar-title class="web-title">E-Friend </v-app-bar-title>
    </v-btn>
    <span class="web-subtitle"></span>

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
      <v-btn v-if="isLogin" prepend-icon="mdi-logout" @click="logout"
        >登出</v-btn
      >
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
      to: "/news",
      text: "我的對話",
      icon: "mdi-forum",
      show: isLogin.value,
    },
    {
      to: "/admin",
      text: "管理",
      icon: "mdi-cog",
      show: isLogin.value && isAdmin.value,
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
</script>

<style scoped>
.web-title {
  color: #f04e37;
  font-size: 2rem;
}

.web-subtitle {
  margin-top: 0.5rem;
  color: #f04e37;
}
</style>
