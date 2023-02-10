//client side pb instance and real time listeners 
import PocketBase from 'pocketbase';
import { onMount, onDestroy } from 'svelte';
const pb = new PocketBase('https://www.chilionrap.com');

let unsubscribe = void(0);

//collection => string pointing to the db collection we are listening to
//callback => function to run when the collection updates 
export const pbSub = (collection,callback)=>{
    //set up the db listener when the page mounts
    onMount(async () => {
        console.log("mounted sub");
        try{
            //TODO: should auth the user before subscribing
            unsubscribe = await pb.collection(collection).subscribe('*', function (e) {
                callback(e);
            });
        }
        catch(err){
            console.log(err);
        }
      });
      //when the page is destroyed unsub from the listener
      onDestroy(() => {
        try{
            unsubscribe?.();
            console.log("unsubbed");
        }
        catch(err){
            console.log(err);
        }
      });
}