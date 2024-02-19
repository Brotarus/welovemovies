const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(request, response, next) {
  const { reviewId } = request.params;
  const review = await service.read(reviewId);
  if (review) {
    response.locals.review = review;
    return next();
  }
  next({ status: 404, message: "Review cannot be found." });
}

async function destroy(request, response) {
  const { reviewId } = request.params;
  await service.destroy(reviewId);
  response.sendStatus(204);
}

async function list(request, response) {
  const { movieId } = request.params;
  const reviews = await service.list(movieId);
  response.json({ data: reviews });
}

function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

async function update(request, response) {
  const { reviewId } = request.params;
  const { data } = request.body;
  
  //console.log(`REVIEWS UPDATE reviewId: ${reviewId}, data: ${JSON.stringify(data)}`);
  
  const updatedReview = {
    ...response.locals.review,
    ...data,
    review_id: reviewId,
  };

  //console.log(`REVIEWS UPDATE reviewId: ${reviewId}, updatedReview: ${JSON.stringify(updatedReview)}`);

  const updatedData = await service.update(updatedReview);

  //console.log(`REVIEWS UPDATE reviewId: ${reviewId}, updatedData: ${JSON.stringify(updatedData)}`);

  response.json({ data: updatedData });
}

module.exports = {
  destroy: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
