//used to pass non plain old js objects to the client 
export const serializeNonPOJOs = (obj)=>{
    return structuredClone(obj);
}

export const getRandomNumber = (min,max)=>{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}