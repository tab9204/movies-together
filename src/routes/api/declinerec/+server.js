//when a user declines a recommendation 
//removes the movie from the recommended movies collection
import {error} from '@sveltejs/kit';

export const POST = async ({request, locals})=>{
    const id = await request.json();
    try{
        await locals.pb.collection('recommended_movies').delete(id);
        //respond back so the client can be properly updated 
        return new Response(JSON.stringify("ok"));
    }
    catch(err){
        console.log(err);
        throw new error (400,'Operation could not be completed');
    }

}