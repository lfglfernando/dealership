const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the inventory detail HTML
* ************************************ */
Util.buildVehicleDetail = async function(data) {
  const item = data[0]
  let detail = `
    <section id="vehicle-detail">
      <img src="${item.inv_image}" alt="Image of ${item.inv_make} ${item.inv_model}" />
      <div class="vehicle-info">
        <h2>${item.inv_year} ${item.inv_make} ${item.inv_model}</h2>
        <p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(item.inv_price)}</p>
        <p><strong>Description:</strong> ${item.inv_description}</p>
        <p><strong>Color:</strong> ${item.inv_color}</p>
        <p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(item.inv_miles)} miles</p>
      </div>
    </section>
  `
  return detail
}

/* **************************************
* Error handling middleware
* ************************************ */
Util.handleErrors = function (fn) {
  return function (req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(next)
  }
}

Util.globalErrorHandler = async function (err, req, res, next) {
  console.error("Global Error Handler:", err.message)

  let nav
  try {
    nav = await Util.getNav()
  } catch {
    nav = "<ul><li><a href='/'>Home</a></li></ul>"
  }

  res.status(500).render("errors/error", {
    title: "Server Error",
    message: err.message,
    nav,
  })
}

/* **************************************
* Build the classification dropdown <select>
* ************************************ */
Util.buildClassificationList = async function(classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected"
    }
    classificationList += `>${row.classification_name}</option>`
  })
  classificationList += "</select>"
  return classificationList
}

module.exports = Util
