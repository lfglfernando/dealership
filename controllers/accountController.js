const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  const messages = req.flash() // ⚠️ Corrección aquí, no usar res.locals.getMessages()
  res.render("account/login", {
    title: "Login",
    nav,
    messages,
    errors: null
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    messages: req.flash(),
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  let nav = await utilities.getNav()

  // Hash the password before storing
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      messages: req.flash(),
      account_firstname,
      account_lastname,
      account_email,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult && regResult.rowCount > 0) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.redirect("/account/login")
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      messages: req.flash(),
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
}
