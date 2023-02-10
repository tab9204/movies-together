//adds a new tag to the db
import {error} from '@sveltejs/kit';

export const POST = async ({request, locals})=>{
    const tag = await request.json();
    try{
        
        const data = {
            "name": tag.name,
            "owners": [
                locals.user.id,
                locals.user.buddy_id
            ]
        };
        const record = await locals.pb.collection('lists').create(data);
        const newTag = {
            id: record.id,
            name: record.name
        }
        //respond back so the client can be properly updated 
        return new Response(JSON.stringify(newTag));
    }
    catch(error){
        console.log(error);
        throw new error (400,'Could not add new tag');
    }

}