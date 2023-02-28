import {error} from '@sveltejs/kit';

export const POST = async ({request, locals}) =>{
    const options = await request.json();
    try{
        const genres = options.selectedGenres;
        await locals.pb.collection('users').update(locals.user.id, {"search_options":genres});
        return new Response(JSON.stringify("ok"));
    }
    catch(err){
        console.log(err);
        throw new error (400,'Could not send recommendation');
    }
  
  }