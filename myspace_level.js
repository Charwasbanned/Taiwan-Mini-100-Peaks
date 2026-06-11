document.addEventListener("DOMContentLoaded", function () {
    const climbedIds =
        JSON.parse(localStorage.getItem("climbedMountains")) || [];

    fetch("mountains.json")
        .then((response) => response.json())
        .then((data) => {
            let totalClimbed = 0;

            data.forEach((mt) => {
                if (climbedIds.includes(mt.Mt_id)) {
                    totalClimbed++;
                }
            });

            let currentLevel = 1;
            let totalExp = totalClimbed * 100;
            let expNeededForNextLevel = currentLevel * 120;

            const levelBadge = document.querySelector(".level_badge");
            const expLabel = document.querySelector(".exp_label");
            const expFill = document.querySelector(".exp_fill");

            if (totalClimbed >= 100) {
                if (levelBadge) levelBadge.textContent = "LV. MAX";
                if (expLabel) expLabel.textContent = "100 / 100 座全制霸！";

                if (expFill) {
                    expFill.style.transition = "width 1.5s ease-out";
                    setTimeout(() => {
                        expFill.style.width = "100%";
                    }, 100);
                }
            } else {
                while (totalExp >= expNeededForNextLevel) {
                    totalExp -= expNeededForNextLevel;
                    currentLevel++;
                    expNeededForNextLevel = currentLevel * 120;
                }

                const expPercentage = (totalExp / expNeededForNextLevel) * 100;

                if (levelBadge) levelBadge.textContent = `LV. ${currentLevel}`;
                if (expLabel)
                    expLabel.textContent = `${totalExp} / ${expNeededForNextLevel}`;

                if (expFill) {
                    expFill.style.transition = "width 1.5s ease-out";
                    setTimeout(() => {
                        expFill.style.width = `${expPercentage}%`;
                    }, 100);
                }
            }
        })
        .catch((error) => console.error("資料讀取失敗:", error));
});
