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
    document.querySelector(".active img").src = "../assets/images/menu.png";
    document.querySelector(".active").classList.remove("active");
    item.classList.add("active");
    item.querySelector("img").src = "../assets/images/active.png";
  });
});

function populate(data) {
  let element = "";
  data.forEach((el) => {
    element += `<div><h3>${el.name}</h3><p>${el.description}</p><p>${el.currentlyAt.city}</p></div>`;
  });
  return element;
}
