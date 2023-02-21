import {fail} from '@sveltejs/kit';
import {redirect} from '@sveltejs/kit';
import {getNumberOfRecs} from "$lib/server/recs.server.js"


export const load = async({locals})=>{
    const getAllUsers = async ()=>{
        const allUsers = await locals.pb.collection('users').getFullList(200, {
            sort: '-username',
        });
        let usersData = [];
        allUsers.forEach((user)=>{
            usersData.push({username: user.username, id: user.id})
        })
        return usersData;
    }
    return {
        user: locals.user,
        allUsers: getAllUsers(),
        numberOfRecs: getNumberOfRecs(locals)
    }

}