const generateUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid.
        List of required properties:
        * first_name: needs to be a String received, ${user.first_name}
        * last_name: needs to be a String, received, ${user.last_name}
        * email: needs to be a String, received, ${user.email}`
}

const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid.
        List of required properties:
        * code: needs to be a String received, ${product.code}
        * title: needs to be a String received, ${product.title}
        * description: needs to be a String received, ${product.description}
        * price: needs to be a String received, ${product.price}
        * status: needs to be a String received, ${product.status}
        * category: needs to be a String received, ${product.category}
        * stock: needs to be a String received, ${product.stock}`
}

export { generateUserErrorInfo, generateProductErrorInfo }