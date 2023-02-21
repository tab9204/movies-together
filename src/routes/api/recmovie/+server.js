import {error} from '@sveltejs/kit';

export const POST = async ({request, locals}) =>{
    const movie = await request.json();
    try{
        //fetch additional details about the recommended movie 
        const detailsResp = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.TMDB_API_KEY}`);
        const movieDetails = await detailsResp.json();
        //the returned genre data contains way more then just the name of the genre 
        //since we just need the plain text name extract it from all the returned data
        let genres = [];
        movieDetails.genres.forEach(genre => {
            genres.push(genre.name);
        });
        //the release date is returned in an undesired format so reformat it 
        const year = new Date(movieDetails.release_date).getFullYear();
        const movieData = {
            "to": locals.user.buddy_id,
            "from": locals.user.id,
            "list": movie.list,
            "movie": {
                image: movieDetails.backdrop_path,
                genres: genres,
                title: movieDetails.title,
                overview: movieDetails.overview,
                runtime: movieDetails.runtime,
                release_date: year
            },
        }; 

        await locals.pb.collection('recommended_movies').create(movieData);
        //It doesn't matter what we respond with, we just send any response on success so the client can update the UI 
        return new Response(JSON.stringify("ok"));
    }
    catch(err){
        console.log(err);
        throw new error (400,'Could not send recommendation');
    }
  
  }