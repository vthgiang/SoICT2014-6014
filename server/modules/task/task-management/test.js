var moment = require('moment'); // require
const lastDay = moment('2016-09', 'YYYY-MM').endOf('month').format('DD-MM-YYYY')
console.log("lastDay",lastDay);

let x = "Tư vấn   ";
let y  = " tư Vấn   ";
let z = "Tu van ";

console.log('x = y ', x.toUpperCase().trim() === y.toUpperCase().trim());
console.log('x = z ', x.toUpperCase().trim() === z.toUpperCase().trim());
console.log('x', x);


let quang = "Quang-Duyen"
let duyen = "Duyen"

console.log('split', quang.split("-"));
console.log('split  y', duyen.split("-"));

let qdz = "2021-02-07 12:30:00";
// let qd1 = new Date(qdz);
let qd1 = new Date ("2021-02-01 08:00 AM");
let qd2 = new Date ("2021-03-31 5:00 PM");
console.log("qd1>qd2",qd1 < qd2);
console.log('qd1',qd1);
console.log('qd2', qd2);
console.log('qd1m', qd1.getHours());

let d = new Date ("2021-02-08T10:00:00.000Z")
let q = moment(qd1).format("hh:mm A");
console.log('quang dz', q);

let o = new Date();
let m= new Date(o);
console.log('Date.now', o, m);

// let splitter = "31-10-2020".split("-");
// let splitter2 = "01-11-2020".split("-");

// let dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);
// let dateOfPrevEval = new Date(splitter2[2], splitter2[1] - 1, splitter2[0]);

// let month2 = dateOfPrevEval.getDate();
// let month = dateOfEval.getDate();

// console.log('month2-1', month2, month);

// console.log('month',splitter[1] === "10", typeof( splitter[2] ), dateOfPrevEval, month);

// let newMonth = dateOfPrevEval.getMonth() - 1;
// console.log('new month', newMonth);
// if (newMonth < 0) {
//     newMonth += 12;
//     dateOfPrevEval.setYear(dateOfPrevEval.getYear() - 1);
// }



// dateOfPrevEval.setDate(15);
// dateOfPrevEval.setMonth(newMonth);
// console.log('date', dateOfPrevEval);

// let monthOfPrevEval = dateOfPrevEval.getMonth();
// let yearOfPrevEval = dateOfPrevEval.getFullYear();

// console.log('M-Y', monthOfPrevEval, yearOfPrevEval);
// console.log('monthOfPre', monthOfPrevEval );

// let x = new Date()
// console.log('x', x);
// let timer = x.getTime() + 24 * 60 * 60 * 1000 * 6;

// let y = new Date(timer).toISOString();
// console.log('y', y);

// let x = {
//     a: 1,
//     b: 2,
//     c: 3
// }
// let y = {
//     a: x.a,
//     b: x.b,
//     c: x.c
// }
// let cop = x;
// cop.a =4; cop.b =5;
// // cop = {}

// x= y
// console.log('cop, x, y', cop, x, y);


// let func = {
//     data: {
//         x: 1,
//         y: 2
//     },
//     add: "x+y-3"
// }
// let data1 = func.data;
// let data2 = func.data;
// data2 = {
//     x: 2,
//     y: 9
// }
// console.log('---------------', func, data2);
// data1.x = 5;

// let f = func.add;

// f = f.replace('x', 1);
// f = f.replace('y', 2);

// console.log('func, f', func, f, data1);


// let splitter = "02-01-1999".split("-");
// let d = new Date(splitter[2], splitter[1] - 1, splitter[0]);
// // var d = new Date('1', '0', '1999');
// console.log('d1',d);
// var newMonth = d.getMonth() - 1;
// if(newMonth < 0){
//     newMonth += 12;
//     d.setYear(d.getYear() - 1);
// }
// d.setMonth(newMonth);

// console.log('d2', d);

// console.log(typeof(undefined));

// let xxx = 0;
// if( xxx === null || xxx === undefined ) {
//     console.log(false); 
// }
// else console.log(true);;

// let a = 2462400000, b = 2505600000, c = 0;
// console.log('---', c/(a/b)); 


// let e = {o: [{x:1, y:2}, {z:3}], v: {p: 2}}
// let r = {o: [{x:1, y:2}, {z:3}], v: {p: 2}}

// console.log('er', JSON.stringify(e) === JSON.stringify(r));

// console.log(2-(3))

// var t = {x : {y:1, x:4}, i:3};
// var yo = Object.assign({}, t);

// yo.x = 9;
// console.log('yo', t);