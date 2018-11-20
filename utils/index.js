exports.usersAndUserID = (userArray) => {

    const result = userArray.reduce((userObj, row, ) => {
        userObj[row.username] = row.user_id
        return userObj;
    }, {})
    return result
}
exports.articleTitleAndArticleID = (userArray) => {

    const result = userArray.reduce((userObj, row, ) => {
        userObj[row.title] = row.article_id
        return userObj;
    }, {})
    return result
}


exports.reformatObject = (originalObject, newUserObj, typeOfObject, articleArray) => {
    const newObjectData = originalObject.map(row => {
        //console.log("<<<", userArray[0][article.created_by])
        if (typeOfObject === "article") {
            row.article_id = articleArray[row.belongs_to];
            delete row.belongs_to;
        }
        row.user_id = newUserObj[row.created_by]
        row.created_at = new Date(row.created_at)
        delete row.created_by;
        return row
    })
    return newObjectData;

}
