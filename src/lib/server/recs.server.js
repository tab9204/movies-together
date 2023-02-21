//used to display a notification in the nav when the user has at least 1 recommendation
export const getNumberOfRecs = async (locals)=>{
    try{
        const recs = await locals.pb.collection('recommended_movies').getFullList(200, {
            filter: `to = '${locals.user.id}' && from = '${locals.user.buddy_id}'`,
        });
        const total = recs.length;
        return total;
    }
    catch(err){
        console.log(err);
    }
}