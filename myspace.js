document.addEventListener("DOMContentLoaded", function () {
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
