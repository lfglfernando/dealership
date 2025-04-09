const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

baseController.triggerError = (req, res, next) => {
    try {
      // This simulates a server-side exception
      throw new Error("Intentional Server Error for testing.")
    } catch (err) {
      next(err) // Pass error to the global error handler
    }
}
  

module.exports = baseController