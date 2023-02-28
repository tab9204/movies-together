import {getNumberOfRecs} from "$lib/server/recs.server.js";
import {getUserSearchOptions} from "$lib/server/options.server.js";

export const load = async ({locals})=>{
  return {
    numberOfRecs: getNumberOfRecs(locals),
    searchOptions: getUserSearchOptions(locals),
    user: locals.user
  }
}