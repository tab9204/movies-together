import {error} from '@sveltejs/kit';

export const POST = async ({request, locals})=>{
    const list = await request.json();
    try{
        
        const newListEntry = {
            "name": list.name,
            "owners": [
                locals.user.id,
                locals.user.buddy_id
            ]
        };
        const record = await locals.pb.collection('lists').create(newListEntry);
        const newList = {
            id: record.id,
            name: record.name
        }
        return new Response(JSON.stringify(newList));
    }
    catch(err){
        console.log(err);
        throw new error (400,'Could not add new list');
    }

}