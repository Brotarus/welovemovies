const router = require("express").Router();
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

const reviewsRouter = require("../reviews/reviews.router");
const theatersRouter = require("../theaters/theaters.router");

const cors = require("cors");

// Enable CORS for all routes
router.use(cors());

router.use("/:movieId/reviews", reviewsRouter);
router.use("/:movieId/theaters", theatersRouter);

router.route("/:movieId")
    .get(controller.read)
    .all(methodNotAllowed);

router.route("/")
    .get(controller.list)
    .all(methodNotAllowed);

module.exports = router;
