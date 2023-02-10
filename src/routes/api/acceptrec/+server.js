//when a user accepts a recommendation 
//adds the movie to the watchlist collection while remove it from the recommended movies collection
import {error} from '@sveltejs/kit';

export const POST = async ({request, locals})=>{
    const rec = await request.json();
    try{
        const data = {
            "movie": rec.movie,
            "owners": [
                locals.user.id,
                locals.user.buddy_id
            ]
        };
        await locals.pb.collection('watchlist').create(data);
        //remove the movie from the recommended list
        await locals.pb.collection('recommended_movies').delete(rec.id);
        //respond back so the client can be properly updated 
        return new Response(JSON.stringify("ok"));
    }
    catch(err){
        console.log(err);
        throw new error (400,'Operation could not be completed');
    }

}