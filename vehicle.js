const id = window.location.href.split("=")[1];

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
    });
};

getAndPopulateVehicle();
