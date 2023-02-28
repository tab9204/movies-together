export const getUserSearchOptions = async (locals)=>{
    try{
        const user = await locals.pb.collection('users').getOne(locals.user.id, {expand: 'relField1,relField2.subRelField'});
        let options;
        if(user.search_options == null){
            options = [];
        }
        else{
            options = user.search_options
        }
        return options;
    }
    catch(err){
        console.log(err);
    }
}