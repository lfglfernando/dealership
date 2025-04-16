const pool = require("../database/")

async function addFavorite(account_id, inv_id) {
  const sql = `
    INSERT INTO favorites (account_id, inv_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    RETURNING *`
  return await pool.query(sql, [account_id, inv_id])
}

async function getFavoritesByUser(account_id) {
  const sql = `
    SELECT i.* FROM favorites f
    JOIN inventory i ON f.inv_id = i.inv_id
    WHERE f.account_id = $1`
  const result = await pool.query(sql, [account_id])
  return result.rows
}

async function removeFavorite(account_id, inv_id) {
  const sql = `DELETE FROM favorites WHERE account_id = $1 AND inv_id = $2`
  return await pool.query(sql, [account_id, inv_id])
}

module.exports = { addFavorite, getFavoritesByUser, removeFavorite }
