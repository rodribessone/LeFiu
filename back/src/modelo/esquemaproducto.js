const z = require('zod')

const Product = z.object({
    title: z.string(),
    marca: z.string(),
    price: z.number(),
    descriptions: z.string(),
    descriptionl: z.string(),
    color: z.array(z.string()).max(2),
    rodado: z.string(),
    size: z.string(),
    image: z.string(),
    category: z.string(),
    createdAt: z.string().optional(), // La fecha se genera automáticamente
})

module.exports = Product