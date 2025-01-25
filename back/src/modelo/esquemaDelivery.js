const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
}, { collection: 'delivery' }); // Define explícitamente el nombre de la colección

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;