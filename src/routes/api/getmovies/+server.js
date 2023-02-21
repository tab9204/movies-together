import {getRandomNumber} from "$lib/utils.js";

export const GET = async () =>{
  try{
     //do an intial search of movies so we can get the total number of pages in the db 
    //we do this so that we can get a random page between 1 and the max number 
    const resp = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}`);
    const data = await resp.json();
    //TMDB will only even return 500 pages max 
    var total_pages = data.total_pages > 500 ? 500 : data.total_pages;
    var page = getRandomNumber(1,total_pages);
    //make another call but this time use the random page number
    var movies = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&page=${page}&include_adult=false`);
    const moviesData = await movies.json();
    return new Response(JSON.stringify(moviesData.results));
  }
  catch(err){
    console.log(err);
  }

}
