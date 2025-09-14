const EstadoModel = require('../modelo/esquemaEstado');

class EstadoController {
  static async getEstado(req, res) {
    try {
      const result = await EstadoModel.getEstado();
      if (!result || !result.data) {
        return res.status(200).json({ abierto: false }); // valor por defecto
      }
      return res.status(200).json(result.data);
    } catch (error) {
      console.error("Error en getEstado:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async updateEstado(req, res) {
    try {
      const { abierto } = req.body || {};
      if (typeof abierto !== "boolean") {
        return res
          .status(400)
          .json({ message: "El estado debe ser true o false" });
      }

      const result = await EstadoModel.updateEstado(abierto);

      return res.status(200).json({
        message: "Estado actualizado correctamente",
        abierto: result?.data?.abierto ?? abierto, // fallback
      });
    } catch (error) {
      console.error("Error en updateEstado:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = EstadoController;
