// 1. 在最外層宣告全域變數，用來儲存所有的山脈資料，這樣搜尋功能才抓得到數據
let allMountains = [];

document.addEventListener("DOMContentLoaded", function () {
    // 讀取mountains.json
    fetch("mountains.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("無法讀取 JSON 檔案");
            }
            return response.json();
        })
        .then((mountainsData) => {
            // 將非同步抓到的資料賦值給全域變數
            allMountains = mountainsData;

            // 跑迴圈把每座山塞到對應的區域
            mountainsData.forEach((mountain) => {
                // 根據山脈的區域，找到對應的 <ul> 容器
                const targetMenu = document.querySelector(
                    `.mountain_menu[data-region="${mountain.Mt_region}"]`,
                );

                if (targetMenu) {
                    const li = document.createElement("li");
                    li.className = "mountain";

                    //山脈按鈕超連結
                    const link = document.createElement("a");
                    link.href = `mt_card.html?id=${mountain.Mt_id}`;
                    link.textContent = mountain.Mt_name;
                    link.style.textDecoration = "none";
                    link.style.color = "inherit";

                    li.appendChild(link);
                    targetMenu.appendChild(li);
                }
            });
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("載入山脈資料失敗");
        });

    
    const searchInput = document.getElementById("search");
    if (searchInput) {
        searchInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                checkSearch();
            }
        });
    }
});

// ===== 搜尋跳轉功能 =====
function checkSearch() {
    const searchInput = document.getElementById("search");
    if (!searchInput) return;

    // 取得使用者輸入的值，並利用 trim() 去除前後空白
    const keyword = searchInput.value.trim();

    if (keyword === "") {
        alert("請輸入想搜尋的山脈名稱！");
        return;
    }

  
    const matchedMountain = allMountains.find((mountain) =>
        mountain.Mt_name.includes(keyword)
    );

    if (matchedMountain) {
    
        window.location.href = `mt_card.html?id=${matchedMountain.Mt_id}`;
    } else {
      
        alert(`找不到與「${keyword}」相關的山脈，請重新輸入！`);
    }
}

// ===== 導覽列滾動 =====
const mainBtn = document.getElementById("mainBtn");
const mySpaceBtn = document.getElementById("mySpaceBtn");
const northBtn = document.getElementById("northBtn");
const centerBtn = document.getElementById("centerBtn");
const southBtn = document.getElementById("southBtn");
const eastBtn = document.getElementById("eastBtn");
const islandBtn = document.getElementById("islandBtn");

const northSection = document.getElementById("northSection");
const centerSection = document.getElementById("centerSection");
const southSection = document.getElementById("southSection");
const eastSection = document.getElementById("eastSection");
const islandSection = document.getElementById("islandSection");

if (mainBtn) {
    mainBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

if (mySpaceBtn) {
    mySpaceBtn.addEventListener("click", () => {
        window.location.href = "myspace.html";
    });
}

if (northBtn && northSection) {
    northBtn.addEventListener("click", () => {
        northSection.scrollIntoView({ behavior: "smooth" });
    });
}
if (centerBtn && centerSection) {
    centerBtn.addEventListener("click", () => {
        centerSection.scrollIntoView({ behavior: "smooth" });
    });
}
if (southBtn && southSection) {
    southBtn.addEventListener("click", () => {
        southSection.scrollIntoView({ behavior: "smooth" });
    });
}
if (eastBtn && eastSection) {
    eastBtn.addEventListener("click", () => {
        eastSection.scrollIntoView({ behavior: "smooth" });
    });
}
if (islandBtn && islandSection) {
    islandBtn.addEventListener("click", () => {
        islandSection.scrollIntoView({ behavior: "smooth" });
    });
}