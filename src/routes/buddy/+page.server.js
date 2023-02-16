import {fail} from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import {numRecs} from "$lib/server/recs.server.js"


export const load = async({locals})=>{
    return {
        user: locals.user,
        numRecs: numRecs(locals)
    }

}

export const actions = {
    add: async({locals,request})=>{
        //get the form data
        const body = Object.fromEntries(await request.formData()); 
        const buddy = body.username;
        //verify the username is a valid user
        const users_list = await locals.pb.collection('users').getList(1, 1, {
            filter: `username = '${buddy}'`,
        });

        //if the specified buddy does not exist
        if(users_list.totalItems <= 0){
            return fail(400, {invalidUser: true});
        }
        //if the buddy is the user
        else if (buddy == locals.user.username){
            return fail(400, {addSelf: true});
        }
        else{
          //if the buddy does exist add it to this user's buddy field  
            const data = {
                "buddy_username": users_list.items[0].username,
                "buddy_id": users_list.items[0].id
            };
            const record = await locals.pb.collection('users').update(locals.user.id, data);
            //update the locals user with the new buddy info
            locals.user.buddy_username = users_list.items[0].username;
            locals.user.buddy_id = users_list.items[0].id;
            //redirect the user to the homepage 
            throw redirect(303,"/");
        }
        
    }
}