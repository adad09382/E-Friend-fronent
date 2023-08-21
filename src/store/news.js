import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

import { apiAuth } from "@/plugins/axios.js";

export const useNewsStore = defineStore("News", () => {
  const totalArticles = ref([]);
  const randomArticles = ref([]);
  const API_KEY = import.meta.env.VITE_NEWS_API;
  const BASE_URL = "https://newsapi.org/v2/top-headlines";

  async function getTotalNews(pageSize, page) {
    console.log("執行get 新聞 ");
    const params = {
      country: "us",
      apiKey: API_KEY,
      pageSize: pageSize,
      page: page,
    };
    try {
      const { data } = await axios.get(BASE_URL, { params: params });
      totalArticles.value = data.articles;
      getRandomNews();
    } catch (error) {
      console.error("Error fetching news count:", error);
    }
  }

  function getRandomNews() {
    console.log("執行隨機get 3 新聞");
    if (totalArticles.value.length < 3) {
      console.log("Not enough articles to select from.");
      return;
    }
    // 創造長度不大於3個set，index值為隨機
    const randomIndices = new Set();
    while (randomIndices.size < 3) {
      const randomIndex = Math.floor(
        Math.random() * totalArticles.value.length,
      );
      randomIndices.add(randomIndex);
    }
    // 使用隨機index的set從 totalArticles 中提取文章放入 randomArticles。
    randomArticles.value = [...randomIndices].map(
      (index) => totalArticles.value[index],
    );
  }

  return { randomArticles, getTotalNews, getRandomNews };
});
