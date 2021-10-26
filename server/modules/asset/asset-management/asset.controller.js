const AssetService = require('./asset.service');
const Logger = require(`../../../logs`);
const NotificationServices = require(`../../notification/notification.service`);
const { sendEmail } = require(`../../../helpers/emailHelper`);

/**
 * Lấy danh sách tài sản
 */
exports.searchAssetProfiles = async (req, res) => {
    try {
        let data;
        if (req.query.type === "get-building-as-tree") {
            data = await AssetService.getListBuildingAsTree(req.portal, req.user.company._id);
        } else {
            let params = {
                code: req.query.code,
                assetName: req.query.assetName,
                status: req.query.status,
                group: req.query.group,
                typeRegisterForUse: req.query.typeRegisterForUse,
                assetType: req.query.assetType,
                purchaseDate: req.query.purchaseDate,
                disposalDate: req.query.disposalDate,
                handoverUnit: req.query.handoverUnit,
                handoverUser: req.query.handoverUser,
                page: Number(req.query.page),
                limit: Number(req.query.limit),
                managedBy: req.query.managedBy,
                location: req.query.location,
                currentRole: req.query.currentRole,

                startDepreciation: req.query.startDepreciation,
                depreciationType: req.query.depreciationType,

                maintainanceCode: req.query.maintainanceCode,
                maintainCreateDate: req.query.maintainCreateDate,
                maintainStatus: req.query.maintainStatus,
                maintainType: req.query.maintainType,

                incidentCode: req.query.incidentCode,
                incidentStatus: req.query.incidentStatus,
                incidentType: req.query.incidentType,
                incidentDate: req.query.incidentDate,
                getType: req.query.getType
            }

            data = await AssetService.searchAssetProfiles(req.portal, req.user.company._id, params);

        }

        await Logger.info(req.user.email, 'GET_ASSETS', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_list_asset_success"],
            content: data
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_ASSETS', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_list_asset_false"],
            content: {
                error: error
            }
        });
    }
}


/**
 * Thêm mới thông tin tài sản
 */
exports.createAsset = async (req, res) => {
    try {
        let avatar = "";
        if (req.files && req.files.fileAvatar) {
            avatar = `/${req.files.fileAvatar[0].path}`;
        }
        let file = req.files && req.files.file;
        let fileInfo = { file, avatar };

        let data = await AssetService.createAsset(req.portal, req.user.company._id, req.body, fileInfo);
        await Logger.info(req.user.email, 'CREATE_ASSET', req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_asset_success"],
            content: data
        });
    } catch (error) {
        console.log('error', error);
        let messages = error && error.messages === 'asset_code_exist' ? ['asset_code_exist'] : ['create_asset_faile'];

        await Logger.error(req.user.email, 'CREATE_ASSET', req.portal);
        res.status(400).json({
            success: false,
            messages: messages,
            content: error && error.assetCodeError
        });
    }
}

/** Cập nhật thông tin tài sản từ file */
updateAssetInformationFromFile = async (req, res) => {
    try {
        let data = await AssetService.updateAssetInformationFromFile(req.portal, req.user.company._id, req.body);

        // Gửi mail cho người quản lý tài sản
        // if (data.email) {
        //     var email = data.email;
        //     var html = data.html;
        //     var noti = {
        //         organizationalUnits: [],
        //         title: "Cập nhật thông tin sự cố tài sản",
        //         level: "general",
        //         content: html,
        //         sender: data.user.name,
        //         users: [data.manager]
        //     };
        //     await NotificationServices.createNotification(req.portal, req.user.company._id, noti);
        //     await sendEmail(email, "Bạn có thông báo mới", '', html);
        // }

        await Logger.info(req.user.email, 'EDIT_ASSET', req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_asset_success"],
            content: data
        });
    } catch (error) {
        await Logger.error(req.user.email, 'EDIT_ASSET', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_asset_faile'],
            content: { error }
        });
    }
}

/**
 * Cập nhật thông tin tài sản
 */
exports.updateAssetInformation = async (req, res) => {
    if (req.query.isImport) {
        updateAssetInformationFromFile(req, res);
    } else {
        try {
            let avatar = "";
            if (req.files && req.files.fileAvatar) {
                avatar = req.files && `/${req.files.fileAvatar[0].path}`;
            }
            let file = req.files && req.files.file;
            let fileInfo = { file, avatar };

            let data = await AssetService.updateAssetInformation(req.portal, req.user.company._id, req.user._id, req.params.id, req.body, fileInfo);

            // Gửi mail cho người quản lý tài sản
            if (data.email) {
                var email = data.email;
                var html = data.html;
                var noti = {
                    organizationalUnits: [],
                    title: "Cập nhật thông tin sự cố tài sản",
                    level: "general",
                    content: html,
                    sender: data.user.name,
                    users: data.manager,
                    associatedDataObject: {
                        dataType: 2,
                        description: data.shortContent
                    }
                };
                await NotificationServices.createNotification(req.portal, req.user.company._id, noti);
                await sendEmail(email, "Bạn có thông báo mới", '', html);
            }

            await Logger.info(req.user.email, 'EDIT_ASSET', req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_asset_success"],
                content: data
            });
        } catch (error) {
            await Logger.error(req.user.email, 'EDIT_ASSET', req.portal);
            res.status(400).json({
                success: false,
                messages: Array.isArray(error) ? error : ['create_asset_faile'],
                content: { error }
            });
        }
    }
}


/**
 * Xoá thông tin tài sản
 */


exports.deleteAsset = async (req, res) => {
    try {
        let data = await AssetService.deleteAsset(req.portal, req.body.assetIds);
        res.status(200).json({
            success: true,
            messages: ["delete_asset_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["delete_asset_false"],
            content: { error: error }
        });
    }
}


/**
 * Chỉnh sửa thông tin khấu hao tài sản
 */
exports.updateDepreciation = async (req, res) => {
    try {
        let data = await AssetService.updateDepreciation(req.portal, req.params.id, req.body);
        res.status(200).json({
            success: true,
            messages: ["edit_depreciation_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["edit_depreciation_false"],
            content: { error: error }
        });
    }
}

/**
 * Thêm mới thông tin bảo trì cho sự cố
 */
exports.createMaintainanceForIncident = async (req, res) => {
    try {
        let data = await AssetService.createMaintainanceForIncident(req.portal, req.params.id, req.body);
        res.status(200).json({
            success: true,
            messages: ["create_maintainance_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["create_maintainance_false"],
            content: { error: error }
        });
    }
}


//*****************Thông tin sử dụng******************/
/**
 * Thêm mới thông tin sử dụng tài sản
 */
exports.createUsage = async (req, res) => {
    try {
        let data = await AssetService.createUsage(req.portal, req.params.id, req.body);
        res.status(200).json({
            success: true,
            messages: ["create_usage_success"],
            content: data
        });
    } catch (error) {
        console.log('error', error);
        res.status(400).json({
            success: false,
            messages: ["create_usage_false"],
            content: { error: error }
        });
    }
}


/**
 * Chỉnh sửa thông tin sử dụng tài sản
 */
exports.updateUsage = async (req, res) => {
    if (req.query.recallAsset) {
        recallAsset(req, res)
    } else {
        try {
            let data = await AssetService.updateUsage(req.portal, req.params.id, req.body);
            res.status(200).json({
                success: true,
                messages: ["edit_usage_success"],
                content: data
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                messages: ["edit_usage_false"],
                content: { error: error }
            });
        }
    }
}

recallAsset = async (req, res) => {
    try {
        let data = await AssetService.recallAsset(req.portal, req.params.id, req.body);
        res.status(200).json({
            success: true,
            messages: ["recall_asset_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["recall_asset_false"],
            content: { error: error }
        });
    }
}
/**
 * Xóa thông tin sử dụng tài sản
 */
exports.deleteUsage = async (req, res) => {
    try {
        let data = await AssetService.deleteUsage(req.portal, req.params.id, req.body.usageId);
        res.status(200).json({
            success: true,
            messages: ["delete_usage_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["delete_usage_false"],
            content: { error: error }
        });
    }
}



//*****************Thông tin bảo trì**************/

/**
 * Lấy danh sách thông tin bảo trì tài sản
 */
exports.getMaintainances = async (req, res) => {
    try {
        let data = await AssetService.getMaintainances(req.portal, req.query);
        res.status(200).json({
            success: true,
            messages: ["get_maintainance_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["get_maintainance_false"],
            content: { error: error }
        });
    }
}

/**
 * Thêm mới thông tin bảo trì tài sản
 */
exports.createMaintainance = async (req, res) => {
    try {
        let data = await AssetService.createMaintainance(req.portal, req.params.id, req.body, req.query.incident_id);
        res.status(200).json({
            success: true,
            messages: ["create_maintainance_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["create_maintainance_false"],
            content: { error: error }
        });
    }
}

/**
 * Chỉnh sửa thông tin bảo trì tài sản
 */
exports.updateMaintainance = async (req, res) => {
    try {
        let data = await AssetService.updateMaintainance(req.portal, req.params.id, req.body);
        res.status(200).json({
            success: true,
            messages: ["edit_maintainance_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["edit_maintainance_false"],
            content: { error: error }
        });
    }
};

/**
 * Xóa thông tin bảo trì tài sản
 */
exports.deleteMaintainance = async (req, res) => {
    try {
        let data = await AssetService.deleteMaintainance(req.portal, req.params.id, req.body.maintainanceId);
        res.status(200).json({
            success: true,
            messages: ["delete_maintainance_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["delete_maintainance_false"],
            content: { error: error }
        });
    }
};


//*****************Thông tin sự cố**************/

exports.getIncidents = async (req, res) => {
    try {
        let query = {
            ...req.query,
            userId: req.user._id
        }
        let data = await AssetService.getIncidents(req.portal, query);

        res.status(200).json({
            success: true,
            messages: ["get_incidents_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["get_incidents_false"],
            content: { error: error }
        });
    }
}

/**
 * Thêm mới thông tin sự cố tài sản
 */
exports.createIncident = async (req, res) => {
    try {
        let data = await AssetService.createIncident(req.portal, req.params.id, req.body);
        res.status(200).json({
            success: true,
            messages: ["create_incident_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({ success: false, messages: ["create_incident_false"], content: { error: error } });
    }
}

/**
 * Chỉnh sửa thông tin sự cố tài sản
 */
exports.updateIncident = async (req, res) => {
    try {
        let data = await AssetService.updateIncident(req.portal, req.params.id, req.body);
        res.status(200).json({
            success: true,
            messages: ["edit_incident_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["edit_incident_false"],
            content: { error: error }
        });
    }
}

/**
 * Xóa thông tin sự cố tài sản
 */

exports.deleteIncident = async (req, res) => {
    try {
        let data = await AssetService.deleteIncident(req.portal, req.body.incidentIds);
        res.status(200).json({
            success: true,
            messages: ["delete_incident_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["delete_incident_false"],
            content: { error: error }
        });
    }
}


exports.getAssetGroupChart = async (req, res) => {

    try {
        let Assetchart = await AssetService.chartAssetGroupData(req.portal, req.user.company._id);
        let chartAssetChart = Assetchart.result
        let result = {}
        let numberOfAsset, numberOfBuilding = 0, numberOfVehicle = 0, numberOfMachine = 0, numberOfOther = 0;
        let assetChart = chartAssetChart.chartAssets
        if (chartAssetChart) {
            chartAssetChart.chartAssets.map(asset => {
                switch (asset.group) {
                    case "building":
                        numberOfBuilding++;
                        break;
                    case "vehicle":
                        numberOfVehicle++;
                        break;
                    case "machine":
                        numberOfMachine++;
                        break;
                    case "other":
                        numberOfOther++;
                        break;
                }
            });
        }

        numberOfAsset = [
            ['asset.dashboard.building', numberOfBuilding],
            ['asset.asset_info.vehicle', numberOfVehicle],
            ['asset.dashboard.machine', numberOfMachine],
            ['asset.dashboard.other', numberOfOther],
        ];

        result = {

            ...result,
            numberAsset: numberOfAsset
        }
        let valueOfAsset, valueOfBuilding = 0, valueOfVehicle = 0, valueOfMachine = 0, valueOfOther = 0;

        if (chartAssetChart) {
            chartAssetChart.chartAssets.map(asset => {
                switch (asset.group) {
                    case "building":
                        valueOfBuilding += asset.cost;
                        break;
                    case "vehicle":
                        valueOfVehicle += asset.cost;
                        break;
                    case "machine":
                        valueOfMachine += asset.cost;
                        break;
                    case "other":
                        valueOfOther += asset.cost;
                        break;
                }
            });
        }

        valueOfAsset = [
            ['asset.dashboard.building', valueOfBuilding],
            ['asset.asset_info.vehicle', valueOfVehicle],
            ['asset.dashboard.machine', valueOfMachine],
            ['asset.dashboard.other', valueOfOther],
        ];

        result = {
            ...result,
            valueAsset: valueOfAsset
        }

        let depreciationAsset, depreciationExpenseOfBuilding = 0, depreciationExpenseOfVehicle = 0, depreciationExpenseOfMachine = 0, depreciationExpenseOfOther = 0;
        let depreciationOfAsset = [];
        if (chartAssetChart) {
            assetChart.map(asset => {
                depreciationOfAsset.push({
                    names: asset.assetName,
                    types: asset.assetType,
                    groups: asset.group,
                    depreciationExpense: calculateDepreciation(asset.depreciationType, asset.cost, asset.usefulLife, asset.estimatedTotalProduction, asset.unitsProducedDuringTheYears, asset.startDepreciation)
                })

            })

        }

        if (depreciationOfAsset.length) {
            depreciationOfAsset.map(asset => {
                switch (asset.groups) {
                    case "building":
                        depreciationExpenseOfBuilding += asset.depreciationExpense;
                        break;
                    case "vehicle":
                        depreciationExpenseOfVehicle += asset.depreciationExpense;
                        break;
                    case "machine":
                        depreciationExpenseOfMachine += asset.depreciationExpense;
                        break;
                    case "other":
                        depreciationExpenseOfOther += asset.depreciationExpense;
                        break;
                }
            });
        }

        depreciationAsset = [
            ['asset.dashboard.building', depreciationExpenseOfBuilding > 0 ? depreciationExpenseOfBuilding : 0],
            ['asset.asset_info.vehicle', depreciationExpenseOfVehicle],
            ['asset.dashboard.machine', depreciationExpenseOfMachine],
            ['asset.dashboard.other', depreciationExpenseOfOther],
        ];

        result = {
            ...result,
            depreciationAssets: depreciationAsset
        }

        //chia theo status


        // chia theo thể loại 
        let typeName = [], shortName = [], countAssetType = [], countAssetValue = [], countDepreciation = [], idAssetType = [], idAssetTypeTest = [];
        const listAssetTypes = chartAssetChart.listType;
        let listAssetTypeSort = [];

        /* for (let i in listAssetTypes){
            console.log("typeName",listAssetTypes[i].typeName)
        } */




        for (let i in listAssetTypes) {
            let count = { ...listAssetTypes[i], countAsset: 0 };
            for (let j in chartAssetChart.chartAssets) {
                if (chartAssetChart.chartAssets[j].assetType.some(item => JSON.stringify(listAssetTypes[i]._id) === JSON.stringify(item._id))) {
                    count = { ...count, countAsset: count.countAsset + 1 }

                }
            }
            listAssetTypeSort = [
                ...listAssetTypeSort,
                count,
            ];
        }

        listAssetTypeSort = listAssetTypeSort.sort((a, b) => (a.countAsset < b.countAsset) ? 1 : ((b.countAsset < a.countAsset) ? -1 : 0))
        listAssetTypeSortShow = listAssetTypeSort.map((value, index) => {
            return (value._doc)
        })
        for (let i in listAssetTypeSortShow) {
            countAssetType[i] = 0;
            countAssetValue[i] = 0;
            countDepreciation[i] = 0;
            idAssetType.push(listAssetTypeSortShow[i]._id)
            idAssetTypeTest.push(JSON.stringify(listAssetTypeSortShow[i]._id))
        }

        if (chartAssetChart.chartAssets) {
            chartAssetChart.chartAssets.forEach(asset => {
                for (let k in asset.assetType) {
                    let idx = idAssetTypeTest.indexOf(JSON.stringify(asset.assetType[k]._id));
                    countAssetType[idx]++;
                }
            })
            chartAssetChart.chartAssets.forEach(asset => {
                for (let k in asset.assetType) {
                    let idx = idAssetTypeTest.indexOf(JSON.stringify(asset.assetType[k]._id));
                    countAssetValue[idx] += asset.cost / 1000000;
                }
            })
            chartAssetChart.chartAssets.forEach(asset => {
                for (let k in asset.assetType) {
                    let idx = idAssetTypeTest.indexOf(JSON.stringify(asset.assetType[k]._id));
                    countDepreciation[idx] += calculateDepreciation(asset.depreciationType, asset.cost, asset.usefulLife, asset.estimatedTotalProduction, asset.unitsProducedDuringTheYears, asset.startDepreciation) / 1000000;
                }
            })
            for (let i in listAssetTypeSortShow) {
                let longName = listAssetTypeSortShow[i].typeName.slice(0, 20) + "...";
                let name = listAssetTypeSortShow[i].typeName.length > 20 ? longName : listAssetTypeSortShow[i].typeName;
                shortName.push(name);
                typeName.push(listAssetTypeSortShow[i].typeName);

            }
        }
        let dataChartType = { listType: listAssetTypeSortShow }
        dataChartType = {
            ...dataChartType,
            amountType: {
                typeName: typeName,
                shortName: shortName,
                countAssetType: countAssetType,
                countAssetValue: countAssetValue,
                countDepreciation: countDepreciation,
                idAssetType: idAssetType,
            }
        }

        result = {
            ...result,
            dataChartType: dataChartType
        }

        res.status(200).json({
            success: true,
            messages: ["get_asset_group_success"],
            content: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["get_asset_group_fail"],
            content: { error: error }
        });
    }
}



calculateDepreciation = (depreciationType, cost, usefulLife, estimatedTotalProduction, unitsProducedDuringTheYears, startDepreciation) => {
    let annualDepreciation = 0, monthlyDepreciation = 0, remainingValue = cost;

    if (depreciationType === "straight_line") { // Phương pháp khấu hao theo đường thẳng
        annualDepreciation = ((12 * cost) / usefulLife);
        monthlyDepreciation = cost / usefulLife;
        remainingValue = cost - (cost / usefulLife) * ((new Date().getFullYear() * 12 + new Date().getMonth()) - (new Date(startDepreciation).getFullYear() * 12 + new Date(startDepreciation).getMonth()));

    } else if (depreciationType === "declining_balance") { // Phương pháp khấu hao theo số dư giảm dần
        let lastYears = false,
            t,
            usefulYear = usefulLife / 12,
            usedTime = (new Date().getFullYear() * 12 + new Date().getMonth()) - (new Date(startDepreciation).getFullYear() * 12 + new Date(startDepreciation).getMonth());

        if (usefulYear < 4) {
            t = (1 / usefulYear) * 1.5;
        } else if (usefulYear >= 4 && usefulYear <= 6) {
            t = (1 / usefulYear) * 2;
        } else if (usefulYear > 6) {
            t = (1 / usefulYear) * 2.5;
        }

        // Tính khấu hao đến năm hiện tại
        for (let i = 1; i <= usedTime / 12; i++) {
            if (!lastYears) {
                if (remainingValue * t > (remainingValue / (usefulYear - i + 1))) {
                    annualDepreciation = remainingValue * t;
                } else {
                    annualDepreciation = (remainingValue / (usefulYear - i + 1));
                    lastYears = true;
                }
            }

            remainingValue = remainingValue - annualDepreciation;
        }

        // Tính khấu hao đến tháng hiện tại
        if (usedTime % 12 !== 0) {
            if (!lastYears) {
                if (remainingValue * t > (remainingValue / (usefulYear - Math.floor(usedTime / 12)))) {
                    annualDepreciation = remainingValue * t;
                } else {
                    annualDepreciation = (remainingValue / (usefulYear - Math.floor(usedTime / 12)));
                    lastYears = true;
                }
            }

            monthlyDepreciation = annualDepreciation / 12;
            remainingValue = remainingValue - (monthlyDepreciation * (usedTime % 12))
        }

    } else if (depreciationType === "units_of_production") { // Phương pháp khấu hao theo sản lượng
        let monthTotal = unitsProducedDuringTheYears.length; // Tổng số tháng tính khấu hao
        let productUnitDepreciation = cost / (estimatedTotalProduction * (usefulLife / 12)); // Mức khấu hao đơn vị sản phẩm
        let accumulatedDepreciation = 0; // Giá trị hao mòn lũy kế

        for (let i = 0; i < monthTotal; i++) {
            accumulatedDepreciation += unitsProducedDuringTheYears[i].unitsProducedDuringTheYear * productUnitDepreciation;
        }

        remainingValue = cost - accumulatedDepreciation;
        annualDepreciation = monthTotal ? accumulatedDepreciation * 12 / monthTotal : 0;
    }
    // console.log('cost', parseInt(cost - remainingValue));
    return parseInt(cost - remainingValue);
}

exports.getAssetStatisticChart = async (req, res) => {
    try {
        let AssetStatisticChart = await AssetService.chartAssetGroupData(req.portal, req.user.company._id);
        let statisticChartdata = AssetStatisticChart.result
        let result = {}
        let statisticChart = statisticChartdata.chartAssets
        const listAssetStatisticTypes = statisticChartdata.listType;

        let listAssetTypeSortStatistic = [];
        for (let i in listAssetStatisticTypes) {
            let count = { ...listAssetStatisticTypes[i], countAsset: 0 };
            for (let j in statisticChartdata.chartAssets) {
                if (statisticChartdata.chartAssets[j].assetType.some(item => JSON.stringify(listAssetStatisticTypes[i]._id) === JSON.stringify(item._id))) {
                    count = { ...count, countAsset: count.countAsset + 1 }

                }
            }
            listAssetTypeSortStatistic = [
                ...listAssetTypeSortStatistic,
                count,
            ];
        }

        listAssetTypeSortStatistic = listAssetTypeSortStatistic.sort((a, b) => (a.countAsset < b.countAsset) ? 1 : ((b.countAsset < a.countAsset) ? -1 : 0))
        listAssetTypeSortShowStatistic = listAssetTypeSortStatistic.map((value, index) => {
            return (value._doc)
        })
        let numberOfReadyToUse = [], numberOfInUse = [], numberOfBroken = [], numberOfLost = [], numberOfDisposed = [], idAssetTypes = [], idAssetTypeTests = [];

        for (let i in listAssetTypeSortShowStatistic) {
            numberOfReadyToUse[i] = 0;
            numberOfInUse[i] = 0;
            numberOfBroken[i] = 0;
            numberOfLost[i] = 0;
            numberOfDisposed[i] = 0;
            idAssetTypes.push(listAssetTypeSortShowStatistic[i]._id)
            idAssetTypeTests.push(JSON.stringify(listAssetTypeSortShowStatistic[i]._id))
        }

        if (statisticChartdata.chartAssets) {
            statisticChartdata.chartAssets.forEach(asset => {
                for (let k in asset.assetType) {
                    let item = idAssetTypeTests.indexOf(JSON.stringify(asset.assetType[k]._id));
                    if (asset.status === "ready_to_use") {
                        numberOfReadyToUse[item]++;
                    } else if (asset.status === "disposed") {
                        numberOfDisposed[item]++;
                    } else if (asset.status === "in_use") {
                        numberOfInUse[item]++;
                    } else if (asset.status === "broken") {
                        numberOfBroken[item]++;
                    } else if (asset.status === "lost") {
                        numberOfLost[item]++;
                    }

                }
            })
        }
        let dataStatusOfAsset = {}

        dataStatusOfAsset = {
            ...dataStatusOfAsset,
            statusOfAsset: {
                numberOfReadyToUse: numberOfReadyToUse,
                numberOfInUse: numberOfInUse,
                numberOfBroken: numberOfBroken,
                numberOfLost: numberOfLost,
                numberOfDisposed: numberOfDisposed,
                idAssetTypes: idAssetTypes,
            }
        }
        result = {
            ...result,
            dataStatusOfAsset: dataStatusOfAsset
        }

        let lessThanOneHundred = [], oneHundred = [], twoHundred = [], fiveHundred = [], oneBillion = [], twoBillion = [], fiveBillion = [], tenBillion = [], idAssetTypeCost = [], idAssetTypeTestCost = [];
        for (let j in listAssetTypeSortShowStatistic) {
            lessThanOneHundred[j] = 0;
            oneHundred[j] = 0;
            twoHundred[j] = 0;
            fiveHundred[j] = 0;
            oneBillion[j] = 0;
            twoBillion[j] = 0;
            fiveBillion[j] = 0;
            tenBillion[j] = 0;
            idAssetTypeCost.push(listAssetTypeSortShowStatistic[j]._id)
            idAssetTypeTestCost.push(JSON.stringify(listAssetTypeSortShowStatistic[j]._id))
        }
        if (statisticChart) {
            statisticChart.forEach(asset => {
                for (let k in asset.assetType) {
                    let index = idAssetTypeTestCost.indexOf(JSON.stringify(asset.assetType[k]._id));
                    if (asset.cost < 100000000) {
                        lessThanOneHundred[index]++
                    } else if (asset.cost >= 100000000 && asset.cost < 200000000) {
                        oneHundred[index]++
                    } else if (asset.cost >= 200000000 && asset.cost < 500000000) {
                        twoHundred[index]++
                    } else if (asset.cost >= 500000000 && asset.cost < 1000000000) {
                        fiveHundred[index]++
                    } else if (asset.cost >= 100000000 && asset.cost < 2000000000) {
                        oneBillion[index]++
                    } else if (asset.cost >= 200000000 && asset.cost < 5000000000) {
                        twoBillion[index]++
                    } else if (asset.cost >= 500000000 && asset.cost < 10000000000) {
                        fiveBillion[index]++
                    } else if (asset.cost >= 10000000000) {
                        tenBillion[index]++
                    }
                }
            })
        }
        let dataCostOfAsset = {}
        dataCostOfAsset = {
            ...dataCostOfAsset,
            costOfAssets: {
                lessThanOneHundred: lessThanOneHundred,
                oneHundred: oneHundred,
                twoHundred: twoHundred,
                fiveHundred: fiveHundred,
                oneBillion: oneBillion,
                twoBillion: twoBillion,
                fiveBillion: fiveBillion,
                tenBillion: tenBillion,
                idAssetTypes: idAssetTypes,

            }
        }
        result = {
            ...result,
            dataCostOfAsset: dataCostOfAsset
        }

        res.status(200).json({
            success: true,
            messages: ["get_asset_statisitc_success"],
            content: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["get_asset_statistic_fail"],
            content: { error: error }
        });
    }
}

exports.getAssetPurchaseChart = async (req, res) => {
    try {

        let AssetPurchaseChart

        AssetPurchaseChart = await AssetService.chartAssetGroupData(req.portal, req.user.company._id);

        let result = {}
        let purchaseChartdata = AssetPurchaseChart.result

        let purchaseChart = purchaseChartdata.chartAssets

        const listAssetPurchaseTypes = purchaseChartdata.listType;

        let year = 0
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
            //console.log(item1,year,startMonth,endMonth,startYear)
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
            //console.log(year,startMonth,endMonth,startYear)
        }


        let purchaseDateAfter = [startYear, startMonth].join('-')
        let purchaseDateBefore = [year, endMonth].join('-')
        let startDate = new Date(purchaseDateAfter);
        let endDate = new Date(purchaseDateBefore);
        //console.log(purchaseDateAfter,purchaseDateBefore,startDate,endDate)
        let period = Math.round((endDate - startDate) / 2592000000) + 1;
        let listMonth = [], value = [], countAsset = [], category = [], arr = [];
        let m = purchaseDateAfter.slice(5, 7);
        let y = purchaseDateAfter.slice(0, 4);
        //console.log(purchaseDateAfter)
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
        
        let countType = [], valueType = []
        if (purchaseChart) {
            for (let i = 0; i < listMonth.length - 1; i++) {
                let cnt = 0, val = 0;
                let minDate = new Date(listMonth[i]).getTime();
                let maxDate = new Date(listMonth[i + 1]).getTime();
                let countAssetcount = [], valueAsset = [], idAssetTypePurchase = [], idAssetTypeTestPurchase = [];
                for (let j in listAssetPurchaseTypes) {
                    countAssetcount[j] = 0;
                    valueAsset[j] = 0;
                    idAssetTypePurchase.push(listAssetPurchaseTypes[j]._id)
                    idAssetTypeTestPurchase.push(JSON.stringify(listAssetPurchaseTypes[j]._id))
                }
                if (purchaseChart) {
                    purchaseChart.forEach(asset => {
                        for (let j in asset.assetType) {
                            let index = idAssetTypeTestPurchase.indexOf(JSON.stringify(asset.assetType[j]._id));

                            if (new Date(asset.purchaseDate).getTime() < maxDate && new Date(asset.purchaseDate).getTime() >= minDate) {
                                countAssetcount[index]++
                                valueAsset[index] += asset.cost / 1000000;
                                cnt++;
                                val += asset.cost / 1000000;
                            }
                        }

                    })
                }
                countType.push({ xType: category[i], countAssetcount: countAssetcount, valueAsset: valueAsset, idAssetTypeTestPurchase: idAssetTypeTestPurchase, idAssetTypePurchase: idAssetTypePurchase })
                countAsset.push(cnt);
                value.push(val);

            }

        }
        result = { ...result, purchaseChart: countType }

        let startDateYear = purchaseDateAfter.slice(0, 4);
        let endDateYear = purchaseDateBefore.slice(0, 4);
        let periodYear = endDateYear - startDateYear + 1;
        let valueYear = [], countAssetYear = [], categoryYear = [], arrYear = [];
        for (let i = 0; i < periodYear; i++) {
            categoryYear.push(parseInt(startDateYear) + i);
        }
        let countTypeYear = []
        if (purchaseChart) {
            for (let i = 0; i < categoryYear.length; i++) {
                let cntYear = 0, valYear = 0;
                let countAssetcountYear = [], valueAssetYear = [], idAssetTypePurchaseYear = [], idAssetTypeTestPurchaseYear = [];
                for (let j in listAssetPurchaseTypes) {
                    countAssetcountYear[j] = 0;
                    valueAssetYear[j] = 0;
                    idAssetTypePurchaseYear.push(listAssetPurchaseTypes[j]._id)
                    idAssetTypeTestPurchaseYear.push(JSON.stringify(listAssetPurchaseTypes[j]._id))
                }
                if (purchaseChart) {
                    purchaseChart.forEach(asset => {
                        for (let j in asset.assetType) {
                            let index = idAssetTypeTestPurchaseYear.indexOf(JSON.stringify(asset.assetType[j]._id));
                            if (new Date(asset.purchaseDate).getFullYear() == categoryYear[i]) {
                                countAssetcountYear[index]++
                                valueAssetYear[index] += asset.cost / 1000000;
                                cntYear++;
                                valYear += asset.cost / 1000000;
                            }
                        }
                    })
                }

                countTypeYear.push({ xType: categoryYear[i], countAssetcountYear: countAssetcountYear, valueAssetYear: valueAssetYear, idAssetTypeTestPurchaseYear: idAssetTypeTestPurchaseYear, idAssetTypePurchaseYear: idAssetTypePurchaseYear })
                countAssetYear.push(cntYear);
                valueYear.push(valYear);

            }
        }
        result = { ...result, purchaseChartYear: countTypeYear }

        res.status(200).json({
            success: true,
            messages: ["get_asset_purchase_success"],
            content: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["get_asset_purchase_fail"],
            content: { error: error }
        });
    }
}

exports.getAssetDisposalChart = async (req, res) => {
    try {
        let AssetDisposalChart
        AssetDisposalChart = await AssetService.chartAssetGroupData(req.portal, req.user.company._id);
        let result = {}
        let disposalChartdata = AssetDisposalChart.result
        let disposalChart = disposalChartdata.chartAssets
        const listAssetDisposalTypes = disposalChartdata.listType; 
        let year = 0
        let startMonth = 0, endMonth = 0, startYear = 0;
        let listMonthDisposal = [], value = [], countAsset = [], categoryDisposal = [], arr = [];
        if (req.query.time) {
            
            let item1 = JSON.parse(req.query.time)
            let stD = new Date(item1.startTimeDisposal)
            let endD = new Date(item1.endTimeDisposal)
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

        let disposalDateAfter = [startYear, startMonth].join('-')
        let disposalDateBefore = [year, endMonth].join('-')
        
        let startDate = new Date(disposalDateAfter);
        let endDate = new Date(disposalDateBefore);

        let period = Math.round((endDate - startDate) / 2592000000) + 1;
        
        let m = disposalDateAfter.slice(5, 7);
        let y = disposalDateAfter.slice(0, 4);
        
        for (let k = 0; k <= period; k++) {
            if (m > 12) {
                m = 1;
                y++;
            }
            if (m < 10) {
                m = '0' + m;
            }
            categoryDisposal.push([m, y].join('-'));
            listMonthDisposal.push([y, m].join(','));
            m++;
        }
        //console.log("categoryDisposal",categoryDisposal)
        let countType = [], valueType = []

        if (disposalChart) {
            for (let i = 0; i < listMonthDisposal.length - 1; i++) {
                let cnt = 0, val = 0;
                let minDate = new Date(listMonthDisposal[i]).getTime();
                let maxDate = new Date(listMonthDisposal[i + 1]).getTime();
                let countAssetcount = [], valueAsset = [], idAssetTypeDisposal = [], idAssetTypeTestDisposal = [];
                for (let j in listAssetDisposalTypes) {
                    countAssetcount[j] = 0;
                    valueAsset[j] = 0;
                    idAssetTypeDisposal.push(listAssetDisposalTypes[j]._id)
                    idAssetTypeTestDisposal.push(JSON.stringify(listAssetDisposalTypes[j]._id))
                }
                if (disposalChart) {
                    disposalChart.forEach(asset => {
                        
                            for (let j in asset.assetType) {
                                let index = idAssetTypeTestDisposal.indexOf(JSON.stringify(asset.assetType[j]._id));
                                if (asset.status === "disposed"){
                                    if (new Date(asset.disposalDate).getTime() < maxDate && new Date(asset.disposalDate).getTime() >= minDate) {
                                        countAssetcount[index]++
                                        valueAsset[index] += asset.disposalCost / 1000000;
                                        cnt++;
                                        val += asset.disposalCost / 1000000;
                                    }
                                }
                                
                            }
                        

                    })
                }
                countType.push({ xTypeDipsosal: categoryDisposal[i], countAssetcount: countAssetcount, valueAsset: valueAsset, idAssetTypeTestDisposal: idAssetTypeTestDisposal, idAssetTypeDisposal: idAssetTypeDisposal })
                countAsset.push(cnt);

                value.push(val);

            }

        }

        result = { ...result, disposalChart: countType }


        let startDateYear = disposalDateAfter.slice(0, 4);
        let endDateYear = disposalDateBefore.slice(0, 4);
        let periodYear = endDateYear - startDateYear + 1;
        let valueYear = [], countAssetYear = [], categoryYear = [], arrYear = [];
        for (let i = 0; i < periodYear; i++) {
            categoryYear.push(parseInt(startDateYear) + i);
        }
        let countTypeYear = []
        if (disposalChart) {
            for (let i = 0; i < categoryYear.length; i++) {
                let cntYear = 0, valYear = 0;
                let countAssetcountYear = [], valueAssetYear = [], idAssetTypeDisposalYear = [], idAssetTypeTestDisposalYear = [];
                for (let j in listAssetDisposalTypes) {
                    countAssetcountYear[j] = 0;
                    valueAssetYear[j] = 0;
                    idAssetTypeDisposalYear.push(listAssetDisposalTypes[j]._id)
                    idAssetTypeTestDisposalYear.push(JSON.stringify(listAssetDisposalTypes[j]._id))
                }
                if (disposalChart) {
                    disposalChart.forEach(asset => {
                        if (asset.status === "disposed") {
                            for (let j in asset.assetType) {
                                let index = idAssetTypeTestDisposalYear.indexOf(JSON.stringify(asset.assetType[j]._id));
                                if (new Date(asset.disposalDate).getFullYear() == categoryYear[i]) {
                                    countAssetcountYear[index]++
                                    valueAssetYear[index] += asset.disposalCost / 1000000;
                                    cntYear++;
                                    valYear += asset.disposalCost / 1000000;
                                }
                            }
                        }

                    })
                }

                countTypeYear.push({ xType: categoryYear[i], countAssetcountYear: countAssetcountYear, valueAssetYear: valueAssetYear, idAssetTypeTestDisposalYear: idAssetTypeTestDisposalYear, idAssetTypeDisposalYear: idAssetTypeDisposalYear })
                countAssetYear.push(cntYear);
                valueYear.push(valYear);

            }
        }
        result = { ...result, disposalChartYear: countTypeYear }

        res.status(200).json({
            success: true,
            messages: ["get_asset_disposal_success"],
            content: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["get_asset_disposal_fail"],
            content: { error: error }
        });
    }
}

exports.getAssetIncidentChart = async (req, res) => {
    try {
        let AssetIncidentChart

        AssetIncidentChart = await AssetService.chartAssetGroupData(req.portal, req.user.company._id);
        let result = {}
        let incidentChartdata = AssetIncidentChart.result

        let incidentChart = incidentChartdata.chartAssets

        const listAssetIncidentTypes = incidentChartdata.listType;


        let year = 0
        let startMonth = 0, endMonth = 0, startYear = 0;
        //console.log("req.query.time",req.query.time)
        if (req.query.time) {
            let item1 = JSON.parse(req.query.time)
            let stD = new Date(item1.startTimeIncident)
            let endD = new Date(item1.endTimeIncident)
            console.log(req.query.time)
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
            //console.log(year,startMonth,endMonth,startYear)
        }

        let incidentDateAfter = [startYear, startMonth].join('-')
        let incidentDateBefore = [year, endMonth].join('-')

        let startDate = new Date(incidentDateAfter);
        let endDate = new Date(incidentDateBefore);
        
        let period = Math.round((endDate - startDate) / 2592000000) + 1;
        let listMonth = [], countAsset = [], category = [], arr = [];
        let m = incidentDateAfter.slice(5, 7);
        let y = incidentDateAfter.slice(0, 4);
        

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
        let countType = []
        
        if (incidentChart) {
            for (let i = 0; i < listMonth.length - 1; i++) {
                let cnt = 0, val = 0;
                let minDate = new Date(listMonth[i]).getTime();
                let maxDate = new Date(listMonth[i + 1]).getTime();
                let countAssetcount = [], idAssetTypeIncident = [], idAssetTypeTestIncident = [];
                for (let j in listAssetIncidentTypes) {
                    countAssetcount[j] = 0;
                    idAssetTypeIncident.push(listAssetIncidentTypes[j]._id)
                    idAssetTypeTestIncident.push(JSON.stringify(listAssetIncidentTypes[j]._id))
                }
                if (incidentChart) {
                    incidentChart.forEach(asset => {
                        for (let j in asset.assetType) {
                            let index = idAssetTypeTestIncident.indexOf(JSON.stringify(asset.assetType[j]._id));
                            let incidentLog = asset.incidentLogs 
                            if (incidentLog.length){
                                incidentLog.forEach(e =>{
                                    let date1 = new Date(e.dateOfIncident).getTime()
                                    if (new Date(e.dateOfIncident).getTime() >= minDate && new Date(e.dateOfIncident).getTime() <maxDate ){
                                        cnt++;
                                        countAssetcount[index]++;
                                        
                                    }
                                    
                                })
                                
                            }
                        }
                    })
                }
                countType.push({ xType: category[i], countAssetcount: countAssetcount, idAssetTypeTestIncident: idAssetTypeTestIncident, idAssetTypeIncident: idAssetTypeIncident })

            }

        }
        result = { ...result, incidentChart: countType }
        

        let startDateYear = incidentDateAfter.slice(0, 4);
        let endDateYear = incidentDateBefore.slice(0, 4);
        let periodYear = endDateYear - startDateYear + 1;
        let valueYear = [], countAssetYear = [], categoryYear = [], arrYear = [];
        for (let i = 0; i < periodYear; i++) {
            categoryYear.push(parseInt(startDateYear) + i);
        }
        let countTypeYear = []
        
        if (incidentChart) {
            for (let i = 0; i < categoryYear.length; i++) {
                let cntYear = 0, valYear = 0;
                let countAssetcountYear = [], valueAssetYear = [], idAssetTypeIncidentYear = [], idAssetTypeTestIncidentYear = [];
                for (let j in listAssetIncidentTypes) {
                    countAssetcountYear[j] = 0;
                    valueAssetYear[j] = 0;
                    idAssetTypeIncidentYear.push(listAssetIncidentTypes[j]._id)
                    idAssetTypeTestIncidentYear.push(JSON.stringify(listAssetIncidentTypes[j]._id))
                }
                if (incidentChart) {
                    incidentChart.forEach(asset => {
                        for (let j in asset.assetType) {
                            let index = idAssetTypeTestIncidentYear.indexOf(JSON.stringify(asset.assetType[j]._id));
                            let incidentLog = asset.incidentLogs 
                            if (incidentLog.length){
                                incidentLog.forEach(e =>{
                                    let date1 = new Date(e.dateOfIncident).getTime()
                                    if (new Date(e.dateOfIncident).getFullYear() == categoryYear[i]){
                                        cntYear++;
                                        countAssetcountYear[index]++;
                                        //console.log(cntYear)
                                    }
                                    
                                })
                                
                            }
                        }
                    })
                }
                
                countTypeYear.push({ xType: categoryYear[i], countAssetcountYear: countAssetcountYear,  idAssetTypeTestIncidentYear: idAssetTypeTestIncidentYear, idAssetTypeIncidentYear: idAssetTypeIncidentYear })
                

            }
        }
        result = { ...result, incidentChartYear: countTypeYear }
        
        res.status(200).json({
            success: true,
            messages: ["get_asset_incident_success"],
            content: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["get_asset_incident_fail"],
            content: { error: error }
        });
    }
}

exports.getAssetMaintenanceChart = async (req, res) => {
    try {
        let AssetMaintenanceChart

        AssetMaintenanceChart = await AssetService.chartAssetGroupData(req.portal, req.user.company._id);
        let result = {}
        let maintenanceChartdata = AssetMaintenanceChart.result

        let maintenanceChart = maintenanceChartdata.chartAssets

        const listAssetMaintenanceTypes = maintenanceChartdata.listType;
        let year = 0
        let startMonth = 0, endMonth = 0, startYear = 0;
        if (req.query.time) {
            let item1 = JSON.parse(req.query.time)
            let stD = new Date(item1.startTimeMaintenance)
            let endD = new Date(item1.endTimeMaintenance)
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
        let maintenanceDateAfter = [startYear, startMonth].join('-')
        let maintenanceDateBefore = [year, endMonth].join('-')

        let startDate = new Date(maintenanceDateAfter);
        let endDate = new Date(maintenanceDateBefore);
        
        let period = Math.round((endDate - startDate) / 2592000000) + 1;
        let listMonth = [], countAsset = [], category = [], arr = [];
        let m = maintenanceDateAfter.slice(5, 7);
        let y = maintenanceDateAfter.slice(0, 4);

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
        let countType = []

        if (maintenanceChart) {
            for (let i = 0; i < listMonth.length - 1; i++) {
                let cnt = 0, val = 0;
                let minDate = new Date(listMonth[i]).getTime();
                let maxDate = new Date(listMonth[i + 1]).getTime();
                let countAssetcount = [],valueAsset = [], idAssetTypeMaintenance = [], idAssetTypeTestMaintenance = [];
                for (let j in listAssetMaintenanceTypes) {
                    countAssetcount[j] = 0;
                    valueAsset[j] = 0;
                    idAssetTypeMaintenance.push(listAssetMaintenanceTypes[j]._id)
                    idAssetTypeTestMaintenance.push(JSON.stringify(listAssetMaintenanceTypes[j]._id))
                }
                
                if (maintenanceChart) {
                    maintenanceChart.forEach(asset => {
                        
                        for (let j in asset.assetType) {
                            let index = idAssetTypeTestMaintenance.indexOf(JSON.stringify(asset.assetType[j]._id));
                            let maintenanceLog = asset.maintainanceLogs 
                            if (maintenanceLog.length){
                                maintenanceLog.forEach(e =>{
                                    if (new Date(e.createDate).getTime() >= minDate && new Date(e.createDate).getTime() <maxDate ){
                                        cnt++;
                                        countAssetcount[index]++;
                                        valueAsset[index] += e.expense / 1000000;
                                    }
                                    
                                })
                                
                            }
                        }
                        
                    })
                }
                
                countType.push({ xType: category[i], countAssetcount: countAssetcount,valueAsset: valueAsset, idAssetTypeTestMaintenance: idAssetTypeTestMaintenance, idAssetTypeMaintenance: idAssetTypeMaintenance })

            }

        }
        result = { ...result, maintenanceChart: countType }
        
        let startDateYear = maintenanceDateAfter.slice(0, 4);
        let endDateYear = maintenanceDateBefore.slice(0, 4);
        let periodYear = endDateYear - startDateYear + 1;
        let valueYear = [], countAssetYear = [], categoryYear = [], arrYear = [];
        for (let i = 0; i < periodYear; i++) {
            categoryYear.push(parseInt(startDateYear) + i);
        }
        let countTypeYear = []

        if (maintenanceChart) {
            for (let i = 0; i < categoryYear.length; i++) {
                let cntYear = 0, valYear = 0;
                let countAssetcountYear = [], valueAssetYear = [], idAssetTypeMaintenanceYear = [], idAssetTypeTestMaintenanceYear = [];
                for (let j in listAssetMaintenanceTypes) {
                    countAssetcountYear[j] = 0;
                    valueAssetYear[j] = 0;
                    idAssetTypeMaintenanceYear.push(listAssetMaintenanceTypes[j]._id)
                    idAssetTypeTestMaintenanceYear.push(JSON.stringify(listAssetMaintenanceTypes[j]._id))
                }
                if (maintenanceChart) {
                    maintenanceChart.forEach(asset => {
                        for (let j in asset.assetType) {
                            let index = idAssetTypeTestMaintenanceYear.indexOf(JSON.stringify(asset.assetType[j]._id));
                            let maintenanceLog = asset.maintainanceLogs 
                            if (maintenanceLog.length){
                                maintenanceLog.forEach(e =>{
                                    let date1 = new Date(e.dateOfIncident).getTime()
                                    if (new Date(e.createDate).getFullYear() == categoryYear[i]){
                                        cntYear++;
                                        countAssetcountYear[index]++;
                                        valueAssetYear[index] += e.expense / 1000000;
                                        
                                    }
                                    
                                })
                                
                            }
                        }
                    })
                }
                
                countTypeYear.push({ xType: categoryYear[i], countAssetcountYear: countAssetcountYear,valueAssetYear:valueAssetYear,  idAssetTypeTestMaintenanceYear: idAssetTypeTestMaintenanceYear, idAssetTypeMaintenanceYear: idAssetTypeMaintenanceYear })
                console.log(countTypeYear)

            }
        }
        result = { ...result, maintenanceYearChart: countTypeYear }
        
        res.status(200).json({
            success: true,
            messages: ["get_asset_maintenance_success"],
            content: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["get_asset_maintenance_fail"],
            content: { error: error }
        });
    }
}