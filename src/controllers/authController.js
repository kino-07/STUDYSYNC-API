const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const prisma = require('../prismaClient');

// POST /auth/register
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre)   return res.status(400).json({ ok: false, mensaje: "El campo 'nombre' es obligatorio" });
    if (!email)    return res.status(400).json({ ok: false, mensaje: "El campo 'email' es obligatorio" });
    if (!password) return res.status(400).json({ ok: false, mensaje: "El campo 'password' es obligatorio" });

    // Verificar si el email ya existe
    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) {
      return res.status(400).json({ ok: false, mensaje: 'Ya existe un usuario con ese email' });
    }

    // Hash de la contraseña
    const hash = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.create({
      data: { nombre, email, password: hash }
    });

    res.status(201).json({
      ok: true,
      mensaje: 'Usuario registrado exitosamente',
      data: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
    });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
};

// POST /auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email)    return res.status(400).json({ ok: false, mensaje: "El campo 'email' es obligatorio" });
    if (!password) return res.status(400).json({ ok: false, mensaje: "El campo 'password' es obligatorio" });

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ ok: false, mensaje: 'Email o contraseña incorrectos' });
    }

    // Verificar contraseña
    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) {
      return res.status(401).json({ ok: false, mensaje: 'Email o contraseña incorrectos' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      ok: true,
      mensaje: 'Login exitoso',
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
    });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
};

module.exports = { register, login };