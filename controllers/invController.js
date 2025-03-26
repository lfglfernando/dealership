const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
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
      detail
    })
}
  


module.exports = invCont