document.addEventListener("DOMContentLoaded", function () {
    updateDashboardProgress();

    function updateDashboardProgress() {
        const climbedIds =
            JSON.parse(localStorage.getItem("climbedMountains")) || [];

        fetch("mountains.json")
            .then((response) => response.json())
            .then((data) => {
                const regionStats = {
                    北部區域: { total: 0, climbed: 0 },
                    中部區域: { total: 0, climbed: 0 },
                    南部區域: { total: 0, climbed: 0 },
                    東部區域: { total: 0, climbed: 0 },
                    離島區域: { total: 0, climbed: 0 },
                };

                let totalMountains = data.length;
                let totalClimbed = 0;

                data.forEach((mt) => {
                    if (regionStats[mt.Mt_region]) {
                        regionStats[mt.Mt_region].total++;

                        if (climbedIds.includes(mt.Mt_id)) {
                            regionStats[mt.Mt_region].climbed++;
                            totalClimbed++;
                        }
                    }
                });

                const totalPct =
                    totalMountains === 0
                        ? 0
                        : Math.round((totalClimbed / totalMountains) * 100);
                document.querySelector(".circle_pct").textContent = `${totalPct}%`;

                const circumference = 2 * Math.PI * 66;
                const dashValue = (totalPct / 100) * circumference;

                const progressCircle = document.querySelectorAll(
                    ".circle_wrap svg circle",
                )[1];
                if (progressCircle) {
                    progressCircle.style.transition =
                        "stroke-dasharray 1s ease-in-out";
                    setTimeout(() => {
                        progressCircle.setAttribute(
                            "stroke-dasharray",
                            `${dashValue} ${circumference}`,
                        );
                    }, 50);
                }

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

                        progressNumSpan.textContent = `${stats.climbed}/${stats.total}`;

                        const barPct =
                            stats.total === 0
                                ? 0
                                : (stats.climbed / stats.total) * 100;
                        fillDiv.style.width = `${barPct}%`;
                        fillDiv.style.transition = "width 1s ease-in-out";
                    }
                });
            })
            .catch((error) => console.error("無法載入山脈資料以更新進度:", error));
    }

    // ===== 點擊進度條展開區域山脈清單 =====
    const processBars = document.querySelectorAll(".process_bar");
    const regionModal = document.getElementById("regionModal");
    const closeRegionModalBtn = document.getElementById("closeRegionModalBtn");
    const regionModalTitle = document.getElementById("regionModalTitle");
    const regionMountainList = document.getElementById("regionMountainList");

    closeRegionModalBtn.addEventListener("click", () => {
        regionModal.style.display = "none";
    });

    regionModal.addEventListener("click", (e) => {
        if (e.target === regionModal) {
            regionModal.style.display = "none";
        }
    });

    processBars.forEach((bar) => {
        bar.addEventListener("click", () => {
            const regionName = bar.querySelector(
                ".bar_header span:first-child",
            ).textContent;
            regionModalTitle.textContent = `${regionName} - 進度清單`;

            const climbedIds =
                JSON.parse(localStorage.getItem("climbedMountains")) || [];

            fetch("mountains.json")
                .then((response) => response.json())
                .then((data) => {
                    const regionMountains = data.filter(
                        (mt) => mt.Mt_region === regionName,
                    );

                    regionMountainList.innerHTML = "";

                    regionMountains.forEach((mt) => {
                        const isClimbed = climbedIds.includes(mt.Mt_id);

                        const a = document.createElement("a");
                        a.href = `mt_card.html?id=${mt.Mt_id}`;
                        a.textContent = mt.Mt_name;
                        a.className = `region-mt-btn ${isClimbed ? "climbed" : "unclimbed"}`;

                        regionMountainList.appendChild(a);
                    });

                    regionModal.style.display = "flex";
                })
                .catch((error) =>
                    console.error("無法載入區域山脈資料:", error),
                );
        });
    });
});
