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
        <swiper-slide><img src="@/assets/home_topic.jpg" /></swiper-slide>
        <swiper-slide><img src="@/assets/home_teacher.jpg" /></swiper-slide>
        <swiper-slide><img src="@/assets/home_news.jpg" /></swiper-slide>
      </swiper>
    </v-col>
    <!-- 6大優勢 -->
    <v-col cols="12">
      <h1 class="text-center">
        不限時間，不限地點 <br />
        <span style="color: #1185c6"> 一天24小時， 一年365天 </span>
      </h1>
      <v-container>
        <br />
        <v-row>
          <v-col cols="4" class="d-flex justify-center">
            <div class="d-flex align-center">
              <img
                src="https://engoo.com.tw/assets/general/homepage/advantage-icon-01.svg"
              />
              <div class="margin-left">
                <b>AI一對一 </b> <br />
                英文對話
              </div>
            </div></v-col
          ><v-col cols="4" class="d-flex justify-center">
            <div class="d-flex align-center">
              <img
                src="https://engoo.com.tw/assets/general/homepage/advantage-icon-04.svg"
              />
              <div class="margin-left">
                <b>對話不受限 </b> <br />
                不同需求及興趣
              </div>
            </div></v-col
          >
          <v-col cols="4" class="d-flex justify-center">
            <div class="d-flex align-center">
              <img
                src="https://engoo.com.tw/assets/general/homepage/advantage-icon-03.svg"
              />
              <div class="margin-left">
                <b>AI可成為任何老師 </b> <br />
                任何英語學習問題都可以
              </div>
            </div></v-col
          >
        </v-row>
        <v-row>
          <v-col cols="4" class="d-flex justify-center">
            <div class="d-flex align-center">
              <img
                src="https://engoo.com.tw/assets/general/homepage/advantage-icon-02.svg"
              />
              <div class="margin-left">
                <b>隨時隨地 </b> <br />
                線上學習
              </div>
            </div></v-col
          >

          <v-col cols="4" class="d-flex justify-center">
            <div class="d-flex align-center">
              <img
                src="https://engoo.com.tw/assets/general/homepage/advantage-icon-05.svg"
              />
              <div class="margin-left">
                <b>無需下載軟體 </b> <br />
                讓學習變更簡單
              </div>
            </div></v-col
          >
          <v-col cols="4" class="d-flex justify-center">
            <div class="d-flex align-center">
              <img
                src="https://engoo.com.tw/assets/general/homepage/advantage-icon-06.svg"
              />
              <div class="margin-left">
                <b>新聞英語學習 </b> <br />
                獲得新消息時也不忘學習
              </div>
            </div></v-col
          >
        </v-row>
      </v-container>
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
          <v-col cols="4">
            <h2 class="text-center margin-button-1rem">各式對話主題</h2>
            <div class="d-flex flex-wrap justify-center">
              <div class="smallCard d-flex flex-column">
                <div class="img">
                  <img
                    src="https://engoo.com.tw/assets/general/homepage/materials-oren-01.svg"
                    alt=""
                  />
                </div>
                <div class="text">
                  <div class="title">日常對話</div>
                </div>
              </div>
              <div class="smallCard d-flex flex-column">
                <div class="img">
                  <img
                    src="https://engoo.com.tw/assets/general/homepage/materials-oren-03.svg"
                    alt=""
                  />
                </div>
                <div class="text">
                  <div class="title">興趣對話</div>
                </div>
              </div>
              <div class="smallCard d-flex flex-column">
                <div class="img">
                  <img
                    src="https://engoo.com.tw/assets/general/homepage/materials-oren-04.svg"
                    alt=""
                  />
                </div>
                <div class="text">
                  <div class="title">旅遊對話</div>
                </div>
              </div>
              <div class="smallCard d-flex flex-column">
                <div class="img">
                  <img
                    src="https://engoo.com.tw/assets/general/homepage/materials-oren-02.svg"
                    alt=""
                  />
                </div>
                <div class="text">
                  <div class="title">職場對話</div>
                </div>
              </div>
              <div class="smallCard d-flex flex-column">
                <div class="img">
                  <img
                    src="https://engoo.com.tw/assets/general/homepage/materials-oren-06.svg"
                    alt=""
                  />
                </div>
                <div class="text">
                  <div class="title">考試對話</div>
                </div>
              </div>
              <div class="smallCard d-flex flex-column">
                <div class="img">
                  <img
                    src="https://engoo.com.tw/assets/general/homepage/materials-oren-05.svg"
                    alt=""
                  />
                </div>
                <div class="text">
                  <div class="title">情境對話</div>
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="8">
            <h2 class="text-center margin-button-1rem">和AI一起聊新聞</h2>
            <div class="card d-flex">
              <div class="text">
                <div class="title">
                  Popular Curry Spices Used in Vietnam 2,000 Years Ago
                </div>
                <div class="subtitle">10 hrs ago</div>
              </div>
              <div class="img">
                <img
                  src="https://assets.app.engoo.com/images/7S2YjK0ULyaB1GjVaQCutZ.jpeg"
                  alt=""
                />
              </div>
            </div>
            <div class="card d-flex">
              <div class="text">
                <div class="title">No Fire Left: How to Deal with Burnout</div>
                <div class="subtitle">10 hrs ago</div>
              </div>
              <div class="img">
                <img
                  src="https://assets.app.engoo.com/images/6y14Hpp4yd0veONv7jmgSl.jpeg"
                />
              </div>
            </div>
            <div class="card d-flex">
              <div class="text">
                <div class="title">
                  DiCaprio to Fund Climate Education at Former School
                </div>
                <div class="subtitle">10 hrs ago</div>
              </div>
              <div class="img">
                <img
                  src="https://assets.app.engoo.com/images/6Rx47EkBtKFPZuGpqcdiGT.jpeg"
                  alt=""
                />
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-divider></v-divider>
    <!-- 學員心得 -->
    <v-container class="d-flex justify-center">
      <v-row class="d-flex justify-center">
        <v-col cols="4" class="d-flex justify-center">
          <div class="peopleCard d-flex flex-column">
            <div class="img">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT81w87VsQPFcLq--52KYuIWVw7h0Cmvy1dDEdaPgNwJf-67gkyHLuztnb-uUNP28X9o1Y"
                alt=""
              />
            </div>
            <div class="text">
              <p class="career">科學家</p>
              <p class="experience">
                我的工作內容需要使用大量英文溝通，看英文文獻或是和海外組織溝通什麼的，E-Friend提供了很多實用的口語交流練習機會...
              </p>
              <p class="name">SHERRY</p>
            </div>
          </div>
        </v-col>
        <v-col cols="4" class="d-flex justify-center">
          <div class="peopleCard d-flex flex-column">
            <div class="img">
              <img
                src="https://s3.amazonaws.com/comicgeeks/characters/avatars/34503.jpg"
                alt=""
              />
            </div>
            <div class="text">
              <p class="career">高中生</p>
              <p class="experience">
                學校上課教的內容真的太無聊了，上課內容制式，時間長，不像E-Friend可以想聊什麼就聊什麼，AI也十分尊敬我這個電鋸人大人...
              </p>
              <p class="name">Denji</p>
            </div>
          </div>
        </v-col>
        <v-col cols="4" class="d-flex justify-center">
          <div class="peopleCard d-flex flex-column">
            <div class="img">
              <img
                src="https://upload.wikimedia.org/wikipedia/zh/6/61/Naruto_20160925.jpg"
                alt=""
              />
            </div>
            <div class="text">
              <p class="career">公務員</p>
              <p class="experience">
                E-Friend真的很適合在家自學的人，時間又彈性，想和AI聊天就聊天，有事關掉，完全沒有壓力。可以選擇自己想要的主題，或是跟AI來個天南地北的Free
                Talk...
              </p>
              <p class="name">NARUTO</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-row>
</template>

<script setup>
import { onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";

const modules = [EffectFade, Navigation, Pagination, Autoplay];

// Options for the first Swiper instance
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
.margin-left {
  margin-left: 1rem;
}
.margin-button-1rem {
  margin-bottom: 1rem;
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
  margin: 1.25rem 0.5rem;
  border: 0.5px solid #eee;
  box-shadow: 1px 2px 2px #aaa;
  height: 120px;
}
.card .text {
  width: 65%;
}

.card .text .title {
  margin-top: 1rem;
  margin-left: 1rem;
  font-weight: bold;
}
.card .text .subtitle {
  margin-top: 0.5rem;
  margin-left: 1rem;

  font-weight: bold;
  font-size: 0.75rem;
  color: #aaa;
}
.card .img {
  width: 35%;
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
.peopleCard .name {
}
</style>
