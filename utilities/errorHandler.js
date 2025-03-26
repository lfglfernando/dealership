Util.handleErrors = (err, req, res, next) => {
    console.error("Error: ", err.message)
    let nav = "<ul><li><a href='/'>Home</a></li></ul>" // fallback por si getNav falla
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: err.message,
      nav
    })
  }
  

module.exports = Util
