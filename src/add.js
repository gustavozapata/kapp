const electron = require("electron");
const remote = electron.remote;
const ipc = electron.ipcRenderer;

const closeBtn = document.getElementById("close");
const addKeyword = document.querySelector(".add-keyword");
const keywordInput = document.querySelector(".keywords input");
const keys = document.querySelector(".keys");

addKeyword.addEventListener("click", function (e) {
  e.preventDefault();
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
