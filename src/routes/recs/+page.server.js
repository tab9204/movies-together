export const load = async ({locals})=>{
  const getRecs = async()=>{
    try{
        //get the recommended movies for this user
        const recList = await locals.pb.collection('recommended_movies').getList(1, 50, {
            filter: `to = '${locals.user.id}' && from = '${locals.user.buddy_id}'`,
        });
        let recs = [];
        //loop through each recommendation
        recList.items.forEach(async (rec) => {
          //we need the movie details and the entry id
          //the id is so we can remove the rec from the recommended list
          const recData = {
              id: rec.id,
              movie: rec.movie,
              list: rec.list
          }
          recs.push(recData);
        });
        //return the recommendations
        return recs;
    }
    catch(err){
        console.log(err);
      return [];
    }
  }

  return {
    recs: getRecs(),
    user: locals.user
  }
}
