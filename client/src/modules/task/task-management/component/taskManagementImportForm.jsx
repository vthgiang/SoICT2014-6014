import React, { Component, useState, useEffect, useRef, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, Loading } from '../../../../common-components';
import { ShowImportData, ImportFileExcel, ConFigImportFile, ExportExcel } from '../../../../common-components';
import { UserActions } from '../../../super-admin/user/redux/actions';
import cloneDeep from 'lodash/cloneDeep';
import { taskManagementActions } from '../redux/actions';
import { AuthActions } from '../../../auth/redux/actions';

function TaskManagementImportForm(props) {
    const [state, setState] = useState({
        checkFileImport: true,
        limit: 100,
        page: 0
    })


    useEffect(() => {
        props.getAllUsers();
    }, [])

    const { checkFileImport, limit, page, importData, rowError } = state;
    const { user, department, tasks, project } = props;

    function configurationImport() {
        let config = {
            sheets: { // Tên các sheet
                description: 'Thông tin chung',
                value: ["Thông tin chung"]
            },
            rowHeader: { // Số dòng tiêu đề của bảng
                description: 'Số dòng tiêu đề của bảng',
                value: 1
            },
            name: {
                columnName: 'Tên công việc',
                description: 'Tên công việc',
                value: 'Tên công việc',
            },
            description: {
                columnName: 'Mô tả',
                description: 'Mô tả',
                value: 'Mô tả',
            },
            organizationalUnit: {
                columnName: 'Đơn vị quản lý',
                description: 'Đơn vị quản lý',
                value: 'Đơn vị quản lý',
            },
            priority: {
                columnName: 'Độ ưu tiên',
                description: 'Độ ưu tiên',
                value: 'Độ ưu tiên',
            },
            progress: {
                columnName: 'Tiến độ',
                description: 'Tiến độ',
                value: 'Tiến độ',
            },
            status: {
                columnName: 'Trạng thái',
                description: 'Trạng thái',
                value: 'Trạng thái',
            },
            startDate: {
                columnName: 'Ngày bắt đầu',
                description: 'Ngày bắt đầu',
                value: 'Ngày bắt đầu',
            },
            startTime: {
                columnName: 'Thời gian bắt đầu',
                description: 'Thời gian bắt đầu',
                value: 'Thời gian bắt đầu',
            },
            endDate: {
                columnName: 'Ngày kết thúc',
                description: 'Ngày kết thúc',
                value: 'Ngày kết thúc',
            },
            endTime: {
                columnName: 'Thời gian kết thúc',
                description: 'Thời gian kết thúc',
                value: 'Thời gian kết thúc',
            },
            responsibleEmployees: {
                columnName: 'Người thực hiện',
                description: 'Người thực hiện',
                value: 'Người thực hiện',
            },
            accountableEmployees: {
                columnName: 'Người phê duyệt',
                description: 'Người phê duyệt',
                value: 'Người phê duyệt',
            },
            consultedEmployees: {
                columnName: 'Người tư vấn',
                description: 'Người tư vấn',
                value: 'Người tư vấn',
            },
            informedEmployees: {
                columnName: 'Người quan sát',
                description: 'Người quan sát',
                value: 'Người quan sát',
            },
            parent: {
                columnName: 'Công việc cha',
                description: 'Công việc cha',
                value: 'Công việc cha',
            },
            collaboratedWithOrganizationalUnits: {
                columnName: 'Đơn vị phối hợp thực hiện',
                description: 'Đơn vị phối hợp thực hiện',
                value: 'Đơn vị phối hợp thực hiện',
            },
            taskProject: {
                columnName: 'Dự án',
                description: 'Dự án',
                value: 'Dự án',
            },
            tags: {
                columnName: 'Tags',
                description: 'Tags',
                value: 'Tags',
            },
        }
        return config;
    }

    /**
     * Function chuyển dữ liệu date trong excel thành dạng dd-mm-yyyy
     * @param {*} serial :số serial của ngày
     */
    function convertExcelDateToJSDate(serial, type) {
        // nếu người dùng nhập thời gan trong file excell là string và ngăn cách bỏi dấu /
        if (serial && typeof serial === 'string') {
            if (serial.includes("/")) {
                const date = serial.split("/");
                if (date?.length) {
                    let month = date[1], day = date[0];
                    if (date[1]?.toString()?.length < 2)
                        month = '0' + date[1];
                    if (date[0]?.toString()?.length < 2)
                        day = '0' + date[0];
                    return [day, month, date[2]].join('-')
                }
                return null;
            }
        } else {
            let utc_days = Math.floor(serial - 25569);
            let utc_value = utc_days * 86400;
            let date_info = new Date(utc_value * 1000);
            let month = date_info.getMonth() + 1;
            let day = date_info.getDate();
            if (month.toString().length < 2)
                month = '0' + month;
            if (day.toString().length < 2)
                day = '0' + day;
            return [day, month, date_info.getFullYear()].join('-');
        }
    }

    function convertTimeExcelToJSDate(fromExcel) {
        let basenumber = (fromExcel * 24)
        let hour = Math.floor(basenumber).toString();
        if (hour.length < 2) {
            hour = '0' + hour;
        }

        let minute = Math.round((basenumber % 1) * 60).toString();
        if (minute.length < 2) {
            minute = '0' + minute;
        }
        let Timestring = (hour + ':' + minute);
        return Timestring;
    }

    const getIdUnitFromName = (nameUnit) => {
        let unitId;
        if (department?.list?.length > 0 && nameUnit) {
            nameUnit = nameUnit.toString();
            const totalUnit = department.list.length;
            for (let i = 0; i < totalUnit; i++) {
                if (department.list[i].name.trim().toLowerCase() === nameUnit.trim().toLowerCase()) {
                    unitId = department.list[i]._id;
                    break;
                }
            }
        }
        if (!unitId)
            return -1;
        return unitId;
    }
    const getTaskParentId = (taskName) => {
        const listTasks = tasks.tasks;
        if (!taskName)
            return -1;

        taskName = taskName.toString();
        let result;
        if (listTasks?.length) {
            for (let i = 0; i < listTasks.length; i++) {
                if (listTasks[i].name.trim().toLowerCase() === taskName.trim().toLowerCase()) {
                    result = cloneDeep(listTasks[i]);
                    break;
                }
            }
        } else return -1;
        if (!result)
            return -1;
        return result._id;
    }

    const getDataCollaboratedWithUnits = (data) => {
        if (!data)
            return -1;
        let dataArr = data.split(',');
        let result = [];

        if (department?.list?.length) {
            const listDeparments = department.list;
            dataArr.forEach(obj => {
                const unit = listDeparments.filter(x => x.name.trim().toLowerCase() === obj.trim().toLowerCase());
                if (unit?.length) {
                    result = [...result, unit[0]._id];
                } else {
                    result = [...result, -1];
                }
            })
        }
        return result;
    }

    const convertPriority = (value) => {
        if (!value)
            return -1;
        value = value.toLowerCase();
        let numberPriority;
        switch (value) {
            case "khẩn cấp":
                numberPriority = 5;
                break;
            case "cao":
                numberPriority = 4;
                break;
            case "tiêu chuẩn":
                numberPriority = 3;
                break;
            case "trung bình":
                numberPriority = 2;
                break;
            case "thấp":
                numberPriority = 1;
                break;
            default:
                numberPriority = -1;
        }
        if (!numberPriority)
            return -1;
        return numberPriority;
    }

    function convertTaskStatus(status) {
        if (!status)
            return -1;
        status = status.toLowerCase();
        let statusConvert;

        switch (status) {
            case "đang thực hiện":
                statusConvert = "inprocess";
                break;
            case "chờ phê duyệt":
                statusConvert = "wait_for_approval";
                break;
            case "đã hoàn thành":
                statusConvert = "finished";
                break;
            case "tạm hoãn":
                statusConvert = "delayed";
                break;
            case "Bị hủy":
                statusConvert = "canceled";
                break;
            default:
                statusConvert = -1;
        }
        if (!statusConvert)
            return -1;
        return statusConvert;
    }

    // thêm creatỏ

    const getUserIdFromEmail = (email) => {
        if (!email)
            return -1;

        let emailArr = email.split(",");
        let data = [];

        if (user?.list?.length > 0) {
            const listUsers = user.list;
            emailArr.forEach(obj => {
                const result = listUsers.filter(x => x.email.trim().toLowerCase() === obj.trim().toLowerCase());
                if (result?.length) {
                    data = [...data, result[0]._id];
                } else {
                    data = [...data, -1];
                }
            })
        }
        return data;
    }

    const convertDateTime = (date, time) => {
        let splitter = date.split("-");
        let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`;
        return new Date(strDateTime);
    }

    const getProjectId = (projectName) => {
        const listProjects = project?.data?.list;
        if (!projectName)
            return -1;

        let result;
        if (listProjects?.length) {
            for (let i = 0; i < listProjects.length; i++) {
                if (listProjects[i].projectType === 1 && listProjects[i].name.trim().toLowerCase() === projectName.trim().toLowerCase()) {
                    result = cloneDeep(listProjects[i]);
                    break;
                }
            }
        } else return -1;

        if (!result)
            return -1;
        return result._id;
    }

    // Function thay đổi file import
    const handleImportExcel = (value, checkFileImport = true) => {
        let valueImport = [], showValueImport = [], rowError = [], checkImportData = value;
        value.forEach((o, index) => {
            let errorAlert = [];
            let priority = o?.priority ? convertPriority(o.priority) : 3,
                status = o?.status ? convertTaskStatus(o.status) : "inprocess",
                progress = o?.progress ? o.progress : 0,
                startDate = o?.startDate ? convertDateTime(convertExcelDateToJSDate(o.startDate), o?.startTime ? convertTimeExcelToJSDate(o.startTime) : "08:00 AM") : null,
                endDate = o?.endDate ? convertDateTime(convertExcelDateToJSDate(o.endDate), o?.endTime ? convertTimeExcelToJSDate(o.endTime) : "05:30 PM") : null,
                organizationalUnit = o?.organizationalUnit ? getIdUnitFromName(o.organizationalUnit) : null,
                name = o?.name ? o.name : '',
                description = o?.description ? o.description : '',
                responsibleEmployees = o?.responsibleEmployees ? getUserIdFromEmail(o.responsibleEmployees) : [],
                accountableEmployees = o?.accountableEmployees ? getUserIdFromEmail(o.accountableEmployees) : [],
                consultedEmployees = o?.consultedEmployees ? getUserIdFromEmail(o.consultedEmployees) : [],
                informedEmployees = o?.informedEmployees ? getUserIdFromEmail(o.informedEmployees) : [],
                collaboratedWithOrganizationalUnits = o?.collaboratedWithOrganizationalUnits ? getDataCollaboratedWithUnits(o.collaboratedWithOrganizationalUnits) : [],
                tags = o?.tags && typeof (o.tags) === 'string' ? o.tags.split(',') : [],
                taskProject = o.taskProject ? getProjectId(o.taskProject) : null;


            if (o.name === null || o.organizationalUnit === null || (o.organizationalUnit && getIdUnitFromName(o.organizationalUnit) === -1) || convertTaskStatus(o.status) === -1 ||
                o.priority === null || (o.priority && convertPriority(o.priority) === -1) || o.startDate === null || o.endDate === null || o.responsibleEmployees === null
                || (o.responsibleEmployees && (getUserIdFromEmail(o.responsibleEmployees) === -1 || getUserIdFromEmail(o.responsibleEmployees).indexOf(-1) !== -1)) || o.accountableEmployees === null ||
                (o.accountableEmployees && (getUserIdFromEmail(o.accountableEmployees) === -1 || getUserIdFromEmail(o.accountableEmployees).indexOf(-1) !== -1))
                || (o.consultedEmployees && (getUserIdFromEmail(o.consultedEmployees) === -1 || getUserIdFromEmail(o.consultedEmployees).indexOf(-1) !== -1))
                || (o.informedEmployees && (getUserIdFromEmail(o.informedEmployees) === -1 || getUserIdFromEmail(o.informedEmployees).indexOf(-1) !== -1))
                || (o.collaboratedWithOrganizationalUnits && (getDataCollaboratedWithUnits(o.collaboratedWithOrganizationalUnits) === -1 || getDataCollaboratedWithUnits(o.collaboratedWithOrganizationalUnits).indexOf(-1) !== -1))
                || (o.taskProject && getProjectId(o.taskProject) === -1)) {
                rowError = [...rowError, index + 1];
                o = { ...o, error: true };
            }

            if (o.name === null) {
                errorAlert = [...errorAlert, 'Tên công việc không được để trống'];
            }

            if (o.organizationalUnit === null)
                errorAlert = [...errorAlert, 'Đơn vị quản lý công việc không được để trống'];
            if (o.organizationalUnit && getIdUnitFromName(o.organizationalUnit) === -1)
                errorAlert = [errorAlert, 'Đơn vị quản lý công việc không hợp lệ'];

            if (o.priority === null)
                errorAlert = [errorAlert, 'Độ ưu tiên không được để trống'];
            if (o.priority && convertPriority(o.priority) === -1)
                errorAlert = [errorAlert, 'Độ ưu tiên không hợp lệ'];

            if (o.startDate === null)
                errorAlert = [errorAlert, 'Ngày bắt đầu công việc không được để trống'];
            if (o.endDate === null)
                errorAlert = [errorAlert, 'Ngày kết thúc công việc không được để trống']

            if (o.responsibleEmployees === null)
                errorAlert = [errorAlert, 'Người thực hiện công việc không được để trống'];
            if (o.responsibleEmployees && (getUserIdFromEmail(o.responsibleEmployees) === -1 || getUserIdFromEmail(o.responsibleEmployees).indexOf(-1) !== -1))
                errorAlert = [errorAlert, 'Người thực hiện công việc không hợp lệ'];

            if (o.accountableEmployees === null)
                errorAlert = [errorAlert, 'Người phê duyệt công việc không được để trống'];
            if (o.accountableEmployees && (getUserIdFromEmail(o.accountableEmployees) === -1 || getUserIdFromEmail(o.accountableEmployees).indexOf(-1) !== -1))
                errorAlert = [errorAlert, 'Người phê duyệt công việc không hợp lệ'];

            if (o.consultedEmployees && (getUserIdFromEmail(o.consultedEmployees) === -1 || getUserIdFromEmail(o.consultedEmployees).indexOf(-1) !== -1))
                errorAlert = [errorAlert, 'Người tư vấn công việc không hợp lệ'];

            if (o.informedEmployees && (getUserIdFromEmail(o.informedEmployees) === -1 || getUserIdFromEmail(o.informedEmployees).indexOf(-1) !== -1))
                errorAlert = [errorAlert, 'Người quan sát công việc không hợp lệ'];

            if (o.collaboratedWithOrganizationalUnits && (getDataCollaboratedWithUnits(o.collaboratedWithOrganizationalUnits) === -1 || getDataCollaboratedWithUnits(o.collaboratedWithOrganizationalUnits).indexOf(-1) !== -1)) {
                errorAlert = [errorAlert, 'Đơn vị phối hợp thực hiện công việc không hợp lệ'];
            }

            if (convertTaskStatus(o.status) === -1) {
                errorAlert = [errorAlert, 'Trạng thái không hợp lệ'];
            }

            // if (x.parent && (getTaskParentId(x.parent) === -1))
            //     errorAlert = [errorAlert, 'Công việc cha không hợp lệ'];

            if ((o.taskProject && getProjectId(o.taskProject) === -1))
                errorAlert = [errorAlert, 'Dự án không hợp lệ'];


            valueImport = [...valueImport, {
                ...o,
                startDate: startDate,
                endDate: endDate,
                organizationalUnit: organizationalUnit,
                name: name,
                description: description,
                priority: priority,
                responsibleEmployees: responsibleEmployees,
                accountableEmployees: accountableEmployees,
                consultedEmployees: consultedEmployees,
                informedEmployees: informedEmployees,
                collaboratedWithOrganizationalUnits: collaboratedWithOrganizationalUnits,
                tags: tags,
                parent: o?.parent && typeof o.parent === 'string' ? o.parent.trim() : null, // xử lý lấy id bên server 
                taskProject: taskProject,
                status: status,
                progress: progress,
            }];

            showValueImport = [...showValueImport, {
                ...o,
                errorAlert: errorAlert,
                startDate: convertExcelDateToJSDate(o.startDate),
                endDate: convertExcelDateToJSDate(o.endDate),
            }]
        })

        setState({
            ...state,
            valueImport,
            showValueImport,
            rowError: rowError,
        })
    }

    const handleImport = () => {
        const { valueImport } = state;
        if (valueImport?.length)
            props.importTasks(valueImport);
    }

    const handleDownloadFileImport = () => {
        const path = `./upload/template-imports/Mau_import_cong_viec.xlsx`;
        props.downloadFile(path, "Mẫu import công việc")
    }

    const config = configurationImport();

    const note = <p className="text-left"><span className="text-red">Sau khi tiến hành import xong, F5 lại trang để xem dữ liệu vừa cập nhật</span></p>;
    return <DialogModal modalID={`modal_import_tasks`} isLoading={false}
        formID={`form_import_tasks`}
        title={'Thêm dữ liệu từ file excel'}
        hasSaveButton={false}
        note={note}
        // hasNote={false}
        size={75}>
        <div className="box-body row">
            {/* File import */}
            <div className="form-group col-md-4 col-xs-12">
                <ImportFileExcel
                    configData={config}
                    handleImportExcel={handleImportExcel}
                />
            </div>
            <div className="form-group col-md-8 col-xs-12">
                <button type="button" className="pull-right btn btn-success" onClick={handleDownloadFileImport} >Tải xuống file mẫu</button>
                <button style={{ marginRight: 10 }} type="button" className="pull-right btn btn-success" onClick={handleImport} >Thêm mới</button>
            </div>


            {/* Hiện thị data import */}

            <div className="col-md-12 col-xs-12">
                <p style={{ textAlign: 'center', color: "#a4a3bc", fontWeight: 'bold' }}>{tasks.isLoading && 'Đang xử lý dữ liệu'}</p>
                <ShowImportData
                    id={`import_list_task`}
                    configData={config}
                    importData={state.showValueImport}
                    rowError={state.rowError}
                    scrollTable={true}
                    checkFileImport={true}
                    limit={limit}
                    page={page}
                    scrollTableWidth={2500}
                />
            </div>
        </div>
    </DialogModal>
}


const mapStateToProps = (state) => {
    const { user, department, tasks, project } = state;
    return { user, department, tasks, project };
};

const mapDispatchToProps = {
    getAllUsers: UserActions.get,
    importTasks: taskManagementActions.importTasks,
    downloadFile: AuthActions.downloadFile,
};
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TaskManagementImportForm));