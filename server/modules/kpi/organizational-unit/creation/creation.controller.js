const KPIUnitService = require('./creation.service')
const Logger = require(`../../../../logs`)

const managerService = require('../management/management.service')

const { getDataOrganizationalUnitKpiSetLog } = require('../../../../helpers/descriptionLogKpi')

/**
 * Get organizational unit kpi set
 */
exports.getOrganizationalUnitKpiSet = async (req, res) => {
    if (req.query.parent) {
        getParentOrganizationalUnitKpiSet(req, res);
    } else if (req.query.allOrganizationalUnitKpiSet) {
        getAllOrganizationalUnitKpiSet(req, res);
    } else if (req.query.child) {
        getAllOrganizationalUnitKpiSetByTimeOfChildUnit(req, res);
    } else if (req.query.allOrganizationalUnitKpiSetByTime) {
        getAllOrganizationalUnitKpiSetByTime(req, res);
    } else {
        try {
            let kpiunit = await KPIUnitService.getOrganizationalUnitKpiSet(req.portal, req.query);
            
            Logger.info(req.user.email, `Get kpi unit by role `, req.portal);
            res.status(200).json({
                success: true,
                messages: ['get_kpiunit_by_role_success'],
                content: kpiunit
            })
        } catch (error) {
            Logger.error(req.user.email, `Get kpi unit by role `, req.portal)
            res.status(400).json({
                success: false,
                messages: ['get_kpiunit_by_role_fail'],
                content: error
            })
        }
    }

}

/**
 * Chỉnh sửa thông tin chung của tập KPI đơn vị
 */
exports.editOrganizationalUnitKpiSet = async (req, res) => {
    if (req.query.type === 'edit-status') {
        editOrganizationalUnitKpiSetStatus(req, res);
    } else {
        try {
            let organizationalUnitKpiSet = await KPIUnitService.editImportancesInUnitKpi(req.portal, req.params.id, req.body, req.query.type);
            Logger.info(req.user.email, ' Edit kpi unit ', req.portal);
            res.status(200).json({
                success: true,
                messages: ['edit_kpi_success'],
                content: organizationalUnitKpiSet,
            });
        } catch (error) {
            Logger.error(req.user.email, ' Edit kpi unit ', req.portal);
            res.status(400).json({
                success: false,
                messages: ['edit_kpi_failure'],
                content: error
            })
        }
    }
}


/**
 * Xóa tập KPI đơn vị 
 */
exports.deleteOrganizationalUnitKpiSet = async (req, res) => {
    try {
        let arr = await KPIUnitService.deleteOrganizationalUnitKpiSet(req.portal, req.params.id);
        kpiunit = arr[0];
        listTarget = arr[1];
        Logger.info(req.user.email, 'delete kpi unit', req.portal)
        res.status(200).json({
            success: true,
            messages: ['delete_kpi_success'],
            content: {
                kpiunit: kpiunit,
                listtarget: listTarget
            }
        });
    } catch (error) {
        Logger.error(req.user.email, 'delete kpi unit', req.portal)
        res.status(400).json({
            success: false,
            messages: ['delete_kpi_failure'],
            content: error
        })
    }

}

/**
 * Xóa KPI đơn vị
 */
exports.deleteOrganizationalUnitKpi = async (req, res) => {
    try {
        let data = await KPIUnitService.deleteOrganizationalUnitKpi(req.portal, req.params.idUnitKpi, req.params.idUnitKpiSet);
        
        // Thêm logs 
        let log = getDataOrganizationalUnitKpiSetLog({
            type: "delete_kpi",
            creator: req.user._id,
            organizationalUnit: data?.organizationalUnitKpiSet?.organizationalUnit, 
            month: data?.organizationalUnitKpiSet?.date,
            newData: data?.organizationalUnitKpi
        })
        await managerService.createOrganizationalUnitKpiSetLogs(req.portal, {
            ...log,
            organizationalUnitKpiSetId: data?.organizationalUnitKpiSet?._id
        })

        // Thêm newsfeed
        await KPIUnitService.createNewsFeedForOrganizationalUnitKpiSet(req.portal, {
            ...log,
            organizationalUnit: data?.organizationalUnitKpiSet?.organizationalUnit,
            organizationalUnitKpiSetId: data?.organizationalUnitKpiSet?._id
        });

        Logger.info(req.user.email, 'delete target kpi unit', req.portal);
        res.status(200).json({
            success: true,
            messages: ['confirm_delete_target_success'],
            content: data?.organizationalUnitKpiSet
        });
    } catch (error) {
        Logger.error(req.user.email, 'delete target kpi unit', req.portal)
        res.status(400).json({
            success: false,
            messages: ['confirm_delete_target_failure'],
            content: error
        })
    }
}

/**
 * Lấy tập KPI đơn vị của đơn vị cha của đơn vị ứng với role người dùng
 */
getParentOrganizationalUnitKpiSet = async (req, res) => {
    try {
        let kpiunit = await KPIUnitService.getParentOrganizationalUnitKpiSet(req.portal, req.query);
        
        Logger.info(req.user.email, 'get parent kpi unit', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_parent_by_unit_success'],
            content: kpiunit
        });
    } catch (error) {
        Logger.error(req.user.email, 'get parent kpi unit', req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_parent_by_unit_failure'],
            content: error
        })
    }

}

/**
 * Thêm một KPI vào tập KPI đơn vị
 */
exports.createOrganizationalUnitKpi = async (req, res) => {
    try {
        let organizationalUnitKpiSet = await KPIUnitService.createOrganizationalUnitKpi(req.portal, req.body);
        
        // Thêm log
        let log = getDataOrganizationalUnitKpiSetLog({
            type: "add_kpi",
            creator: req.user._id,
            organizationalUnit: organizationalUnitKpiSet?.organizationalUnit, 
            month: organizationalUnitKpiSet?.date,
            newData: organizationalUnitKpiSet?.kpis?.[organizationalUnitKpiSet?.kpis?.length - 1]
        })
        await managerService.createOrganizationalUnitKpiSetLogs(req.portal, {
            ...log,
            organizationalUnitKpiSetId: organizationalUnitKpiSet?._id
        })

        // Thêm newsfeed
        await KPIUnitService.createNewsFeedForOrganizationalUnitKpiSet(req.portal, {
            ...log,
            organizationalUnit: organizationalUnitKpiSet?.organizationalUnit,
            organizationalUnitKpiSetId: organizationalUnitKpiSet?._id
        });

        Logger.info(req.user.email, 'create target kpi unit', req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_target_success'],
            content: organizationalUnitKpiSet,
        });
    } catch (error) {
        let messages = error && error.messages === 'organizational_unit_kpi_exist' ? ['organizational_unit_kpi_exist'] : ['create_target_failure'];

        Logger.error(req.user.email, 'create target kpi unit', req.portal)
        res.status(400).json({
            success: false,
            messages: messages,
            content: error
        })
    }
}

/**
 * Chỉnh sửa KPI đơn vị
 */
exports.editOrganizationalUnitKpi = async (req, res) => {
    try {
        let data = await KPIUnitService.editOrganizationalUnitKpi(req.portal, req.body, req.params.id);
        
        // Thêm log
        let log = getDataOrganizationalUnitKpiSetLog({
            type: "edit_kpi",
            creator: req.user._id,
            organizationalUnit: data?.unitKpiSet?.organizationalUnit, 
            month: data?.unitKpiSet?.date,
            newData: data?.target
        })
        await managerService.createOrganizationalUnitKpiSetLogs(req.portal, {
            ...log,
            organizationalUnitKpiSetId: data?.unitKpiSet?._id
        })

        // Thêm newsfeed
        await KPIUnitService.createNewsFeedForOrganizationalUnitKpiSet(req.portal, {
            ...log,
            organizationalUnit: data?.unitKpiSet?.organizationalUnit,
            organizationalUnitKpiSetId: data?.unitKpiSet?._id
        })
        
        Logger.info(req.user.email, 'edit target kpi unit', req.portal)
        res.status(200).json({
            success: true,
            messages: ['edit_target_success'],
            content: data?.target
        });
    } catch (error) {
        let messages = error && error.messages === 'organizational_unit_kpi_exist' ? ['organizational_unit_kpi_exist'] : ['edit_target_failure'];

        Logger.error(req.user.email, 'edit target kpi unit', req.portal)
        res.status(400).json({
            success: false,
            messages: messages,
            content: error
        })
    }

}

/**
 * Chỉnh sửa trạng thái của KPI đơn vị
 */
editOrganizationalUnitKpiSetStatus = async (req, res) => {
    try {
        let kpiunit = await KPIUnitService.editOrganizationalUnitKpiSetStatus(req.portal, req.params.id, req.body);
        
        // Thêm log
        let log = getDataOrganizationalUnitKpiSetLog({
            type: "edit_status",
            creator: req.user._id,
            organizationalUnit: kpiunit?.organizationalUnit, 
            month: kpiunit?.date,
            newData: kpiunit
        })
        await managerService.createOrganizationalUnitKpiSetLogs(req.portal, {
            ...log,
            organizationalUnitKpiSetId: kpiunit?._id
        })

        // Thêm newsfeed
        await KPIUnitService.createNewsFeedForOrganizationalUnitKpiSet(req.portal, {
            ...log,
            organizationalUnit: kpiunit?.organizationalUnit,
            organizationalUnitKpiSetId: kpiunit?._id
        });

        Logger.info(req.user.email, 'edit status kpi unit', req.portal)
        res.status(200).json({
            success: true,
            messages: ['confirm_edit_status_success'],
            content: kpiunit,
        });
    } catch (error) {
        Logger.error(req.user.email, 'edit status kpi unit', req.portal)
        res.status(400).json({
            success: false,
            messages: ['confirm_edit_status_failure'],
            content: error
        })
    }
}

/**
 * Khởi tạo tập KPI đơn vị
 */
exports.createOrganizationalUnitKpiSet = async (req, res) => {
    try {
        let data = {
            ...req.body,
            creator: req.user._id
        }
        let organizationalUnitKpiSet = await KPIUnitService.createOrganizationalUnitKpiSet(req.portal, data);
        
        // Thêm log
        let log = getDataOrganizationalUnitKpiSetLog({
            type: "create",
            creator: req.user._id,
            organizationalUnit: organizationalUnitKpiSet?.organizationalUnit, 
            month: organizationalUnitKpiSet?.date,
            newData: organizationalUnitKpiSet
        })
        await managerService.createOrganizationalUnitKpiSetLogs(req.portal, {
            ...log,
            organizationalUnitKpiSetId: organizationalUnitKpiSet?._id
        })

        // Thêm newsfeed
        await KPIUnitService.createNewsFeedForOrganizationalUnitKpiSet(req.portal, {
            ...log,
            organizationalUnit: organizationalUnitKpiSet?.organizationalUnit,
            organizationalUnitKpiSetId: organizationalUnitKpiSet?._id
        });

        Logger.info(req.user.email, 'create kpi unit', req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_organizational_unit_kpi_set_success'],
            content: organizationalUnitKpiSet,
        });
    } catch (error) {
        Logger.error(req.user.email, 'create kpi unit', req.portal)
        res.status(400).json({
            success: false,
            messages: ['create_organizational_unit_kpi_set_failure'],
            content: error
        })
    }
}

/** 
 * Lấy danh sách các tập KPI đơn vị theo thời gian của từng đơn vị 
 */
getAllOrganizationalUnitKpiSetByTime = async (req, res) => {
    try {
        let organizationalUnitKpiSets = await KPIUnitService.getAllOrganizationalUnitKpiSetByTime(req.portal, req.query.roleId, req.query.organizationalUnitId, req.query.startDate, req.query.endDate);
        Logger.info(req.user.email, ' get all organizational unit kpi set each year ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_organizational_unit_kpi_set_each_year_success'],
            content: organizationalUnitKpiSets
        })
    } catch (error) {
        Logger.error(req.user.email, ' get all organizational unit kpi set each year ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_all_organizational_unit_kpi_set_each_year_failure'],
            content: error
        })
    }
}

/** 
 * Lấy danh sách các tập KPI đơn vị theo thời gian của các đơn vị là con của đơn vị hiện tại và đơn vị hiện tại 
 */
getAllOrganizationalUnitKpiSetByTimeOfChildUnit = async (req, res) => {
    try {
        let childOrganizationalUnitKpiSets = await KPIUnitService.getAllOrganizationalUnitKpiSetByTimeOfChildUnit(req.portal, req.query);
        
        Logger.info(req.user.email, ' get all organizational unit kpi set each year of child unit ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_organizational_unit_kpi_set_each_year_of_child_success'],
            content: childOrganizationalUnitKpiSets
        })
    } catch (error) {
        Logger.error(req.user.email, ' get all organizational unit kpi set each year of child unit ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_all_organizational_unit_kpi_set_each_year_of_child_failure'],
            content: error
        })
    }
}

getAllOrganizationalUnitKpiSet = async (req, res) => {
    try {
        let kpiunits = await KPIUnitService.getAllOrganizationalUnitKpiSet(req.portal, req.query);
        Logger.info(req.user.email, ' get kpi unit ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_kpi_unit_success'],
            content: kpiunits
        })
    } catch (error) {
        Logger.error(req.user.email, ' get kpi unit ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_kpi_unit_fail'],
            content: error
        })
    }

};

/**
 * Tạo comment trong trang create KPI employee
 */
exports.createComment = async (req, res) => {
    try {
        var files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                var path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        var comments = await KPIUnitService.createComment(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` create comment `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_comment_success'],
            content: comments
        })
    } catch (error) {
        await Logger.error(req.user.email, ` create comment kpi `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['create_comment_fail'],
            content: error
        });
    }
}

/**
 * 
 * Tạo comment trong comment trong trang create KPI employee (tạo replied comment)
 */
exports.createChildComment = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })
            })
        }

        let comments = await KPIUnitService.createChildComment(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` create comment `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_child_comment_success'],
            content: comments
            })
    } catch (error) {
        await Logger.error(req.user.email, ` create child comment kpi `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['create_child_comment_fail'],
            content: error
        });
    }
}

/**
 * 
 *Sửa comment trong trang create KPI employee
 */
exports.editComment = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        let comments = await KPIUnitService.editComment(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` edit comment kpi `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['edit_comment_success'],
            content: comments
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit comment kpi `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['edit_comment_fail'],
            content: error
        });
    }
}

/**
 * Xóa comment trong trang create KPI organizational
 */
exports.deleteComment = async (req, res) => {
    try {
        let comments = await KPIUnitService.deleteComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete comment kpi`, req.portal)
        res.status(200).json({
            success: false,
            messages: ['delete_comment_success'],
            content: comments
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete comment kpi `, req.portal)
        res.status(200).json({
            success: false,
            messages: ['delete_comment_fail'],
            content: error
        })
    }
}
/**
 * Sửa 1 comment trong trang create KPI employee (xóa comment replied)
 */
exports.editChildComment = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        let comments = await KPIUnitService.editChildComment(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` edit comment of comment kpi `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['edit_comment_of_comment_success'],
            content: comments
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit comment of comment kpi `, req.portal)
        res.status(400).json({
            success: true,
            messages: ['edit_comment_of_comment_fail'],
            content: error
        })
    }
}

/**
 * Xóa comment của commnent trong trang create KPI employee (xóa comment replied)
 */
exports.deleteChildComment = async (req, res) => {
    try {
        var comments = await KPIUnitService.deleteChildComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete child comment kpi `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['delete_child_comment_success'],
            content: comments
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete child comment kpi `, req.portal)
        res.status(400).json({
            success: true,
            messages: ['delete_child_comment_fail'],
            content: error
        })
    }
}
/**
 * Xóa file của comment
 */
exports.deleteFileComment = async (req, res) => {
    try {
        var comments = await KPIUnitService.deleteFileComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete file comment `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['delete_file_comment_success'],
            content: comments
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete file comment `, req.portal)
        res.status(400).json({
            success: true,
            messages: ['delete_file_comment_fail'],
            content: error
        })
    }
}
/**
 * Xóa file child comment
 */
exports.deleteFileChildComment = async (req, res) => {
    try {
        var comments = await KPIUnitService.deleteFileChildComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete file child comment `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['delete_file_comment_success'],
            content: comments
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete file child comment `, req.portal)
        res.status(400).json({
            success: true,
            messages: ['delete_file_comment_fail'],
            content: error
        })
    }
}

