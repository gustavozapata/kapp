const axios = require("axios");
const electron = require("electron");
const remote = electron.remote;

const start = document.querySelector("#start");
const power = document.querySelector("#power");

const menu = document.querySelectorAll("nav ul li");
const items = document.querySelector(".items");

start.addEventListener("click", () => {
  axios.get("http://localhost:4000/api/v1/assets").then((res) => {
    let data = res.data.data;
    items.innerHTML = populate(data);
  });
});

power.addEventListener("click", () => {
  let win = remote.getCurrentWindow();
  win.close();
});

menu.forEach((item) => {
  item.addEventListener("click", () => {
    if (item.className === "active") return false;
    let image = item.querySelector("img").src;
    let no_active = document.querySelector(".active img").src;

    //remove active
    document.querySelector(".active img").src = no_active.replace(
      "_a.png",
      ".png"
    );
    document.querySelector(".active").classList.remove("active");

    //add active
    document.querySelector("#selected-route").textContent = item.textContent;
    document.querySelector("#selected-title").textContent = item.textContent;
    item.classList.add("active");
    item.querySelector("img").src = image.replace(".png", "_a.png");
  });
});

function populate(data) {
  let element = "";
  data.forEach((el) => {
    element += `<div><h3>${el.name}</h3><p>${el.description}</p><p>${el.currentlyAt.city}</p></div>`;
  });
  return element;
}
