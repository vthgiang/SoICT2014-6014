import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, SlimScroll } from '../../../../common-components';
import { configTaskTempalte } from './fileConfigurationImportTaskTemplate';
import XLSX from 'xlsx';
import { LOCAL_SERVER_API } from '../../../../env';
import {taskTemplateActions} from '../redux/actions'
class TaskTemplateImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowEror: [],
            importData: [],
            configData: this.convertConfigurationToString(configTaskTempalte),
            importConfiguration: null,
            page: 0
        };
    }

    // Chuyển đổi dữ liệu file cấu hình để truyền vào state (rồi truyền vào textarea);
    convertConfigurationToString = (data) => {
        let sheets = data.sheets, bonus = data.bonus;
        if (sheets.length > 1) {
            sheets = sheets.map(x => `"${x}"`);
            sheets = sheets.join(', ');
        } else sheets = `"${sheets}"`
        // if (bonus.length > 1) {
        //     bonus = bonus.map(x => `"${x}"`);
        //     bonus = bonus.join(', ');
        // } else bonus = `"${bonus}"`
        let stringData = `{
            "${'Số dòng tiêu đề của bảng'}": ${data.rowHeader},
            "${"Tên các sheet"}": [${sheets}],
            "${"Tên tiêu đề ứng với đơn vị"}": "${data.unit}",
            "${"Tên tiêu để ứng với người được xem"}": "${data.viewer}",
            "${"Tên tiêu để ứng với tên mẫu"}": "${data.name}",
            "${"Tên tiêu để ứng với độ ưu tiên"}": "${data.priority}",
            "${"Tên tiêu để ứng với mô tả"}": "${data.description}",
            "${"Tên tiêu để ứng với người thực hiện"}": "${data.responsibleEmployees}",
            "${"Tên tiêu để ứng với người phê duyệt"}": "${data.accountableEmployees}",
            "${"Tên tiêu để ứng với người hỗ trợ"}": "${data.consultedEmployees}",
            "${"Tên tiêu để ứng với người quan sát"}": "${data.informedEmployees}",
            "${"Tên tiêu để ứng với công thức tính điểm"}": "${data.formula}",
            "${"Tên tiêu để ứng với danh sách hoạt động"}": "${data.taskActions}",
            "${"Tên tiêu để ứng với mô tả"}": "${data.descriptionTaskAction}",
            "${"Tên tiêu để ứng với bắt buộc"}": "${data.mandatory}",
            "${"Tên tiêu để ứng với danh sách thông tin"}": "${data.taskInformation}",
            "${"Tên tiêu để ứng với tên thông tin"}": "${data.nameTaskInformation}",
            "${"Tên tiêu để ứng với mô tả thông tin"}": "${data.descriptionTaskInformation}",
            "${"Tên tiêu để ứng với kiểu dữ liệu"}": "${data.typeTaskInformation}",
            "${"Tên tiêu để ứng với chỉ quản lí được điền"}": "${data.onlyManager}",
        }`
        console.log('ssss', stringData);
        return stringData;
    }
    convertStringToObject = (data) => {
        try {
            console.log(data);
            data = data.substring(1, data.length - 1); // xoá dấu "{" và "}"" ở đầu và cuối String
            data = data.split(',').map(x => x.trim()); // xoá các space dư thừa
            data = data.join(',');
            if (data[data.length - 1] === ',') {    // xoá dấu "," nếu tồn tại ở cuối chuỗi để chuyển đổi dc về dạng string
                data = data.substring(0, data.length - 1);
            }
            console.log(data);
            data = JSON.parse(`{${data}}`);
            let obj = {};
            console.log(obj);
            for (let index in data) {
                if (index === "Số dòng tiêu đề của bảng") obj = { ...obj, rowHeader: data[index] };
                if (index === "Tên các sheet") obj = { ...obj, sheets: data[index] };
                if (index === "Tên tiêu đề ứng với đơn vị") obj = { ...obj, unit: data[index] };
                if (index === "Tên tiêu để ứng với người được xem") obj = { ...obj, viewer: data[index] };
                if (index === "Tên tiêu để ứng với tên mẫu") obj = { ...obj, name: data[index] };
                if (index === "Tên tiêu để ứng với độ ưu tiên") obj = { ...obj, priority: data[index] };
                if (index === "Tên tiêu để ứng với mô tả") obj = { ...obj, description: data[index] };
                if (index === "Tên tiêu để ứng với người thực hiện") obj = { ...obj, responsibleEmployees: data[index] };
                if (index === "Tên tiêu để ứng với người phê duyệt") obj = { ...obj, accountableEmployees: data[index] };
                if (index === "Tên tiêu để ứng với người hỗ trợ") obj = { ...obj, consultedEmployees: data[index] };
                if (index === "Tên tiêu để ứng với người quan sát") obj = { ...obj, informedEmployees: data[index] };
                if (index === "Tên tiêu để ứng với công thức tính điểm") obj = { ...obj, formula: data[index] };
                if (index === "Tên tiêu để ứng với danh sách hoạt động") obj = { ...obj, nameTaskActions: data[index] };
                if (index === "Tên tiêu để ứng với mô tả") obj = { ...obj, descriptionTaskAction: data[index] };
                if (index === "Tên tiêu để ứng với bắt buộc") obj = { ...obj, mandatory: data[index] };
                if (index === "Tên tiêu để ứng với danh sách thông tin") obj = { ...obj, taskInformation: data[index] };
                if (index === "Tên tiêu để ứng với tên thông tin") obj = { ...obj, nameTaskInformation: data[index] };
                if (index === "Tên tiêu để ứng với mô tả thông tin") obj = { ...obj, descriptionTaskInformation: data[index] };
                if (index === "Tên tiêu để ứng với kiểu dữ liệu") obj = { ...obj, typeTaskInformation: data[index] };
                if (index === "Tên tiêu để ứng với chỉ quản lí được điền") obj = { ...obj, onlyManager: data[index] }
            }
            return obj
        } catch (error) {
            return null
        }
    }
    // bắt sự kiện thay đổi trong text area
    handleChange = (e) => {
        const { value } = e.target;
        this.setState({
            configData: value,
            importConfiguration: this.convertStringToObject(value) !== null ?
                this.convertStringToObject(value) : this.state.importConfiguration,
        })
    }

    handleChangeFile = (e) => {
        const { importConfiguration } = this.state;
        let configData = importConfiguration !== null ? importConfiguration : configTaskTempalte;
        let sheets = configData.sheets;
        let file = e.target.files[0];

        if (file !== undefined) {
            const reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = (evt) => {
                let sheet_lists = [];
                const fileImport = evt.target.result;
                const workbook = XLSX.read(fileImport, { type: 'binary' });
                // lấy danh sách các sheet của file import
                let sheet_name_list = workbook.SheetNames;
                // kiểm tra lọc các sheet tồn tại mà người dùng muốn import
                for (let n in sheets) {
                    sheet_lists = sheet_lists.concat(sheet_name_list.filter(x => x.trim().toLowerCase() === sheets[n].trim().toLowerCase()));
                }
                let importData = []; let rowError = [];
                sheet_lists.length !== 0 && sheet_lists.forEach(x => {
                    let data = XLSX.utils.sheet_to_json(workbook.Sheets[x], { header: 1, blankrows: true, defval: null });
                    console.log(data);
                    var indexUnit, indexViewer, indexName, indexPriority, indexDescription, indexResponsibleEmployees, indexAccountableEmployee,
                        indexConsultedEmpoloyees, indexInformedEmployees, indexFormula, indexTaskAction, indexDescriptionTaskAction, indexMandatory, indexTaskInformation,
                        indexNameTaskInformation, indexDescriptionTaskInformation, indexTypeTaskInformation, indexOnlyManager, indexNameTaskAction;

                    // lấy index của các tiều đề cột mà người dùng muốn import
                    for (let i = 0; i < Number(configData.rowHeader); i++) {
                        data[i].forEach((x, index) => {
                            if (x !== null) {
                                if (x.trim().toLowerCase() === configData.unit.trim().toLowerCase())
                                    indexUnit = index;
                                if (x.trim().toLowerCase() === configData.viewer.trim().toLowerCase())
                                    indexViewer = index;
                                if (x.trim().toLowerCase() === configData.name.trim().toLowerCase()) {
                                    indexName = index;
                                }
                                if (x.trim().toLowerCase() === configData.priority.trim().toLowerCase()) {
                                    indexPriority = index;
                                }
                                if (x.trim().toLowerCase() === configData.description.trim().toLowerCase()) {
                                    indexDescription = index;
                                }
                                if (x.trim().toLowerCase() === configData.responsibleEmployees.trim().toLowerCase()) {
                                    indexResponsibleEmployees = index;
                                }
                                if (x.trim().toLowerCase() === configData.accountableEmployees.trim().toLowerCase()) {
                                    indexAccountableEmployee = index;
                                }
                                if (x.trim().toLowerCase() === configData.consultedEmployees.trim().toLowerCase()) {
                                    indexConsultedEmpoloyees = index;
                                }
                                if (x.trim().toLowerCase() === configData.informedEmployees.trim().toLowerCase()) {
                                    indexInformedEmployees = index;
                                }
                                if (x.trim().toLowerCase() === configData.formula.trim().toLowerCase()) {
                                    indexFormula = index;
                                }
                                if (x.trim().toLowerCase() === configData.taskActions.trim().toLowerCase()) {
                                    indexTaskAction = index;
                                }
                                if (x.trim().toLowerCase() === configData.nameTaskActions.trim().toLowerCase()) {
                                    indexNameTaskAction = index;
                                }
                                if (x.trim().toLowerCase() === configData.taskInformation.trim().toLowerCase()) {
                                    indexTaskInformation = index;
                                }
                                if (x.trim().toLowerCase() === configData.nameTaskInformation.trim().toLowerCase()) {
                                    indexNameTaskInformation = index;
                                }
                                if (x.trim().toLowerCase() === configData.descriptionTaskAction.trim().toLowerCase()) {
                                    indexDescriptionTaskAction = index;
                                }
                                if (x.trim().toLowerCase() === configData.mandatory.trim().toLowerCase()) {
                                    indexMandatory = index;
                                }
                                if (x.trim().toLowerCase() === configData.typeTaskInformation.trim().toLowerCase()) {
                                    indexTypeTaskInformation = index;
                                }
                                if (x.trim().toLowerCase() === configData.onlyManager.trim().toLowerCase()) {
                                    indexOnlyManager = index;
                                }
                                if (x.trim().toLowerCase() === configData.descriptionTaskInformation.trim().toLowerCase()) {
                                    indexDescriptionTaskInformation = index;
                                }
                            }
                        }
                        )
                    }
                    // convert dữ liệu thành dạng array json mong muốn để gửi lên server

                    data.splice(0, Number(configData.rowHeader));
                    console.log("eer", data);
                    let dataConvert = [];
                    let unit, name, priority, description, formula;
                    let viewer = [], responsibleEmployees = [], consultedEmployees = [], informedEmployees = [],
                        accountableEmployees = [], taskActions = [], nameTaskAction, descriptionTaskAction, mandatory, taskInformation = [],
                        nameTaskInformation, descriptionTaskInformation, typeTaskInformation, onlyManager;
                    let taskActionChange = false, taskInforChange = false;
                    for (let i = 0; i < data.length; i++) {

                        if (data[i][indexName] !== null) {

                            unit = data[i][indexUnit];
                            name = data[i][indexName];
                            priority = data[i][indexPriority];
                            description = data[i][indexDescription];
                            formula = data[i][indexFormula];

                            viewer.push(data[i][indexViewer]);
                            responsibleEmployees.push(data[i][indexResponsibleEmployees]);
                            accountableEmployees.push(data[i][indexAccountableEmployee]);
                            consultedEmployees.push(data[i][indexConsultedEmpoloyees]);
                            informedEmployees.push(data[i][indexInformedEmployees]);

                            nameTaskAction = data[i][indexNameTaskAction];
                            descriptionTaskAction = data[i][indexDescriptionTaskAction];
                            mandatory = data[i][indexMandatory];
                            taskActions = [...taskActions, { nameTaskAction, descriptionTaskAction, mandatory }];

                            if (data[i][indexNameTaskInformation]) {
                                nameTaskInformation = data[i][indexNameTaskInformation];
                                descriptionTaskInformation = data[i][indexDescriptionTaskInformation];
                                typeTaskInformation = data[i][indexTypeTaskInformation];
                                onlyManager = data[i][indexOnlyManager];
                                taskInformation = [...taskInformation, { nameTaskInformation, descriptionTaskInformation, typeTaskInformation, onlyManager }]
                            }

                        } else {
                            if (data[i][indexViewer] !== null) viewer.push(data[i][indexViewer]);
                            if (data[i][indexResponsibleEmployees] !== null)
                                responsibleEmployees.push(data[i][indexResponsibleEmployees]);
                            if (data[i][indexAccountableEmployee])
                                accountableEmployees.push(data[i][indexAccountableEmployee]);
                            if (data[i][indexConsultedEmpoloyees])
                                consultedEmployees.push(data[i][indexConsultedEmpoloyees]);
                            if (data[i][indexInformedEmployees])
                                informedEmployees.push(data[i][indexInformedEmployees]);

                            if (data[i][indexNameTaskAction]) {
                                nameTaskAction = data[i][indexNameTaskAction];
                                descriptionTaskAction = data[i][indexDescriptionTaskAction];
                                mandatory = data[i][indexMandatory];
                                taskActionChange = true;
                                taskActions = [...taskActions, { nameTaskAction, descriptionTaskAction, mandatory }];
                            }

                            if (data[i][indexNameTaskInformation]) {
                                nameTaskInformation = data[i][indexNameTaskInformation];
                                descriptionTaskInformation = data[i][indexDescriptionTaskInformation];
                                typeTaskInformation = data[i][indexTypeTaskInformation];
                                onlyManager = data[i][indexOnlyManager];
                                taskInforChange = true;
                                taskInformation = [...taskInformation, { nameTaskInformation, descriptionTaskInformation, typeTaskInformation, onlyManager }]
                            }

                        }
                        // console.log('conee', dataConvert);
                        // console.log('action',taskActions);
                        //console.log(data[i + 1][indexName]);
                        if (i + 1 < data.length) {
                            console.log('rer',data[i + 1][indexName]);
                            if (data[i + 1][indexName] !== null) {
                                dataConvert = [...dataConvert, { unit, viewer, name, priority, description, responsibleEmployees, accountableEmployees, consultedEmployees, informedEmployees, formula, taskActions, taskInformation }]
                               console.log('ddd',dataConvert);
                               viewer = []; responsibleEmployees = []; consultedEmployees = []; informedEmployees = [];
                        accountableEmployees = []; taskActions = []; taskInformation = [];
                            }

                        }
                    }
                    dataConvert = [...dataConvert, { unit, viewer, name, priority, description, responsibleEmployees, accountableEmployees, consultedEmployees, informedEmployees, formula, taskActions, taskInformation }]
                            
                    console.log('eee',dataConvert);
                    // console.log('view', viewer);
                    // console.log('tee',taskActions)
                    importData = importData.concat(dataConvert);
                })
                console.log(importData);
                
                this.setState({
                    importData: importData,
                   // rowError: rowError
                })
            }
        }
    }

    render() {
        let { importConfiguration, configData } = this.state;
        console.log(this.state);
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal_import_file`} isLoading={false}
                    formID={`form_import_file`}
                    title="Thêm mẫu công việc bằng import file excel"
                    func={this.save}
                    disableSubmit={false}
                    size={75}
                >
                    <form className="form-group" id={`form_import_file`}>
                        <div>
                            <button type="button" data-toggle="collapse" data-target="#confic_import_file" className="pull-right" ><i className="fa fa-gear" style={{ fontSize: "19px" }}></i></button>
                            <div id="confic_import_file" className="box box-solid box-default collapse col-sm-12 col-xs-12" style={{ padding: 0 }}>
                                <div className="box-header with-border">
                                    <h3 className="box-title">Cấu hình file import</h3>
                                    <div className="box-tools pull-right">
                                        <button type="button" className="btn btn-box-tool" data-toggle="collapse"
                                            data-target={`#confic_import_file`} ><i className="fa fa-times"></i></button>
                                    </div>
                                </div>
                                <div className="box-body row">
                                    <div className="form-group col-sm-12 col-xs-12">
                                        <textarea className="form-control" rows="8" name="reason"
                                            value={configData} onChange={this.handleChange}></textarea>
                                    </div>
                                    {
                                        importConfiguration !== null && (
                                            <div className="form-group col-sm-12 col-xs-12">
                                                <label>Cấu hình file import của bạn như sau:</label><br />
                                                <span>File import có</span>
                                                <span className="text-success" style={{ fontWeight: "bold" }}>&nbsp;{importConfiguration.rowHeader}&nbsp;</span>
                                                <span>dòng tiêu đề và đọc dữ liệu các sheet: </span>
                                                <span className="text-success" style={{ fontWeight: "bold" }}>&nbsp;{importConfiguration.sheets.length > 1 ? importConfiguration.sheets.join(', ') : importConfiguration.sheets}</span>

                                                <div id="croll-table" style={{ marginTop: 5 }}>
                                                    <table id="importConfig" className="table table-bordered table-striped table-hover">
                                                        <thead>
                                                            <tr>
                                                                <th>Tên các thuộc tính</th>
                                                                <th>Đơn vị</th>
                                                                <th>Người được xem</th>
                                                                <th>Tên mẫu</th>
                                                                <th>Độ ưu tiên</th>
                                                                <th>Mô tả</th>
                                                                <th>Người thực hiện</th>
                                                                <th>Người phê duyệt</th>
                                                                <th>Người hỗ trợ</th>
                                                                <th>Người quan sát</th>
                                                                <th>Công thức tính điểm</th>
                                                                <th>Danh sách hoạt động</th>
                                                                <th>Tên hoạt động</th>
                                                                <th>Mô tả</th>
                                                                <th>Bắt buộc</th>
                                                                <th>Danh sách thông tin</th>
                                                                <th>Tên thông tin</th>
                                                                <th>Mô tả thông tin</th>
                                                                <th>Kiểu dữ liệu</th>
                                                                <th>Chỉ quản lí được điền</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <th>Tiêu đề tương ứng</th>
                                                                <td>{importConfiguration.unit}</td>
                                                                <td>{importConfiguration.viewer}</td>
                                                                <td>{importConfiguration.name}</td>
                                                                <td>{importConfiguration.priority}</td>
                                                                <td>{importConfiguration.description}</td>
                                                                <td>{importConfiguration.responsibleEmployees}</td>
                                                                <td>{importConfiguration.accountableEmployees}</td>
                                                                <td>{importConfiguration.consultedEmployees}</td>
                                                                <td>{importConfiguration.informedEmployees}</td>
                                                                <td>{importConfiguration.formula}</td>
                                                                <td>{importConfiguration.taskActions}</td>
                                                                <td>{importConfiguration.nameTaskActions}</td>
                                                                <td>{importConfiguration.descriptionTaskAction}</td>
                                                                <td>{importConfiguration.mandatory}</td>
                                                                <td>{importConfiguration.taskInformation}</td>
                                                                <td>{importConfiguration.nameTaskActions}</td>
                                                                <td>{importConfiguration.descriptionTaskAction}</td>
                                                                <td>{importConfiguration.typeTaskInformation}</td>
                                                                <td>{importConfiguration.onlyManager}</td>


                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )
                                    }
                                    <SlimScroll outerComponentId="croll-table" innerComponentId="importConfig" innerComponentWidth={1000} activate={true} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-md-4 col-xs-12">
                                    <label>File excel cần import</label>
                                    <input type="file" className="form-control"
                                        accept=".xlms,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                        onChange={this.handleChangeFile} />
                                </div>
                                <div className="form-group col-md-4 col-xs-12">
                                    <label></label>
                                    <a className='pull-right' href={LOCAL_SERVER_API + configTaskTempalte.file.fileUrl} target="_blank" style={{ paddingTop: 15 }}
                                        download={configTaskTempalte.file.fileName}><i className="fa fa-download"> &nbsp;Download file import mẫu!</i></a>
                                </div>

                                {/* <div className="form-group col-md-12 col-xs-12">
                                {
                                    importDataCurrentPage.length !== 0 && (
                                        <React.Fragment>
                                            {rowError.length !== 0 && (
                                                <React.Fragment>
                                                    <span style={{ fontWeight: "bold", color: "red" }}>Có lỗi xảy ra ở các dòng: {rowError.join(', ')}</span>
                                                </React.Fragment>
                                            )}
                                            <div id="croll-table-import">
                                                <table id="importData" className="table table-striped table-bordered table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>STT</th>
                                                            <th>Mã số nhân viên</th>
                                                            <th>Tên nhân viên</th>
                                                            <th>Tiền lương chính</th>
                                                            {otherSalary.length !== 0 &&
                                                                otherSalary.map((x, index) => (
                                                                    <React.Fragment key={index}>
                                                                        <th>{x}</th>
                                                                    </React.Fragment>
                                                                ))
                                                            }
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            importDataCurrentPage.map((x, index) => {
                                                                return (
                                                                    <tr key={index} style={x.error ? { color: "#dd4b39" } : { color: '' }} title={x.errorAlert.join(', ')}>
                                                                        <td>{page + index + 1}</td>
                                                                        <td>{x.employeeNumber}</td>
                                                                        <td>{x.employeeName}</td>
                                                                        <td>{formater.format(parseInt(x.mainSalary))}</td>
                                                                        {otherSalary.length !== 0 &&
                                                                            otherSalary.map((y, index) => {
                                                                                let number = null;
                                                                                x.bonus.forEach(b => {
                                                                                    if (y.trim().toLowerCase() === b.nameBonus.trim().toLowerCase()) {
                                                                                        number = formater.format(parseInt(b.number))
                                                                                    }
                                                                                })
                                                                                return <td>{number}</td>
                                                                            })
                                                                        }
                                                                    </tr>
                                                                )
                                                            })
                                                        }

                                                    </tbody>
                                                </table>
                                            </div>

                                        </React.Fragment>
                                    )}
                            </div> */}
                                <SlimScroll outerComponentId="croll-table-import" innerComponentId="importData" innerComponentWidth={1000} activate={true} />
                                {/* <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} /> */}
                            </div>
                        </div>
                    </form>


                </DialogModal>
            </React.Fragment>
        )
    }
};

function mapState(state) {
    const { taskTemplate } = state;
    return { taskTemplate };
};
const actionCreators = {
    importTaskTemplate: taskTemplateActions.importTaskTemplate
};
const importFileExcel = connect(mapState, actionCreators)(withTranslate(TaskTemplateImportForm));
export { importFileExcel as TaskTemplateImportForm };