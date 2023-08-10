import { defineStore } from "pinia";
import { ref, computed } from "vue";
import UserRole from "@/enum/userRole.js";
import { apiAuth } from "@/plugins/axios.js";

export const useUserStore = defineStore(
  "user",
  () => {
    const token = ref("");
    const account = ref("");
    const email = ref("");
    const role = ref(UserRole.USER);

    // 將後端傳來的資料，存在前端 pinia中
    const login = (data) => {
      token.value = data.result.token;
      account.value = data.result.account;
      email.value = data.result.email;
      role.value = data.result.role;
    };
    const isLogin = computed(() => {
      return token.value.length > 0;
    });
    const isAdmin = computed(() => {
      return role.value === UserRole.ADMIN;
    });
    const avatar = computed(() => {
      return `https://source.boringavatars.com/beam/120/${account.value}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`;
    });

    const getProfile = async () => {
      if (token.value.length === 0) return;
      // 如果有jwt token，則通過該token去資料庫拿資料
      try {
        const { data } = await apiAuth.get("users/me");
        account.value = data.result.account;
        email.value = data.result.email;
        role.value = data.result.role;
      } catch (error) {
        console.log(error);
        token.value = "";
      }
    };
    const logout = () => {
      token.value = "";
      account.value = "";
      email.value = "";
      role.value = UserRole.USER;
    };

    return {
      token,
      account,
      email,
      role,
      login,
      isLogin,
      isAdmin,
      avatar,
      getProfile,
      logout,
    };
  },
  // pinia persist 設定，用來將特定的state存儲在某種永久存儲（如 localStorage 或其他）中，在用戶重新加載或返回頁面時保留這些值。
  {
    persist: {
      key: "E-Friend",
      // 在Array中放入需要保留的defineStore狀態
      paths: ["token"], // 這裡的 'token' 是指向 defineStore 中 ref 定義的 token
    },
  },
);

// 當token 存在用戶瀏覽器後，二次登入後流程：驗證token -> 發出 get("users/me")拿資料 -> 將資料存入 pinia
