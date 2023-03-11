import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, ExportExcel, UploadFile, ImportFileExcel } from '../../../../common-components'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import { ProjectActions } from "../../projects/redux/actions";
import { getCurrentProjectDetails, getEmailMembers } from '../../projects/components/functionHelper';
import { configImportCPMData, configPhaseData, configMemberData} from './staticData';

const ModalExcelImport = (props) => {
    const [state, setState] = useState({});
    const [isFirstInitialRender, setIsFirstInitialRender] = useState(true);
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
                            { key: 'predecessors', value: 'Mã công việc tiền nhiệm' },
                            { key: 'projectPhase', value: 'Mã giai đoạn'},
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
                                projectPhase: 1,
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
                                projectPhase: 1,
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
                                projectPhase: 2,
                                emailResponsibleEmployees: ['abc.vnist@gmail.com', 'abc12.vnist@gmail.com'],
                                emailAccountableEmployees: ['xyz.vnist@gmail.com'],
                                totalResWeight: 75,
                            },
                            {
                                code: 'D',
                                name: "Công việc D",
                                estimateOptimisticTime: 2,
                                estimateNormalTime: 5,
                                predecessors: ['A', 'B'],
                                projectPhase: 3,
                                emailResponsibleEmployees: ['abc.vnist@gmail.com', 'abc12.vnist@gmail.com'],
                                emailAccountableEmployees: ['xyz.vnist@gmail.com'],
                                totalResWeight: 70,
                            },
                            {
                                code: 'E',
                                name: "Công việc E",
                                estimateOptimisticTime: 2,
                                estimateNormalTime: 5,
                                predecessors: ['C', 'D'],
                                projectPhase: 4,
                                emailResponsibleEmployees: ['abc.vnist@gmail.com', 'abc12.vnist@gmail.com'],
                                emailAccountableEmployees: ['xyz.vnist@gmail.com'],
                                totalResWeight: 80,
                            },
                            {
                                code: 'F',
                                name: "Công việc F",
                                estimateOptimisticTime: 2,
                                estimateNormalTime: 5,
                                predecessors: ['E', 'B'],
                                projectPhase: 5,
                                emailResponsibleEmployees: ['abc.vnist@gmail.com', 'abc12.vnist@gmail.com'],
                                emailAccountableEmployees: ['xyz.vnist@gmail.com'],
                                totalResWeight: 65,
                            },
                        ]
                    }
                ]
            },
            {
                sheetName: 'Danh sách thành viên dự án',
                sheetTitle: 'Danh sách thành viên dự án',
                tables: [
                    {
                        columns: [
                            { key: "memberName", value: "Tên thành viên"},
                            { key: "emailProjectMembers", value: "Email" },

                        ],
                        data: getEmailMembers(projectDetail).map(item => {
                            return {
                                memberName: item.name,
                                emailProjectMembers: item.email,
                            }
                        }),
                    }
                ]
            },
            {
                sheetName: 'Các giai đoạn trong dự án',
                sheetTitle: 'Thông tin các giai đoạn trong dự án',
                tables: [
                    {
                        columns: [
                            { key: "phaseCode", value: "Mã giai đoạn" },
                            { key: "phaseName", value: "Tên giai đoạn" },
                            { key: 'emailResponsibleEmployees', value: 'Email thành viên thực hiện' },
                            { key: 'emailAccountableEmployees', value: 'Email thành viên phê duyệt' },
                        ],
                        data: [
                            {
                                phaseCode: '1',
                                phaseName: "Khởi động dự án",
                                emailResponsibleEmployees: ['abc.vnist@gmail.com'],
                                emailAccountableEmployees: ['xyz.vnist@gmail.com', 'xyz12.vnist@gmail.com'],
                            },
                            {
                                phaseCode: '2',
                                phaseName: "Lên kế hoạch",
                                emailResponsibleEmployees: ['abc.vnist@gmail.com', 'abc12.vnist@gmail.com'],
                                emailAccountableEmployees: ['xyz.vnist@gmail.com'],

                            },
                            {
                                phaseCode: '3',
                                phaseName: "Tiến hành dự án",
                                emailResponsibleEmployees: ['abc.vnist@gmail.com', 'abc12.vnist@gmail.com'],
                                emailAccountableEmployees: ['xyz.vnist@gmail.com', 'xyz12.vnist@gmail.com'],
                            },
                            {
                                phaseCode: '4',
                                phaseName: "Báo cáo kết quả dự án",
                                emailResponsibleEmployees: ['abc12.vnist@gmail.com'],
                                emailAccountableEmployees: ['xyz12.vnist@gmail.com'],
                            },
                            {
                                phaseCode: '5',
                                phaseName: "Đóng dự án",
                                emailResponsibleEmployees: ['abc.vnist@gmail.com'],
                                emailAccountableEmployees: ['xyz.vnist@gmail.com'],
                            },
                        ]
                    }
                ]
            },
        ]
    }

    const convertDataCPMExport = (dataExport) => {
        // convert dữ liệu công việc
        let taskData = [];
        let data = dataExport.dataSheets[0].tables[0].data;
        for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
            let currentTask = data[dataIndex];
            // currentNumOfRowsEachTask để xác định task này chiếm bao nhiêu row trong file excel. Các yếu tố ảnh hưởng là predecessors, emailResponsibleEmployees, emailAccountableEmployees
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
            taskData = [...taskData, newTask];
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
                    taskData = [...taskData, newTask];
                }
            }
        }
        dataExport.dataSheets[0].tables[0].data = taskData;

        // convert dữ liệu giai đoạn
        let phaseData = [];
        data = dataExport.dataSheets[2]? dataExport.dataSheets[2].tables[0].data: [];
        for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
            let currentPhase = data[dataIndex];
            // currentNumOfRowsEachPhase để xác định phase này chiếm bao nhiêu row trong file excel. Các yếu tố ảnh hưởng là emailResponsibleEmployees, emailAccountableEmployees
            let currentNumOfRowsEachPhase = Math.max(currentPhase.emailResponsibleEmployees.length, currentPhase.emailAccountableEmployees.length);

            let newPhase = {
                ...currentPhase,
                emailResponsibleEmployees: currentPhase.emailResponsibleEmployees[0],
                emailAccountableEmployees: currentPhase.emailAccountableEmployees[0],
            }

            phaseData = [...phaseData, newPhase];
            if (currentNumOfRowsEachPhase > 1) {
                for (let i = 1; i < currentNumOfRowsEachPhase; i++) {
                    newPhase = {
                        phaseCode: '',
                        phaseName: '',
                        emailResponsibleEmployees: currentPhase.emailResponsibleEmployees[i],
                        emailAccountableEmployees: currentPhase.emailAccountableEmployees[i],
                    };
                    phaseData = [...phaseData, newPhase];
                }
            }
        }

        dataExport.dataSheets[2].tables[0].data = phaseData;

        return dataExport;
    }

    const importCPM = () => {
        let taskData = state.taskData; // mảng các công việc cpm tương ứng
        let phaseData = state.phaseData; // mảng các giai đoạn
        taskData && taskData.length > 0 && props.importCPM(taskData, phaseData);
    }

    const handleUploadFile = (files) => {
        ImportFileExcel.importData(files[0], configImportCPMData, handleImportTaskData);
        ImportFileExcel.importData(files[0], configPhaseData, handleImportPhaseData);
    }

    const handleImportTaskData = (value, checkFileImport) => {
        let data = getTaskDataImportCPM(value);
        setIsFirstInitialRender(false);
        setState(state => {
            return {
                ...state,
                taskData: data
            } 
        });
    }

    // Kiểm tra tính hợp lệ của file import
    const handleCheckDataSuitable = (data) => {
        // Kiểm tra mã công việc có trùng nhau hay không
        let codeArr = data.map(dataItem => {
            return dataItem.code;
        })
        let codeMap = {};
        for (let i =0; i< codeArr.length; i++){
            if (codeMap[codeArr[i]]) {
                let duplicateArr = data.flatMap((dataItem,index) => dataItem.code === codeArr[i]? dataItem.name : []);
                setCurrentMessageError(`Các công việc sau đang có mã trùng nhau: ${duplicateArr.join(', ')}`);
                return;
            }
            codeMap[codeArr[i]] = true;
        }


        // Kiểm tra các điều kiện của từng công việc
        for (let dataItem of data) {

            // Kiểm tra sự trùng lặp của mảng các công việc tiền nhiệm
            if (dataItem.preceedingTasks && dataItem.preceedingTasks.length >0) {
                for (let preItem of dataItem.preceedingTasks) {
                    if (dataItem?.preceedingTasks?.filter((dataItemPreceedingItem => preItem === dataItemPreceedingItem)).length > 1) {
                        setCurrentMessageError(`Danh sách công việc tiền nhiệm của công việc ${dataItem.name} đang có sự trùng nhau: ${dataItem.preceedingTasks.join(', ')}`);
                        return;
                    }
                }
            }

            // Kiểm tra sự trùng lặp của mảng các thành viên
            for (let resItem of dataItem.emailResponsibleEmployees) {
                if (dataItem.emailResponsibleEmployees?.filter((dataItemEmailResItem => resItem === dataItemEmailResItem)).length > 1) {
                    setCurrentMessageError(`Danh sách email responsbile đang có sự trùng nhau: ${dataItem.emailResponsibleEmployees.join(', ')}`);
                    return;
                }
            }
            for (let accItem of dataItem.emailAccountableEmployees) {
                if (dataItem.emailAccountableEmployees?.filter((dataItemEmailAccItem => accItem === dataItemEmailAccItem)).length > 1) {
                    setCurrentMessageError(`Danh sách email accountable đang có sự trùng nhau: ${dataItem.emailAccountableEmployees.join(', ')}`);
                    return;
                }
            }

            // Kiểm tra tính hợp lệ của thời gian thoả hiệp và ước lượng
            if (dataItem.estimateOptimisticTime >= dataItem.estimateNormalTime) {
                setCurrentMessageError(`Thời gian thoả hiệp của ${dataItem.name} phải nhỏ hơn thời gian ước lượng`);
                return;
            }

            // Kiểm tra tính hợp lệ của trọng số các thành viên
            if ( dataItem.totalResWeight <= 0 || dataItem.totalResWeight >= 100){
                setCurrentMessageError(`Trọng số thực hiện hoặc phê duyệt của ${dataItem.name} không hợp lệ`);
                return;
            }

            // Kiểm tra tính hợp lệ của mã công việc tiền nhiệm 
            let nonExistentCode = dataItem.preceedingTasks ? dataItem.preceedingTasks?.filter(code => !codeArr.includes(code)) : [];
            if (nonExistentCode.length > 0) {
                setCurrentMessageError(`Mã công việc tiền nhiệm của công việc ${dataItem.name} không hợp lệ : Không tồn tại (các) công việc với mã công việc : ${nonExistentCode.join(', ')}`);
                return;
            }
        }

        setCurrentMessageError(``);
    }

    // Xử lý data của sheet các công việc
    const getTaskDataImportCPM = (data) => {
        let resultData = [];
        let formatPreceedingTasks = [], formatEmailResponsibleEmployees = [], formatEmailAccountableEmployees = [];

        let dataIndex = 0;
        while (dataIndex < data.length) {
            const { code, name, predecessors, projectPhase, estimateNormalTime, estimateOptimisticTime, emailResponsibleEmployees, emailAccountableEmployees, totalResWeight } = data[dataIndex];
            if (!code && !name && !projectPhase && !estimateOptimisticTime && !estimateNormalTime && !totalResWeight ) {
                // dataIndex hiện tại sẽ làm bộ đếm để lưu lại index hiện tại của task mình đang xét
                let dataAdditionRowIndex = dataIndex;
                // Nếu các thành phần trên rỗng thì ta xét các dòng tiếp, nếu rỗng thì push tiếp, nếu không rỗng thì gán vào cái đã có
                while (
                    dataAdditionRowIndex < data.length
                ) {
                    // Nếu các thành phần trên rỗng thì mảng nào push mảng nấy
                    if (data[dataAdditionRowIndex].code && data[dataAdditionRowIndex].name
                        && data[dataAdditionRowIndex].estimateOptimisticTime && data[dataAdditionRowIndex].estimateNormalTime &&
                        data[dataAdditionRowIndex].totalResWeight && data[dataAdditionRowIndex].name) {
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
                    code: code.toString().trim(),
                    name: name.toString().trim(),
                    preceedingTasks: formatPreceedingTasks,
                    projectPhase,
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

    // Xử lý data của sheet các giai đoạn
    const getPhaseDataImportCPM = (data) => {
        let resultData = [];
        let formatEmailResponsibleEmployees = [], formatEmailAccountableEmployees = [];

        let dataIndex = 0;
        if (!data || data.length === 0) return [];
        while (dataIndex < data.length) {
            const { phaseCode, phaseName, emailResponsibleEmployees, emailAccountableEmployees } = data[dataIndex];
            if (!phaseCode && !phaseName ) {
                // dataIndex hiện tại sẽ làm bộ đếm để lưu lại index hiện tại của task mình đang xét
                let dataAdditionRowIndex = dataIndex;
                // Nếu các thành phần trên rỗng thì ta xét các dòng tiếp, nếu rỗng thì push tiếp, nếu không rỗng thì gán vào cái đã có
                while (
                    dataAdditionRowIndex < data.length
                ) {
                    // Nếu các thành phần trên rỗng thì mảng nào push mảng nấy
                    if (data[dataAdditionRowIndex].phaseCode && data[dataAdditionRowIndex].phaseName) {
                        break;
                    }

                    emailResponsibleEmployees && formatEmailResponsibleEmployees.push(emailResponsibleEmployees);
                    emailAccountableEmployees && formatEmailAccountableEmployees.push(emailAccountableEmployees);
                    dataAdditionRowIndex++;
                }
                // Sau khi đã đạt được đến item cuối của row rỗng, gán vào giá trị cuối cùng của mảng resultData đang xét
                resultData[resultData.length - 1].emailResponsibleEmployees = formatEmailResponsibleEmployees;
                resultData[resultData.length - 1].emailAccountableEmployees = formatEmailAccountableEmployees;
                dataIndex = dataAdditionRowIndex;
            } else {
                // Reset lại 3 mảng này khi đã nhảy sang task mới
                formatEmailResponsibleEmployees = emailResponsibleEmployees === null || emailResponsibleEmployees === '' || emailResponsibleEmployees === undefined ? [] : [emailResponsibleEmployees];
                formatEmailAccountableEmployees = emailAccountableEmployees === null || emailAccountableEmployees === '' || emailAccountableEmployees === undefined ? [] : [emailAccountableEmployees];
                resultData.push({
                    code: phaseCode.toString().trim(),
                    name: phaseName.toString().trim(),
                    emailResponsibleEmployees: formatEmailResponsibleEmployees,
                    emailAccountableEmployees: formatEmailAccountableEmployees,
                })
                dataIndex++;
            }
        }

        handleCheckDataSuitable(resultData);
        return resultData;
    }

    const handleImportPhaseData = (value) => {
        let data = getPhaseDataImportCPM(value);
        setIsFirstInitialRender(false);
        setState(state => {
            return {
                ...state,
                phaseData: data
            } 
        });
    }

    const handleResetModal = () => {
        setIsFirstInitialRender(true);
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
                disableSubmit={!(state.taskData && state.taskData.length > 0 && !currentMessageError)}
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
                    <div>Bước 2: Chỉnh sửa file excel theo mẫu vừa tải về</div>
                    <div>
                        Bước 3: Chọn file excel và tải lên
                        <div style={{ marginTop: 10 }}>
                            <div className="form-group">
                                <UploadFile
                                    callFunctionDeleteFile={handleResetModal}
                                    importFile={handleUploadFile}
                                />
                            </div>
                            {
                                !(state.taskData && state.taskData.length > 0 && !currentMessageError) && !isFirstInitialRender &&
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
