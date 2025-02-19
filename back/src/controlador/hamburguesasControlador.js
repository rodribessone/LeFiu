const HamburguesaModel = require('../modelo/esquemaHamburguesas');

class HamburguesasController {
  static async getHamburguesasPrice(req, res) {
    const result = await HamburguesaModel.getHamburguesasPrice();
    if (result.error) {
      return res.status(500).json({ message: 'Error al obtener precios' });
    }
    // Enviar como array de objetos
    res.status(200).json([
      { nombre: "doble", precio: result.data.doble },
      { nombre: "triple", precio: result.data.triple }
    ]);
  }

  static async updateHamburguesasPrice(req, res) {
    const { doble, triple } = req.body; // Extraemos doble y triple
    // Validar que ambos sean números positivos
    if (
      typeof doble !== 'number' || doble <= 0 ||
      typeof triple !== 'number' || triple <= 0
    ) {
      return res.status(400).json({ message: 'Los precios deben ser números positivos' });
    }
  
    // Llamar al método del modelo con ambos valores
    const result = await HamburguesaModel.updateHamburguesaPrices({ doble, triple });
    if (result.error || !result.data) {
      return res.status(400).json({ message: result.message || 'Error al actualizar el precio de tipos de hamburguesa' });
    }
    res.status(200).json({
      message: 'Precios de tipos de hamburguesa actualizados correctamente.',
      doble: result.data.doble,
      triple: result.data.triple
    });
  }  
}

module.exports = HamburguesasController;
