const axios = require("axios");
const electron = require("electron");
const kappServer = require("../Local");
const remote = electron.remote;
const ipc = electron.ipcRenderer;

const form = document.querySelector(".main-form form");
const keys = document.querySelector(".keys");
const addKeyword = document.querySelector(".add-keyword");
const keywordInput = document.querySelector(".keywords input");
const dateInput = document.querySelector("#date");
const name = document.querySelector("#name");
const locationItem = document.querySelector("#location");
const description = document.querySelector("#description");
const closeBtn = document.getElementById("close");

let keywords = [];
const itemId = localStorage.getItem("itemId");

loadItem();

async function loadItem() {
  let endPoint = localStorage.getItem("endPoint");
  await axios(`http://${kappServer}:4000/api/v1/${endPoint}/${itemId}`).then(
    (res) => {
      let data = res.data.data;
      name.value = data.name;
      locationItem.value = data.currentlyAt.city;
      description.value = data.description;
      let date = new Date(data.expire).toISOString().substring(0, 10);
      dateInput.value = date;
      data.keywords.map((key) => {
        keywords.push(key);
        keys.innerHTML = keys.innerHTML + addKey(key);
      });
      getKeyContainers();
    }
  );
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const reqBody = {
    name: name.value,
    description: description.value,
    keywords,
    currentlyAt: {
      city: locationItem.value,
    },
    expire: dateInput.value,
  };

  let endPoint = localStorage.getItem("endPoint");
  await axios.patch(
    `http://${kappServer}:4000/api/v1/${endPoint}/${itemId}`,
    reqBody
  );

  ipc.send("update-list");
  const window = remote.getCurrentWindow();
  window.close();
});

addKeyword.addEventListener("click", function (e) {
  e.preventDefault();
  if (keywordInput.value !== "") {
    keywords.push(keywordInput.value);
    keys.innerHTML = keys.innerHTML + addKey(keywordInput.value);
    keywordInput.value = "";
    getKeyContainers();
  }
});

function getKeyContainers() {
  const deleteKeyword = document.querySelectorAll(".keyword-container");
  deleteKeyword.forEach((key) => {
    key.querySelector(".delete").addEventListener("click", function () {
      let element = key.querySelector(".keyword").textContent;
      keywords = keywords.filter((e) => e !== element);
      key.style.display = "none";
    });
  });
}

function addKey(value) {
  return `<span class="keyword-container"><span class="keyword">${value}</span><span class="delete">x</span></span>`;
}

closeBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const window = remote.getCurrentWindow();
  window.close();
});
