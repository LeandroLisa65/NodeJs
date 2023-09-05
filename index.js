class ProductManager
{
    constructor()
    {
        this.products = [];
    }

    static IdGlobal = 1;

    addProduct = (title, description, price, thumbnail, code, stock) => {
        if(this.#validateAttributes(title, description, price, thumbnail, code, stock))
            return;

        if(this.#validateCode(code))
            return;

        this.products.push({
            title 
            , description
            , price
            , thumbnail
            , code
            , stock
            , id: ProductManager.IdGlobal
        });
        ProductManager.IdGlobal++;
    }

    getProducts = () => {
        return this.products;
    }

    getProductById = (id) => {
        const product = this.products.find(x => x.id === id);
        if(product)
            return product;

        return 'Not Found';
    }

    #validateCode = (code) => {
        const included = this.products.some(x => x.code === code);

        if(included)
            console.log('The code for the product already exists');

        return included;
    }

    #validateAttributes = (title, description, price, thumbnail, code, stock) => {
        let isValid = !title || !description || !price || !thumbnail || !code || !stock;      
        if(isValid)
            console.log('All attributes should have a valid value')

        return isValid;
    }
}

let x = new ProductManager();
console.log(x.getProducts());
x.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc123',25);
console.log(x.getProducts());
x.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc123',25);
console.log(x.getProductById(1));
console.log(x.getProductById(2));
x.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc1234',25);
console.log(x.getProductById(2));
x.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc12345',25);
x.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc123456',25);
console.log(x.getProducts());

