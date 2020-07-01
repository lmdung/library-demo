var express = require('express')
var multipart = require("connect-multiparty");                        
var multipartMiddleware = multipart();
var router = express.Router()
const controller = require('../controllers/book.controller')
const authMiddleware = require("../middleware/auth.middleware");
const isAminMiddleware = require("../middleware/isAdmin.middleware");

router.get("/", controller.index)
router.get("/addBook", authMiddleware.requireAuth, isAminMiddleware.isAdmin, controller.create)
router.get("/update/:id", authMiddleware.requireAuth, isAminMiddleware.isAdmin, controller.update)
router.get('/delete/:id', authMiddleware.requireAuth, isAminMiddleware.isAdmin, controller.delete)

router.post("/addBook", multipartMiddleware, controller.postCreate)
router.post("/update/:id", controller.postUpdate)

module.exports = router