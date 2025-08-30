console.log("🥟 Samosa PWA loaded!");

// Example interactive feature
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("button");
  if (btn) {
    btn.addEventListener("click", () => {
      alert("🔥 Fresh samosa added to cart!");
    });
  }
});


