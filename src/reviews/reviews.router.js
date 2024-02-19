const router = require("express").Router({ mergeParams: true });
const controller = require("./reviews.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

const cors = require("cors");

// Enable CORS for all routes
router.use(cors());

router
  .route("/:reviewId")
  .delete(controller.destroy)
  .put(controller.update)
  .all(methodNotAllowed);

router.route("/")
  .get(controller.list)
  .all(methodNotAllowed);

module.exports = router;
