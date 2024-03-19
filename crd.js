let inventory = [];
const getAndPopulateVehicles = () => {
  console.log("I Got to getAndPopulateVehicles");
  inventory = [];
  db.collection("inventory")
    .get()
    .then((snapshot) => {
      console.log("I Got to getAndPopulateVehicles .then");

      snapshot.docs.forEach((doc) => {
        console.log(doc.data());
        inventory.push({ id: doc.id, data: doc.data() });
      });
      populateInventory();
    });
};

let carName;
let carMiles;
let carPrice;
let carDetails;
let carPics = [];
const parseCarText = (e) => {
  carPics = [];
  let infoArray = e.target.value.split("\n");
  carName = infoArray[0];
  carPrice = infoArray[infoArray.length - 1];
  infoArray = infoArray.slice(1, infoArray.length - 1);
  carMiles = infoArray.find(
    (detail) =>
      detail.includes("K miles") ||
      detail.includes("K Miles") ||
      detail.includes("k miles") ||
      detail.includes("k Miles")
  );
  carDetails = infoArray.filter((detail) => detail.indexOf("K miles") === -1);
  document.getElementById("name-text").textContent = carName;
  document.getElementById("price-text").textContent = carPrice;
  document.getElementById("miles-text").textContent = carMiles;
  document.getElementById("confirm-section").style.display = "block";
};

const postVehicle = () => {
  db.collection("inventory")
    .doc()
    .set({
      name: carName.trim(),
      miles: carMiles.trim(),
      price: carPrice.replace(/[^0-9]/g, ""),
      details: carDetails,
      pics: carPics,
    })
    .then(() => {
      getAndPopulateVehicles();
      resetAddVehicleModal();
    })
    .catch((err) => window.setTimeout(() => postVehicle, 3000));
};

const resetAddVehicleModal = () => {
  document.querySelector(".add-vehicle-modal-background").style.display =
    "none";
  document.getElementById("upload-images").style.display = "none";
  document.getElementById("fileInput").value = null;
  document.getElementById("add-vehicle-section-1").style.display = "block";
  document.getElementById("add-vehicle-section-2").style.display = "none";
  document.getElementById("car-info").value = "";
  document.getElementById("name-text").textContent = "";
  document.getElementById("price-text").textContent = "";
  document.getElementById("miles-text").textContent = "";
  document.getElementById("uploadPercentages").innerHTML = "";
};

const goNext = () => {
  document.getElementById("add-vehicle-section-1").style.display = "none";
  document.getElementById("add-vehicle-section-2").style.display = "block";
};

const fileText = document.querySelector(".fileText");
let fileItem;
let fileName;
const getFile = (e) => {
  document.getElementById("upload-images").style.display = "block";
  fileItem = e.target.files;
  fileName = fileItem.name;
};

const uploadImage = async () => {
  const fileItemArray = Array.from(fileItem);
  document.getElementById("uploadPercentages").innerHTML = "";
  const loadingGif = document.createElement("img");
  loadingGif.setAttribute("src", "images/loading.gif");
  loadingGif.setAttribute("alt", "loading");
  loadingGif.classList.add("preview-img");
  document.getElementById("uploadPercentages").append(loadingGif);
  for (let i = 0; i < fileItemArray.length; i++) {
    const percentageProgress = document.createElement("div");
    percentageProgress.id = "uploadPercentage" + (i + 1);
    document.getElementById("uploadPercentages").append(percentageProgress);
  }
  const promiseArray = [];
  fileItemArray.map((photo, i) => {
    let path = "" + carName.trim().replaceAll(" ", "-") + "/" + i;
    let storageRef = storage.ref(path);
    let uploadTask = storageRef.put(photo);
    promiseArray.push(uploadTask.snapshot.ref.getDownloadURL());
  });
  try {
    carPics = await Promise.all(promiseArray);
  } catch (error) {
    console.log("error", error);
    return window.setTimeout(() => uploadImage(), 3000);
  }

  postVehicle();
};

const closeModal = () =>
  (document.querySelector(".modal-background").style.display = "none");

const repopulateAfterDelete = () => {
  document.querySelector(".cars").innerHTML = "";
  getAndPopulateVehicles();
};

const deleteVehicle = (event) => {
  closeModal();
  document.querySelector(".cars").innerHTML =
    "<img src='images/loading.gif' alt='loading'>";
  db.collection("inventory")
    .doc(event.target.getAttribute("data-id"))
    .delete()
    .then(() => {
      const path = "" + event.target.getAttribute("data-name") + "/";
      let storageRef = storage.ref(path);
      storageRef.listAll().then((listResults) => {
        for (let i = 0; i < listResults.items.length; i++) {
          storageRef.child("" + i).delete();
        }
      });
      repopulateAfterDelete();
    });
};

const openDeleteModal = ({ id, name }) => {
  document.getElementById("vehicle-name").textContent = name;
  document.getElementById("delete-button-modal").setAttribute("data-id", id);
  document
    .getElementById("delete-button-modal")
    .setAttribute("data-name", name.trim().replaceAll(" ", "-"));
  document.querySelector(".modal-background").style.display = "block";
};

const populateInventory = () => {
  const inventoryDiv = document.querySelector(".cars");
  inventoryDiv.innerHTML = "";
  inventory.forEach((vehicle) => {
    const vehicleDiv = document.createElement("div");
    vehicleDiv.classList.add("card", "car-card");

    const imageDiv = document.createElement("div");
    imageDiv.classList.add("car-card-img");

    const carImg = document.createElement("img");
    carImg.setAttribute("src", vehicle.data.pics[0]);
    carImg.setAttribute("alt", "vehicle");
    imageDiv.append(carImg);

    const textDiv = document.createElement("div");
    textDiv.classList.add("car-card-text");

    const carTitle = document.createElement("h3");
    carTitle.textContent = vehicle.data.name;

    const carHighlightsDiv = document.createElement("div");
    carHighlightsDiv.classList.add("car-highlights");

    const priceP = document.createElement("p");
    priceP.textContent = "$" + vehicle.data.price;

    const milesP = document.createElement("p");
    milesP.textContent = vehicle.data.miles;

    carHighlightsDiv.append(priceP, milesP);

    const xCloseImg = document.createElement("img");
    xCloseImg.setAttribute("src", "images/x.png");
    xCloseImg.setAttribute("data-id", vehicle.id);
    xCloseImg.setAttribute("data-name", vehicle.data.name);
    xCloseImg.classList.add("x-close");
    console.log(vehicle, vehicleDiv);
    textDiv.append(carTitle, carHighlightsDiv, xCloseImg);

    vehicleDiv.append(imageDiv, textDiv);

    inventoryDiv.append(vehicleDiv);
  });
  document.querySelectorAll(".x-close").forEach((x) =>
    x.addEventListener("click", () =>
      openDeleteModal({
        id: x.getAttribute("data-id"),
        name: x.getAttribute("data-name"),
      })
    )
  );
  MakeTitlesFitOnOneLine();
};
//make this on add vehicle modal
document
  .querySelector(".close-add-modal")
  .addEventListener("click", () => resetAddVehicleModal());

document
  .getElementById("car-info")
  .addEventListener("input", (e) => parseCarText(e));

document
  .getElementById("cancel-button-modal")
  .addEventListener("click", () => closeModal());

document
  .getElementById("confirm-button")
  .addEventListener("click", () => goNext());

document
  .getElementById("delete-button-modal")
  .addEventListener("click", (event) => deleteVehicle(event));

document
  .getElementById("add-new-car")
  .addEventListener(
    "click",
    () =>
      (document.querySelector(".add-vehicle-modal-background").style.display =
        "block")
  );

getAndPopulateVehicles();

const MakeTitlesFitOnOneLine = () => {
  console.log(document.querySelectorAll("h3"));
  document.querySelectorAll("h3").forEach((h3) => {
    const checkAndReduceFont = () => {
      let fontSize = parseFloat(
        window.getComputedStyle(h3, null).getPropertyValue("font-size")
      );
      h3.style.fontSize = fontSize - 1 + "px";
      if (h3.offsetHeight > 46) {
        console.log("got here");
        checkAndReduceFont();
      } else {
        console.log("got here");

        h3.style.height = "46px";
      }
    };
    if (h3.offsetHeight > 46) {
      checkAndReduceFont();
    }
  });
};
