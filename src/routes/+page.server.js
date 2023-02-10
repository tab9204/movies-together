import 'dotenv/config';
import {getRandomNumber} from "$lib/utils.js";
import {numRecs} from "$lib/server/recs.server.js"


export const load = async ({locals})=>{
  //fetch random movie data
  const getMovies = async()=>{
    try{
      //do an intial search of movies so we can get the total number of movie pages
      //we do this so that we can get a random page between 1 and the max number 
      const resp = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}`);
      const data = await resp.json();
      //TMDB only allows returned movies from the first 500 pages of results
      var total_pages = data.total_pages > 500 ? 500 : data.total_pages;
      var page = getRandomNumber(1,total_pages);
      //make another call but this time use the random page number
      var movies = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&page=${page}`);
      const moviesData = await movies.json();
      return moviesData.results;
    }
    catch(err){
      return [];
    }
  }

  const getLists = async()=>{
    try{
      const resp = await locals.pb.collection('lists').getList(1, 50, {
        filter: `owners ~ '${locals.user.id}' && owners ~ '${locals.user.buddy_id}'`
      });
      let lists = [];
      resp.items.forEach(list =>{
        const listData = {
          id: list.id,
          name: list.name
        }
        lists.push(listData);
      })
      
      return lists;
    }
    catch(err){
      console.log(err);
      return [];
    }
  }

  return {
    movies: getMovies(),
    numRecs: numRecs(locals),
    lists: getLists(),
    user: locals.user
  }
}
