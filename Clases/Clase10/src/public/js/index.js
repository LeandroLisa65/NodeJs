const socketClient = io();

socketClient.on('welcome', (message) => {
    alert(message);
})

const form = document.getElementById('form');
const inputPrice = document.getElementById('inputPrice');
const price = document.getElementById('priceP');
form.onsubmit = (e) => {
    e.preventDefault();
    const price = inputPrice.
}