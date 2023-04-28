
/**
 * @param {Date} date 
 * @returns string
 */
exports.toCentralIsoFormat = function(date){
    return new Date(date.getTime() - (5 * 60 * 60000)).toISOString();
}

exports.addDays = function(date, days){
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}