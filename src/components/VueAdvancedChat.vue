<!-- Vuetify 對話框模板 -->

<template>
  <v-container class="fill-height pa-0">
    <v-row class="h-100 no-gutters elevation-4">
      <!-- 對話聊天視窗選單 -->
      <v-col
        cols="3"
        sm="2"
        class="flex-grow-1 flex-shrink-0"
        style="border-right: 1px solid #0000001f"
      >
        <v-responsive class="overflow-y-auto fill-height" height="500">
          <v-list subheader>
            <v-list-item-group v-model="activeChat">
              <template
                v-for="(item, index) in parents"
                :key="`parent${index}`"
              >
                <v-list-item :value="item.id">
                  <v-list-item-avatar color="grey lighten-1 white--text">
                    <v-icon> chat_bubble </v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title" />
                    <!-- <v-list-item-subtitle v-text="'hi'" /> -->
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-icon
                      :color="item.active ? 'deep-purple accent-4' : 'grey'"
                    >
                      chat_bubble
                    </v-icon>
                  </v-list-item-icon>
                </v-list-item>
                <v-divider class="my-0" />
              </template>
            </v-list-item-group>
          </v-list>
        </v-responsive>
      </v-col>

      <!-- 對話內容框 -->
      <v-col cols="auto" class="flex-grow-1 flex-shrink-0">
        <v-responsive
          v-if="activeChat"
          class="overflow-y-hidden fill-height"
          height="500"
        >
          <v-card flat class="d-flex flex-column fill-height">
            <v-card-title class="flex-grow-0"> john doe </v-card-title>
            <v-card-text class="flex-shrink-1 overflow-y-auto">
              <template v-for="(msg, i) in messages">
                <div :class="{ 'd-flex flex-row-reverse': msg.me }">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                      <v-hover v-slot:default="{ hover }">
                        <v-chip
                          :color="msg.me ? 'primary' : ''"
                          dark
                          style="height: auto; white-space: normal"
                          class="pa-4 mb-2"
                          v-on="on"
                        >
                          {{ msg.content }}
                          <sub class="ml-2" style="font-size: 0.5rem">{{
                            msg.created_at
                          }}</sub>
                          <v-icon v-if="hover" small> expand_more </v-icon>
                        </v-chip>
                      </v-hover>
                    </template>
                    <v-list>
                      <v-list-item>
                        <v-list-item-title>delete</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </template>
            </v-card-text>
            <v-card-text class="flex-grow-0">
              <v-text-field
                v-model="messageForm.content"
                label="type_a_message"
                type="text"
                no-details
                outlined
                append-inner-icon="mdi-send"
                @click:append-inner="messages.push(messageForm)"
                @keyup.enter="messages.push(messageForm)"
                append-icon="mdi-microphone"
                @click:append="messages.push(messageForm)"
                hide-details
              />
            </v-card-text>
          </v-card>
        </v-responsive>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref, reactive } from "vue";
let activeChat = ref(1);
let parents = reactive([
  {
    id: 1,
    title: "對話1",
    active: true,
  },
  {
    id: 3,
    title: "對話2",
    active: true,
  },
]);
let messages = reactive([
  {
    content: "lorem ipsum",
    me: true,
    created_at: "11:11am",
  },
]);
let messageForm = reactive({
  content: "",
  me: true,
  created_at: "11:11am",
});
</script>
