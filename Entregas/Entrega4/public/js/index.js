const socketClient = io();

const priceP = document.getElementById("priceP");

const form = document.getElementById("form");

const inputTitle = document.getElementById("title");
const inputDescription = document.getElementById("description");
const inputPrice = document.getElementById("price");
const inputThumbnail = document.getElementById("thumbnail");
const inputCode = document.getElementById("code");
const inputStock = document.getElementById("stock");

const productListContainer = document.getElementById("productList");

form.onsubmit = (e) => {
  e.preventDefault();
  const product = {};
  product["title"] = inputTitle.value;
  product["description"] = inputDescription.value;
  product["price"] = inputPrice.value;
  product["thumbnail"] = inputThumbnail.value;
  product["code"] = inputCode.value;
  product["stock"] = inputStock.value;
  socketClient.emit("newProduct", product);
};

socketClient.on("priceUpdated", function(productList){

  productList.forEach(function(product){
    console.log(product);
  })
});
