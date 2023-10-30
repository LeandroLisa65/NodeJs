const socketClient = io();

//create
const form = document.getElementById("form");

const inputTitle = document.getElementById("title");
const inputDescription = document.getElementById("description");
const inputPrice = document.getElementById("price");
const inputThumbnail = document.getElementById("thumbnail");
const inputCode = document.getElementById("code");
const inputStock = document.getElementById("stock");
const inputCategory = document.getElementById("category");

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
  product["category"] = inputCategory.value;
  socketClient.emit("createProduct", product);
};

//get
socketClient.on("getProducts", function(productList){
  productListContainer.innerHTML = '';
  console.log(productList);
  productList.docs.forEach(function(product){
    productListContainer.appendChild(createDiv(product));
  })
});

const createDiv = (product) => {
  const localDiv = document.createElement('div');
  Object.keys(product).forEach(key => {
    localDiv.appendChild(createSpan(`${key}: `,product[key]));
  });
  return localDiv;
}

const createSpan = (property,value) => {
  const span = document.createElement('span')
  span.innerText += property;
  span.innerText += value;
  span.innerText += ' ';

  return span;
}

//delete
const formDelete = document.getElementById("formDelete");

const inputId = document.getElementById("id");

formDelete.onsubmit = (e) => {
  e.preventDefault();
  const id = inputId.value;
  socketClient.emit("deleteProduct", id);
};

//cliente conectado
socketClient.on('clientConnected', (message) => {
  console.log(message);
})