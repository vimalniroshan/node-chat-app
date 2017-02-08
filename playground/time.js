var moment = require('moment');


var date = moment(new Date().getTime());

var someTimestamp = moment().valueOf();

console.log(someTimestamp);

date.add(100, 'year').subtract(1, 'month');

console.log(date.format('MMM Do YYYY h:mm:ss a'));

console.log(date.format('h:mm a'));
