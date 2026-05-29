let mountainsData = [];

document.addEventListener("DOMContentLoaded", function () {
    // 讀取mountains.json
    fetch("mountains.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("無法讀取 JSON 檔案");
            }
            return response.json();
        })
        .then((data) => {
            mountainsData = data;
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

            const searchInput = document.getElementById("search");
            if (searchInput) {
                searchInput.addEventListener("input", () => {
                    filterMountains(searchInput.value);
                });
                searchInput.addEventListener("keydown", (event) => {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        checkSearch();
                    }
                });
            }
        })

        .catch((error) => {
            console.error("Error:", error);
            alert("載入山脈資料失敗");
        });
});

function formatSearchResults(results, query) {
    const searchResults = document.getElementById("searchResults");
    if (!searchResults) return;

    searchResults.innerHTML = "";

    if (!query.trim()) {
        return;
    }

    if (results.length === 0) {
        const noResult = document.createElement("li");
        noResult.className = "search_result_empty";
        noResult.textContent = `找不到「${query}」的結果，請試試其他山名。`;
        searchResults.appendChild(noResult);
        return;
    }

    results.forEach((mountain) => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = `mt_card.html?id=${mountain.Mt_id}`;
        link.textContent = mountain.Mt_name;
        item.appendChild(link);
        searchResults.appendChild(item);
    });
}

function filterMountains(keyword) {
    const query = keyword.trim().toLowerCase();
    if (!query) {
        const searchResults = document.getElementById("searchResults");
        if (searchResults) searchResults.innerHTML = "";
        return;
    }

    const results = mountainsData.filter((mountain) =>
        mountain.Mt_name.toLowerCase().includes(query),
    );
    formatSearchResults(results, keyword);
}

function checkSearch() {
    const searchInput = document.getElementById("search");
    if (searchInput) {
        filterMountains(searchInput.value);
    }
}

// 區域按鈕點擊後，滑動到對應區塊

// 取得按鈕
const mainBtn = document.getElementById("mainBtn");
const mySpaceBtn = document.getElementById("mySpaceBtn");
const northBtn = document.getElementById("northBtn");
const centerBtn = document.getElementById("centerBtn");
const southBtn = document.getElementById("southBtn");
const eastBtn = document.getElementById("eastBtn");
const islandBtn = document.getElementById("islandBtn");

// 取得對應區域
const mainSection = document.getElementById("mainSection");
const northSection = document.getElementById("northSection");
const centerSection = document.getElementById("centerSection");
const southSection = document.getElementById("southSection");
const eastSection = document.getElementById("eastSection");
const islandSection = document.getElementById("islandSection");

mainBtn.addEventListener("click", () => {
    window.location.href = "index.html";
})

mySpaceBtn.addEventListener("click", () => {
    window.location.href = "myspace.html";
})

// 北部區域
northBtn.addEventListener("click", () => {
    northSection.scrollIntoView({
        behavior: "smooth"
    });
});

// 中部區域
centerBtn.addEventListener("click", () => {
    centerSection.scrollIntoView({
        behavior: "smooth"
    });
});

// 南部區域
southBtn.addEventListener("click", () => {
    southSection.scrollIntoView({
        behavior: "smooth"
    });
});

// 東部區域
eastBtn.addEventListener("click", () => {
    eastSection.scrollIntoView({
        behavior: "smooth"
    });
});

// 離島區域
islandBtn.addEventListener("click", () => {
    islandSection.scrollIntoView({
        behavior: "smooth"
    });
});

//TODO: checkSearch