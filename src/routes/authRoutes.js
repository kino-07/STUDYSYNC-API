const express = require('express');
const router  = express.Router();
const { register, login } = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, password]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Ana López
 *               email:
 *                 type: string
 *                 example: ana@upds.edu.bo
 *               password:
 *                 type: string
 *                 example: mipassword123
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Email ya existe o faltan campos
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: ana@upds.edu.bo
 *               password:
 *                 type: string
 *                 example: mipassword123
 *     responses:
 *       200:
 *         description: Login exitoso — devuelve token JWT
 *       401:
 *         description: Email o contraseña incorrectos
 */
router.post('/login', login);

module.exports = router;