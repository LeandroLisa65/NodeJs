class ProductManager
{
    constructor()
    {
        this.products = [];
    }

    static IdGlobal = 1;

    addProduct = (title, description, price, thumbnail, code, stock) => {
        if(!this.#validateAttributes(title, description, price, thumbnail, code, stock))
            return;

        if(this.#validateCode(code))
            return;

        const id = ProductManager.IdGlobal++;
        this.products.push({
            id
            , title 
            , description
            , price
            , thumbnail
            , code
            , stock
        });
    }

    getProducts = () => {
        return this.products;
    }

    getProductById = (id) => {
        const product = this.products.find(x => x.id === id);
        if(product)
            return product;

        console.log('Not Found');
    }

    #validateCode = (code) => {
        const included = this.products.some(x => x.code === code);

        if(included)
            console.log('The code for the product already exists');

        return included;
    }

    #validateAttributes = (title, description, price, thumbnail, code, stock) => {
        let isValid = !title || !description || !price || !thumbnail || !code || !stock;      
        if(!isValid)
            console.log('All attributes should have a valid value')

        return isValid;
    }
}

let x = new ProductManager();

x.addProduct('a','a',1,'B','',1);
x.addProduct('a','a',1,'B','a',1);
x.addProduct('a','a',1,'B','a',1);
console.log(x.getProducts());
console.log(x.getProductById(1));
console.log(x.getProductById(2));

