import "../scss/style.scss";
import regeneratorRuntime from "regenerator-runtime";

//message
const messageContainer = document.querySelector(".message");
const messageExitBtn = document.querySelector(".message-nav__exit");
const searchFocusBtn = document.querySelector(".focus-search");
const searchInput = document.querySelector(".header-nav__search input");
const handleMessage = () => {
  messageContainer.style.display = "none";
};

if (messageContainer) {
  messageExitBtn.addEventListener("click", handleMessage);
}

// nav & list icon event
const sidebarListIcon = document.querySelector(".header-list i");

const handleIconEffect = (e) => {
  const icon = e.target;
  icon.classList.toggle("backOpacity");
  setTimeout(() => {
    icon.classList.toggle("backOpacity");
  }, 500);
};

const handleFocusSearch = (e) => {
  e.preventDefault();
  searchInput.focus();
};

if (sidebarListIcon) {
  sidebarListIcon.addEventListener("click", handleIconEffect);
}
if (searchFocusBtn) {
  searchFocusBtn.addEventListener("click", handleFocusSearch);
}
