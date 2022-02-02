const form = document.querySelector(".header-nav__search");
const input = form.querySelector("input");
const btn = form.querySelector(".header-nav__search-submit");

const handleClickSearch = async() => {
    const keyword = input.value;
    const a = document.createElement("a");
    a.href=`/search/${keyword}`;
    a.click();    
}
btn.addEventListener("click",handleClickSearch);