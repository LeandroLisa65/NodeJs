import { faker } from '@faker-js/faker'

const generateProduct = () => {
    return{
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        thumbnails: [faker.image.url(), faker.image.url(), faker.image.url()],
        category: faker.commerce.department(),
        price: faker.commerce.price(),
        stock: faker.string.numeric(),
        status: faker.datatype.boolean(),

    }
}

export const mockingProducts = () => {
    let products = []

    for(let i = 0; i < 100; i++){
        products.push(generateProduct())
    }

    return products
}