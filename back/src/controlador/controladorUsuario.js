const UsuariosModel = require('../modelo/esquemaUsuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class Usuarios {
  static async register(req, res) {
    const { username, email, password, role } = req.body;

    try {
      // Cifrar la contraseña antes de guardar
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = { username, email, password: hashedPassword, role, coupons };

      const { data, error } = await UsuariosModel.createOne(newUser);

      if (error) {
        return res.status(400).json({ message: 'Error al registrar usuario' });
      }

      res.status(201).json({ message: 'Usuario registrado con éxito', data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor', error });
    }
  }

  static async login(req, res) {
    const { username, password } = req.body;
  
    try {
      const { data: user, error } = await UsuariosModel.findOne({ username });
  
      if (error || !user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
  
      // Generar token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Incluir datos del usuario en la respuesta
      res.json({
        token,
        user: {
          username: user.username,  
          role: user.role,
          coupons: user.coupons || "",
        },
        message: 'Inicio de sesión exitoso',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}

module.exports = Usuarios;