const express = require("express")
const router = new express.Router()
const favoriteController = require("../controllers/favoriteController")
const utilities = require("../utilities")

router.post("/add", utilities.checkLogin, favoriteController.addFavorite)
router.get("/", utilities.checkLogin, favoriteController.viewFavorites)
router.post("/remove", utilities.checkLogin, favoriteController.removeFavorite)

module.exports = router
