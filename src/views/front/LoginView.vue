<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>登入</h1>
      </v-col>
      <v-divider></v-divider>
      <v-col cols="12">
        <v-form :disabled="isSubmitting" @submit.prevent="submit">
          <v-text-field
            v-model="account.value.value"
            :error-messages="account.errorMessage.value"
            label="帳號"
            counter
            maxLength="20"
          ></v-text-field>
          <v-text-field
            v-model="password.value.value"
            :error-messages="password.errorMessage.value"
            label="密碼"
            counter
            maxLength="20"
            type="password"
          ></v-text-field>
          <div class="text-center">
            <v-btn type="submit" color="green">登入</v-btn>
          </div>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { useSnackbar } from "vuetify-use-dialog";
import { useRouter } from "vue-router";
import { api } from "@/plugins/axios.js";
import { useUserStore } from "@/store/user.js";

const createSnackbar = useSnackbar();
const router = useRouter();
const user = useUserStore();

// 定義驗證schema
const schema = yup.object({
  account: yup
    .string()
    .required("帳號必填")
    .min(4, "最少4個字")
    .max(20, "最多20個字"),
  password: yup
    .string()
    .required("密碼必填")
    .min(4, "最少4個字")
    .max(20, "最多20個字"),
});
// 注意要先使用 useForm 才可用 useField
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
});

const account = useField("account");
const password = useField("password");

const submit = handleSubmit(async (values) => {
  try {
    const { data } = await api.post("/users/login", {
      account: values.account,
      password: values.password,
    });
    user.login(data);
    createSnackbar({
      text: "登入成功",
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: "green",
        location: "bottom",
      },
    });
    router.push("/");
  } catch (error) {
    console.log(error);
    createSnackbar({
      text: error.response.data.message,
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: "red",
        location: "bottom",
      },
    });
  }
});
</script>
