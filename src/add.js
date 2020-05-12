const axios = require("axios");
const electron = require("electron");
const remote = electron.remote;
const ipc = electron.ipcRenderer;

const form = document.querySelector(".main-form form");
const addTitle = document.querySelector("#add-category");
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

  let endPoint = localStorage.getItem("addTitle").toLowerCase();
  const reqBody = {
    name,
    description,
    keywords,
    currentlyAt: {
      city,
    },
  };

  let num = endPoint.split(" ");
  endPoint = num.length > 1 ? num[1] : endPoint;
  localStorage.setItem("endPoint", endPoint);
  await axios.post(`http://localhost:4000/api/v1/${endPoint}`, reqBody);

  ipc.send("update-list");
  const window = remote.getCurrentWindow();
  window.close();
});

addKeyword.addEventListener("click", function (e) {
  e.preventDefault();
  keywords.push(keywordInput.value);
  keys.innerHTML = keys.innerHTML + addKey(keywordInput.value);
  keywordInput.value = "";
  getKeyContainers();
});

function getKeyContainers() {
  const deleteKeyword = document.querySelectorAll(".keyword-container");
  deleteKeyword.forEach((key) => {
    key.querySelector(".delete").addEventListener("click", function () {
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
