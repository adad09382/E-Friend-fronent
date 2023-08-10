<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>註冊</h1>
      </v-col>
      <v-divider></v-divider>
      <v-col cols="12">
        <!--將 disabled 屬性綁定到 isSubmitting 變數。isSubmitting 為 true 表單被禁用，不能提交；當 isSubmitting 為 false 時，表單則可以提交。
      .prevent阻止表單的預設提交行為。-->
        <v-form :disabled="isSubmitting" @submit.prevent="submit">
          <v-text-field
            v-model="account.value.value"
            :error-messages="account.errorMessage.value"
            label="帳號"
            counter
            maxLength="20"
          ></v-text-field>
          <v-text-field
            v-model="email.value.value"
            :error-messages="email.errorMessage.value"
            label="信箱"
            type="email"
          ></v-text-field>
          <v-text-field
            v-model="password.value.value"
            :error-messages="password.errorMessage.value"
            label="密碼"
            counter
            maxLength="20"
            type="password"
          ></v-text-field>
          <v-text-field
            v-model="passwordConfirm.value.value"
            :error-messages="passwordConfirm.errorMessage.value"
            label="確認密碼"
            maxLength="20"
            counter
            type="password"
          ></v-text-field>
          <div class="text-center">
            <v-btn type="submit" color="green">註冊</v-btn>
          </div>
        </v-form>
      </v-col>
      <v-col cols="12"></v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive } from "vue";
import validator from "validator";
// 驗證套件，驗證form & field欄位
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { api } from "@/plugins/axios";
import { useSnackbar } from "vuetify-use-dialog";
import { useRouter } from "vue-router";
// 使用Snackbar & vueRouter
const createSnackbar = useSnackbar();
const router = useRouter();
// yup 驗證規則schema 設置
const schema = yup.object({
  account: yup
    .string()
    .required("帳號必填")
    .min(4, "帳號最少4個字")
    .max(20, "帳號最多20個字"),
  email: yup
    .string()
    .required("帳號必填")
    // 自訂驗證，參數：驗證名稱、錯誤信息、驗證方法
    .test("isEmail", "Email格式錯誤", (value) => validator.isEmail(value)),
  password: yup
    .string()
    .required("密碼必填")
    .min(4, "密碼最少4個字")
    .max(20, "密碼最多20個字"),
  passwordConfirm: yup
    .string()
    .required("密碼必填")
    .min(4, "密碼最少4個字")
    .max(20, "密碼最多20個字")
    // yup.ref 會在此 schema 中去找參照，並判斷兩者是否一致
    .oneOf([yup.ref("password")], "密碼不一致"),
});

// handleSubmit 當表單送出時觸發(看要執行什麼callbackfn)
// isSubmitting 表單是否再送出狀態,handleReset 可以重置表單
const { handleSubmit, isSubmitting, handleReset } = useForm({
  validationSchema: schema, // 將useForm驗證規則，設定為 yup 驗證規則schema
});

// 驗證欄位要使用 useField
const account = useField("account");
const email = useField("email");
const password = useField("password");
const passwordConfirm = useField("passwordConfirm");

// function
const submit = handleSubmit(async (value) => {
  console.log("送出註冊表單");
  // handleSubmit的value參數為表單內容存成的Object，
  try {
    await api.post("/users", {
      account: value.account,
      email: value.email,
      password: value.password,
    });
    createSnackbar({
      text: "註冊成功",
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: "green",
        location: "bottom",
      },
    });
    router.push("/login");
    console.log("跳轉到登入頁");
  } catch (error) {
    createSnackbar({
      text: error.response.data.message,
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: "red",
        location: "bottom",
      },
    });
    console.log("失敗");
    console.log(error);
  }
});
</script>
