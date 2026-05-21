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
            // 跑迴圈把每座山塞到對應的區域
            mountainsData.forEach((mountain) => {
                // 根據山脈的區域，找到對應的 <ul> 容器
                const targetMenu = document.querySelector(
                    `.mountain_menu[data-region="${mountain.Mt_region}"]`,
                );

                if (targetMenu) {
                    // 建立一個新的 <li> 標籤
                    const li = document.createElement("li");
                    li.className = "mountain";
                    li.textContent = mountain.Mt_name;

                    // 把 <li> 塞進 <ul> 裡面
                    targetMenu.appendChild(li);
                }
            });
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("載入山脈資料失敗");
        });
});
