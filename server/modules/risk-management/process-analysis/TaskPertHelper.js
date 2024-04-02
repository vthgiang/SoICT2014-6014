// Hàm clone một object
exports.clone = (o) => {
    return JSON.parse(JSON.stringify(o))
}
// Hàm tính độ lệch giữa 2 giá trị ngày
exports.DateDiff = {

    inDays: function (d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return (t2 - t1) / (24 * 3600 * 1000);
    },

    inWeeks: function (d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
    },

    inMonths: function (d1, d2) {
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();

        return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
    },

    inYears: function (d1, d2) {
        return d2.getFullYear() - d1.getFullYear();
    }
}
const maxFrequency = (a, b) => {
    for (let i = 0; i < b.length; i++) {
        if (b[i] == Math.max(...b)) return a[i]
    }
}

exports.countFrequency = (arr) => {
    var a = [], b = [], prev;

    arr.sort();
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== prev) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length - 1]++;
        }
        prev = arr[i];
    }
    let opt, mos, pess;
    pes = Math.max(...a)
    opt = Math.min(...a)
    mos = maxFrequency(a, b)
    return {
        opt: opt,
        mos: mos,
        pes: pes
    };
}
// Hàm kiểm tra mối quan hệ cha con giữa 2 mảng
exports.hasSubArray = (master, sub) => {

    let masterClone = JSON.parse(JSON.stringify(master))
    masterClone.sort((a, b) => a - b)
    let subClone = JSON.parse(JSON.stringify(sub))
    if (subClone.length > 1) {
        subClone.sort((a, b) => a - b)
        return subClone.every((i => v => i = masterClone.indexOf(v, i) + 1)(0))
    } else {
        return masterClone.includes(subClone[0])
    }
}
// Hàm so sánh 2 mảng
exports.compareArr = (a1, a2) => {
    return JSON.stringify(a1) === JSON.stringify(a2);
}
exports.getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
exports.getRandomCpt = (parentLength) =>{
    let cpt = []
    if (parentLength > 1) {
        let len = parentLength + 3
        let temp = []
        for (let j = 0; j < 2 ** len; j++) {
            let tempVal = 0.65
            temp = [...temp, tempVal]
            temp = [...temp, 1-tempVal]
        }
        cpt = temp
    }
    if (parentLength == 0) {
        let len = parentLength + 3
        let temp = [
            0.7,0.3,
            0.65,0.35,
            0.3,0.7,
            0.2,0.8,
            0.4,0.6,
            0.3,0.7,
            0.2,0.8,
            0.4,0.6
        ]
        // for (let j = 0; j < 2 ** len; j++) {
        //     let tempVal = 0.7
        //     temp = [...temp, tempVal]
        //     temp = [...temp, 1-tempVal]
        // }
        cpt = temp
    }
    
    if (parentLength == 1) {
        cpt = [
            0.9, 0.1,
            0.8, 0.2,
            0.9, 0.1,
            0.7, 0.3,
            0.9, 0.1,
            0.9, 0.1,
            0.9, 0.1,
            0.9, 0.1,
        ]
    }
    return cpt
}