let deliveryPrice = 1000; // Valor inicial de ejemplo, este puede estar en una base de datos

// Función para obtener el precio de delivery
const getDeliveryPrice = (req, res) => {
  res.json({ deliveryPrice });
};

// Función para actualizar el precio de delivery
const updateDeliveryPrice = (req, res) => {
  const { price } = req.body;

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ message: 'El precio debe ser un número positivo' });
  }

  // Aquí puedes actualizar la variable global o persistir en base de datos
  deliveryPrice = price;

  res.status(200).json({ message: 'Precio de delivery actualizado correctamente', deliveryPrice });
};

module.exports = {
  getDeliveryPrice,
  updateDeliveryPrice,
};