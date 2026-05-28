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
            alert("暱稱不能大於10個字");
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
        // 刷新讓其他版面也一起更新
        window.location.reload();
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

// --- 資料匯出/匯入功能 ---
document.addEventListener("DOMContentLoaded", function () {
    const exportBtn = document.getElementById("exportBtn");
    const importBtn = document.getElementById("importBtn");
    const importInput = document.getElementById("importInput");

    // 1. 匯出功能
    exportBtn.addEventListener("click", () => {
        // 將要匯出的 localStorage 資料打包成一個物件
        const exportData = {
            myUserName: localStorage.getItem("myUserName") || "User",
            myUserAvatar:
                localStorage.getItem("myUserAvatar") ||
                "images/default_pfp.jpg",
            myDiaries: JSON.parse(localStorage.getItem("myDiaries")) || [],
            climbedMountains:
                JSON.parse(localStorage.getItem("climbedMountains")) || [],
        };

        // 轉成 JSON 格式的字串
        const dataStr = JSON.stringify(exportData, null, 2);

        // 建立 Blob 物件 (MIME type 為 application/json)
        const blob = new Blob([dataStr], { type: "application/json" });
        // 產生一個網頁內部的暫存下載連結
        const url = URL.createObjectURL(blob);

        // 建立一個隱藏的 <a> 標籤來觸發下載
        const a = document.createElement("a");
        a.href = url;
        // 設定下載的預設檔名，加上當天的日期
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        a.download = `小百岳紀錄_${today}.json`;

        document.body.appendChild(a);
        a.click(); // 模擬點擊下載

        // 下載完畢後清除隱藏標籤與釋放記憶體
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // 2. 觸發隱藏的檔案上傳輸入框
    importBtn.addEventListener("click", () => {
        importInput.click();
    });

    // 3. 匯入功能
    importInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (event) {
            try {
                // 將讀取到的純文字轉回 JSON 物件
                const importedData = JSON.parse(event.target.result);

                // 檢查檔案
                if (
                    importedData.myDiaries !== undefined &&
                    importedData.climbedMountains !== undefined
                ) {
                    // 跳出警告，再次確認使用者意願
                    if (
                        !confirm(
                            "警告：匯入新紀錄將會完全覆蓋目前的進度、頭貼與日記！確定要繼續嗎？",
                        )
                    ) {
                        importInput.value = ""; // 如果取消，清空選擇
                        return;
                    }

                    // 將資料寫回 localStorage
                    if (importedData.myUserName)
                        localStorage.setItem(
                            "myUserName",
                            importedData.myUserName,
                        );
                    if (importedData.myUserAvatar)
                        localStorage.setItem(
                            "myUserAvatar",
                            importedData.myUserAvatar,
                        );
                    localStorage.setItem(
                        "myDiaries",
                        JSON.stringify(importedData.myDiaries),
                    );
                    localStorage.setItem(
                        "climbedMountains",
                        JSON.stringify(importedData.climbedMountains),
                    );

                    alert("匯入成功！點擊確定後將重新載入頁面。");
                    window.location.reload(); // 重新整理頁面以顯示新資料
                } else {
                    alert(
                        "匯入失敗：檔案格式不正確，請確認這是由本系統匯出的紀錄檔。",
                    );
                }
            } catch (error) {
                alert("檔案讀取錯誤，請確認檔案是否為 JSON 格式。");
            }

            // 清空 input，讓下次即使選同一個檔案也能正常觸發 change 事件
            importInput.value = "";
        };

        // 將檔案讀取為文字
        reader.readAsText(file);
    });
});

// ==========================================
// 自動計算並更新「我的空間」進度條與圓環邏輯
// ==========================================
function updateDashboardProgress() {
    // 1. 取得已完成的山脈 ID 清單 (從日記儲存的 localStorage 抓取)
    const climbedIds =
        JSON.parse(localStorage.getItem("climbedMountains")) || [];

    // 2. 讀取 mountains.json 來進行比對與分類
    fetch("mountains.json")
        .then((response) => response.json())
        .then((data) => {
            // 初始化各區域的計數器
            const regionStats = {
                北部區域: { total: 0, climbed: 0 },
                中部區域: { total: 0, climbed: 0 },
                南部區域: { total: 0, climbed: 0 },
                東部區域: { total: 0, climbed: 0 },
                離島區域: { total: 0, climbed: 0 },
            };

            let totalMountains = data.length;
            let totalClimbed = 0;

            // 3. 遍歷 100 座山，統計總數與已攀登數量
            data.forEach((mt) => {
                if (regionStats[mt.Mt_region]) {
                    regionStats[mt.Mt_region].total++; // 該區域總數 +1

                    // 如果這座山的 ID 在已攀登清單中
                    if (climbedIds.includes(mt.Mt_id)) {
                        regionStats[mt.Mt_region].climbed++;
                        totalClimbed++;
                    }
                }
            });

            // 4. 更新總進度圓環 (SVG)
            const totalPct =
                totalMountains === 0
                    ? 0
                    : Math.round((totalClimbed / totalMountains) * 100);
            document.querySelector(".circle_pct").textContent = `${totalPct}%`;

            // 計算 SVG 圓環的周長 (半徑 r=66, 周長 = 2 * pi * 66 ≒ 414.69)
            const circumference = 2 * Math.PI * 66;
            const dashValue = (totalPct / 100) * circumference; // 計算填滿的長度

            // 選取第二個 circle (負責顯示進度條的)
            const progressCircle = document.querySelectorAll(
                ".circle_wrap svg circle",
            )[1];
            if (progressCircle) {
                // 利用 stroke-dasharray 控制圓環長度，加上平滑轉場效果
                progressCircle.style.transition =
                    "stroke-dasharray 1s ease-in-out";
                // 延遲一下確保進度條從0跑
                setTimeout(() => {
                    progressCircle.setAttribute(
                        "stroke-dasharray",
                        `${dashValue} ${circumference}`,
                    );
                }, 50);
            }

            // 5. 更新下方五個區域的橫向進度條
            const processBars = document.querySelectorAll(".process_bar");
            processBars.forEach((bar) => {
                const regionNameSpan = bar.querySelector(
                    ".bar_header span:first-child",
                );
                const progressNumSpan = bar.querySelector(
                    ".bar_header span:last-child",
                );
                const fillDiv = bar.querySelector(".bar_fill");

                if (regionNameSpan && regionStats[regionNameSpan.textContent]) {
                    const regionName = regionNameSpan.textContent;
                    const stats = regionStats[regionName];

                    // 更新文字 (例如: 5/35)
                    progressNumSpan.textContent = `${stats.climbed}/${stats.total}`;

                    // 計算該區域百分比並更新寬度
                    const barPct =
                        stats.total === 0
                            ? 0
                            : (stats.climbed / stats.total) * 100;
                    fillDiv.style.width = `${barPct}%`;
                    fillDiv.style.transition = "width 1s ease-in-out"; // 加上平滑動畫
                }
            });
        })
        .catch((error) => console.error("無法載入山脈資料以更新進度:", error));
}

// 網頁一載入時，先執行一次更新畫面
document.addEventListener("DOMContentLoaded", function () {
    updateDashboardProgress();
});

// ==========================================
// 1. 讀取打勾紀錄與 JSON 總數、2. 計算包含 LEVEL MAX 的遊戲化等級
// ==========================================
function updateLevel() {
    // 1. 讀取本機快取中已完成的山脈 ID 清單
    const climbedIds =
        JSON.parse(localStorage.getItem("climbedMountains")) || [];

    fetch("mountains.json")
        .then((response) => response.json())
        .then((data) => {
            let totalMountains = data.length; // 總山脈數（100座）
            let totalClimbed = 0; // 已攀登總數

            // 統計玩家總共勾選了幾座山
            data.forEach((mt) => {
                if (climbedIds.includes(mt.Mt_id)) {
                    totalClimbed++;
                }
            });

            // ====================================================
            // 2. 計算包含 LEVEL MAX 的遊戲化等級邏輯
            // ====================================================
            let currentLevel = 1;
            let totalExp = totalClimbed * 100; // 每爬 1 座山 = 100 EXP
            let expNeededForNextLevel = currentLevel * 120; // 升級公式：當前等級 * 120

            // 抓取網頁中的 HTML 元素
            const levelBadge = document.querySelector(".level_badge");
            const expLabel = document.querySelector(".exp_label");
            const expFill = document.querySelector(".exp_fill");

            // 判斷是否 100 座完美封頂
            if (totalClimbed >= 100) {
                // --- 100座全滿：觸發 LEVEL MAX 封頂狀態 ---
                if (levelBadge) levelBadge.textContent = "LV. MAX";
                if (expLabel) expLabel.textContent = "100 / 100 座全制霸！";

                if (expFill) {
                    expFill.style.transition = "width 1.5s ease-out";
                    setTimeout(() => {
                        expFill.style.width = "100%"; // 經驗條扣到底填滿
                    }, 100);
                }
            } else {
                // --- 未滿 100 座：執行逐級扣除計算 ---
                while (totalExp >= expNeededForNextLevel) {
                    totalExp -= expNeededForNextLevel; // 扣掉當前升級所需經驗
                    currentLevel++; // 等級提升
                    expNeededForNextLevel = currentLevel * 120; // 計算下一等新門檻
                }

                // 計算當前等級剩餘經驗值的百分比
                const expPercentage = (totalExp / expNeededForNextLevel) * 100;

                // 更新網頁 UI 文字與動畫
                if (levelBadge) levelBadge.textContent = `LV. ${currentLevel}`;
                if (expLabel)
                    expLabel.textContent = `${totalExp} / ${expNeededForNextLevel}`;

                if (expFill) {
                    expFill.style.transition = "width 1.5s ease-out";
                    setTimeout(() => {
                        expFill.style.width = `${expPercentage}%`; // 經驗條長出動畫
                    }, 100);
                }
            }
        })
        .catch((error) => console.error("資料讀取失敗:", error));
}

// ==========================================
// 關鍵：確保在頁面初次載入完成時執行
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    updateLevel(); // 網頁載入時立刻執行一次
});

// ===== 徽章系統 =====
document.addEventListener("DOMContentLoaded", function () {
    const badgeList = document.querySelector(".badge_list");
    // 從 localStorage 取得已完成的山脈 ID 陣列
    const climbedMountains =
        JSON.parse(localStorage.getItem("climbedMountains")) || [];

    // 讀取山脈總表，用來比對區域數量
    fetch("mountains.json")
        .then((response) => response.json())
        .then((mountainsData) => {
            renderBadges(climbedMountains, mountainsData);
            updateProgress(climbedMountains, mountainsData);
        })
        .catch((error) => console.error("無法載入山脈資料", error));

    // --- 1. 渲染徽章邏輯 ---
    function renderBadges(climbedIds, mountainsData) {
        badgeList.innerHTML = ""; // 清空 HTML 預設的假徽章
        const totalClimbed = climbedIds.length;
        const badges = [];

        if (totalClimbed !== 0) {
            badges.push({
                name: "開始爬山了！",
                img: `images/badges/first_mountain.png`, // 預期你未來上傳的圖檔路徑
                fallbackIcon: "🥾", // 圖片缺失時的 Emoji 佔位符
            });
        }

        // 【數量徽章】每 10 座發一個，迴圈支援到 100 座
        for (let i = 10; i <= Math.min(totalClimbed, 100); i += 10) {
            //50 & 100 外
            if (i != 50 && i != 100) {
                badges.push({
                    name: `${i}岳達成`,
                    img: `images/badges/10_mountain.png`,
                    fallbackIcon: "🏆", // 圖片缺失時的 Emoji 佔位符
                });
            }
            //50座
            if (i == 50) {
                badges.push({
                    name: `${i}岳達成`,
                    img: `images/badges/50_mountain.png`,
                    fallbackIcon: "🏆", // 圖片缺失時的 Emoji 佔位符
                });
            }
            //100座
            if (i == 100) {
                badges.push({
                    name: `${i}岳達成`,
                    img: `images/badges/100_mountain.png`,
                    fallbackIcon: "🏆", // 圖片缺失時的 Emoji 佔位符
                });
            }
        }

        // 【區域徽章】判斷各區域是否全制霸
        const regions = [
            "北部區域",
            "中部區域",
            "南部區域",
            "東部區域",
            "離島區域",
        ];
        regions.forEach((region) => {
            // 抓出該區域所有的山脈 ID
            const regionMtIds = mountainsData
                .filter((mt) => mt.Mt_region === region)
                .map((mt) => mt.Mt_id);

            if (regionMtIds.length > 0) {
                // 檢查該區域的 ID 是否「全部」都存在於使用者的紀錄中
                const isCompleted = regionMtIds.every((id) =>
                    climbedIds.includes(id),
                );
                if (isCompleted) {
                    badges.push({
                        name: `${region}全制霸`,
                        img: `images/badges/${region}.png`,
                        fallbackIcon: "👑",
                    });
                }
            }
        });

        // 渲染到畫面
        if (badges.length === 0) {
            badgeList.innerHTML =
                "<span style='font-size: 13px; color: #637864; margin-top: 5px;'>目前還沒有徽章，繼續努力爬山吧！</span>";
            return;
        }

        badges.forEach((badge) => {
            const badgeItem = document.createElement("div");
            badgeItem.className = "badge_item";
            badgeItem.setAttribute("data-tooltip", badge.name);

            const badgeIcon = document.createElement("div");
            badgeIcon.className = "badge_icon";
            // 預設先放 Emoji 佔位符
            badgeIcon.innerHTML = `<span style="font-size: 24px;">${badge.fallbackIcon}</span>`;

            // 嘗試載入徽章圖片
            const img = new Image();
            img.src = badge.img;
            img.onload = () => {
                // 圖片存在，把 Emoji 清掉並換上背景圖
                badgeIcon.innerHTML = "";
                badgeIcon.style.backgroundImage = `url('${badge.img}')`;
                badgeIcon.style.backgroundPosition = "center";

                if (badge.name.includes("開始")) {
                    badgeIcon.style.backgroundSize = "cover"; // 數量徽章縮小不裁切
                } else {
                    badgeIcon.style.backgroundSize = "80%"; // 其他區域徽章維持填滿
                }

                badgeIcon.style.backgroundRepeat = "no-repeat";
            };
            img.onerror = () => {
                // 圖片不存在，保留 Emoji 並給個預設底色
                badgeIcon.style.backgroundColor = "#d8edcc";
            };

            badgeItem.appendChild(badgeIcon);
            badgeList.appendChild(badgeItem);
        });
    }
});
