document.addEventListener("DOMContentLoaded", function () {
    const exportBtn = document.getElementById("exportBtn");
    const importBtn = document.getElementById("importBtn");
    const importInput = document.getElementById("importInput");

    exportBtn.addEventListener("click", () => {
        const exportData = {
            myUserName: localStorage.getItem("myUserName") || "User",
            myUserAvatar:
                localStorage.getItem("myUserAvatar") ||
                "images/default_pfp.jpg",
            myDiaries: JSON.parse(localStorage.getItem("myDiaries")) || [],
            climbedMountains:
                JSON.parse(localStorage.getItem("climbedMountains")) || [],
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        a.download = `小百岳紀錄_${today}.json`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    importBtn.addEventListener("click", () => {
        importInput.click();
    });

    importInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (event) {
            try {
                const importedData = JSON.parse(event.target.result);

                if (
                    importedData.myDiaries !== undefined &&
                    importedData.climbedMountains !== undefined
                ) {
                    if (
                        !confirm(
                            "警告：匯入新紀錄將會完全覆蓋目前的進度、頭貼與日記！確定要繼續嗎？",
                        )
                    ) {
                        importInput.value = "";
                        return;
                    }

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
                    window.location.reload();
                } else {
                    alert(
                        "匯入失敗：檔案格式不正確，請確認這是由本系統匯出的紀錄檔。",
                    );
                }
            } catch (error) {
                alert("檔案讀取錯誤，請確認檔案是否為 JSON 格式。");
            }

            importInput.value = "";
        };

        reader.readAsText(file);
    });
});
