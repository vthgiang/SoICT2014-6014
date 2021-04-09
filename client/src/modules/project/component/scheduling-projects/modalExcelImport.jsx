import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, ExportExcel, ImportFileExcel } from '../../../../common-components'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import { ProjectActions } from '../../redux/actions'

const ModalExcelImport = (props) => {
    const [state, setState] = useState({});
    const { translate } = props;
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
            columnName: "Thời gian ước lượng lạc quan",
            description: "Thời gian ước lượng lạc quan",
            value: "Thời gian ước lượng lạc quan"
        },
        estimatePessimisticTime: {
            columnName: "Thời gian ước lượng bi quan",
            description: "Thời gian ước lượng bi quan",
            value: "Thời gian ước lượng bi quan"
        },
        estimateNormalCost: {
            columnName: "Chi phí ước lượng",
            description: "Chi phí ước lượng",
            value: "Chi phí ước lượng"
        },
        estimateMaxCost: {
            columnName: "Chi phí ước lượng thoả hiệp tối đa",
            description: "Chi phí ước lượng thoả hiệp tối đa",
            value: "Chi phí ước lượng thoả hiệp tối đa"
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
                                { key: 'estimateOptimisticTime', value: 'Thời gian ước lượng lạc quan' },
                                { key: "estimatePessimisticTime", value: "Thời gian ước lượng bi quan" },
                                { key: 'estimateNormalCost', value: 'Chi phí ước lượng' },
                                { key: "estimateMaxCost", value: "Chi phí ước lượng thoả hiệp tối đa" },
                            ],
                            data: [
                                {
                                    code: 'A',
                                    name: "Công việc A",
                                    estimateOptimisticTime: 2,
                                    estimateNormalTime: 5,
                                    estimatePessimisticTime: 8,
                                    predecessors: '',
                                    estimateNormalCost: 100000,
                                    estimateMaxCost: 105000,
                                },
                                {
                                    code: 'B',
                                    name: "Công việc B",
                                    estimateOptimisticTime: 5,
                                    estimateNormalTime: 8,
                                    estimatePessimisticTime: 10,
                                    predecessors: 'A',
                                    estimateNormalCost: 300000,
                                    estimateMaxCost: 105000,
                                }
                            ]
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
        console.log('last data', data);
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
            const {code, name, predecessors, estimateNormalTime, estimateOptimisticTime, estimatePessimisticTime, estimateNormalCost, estimateMaxCost} = u;
            console.log('predecessors', predecessors)
            let preceedingTasks = predecessors === null || predecessors === '' || predecessors === undefined ? [] : predecessors.split(',');
            return {
                code: code.trim(),
                name: name.trim(),
                preceedingTasks,
                estimateNormalTime,
                estimateOptimisticTime,
                estimatePessimisticTime,
                estimateNormalCost,
                estimateMaxCost,
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
