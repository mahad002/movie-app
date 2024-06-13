const processMovieData = (req, res, next) => {
    try {
      const data = req.body;
      // console.log("DATA: ",data);
      // Convert specific fields to numbers
      data.id = Number(data.id);
      data.popularity = Number(data.popularity);
      data.vote_average = Number(data.vote_average);
      data.vote_count = Number(data.vote_count);
      data.budget = Number(data.budget);
      data.revenue = Number(data.revenue);
      data.runtime = Number(data.runtime);
  
      // Convert genreIds to an array of numbers
      if (data.genreIds) {
        data.genreIds = data.genreIds.map(genre => Number(genre.id));
      }
  
      // Convert genres array
      if (data.genres) {
        data.genres = data.genres.map(genre => ({
          id: Number(genre.id),
          name: genre.name
        }));
      }
  
      // Convert production companies
      if (data.production_companies) {
        data.production_companies = data.production_companies.map(company => ({
          id: Number(company.id),
          logoPath: company.logoPath,
          name: company.name,
          originCountry: company.originCountry
        }));
      }
  
      // Convert release_date to Date
      if (data.release_date) {
        data.release_date = new Date(data.release_date);
      }
  
      // Assign the processed data back to the request body
      req.body = data;
  
      next();
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = processMovieData;
  