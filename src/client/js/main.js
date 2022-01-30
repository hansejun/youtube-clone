import "../scss/style.scss";
import regeneratorRuntime from "regenerator-runtime";

//message 
const messageContainer = document.querySelector(".message")
const messageExitBtn = document.querySelector(".message-nav__exit");

const handleMessage = () => {
    messageContainer.style.display = "none";
}

if(messageContainer){
    messageExitBtn.addEventListener("click",handleMessage);
}
