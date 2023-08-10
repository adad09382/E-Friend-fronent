<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <h1 class="text-center">話題管理</h1>
      </VCol>
      <VDivider></VDivider>
      <VCol cols="12">
        <VBtn color="green" @click="openDialog">新增話題</VBtn>

        <VDataTableServer
          v-model:items-per-page="tableItemsPerPage"
          v-model:page="tablePage"
          :items="tableProducts"
          :headers="tableHeaders"
          :loading="tableLoading"
          :items-length="tableItemsLength"
          :search="tableSearch"
          hover
          @update:items-per-page="tableLoadItems"
          @update:page="tableLoadItems"
        >
          <template #top> </template>
          <template #[`item.image`]="{ item }">
            <VImg :src="item.raw.image" height="50px"></VImg>
          </template>
          <template #[`item.active`]="{ item }">
            <VIcon icon="mdi-check" v-if="item.raw.active"></VIcon>
            <VIcon icon="mdi-close" v-if="!item.raw.active"></VIcon>
          </template>
          <template #[`item.edit`]="{ item }">
            <VBtn
              icon="mdi-pencil"
              @click="tableEditItem(item.raw)"
              variant="text"
            ></VBtn>
          </template>
        </VDataTableServer>
      </VCol>
    </VRow>
  </VContainer>

  <!-- 新增話題用的Dialog -->
  <VDialog persistent width="500px" v-model="dialog">
    <VForm :disabled="isSubmitting" @submit.prevent="submit">
      <VCard>
        <VCardTitle>{{
          dialogId.length > 0 ? "編輯話題" : "新增話題"
        }}</VCardTitle>
        <VCardText>
          <VTextField
            label="名稱"
            v-model="topic.value.value"
            :error-messages="topic.errorMessage.value"
          ></VTextField>
          <VTextarea
            label="Prompt內文"
            v-model="content.value.value"
            :error-messages="content.errorMessage.value"
          ></VTextarea>
          <VSelect
            label="分類"
            v-model="category.value.value"
            :error-messages="category.errorMessage.value"
            :items="categories"
          ></VSelect>
          <VCheckbox
            label="啟用話題"
            v-model="active.value.value"
            :error-messages="active.errorMessage.value"
          ></VCheckbox>
          <VueFileAgent
            v-model="files"
            v-model:raw-model-value="rawFiles"
            :max-files="1"
            max-size="1MB"
            accept="image/jpg,image/jpeg,image/png"
            :multiple="false"
            :error-text="{ type: '檔案格式錯誤', size: '檔案太大' }"
            help-text="選擇檔案或拖放到這裡"
            deletable
            ref="fileAgent"
          ></VueFileAgent>
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
import { ref } from "vue";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { apiAuth } from "@/plugins/axios";
import { useSnackbar } from "vuetify-use-dialog";

const createSnackbar = useSnackbar();

// 目前表格設定一頁幾筆
const tableItemsPerPage = ref(10);

// 目前表格頁碼
const tablePage = ref(1);
// 表格商品
const tableProducts = ref([]);
// 表格欄位
const tableHeaders = [
  { title: "圖片", align: "center", sortable: false, key: "image" },
  { title: "話題名稱", align: "center", sortable: false, key: "topic" },
  { title: "Prompt內文", align: "center", sortable: false, key: "content" },
  { title: "分類", align: "center", sortable: false, key: "category" },
  { title: "話題啟用", align: "center", sortable: false, key: "active" },
  { title: "編輯", align: "center", sortable: false, key: "edit" },
];
// 表格載入狀態
const tableLoading = ref(false);
// 表格總資料數
const tableItemsLength = ref(0);
// 表格搜尋
const tableSearch = ref("");
const tableApplySearch = () => {
  tablePage.value = 1;
  tableLoadItems();
};
// 表格載入資料
const tableLoadItems = async () => {
  tableLoading.value = true;
  try {
    const { data } = await apiAuth.get("/prompts/all", {
      params: {
        page: tablePage.value,
        itemsPerPage: tableItemsPerPage.value,
      },
    });
    console.log("管理表單頁面，成功獲得all prompt到前端");
    tableProducts.value.splice(0, tableProducts.value.length, ...data.result);
    tableItemsLength.value = data.result.length;
  } catch (error) {
    createSnackbar({
      text: error.response?.data.message || "發生錯誤",
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: "red",
        location: "bottom",
      },
    });
  }
  tableLoading.value = false;
};

tableLoadItems();
// 表格編輯
const tableEditItem = (item) => {
  // 設定表單 id
  dialogId.value = item._id;
  // 表單填入預設值
  topic.value.value = item.topic;
  content.value.value = item.content;
  category.value.value = item.category;
  active.value.value = item.active;
  // 打開表單
  dialog.value = true;
};

// 表單對話框
const dialog = ref(false);
const dialogId = ref("");
const openDialog = () => {
  dialogId.value = "";
  dialog.value = true;
};
const closeDialog = () => {
  dialog.value = false;
  resetForm();
  fileAgent.value.deleteFileRecord();
};

// 表單
const categories = [
  "日常話題",
  "興趣話題",
  "旅遊話題",
  "職場話題",
  "考試口說",
  "情境話題",
];
const schema = yup.object({
  topic: yup.string().required("缺少名稱"),
  content: yup.string().required("缺少prompt內容"),
  category: yup
    .string()
    .required("缺少分類")
    .test("isCategory", (value) => categories.includes(value)),
  active: yup.boolean(),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    topic: "",
    content: "",
    category: "",
    active: false,
  },
});
const topic = useField("topic");
const content = useField("content");
const category = useField("category");
const active = useField("active");

const files = ref([]);
const rawFiles = ref([]);
const fileAgent = ref(null);

const submit = handleSubmit(async (values) => {
  if (dialogId.value.length === 0 && files.value.length === 0) return;
  try {
    const fd = new FormData();
    fd.append("topic", values.topic);
    fd.append("content", values.content);
    fd.append("category", values.category);
    fd.append("active", values.active);
    if (files.value.length > 0) {
      fd.append("image", files.value[0].file);
    }

    if (dialogId.value.length > 0) {
      console.log("開始修改prompt(前端)");
      await apiAuth.patch("/prompts/" + dialogId.value, fd);
    } else {
      console.log("開始新增prompt (前端)");

      await apiAuth.post("/prompts", fd);
    }
    createSnackbar({
      text: "新增成功",
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: "green",
        location: "bottom",
      },
    });
    closeDialog();
    tableLoadItems();
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
