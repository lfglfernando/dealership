const favoriteModel = require("../models/favorite-model")

async function addFavorite(req, res) {
  const { inv_id } = req.body
  const account_id = res.locals.accountData.account_id
  await favoriteModel.addFavorite(account_id, inv_id)
  req.flash("notice", "Vehicle added to favorites.")
  res.redirect("/favorites")
}

async function viewFavorites(req, res) {
  const nav = await require("../utilities/").getNav()
  const account_id = res.locals.accountData.account_id
  const favorites = await favoriteModel.getFavoritesByUser(account_id)
  res.render("account/favorites", {
    title: "My Favorites",
    nav,
    favorites,
    messages: req.flash(),
    errors: null
  })
}

async function removeFavorite(req, res) {
  const { inv_id } = req.body
  const account_id = res.locals.accountData.account_id
  await favoriteModel.removeFavorite(account_id, inv_id)
  req.flash("notice", "Vehicle removed from favorites.")
  res.redirect("/favorites")
}

module.exports = { addFavorite, viewFavorites, removeFavorite }
