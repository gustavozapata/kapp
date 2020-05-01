const axios = require("axios");

const start = document.querySelector("#start");
const container = document.querySelector(".assets");

start.addEventListener("click", () => {
  axios.get("http://localhost:4000/api/v1/assets").then((res) => {
    let data = res.data.data;
    container.innerHTML = populate(data);
  });
});

function populate(data) {
  let element = "";
  data.forEach((el) => {
    element += `<div><h3>${el.name}</h3><p>${el.description}</p><p>${el.currentlyAt.city}</p></div>`;
  });
  return element;
}
