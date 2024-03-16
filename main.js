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

const inventoryDiv = document.querySelector(".cars");
inventory.forEach((vehicle) => {
  const vehicleDiv = document.createElement("div");
  vehicleDiv.classList.add("card", "car-card");

  const imageDiv = document.createElement("div");
  imageDiv.classList.add("car-card-img");

  const carImg = document.createElement("img");
  carImg.setAttribute("src", vehicle.pics[0]);
  carImg.setAttribute("alt", "vehicle");
  imageDiv.append(carImg);

  const textDiv = document.createElement("div");
  textDiv.classList.add("car-card-text");

  const carTitle = document.createElement("h3");
  carTitle.textContent = vehicle.name;

  const carHighlightsDiv = document.createElement("div");
  carHighlightsDiv.classList.add("car-highlights");

  const priceP = document.createElement("p");
  priceP.textContent = "$" + vehicle.price;

  const milesP = document.createElement("p");
  milesP.textContent = vehicle.miles + " miles";

  carHighlightsDiv.append(priceP, milesP);

  const carFactsUl = document.createElement("ul");
  vehicle.details.forEach((detail) => {
    const carFactLi = document.createElement("li");
    carFactLi.textContent = detail;
    carFactsUl.append(carFactLi);
  });

  const arrowLink = document.createElement("a");
  arrowLink.setAttribute("href", "#");
  arrowLink.classList.add("arrow-link");
  const arrowImg = document.createElement("img");
  arrowImg.setAttribute("src", "images/arrow.png");
  arrowImg.setAttribute("alt", "arrow");
  arrowLink.append(arrowImg);

  textDiv.append(carTitle, carHighlightsDiv, carFactsUl, arrowLink);

  vehicleDiv.append(imageDiv, textDiv);

  inventoryDiv.append(vehicleDiv);
});
