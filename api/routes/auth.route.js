var express = require('express')
var router = express.Router()
const controller = require('../controllers/auth.controller')

// router.get("/login", controller.index)
router.post("/", controller.postLogin)
module.exports = router;
