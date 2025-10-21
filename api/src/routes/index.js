const router = require("express").Router();
const exercisesRoute = require("./v1/exercises");
const staticRoute = require("./v1/static");

router.use("/v1/exercises", exercisesRoute);
router.use("/v1/static", staticRoute);

module.exports = router;