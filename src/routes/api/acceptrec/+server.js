import {error} from '@sveltejs/kit';

export const POST = async ({request, locals})=>{
    const movieRec = await request.json();
    try{
        const newWatchlistEntry = {
            "movie": movieRec.movie,
            "list": movieRec.list,
            "owners": [
                locals.user.id,
                locals.user.buddy_id
            ]
        };
        await locals.pb.collection('movies').create(newWatchlistEntry);
        //since the user has made a decision on the movie we can remove it from the recommended_movies collection
        await locals.pb.collection('recommended_movies').delete(movieRec.id);
        //It doesn't matter what we respond with, we just send any response on success so the client can update the UI 
        return new Response(JSON.stringify("ok"));
    }
    catch(err){
        console.log(err);
        throw new error (400,'Operation could not be completed');
    }

}