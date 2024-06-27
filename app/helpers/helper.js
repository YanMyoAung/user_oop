export class Helper {
    static object_to_array_data(object) {
        return Object.keys(object).map(id => ({
            id,
            ...object[id]
        }));
    }

    static generateUniqueImageName() {
        const timestamp = Date.now().toString();
        const randomString = Math.random().toString(36).substring(2, 10);
        return `${timestamp}-${randomString}`;
    }
}