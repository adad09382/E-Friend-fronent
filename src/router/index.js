// Composables
import { createRouter, createWebHashHistory, START_LOCATION } from "vue-router"; // START_LOCATION 為用戶進入Vue後的第一個 path
import { useUserStore } from "@/store/user";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/FrontLayout.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/front/HomeView.vue"),
        meta: {
          title: "E-Friend || 首頁",
          // 是否需要登入或管理員身分\
          login: false,
          admin: false,
        },
      },
      {
        path: "register",
        name: "Register",
        component: () =>
          import(
            /* webpackChunkName: "register" */ "@/views/front/RegisterView.vue"
          ),
        meta: {
          title: "E-Friend || 註冊",
          login: false,
          admin: false,
        },
      },
      {
        path: "login",
        name: "Login",
        component: () =>
          import(/* webpackChunkName: "login" */ "@/views/front/LoginView.vue"),
        meta: {
          title: "E-Friend || 登入",
          login: false,
          admin: false,
        },
      },
      {
        path: "topic",
        name: "Topic",
        component: () =>
          import(/* webpackChunkName: "topic" */ "@/views/front/TopicView.vue"),
        meta: {
          title: "E-Friend || 話題",
          login: true,
          admin: false,
        },
      },
      {
        path: "news",
        name: "News",
        component: () =>
          import(/* webpackChunkName: "news" */ "@/views/front/NewsView.vue"),
        meta: {
          title: "E-Friend || 新聞",
          login: true,
          admin: false,
        },
      },
      {
        path: "conversation/:id",
        name: "Conversation",
        component: () =>
          import(
            /* webpackChunkName: "conversation" */ "@/views/front/ConversationView.vue"
          ),
        meta: {
          title: "E-Friend || 對話",
          login: true,
          admin: false,
        },
      },
      {
        path: "stt",
        name: "stt",
        component: () =>
          import(/* webpackChunkName: "stt" */ "@/views/front/STT.vue"),
        meta: {
          title: "E-Friend || STT",
          login: true,
          admin: false,
        },
      },
    ],
  },
  {
    path: "/admin",
    component: () => import("@/layouts/AdminLayout.vue"),
    children: [
      {
        path: "",
        name: "AdminHome",
        component: () =>
          import(
            /* webpackChunkName: "admin-home" */ "@/views/admin/HomeView.vue"
          ),
        meta: {
          title: "E-Friend || 管理",
          login: true,
          admin: true,
        },
      },
      {
        path: "topic",
        name: "AdminTopic",
        component: () =>
          import(
            /* webpackChunkName: "admin-topic" */ "@/views/admin/TopicView.vue"
          ),
        meta: {
          title: "E-Friend || 話題管理",
          login: true,
          admin: true,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

// router.afterEach去到每一頁後執行 (to:目標page, from:來源page )
router.afterEach((to, from) => {
  document.title = to.meta.title;
});
// router.beforeEach 在去到每一頁之前 (to:目標page, from:來源page, next:如為true，導去下一頁)
router.beforeEach(async (to, from, next) => {
  const user = useUserStore();
  // 若路由跳轉來源page = 剛進網站 url
  if (from === START_LOCATION) {
    // 取得使用者資訊
    await user.getProfile();
  }
  // 使用者登入狀態為true ，且前往頁面是"註冊"或"登入"，將導回首頁
  if (user.isLogin && ["/register", "/login"].includes(to.path)) {
    next("/");
    // 使用者登入狀態為false,且前往頁面要求登入狀態為 true，將導回登入頁
  } else if (!user.isLogin && to.meta.login) {
    next("/login");
    // 使用者角色不是管理員,且前往頁面要求管理權限為 true，將導回首頁
  } else if (!user.isAdmin && to.meta.admin) {
    next("/");
  } else {
    // 不做導向
    next();
  }
});
export default router;
