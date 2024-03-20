let inventory;
const getAndPopulateVehicles = () => {
  db.collection("inventory")
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        inventory = [{ id: doc.id, data: doc.data() }];
        populateInventory();
      });
    });
};
getAndPopulateVehicles();

const MakeTitlesFitOnOneLine = () => {
  document.querySelectorAll("h3").forEach((h3) => {
    const checkAndReduceFont = () => {
      let fontSize = parseFloat(
        window.getComputedStyle(h3, null).getPropertyValue("font-size")
      );
      h3.style.fontSize = fontSize - 1 + "px";
      if (h3.offsetHeight > 46) {
        checkAndReduceFont();
      } else {
        h3.style.height = "46px";
      }
    };
    if (h3.offsetHeight > 46) {
      checkAndReduceFont();
    }
  });
};

const populateInventory = () => {
  console.log(inventory);
  const inventoryDiv = document.querySelector(".cars");
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
    milesP.textContent =
      vehicle.data.miles.includes("miles") ||
      vehicle.data.miles.includes("Miles")
        ? vehicle.data.miles
        : vehicle.data.miles + " miles";

    carHighlightsDiv.append(priceP, milesP);

    const carFactsUl = document.createElement("ul");
    vehicle.data.details.forEach((detail) => {
      const carFactLi = document.createElement("li");
      carFactLi.textContent = detail;
      carFactsUl.append(carFactLi);
    });

    textDiv.append(carTitle, carHighlightsDiv, carFactsUl);

    const carLink = document.createElement("a");
    carLink.setAttribute("href", "/vehicle?id=" + vehicle.id);
    carLink.append(imageDiv, textDiv);
    vehicleDiv.append(carLink);

    inventoryDiv.append(vehicleDiv);
  });
  MakeTitlesFitOnOneLine();
};

const reviewsDiv = document.querySelector(".reviews");
reviews.forEach((review) => {
  const reviewDiv = document.createElement("div");
  reviewDiv.classList.add("review", "card");
  const fiveStarsImage = document.createElement("img");
  fiveStarsImage.setAttribute("src", "images/stars.jpg");
  fiveStarsImage.setAttribute("alt", "5 Stars");
  const reviewText = document.createElement("p");
  reviewText.textContent = review.review;
  const reviewerName = document.createElement("p");
  reviewerName.classList.add("reviewer-name");
  reviewerName.textContent = "- " + review.reviewer;

  reviewDiv.append(reviewText, reviewerName, fiveStarsImage);
  reviewsDiv.append(reviewDiv);
});

function sideScroll(element, direction, speed, distance, step) {
  scrollAmount = 0;
  var slideTimer = setInterval(function () {
    if (direction == "left") {
      element.scrollLeft -= step;
    } else {
      element.scrollLeft += step;
    }
    scrollAmount += step;
    if (scrollAmount >= distance) {
      window.clearInterval(slideTimer);
    }
  }, speed);
}

const scrollToNextReviews = (e) => {
  if (e.target.classList.contains("scroll-arrow-right")) {
    sideScroll(document.querySelector(".reviews"), "right", 10, 290, 10);
  } else {
    sideScroll(document.querySelector(".reviews"), "left", 10, 290, 10);
  }
};

document.querySelectorAll(".scroll-arrow").forEach((arrow) => {
  arrow.addEventListener("click", (e) => scrollToNextReviews(e));
});
