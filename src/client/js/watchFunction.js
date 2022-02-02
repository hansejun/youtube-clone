const list = document.querySelector(".watch-data__meta-icons__list");
const listIcon = list.querySelector(".fas.fa-ellipsis-h");
const listBox = list.querySelector("div");

const handleHideList = () => {
    listBox.style.display = "none";
    listIcon.removeEventListener("click",handleHideList);
    listIcon.addEventListener("click",handleShowList);
}

const handleShowList = () => {
    listBox.style.display = "flex";
    listIcon.removeEventListener("click",handleShowList);
    listIcon.addEventListener("click",handleHideList);
}

listIcon.addEventListener("click",handleShowList);