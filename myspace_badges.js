document.addEventListener("DOMContentLoaded", function () {
    const badgeList = document.querySelector(".badge_list");
    const climbedMountains =
        JSON.parse(localStorage.getItem("climbedMountains")) || [];

    fetch("mountains.json")
        .then((response) => response.json())
        .then((mountainsData) => {
            renderBadges(climbedMountains, mountainsData);
        })
        .catch((error) => console.error("無法載入山脈資料", error));

    function renderBadges(climbedIds, mountainsData) {
        badgeList.innerHTML = "";
        const totalClimbed = climbedIds.length;
        const badges = [];

        if (totalClimbed !== 0) {
            badges.push({
                name: "開始爬山了！",
                img: `images/badges/first_mountain.png`,
                fallbackIcon: "🥾",
            });
        }

        for (let i = 10; i <= Math.min(totalClimbed, 100); i += 10) {
            if (i != 50 && i != 100) {
                badges.push({
                    name: `${i}岳達成`,
                    img: `images/badges/10_mountain.png`,
                    fallbackIcon: "🏆",
                });
            }
            if (i == 50) {
                badges.push({
                    name: `${i}岳達成`,
                    img: `images/badges/50_mountain.png`,
                    fallbackIcon: "🏆",
                });
            }
            if (i == 100) {
                badges.push({
                    name: `${i}岳達成`,
                    img: `images/badges/100_mountain.png`,
                    fallbackIcon: "🏆",
                });
            }
        }

        const regions = [
            "北部區域",
            "中部區域",
            "南部區域",
            "東部區域",
            "離島區域",
        ];
        regions.forEach((region) => {
            const regionMtIds = mountainsData
                .filter((mt) => mt.Mt_region === region)
                .map((mt) => mt.Mt_id);

            if (regionMtIds.length > 0) {
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
            badgeIcon.innerHTML = `<span style="font-size: 24px;">${badge.fallbackIcon}</span>`;

            const img = new Image();
            img.src = badge.img;
            img.onload = () => {
                badgeIcon.innerHTML = "";
                badgeIcon.style.backgroundImage = `url('${badge.img}')`;
                badgeIcon.style.backgroundPosition = "center";

                if (badge.name.includes("開始")) {
                    badgeIcon.style.backgroundSize = "cover";
                } else {
                    badgeIcon.style.backgroundSize = "80%";
                }

                badgeIcon.style.backgroundRepeat = "no-repeat";
            };
            img.onerror = () => {
                badgeIcon.style.backgroundColor = "#d8edcc";
            };

            badgeItem.appendChild(badgeIcon);
            badgeList.appendChild(badgeItem);
        });
    }
});
