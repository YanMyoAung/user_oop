export class Helper{
    static object_to_array_data(object){
        return Object.keys(object).map(id => ({
            id,
           ...object[id]
       }));
    }
}