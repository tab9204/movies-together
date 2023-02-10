//deletes a tag from the db
import {error} from '@sveltejs/kit';

export const POST = async ({request, locals})=>{
    const tag = await request.json();
    try{
        await locals.pb.collection('lists').delete(tag.id);
        //respond back so the client can be properly updated 
        return new Response(JSON.stringify("ok"));
    }
    catch(err){
        console.log(err);
        throw new error (400,'Could not remove tag');
    }

}