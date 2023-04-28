
/**
 * @param {Date} date 
 * @returns string
 */
exports.toCentralIsoFormat = function(date){
    return new Date(date.getTime() - (5 * 60000)).toISOString();
}