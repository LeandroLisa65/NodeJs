import swaggerJSDoc from 'swagger-jsdoc'

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentation of NodeJs',
            description: 'This is the documentation of Coderhouse backend course.'
        }
    },
    apis: [`./docs/**/*.yaml`]
}
const specs = swaggerJSDoc(swaggerOptions)

export { specs }

