/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const baseController = require("./controllers/baseController")
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

//Index route
app.get("/", baseController.buildHome)

// Inventory routes
app.use("/inv", inventoryRoute)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
// Catch-all 404 handler
app.use(async (req, res, next) => {
  let nav
  try {
    const utilities = require("./utilities")
    nav = await utilities.getNav()
  } catch {
    nav = "<ul><li><a href='/'>Home</a></li></ul>"
  }

  res.status(404).render("errors/404", {
    title: "Page Not Found",
    message: "Sorry, the page you are looking for does not exist.",
    nav
  })
})


const utilities = require("./utilities/")
app.use(utilities.handleErrors)


app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
