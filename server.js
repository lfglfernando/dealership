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

app.use(session({
  store: new (require("connect-pg-simple")(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: "sessionId",
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(flash()) 
app.use(function (req, res, next) {
  res.locals.getMessages = () => req.flash() // ✅ pasa función en vez de consumirlos
  next()
})


app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

app.use(static)
app.get("/", baseController.buildHome)
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)

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

app.use(utilities.globalErrorHandler)

const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})