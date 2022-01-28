const addCommentSection = document.querySelector(".watch-comment__add");
const form = addCommentSection.querySelector("form");
const textarea = form.querySelector("textarea");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

const handleSubmit = () => {
  const text = textarea.value;
  const videoId = addCommentSection.dataset.videoid;
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
    }),
  });
};

const handleFocusColorChange = () => {
  submitBtn.style.backgroundColor = "#4da3f9";
  submitBtn.style.color = "#121212";
};

const handleBlurColorChange = () => {
  submitBtn.style.backgroundColor = "#2b2b2b";
  submitBtn.style.color = "rgba(255, 255, 255, 0.4);";
};

textarea.addEventListener("blur", handleBlurColorChange);
textarea.addEventListener("focus", handleFocusColorChange);
submitBtn.addEventListener("click", handleSubmit);
