const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error)
  }
}

/* ***************************
 *  Get vehicle by inv_id
 * ************************** */
async function getVehicleByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getVehicleByInvId error " + error)
  }
}

/* ***************************
 *  Add a new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *`
    const data = await pool.query(sql, [classification_name])
    return data.rows[0]
  } catch (error) {
    console.error("addClassification error: " + error)
  }
}

/* ***************************
 *  Add a new inventory item
 * ************************** */
async function addInventory(invData) {
  try {
    const sql = `INSERT INTO public.inventory 
    (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`

    const data = await pool.query(sql, [
      invData.inv_make,
      invData.inv_model,
      invData.inv_description,
      invData.inv_image,
      invData.inv_thumbnail,
      invData.inv_price,
      invData.inv_year,
      invData.inv_miles,
      invData.inv_color,
      invData.classification_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("addInventory error: " + error)
  }
}

/* Export all functions in one object */
module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleByInvId,
  addClassification,
  addInventory
}
