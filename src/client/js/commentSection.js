const addCommentSection = document.querySelector(".watch-comment__add");
const form = addCommentSection.querySelector("form");
const textarea = form.querySelector("textarea");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

const changeBtns = document.querySelectorAll(".comment-body__icons-change");
const deleteBtns = document.querySelectorAll(".comment-body__icons-delete");

let commentId;
let textBody;
let parentElement;
let scroll;

const addComment = (text, id, user) => {
  const commentContainer = document.querySelector(".watch-comments");

  const commentMixin = document.createElement("div");
  commentMixin.className = "watch-comments__mixins";
  commentMixin.dataset = "comment._id";

  const a = document.createElement("a");
  const avatarDiv = document.createElement("div");
  const avatarImg = document.createElement("img");
  avatarImg.className = "avatarImg";
  avatarImg.src = "/" + user.avatarUrl;
  avatarDiv.appendChild(avatarImg);
  a.appendChild(avatarDiv);

  const commentBodyDiv = document.createElement("div");

  const commentBodyUserDiv = document.createElement("div");
  const commentBodyUserName = document.createElement("span");
  const commentBodyUserCreatedAt = document.createElement("span");
  commentBodyDiv.className = "comment-body";
  commentBodyUserName.innerText = user.name;
  commentBodyUserCreatedAt.innerText = "1초 전";
  commentBodyUserDiv.className = "comment-body__user";
  commentBodyUserName.className = "comment-body__user-owner";
  commentBodyUserCreatedAt.className = "comment-body__user-createdAt";
  commentBodyUserDiv.append(commentBodyUserName, commentBodyUserCreatedAt);

  const commentBodyTextDiv = document.createElement("div");
  const commentBodyText = document.createElement("p");
  commentBodyTextDiv.className = "comment-body__text";
  commentBodyText.className = "comment.text";
  commentBodyTextDiv.appendChild(commentBodyText);
  commentBodyText.innerText = text;

  const commentBodyIconsDiv = document.createElement("div");
  const commentBodyIconsGood = document.createElement("i");
  const commentBodyIconsGoodNum = document.createElement("span");
  const commentBodyIconsHate = document.createElement("i");
  const commentBodyIconsLove = document.createElement("i");
  const commentBodyIconsRes = document.createElement("span");
  const chagedBtn = document.createElement("span");
  const deletedBtn = document.createElement("span");
  commentBodyIconsDiv.className = "comment-body__icons";
  commentBodyIconsGood.className = "far fa-thumbs-up";
  commentBodyIconsHate.className = "far fa-thumbs-down";
  commentBodyIconsLove.className = "fas fa-heart";
  commentBodyIconsRes.className = "comment-body__icons-function";
  chagedBtn.className =
    "comment-body__icons-function comment-body__icons-change";
  deletedBtn.className =
    "comment-body__icons-function comment-body__icons-delete";
  commentBodyIconsGoodNum.innerText = "";
  commentBodyIconsRes.innerText = "답글";
  chagedBtn.innerText = "수정";
  deletedBtn.innerText = "삭제";

  commentBodyIconsDiv.append(
    commentBodyIconsGood,
    commentBodyIconsGoodNum,
    commentBodyIconsHate,
    commentBodyIconsLove,
    commentBodyIconsRes,
    chagedBtn,
    deletedBtn
  );
  commentBodyDiv.append(
    commentBodyUserDiv,
    commentBodyTextDiv,
    commentBodyIconsDiv
  );
  commentMixin.append(a, commentBodyDiv);
  commentContainer.prepend(commentMixin);
};

//-------------------------------------------------------------

const handleSubmit = async () => {
  const text = textarea.value;
  const videoId = addCommentSection.dataset.videoid;
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
    }),
  });
  console.log(response.status);
  if (response.status === 200) {
    console.log("dldld");
    const { newCommentId, user } = await response.json();
    addComment(text, newCommentId, user);
  }
  textarea.value = "";
};

const handleFocusColorChange = () => {
  submitBtn.style.backgroundColor = "#4da3f9";
  submitBtn.style.color = "#121212";
};

const handleBlurColorChange = () => {
  submitBtn.style.backgroundColor = "#2b2b2b";
  submitBtn.style.color = "rgba(255, 255, 255, 0.4);";
};

const handleCancel = () => {
  textarea.value = "";
};

// 수정창에서의 취소
const handleChangeCancel = () => {
  handleBack();
};

// 댓글의 수정 버튼을 눌렀을 때 발생하는 이벤트
const handleChangeComment = (e) => {
  submitBtn.removeEventListener("click", handleSubmit);
  submitBtn.addEventListener("click", handleChangeSubmit);
  cancelBtn.removeEventListener("click", handleCancel);
  cancelBtn.addEventListener("click", handleChangeCancel);

  textarea.focus();
  submitBtn.innerText = "수정";

  parentElement = e.target.parentElement.parentElement.parentElement;

  commentId = parentElement.dataset.commentid;

  textBody = parentElement.querySelector(".comment-body__text p");
  textarea.value = textBody.innerText;
};

// 수정 창에서 수정을 눌렀을 때 발생하는 이벤트
const handleChangeSubmit = () => {
  const text = textarea.value;
  fetch(`/api/comments/${commentId}/change`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  textBody.innerText = text;
  handleBack();
};
// 수정창을 클릭하고 다시 원상태로 돌아가는 메소드
const handleBack = () => {
  submitBtn.removeEventListener("click", handleChangeSubmit);
  submitBtn.addEventListener("click", handleSubmit);

  cancelBtn.removeEventListener("click", handleChangeCancel);
  cancelBtn.addEventListener("click", handleCancel);
  submitBtn.innerText = "댓글";
  textarea.value = "";

  scroll =
    parentElement.getBoundingClientRect().top -
    textarea.getBoundingClientRect().top;

  window.scrollBy(0, scroll);
};

textarea.addEventListener("blur", handleBlurColorChange);
textarea.addEventListener("focus", handleFocusColorChange);
submitBtn.addEventListener("click", handleSubmit);
cancelBtn.addEventListener("click", handleCancel);
if (deleteBtns && changeBtns) {
  for (i = 0; i < changeBtns.length; i++) {
    changeBtns[i].addEventListener("click", handleChangeComment);
  }
}
