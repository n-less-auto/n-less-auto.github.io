const reviewsDiv = document.querySelector(".reviews");
reviews.forEach((review) => {
  const reviewDiv = document.createElement("div");
  reviewDiv.classList.add("review");
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
