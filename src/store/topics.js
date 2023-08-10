import { defineStore } from "pinia";
import { ref, computed } from "vue";
import UserRole from "@/enum/userRole.js";
import { apiAuth } from "@/plugins/axios.js";

export const useTopicsStore = defineStore("topics", () => {
  const topicsArray = ref("");

  const getTopics = async () => {
    try {
      console.log("pinia get Topics");
      const { data } = await apiAuth.get("/prompts");
      topicsArray.value = data.result;
    } catch (error) {
      console.log("pinia get Topics 失敗");
      console.log(error);
    }
  };
  return {
    topicsArray,
    getTopics,
  };
});
