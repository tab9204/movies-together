import {getNumberOfRecs} from "$lib/server/recs.server.js"

export const load = async ({locals})=>{
  const getUserMovies = async()=>{
    try{
      const watchlist = await locals.pb.collection('movies').getList(1, 50, {
        filter: `owners ~ '${locals.user.id}' && owners ~ '${locals.user.buddy_id}'`
      });
      let movies = [];
      watchlist.items.forEach(item => {
          const watchlistData = {
              id: item.id,
              list: item.list,
              movie: item.movie 
          }
          movies.push(watchlistData);
      });
      return movies;
    }
    catch(err){
      console.log(err);
      return [];
    }
  }

  const getUserLists = async()=>{
    try{
      const allLists = await locals.pb.collection('lists').getList(1, 50, {
        filter: `owners ~ '${locals.user.id}' && owners ~ '${locals.user.buddy_id}'`
      });
      let lists = [];
      allLists.items.forEach(list=>{
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
      movies: getUserMovies(),
      numberOfRecs: getNumberOfRecs(locals),
      lists: getUserLists(),
      user: locals.user
    }
  }