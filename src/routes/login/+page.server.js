import {redirect, fail} from '@sveltejs/kit';
import {getNumberOfRecs} from "$lib/server/recs.server.js"

export const load = async ({locals})=>{
    if(locals.user){
        return {
            user:locals.user,
            numberOfRecs: getNumberOfRecs(locals)
        }
    }
    return {
        user: undefined
    }
}

export const actions = {
	signup: async ({ locals, request }) => {
        try{
            const formData = Object.fromEntries(await request.formData());
            const userAccountData = {
                "username":formData.username,
                "password":formData.password,
                "buddy_id": "", //should default to empty
                "buddy_username": "", //should default to empty
                "passwordConfirm": formData.password
            };
            await locals.pb.collection('users').create(userAccountData);
            await locals.pb.collection('users').authWithPassword(
                formData.username,
                formData.password
            );  
        }
        catch(err){
            console.log(err.data.message);    
            return fail(400, {signupError: true});
        }
        throw redirect(303,"/");
		
	},
    login: async ({ locals, request }) => { 
        try{
            const formData = Object.fromEntries(await request.formData());
		    await locals.pb.collection('users').authWithPassword(
                formData.username,
                formData.password,
             );
        }
        catch(err){
            console.log(err);
            return fail(400, {loginError: true});
        }
        throw redirect(303,"/");
	},
    logout: async ({ locals, request }) => {
		locals.pb.authStore.clear();
        locals.user = undefined;
	}
};