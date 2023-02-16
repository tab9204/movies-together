import PocketBase from 'pocketbase';
import {serializeNonPOJOs} from "$lib/utils.js";
import { redirect } from '@sveltejs/kit';

export const handle = async ({event,resolve,url}) =>{
    //console.log("Running hooks");
    //set the pb instance
    event.locals.pb = new PocketBase('https://www.chilionrap.com');
    //load the auth cookie or set to empty if there isn't one
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
    //if there is no user signed or their token is not valid
    if(!event.locals.pb.authStore.isValid){
        //set the user locals to undefined 
        event.locals.user = undefined;
        //redirect the user to the login page is not already there
        if(!event.url.pathname.startsWith("/login")){
            throw redirect(303,"/login")
        }
    }

    //set the locals user if the auth token is valid
    if(event.locals.pb.authStore.isValid){
        event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model);
    }
    
    //the user needs to also set a buddy before they can begin using the app 
    //redirect them to the buddy page if they do not have one already
    if(event.locals.user !== undefined && event.locals.user.buddy_id == ""){
        if(!event.url.pathname.startsWith("/buddy") && !event.url.pathname.startsWith("/login") ){
            throw redirect(303,"/buddy")
        }
    }
    
    const response = await resolve(event);
    //st the auth cookie
    response.headers.set("set-cookie", event.locals.pb.authStore.exportToCookie({secure:true}));


    return response;
}