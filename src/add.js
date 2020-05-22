const axios = require("axios");
const electron = require("electron");
const kappServer = require("../Local");
const remote = electron.remote;
const ipc = electron.ipcRenderer;

const form = document.querySelector(".main-form form");
const addTitle = document.querySelector("#add-category");
const dateInput = document.querySelector("#date");
const keys = document.querySelector(".keys");
const addKeyword = document.querySelector(".add-keyword");
const keywordInput = document.querySelector(".keywords input");
const closeBtn = document.getElementById("close");

addTitle.textContent = localStorage.getItem("addTitle").slice(0, -1);

let keywords = [];

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.querySelector("input[name='name']").value;
  const description = document.querySelector("textarea[name='description']")
    .value;
  const city = document.querySelector("input[name='city']").value;

  const reqBody = {
    name,
    description,
    keywords,
    currentlyAt: {
      city,
    },
    expire: dateInput.value,
  };

  let endPoint = localStorage.getItem("endPoint");
  await axios.post(`http://${kappServer}:4000/api/v1/${endPoint}`, reqBody);

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
