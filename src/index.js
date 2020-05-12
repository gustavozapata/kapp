const axios = require("axios");
const path = require("path");
const electron = require("electron");
const BrowserWindow = electron.remote.BrowserWindow;
const remote = electron.remote;
const ipc = electron.ipcRenderer;

const power = document.querySelector("#power");
const items = document.querySelector(".items");
const menu = document.querySelectorAll("nav ul li");
const addBtn = document.querySelector("#add");

loadData("assets");

async function loadData(endPoint) {
  await axios.get(`http://localhost:4000/api/v1/${endPoint}`).then((res) => {
    document.querySelector("#spinner").style.display = "none";
    let data = res.data.data;
    items.innerHTML = populate(data);
  });
}

power.addEventListener("click", () => {
  let win = remote.getCurrentWindow();
  win.close();
});

ipc.on("update-list", function () {
  document.querySelector("#spinner").style.display = "block";
  loadData(localStorage.getItem("endPoint"));
});

// ADD ITEM
addBtn.addEventListener("click", function () {
  const modalPath = path.join("file://", __dirname, "add.html");
  let win = new BrowserWindow({
    width: 450,
    height: 330,
    parent: remote.getCurrentWindow(),
    // center: true,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.on("close", function () {
    win = null;
  });
  // win.webContents.openDevTools();
  win.loadURL(modalPath);
  // win.once("ready-to-show", () => {
  win.show();
  // });
  localStorage.setItem(
    "addTitle",
    document.querySelector("#selected-route").textContent.trim()
  );
});

menu.forEach((item) => {
  item.addEventListener("click", () => {
    if (item.className === "active") return false;

    getSelectedItems(item.textContent);
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

async function getSelectedItems(item) {
  items.style.display = "none";
  document.querySelector("#spinner").style.display = "block";

  let name = item.toLowerCase().trim();
  let num = name.split(" ");
  name = num.length > 1 ? num[1] : name;

  await axios.get(`http://localhost:4000/api/v1/${name}`).then((res) => {
    items.style.display = "block";
    document.querySelector("#spinner").style.display = "none";
    items.innerHTML = populate(res.data.data);
  });
}

function populate(data) {
  let element = "";
  data.forEach((el) => {
    element += `<div class="item-container"><div class="item-icon"><p>${el.name.substring(
      0,
      2
    )}</p></div><div class="item-info"><p class="item-name">${
      el.name
    }</p><img class="pen-image" src="../assets/images/pen.svg"/><img class="bin-image" src="../assets/images/bin.png"/><p>${
      el.currentlyAt.city
    }</p><span>${el.keywords[0]}</span></div></div>`;
  });
  return element;
}
