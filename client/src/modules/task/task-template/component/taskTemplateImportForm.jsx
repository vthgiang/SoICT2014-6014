import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal,SlimScroll } from '../../../../common-components';
import {configTaskTempalte} from './fileConfigurationImportTaskTemplate';
import XLSX from 'xlsx';
class TaskTemplateImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowEror : [],
            importData: [],
            configData : this.convertConfigurationToString(configTaskTempalte),
            importConfiguration : null
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
            "${"Tên tiêu để ứng với người được xem"}": "${data.viewerPeople}",
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
        console.log('ssss',stringData);
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
                if (index === "Tên tiêu để ứng với người được xem") obj = { ...obj, viewerPeople: data[index] };
                if (index === "Tên tiêu để ứng với tên mẫu") obj = { ...obj, name: data[index] };
                if (index === "Tên tiêu để ứng với độ ưu tiên") obj = { ...obj, priority: data[index] };
                if (index === "Tên tiêu để ứng với mô tả") obj = { ...obj, description : data[index] };
                if (index === "Tên tiêu để ứng với người thực hiện") obj = { ...obj,responsibleEmployees : data[index] };
                if (index === "Tên tiêu để ứng với người phê duyệt") obj = { ...obj, accountableEmployees : data[index] };
                if (index === "Tên tiêu để ứng với người hỗ trợ") obj = { ...obj, consultedEmployees: data[index] };
                if (index === "Tên tiêu để ứng với người quan sát") obj = { ...obj, informedEmployees : data[index] };
                if (index === "Tên tiêu để ứng với công thức tính điểm") obj = { ...obj, formula : data[index] };
                if (index === "Tên tiêu để ứng với danh sách hoạt động") obj = { ...obj, nameTaskActions: data[index] };
                if (index === "Tên tiêu để ứng với mô tả") obj = { ...obj,descriptionTaskAction : data[index] };
                if (index === "Tên tiêu để ứng với bắt buộc") obj = { ...obj, mandatory : data[index] };
                if (index === "Tên tiêu để ứng với danh sách thông tin") obj = { ...obj, taskInformation : data[index] };
                if (index === "Tên tiêu để ứng với tên thông tin") obj = { ...obj, nameTaskInformation : data[index] };
                if (index === "Tên tiêu để ứng với mô tả thông tin") obj = { ...obj, descriptionTaskInformation: data[index] };
                if (index === "Tên tiêu để ứng với kiểu dữ liệu") obj = { ...obj, typeTaskInformation : data[index] };
                if (index === "Tên tiêu để ứng với chỉ quản lí được điền") obj = { ...obj, onlyManager : data[index] }
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

    handleChangeFile =(e) =>{
        // let configData = this.state.configData;
        // let sheets = configData.sheets;
        // let file = e.target.files[0];
        
        // if(file !== undefined){
        //     const reader = new FileReader();
        //     reader.readAsArrayBuffer(file);
        //     reader.onload = (evt) =>{
        //         let sheet_lists = [];
        //         const fileImport = evt.target.result;
        //         const workbook = XLSX.read(fileImport, {type: 'binary'});
        //         // lấy danh sách các sheet của file import
        //         let sheet_name_list = workbook.SheetNames;
        //         // kiểm tra lọc các sheet tồn tại mà người dùng muốn import
        //         for(let n in sheets){
        //             sheet_lists = sheet_lists.concat(sheet_name_list.filter(x=> x.trim().toLowerCase()=== sheets[n].trim().toLowerCase()));
        //         }
        //         let importData = []; rowError = [];
        //         sheets_lists.length !== 0 && sheet_lists.forEach(x=>{
        //             let data = XLSX.utils.sheet_to_json(workbook.Sheets[x],{header: 1, blankrows: true, defval: null});
        //             var indexEmployeeName, indexEmployeenumber,
        //         })
                
        //     }
        // }
    }

    render() {
        let {importConfiguration, configData} = this.state;
        console.log(importConfiguration);
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
                                                            <td>{importConfiguration.viewerPeople}</td>
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
                        </div>
                    </form>


                </DialogModal>
            </React.Fragment>
        )
    }
};
const importFileExcel = connect(null, null)(withTranslate(TaskTemplateImportForm));
export { importFileExcel as TaskTemplateImportForm };