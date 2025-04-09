const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities")

// Rutas públicas (accesibles sin login)
router.get("/type/:classificationId", invController.buildByClassificationId)
router.get("/detail/:invId", invController.buildByInvId)
router.get("/getInventory/:classification_id", invController.getInventoryJSON)

// Vista principal de inventario (protegida)
router.get("/", utilities.checkLogin, utilities.checkAccountType, invController.buildManagement)

// Agregar clasificación
router.get("/add-classification",
  utilities.checkLogin,
  utilities.checkAccountType,
  invController.buildAddClassification
)

router.post("/add-classification",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassData,
  invController.insertClassification
)

// Agregar inventario
router.get("/add-inventory",
  utilities.checkLogin,
  utilities.checkAccountType,
  invController.buildAddInventory
)

router.post("/add-inventory",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  invController.insertInventory
)

// Editar inventario
router.get("/edit/:inv_id",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.editInventoryView)
)

router.post("/update",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Confirmación de eliminación
router.get("/delete/:inv_id",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildDeleteConfirm)
)

router.post("/delete",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router
