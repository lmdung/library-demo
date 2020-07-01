var express = require('express')
const controller = require('../controllers/transaction.controller')

var router = express.Router()

router.get("/", controller.index)
// router.get("/create", authMiddleware.requireAuth, isAminMiddleware.isAdmin, controller.create)
// router.get("/:id/complete", authMiddleware.requireAuth, isAminMiddleware.isAdmin, controller.complete)

// router.post("/create", controller.postCreate)

module.exports = router;