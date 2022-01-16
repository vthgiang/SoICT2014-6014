const SuppliesService = require('./supplies.service');
const Logger = require(`../../../logs`);
const NotificationServices = require(`../../notification/notification.service`);

/**
 * Lấy danh sách vật tư tiêu hao
 */
exports.searchSupplies = async (req, res) => {
    try {
        let data;
        let params = {
            getAll: req.query.getAll,
            code: req.query.code,
            suppliesName: req.query.suppliesName,
            page: Number(req.query.page),
            limit: Number(req.query.limit),
        }
        data = await SuppliesService.searchSupplies(req.portal, params);
        await Logger.info(req.user.email, 'SEARCH_SUPPLIES', req.portal);
        res.status(200).json({
            success: true,
            messages: ["search_supplies_success"],
            content: data
        });
    } catch (error) {
        await Logger.error(req.user.email, 'SEARCH_SUPPLIES', req.portal);
        res.status(400).json({
            success: false,
            messages: ["search_supplies_failed"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Thêm vật tư tiêu hao
 */
exports.createSupplies = async (req, res) => {
    try {
        let data = await SuppliesService.createSupplies(req.portal, req.user.company._id, req.body);
        await Logger.info(req.user.email, 'CREATE_SUPPLIES', req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_supplies_success"],
            content: data
        });
    } catch (error) {
        let messages = error && error.messages === 'supplies_code_exist' ? ['supplies_code_exist'] : ['create_supplies_failed'];

        await Logger.error(req.user.email, 'CREATE_SUPPLIES', req.portal);
        res.status(400).json({
            success: false,
            messages: messages,
            content: error && error.suppliesCodeError
        });
    }
}

/**
 * Cập nhật thông tin vật tư tiêu hao
 */
exports.updateSupplies = async (req, res) => {
    try {
        let data = await SuppliesService.updateSupplies(req.portal, req.user.company._id, req.params.id, req.body);
        await Logger.info(req.user.email, 'UPDATE_SUPPLIES', req.portal);
        res.status(200).json({
            success: true,
            messages: ["update_supplies_success"],
            content: data
        });
    } catch (error) {
        let messages = error && error.messages === 'supplies_code_exist' ? ['supplies_code_exist'] : ['update_supplies_failed'];

        await Logger.error(req.user.email, 'UPDATE_SUPPLIES', req.portal);
        res.status(400).json({
            success: false,
            messages: messages,
            content: error && error.suppliesCodeError
        });
    }
}

/**
 * Xóa danh sách vật tư tiêu hao
 */
exports.deleteSupplies = async (req, res) => {
    try {
        let data = await SuppliesService.deleteSupplies(req.portal, req.body.ids);
        res.status(200).json({
            success: true,
            messages: ["delete_supplies_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["delete_supplies_failed"],
            content: { error: error }
        });
    }
}

/**
 * Lấy thông tin vật tư tiêu hao theo id
 */
exports.getSuppliesById = async (req, res) => {
    try {
        let data;
        data = await SuppliesService.getSuppliesById(req.portal, req.params.id);
        await Logger.info(req.user.email, 'GET_SUPPLIES_BY_ID', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_supplies_by_id_success"],
            content: data
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_SUPPLIES_BY_ID', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_supplies_by_id_failed"],
            content: {
                error: error
            }
        });
    }
}

exports.getDashboardSupplies = async (req, res) => {
    try {
        let suppliesChart;
        suppliesChart = await SuppliesService.getDashboardSupplies(req.portal, req.body);

        let result = {};
        const listSupplies = suppliesChart.listSupplies;
        let listInvoice = suppliesChart.listInvoice;
        let listAllocation = suppliesChart.listAllocation;

        let year = 0;
        let startMonth = 0, endMonth = 0, startYear = 0;
        if (req.query.time) {
            let item1 = JSON.parse(req.query.time)
            let stD = new Date(item1.startTime)
            let endD = new Date(item1.endTime)
            year = endD.getFullYear()
            if (endD.getMonth() + 1 < 10) {
                endMonth = '0' + (endD.getMonth() + 1);
            } else {
                endMonth = endD.getMonth() + 1;
            }
            startYear = stD.getFullYear()
            if (stD.getMonth() + 1 < 10) {
                startMonth = '0' + (stD.getMonth() + 1);
            } else {
                startMonth = stD.getMonth() + 1;
            }
        } else {
            let d = new Date();
            month = d.getMonth() + 1;
            year = d.getFullYear();
            if (month > 3) {
                startMonth = month - 3;
                startYear = year;
            } else {
                startMonth = month - 3 + 12;
                startYear = year - 1;
            }
            if (startMonth < 10)
                startMonth = '0' + startMonth;
            if (month < 10) {
                endMonth = '0' + month;
            } else {
                endMonth = month;
            }
        }

        let purchaseDateAfter = [startYear, startMonth].join('-')
        let purchaseDateBefore = [year, endMonth].join('-')
        let startDate = new Date(purchaseDateAfter);
        let endDate = new Date(purchaseDateBefore);
        let period = Math.round((endDate - startDate) / 2592000000) + 1;
        let listMonth = [], category = [];
        let m = purchaseDateAfter.slice(5, 7);
        let y = purchaseDateAfter.slice(0, 4);
        for (let i = 0; i <= period; i++) {
            if (m > 12) {
                m = 1;
                y++;
            }
            if (m < 10) {
                m = '0' + m;
            }
            category.push([m, y].join('-'));
            listMonth.push([y, m].join(','));
            m++;
        }
        let minDate = new Date(listMonth[0]).getTime();
        let maxDate = new Date(listMonth[listMonth.length - 1]).getTime();
        let countInvoice = [], countAllocation = [], valueInvoice = [];

        if (listInvoice) {
            for (let i = 0; i < listSupplies.length; i++) {
                countInvoice[i] = 0;
                valueInvoice[i] = 0;
                listInvoice.forEach(invoice => {
                    if (invoice.supplies.toString() === listSupplies[i]._id.toString()
                        && new Date(invoice.date).getTime() < maxDate && new Date(invoice.date).getTime() >= minDate) {
                        countInvoice[i] += parseInt(invoice.quantity);
                        valueInvoice[i] += parseInt(invoice.price);
                    }
                });
            }
        }

        if (listAllocation) {
            for (let i = 0; i < listSupplies.length; i++) {
                countAllocation[i] = 0;
                listAllocation.forEach(allocation => {
                    if (allocation.supplies.toString() === listSupplies[i]._id.toString()
                        && new Date(allocation.date).getTime() < maxDate && new Date(allocation.date).getTime() >= minDate) {
                        countAllocation[i] += parseInt(allocation.quantity);
                    }
                });
            }
        }

        let suppliesData = listSupplies.map(supplies => {
            return {
                _id: supplies._id,
                suppliesName: supplies.suppliesName,
                code: supplies.code
            }
        });
        result = { suppliesData, countInvoice, countAllocation, valueInvoice }
        await Logger.info(req.user.email, 'GET_DASHBOARD_SUPPLIES', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_dashboard_supplies_success"],
            content: result
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_DASHBOARD_SUPPLIES', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_dashboard_supplies_success_failed"],
            content: {
                error: error
            }
        });
    }
}