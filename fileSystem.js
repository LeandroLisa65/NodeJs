const fs = require('fs')

//Sync
    //crear
    fs.writeFileSync('prueba.txt','primera linea de prueba');
    fs.writeFileSync('prueba.txt', 'segunda linea de prueba');
    //leer
    const texto = fs.readFileSync('prueba.txt','utf-8');
    console.log(texto);
    //eliminar
    fs.unlinkSync('prueba.txt');
    //agregar
    fs.appendFileSync('prueba.txt', 'agrego una línea al final');

    //buscar
    console.log(fs.existsSync('prueba.txt'));

//Async

    //crear
    let data = "This is a file containing a collection of books.";
  
    fs.writeFile("books.txt", data, (err) => {
      if (err)
        console.log(err);
      else {
        console.log("File written successfully\n");
        console.log("The written has the following contents:");
        console.log(fs.readFileSync("books.txt", "utf8"));
      }
    });

    //leer
    const textoAsync = fs.readFileSync('books.txt','utf-8', (error, data) => {
        if (error)
        {
            console.log(error)
        }
        else 
        {
            console.log(data)
        }});
    console.log(textoAsync);
    //eliminar
    fs.unlink('books.txt', (error) => {
        if (error)
        {
            console.log(error)
        }
        else 
        {
            console.log("bien")
        }});
    //agregar
    fs.appendFileSync('books.txt', 'agrego una línea al final');

    //buscar
    console.log(fs.existsSync('books.txt'));

//Promises
    //crear
    fs.promises.writeFile('promise.txt','texto')
    .then(() => console.log('bien promise'))
    .catch((e) => console.log(e));

    //leer
    fs.promises.readFile('promise.txt')
    .then(()=> console.log('promise.txt leído'))
    .catch((e)=>console.log(e));

    //eliminar
    fs.promises.unlink('promise.txt')
    .then(()=> console.log('promise.txt eliminado'))
    .catch((e)=>console.log(e));

//Promises Json
const myJson = { 
    "name": "Sara",
    "age": 23,
    "gender": "Female",
    "department": "History",
    "car": "Honda"
};
    //crear
    fs.promises.writeFile('promise.json','holatexto')
    .then(() => console.log('bien promise'))
    .catch((e) => console.log(e));

    //leer
    fs.promises.readFile('promise.txt')
    .then(()=> console.log('promise.txt leído'))
    .catch((e)=>console.log(e));