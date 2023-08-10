import axios from "axios";
import { useUserStore } from "@/store/user.js";
// 新建立一個axios物件，並設定baseURL
export const api = axios.create({
  baseURL: import.meta.env.VITE_API,
});

// 傳 JWT請求皆用攔截器處理
export const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API,
});
/*
  1. 呼叫axios.get axios.post 請求時
  2. interceptors.request 請求攔截器
  3. 送出請求
  4. interceptors.response 回應攔截器
  5. 呼叫 axios 的 .then() .catch() 
*/
// 請求(req)攔截
apiAuth.interceptors.request.use((config) => {
  // config 為發出請求時的設定
  const user = useUserStore();
  config.headers.authorization = "Bearer " + user.token;
  return config; // 會用更新後的設定發出請求
});
// 回應(res)攔截
// axios.interceptors.response.use(成功執行的Fn, 失敗執行的Fn)
apiAuth.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    // 如果有收到res回應
    if (error.response) {
      // 如果是JWT過期的錯誤，且path不是舊換新
      if (
        error.response.data.message === "登入逾時" &&
        error.config.url !== "/users/extend"
      ) {
        const user = useUserStore();
        // 傳送JWT舊換新請求
        return apiAuth
          .patch("/users/extend")
          .then(({ data }) => {
            // data 為 res.data 的解構
            // 如果舊換新成功
            user.token = data.result;
            // 修改原發生錯誤的請求的JWT
            error.config.headers.authorization = "Bearer " + user.token;
            // 重新傳送原請求
            return axios(error.config);
          })
          .catch((error) => {
            console.log(error);
            // 如果舊換新失敗，就登出
            user.logout();
            // 回傳原錯誤到呼叫 axios 的地方
            return Promise.reject(error);
          });
      }
    }
    // 如果失敗的請求沒回應/不是過期，回傳原錯誤到呼叫 axios 的地方
    return Promise.reject(error);
  },
);

// 若沒用攔截器，在每次向需要登入驗證的頁面發出請求，都需要設置header來驗證
// api.get("/me", {
//   headers: {
//     authorization: "Bearer " + user.token,
//   },
// });
