//client side pb instance and real time listeners 
import PocketBase from 'pocketbase';
import { onMount, onDestroy } from 'svelte';
const pb = new PocketBase('https://www.chilionrap.com');

let unsubscribe = void(0);

//pocketbase real time listeners so that we can keep user data on the page up to date in real time 
//collection => db collection we are listening to
//callback => run when the collection updates 
export const pbSub = (collection,callback)=>{
    onMount(async () => {
       // console.log("mounted sub");
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
            //console.log("unsubbed");
        }
        catch(err){
            console.log(err);
        }
      });
}