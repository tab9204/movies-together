import {error} from '@sveltejs/kit';

export const POST = async ({request, locals})=>{
    const buddy = await request.json();
    try{
        await locals.pb.collection('users').update(locals.user.id, buddy);
        //keep the user data in locals up to date 
        locals.user.buddy_username = buddy.buddy_username;
        locals.user.buddy_id = buddy.buddy_id;
        return new Response(JSON.stringify("ok"));
    }
    catch(err){
        console.log(err);
        throw new error (400,'Operation could not be completed');
    }

}