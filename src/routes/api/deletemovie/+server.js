//deletes a movie from a user's watchlist
import {error} from '@sveltejs/kit';

export const POST = async ({request, locals})=>{
    const movie = await request.json();
    try{
        await locals.pb.collection('watchlist').delete(movie.id);
        //respond back so the client can be properly updated 
        return new Response(JSON.stringify("ok"));
    }
    catch(err){
        console.log(err);
        throw new error (400,'Operation could not be completed');
    }

}