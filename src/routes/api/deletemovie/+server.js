import {error} from '@sveltejs/kit';

export const POST = async ({request, locals})=>{
    const movie = await request.json();
    try{
        await locals.pb.collection('movies').delete(movie.id);
        //It doesn't matter what we respond with, we just send any response on success so the client can update the UI 
        return new Response(JSON.stringify("ok"));
    }
    catch(err){
        console.log(err);
        throw new error (400,'Operation could not be completed');
    }

}