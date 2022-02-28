const SalaryService = require('./salary.service');
const Log = require(`../../../logs`);

/** Lấy danh sách các bảng lương */
exports.searchSalaries = async (req, res) => {
    try {
        let data = {};
        if (req.query.page !== undefined && req.query.limit !== undefined) {
            let params = {
                organizationalUnits: req.query.organizationalUnits,
                employeeName: req.query.employeeName,
                employeeNumber: req.query.employeeNumber,
                month: req.query.month,
                page: Number(req.query.page),
                limit: Number(req.query.limit),
            }
            data = await SalaryService.searchSalaries(req.portal, params, req.user.company._id);
        } else {
            data = await SalaryService.getAllSalaryByMonthAndOrganizationalUnits(req.portal, req.query.organizationalUnits, req.query.month);
        }
        await Log.info(req.user.email, 'GET_SARALY', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_salary_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_SARALY', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_salary_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Tạo mới một bảng lương */
exports.createSalary = async (req, res) => {
    try {
        // Kiểm tra thông tin dữ liệu truyền vào
        if (req.body.month.trim() === "") {
            await Log.error(req.user.email, 'CREATE_SARALY', req.portal);
            res.status(400).json({
                success: false,
                messages: ["month_salary_required"],
                content: {
                    inputData: req.body
                }
            });
        } else {
            let createSalary = await SalaryService.createSalary(req.portal, req.body, req.user.company._id);
            if (createSalary === "have_exist") { // Kiểm tra trùng lặp
                await Log.error(req.user.email, 'CREATE_SARALY', req.portal);
                res.status(400).json({
                    success: false,
                    messages: ["month_salary_have_exist"],
                    content: {
                        inputData: req.body
                    }
                });
            } else {
                await Log.info(req.user.email, 'CREATE_SARALY', req.portal);
                res.status(200).json({
                    success: true,
                    messages: ["create_salary_success"],
                    content: createSalary
                });
            }
        }
    } catch (error) {
        console.log('eror', error)
        await Log.error(req.user.email, 'CREATE_SARALY', req.portal);
        res.status(400).json({
            success: false,
            messages: ["create_salary_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Xoá thông tin bảng lương */
exports.deleteSalary = async (req, res) => {
    try {
        let salaryDelete = await SalaryService.deleteSalary(req.portal, req.params.id);
        await Log.info(req.user.email, 'DELETE_SARALY', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_salary_success"],
            content: salaryDelete
        });
    } catch (error) {
        await Log.error(req.user.email, 'DELETE_SARALY', req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_salary_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Chỉnh sửa thông tin bảng lương */
exports.updateSalary = async (req, res) => {
    try {
        let salaryUpdate = await SalaryService.updateSalary(req.portal, req.params.id, req.body);
        await Log.info(req.user.email, 'EDIT_SARALY', req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_salary_success"],
            content: salaryUpdate
        });
    } catch (error) {
        await Log.error(req.user.email, 'EDIT_SARALY', req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_salary_faile"],
            content: {
                error: error
            }
        });
    }
}

/** Import dữ liệu bảng lương */
exports.importSalaries = async (req, res) => {
    try {
        let data = await SalaryService.importSalaries(req.portal, req.body, req.user.company._id);
        if (data.rowError !== undefined) {
            await Log.error(req.user.email, 'IMPORT_SARALY', req.portal);
            res.status(400).json({
                success: false,
                messages: ["import_salary_faile"],
                content: data
            });
        } else {
            await Log.info(req.user.email, 'IMPORT_SARALY', req.portal);
            res.status(200).json({
                success: true,
                messages: ["import_salary_success"],
                content: data
            });
        }
    } catch (error) {
        console.log('error',)
        await Log.error(req.user.email, 'IMPORT_SARALY', req.portal);
        res.status(400).json({
            success: false,
            messages: ["import_salary_faile"],
            content: {
                error: error
            }
        });
    }
}

exports.getSalaryChart = async (req, res) => {

    try {
        let dataSalary

        dataSalary = await SalaryService.salaryChartData(req.portal, req.user.company._id);

        let result = {}
        let dataOfSalary = dataSalary.result
        let dataOfChart = dataOfSalary.chartSalary
        const listypeSalary = dataOfSalary.listType
        //console.log("listypeSalary",listypeSalary)
        // console.log("dataOfChart",dataOfChart)
        let monthTimes = 0;
        if(req.query.time){
            console.log("req.query.time",req.query.time)
            let item1 = JSON.parse(req.query.time)
            let item2 = item1.monthTime
            let timeOfMonth = item2.slice(0,2)
            //console.log("timeOfMonth",timeOfMonth)
            monthTimes = Number(timeOfMonth)
            //console.log("monthTimee",monthTimee)
        } else{
            month = new Date
            monthTimes = month.getMonth() + 1
        }
        console.log("monthTimes",monthTimes)
        
        let countType = {}
        let nameOfUnit = []
        let salaryOfMonth = [], idSalaryTypePurchase = [], idSalaryTypeTestPurchase = [];
        for (let j in listypeSalary) {
            salaryOfMonth[j] = 0;
            nameOfUnit.push(listypeSalary[j].name)
            idSalaryTypePurchase.push(listypeSalary[j]._id)
            idSalaryTypeTestPurchase.push(JSON.stringify(listypeSalary[j]._id))
        }
        //console.log("nameOfUnit",nameOfUnit)
        if (dataOfChart) {

            if (dataOfChart) {
                dataOfChart.forEach(x => {
                    let index = idSalaryTypeTestPurchase.indexOf(JSON.stringify(x.organizationalUnit));
                    //console.log("index",index)

                    if ((new Date(x.month).getMonth() + 1) == monthTimes) {
                        let total = x?.mainSalary ? parseInt(x.mainSalary) : 0;
                        if (x.bonus.length !== 0) {
                            for (let count in x.bonus) {
                                total = total + parseInt(x.bonus[count].number)
                            }
                        };
                        salaryOfMonth[index] += total

                    }


                })
            }
            console.log("salaryOfMonth", salaryOfMonth)

        }
        countType = {
            ...countType,
            salaryType : {
                idSalaryTypeTestPurchase : idSalaryTypeTestPurchase,
                idSalaryTypePurchase : idSalaryTypePurchase,
                salaryOfMonth : salaryOfMonth,
                nameOfUnit : nameOfUnit
            }
        }
        //console.log(countType)
        result = {
            ...result,
            countType : countType
        }
        
        res.status(200).json({
            success: true,
            messages: ["get_chart_salary_success"],
            content: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["get_chart_salary_faile"],
            content: { error: error }
        });
    }
}

formatDate = (date, monthYear = false, yearMonth = false) => {
    if (date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        if (monthYear === true) {
            return [month, year].join('-');
        } else if (yearMonth) {
            return [year, month].join('-');
        } else return [day, month, year].join('-');
    }
    return date;
}