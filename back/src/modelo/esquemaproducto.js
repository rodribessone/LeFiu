const z = require('zod')

const Product = z.object({
    nombre: z.string(),
    precio: z.number(),
    descripcion: z.string(),
    imagen: z.string(),
    categoria: z.string(),
})

module.exports = Product