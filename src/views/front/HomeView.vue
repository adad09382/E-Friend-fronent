<template>
  <v-row>
    <!-- 輪播圖 -->
    <v-col cols="12">
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
        <swiper-slide class="home-slide"
          ><img src="@/assets/home_topic.jpg" />
          <v-btn class="topic-btn" to="/topic"></v-btn>
        </swiper-slide>
        <swiper-slide class="home-slide"
          ><img src="@/assets/home_teacher.jpg" />
          <v-btn class="teacher-btn" to="/topic"></v-btn>
        </swiper-slide>
        <swiper-slide class="home-slide"
          ><img src="@/assets/home_news.jpg" />
          <v-btn class="news-btn" to="/news"></v-btn>
        </swiper-slide>
      </swiper>
    </v-col>
    <!-- 6大優勢 -->
    <v-col cols="12" class="d-flex flex-column align-center">
      <v-col cols="10">
        <h1 class="text-center">
          不限時間，不限地點 <br />
          <span style="color: #f04e37"> 一天24小時， 一年365天 </span>
        </h1>
        <v-container>
          <br />
          <v-row>
            <v-col
              cols="6"
              sm="4"
              class="d-flex justify-center"
              v-for="(advantage, index) in advantages"
              :key="index"
            >
              <div class="d-flex align-center">
                <img :src="advantage.img" />
                <div class="margin-left">
                  <b>{{ advantage.title }} </b> <br />
                  {{ advantage.description }}
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-col>

    <v-divider></v-divider>
    <!-- 教材 -->
    <v-col cols="12">
      <h1 class="text-center">
        <span style="color: #f04e37"> 有趣且豐富 </span><br />
        適合各程度學習者的口說材料
      </h1>
      <br />
      <v-container>
        <v-row class="d-flex justify-center">
          <!-- AI對話 -->

          <v-col cols="12">
            <h2 class="text-center margin-button-1rem">各式對話主題</h2>
            <div class="d-flex flex-wrap justify-center">
              <div
                class="smallCard d-flex flex-column"
                v-for="(card, index) in cards"
                :key="card.title"
              >
                <div class="img">
                  <img :src="card.img" alt="" />
                </div>
                <div class="text">
                  <div class="title">{{ card.title }}</div>
                </div>
              </div>
            </div>
          </v-col>
          <!-- Get新聞 -->
          <v-col cols="10" class="d-flex flex-column align-center">
            <h2 class="text-center margin-button">和AI一起聊新聞</h2>
            <div
              class="card d-flex"
              v-for="(article, index) in randomArticles"
              :key="index"
            >
              <div class="text">
                <a :href="article.url" class="title" target="_blank">{{
                  article.title
                }}</a>
                <div></div>
                <div class="subtitle">
                  {{ article.publishedAt.substring(0, 10) }}
                </div>
                <div class="content">{{ article.description }}</div>
              </div>
              <div class="img">
                <img :src="article.urlToImage" alt="" />
              </div>
            </div>
            <v-btn :active="false" @click="getRandomNews" class="margin-top">
              More News</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-divider></v-divider>
    <!-- 一起學英文 + 學員心得 -->
    <v-col class="bg-F6F9FA" cols="12">
      <v-container class="d-flex flex-column align-center">
        <!-- 一起學英文 -->
        <v-col cols="12">
          <v-container class="d-flex flex-column align-center">
            <h1>一起到E-Friend學英語吧</h1>
            <div
              class="text-center line-height"
              style="font-size: 1.25rem; margin: 1.5rem 0"
            >
              多種主題會話、商務英語、檢定英語，滿足不同的學習需求，
              <br />
              採用AI在線上即時與學員互動，強化學員口語表達能力，
              <br />
              以「聽說」帶動「讀寫」，一步一步提升您的英語力！
            </div>
          </v-container>
        </v-col>
        <!-- 學員心得 -->
        <v-col cols="10">
          <h1 class="text-center">
            學員 <span style="color: #f04e37"> 心得分享 </span><br />
          </h1>
          <br />
          <v-row class="d-flex justify-center">
            <v-col
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="d-flex justify-center"
              v-for="(person, index) in people"
              :key="index"
            >
              <div class="peopleCard d-flex flex-column">
                <div class="img">
                  <img :src="person.img" alt="" />
                </div>
                <div class="text">
                  <p class="career">{{ person.career }}</p>
                  <p class="experience">{{ person.experience }}</p>
                  <p class="name">{{ person.name }}</p>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-container></v-col
    >
  </v-row>
  <v-footer>
    <v-row justify="center" no-gutters>
      <v-btn color="black" variant="text" rounded="xl" to="/" :active="false"
        >HOME</v-btn
      >
      <v-btn color="black" variant="text" rounded="xl" @click="openDialog"
        >CONTACT US</v-btn
      >

      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} — <strong>E-Friend</strong>
        <a
          :href="'https://github.com/adad09382'"
          target="_blank"
          class="footerIcon"
        >
          <v-icon> mdi-github </v-icon>
        </a>
      </v-col>
      <v-col cols="12">
        <div style="color: black" class="text-center">
          <b>
            本專案為磨練技術用的sideProject，無商業利用意圖，若有侵權疑慮，請立即Email與我聯繫
          </b>
          <br />
          wadelinbtc@gmail.com
        </div>
      </v-col>
    </v-row>
  </v-footer>

  <!-- Contact Us用的Dialog -->
  <VDialog width="500px" v-model="dialog">
    <VForm :disabled="isSubmitting" @submit.prevent="submit">
      <VCard>
        <VCardText>
          <VTextField label="稱呼"></VTextField>
          <VTextField label="Email信箱"></VTextField>
          <VTextarea label="意見留言"></VTextarea>
        </VCardText>
        <VCardActions>
          <VSpacer></VSpacer>
          <VBtn color="red" @click="closeDialog" :loading="isSubmitting"
            >取消</VBtn
          >
          <VBtn color="green" type="submit" :loading="isSubmitting">送出</VBtn>
        </VCardActions>
      </VCard>
    </VForm>
  </VDialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { useSnackbar } from "vuetify-use-dialog";
import { api } from "@/plugins/axios";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";

const modules = [EffectFade, Navigation, Pagination, Autoplay];

const createSnackbar = useSnackbar();

// 優勢
const advantages = ref([
  {
    img: "https://engoo.com.tw/assets/general/homepage/advantage-icon-01.svg",
    title: "AI一對一",
    description: "英文對話",
  },
  {
    img: "https://engoo.com.tw/assets/general/homepage/advantage-icon-04.svg",
    title: "對話不受限",
    description: "不同需求及興趣",
  },
  {
    img: "https://engoo.com.tw/assets/general/homepage/advantage-icon-03.svg",
    title: "AI可成為任何老師",
    description: "任何英語學習問題都可以",
  },
  {
    img: "https://engoo.com.tw/assets/general/homepage/advantage-icon-02.svg",
    title: "隨時隨地",
    description: "線上學習",
  },
  {
    img: "https://engoo.com.tw/assets/general/homepage/advantage-icon-05.svg",
    title: "無需下載軟體",
    description: "讓學習變更簡單",
  },
  {
    img: "https://engoo.com.tw/assets/general/homepage/advantage-icon-06.svg",
    title: "新聞英語學習",
    description: "獲得新消息時也不忘學習",
  },
]);
// 教材-對話 small card
const cards = ref([
  {
    img: "https://engoo.com.tw/assets/general/homepage/materials-oren-01.svg",
    title: "日常對話",
  },
  {
    img: "https://engoo.com.tw/assets/general/homepage/materials-oren-03.svg",
    title: "興趣對話",
  },
  {
    img: "https://engoo.com.tw/assets/general/homepage/materials-oren-04.svg",
    title: "旅遊對話",
  },
  {
    img: "https://engoo.com.tw/assets/general/homepage/materials-oren-02.svg",
    title: "職場對話",
  },
  {
    img: "https://engoo.com.tw/assets/general/homepage/materials-oren-06.svg",
    title: "考試對話",
  },
  {
    img: "https://engoo.com.tw/assets/general/homepage/materials-oren-05.svg",
    title: "情境對話",
  },
]);
//  教材-文章 card，從api get NEWS

const totalArticles = ref([]);
const randomArticles = ref([]);

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
    const randomIndex = Math.floor(Math.random() * totalArticles.value.length);
    randomIndices.add(randomIndex);
  }
  // 使用隨機index的set從 totalArticles 中提取文章放入 randomArticles。
  randomArticles.value = [...randomIndices].map(
    (index) => totalArticles.value[index],
  );
}
// 和news api get 15則新聞，並將其中3則放入 randomArticles
onMounted(async () => {
  //重新在隨機放入3則新聞進 randomArticles
  // await getTotalNews(15, 1);
  const { data } = await api.get("/news");
  console.log(data);
  console.log(data.data.articles);
  totalArticles.value = data.data.articles;
  getRandomNews();
  // getRandomNews();
});

// 學員心得 card
const people = ref([
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT81w87VsQPFcLq--52KYuIWVw7h0Cmvy1dDEdaPgNwJf-67gkyHLuztnb-uUNP28X9o1Y",
    career: "科學家",
    experience:
      "我的工作內容需要使用大量英文溝通，看英文文獻或是和海外組織溝通什麼的，E-Friend提供了很多實用的口語交流練習機會...",
    name: "SHERRY",
  },
  {
    img: "https://s3.amazonaws.com/comicgeeks/characters/avatars/34503.jpg",
    career: "高中生",
    experience:
      "學校上課教的內容真的太無聊了，上課內容制式，時間長，不像E-Friend可以想聊什麼就聊什麼，AI也十分尊敬我這個電鋸人大人...",
    name: "Denji",
  },
  {
    img: "https://s3.amazonaws.com/comicgeeks/characters/avatars/34503.jpg",
    career: "高中生",
    experience:
      "學校上課教的內容真的太無聊了，上課內容制式，時間長，不像E-Friend可以想聊什麼就聊什麼，AI也十分尊敬我這個電鋸人大人...",
    name: "Denji",
  },

  {
    img: "https://upload.wikimedia.org/wikipedia/zh/6/61/Naruto_20160925.jpg",
    career: "公務員",
    experience:
      "E-Friend真的很適合在家自學的人，時間又彈性，想和AI聊天就聊天，有事關掉，完全沒有壓力。可以選擇自己想要的主題，或是跟AI來個天南地北的Free Talk...",
    name: "NARUTO",
  },
  // 更多人物資料...
]);
//Contact Us用的Dialog
// 表單對話框
const dialog = ref(false);
const dialogId = ref("");
const openDialog = () => {
  dialogId.value = "";
  dialog.value = true;
};
const closeDialog = () => {
  dialog.value = false;
};

const submit = () => {
  createSnackbar({
    text: "感謝您的寶貴意見！",
    showCloseButton: false,
    snackbarProps: {
      timeout: 2000,
      color: "green",
      location: "bottom",
    },
  });
  closeDialog();
};
</script>

<style scoped>
.swiper-slide img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.margin-auto {
  margin: auto;
}
.margin-top {
  margin-top: 1rem;
}
.margin-left {
  margin-left: 1rem;
}
.margin-button {
  margin-bottom: 0.5rem;
}
.smallCard {
  margin: 0.5rem 0.5rem;
  border: 0.5px solid #eee;
  border-radius: 1rem;
  box-shadow: 1px 2px 2px #aaa;
  width: 120px;
  height: 120px;
}

.smallCard .img {
  display: flex;
  justify-content: center;
  align-items: center;
}
.smallCard .img img {
  width: 80%;
  height: 80%;
  object-fit: cover;
}
.smallCard .text .title {
  text-align: center;
}
.card {
  margin: 0.25rem 2.5rem;
  border: 0.5px solid #eee;
  box-shadow: 1px 2px 2px #aaa;
  min-height: 120px;
}
.card .text {
  width: 75%;
}

.card .text .title {
  display: block;
  margin: 1rem 1rem 0 1rem;
  font-weight: bold;
  color: #000;
  font-size: 0.85rem;
  text-decoration: none;
}
.card .text .subtitle {
  margin-left: 1rem;
  font-weight: bold;
  font-size: 0.75rem;
  color: #aaa;
}
.card .text .content {
  margin-top: 0.5rem;
  margin-left: 1rem;
  font-weight: bold;
  font-size: 0.75rem;
  color: #000;
  padding-bottom: 0.5rem;
}

.card .img {
  width: 25%;
}
.card .img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.peopleCard {
  margin: 0.5rem 0.5rem;
  border: 0.5px solid #eee;
  border-radius: 1rem;
  box-shadow: 1px 2px 2px #aaa;
  width: 240px;
  height: 320px;
}
.peopleCard .img {
  height: 50%;
}
.peopleCard .img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
}
.peopleCard .text {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 50%;
  margin: 0.5rem;
}

.peopleCard .experience {
  font-size: 0.75rem;
  color: #aaa;
}

.bg-F6F9FA {
  background: #f6f9fa;
}

.footerIcon {
  padding-left: 1rem;
  color: black;
}

.line-height {
  line-height: 2.5rem;
}

.home-slide {
  position: relative;
}
.topic-btn {
  position: absolute;
  top: 65%;
  left: 55%;
  width: 17.5%;
  height: 13%;
  background: transparent;
  box-shadow: none;
  border-radius: 1.5rem;
}
.teacher-btn {
  position: absolute;
  top: 81%;
  left: 64%;
  width: 15%;
  height: 13%;
  background: transparent;
  box-shadow: none;
  border-radius: 1.5rem;
}
.news-btn {
  position: absolute;
  top: 50%;
  left: 22%;
  width: 14%;
  height: 10%;
  background: transparent;
  box-shadow: none;
}
</style>
