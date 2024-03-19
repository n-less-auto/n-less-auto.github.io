const id = window.location.href.split("=")[1];
let imageArray;
const setUpImageGrid = () => {
  imageArray.forEach((pic, i) => {
    const imgHolder = document.createElement("div");
    const image = document.createElement("img");
    image.setAttribute("src", pic);
    image.setAttribute("alt", "image of vehicle");
    image.classList.add("gallery__img");
    if (i === 0) {
      image.classList.add("active");
    }
    imgHolder.append(image);
    document.getElementById("image-gallery").append(imgHolder);
  });
  document.querySelectorAll(".gallery__img").forEach((img) => {
    img.addEventListener("click", (e) => {
      document.querySelector(".active").classList.remove("active");
      document
        .querySelector("#focused-image > img")
        .setAttribute("src", e.target.getAttribute("src"));
      e.target.classList.add("active");
    });
  });
};

const goNextImg = (e) => {
  const currentImgUrl = document
    .querySelector("#focused-image > img")
    .getAttribute("src");
  const nextImgUrl =
    e.target.id === "arrow-next"
      ? imageArray[imageArray.indexOf(currentImgUrl) + 1]
      : imageArray[imageArray.indexOf(currentImgUrl) - 1];
  document.querySelector(".active").classList.remove("active");
  document
    .querySelector('#image-gallery  img[src="' + nextImgUrl + '"')
    .classList.add("active");

  if (imageArray.indexOf(nextImgUrl) <= 0)
    document.getElementById("arrow-previous").style.display = "none";
  else document.getElementById("arrow-previous").style.display = "block";
  if (imageArray.indexOf(nextImgUrl) >= imageArray.length - 1)
    document.getElementById("arrow-next").style.display = "none";
  else document.getElementById("arrow-next").style.display = "block";

  document
    .querySelector("#focused-image > img")
    .setAttribute("src", nextImgUrl);
};

const getAndPopulateVehicle = () => {
  db.collection("inventory")
    .doc(id)
    .get()
    .then((doc) => {
      const data = doc.data();
      console.log(data);
      document.getElementById("carName").textContent = data.name;
      document.getElementById("price").textContent = data.price;
      document.getElementById("miles").textContent = data.miles;
      const image = document.createElement("img");
      image.setAttribute("src", data.pics[0]);
      image.setAttribute("alt", "image of vehicle");
      document.getElementById("focused-image").append(image);
      imageArray = data.pics;
      data.details.forEach((detail) => {
        const newLi = document.createElement("li");
        newLi.textContent = detail;
        document.getElementById("details").append(newLi);
      });
      setUpImageGrid();
    });
};

getAndPopulateVehicle();

document
  .querySelectorAll("#focused-image>.arrow")
  .forEach((arrow) => arrow.addEventListener("click", (e) => goNextImg(e)));
