const cookieParser = require("cookie-parser")
const express = require("express")
const session = require("express-session")
const bodyParser = require("body-parser")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const flash = require("connect-flash")
const pool = require("./database/")
const baseController = require("./controllers/baseController")
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const utilities = require("./utilities/")

const app = express()

// Session middleware
app.use(session({
  store: new (require("connect-pg-simple")(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  name: "sessionId",
}))

// Flash messages
app.use(flash())

// Make flash messages available via getMessages() in all views
app.use((req, res, next) => {
  res.locals.getMessages = () => req.flash()
  next()
})

// Parse JSON and form data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// JWT token check
app.use(utilities.checkJWTToken)

// Logged-in status for conditional view rendering
app.use((req, res, next) => {
  res.locals.loggedin = !!res.locals.accountData
  next()
})

// Set view engine and layout
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

// Static files and routing
app.use(static)
app.get("/", baseController.buildHome)
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)

const favoriteRoute = require("./routes/favoriteRoute")
app.use("/favorites", favoriteRoute)


// 404 Handler
app.use(async (req, res, next) => {
  let nav
  try {
    nav = await utilities.getNav()
  } catch {
    nav = "<ul><li><a href='/'>Home</a></li></ul>"
  }
  res.status(404).render("errors/404", {
    title: "Page Not Found",
    message: "Sorry, the page you are looking for does not exist.",
    nav,
  })
})

// Global error handler
app.use(utilities.globalErrorHandler)

const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
