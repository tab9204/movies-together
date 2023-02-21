export const load = async ({locals})=>{
  const getMovieRecs = async()=>{
    try{
        const recList = await locals.pb.collection('recommended_movies').getList(1, 50, {
            filter: `to = '${locals.user.id}' && from = '${locals.user.buddy_id}'`,
        });
        let recs = [];
        recList.items.forEach(async (rec) => {
          //we return the pb entry id as we will need it to remove the movie from the recommended_movies collection 
          //after the user accepts or declines the movie
          const recData = {
              id: rec.id,
              movie: rec.movie,
              list: rec.list
          }
          recs.push(recData);
        });
        return recs;
    }
    catch(err){
        console.log(err);
      return [];
    }
  }

  return {
    movieRecs: getMovieRecs(),
    user: locals.user
  }
}
