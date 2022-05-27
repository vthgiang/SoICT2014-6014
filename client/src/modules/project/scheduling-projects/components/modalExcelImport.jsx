import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, ExportExcel, ImportFileExcel } from '../../../../common-components'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import { ProjectActions } from "../../projects/redux/actions";
import { getCurrentProjectDetails, getEmailMembers } from '../../projects/components/functionHelper';
import { configImportCPMData } from './staticData'

const ModalExcelImport = (props) => {
    const [state, setState] = useState({});
    const [isFirstInitialRender, setIsFirstIntialRender] = useState(true);
    const { translate, project } = props;
    const projectDetail = getCurrentProjectDetails(project);
    const [currentMessageError, setCurrentMessageError] = useState('');

    const dataImportTemplate = {
        fileName: 'Thông tin công việc dự án',
        dataSheets: [
            {
                sheetName: 'Danh sách công việc',
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
                            { key: 'totalResWeight', value: 'Trọng số thành viên thực hiện (%)' },
                        ],
                        data: [
                            {
                                code: 'A',
                                name: "Công việc A",
                                estimateOptimisticTime: 2,
                                estimateNormalTime: 5,
                                predecessors: '',
                                emailResponsibleEmployees: ['abc.vnist@gmail.com'],
                                emailAccountableEmployees: ['xyz.vnist@gmail.com'],
                                totalResWeight: 80,
                            },
                            {
                                code: 'B',
                                name: "Công việc B",
                                estimateOptimisticTime: 2,
                                estimateNormalTime: 5,
                                predecessors: ['A'],
                                emailResponsibleEmployees: ['abc.vnist@gmail.com'],
                                emailAccountableEmployees: ['xyz.vnist@gmail.com', 'xyz12.vnist@gmail.com'],
                                totalResWeight: 90,
                            },
                            {
                                code: 'C',
                                name: "Công việc C",
                                estimateOptimisticTime: 2,
                                estimateNormalTime: 5,
                                predecessors: ['A', 'B'],
                                emailResponsibleEmployees: ['abc.vnist@gmail.com', 'abc12.vnist@gmail.com'],
                                emailAccountableEmployees: ['xyz.vnist@gmail.com'],
                                totalResWeight: 75,
                            },
                        ]
                    }
                ]
            },
            {
                sheetName: 'Danh sách email thành viên dự án',
                sheetTitle: 'Danh sách email thành viên dự án',
                tables: [
                    {
                        columns: [
                            { key: "emailProjectMembers", value: "Email" },
                        ],
                        data: getEmailMembers(projectDetail).map(emailItem => {
                            return {
                                emailProjectMembers: emailItem,
                            }
                        }),
                    }
                ]
            },
        ]
    }

    const convertDataCPMExport = (dataExport) => {
        let datas = [];
        let data = dataExport.dataSheets[0].tables[0].data;
        for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
            let currentTask = data[dataIndex];
            // currentNumOfRowsEachTask để xác định task này chiếm bao nhiều row trong file excel. Các yếu tố ảnh hưởng là predecessors, emailResponsibleEmployees, emailAccountableEmployees
            let currentNumOfRowsEachTask = 0;
            if (currentTask.predecessors.length > currentNumOfRowsEachTask) {
                currentNumOfRowsEachTask = currentTask.predecessors.length;
            }
            if (currentTask.emailResponsibleEmployees.length > currentNumOfRowsEachTask) {
                currentNumOfRowsEachTask = currentTask.emailResponsibleEmployees.length;
            }
            if (currentTask.emailAccountableEmployees.length > currentNumOfRowsEachTask) {
                currentNumOfRowsEachTask = currentTask.emailAccountableEmployees.length;
            }
            let newTask = {
                ...currentTask,
                predecessors: currentTask.predecessors[0],
                emailResponsibleEmployees: currentTask.emailResponsibleEmployees[0],
                emailAccountableEmployees: currentTask.emailAccountableEmployees[0],
            }
            datas = [...datas, newTask];
            if (currentNumOfRowsEachTask > 1) {
                for (let i = 1; i < currentNumOfRowsEachTask; i++) {
                    newTask = {
                        code: '',
                        name: "",
                        estimateOptimisticTime: '',
                        estimateNormalTime: '',
                        predecessors: currentTask.predecessors[i],
                        emailResponsibleEmployees: currentTask.emailResponsibleEmployees[i],
                        emailAccountableEmployees: currentTask.emailAccountableEmployees[i],
                    };
                    datas = [...datas, newTask];
                }
            }
        }
        dataExport.dataSheets[0].tables[0].data = datas;
        return dataExport;
    }

    const importCPM = () => {
        let data = state.data; // mảng các công việc cpm tương ứng
        // let params = { limit }
        // props.importCPM({ data }, params);
        data && data.length > 0 && props.importCPM(data);
    }

    const handleImport = (value, checkFileImport) => {
        console.log("value", value)
        let data = getDataImportCPM(value);
        // // console.log('data', data)
        // console.log('checkFileImport', checkFileImport)
        setIsFirstIntialRender(false);
        setState({
            ...state,
            data: data
        });
    }

    const handleCheckDataSuitable = (data) => {
        for (let dataItem of data) {
            for (let preItem of dataItem.preceedingTasks) {
                if (dataItem.preceedingTasks.filter((dataItemPreceedingItem => preItem === dataItemPreceedingItem)).length > 1) {
                    setCurrentMessageError(`Danh sách công việc tiền nhiệm đang có sự trùng nhau: ${dataItem.preceedingTasks.join(', ')}`);
                    return;
                }
            }
            for (let resItem of dataItem.emailResponsibleEmployees) {
                if (dataItem.emailResponsibleEmployees.filter((dataItemEmailResItem => resItem === dataItemEmailResItem)).length > 1) {
                    setCurrentMessageError(`Danh sách email responsbile đang có sự trùng nhau: ${dataItem.emailResponsibleEmployees.join(', ')}`);
                    return;
                }
            }
            for (let accItem of dataItem.emailAccountableEmployees) {
                if (dataItem.emailAccountableEmployees.filter((dataItemEmailAccItem => accItem === dataItemEmailAccItem)).length > 1) {
                    setCurrentMessageError(`Danh sách email accountable đang có sự trùng nhau: ${dataItem.emailAccountableEmployees.join(', ')}`);
                    return;
                }
            }
            if (dataItem.estimateOptimisticTime >= dataItem.estimateNormalTime) {
                setCurrentMessageError(`Thời gian thoả hiệp của ${dataItem.name} phải nhỏ hơn thời gian ước lượng`);
                return;
            }
            if ( dataItem.totalResWeight <= 0 || dataItem.totalResWeight >= 100){
                setCurrentMessageError(`Trọng số thực hiện hoặc phê duyệt của ${dataItem.name} không hợp lệ`);
                return;
            }
        }
        setCurrentMessageError(``);
    }

    const getDataImportCPM = (data) => {
        // console.log('data', data)
        let resultData = [];
        let formatPreceedingTasks = [], formatEmailResponsibleEmployees = [], formatEmailAccountableEmployees = [];

        let dataIndex = 0;
        while (dataIndex < data.length) {
            const { code, name, predecessors, estimateNormalTime, estimateOptimisticTime, emailResponsibleEmployees, emailAccountableEmployees, totalResWeight } = data[dataIndex];
            if (!code && !name && !estimateOptimisticTime && !estimateNormalTime && !totalResWeight) {
                // dataIndex hiện tại sẽ làm bộ đếm để lưu lại index hiện tại của task mình đang xét
                let dataAdditionRowIndex = dataIndex;
                // Nếu các thành phần trên rỗng thì ta xét các dòng tiếp, nếu rỗng thì push tiếp, nếu không rỗng thì gán vào cái đã có
                while (
                    dataAdditionRowIndex < data.length
                ) {
                    // Nếu các thành phần trên rỗng thì mảng nào push mảng nấy
                    if (!(!data[dataAdditionRowIndex].code && !data[dataAdditionRowIndex].name
                        && !data[dataAdditionRowIndex].estimateOptimisticTime && !data[dataAdditionRowIndex].estimateNormalTime &&
                        !data[dataAdditionRowIndex].totalResWeight && !data[dataAdditionRowIndex].name)) {
                        break;
                    }
                    predecessors && formatPreceedingTasks.push(predecessors);
                    emailResponsibleEmployees && formatEmailResponsibleEmployees.push(emailResponsibleEmployees);
                    emailAccountableEmployees && formatEmailAccountableEmployees.push(emailAccountableEmployees);
                    dataAdditionRowIndex++;
                }
                // Sau khi đã đạt được đến item cuối của row rỗng, gán vào giá trị cuối cùng của mảng resultData đang xét
                resultData[resultData.length - 1].preceedingTasks = formatPreceedingTasks;
                resultData[resultData.length - 1].emailResponsibleEmployees = formatEmailResponsibleEmployees;
                resultData[resultData.length - 1].emailAccountableEmployees = formatEmailAccountableEmployees;
                dataIndex = dataAdditionRowIndex;
            } else {
                // Reset lại 3 mảng này khi đã nhảy sang task mới
                formatPreceedingTasks = predecessors === null || predecessors === '' || predecessors === undefined ? [] : [predecessors];
                formatEmailResponsibleEmployees = emailResponsibleEmployees === null || emailResponsibleEmployees === '' || emailResponsibleEmployees === undefined ? [] : [emailResponsibleEmployees];
                formatEmailAccountableEmployees = emailAccountableEmployees === null || emailAccountableEmployees === '' || emailAccountableEmployees === undefined ? [] : [emailAccountableEmployees];
                resultData.push({
                    code: code.trim(),
                    name: name.trim(),
                    preceedingTasks: formatPreceedingTasks,
                    estimateNormalTime,
                    estimateOptimisticTime,
                    emailResponsibleEmployees: formatEmailResponsibleEmployees,
                    emailAccountableEmployees: formatEmailAccountableEmployees,
                    totalResWeight,
                })
                dataIndex++;
            }
        }

        handleCheckDataSuitable(resultData);
        return resultData;
    }

    const handleResetModal = () => {
        setIsFirstIntialRender(true);
        setState({});
        setCurrentMessageError('');
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-import-cpm-data" isLoading={false}
                formID="form-import-cpm-data"
                title={translate('manage_user.import_title')}
                func={importCPM}
                disableSubmit={!(state.data && state.data.length > 0 && !currentMessageError)}
                size={50}
                saveText={`Nhập dữ liệu`}
                resetOnClose={true}
            >
                <div className="description-box without-border">
                    <h4><strong>Các bước upload file excel danh sách công việc dự án:</strong></h4>
                    <div>
                        Bước 1: Download template excel về
                        <ExportExcel className="btn btn-link" type="link" id="downloadTemplateImport-cpm"
                            buttonName={`Tải file template excel danh sách công việc dự án`} exportData={convertDataCPMExport(dataImportTemplate)} />
                    </div>
                    <div>Bước 2: Chỉnh sửa file excel vừa tải về</div>
                    <div>
                        Bước 3: Chọn file excel và tải lên
                        <div style={{ marginTop: 10 }}>
                            <div className="form-group">
                                <ImportFileExcel
                                    callFunctionDeleteFile={handleResetModal}
                                    configData={configImportCPMData}
                                    handleImportExcel={handleImport}
                                />
                            </div>
                            {
                                !(state.data && state.data.length > 0 && !currentMessageError) && !isFirstInitialRender &&
                                <div style={{ color: 'red' }}>File Excel không hợp lệ!</div>
                            }
                        </div>
                    </div>
                    <div>
                        <strong style={{ color: 'red' }}>{currentMessageError}</strong>
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
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate((ModalExcelImport)));
