document.addEventListener("DOMContentLoaded", function () {
    // --- 個人資料設定 (頭貼與姓名) ---
    const userNameDisplay = document.getElementById("userNameDisplay");
    const editNameBtn = document.getElementById("editNameBtn");
    const avatarContainer = document.getElementById("avatarContainer");
    const avatarInput = document.getElementById("avatarInput");
    const userAvatar = document.getElementById("userAvatar");

    // 新增：取得改名彈窗相關的 DOM 元素
    const nameModal = document.getElementById("nameModal");
    const newUserNameInput = document.getElementById("newUserNameInput");
    const cancelNameBtn = document.getElementById("cancelNameBtn");
    const saveNameBtn = document.getElementById("saveNameBtn");

    // 1. 網頁載入時，從 localStorage 讀取已儲存的資料（如果沒有就給預設值）
    const savedName = localStorage.getItem("myUserName") || "User";
    const savedAvatar =
        localStorage.getItem("myUserAvatar") || "images/default_pfp.jpg";
    userNameDisplay.textContent = savedName;
    userAvatar.src = savedAvatar;

    // 2. 更改姓名
    editNameBtn.addEventListener("click", () => {
        newUserNameInput.value = userNameDisplay.textContent.trim();
        nameModal.style.display = "flex"; // 打開彈窗
    });

    cancelNameBtn.addEventListener("click", () => {
        nameModal.style.display = "none"; // 關閉彈窗
    });

    saveNameBtn.addEventListener("click", () => {
        const newName = newUserNameInput.value.trim();

        if (newName === "") {
            alert("請輸入暱稱");
            return;
        }

        if (newName.length > 10) {
        alert('暱稱不能大於10個字');
        return;
        }

        userNameDisplay.textContent = newName;
        localStorage.setItem("myUserName", newName); // 存入 localStorage
        nameModal.style.display = "none"; // 關閉彈窗
    });

    // 點擊彈窗外部背景也可以關閉彈窗
    nameModal.addEventListener("click", (e) => {
        if (e.target === nameModal) {
            nameModal.style.display = "none";
        }
    });

    // 3. 更改頭貼
    // 當點擊頭貼圓圈時，自動觸發隱藏的 input 上傳視窗
    avatarContainer.addEventListener("click", () => {
        avatarInput.click();
    });

    // 當使用者選好圖片檔案後
    avatarInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            // 建立 FileReader 物件來讀取圖片內容
            const reader = new FileReader();

            reader.onload = function (event) {
                // event.target.result 就是轉換成 Base64 的長字串
                const base64String = event.target.result;

                // 更新畫面上的圖片
                userAvatar.src = base64String;

                // 存進 localStorage
                try {
                    localStorage.setItem("myUserAvatar", base64String);
                } catch (error) {
                    alert("圖片檔案太大囉！請選擇小於3MB的圖片");
                }
            };

            // 讀取檔案並轉換成 Data URL (Base64字串)
            reader.readAsDataURL(file);
        }
    });
    // --- 個人資料設定結束 ---

    // --- 日記部分 ---
    // 取得 DOM 元素（新增日記相關）
    const diaryModal = document.getElementById("diaryModal");
    const noteAddBtn = document.querySelector(".note_add_btn");
    const cancelDiaryBtn = document.getElementById("cancelDiaryBtn");
    const saveDiaryBtn = document.getElementById("saveDiaryBtn");
    const mountainSelect = document.getElementById("mountainSelect");
    const noteList = document.querySelector(".note_list");

    // 取得 DOM 元素（查看日記相關）
    const viewDiaryModal = document.getElementById("viewDiaryModal");
    const closeViewBtn = document.getElementById("closeViewBtn");
    const viewDiaryTitle = document.getElementById("viewDiaryTitle");
    const viewDiaryMountain = document.getElementById("viewDiaryMountain");
    const viewDiaryDate = document.getElementById("viewDiaryDate");
    const viewDiaryContent = document.getElementById("viewDiaryContent");

    // 1. 讀取 mountains.json 填入下拉選單
    fetch("mountains.json")
        .then((response) => response.json())
        .then((data) => {
            data.forEach((mt) => {
                const option = document.createElement("option");
                option.value = mt.Mt_id;
                option.textContent = `${mt.Mt_id}. ${mt.Mt_name} (${mt.Mt_region})`;
                mountainSelect.appendChild(option);
            });
        })
        .catch((error) => console.error("無法載入山脈資料", error));

    // 2. 開關「新增日記」彈窗事件
    noteAddBtn.addEventListener("click", () => {
        diaryModal.style.display = "flex";
    });
    cancelDiaryBtn.addEventListener("click", () => {
        diaryModal.style.display = "none";
        clearModal();
    });

    // 儲存日記邏輯
    saveDiaryBtn.addEventListener("click", () => {
        const title = document.getElementById("diaryTitle").value.trim();
        const mtId = parseInt(mountainSelect.value);
        const content = document.getElementById("diaryContent").value.trim();

        if (!title || !mtId || !content) {
            alert("請完整填寫所有欄位！");
            return;
        }

        const selectedOption =
            mountainSelect.options[mountainSelect.selectedIndex];
        const mtName = selectedOption.textContent.split(". ")[1].split(" (")[0];

        const today = new Date();
        const dateString = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}`;

        const newDiary = {
            title: title,
            mtId: mtId,
            mtName: mtName,
            content: content,
            date: dateString,
        };

        let diaries = JSON.parse(localStorage.getItem("myDiaries")) || [];
        diaries.unshift(newDiary); // 讓新日記排在最前面
        localStorage.setItem("myDiaries", JSON.stringify(diaries));

        let climbed =
            JSON.parse(localStorage.getItem("climbedMountains")) || [];
        if (!climbed.includes(mtId)) {
            climbed.push(mtId);
            localStorage.setItem("climbedMountains", JSON.stringify(climbed));
        }

        diaryModal.style.display = "none";
        clearModal();
        renderDiaries();
    });

    // 清空新增欄位
    function clearModal() {
        document.getElementById("diaryTitle").value = "";
        mountainSelect.value = "";
        document.getElementById("diaryContent").value = "";
    }

    // 3. 關閉「查看日記」彈窗事件
    closeViewBtn.addEventListener("click", () => {
        viewDiaryModal.style.display = "none";
    });

    // 4. 在畫面上渲染日記列表，並綁定點擊展開功能
    function renderDiaries() {
        let diaries = JSON.parse(localStorage.getItem("myDiaries")) || [];
        noteList.innerHTML = "";

        if (diaries.length === 0) {
            noteList.innerHTML =
                "<p style='text-align:center; color:#637864; margin-top:20px;'>目前還沒有日記，趕快去爬一座山吧！</p>";
            return;
        }

        diaries.forEach((diary) => {
            const card = document.createElement("div");
            card.className = "note_card";
            card.style.cursor = "pointer"; // 讓滑鼠移過去時顯示手指游標，提示使用者這可以點擊

            card.innerHTML = `
                <span class="note_card_date">${diary.date}</span>
                <span class="note_card_mountain">⛰️ ${diary.mtName}｜${diary.title}</span>
                <p class="note_card_preview">${diary.content}</p>
            `;

            //為每張日記卡片綁定點擊事件
            card.addEventListener("click", () => {
                viewDiaryTitle.textContent = diary.title;
                viewDiaryMountain.textContent = `⛰️ ${diary.mtName}`;
                viewDiaryDate.textContent = diary.date;
                viewDiaryContent.textContent = diary.content; // 將完整長內文塞入彈窗
                viewDiaryModal.style.display = "flex"; // 開啟彈窗
            });

            noteList.appendChild(card);
        });
    }

    // 初始載入渲染
    renderDiaries();
});

//導覽列

// 讓內頁導覽列的首頁按鈕，在點擊時能正常跳回首頁
document.addEventListener("DOMContentLoaded", function () {
    const mainBtn = document.getElementById("mainBtn");
    if (mainBtn) {
        mainBtn.addEventListener("click", () => {
            let currentPath = window.location.pathname;
            let basePath = currentPath.substring(
                0,
                currentPath.lastIndexOf("/"),
            );
            window.location.href =
                window.location.origin + basePath + "/index.html";
        });
    }
});

// 讓內頁導覽列的我的空間按鈕，在點擊時能跳到我的空間
document.addEventListener("DOMContentLoaded", function () {
    const mySpaceBtn = document.getElementById("mySpaceBtn");
    if (mySpaceBtn) {
        mySpaceBtn.addEventListener("click", () => {
            let currentPath = window.location.pathname;
            let basePath = currentPath.substring(
                0,
                currentPath.lastIndexOf("/"),
            );
            window.location.href =
                window.location.origin + basePath + "/myspace.html";
        });
    }
});
