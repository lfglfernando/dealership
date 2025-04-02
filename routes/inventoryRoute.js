const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

// Route to view by classification
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to view vehicle details
router.get("/detail/:invId", invController.buildByInvId)

// Management view route
router.get("/", invController.buildManagement)

router.get("/add-classification", invController.buildAddClassification)
router.post("/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassData,
  invController.insertClassification
)

router.get("/add-inventory", invController.buildAddInventory)
router.post("/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  invController.insertInventory
)

module.exports = router
