const { OrganizationalUnit } = require('../../../models');

const { connect } = require(`../../../helpers/dbHelper`);

const ProfileService = require('../profile/profile.service');
const SalaryService = require('../salary/salary.service');
const AnnualLeaveService = require('../annual-leave/annualLeave.service');
const TimesheetsService = require('../timesheets/timesheets.service');
const FieldService = require('../field/field.service');
const CommendationService = require('../commendation/commendation.service');
const DisciplineService = require('../discipline/discipline.service');

const dayjs = require('dayjs');

exports.getChartData = async (portal, company, defaultParams, searchChart) => {
    let list = await OrganizationalUnit(connect(DB_CONNECTION, portal))
        .find()
        .populate([
            {
                path: 'managers',
                populate: [{
                    path: "users",
                    populate: [{
                        path: "userId",
                        select: "_id name email avatar"
                    }]
                }]
            },
            {
                path: 'deputyManagers',
                populate: [{
                    path: "users",
                    populate: [{
                        path: "userId",
                        select: "_id name email avatar"
                    }]
                }]
            },
            {
                path: 'employees',
                populate: [{
                    path: "users",
                    populate: [{
                        path: "userId",
                        select: "_id name email avatar"
                    }]
                }]
            }
        ]);
    if (defaultParams) {
        let data = await getEmployeeDashboardData(portal, company, JSON.parse(defaultParams), list);
        return data
    } else {
        const { employeeDashboardChart, increaseAndDecreaseChart, annualLeaveTrendChart, trendOfOvertimeChart} = JSON.parse(searchChart);
    
        if (employeeDashboardChart) {
            let data = await getEmployeeDashboardData(portal, company, employeeDashboardChart, list);
            return data
        }
        if (increaseAndDecreaseChart) {
            const { organizationalUnits,startDate, endDate } = increaseAndDecreaseChart;
            const dataHumanResourceIncreaseAndDecrease = await ProfileService.getEmployeesByStartingAndLeaving(portal, organizationalUnits, startDate, endDate, company);
            let humanResourceIncreaseAndDecreaseChartData = getHumanResourceIncreaseAndDecreaseChartData(dataHumanResourceIncreaseAndDecrease);
            return {
                humanResourceIncreaseAndDecreaseChartData: humanResourceIncreaseAndDecreaseChartData
            }
        }

        if (trendOfOvertimeChart) {
            const { organizationalUnits,startDate, endDate } = trendOfOvertimeChart;
            const dataOvertimeUnits = await TimesheetsService.getOvertimeOfUnitsByStartDateAndEndDate(portal, organizationalUnits, startDate, endDate, company);
            let trendOfOvertimeChartData = getTrendOfOvertimeChartData(dataOvertimeUnits);
            return {
                trendOfOvertimeChartData: trendOfOvertimeChartData
            }
        }
        if (annualLeaveTrendChart) {
            const { organizationalUnits, startDate, endDate } = annualLeaveTrendChart;
            const annualLeave = await AnnualLeaveService.getAnnualLeaveByStartDateAndEndDate(portal, organizationalUnits, startDate, endDate, company);
            const dataOvertimeUnits = await TimesheetsService.getOvertimeOfUnitsByStartDateAndEndDate(portal, organizationalUnits, startDate, endDate, company);
            let annualLeaveTrendChartData = getAnnualLeaveTrendChartData(annualLeave, dataOvertimeUnits);
            return {
                annualLeaveTrendChartData: annualLeaveTrendChartData
            }
        }
        return {}
    }
}

const getEmployeeDashboardData = async (portal, company, params, list) => {
    const { month, organizationalUnits, startDate, endDate, startDateIncreaseAndDecreaseChart } = params;
    
    const { listEmployeesOfOrganizationalUnits, totalEmployee } = await ProfileService.getEmployees(portal, company, organizationalUnits);
    const dataHumanResourceIncreaseAndDecrease = await ProfileService.getEmployeesByStartingAndLeaving(portal, organizationalUnits, startDateIncreaseAndDecreaseChart, endDate, company);
    const salaris = await SalaryService.getAllSalaryByMonthAndOrganizationalUnits(portal, organizationalUnits, month);
    const annualLeave = await AnnualLeaveService.getAnnualLeaveByStartDateAndEndDate(portal, organizationalUnits, startDate, endDate, company);
    const beforeAndAfterOneWeeks = await AnnualLeaveService.getAnnaulLeaveBeforAndAfterOneWeek(portal, organizationalUnits);
    const dataOvertimeUnits = await TimesheetsService.getOvertimeOfUnitsByStartDateAndEndDate(portal, organizationalUnits, startDate, endDate, company);
    const listField = await FieldService.getAllFields(portal, {}, company);
    const commendation = await CommendationService.getTotalCommendation(portal, company, organizationalUnits, month);
    const discipline = await DisciplineService.searchDisciplines(portal, company, organizationalUnits, month);
    //get age pyramid chart data
    let agePyramidChartData = getAgePyramidChartData(listEmployeesOfOrganizationalUnits);
    let humanResourceChartBySalaryData = getHumanResourcesChartBySalary(salaris);
    let qualificationChartData = getQualificationChartData(listEmployeesOfOrganizationalUnits, listField);
    let humanResourceIncreaseAndDecreaseChartData = getHumanResourceIncreaseAndDecreaseChartData(dataHumanResourceIncreaseAndDecrease);
    let annualLeaveTrendChartData = getAnnualLeaveTrendChartData(annualLeave, dataOvertimeUnits);
    let annualLeaveChartAndTableData = getAnnualLeaveChartAndTableData(beforeAndAfterOneWeeks, list);
    let trendOfOvertimeChartData = getTrendOfOvertimeChartData(dataOvertimeUnits);
    let salaryOfOrganizationalUnitsChartData = getSalaryOfOrganizationalUnitsChartData(salaris, list);
    let highestSalaryChartData = getHighestSalaryChartData(salaris);
    return {
        agePyramidChartData: agePyramidChartData,
        humanResourceChartBySalaryData: humanResourceChartBySalaryData,
        humanResourceIncreaseAndDecreaseChartData: humanResourceIncreaseAndDecreaseChartData,
        trendOfOvertimeChartData: trendOfOvertimeChartData,
        annualLeaveTrendChartData: annualLeaveTrendChartData,
        salaryOfOrganizationalUnitsChartData: salaryOfOrganizationalUnitsChartData,
        highestSalaryChartData: highestSalaryChartData,
        qualificationChartData: qualificationChartData,
        annualLeaveChartAndTableData: annualLeaveChartAndTableData,
        beforeAndAfterOneWeeks: beforeAndAfterOneWeeks,
        listEmployeesOfOrganizationalUnits: listEmployeesOfOrganizationalUnits,
        dataHumanResourceIncreaseAndDecrease: dataHumanResourceIncreaseAndDecrease,
        commendation: commendation,
        discipline: discipline,
        salaris: salaris,
        dataOvertimeUnits: dataOvertimeUnits
    };
}

const formatDateHasDay = (date, yearMonthDay = false) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (yearMonthDay === true) {
                return [year, month, day].join('-');
            } else return [day, month, year].join('-');
        }
        return date;
    }

const getDays = () => {
    const days = [];
    const dateNow = new Date();
    for (let i = 1; i <= 13; i++) {
        if (i !== 7) {
            days.push(new Date())
        } else {
            days.push(formatDateHasDay(new Date(), true))
        }
    }
    for (let i = 0; i < 6; i++) {
        days[i] = formatDateHasDay(days[i].setDate(dateNow.getDate() - 6 + i), true)
        days[days.length - 1 - i] = formatDateHasDay(days[days.length - 1 - i].setDate(dateNow.getDate() + 6 - i), true)
    }
    return days
}

const getYear = (date) => {
    let dateNow = new Date(Date.now()), birthDate = new Date(date);
    let age = dateNow.getFullYear() - birthDate.getFullYear();
    return age;
}

const isEqualDate = (date1, date2) => {
    const pathDate1 = formatDateHasDay(date1, true)
    const pathDate2 = formatDateHasDay(date2, true)
    if (!pathDate1 || !pathDate2) {
        return false
    };
    if (new Date(pathDate1).getTime() === new Date(pathDate2).getTime()) {
        return true
    }
    return false
}


const getAgePyramidChartData = (listEmployeesOfOrganizationalUnits) => {
    let maleEmployees = listEmployeesOfOrganizationalUnits.filter(x => x.gender === 'male' && x.birthdate);
    let femaleEmployees = listEmployeesOfOrganizationalUnits.filter(x => x.gender === 'female' && x.birthdate);

    let maleEmployeesUndefined = listEmployeesOfOrganizationalUnits.filter(x => x.gender === 'male' && !x.birthdate);
    let femaleEmployeesUndefined = listEmployeesOfOrganizationalUnits.filter(x => x.gender === 'female' && !x.birthdate);

    // Start Định dạng dữ liệu cho biểu đồ tháp tuổi
    let age = 69, i = 0, data1AgePyramid = [], data2AgePyramid = [];
    while (age > 18) {
        let maleData = [], femaleData = [];
        if (age === 19) {
            femaleData = femaleEmployees.filter(x => getYear(x.birthdate) <= age && getYear(x.birthdate) > age - 2);
            maleData = maleEmployees.filter(x => getYear(x.birthdate) <= age && getYear(x.birthdate) > age - 2);
        } else {
            femaleData = femaleEmployees.filter(x => getYear(x.birthdate) <= age && getYear(x.birthdate) > age - 5);
            maleData = maleEmployees.filter(x => getYear(x.birthdate) <= age && getYear(x.birthdate) > age - 5);
        }
        data1AgePyramid[i] = 0 - femaleData.length;
        data2AgePyramid[i] = maleData.length;
        age = age - 5;
        i++;
    }
    data1AgePyramid.unshift('Nữ');
    data2AgePyramid.unshift('Nam');
    // End Định dạng dữ liệu cho biểu đồ tháp tuổi
    data1AgePyramid = [...data1AgePyramid, femaleEmployeesUndefined?.length]
    data2AgePyramid = [...data2AgePyramid, maleEmployeesUndefined?.length]

    let data = {
        nameData1: 'Nữ',
        nameData2: 'Nam',
        ageRanges: ['65-69', '60-64', '55-59', '50-54', '45-49', '40-44', '35-39', '30-34', '25-29', '20-24', '18-19', 'Chưa xác định...'],
        data1: data1AgePyramid,
        data2: data2AgePyramid,
    }
    return {
        data,
        femaleEmployees,
        maleEmployees
    }
}

const getHumanResourcesChartBySalary = (listSalaryByMonthAndOrganizationalUnits) => {
    /**
     * Function chyển dữ liệu thành dữ liệu chart
     * @param {*} dataCovert 
     */
    const convertData = (dataCovert) => {
        if (dataCovert.length !== 0) {
            if (dataCovert[0].unit && dataCovert[0].unit === 'VND') {
                let ratioX = [">100tr", "90tr-100tr", "80tr-90tr", "70tr-80tr", "60tr-70tr", "50tr-60tr", "40tr-50tr", "30tr-40tr", "20tr-30tr", "10tr-20tr", "<10tr"];
                let data1 = ['data1', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                dataCovert.forEach(x => {
                    let check = x.total / 1000000;
                    if (check > 100) {
                        data1[1] = data1[1] + 1;
                    } else if (90 < check && check <= 100) {
                        data1[2] = data1[2] + 1;
                    } else if (80 < check && check <= 90) {
                        data1[3] = data1[3] + 1;
                    } else if (70 < check && check <= 80) {
                        data1[4] = data1[4] + 1;
                    } else if (60 < check && check <= 70) {
                        data1[5] = data1[5] + 1;
                    } else if (50 < check && check <= 60) {
                        data1[6] = data1[6] + 1;
                    } else if (40 < check && check <= 50) {
                        data1[7] = data1[7] + 1;
                    } else if (30 < check && check <= 40) {
                        data1[8] = data1[8] + 1;
                    } else if (20 < check && check <= 30) {
                        data1[9] = data1[9] + 1;
                    } else if (10 < check && check <= 20) {
                        data1[10] = data1[10] + 1;
                    } else {
                        data1[11] = data1[11] + 1;
                    }
                });
                return {
                    ratioX: ratioX,
                    data1: data1,
                    nameData: 'Nhân viên',
                }
            };
            if (dataCovert[0].unit && dataCovert[0].unit === 'USD') {
                let ratioX = [">5000", "4500-5000", "4000-4500", "3500-4000tr", "3000-3500", "2500-3000", "2000-2500", "1500-2000", "1000-1500", "500-1000", "<500"];
                let data1 = ['data1', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                dataCovert.forEach(x => {
                    if (x.total > 5000) {
                        data1[1] = data1[1] + 1;
                    } else if (4500 < x.total && x.total <= 5000) {
                        data1[2] = data1[2] + 1;
                    } else if (4000 < x.total && x.total <= 4500) {
                        data1[3] = data1[3] + 1;
                    } else if (3500 < x.total && x.total <= 4000) {
                        data1[4] = data1[4] + 1;
                    } else if (3000 < x.total && x.total <= 3500) {
                        data1[5] = data1[5] + 1;
                    } else if (2500 < x.total && x.total <= 3000) {
                        data1[6] = data1[6] + 1;
                    } else if (2000 < x.total && x.total <= 2500) {
                        data1[7] = data1[7] + 1;
                    } else if (1500 < x.total && x.total <= 2000) {
                        data1[8] = data1[8] + 1;
                    } else if (1000 < x.total && x.total <= 1500) {
                        data1[9] = data1[9] + 1;
                    } else if (500 < x.total && x.total <= 1000) {
                        data1[10] = data1[10] + 1;
                    } else {
                        data1[11] = data1[11] + 1;
                    }
                });
                return {
                    ratioX: ratioX,
                    data1: data1,
                    nameData: 'Nhân viên',
                }
            }
        };
        return {
            ratioX: [">100tr", "90tr-100tr", "80tr-90tr", "70tr-80tr", "60tr-70tr", "50tr-60tr", "40tr-50tr", "30tr-40tr", "20tr-30tr", "10tr-20tr", "<10tr"],
            data1: ['data1', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            nameData: 'Nhân viên',
        }
    }
    let data = JSON.parse(JSON.stringify(listSalaryByMonthAndOrganizationalUnits));

    if (data.length !== 0) {
        data = data.map(x => {
            let total = x?.mainSalary ? parseInt(x.mainSalary) : 0;
            if (x.bonus.length !== 0) {
                for (let count in x.bonus) {
                    total = total + parseInt(x.bonus[count].number)
                }
            };
            return { ...x, total: total }
        })
    }

    let result = [];
    data.forEach(x => {
        let check;
        result.forEach(y => {
            if (y._id === x._id) {
                y.total = y.total + x.total;
                check = y;
            }
        })
        if (check) {
            result = [...result, check];
        } else {
            result = [...result, x]
        }
    });
    return convertData(result)
}

const getHumanResourceIncreaseAndDecreaseChartData = (dataHumanResourceIncreaseAndDecrease) => {
    if (dataHumanResourceIncreaseAndDecrease.arrMonth.length > 0) {
        let ratioX = ["x", ...dataHumanResourceIncreaseAndDecrease.arrMonth];
        let listEmployeesHaveStartingDateOfNumberMonth = dataHumanResourceIncreaseAndDecrease?.listEmployeesHaveStartingDateOfNumberMonth;
        let listEmployeesHaveLeavingDateOfNumberMonth = dataHumanResourceIncreaseAndDecrease?.listEmployeesHaveLeavingDateOfNumberMonth;
        let data1 = ['data1'], data2 = ['data2'], data3 = ["data3", ...dataHumanResourceIncreaseAndDecrease?.totalEmployees];
        dataHumanResourceIncreaseAndDecrease.arrMonth.forEach(x => {
            let date = new Date(x);
            let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
            let total1 = 0, total2 = 0;
            listEmployeesHaveStartingDateOfNumberMonth.forEach(y => {
                if (y.startingDate && firstDay.getTime() < new Date(y.startingDate).getTime() && new Date(y.startingDate).getTime() <= lastDay.getTime()) {
                    total1 += 1;
                }
            })
            listEmployeesHaveLeavingDateOfNumberMonth.forEach(y => {
                if (y.leavingDate && firstDay.getTime() < new Date(y.leavingDate).getTime() && new Date(y.leavingDate).getTime() <= lastDay.getTime()) {
                    total2 += 1;
                }
            })
            data1 = [...data1, total1];
            data2 = [...data2, total2];
        })
        return { ratioX, data1, data2, data3 }
    } else {
        return {}
    }
}

const getAnnualLeaveTrendChartData = (annualLeave, timesheets) => {
    if (annualLeave?.arrMonth?.length > 0) {
        let arrMonth = annualLeave?.arrMonth
        arrMonth = arrMonth.reverse();

        let ratioX1 = [], ratioX2 = [];
        // Xử lý dữ liệu lấy số lượt nghỉ phép.
        let listAnnualLeaveOfNumberMonth = JSON.parse(JSON.stringify(annualLeave.listAnnualLeaveOfNumberMonth));
        let data1 = ['data1']
        arrMonth.forEach(x => {
            ratioX1 = [...ratioX1, dayjs(x).format("MM-YYYY")];
            let total = 0;
            let date = new Date(x);
            let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
            listAnnualLeaveOfNumberMonth.forEach(y => {
                if (firstDay.getTime() < new Date(y.startDate).getTime() && new Date(y.startDate).getTime() <= lastDay.getTime()) {
                    total += 1;
                }
            })
            data1 = [...data1, total]
        })
        // Xử lý dữ liệu lấy số giờ nghỉ phép
        let listHoursOffOfUnitsByStartDateAndEndDate = JSON.parse(JSON.stringify(timesheets.listOvertimeOfUnitsByStartDateAndEndDate));

        let data2 = ['data2'];
        arrMonth.forEach(x => {
            ratioX2 = [...ratioX2, dayjs(x).format("MM-YYYY")]
            let hoursOff = 0;
            listHoursOffOfUnitsByStartDateAndEndDate.forEach(y => {
                if (dayjs(y.month).format("MM-YYYY") === dayjs(x).format("MM-YYYY")) {
                    let totalHoursOff = y.totalHoursOff ? y.totalHoursOff : 0;
                    hoursOff = hoursOff + totalHoursOff
                };
            })
            data2 = [...data2, hoursOff]
        })
        return {
            data1: { ratioX: ratioX1, data: data1 },
            data2: { ratioX: ratioX2, data: data2 },
            arrMonth
        }
    }
}

const getAnnualLeaveChartAndTableData = (beforAndAfterOneWeeksData, list) => {
    const beforAndAfterOneWeeks = JSON.parse(JSON.stringify(beforAndAfterOneWeeksData));
    
    const arrdays = getDays();
    let data1 = arrdays.map(x => 0), data2 = arrdays.map(x => 0);
    if (beforAndAfterOneWeeks.length) {
        data1 = arrdays.map(x => {
            let count = 0;
            beforAndAfterOneWeeks.forEach(y => {
                if (isEqualDate(y.startDate, x) || isEqualDate(y.endDate, x)) {
                    count++
                }
            })
            return count
        })

        data2 = arrdays.map(x => {
            let count = 0;
            beforAndAfterOneWeeks.forEach(y => {
                if ((isEqualDate(y.startDate, x) || isEqualDate(y.endDate, x)) && y.status === "approved") {
                    count++
                }
            })
            return count
        })
    }
    
    return { ratioX: arrdays, nameData1: "Số đơn xin nghỉ", data1: data1, nameData2: "Số đơn được duyệt", data2: data2 }
}

const getTrendOfOvertimeChartData = (timesheets) => {
    if (timesheets?.arrMonth?.length > 0) {
        let ratioX = ['x', ...timesheets.arrMonth];
        let listOvertimeOfUnitsByStartDateAndEndDate = timesheets.listOvertimeOfUnitsByStartDateAndEndDate;
        let data1 = ['data1'];
        timesheets.arrMonth.forEach(x => {
            let overtime = 0;
            listOvertimeOfUnitsByStartDateAndEndDate.forEach(y => {
                if (dayjs(y.month).format("MM-YYYY") === dayjs(x).format("MM-YYYY")) {
                    let totalOvertime = y.totalOvertime ? y.totalOvertime : 0;
                    overtime = overtime + totalOvertime
                };
            })
            data1 = [...data1, overtime]
        })
        return {
            ratioX, data1
        }
    }
}


const getSalaryOfOrganizationalUnitsChartData = (salary, list) => {
    let data = JSON.parse(JSON.stringify(salary));
    let dataWithUnit = [], dataWithoutUnit = [];

    if (data.length !== 0) {
        dataWithUnit = data.map(x => {
            let total = x?.mainSalary ? parseInt(x.mainSalary) : 0;
            if (x.bonus.length !== 0) {
                for (let count in x.bonus) {
                    total = total + parseInt(x.bonus[count].number);
                }
            };
            return { ...x, total:  total / 1000000000  }
        })
        dataWithoutUnit = data.map(x => {
            let total = x?.mainSalary ? parseInt(x.mainSalary) : 0;
            if (x.bonus.length !== 0) {
                for (let count in x.bonus) {
                    total = total + parseInt(x.bonus[count].number);
                }
            };
            return { ...x, total: total / 1000000 };
        })
    };
    let organizationalUnitsName1 = JSON.parse(JSON.stringify(list)).map(x => ({ _id: x._id, name: x.name, salary: 0 }));
    let organizationalUnitsName2 = JSON.parse(JSON.stringify(list)).map(x => ({ _id: x._id, name: x.name, salary: 0 }));

    let organizationalUnitsName11 = organizationalUnitsName1.map(x => {
        dataWithUnit.forEach(y => {
            if (x._id.toString() === y.organizationalUnit.toString()) {
                x.salary = x.salary + y.total
            }
        })
        return x;
    })
    let organizationalUnitsName22 = organizationalUnitsName2.map(x => {
        dataWithoutUnit.forEach(y => {
            if (x._id === y.organizationalUnit) {
                x.salary = x.salary + y.total
            }
        })
        return x;
    })

    let ratioX = organizationalUnitsName1.map(x => x.name);
    let data1 = organizationalUnitsName11.map(x => x.salary);
    let data2 = organizationalUnitsName22.map(x => x.salary);

    let dataChart1 = {
        nameData: 'Thu nhập',
        ratioX: ratioX,
        data1: ['data1', ...data1],
    }
    let dataChart2 = {
        nameData: 'Thu nhập',
        ratioX: ratioX,
        data1: ['data2', ...data2]
    }
    return {
        dataChart1,
        dataChart2,
    }
} 

const getHighestSalaryChartData = (listSalaryByMonthAndOrganizationalUnits) => {
    let data = JSON.parse(JSON.stringify(listSalaryByMonthAndOrganizationalUnits));
    
    if (data.length !== 0) {
        data = data.map(x => {
            let total = x?.mainSalary ? parseInt(x.mainSalary) : 0;
            if (x.bonus.length !== 0) {
                for (let count in x.bonus) {
                    total = total + parseInt(x.bonus[count].number)
                }
            };
            return { ...x, total: total }
        })
    };

    let dataSalary = [];
    data.forEach(x => {
        const index = dataSalary.findIndex(y => y.employee._id === x.employee._id)
        if (index >= 0) {
            dataSalary[index].total = dataSalary[index].total + x.total
        } else {
            dataSalary = [...dataSalary, x]
        }
    });

    dataSalary = dataSalary.sort((a, b) => b.total - a.total);
    return dataSalary;
}

const getQualificationChartData = (listEmployeesOfOrganizationalUnits, listFieldsParams) => {

    let listFields = JSON.parse(JSON.stringify(listFieldsParams)).listField;
    /**
     * Function chyển dữ liệu thành dữ liệu chart
     * @param {*} data: Dữ liệu truyền vào 
     * intermediate_degree - Trung cấp, colleges - Cao đẳng, university-Đại học, master_degree - Thạc sỹ, phd- Tiến sỹ, unavailable - Không có 
     */
    const convertData = (data, typeChart) => {
        let intermediate_degree = 0, colleges = 0, university = 0, master_degree = 0, phd = 0, unavailable = 0, bachelor = 0, engineer = 0;

        if (typeChart) {
            let degrees = [];
            data.forEach(x => {
                degrees = degrees.concat(x.degrees)
            });

            listFields = listFields.map(x => {
                let total = degrees.filter(y => y.field && y.field.toString() === x._id.toString())
                return [x.name, total.length]
            })
            return listFields
        } else {
            data.forEach(x => {
                switch (x.professionalSkill) {
                    case 'intermediate_degree':
                        intermediate_degree = intermediate_degree + 1;
                        break;
                    case 'colleges':
                        colleges = colleges + 1;
                        break;
                    case 'university':
                        university = university + 1;
                        break;
                    case 'bachelor':
                        bachelor = bachelor + 1;
                        break;
                    case 'engineer':
                        engineer = engineer + 1;
                        break;
                    case 'master_degree':
                        master_degree = master_degree + 1;
                        break;
                    case 'phd':
                        phd = phd + 1;
                        break;
                    default:
                        unavailable = unavailable + 1;
                }
            });
            return [
                ['translate(`human_resource.profile.intermediate_degree`)', intermediate_degree],
                ['translate(`human_resource.profile.colleges`)', colleges],
                ['translate(`human_resource.profile.university`)', university],
                ['translate(`human_resource.profile.bachelor`)', bachelor],
                ['translate(`human_resource.profile.engineer`)', engineer],
                ['translate(`human_resource.profile.master_degree`)', master_degree],
                ['translate(`human_resource.profile.phd`)', phd],
                ['translate(`human_resource.profile.unavailable`)', unavailable]
            ]
        }
    };
    let data1 = convertData(listEmployeesOfOrganizationalUnits, false);
    let data2 = convertData(listEmployeesOfOrganizationalUnits, true);
    return {
        listFields: data2
    }
}