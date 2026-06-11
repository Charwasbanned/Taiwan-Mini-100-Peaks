document.addEventListener("DOMContentLoaded", function () {
    const userNameDisplay = document.getElementById("userNameDisplay");
    const editNameBtn = document.getElementById("editNameBtn");
    const avatarContainer = document.getElementById("avatarContainer");
    const avatarInput = document.getElementById("avatarInput");
    const userAvatar = document.getElementById("userAvatar");

    const nameModal = document.getElementById("nameModal");
    const newUserNameInput = document.getElementById("newUserNameInput");
    const cancelNameBtn = document.getElementById("cancelNameBtn");
    const saveNameBtn = document.getElementById("saveNameBtn");

    const savedName = localStorage.getItem("myUserName") || "User";
    const savedAvatar =
        localStorage.getItem("myUserAvatar") || "images/default_pfp.jpg";
    userNameDisplay.textContent = savedName;
    userAvatar.src = savedAvatar;

    editNameBtn.addEventListener("click", () => {
        newUserNameInput.value = userNameDisplay.textContent.trim();
        nameModal.style.display = "flex";
    });

    cancelNameBtn.addEventListener("click", () => {
        nameModal.style.display = "none";
    });

    saveNameBtn.addEventListener("click", () => {
        const newName = newUserNameInput.value.trim();

        if (newName === "") {
            alert("請輸入暱稱");
            return;
        }

        if (newName.length > 10) {
            alert("暱稱不能大於10個字");
            return;
        }

        userNameDisplay.textContent = newName;
        localStorage.setItem("myUserName", newName);
        nameModal.style.display = "none";
    });

    nameModal.addEventListener("click", (e) => {
        if (e.target === nameModal) {
            nameModal.style.display = "none";
        }
    });

    avatarContainer.addEventListener("click", () => {
        avatarInput.click();
    });

    avatarInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function (event) {
                const base64String = event.target.result;
                userAvatar.src = base64String;

                try {
                    localStorage.setItem("myUserAvatar", base64String);
                } catch (error) {
                    alert("圖片檔案太大囉！請選擇小於3MB的圖片");
                }
            };

            reader.readAsDataURL(file);
        }
    });
});
