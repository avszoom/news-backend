const moment = require('moment');

export function getCurrentDate() {
    const currentDate = moment().format('YYYY-MM-DD');
    return currentDate;
}

export function getPastDate(daysFromNow: number){
    const pastDate = moment().subtract(daysFromNow, 'days').format('YYYY-MM-DD');
    return pastDate;
}  