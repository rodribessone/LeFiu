const Delivery = require('../modelo/esquemaDelivery');

class DeliveryController {
  // Obtener el precio de delivery
  static async getDeliveryPrice(req, res) {
    try {
      const delivery = await Delivery.findOne();
      if (!delivery) {
        return res.status(404).json({ message: 'Precio de delivery no configurado.' });
      }
      res.status(200).json({ deliveryPrice: delivery.price });
    } catch (error) {
      console.error('Error al obtener el precio de delivery:', error.message);
      res.status(500).json({ message: 'Error al obtener el precio de delivery.' });
    }
  }

  // Actualizar el precio de delivery
  static async updateDeliveryPrice(req, res) {
    const { price } = req.body;

    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: 'El precio debe ser un número positivo.' });
    }

    try {
      let delivery = await Delivery.findOne();

      if (!delivery) {
        // Crear un nuevo documento si no existe
        delivery = new Delivery({ price });
      } else {
        // Actualizar el precio si ya existe
        delivery.price = price;
      }

      await delivery.save();
      res.status(200).json({
        message: 'Precio de delivery actualizado correctamente.',
        deliveryPrice: delivery.price,
      });
    } catch (error) {
      console.error('Error al actualizar el precio de delivery:', error.message);
      res.status(500).json({ message: 'Error al actualizar el precio de delivery.' });
    }
  }
}

module.exports = DeliveryController;