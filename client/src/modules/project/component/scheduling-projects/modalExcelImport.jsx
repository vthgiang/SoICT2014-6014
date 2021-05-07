import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, ExportExcel, ImportFileExcel } from '../../../../common-components'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import { ProjectActions } from '../../redux/actions'
import { getCurrentProjectDetails } from '../projects/functionHelper'

const ModalExcelImport = (props) => {
    const [state, setState] = useState({});
    const { translate, project } = props;
    const projectDetail = getCurrentProjectDetails(project);
    // console.log(projectDetail)

    const getEmailMembers = () => {
        let resultArr = [];
        resultArr.push(projectDetail.creator.email);
        for (let managerItem of projectDetail.projectManager) {
            if (!resultArr.includes(managerItem.email)) {
                resultArr.push(managerItem.email)
            }
        }
        for (let employeeItem of projectDetail.responsibleEmployees) {
            if (!resultArr.includes(employeeItem.email)) {
                resultArr.push(employeeItem.email)
            }
        }
        return resultArr;
    }

    const configData = {
        sheets: {
            description: "Tên các sheet",
            value: ["Sheet1"]
        },
        rowHeader: {
            description: "Số tiêu đề của bảng",
            value: 2
        },
        code: {
            columnName: "Mã công việc",
            description: "Mã công việc",
            value: "Mã công việc"
        },
        name: {
            columnName: "Tên công việc",
            description: "Tên công việc",
            value: "Tên công việc"
        },
        predecessors: {
            columnName: "Công việc tiền nhiệm",
            description: "Công việc tiền nhiệm",
            value: "Công việc tiền nhiệm"
        },
        estimateNormalTime: {
            columnName: "Thời gian ước lượng",
            description: "Thời gian ước lượng",
            value: "Thời gian ước lượng"
        },
        estimateOptimisticTime: {
            columnName: "Thời gian ước lượng thoả hiệp",
            description: "Thời gian ước lượng thoả hiệp",
            value: "Thời gian ước lượng thoả hiệp"
        },
        emailResponsibleEmployees: {
            columnName: "Email thành viên thực hiện",
            description: "Email thành viên thực hiện",
            value: "Email thành viên thực hiện"
        },
        emailAccountableEmployees: {
            columnName: 'Email thành viên phê duyệt',
            description: 'Email thành viên phê duyệt',
            value: 'Email thành viên phê duyệt'
        },
        emailProjectMembers: {
            columnName: "Danh sách email thành viên dự án",
            description: "Danh sách email thành viên dự án",
            value: "Danh sách email thành viên dự án",
        },
    }

    const dataImportTemplate = () => {
        return {
            fileName: 'Thông tin công việc dự án',
            dataSheets: [
                {
                    sheetName: 'sheet1',
                    sheetTitle: 'Thông tin công việc dự án',
                    tables: [
                        {
                            columns: [
                                { key: "code", value: "Mã công việc" },
                                { key: "name", value: "Tên công việc" },
                                { key: 'predecessors', value: 'Công việc tiền nhiệm' },
                                { key: "estimateNormalTime", value: "Thời gian ước lượng" },
                                { key: 'estimateOptimisticTime', value: 'Thời gian ước lượng thoả hiệp' },
                                { key: 'emailResponsibleEmployees', value: 'Email thành viên thực hiện' },
                                { key: 'emailAccountableEmployees', value: 'Email thành viên phê duyệt' },
                                { key: 'emailProjectMembers', value: 'Danh sách email thành viên dự án' },
                            ],
                            data: getEmailMembers().map((emailItem, emailIndex) => {
                                if (emailIndex === 0) {
                                    return {
                                        code: 'A',
                                        name: "Công việc A",
                                        estimateOptimisticTime: 2,
                                        estimateNormalTime: 5,
                                        predecessors: '',
                                        responsibleEmployees: 'abc.vnist@gmail.com',
                                        accountableEmployees: 'xyz.vnist@gmail.com',
                                        emailProjectMembers: emailItem,
                                    }
                                }
                                if (emailIndex === 1) {
                                    return {
                                        code: 'B',
                                        name: "Công việc B",
                                        estimateOptimisticTime: 5,
                                        estimateNormalTime: 8,
                                        predecessors: 'A',
                                        responsibleEmployees: 'abc.vnist@gmail.com, abc2.vnist@gmail.com',
                                        accountableEmployees: 'xyz.vnist@gmail.com, xyz2.vnist@gmail.com',
                                        emailProjectMembers: emailItem,
                                    }
                                }
                                return {
                                    code: '',
                                    name: "",
                                    estimateOptimisticTime: '',
                                    estimateNormalTime: '',
                                    predecessors: '',
                                    responsibleEmployees: '',
                                    accountableEmployees: '',
                                    emailProjectMembers: emailItem,
                                }
                            })
                        }
                    ]
                },

            ]
        }
    }

    const importCPM = () => {
        let data = state.data; // mảng các công việc cpm tương ứng
        // let params = { limit }
        // props.importCPM({ data }, params);
        props.importCPM(data);
    }

    const handleImport = (value, checkFileImport) => {
        let data = getDataImportCPM(value);
        setState({
            ...state,
            data: data
        });
    }

    const getDataImportCPM = (data) => {
        let newData = data.map(u => {
            const { code, name, predecessors, estimateNormalTime, estimateOptimisticTime, emailResponsibleEmployees, emailAccountableEmployees } = u;
            // console.log('predecessors', predecessors)
            let preceedingTasks = predecessors === null || predecessors === '' || predecessors === undefined ? [] : predecessors.split(',');
            let formatEmailResponsibleEmployees = emailResponsibleEmployees === null || emailResponsibleEmployees === '' || emailResponsibleEmployees === undefined ? [] : emailResponsibleEmployees.split(',');
            let formatEmailAccountableEmployees = emailAccountableEmployees === null || emailAccountableEmployees === '' || emailAccountableEmployees === undefined ? [] : emailAccountableEmployees.split(',');
            return {
                code: code.trim(),
                name: name.trim(),
                preceedingTasks,
                estimateNormalTime,
                estimateOptimisticTime,
                emailResponsibleEmployees: formatEmailResponsibleEmployees,
                emailAccountableEmployees: formatEmailAccountableEmployees,
            }
        });
        return newData;
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-import-cpm-data" isLoading={false}
                formID="form-import-cpm-data"
                title={translate('manage_user.import_title')}
                func={importCPM}
                hasSaveButton={state.data && state.data.length > 0}
                size={75}
            >
                <div className="row">
                    <div className="col-md-6">
                        <strong>
                            <h4>Bước 1: Download template excel về</h4>
                        </strong>
                    </div>
                    <div className="col-md-3" style={{ marginTop: 10 }}>
                        <div className="form-group">
                            <ExportExcel className="btn btn-primary" type="button" id="downloadTemplateImport-cpm"
                                buttonName={translate('human_resource.download_file')} exportData={dataImportTemplate()} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <strong>
                            <h4>Bước 2: Chỉnh sửa file excel theo mẫu</h4>
                        </strong>
                    </div>
                    <div className="col-md-3" style={{ marginTop: 10 }}>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <strong>
                            <h4>Bước 3: Tải file excel theo mẫu đã chỉnh sửa lên</h4>
                        </strong>
                    </div>
                    <div className="col-md-3" style={{ marginTop: 10 }}>
                        <div className="form-group">
                            <ImportFileExcel
                                configData={configData}
                                handleImportExcel={handleImport}
                            />
                        </div>
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    const { project, user } = state;
    return { project, user }
}

const mapDispatchToProps = {
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getTasksByProject: taskManagementActions.getTasksByProject,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate((ModalExcelImport)));
