const HamburguesaModel = require('../modelo/esquemaHamburguesas');

class HamburguesasController {
  static async getHamburguesasPrice(req, res) {
    const result = await HamburguesaModel.getHamburguesasPrice();
    if (result.error || !result.data) {
      return res.status(500).json({ message: result.message || 'Error al obtener el precio de tipos de hamburguesa' });
    }
    res.status(200).json({ price: result.data.price });
  }

  static async updateHamburguesasPrice(req, res) {
    const { price } = req.body;
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: 'El precio debe ser un número positivo' });
    }
    const result = await HamburguesaModel.updateHamburguesasPrice(price);
    if (result.error || !result.data) {
      return res.status(400).json({ message: result.message || 'Error al actualizar el precio de tipos de hamburguesa' });
    }
    res.status(200).json({
      message: 'Precio de tipos de hamburguesa actualizado correctamente.',
      price: result.data.price,
    });
  }
}

module.exports = HamburguesasController;
