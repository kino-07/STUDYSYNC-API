const express      = require('express');
const router       = express.Router();
const grupoController = require('../controllers/gruposController');
const autenticar   = require('../middlewares/autenticar');

/**
 * @swagger
 * tags:
 *   name: Grupos
 *   description: Gestión de grupos de estudio
 */

/**
 * @swagger
 * /api/grupos:
 *   get:
 *     summary: Listar todos los grupos
 *     tags: [Grupos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de grupos
 *       401:
 *         description: Token requerido
 */
router.get('/', autenticar, grupoController.getAll);

/**
 * @swagger
 * /api/grupos/{id}:
 *   get:
 *     summary: Obtener un grupo por ID
 *     tags: [Grupos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Grupo encontrado
 *       401:
 *         description: Token requerido
 *       404:
 *         description: Grupo no encontrado
 */
router.get('/:id', autenticar, grupoController.getById);

/**
 * @swagger
 * /api/grupos:
 *   post:
 *     summary: Crear nuevo grupo
 *     tags: [Grupos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, materia, turno]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Grupo Algoritmos
 *               materia:
 *                 type: string
 *                 example: Programación IV
 *               turno:
 *                 type: string
 *                 example: mañana
 *     responses:
 *       201:
 *         description: Grupo creado
 *       400:
 *         description: Faltan campos
 *       401:
 *         description: Token requerido
 */
router.post('/', autenticar, grupoController.create);

/**
 * @swagger
 * /api/grupos/{id}:
 *   put:
 *     summary: Actualizar grupo completo
 *     tags: [Grupos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, materia, turno]
 *             properties:
 *               nombre:
 *                 type: string
 *               materia:
 *                 type: string
 *               turno:
 *                 type: string
 *     responses:
 *       200:
 *         description: Grupo actualizado
 *       401:
 *         description: Token requerido
 *       404:
 *         description: Grupo no encontrado
 */
router.put('/:id', autenticar, grupoController.update);

/**
 * @swagger
 * /api/grupos/{id}:
 *   delete:
 *     summary: Eliminar grupo
 *     tags: [Grupos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Grupo eliminado
 *       401:
 *         description: Token requerido
 *       404:
 *         description: Grupo no encontrado
 */
router.delete('/:id', autenticar, grupoController.remove);

module.exports = router;