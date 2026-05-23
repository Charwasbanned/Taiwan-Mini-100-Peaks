document.addEventListener("DOMContentLoaded", function () {
    // 1. 從網址列解析參數，取得點擊帶過來的山脈 Mt_id
    const urlParams = new URLSearchParams(window.location.search);
    const targetId = parseInt(urlParams.get("id"));

    // 檢查網址有沒有正確取得山脈 ID
    if (!targetId) {
        alert("未偵測到正確的山脈 ID，為您返回指南首頁。");
        window.location.href = "index.html";
        return;
    }

    // 2. 使用 fetch 非同步讀取同資料夾下的 mountains.json
    fetch("mountains.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    "無法讀取小百岳 JSON 資料檔，請確認檔案路徑是否正確！",
                );
            }
            return response.json();
        })
        .then((mountainsData) => {
            // 3. 在 100 座山的陣列資料中，比對 Mt_id 找出該座山
            const mountain = mountainsData.find(
                (item) => item.Mt_id === targetId,
            );

            if (mountain) {
                // 4. 將抓到的真實資料動態寫入 HTML 對應的 ID 元素中
                document.getElementById("mtName").textContent =
                    mountain.Mt_name;
                document.getElementById("mtEnglish").textContent =
                    mountain.Mt_name_english;
                document.getElementById("mtHeight").textContent =
                    mountain.Mt_height;
                document.getElementById("mtLoc").textContent = mountain.Mt_loc;
                document.getElementById("mtRegion").textContent =
                    mountain.Mt_region;
                document.getElementById("mtTransportation").textContent =
                    mountain.Mt_transportation_route;
                document.getElementById("mtDescription").textContent =
                    mountain.Mt_description;

                //載入山脈圖片
                const imgEl = document.getElementById("mtImg");
                const placeholderEl = document.getElementById("placeholder");

                // 嘗試載入對應 ID 的圖片
                imgEl.src = `images/${targetId}.jpg`;

                // 如果圖片成功載入
                imgEl.onload = function () {
                    imgEl.style.display = "block";
                    placeholderEl.style.display = "none";
                };

                // 如果圖片不存在或載入失敗 自動切回預設的灰色 placeholder
                imgEl.onerror = function () {
                    imgEl.style.display = "none";
                    placeholderEl.style.display = "block";
                };

                // 5. 將目前山脈的 ID 寫入紀錄按鈕的 data-id 屬性，方便下一個階段的日記紀錄系統讀取
                const statusBtn = document.getElementById("statusBtn");
                statusBtn.style.cursor = "default";
                statusBtn.disabled = true;

                // 呼叫更新按鈕視覺的函式
                updateButtonVisual(mountain.Mt_id);

                /* 山脈圖片，可以在這裡加上：
                   if (mountain.Mt_img) {
                       const imgEl = document.getElementById("mtImg");
                       imgEl.src = mountain.Mt_img;
                       imgEl.style.display = "block";
                       document.querySelector(".image-placeholder").style.display = "none";
                   }
                */
            } else {
                // 如果在 JSON 裡找不到這個 ID 數字
                alert("找不到該小百岳的詳細資料，為您返回首頁。");
                window.location.href = "index.html";
            }
        })
        .catch((error) => {
            console.error("錯誤資訊:", error);
            document.getElementById("mtDescription").textContent =
                "系統載入失敗：無法成功載入小百岳資料，請檢查 mountains.json 檔案。";
        });
});

function updateButtonVisual(mountainId) {
    const statusBtn = document.getElementById("statusBtn");

    // 從 localStorage 抓出已爬過的山（約定好使用 climbedMountains 這個 Key）
    let climbedMountains =
        JSON.parse(localStorage.getItem("climbedMountains")) || [];

    // 檢查目前這座山有沒有在已完成的名單中
    if (climbedMountains.includes(mountainId)) {
        statusBtn.textContent = "已完成";
        statusBtn.className = "status-badge completed";
    } else {
        statusBtn.textContent = "未完成";
        statusBtn.className = "status-badge uncompleted";
    }
}
