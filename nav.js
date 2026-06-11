document.addEventListener("DOMContentLoaded", function () {
    function getBasePath() {
        const currentPath = window.location.pathname;
        return currentPath.substring(0, currentPath.lastIndexOf("/"));
    }

    const mainBtn = document.getElementById("mainBtn");
    if (mainBtn) {
        mainBtn.addEventListener("click", () => {
            window.location.href =
                window.location.origin + getBasePath() + "/index.html";
        });
    }

    const mySpaceBtn = document.getElementById("mySpaceBtn");
    if (mySpaceBtn) {
        mySpaceBtn.addEventListener("click", () => {
            window.location.href =
                window.location.origin + getBasePath() + "/myspace.html";
        });
    }

    const regionButtons = [
        { btnId: "northBtn", sectionId: "northSection" },
        { btnId: "centerBtn", sectionId: "centerSection" },
        { btnId: "southBtn", sectionId: "southSection" },
        { btnId: "eastBtn", sectionId: "eastSection" },
        { btnId: "islandBtn", sectionId: "islandSection" },
    ];

    regionButtons.forEach((item) => {
        const btn = document.getElementById(item.btnId);
        if (btn) {
            btn.addEventListener("click", () => {
                window.location.href =
                    window.location.origin +
                    getBasePath() +
                    "/index.html#" +
                    item.sectionId;
            });
        }
    });
});
