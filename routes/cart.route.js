var express = require('express')
const controller = require('../controllers/cart.controller')
const authMiddleware = require("../middleware/auth.middleware");
var router = express.Router()

router.get('/', controller.index)
router.get('/add/:id', controller.addToCart)
router.get('/rent', authMiddleware.requireAuth, controller.rent)

module.exports = router;