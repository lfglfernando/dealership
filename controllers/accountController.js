const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

async function buildLogin(req, res) {
  const nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    messages: req.flash(),
  })
}

async function buildRegister(req, res) {
  const nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    messages: req.flash(),
  })
}

async function registerAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  const nav = await utilities.getNav()

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult.rowCount > 0) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`)
      return res.redirect("/account/login")
    } else {
      throw new Error("Registration failed")
    }
  } catch (error) {
    req.flash("error", "Sorry, the registration failed.")
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
}

async function accountLogin(req, res) {
  const nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("error", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      messages: req.flash(),
      account_email,
    })
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password

      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })

      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 3600000,
      })

      return res.redirect("/account")
    } else {
      throw new Error("Invalid password")
    }
  } catch (error) {
    req.flash("error", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      messages: req.flash(),
      account_email,
    })
  }
}

async function buildAccount(req, res) {
  const nav = await utilities.getNav()
  const accountData = res.locals.accountData
  res.render("account/index", {
    title: "Account Management",
    nav,
    errors: null,
    messages: req.flash(),
    accountData,
  })
}

async function buildUpdateAccount(req, res) {
  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountById(account_id)
  const nav = await utilities.getNav()
  res.render("account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    messages: req.flash(),
    accountData,
  })
}

async function updateAccount(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const result = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)

  if (result) {
    req.flash("notice", "Account updated successfully.")
    req.session.save(() => {
      res.redirect("/account")
    })
  } else {
    req.flash("error", "Account update failed.")
    req.session.save(() => {
      res.redirect(`/account/edit/${account_id}`)
    })
  }
}

async function updatePassword(req, res) {
  const { account_id, account_password } = req.body
  const hashedPassword = await bcrypt.hash(account_password, 10)
  const result = await accountModel.updatePassword(account_id, hashedPassword)

  if (result) {
    req.flash("notice", "Password updated successfully.")
    req.session.save(() => {
      res.redirect("/account")
    })
  } else {
    req.flash("error", "Password update failed.")
    req.session.save(() => {
      res.redirect(`/account/edit/${account_id}`)
    })
  }
}


async function logoutAccount(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have successfully logged out.")
  return res.redirect("/")
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccount,
  buildUpdateAccount,
  updateAccount,
  updatePassword,
  logoutAccount,
}
