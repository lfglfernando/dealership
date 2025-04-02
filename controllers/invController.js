const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  let nav = await utilities.getNav()

  if (!data || data.length === 0) {
    req.flash("notice", "No vehicles found for this classification.")
    return res.render("./inventory/classification", {
      title: "Classification not found",
      nav,
      grid: "",
      messages: req.flash(),
    })
  }

  const grid = await utilities.buildClassificationGrid(data)
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    messages: req.flash(),
  })
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const invId = req.params.invId
  const data = await invModel.getVehicleByInvId(invId)
  const detail = await utilities.buildVehicleDetail(data)
  const nav = await utilities.getNav()
  const vehicle = data[0]
  const title = `${vehicle.inv_make} ${vehicle.inv_model}`

  res.render("./inventory/detail", {
    title,
    nav,
    detail,
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    messages: req.flash(),
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    messages: req.flash(),
    errors: null,
  })
}

/* ***************************
 *  Insert new classification
 * ************************** */
invCont.insertClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", `Successfully added ${classification_name}`)
    res.redirect("/inv")
  } else {
    req.flash("notice", "Failed to add classification.")
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      messages: req.flash(),
      errors: null,
    })
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    messages: req.flash(),
  })
}

/* ***************************
 *  Insert new inventory item
 * ************************** */
invCont.insertInventory = async function (req, res) {
  const result = await invModel.addInventory(req.body)

  if (result) {
    req.flash("notice", "New vehicle added successfully.")
    res.redirect("/inv")
  } else {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(req.body.classification_id)
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      messages: req.flash(),
      ...req.body,
    })
  }
}

module.exports = invCont