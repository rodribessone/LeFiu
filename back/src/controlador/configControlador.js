const DeliveryModel = require('../modelo/esquemaDelivery');

class DeliveryController {
  // Obtener el precio de delivery
  static async getDeliveryPrice(req, res) {
    const result = await DeliveryModel.getDeliveryPrice();
    if (result.error || !result.data) {
      return res.status(500).json({ message: result.message || 'Error al obtener el precio de delivery' });
    }
    res.status(200).json({ deliveryPrice: result.data.price });
  }

  // Actualizar el precio de delivery
  static async updateDeliveryPrice(req, res) {
    const { price } = req.body;
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: 'El precio debe ser un número positivo' });
    }

    const result = await DeliveryModel.updateDeliveryPrice(price);
    if (result.error || !result.data) {
      return res.status(400).json({ message: result.message || 'Error al actualizar el precio de delivery' });
    }
    res.status(200).json({
      message: 'Precio de delivery actualizado correctamente.',
      deliveryPrice: result.data.price,
    });
  }
}

module.exports = DeliveryController;