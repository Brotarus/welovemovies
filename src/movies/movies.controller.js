const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(request, response, next) {
  const { movieId } = request.params;

  //console.log(`MOVIE EXISTS? id: ${movieId}`);

  const movie = await service.read(movieId);
  if(movie) {
    response.locals.movie = movie;
    return next();
  }

  next({ status: 404, message: `Movie cannot be found with movieId: ${movieId}` });
}

async function read(request, response) {
  const { movieId } = request.params;

  const movieData = await service.read(movieId);

  console.log(`MOVIES READ data: ${JSON.stringify(movieData)}`);
  
  response.json({ data: movieData });
}

async function list(request, response) {
  const isShowing = (request.query.is_showing === 'true');    

  const moviesData = await service.list(isShowing);

  //console.log(`MOVIES LIST data: ${JSON.stringify(moviesData)}`);

  response.json({ data: moviesData });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
};
