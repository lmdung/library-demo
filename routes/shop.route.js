var express = require('express')
const controller = require('../controllers/shop.controller');
const authMiddleware = require("../middleware/auth.middleware");
var multipart = require("connect-multiparty");                        
var multipartMiddleware = multipart();

var router = express.Router()

router.get('/', controller.index);
router.get("/create", authMiddleware.requireAuth, controller.create)
router.get('/addBook/:id', controller.addBook)
router.get('/books/:id', controller.getShop)

router.post("/create/:id", controller.postCreate)
router.post('/addBook/:id', multipartMiddleware, controller.postAddBook)
module.exports = router;