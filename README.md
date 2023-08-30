# E-Friend 你的英語口說練習好夥伴

這是一個為英語學習者設計的AI英語口說練習平台。

### 請在PC端使用Chrome瀏覽器開啟demo，其他瀏覽器可能會因為web api 兼容問題使網頁功能無法正常運作

[專案 demo 連結](https://adad09382.github.io/E-Friend-frontend/#/)

注意! 由於本專案後台目前是託管在免費的雲端服務商，後端響應時間約要3-5分鐘，所以在**一進入專案demo連結時，畫面顯示全白為正常現象**，還**請耐心等待**。

---

## 背景

隨著AI科技進展與進步，想說可藉由串接多個不同API服務達到與AI進行英語口說練習的效果，解決真人教師較貴且可能需要配合老師的痛點

---

## 功能特點

**話題選擇**：允許用戶選擇他們感興趣的話題，進行模擬對話，確保學習過程更有趣且相關。

**新聞討論**：提供較新的新聞文章，讓用戶可以閱讀並與AI進行深入的討論，提高他們的批判思考和表達能力。

**兼具語音與文字輸入**：點擊麥克風開始語音識別，可將用戶的口說內容轉換成文字；也可以直接在文字輸入框輸入想輸入的內容。

**互動模擬對話**：AI會根據選擇的話題prompt模仿真實生活場景，讓用戶可以與AI進行模擬對話，提高口說自信。

**錄音與回放**：用戶可回放自己的語音與AI回應的語音，方便重複學習。

---

## 專案安裝與使用設定

1.先確保你已經安裝了 Node.js

2.clone 以下2個存儲庫：

    // clone 前端存儲庫
    git clone git@github.com:adad09382/E-Friend-frontend.git

    // clone 後端存儲庫
    git clone git@github.com:adad09382/ E-Friend-backend.git

3.在專案目錄下安裝必要的套件:

    // 記得在前端與後端的目錄下都要執行npm install的指令
    npm install

4.在專案目錄下建立.env 環境變數檔案:

- 前端env 設定負責接收請求的後端伺服器

        VITE_API = "運行後端的localhost或是線上伺服器連結"
        // 例如：
        VITE_API=http://localhost:4000

- 後端 env 設定資料庫URL、CLOUDINARY設定(存儲媒體資料的雲端空間)、OPENAI_KEY、NEWS_API

          //後端env 設定較多包含以下內容：
          DB_URL = "你的資料庫URL LINK"
          CLOUDINARY_NAME= "你的CLOUDINARY_NAME"
          CLOUDINARY_KEY= "你的CLOUDINARY_KEY"
          CLOUDINARY_SECRET= "你的CLOUDINARY_SECRET"
          OPENAI_KEY= "你的OPENAI_KEY"
          NEWS_API= "你的NEWS_API"

  5.在前後端都執行運行指令:

      npm run dev

以上步驟即可運行本專案

---

## 網頁功能展示

### 1. 首頁

\
在未登入的情況下用戶只能瀏覽專案首頁，可在首頁的AI聊新聞部分點擊more news 切換新聞。

用戶可通過點擊畫面右上的註冊，若在未登入情況下點擊輪播圖中的進入對話按鈕，則會跳轉到登入頁面，需要是登入狀態才能進入其他頁面

![homePage_nologin](readmeImg/homePage_nologin.gif)

### 2. 探索話題頁面

\
用戶登入後點擊導覽列的**探索話題**可跳轉到話題頁面，可以在這裡選擇一個話題與AI開始對話，有多種不同的話題，可使用下拉選單來快速過濾想要的話題，最後**點擊LET'S TALK 即可進入與AI的對話。**

對話畫面一開始會由AI先發起對話，點擊播放按鈕即可播放AI發出的內容，點"文"則可以看到AI發出內容的文本，點擊畫面右下的"麥克風"後開始可以語音輸入，當輸入完成後，再次點"麥克風"，會將輸入的內容傳送出去，AI收到後會再根據用戶傳的內容再次回復。

畫面右下"麥克風"按鈕上方有一個"P"鈕，點擊會顯示目前對話Prompt的情境與目的，讓用戶在忘記該對話場景時，只要點一下就可以回想起。

**點擊本gif可跳轉到demo影片**
[![TopicPageDemo](readmeImg/topicPage.gif)](https://youtu.be/gVFL-XRcxXw "TopicPageDemo")

### 3. 新聞話題頁面

\
點擊導覽列的**探索新聞**可以進入新聞頁面，一進入新聞頁面會有3則新聞放在輪播圖中，頁面往下滑可以看到更多的新聞，點擊新聞標題會打開新分頁，該分頁為開新聞頁面，**點擊新聞上的LET'S TALK 即可進入與AI的對話。**

**點擊本gif可跳轉到demo影片**
[![NewsPageDemo](readmeImg/newsPage.gif)](https://youtu.be/J3EhTQxzSzc "NewsPageDemo")

### 4. 我的對話頁面

\
點擊我的對話頁面可以進入過往的對話紀錄中，若沒有對話則會顯示請從"探索話題"或"新聞話題開始"

**沒有對話紀錄會跳出錯誤**
![noConversationYet](readmeImg/noConversationYet.png)
**有對話紀錄則跳到過往對話頁面**

![conversationHistory](readmeImg/conversationHistory.gif)

### 5. 管理員頁面

\
當具有管理員權限用戶登入後，右上會有管理選項，點擊後即可進入管理員頁面，管理員頁面可以增改刪查"探索對話"中的prompt。

![adminPage.gif](readmeImg/adminPage.gif)

**以上是目前E-Friend的全功能說明**

## 聯繫和支援

如有任何疑問或建議，請通過 d0372996@example.com 聯繫我，或在此存儲庫中提出 issue。
