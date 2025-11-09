export const updateObjectInArray = (items: any, itemId: any, objPropName: any, newObjProps: any) => {
    
    return items.map( (users: any) => {
        if(users[objPropName] === itemId){
            return {...users, ...newObjProps}
        }
        return users
    })
}