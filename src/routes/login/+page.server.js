import {redirect, fail} from '@sveltejs/kit';

//return the user on page load
export const load = async ({locals})=>{
    if(locals.user){
        return {
            user:locals.user
        }
    }
    return {
        //if there is no user return undefined
        user: undefined
    }
}

export const actions = {
	signup: async ({ locals, request }) => {
        try{
            //get the form data
            const body = Object.fromEntries(await request.formData());
            //user account data 
            const data = {
                "username":body.username,
                "password":body.password,
                "buddy_id": "", //should default to empty
                "buddy_username": "", //should default to empty
                "passwordConfirm": body.password
            };
            //create the the new user record
            const record = await locals.pb.collection('users').create(data);
            //log the new user in
            const authData = await locals.pb.collection('users').authWithPassword(
                body.username,
                body.password,
            );  
        }
        catch(err){
            console.log(err.data.message);    
            return fail(400, {signupError: true});
        }
        //redirect the user to the homepage
        throw redirect(303,"/");
		
	},
    login: async ({ locals, request }) => { 
        try{
            //get the form data
            const body = Object.fromEntries(await request.formData());
            //sign in the user with their credentials 
		    const authData = await locals.pb.collection('users').authWithPassword(
                body.username,
                body.password,
             );
        }
        catch(err){
            console.log(err);
            return fail(400, {loginError: true});
        }
        //redirect the user to the homepage
        throw redirect(303,"/");
	},
    logout: async ({ locals, request }) => {
        //clear the user token
		locals.pb.authStore.clear();
        //reset the user in locals
        locals.user = undefined;
	}
};