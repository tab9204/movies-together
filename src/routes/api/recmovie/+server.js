import {error} from '@sveltejs/kit';

export const POST = async ({request, locals}) =>{
    const movie = await request.json();
    try{
        //fetch additional details about the recommended movie 
        const detailsResp = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.TMDB_API_KEY}`);
        const details = await detailsResp.json();
        //loop through all the listed genres and get their plain text names 
        let genres = [];
        details.genres.forEach(genre => {
            genres.push(genre.name);
        });
        //get the year from the release date 
        const year = new Date(details.release_date).getFullYear();
        //build out the movie data object with the details of the movie
        let data = {
            "to": locals.user.buddy_id,
            "from": locals.user.id,
            "list": movie.list,
            "movie": {
                image: details.backdrop_path,
                genres: genres,
                title: details.title,
                overview: details.overview,
                runtime: details.runtime,
                release_date: year
            },
        }; 

        const record = await locals.pb.collection('recommended_movies').create(data);
        return new Response(JSON.stringify(data));
    }
    catch(err){
        console.log(err);
        throw new error (400,'Could not send recommendation');
    }
  
  }