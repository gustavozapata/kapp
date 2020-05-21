const axios = require("axios");
const path = require("path");
const electron = require("electron");
const { dialog } = require("electron").remote;
const kappServer = require("../Local");
const BrowserWindow = electron.remote.BrowserWindow;
const remote = electron.remote;
const ipc = electron.ipcRenderer;

const power = document.querySelector("#power");
const items = document.querySelector(".items");
const menu = document.querySelectorAll("nav ul li");
const addBtn = document.querySelector("#add");
let removeItem = [];
let editItems = [];

const removeOptions = {
  type: "question",
  buttons: ["Yes", "No"],
  title: "Delete item",
  message: "Do you want to delete this?",
  detail: "This action can't be undone",
};

loadData("assets");

async function loadData(endPoint) {
  await axios
    .get(`http://${kappServer}:4000/api/v1/${endPoint}`)
    .then((res) => {
      document.querySelector("#spinner").style.display = "none";
      let data = res.data.data;
      items.innerHTML = populate(data);
    })
    .then(() => {
      activeActions();
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

function activeActions() {
  editItem();
  deleteItem();
}

function editItem() {
  editItems = document.querySelectorAll(".pen-image");
  editItems.forEach((item) => {
    item.addEventListener("click", () => {
      let name = item.getAttribute("data-name");
      renderEditModal(name);
    });
  });
}

function renderEditModal(name) {
  const modalPath = path.join("file://", __dirname, "edit.html");
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
  localStorage.setItem("editTitle", name);
}

function deleteItem() {
  removeItem = document.querySelectorAll(".bin-image");
  removeItem.forEach((item) => {
    item.addEventListener("click", () => {
      let id = item.getAttribute("data-id");
      let endPoint = localStorage.getItem("endPoint");
      dialog
        .showMessageBox(remote.getCurrentWindow(), removeOptions)
        .then(async (res) => {
          if (res.response === 0) {
            //0 = yes
            await axios
              .delete(`http://${kappServer}:4000/api/v1/${endPoint}/${id}`)
              .then(() => {
                loadData(endPoint);
              });
          }
        });
    });
  });
}

async function getSelectedItems(item) {
  items.style.display = "none";
  document.querySelector("#spinner").style.display = "block";

  let name = item.toLowerCase().trim();
  let num = name.split(" ");
  name = num.length > 1 ? num[1] : name;

  await axios.get(`http://${kappServer}:4000/api/v1/${name}`).then((res) => {
    items.style.display = "block";
    document.querySelector("#spinner").style.display = "none";
    items.innerHTML = populate(res.data.data);
    activeActions();
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
    }</p><img class="pen-image" data-name="${el.name}" data-id="${
      el._id
    }" src="../assets/images/pen.svg"/><img class="bin-image" data-id="${
      el._id
    }" src="../assets/images/bin.png"/><p>${el.currentlyAt.city}${
      el.expire
        ? " | <span class='expire'>" + getExpireDate(el.expire) + "</span>"
        : ""
    }</p>${getKeywords(el.keywords)}</div></div>`;
  });
  return element;
}

function getExpireDate(date) {
  const formatDate = new Date(date);
  return formatDate.toDateString();
}

function getKeywords(keywords) {
  let keys = "";
  keywords.forEach((keyword) => {
    keys += `<span class="keywords-icons">${keyword}</span>`;
  });
  return keys;
}
