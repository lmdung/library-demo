var express = require('express')
var multipart = require("connect-multiparty");                        
var multipartMiddleware = multipart();
const controller = require('../controllers/user.controller')
const validate = require('../validate/user.validate')
var router = express.Router()

router.get("/", controller.index)
router.get("/addUser", controller.create)
router.get("/delete/:id", controller.delete)
router.get("/update/:id", controller.update)
router.get("/updateAvatar/:id", controller.updateAvatar)

router.post("/addUser", multipartMiddleware, validate.postCreate, controller.postCreate);
router.post("/update/:id", controller.postUpdate)
router.post("/updateAvatar/:id", multipartMiddleware, controller.postUpdateAvatar)

module.exports = router;