exports.truncate = (str , len) => {
    if(str.length > len && str.length > 0){
        
        let new_str = str.substr(0 , len);
        
        return new_str + "..."
    }
    return str;
}