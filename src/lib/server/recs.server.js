//returns the total number of movie recommendations a user has 

export const numRecs = async (locals)=>{
    try{
        //only get 50 recommendations total
        //if there is more 
        const recs = await locals.pb.collection('recommended_movies').getFullList(200, {
            filter: `to = '${locals.user.id}' && from = '${locals.user.buddy_id}'`,
        });
        //we just need to return the total number of recs
        const total = recs.length;
        return total;
    }
    catch(err){
        console.log(err);
    }
}