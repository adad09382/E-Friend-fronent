<template>
  <v-row>
    <!-- 輪播圖 -->
    <v-col class="h-100" cols="12">
      <!-- Swiper -->
      <swiper
        :spaceBetween="30"
        :effect="'fade'"
        :navigation="true"
        :pagination="{
          clickable: true,
        }"
        :modules="modules"
        :loop="true"
        :autoplay="{
          delay: 3000,
        }"
        class="mySwiper"
      >
        <template v-for="(news, index) in randomArticles" :key="index">
          <swiper-slide>
            <v-card class="newsCard">
              <v-img
                max-height="90vh"
                :src="news.urlToImage"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                cover
              >
                <a :href="news.url" class="newTitle">{{ news.title }}</a>
              </v-img>
            </v-card>
          </swiper-slide>
        </template>
      </swiper>
    </v-col>
    <!-- news Card 展示 -->
    <v-row class="d-flex justify-center">
      <v-col
        cols="12"
        sm="6"
        md="4"
        class="d-flex justify-center"
        v-for="(article, index) in totalArticles"
        :key="index"
      >
        <div class="littleNewsCard d-flex flex-column">
          <div class="img">
            <img :src="article.urlToImage" alt="" />
          </div>
          <div class="text">
            <a :href="article.url" class="littleNewsTitle">{{
              article.title
            }}</a>
            <p class="newsDescription">{{ article.description }}</p>
            <p class="newsDate">{{ article.publishedAt.substring(0, 10) }}</p>
          </div>
        </div>
      </v-col>
      <v-col cols="12" class="d-flex justify-center">
        <v-btn @click="moreNews">More News</v-btn>
      </v-col>
    </v-row>
  </v-row>
</template>
<!-- <div class="h-100 d-flex justify-center">
  <img
    src="https://nanosigmabiotech.com/wp-content/uploads/2020/08/%E9%80%9F%E9%BC%BB%E8%88%92-%E7%B6%B2%E9%A0%81%E6%96%BD%E5%B7%A5%E4%B8%AD.jpg"
    alt=""
  />
</div> -->

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { ref, onMounted } from "vue";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { api } from "@/plugins/axios";
import { useSnackbar } from "vuetify-use-dialog";

// swiper輪播圖用
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
const modules = [EffectFade, Navigation, Pagination, Autoplay];
const createSnackbar = useSnackbar();

//  教材-文章 card，從api get NEWS
const totalArticles = ref([]);
const randomArticles = ref([]);
const getRandomNews = () => {
  console.log("執行隨機get 3 新聞");
  if (totalArticles.value.length < 3) {
    console.log("Not enough articles to select from.");
    return;
  }
  // 創造長度不大於3個set，index值為隨機
  const randomIndices = new Set();
  while (randomIndices.size < 3) {
    const randomIndex = Math.floor(Math.random() * totalArticles.value.length);
    randomIndices.add(randomIndex);
  }
  // 使用隨機index的set從 totalArticles 中提取文章放入 randomArticles。
  randomArticles.value = [...randomIndices].map(
    (index) => totalArticles.value[index],
  );
};

let morePage = 1;
const moreNews = async () => {
  console.log("執行get more新聞 ");
  try {
    const { data } = await api.post("/news", {
      morePage,
    });
    totalArticles.value.push(...data.data.articles);
    morePage++;
  } catch (error) {
    console.log("獲得 more 新聞錯誤");
    console.log(error);
  }
};
// 和news api get 15則新聞，並將其中3則放入 randomArticles
onMounted(async () => {
  // await getTotalNews(15, 1);
  const { data } = await api.get("/news");
  totalArticles.value = data.data.articles;
  //重新在隨機放入3則新聞進 randomArticles
  getRandomNews();
});
</script>

<style scoped>
.newsCard {
  position: relative;
}
.newTitle {
  font-size: 1.5rem;
  color: #fff;
  display: block;
  background: rgba(0, 0, 0, 0.25);
  text-decoration: none;
  position: absolute;
  bottom: 5%;
  left: 2.5%;
}

.littleNewsCard {
  margin: 0.5rem 2rem;
  border: 0.5px solid #eee;
  border-radius: 1rem;
  box-shadow: 1px 2px 2px #aaa;
}

.littleNewsTitle {
  color: black;
  text-decoration: none;
}
.littleNewsCard .img {
  height: 50%;
}
.littleNewsCard .img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
}
.littleNewsCard .text {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 50%;
  margin: 0.5rem;
}

.littleNewsCard .newsDescription {
  font-size: 0.75rem;
  color: #aaa;
}
.newsDate {
  font-size: 0.75rem;
}
</style>
