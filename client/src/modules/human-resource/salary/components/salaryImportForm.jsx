import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, SlimScroll, PaginateBar, DatePicker } from '../../../../common-components';
import { configurationSalary } from './fileConfigurationImportSalary';
import { LOCAL_SERVER_API } from '../../../../env';

import XLSX from 'xlsx';
import { SalaryActions } from '../redux/actions';

class SalaryImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowError: [],
            importData: [],
            month: null,
            configData: this.convertConfigurationToString(configurationSalary),
            importConfiguration: null,
            limit: 100,
            page: 0
        };
    }
    componentDidUpdate() {
        const { salary } = this.props;
        salary.importStatus && window.$(`#modal_import_file`).modal("hide");
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        if (monthYear === true) {
            return [month, year].join('-');
        } else return [day, month, year].join('-');
    }

    // Chuyển đổi dữ liệu file cấu hình để truyền vào state (rồi truyền vào textarea);
    convertConfigurationToString = (data) => {
        let sheets = data.sheets, bonus = data.bonus;
        if (sheets.length > 1) {
            sheets = sheets.map(x => `"${x}"`);
            sheets = sheets.join(', ');
        } else sheets = `"${sheets}"`
        if (bonus.length > 1) {
            bonus = bonus.map(x => `"${x}"`);
            bonus = bonus.join(', ');
        } else bonus = `"${bonus}"`
        let stringData = `{
            "${"Số dòng tiêu đề của bảng"}": ${data.rowHeader},
            "${"Tên các sheet"}": [${sheets}],
            "${"Tên tiêu đề ứng với mã số nhân viên"}": "${data.employeeNumber}",
            "${"Tên tiêu để ứng với họ và tên"}": "${data.employeeName}",
            "${"Tên tiêu để ứng với tiền lương chính"}": "${data.mainSalary}",
            "${"Tên tiêu để ứng với lương thưởng khác"}": [${bonus}]
        }`
        return stringData;
    }

    // Chuyển đổi dữ liệu người dùng nhập vào ở textarea thành object để xử lý logic
    convertStringToObject = (data) => {
        try {
            data = data.substring(1, data.length - 1); // xoá dấu "{" và "}"" ở đầu và cuối String
            data = data.split(',').map(x => x.trim()); // xoá các space dư thừa
            data = data.join(',');
            if (data[data.length - 1] === ',') {    // xoá dấu "," nếu tồn tại ở cuối chuỗi để chuyển đổi dc về dạng string
                data = data.substring(0, data.length - 1);
            }
            data = JSON.parse(`{${data}}`);
            let obj = {};
            for (let index in data) {
                if (index === "Số dòng tiêu đề của bảng") obj = { ...obj, rowHeader: data[index] };
                if (index === "Tên các sheet") obj = { ...obj, sheets: data[index] };
                if (index === "Tên tiêu đề ứng với mã số nhân viên") obj = { ...obj, employeeNumber: data[index] };
                if (index === "Tên tiêu để ứng với họ và tên") obj = { ...obj, employeeName: data[index] };
                if (index === "Tên tiêu để ứng với tiền lương chính") obj = { ...obj, mainSalary: data[index] };
                if (index === "Tên tiêu để ứng với lương thưởng khác") obj = { ...obj, bonus: data[index] };
            }
            return obj
        } catch (error) {
            return null
        }
    }

    // bắt sự kiện thay đổi tháng lương
    handleMonthChange = (value) => {
        const { salary } = this.props;
        let partMonth = value.split('-'), rowError = [], importData = [];
        value = [partMonth[1], partMonth[0]].join('-');
        if (salary.error.rowError !== undefined) {
            rowError = salary.error.rowError;
            importData = salary.error.data;
            importData = importData.map((x, index) => {
                if (x.errorAlert.find(y => y = "month_salary_have_exist") !== undefined) {
                    x.errorAlert = x.errorAlert.filter(y => y !== "month_salary_have_exist");
                    x.error = false;
                    rowError = rowError.filter(y => y !== index);
                }
                return x;
            })
            this.setState({
                ...this.state,
                importData: importData,
                rowError: rowError,
                changeMonth: true,
            })
        }
        this.setState({
            ...this.state,
            month: value,
        });
    }
    // bắt sự kiện thay đổi (textarea);
    handleChange = (e) => {
        const { value } = e.target;
        this.setState({
            configData: value,
            importConfiguration: this.convertStringToObject(value) !== null ?
                this.convertStringToObject(value) : this.state.importConfiguration,
        })
    }
    // bắt xự kiện chọn file import
    handleChangeFileImport = (e) => {
        const { importConfiguration } = this.state;
        let configData = importConfiguration !== null ? importConfiguration : configurationSalary;
        let sheets = configData.sheets;
        let file = e.target.files[0];

        if (file !== undefined) {
            const reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = (evt) => {
                let sheet_lists = [];
                const fileImport = evt.target.result;
                const workbook = XLSX.read(fileImport, { type: 'binary' });
                //lấy danh sách các sheet của file import
                let sheet_name_list = workbook.SheetNames;
                // kiểm tra lọc lấy các sheet tồn tại mà người dùng muốn import
                for (let n in sheets) {
                    sheet_lists = sheet_lists.concat(sheet_name_list.filter(x => x.trim().toLowerCase() === sheets[n].trim().toLowerCase()));
                }
                let importData = [], rowError = [];
                sheet_lists.length !== 0 && sheet_lists.forEach(x => {
                    let data = XLSX.utils.sheet_to_json(workbook.Sheets[x], { header: 1, blankrows: true, defval: null });
                    var indexEmployeeName, indexEmployeenumber, indexMainSalary, indexBouns = [];
                    // lấy index của các tiều đề cột mà người dùng muốn import
                    for (let i = 0; i < Number(configData.rowHeader); i++) {
                        data[i].forEach((x, index) => {
                            if (x !== null) {
                                if (x.trim().toLowerCase() === configData.employeeName.trim().toLowerCase())
                                    indexEmployeeName = index;
                                if (x.trim().toLowerCase() === configData.employeeNumber.trim().toLowerCase())
                                    indexEmployeenumber = index;
                                if (x.trim().toLowerCase() === configData.mainSalary.trim().toLowerCase()) {
                                    indexMainSalary = index;
                                }
                                configData.bonus.forEach((y, n) => {
                                    if (x.trim().toLowerCase() === y.trim().toLowerCase()) {
                                        indexBouns[n] = index
                                    }
                                })
                            }
                        }
                        )
                    }

                    // convert dữ liệu thành dạng array json mong muốn để gửi lên server
                    data.splice(0, Number(configData.rowHeader));
                    let dataConvert = [];
                    data.forEach(x => {
                        if (x[indexEmployeenumber] !== null) {
                            let mainSalary = x[indexMainSalary];
                            let employeeNumber = x[indexEmployeenumber];
                            let employeeName = x[indexEmployeeName];
                            let bonus = [];
                            indexBouns.forEach((y, indexs) => {
                                if (x[y] !== null) {
                                    bonus = [...bonus, { nameBonus: configData.bonus[indexs], number: Number(x[y]) }]
                                }

                            })
                            dataConvert = [...dataConvert, { mainSalary, employeeNumber, employeeName, bonus }]
                        }
                    })
                    importData = importData.concat(dataConvert);
                })

                // check dữ liệu import có hợp lệ hay không
                let checkImportData = importData;
                importData = importData.map((x, index) => {
                    let errorAlert = [];
                    if (x.employeeNumber === null || x.employeeName === null || checkImportData.filter(y => y.employeeNumber === x.employeeNumber).length > 1) {
                        rowError = [...rowError, index + 1]
                        x = { ...x, error: true }
                    }
                    if (x.employeeNumber === null) {
                        errorAlert = [...errorAlert, 'Mã nhân viên không được để trống'];
                    } else {
                        if (checkImportData.filter(y => y.employeeNumber === x.employeeNumber).length > 1)
                            errorAlert = [...errorAlert, 'Mã nhân viên bị trùng lặp'];
                    };
                    if (x.employeeName === null)
                        errorAlert = [...errorAlert, 'Tên nhân viên không được để trống'];

                    x = { ...x, errorAlert: errorAlert }
                    return x;
                })

                this.setState({
                    importData: importData,
                    rowError: rowError
                })
            };
        }
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * (this.state.limit);
        await this.setState({
            page: parseInt(page),
        });
    }

    isFormValidated = () => {
        let { rowError, month, importData, changeMonth } = this.state;
        const { salary } = this.props;
        if (salary.error.rowError !== undefined && changeMonth === false) {
            rowError = salary.error.rowError;
            importData = salary.error.data
        }
        if (rowError.length === 0 && month !== null && importData.length !== 0) {
            return true
        } return false
    }

    save = () => {
        let { importData, month } = this.state;
        importData = importData.map(x => ({ ...x, month: month }));
        this.props.importSalary(importData);
        this.setState({
            changeMonth: false
        })
    }

    render() {
        let formater = new Intl.NumberFormat();
        const { translate, salary } = this.props;
        let { importData, configData, importConfiguration, rowError, limit, page, changeMonth } = this.state;
        let otherSalary = importConfiguration !== null ? importConfiguration.bonus : configurationSalary.bonus;
        if (salary.error.rowError !== undefined && changeMonth === false) {
            rowError = salary.error.rowError;
            importData = salary.error.data
        }
        var pageTotal = (importData.length % limit === 0) ?
            parseInt(importData.length / limit) :
            parseInt((importData.length / limit) + 1);
        var currentPage = parseInt((page / limit) + 1);
        let importDataCurrentPage = importData.slice(page, page + limit);
        return (
            <React.Fragment>
                {/* {showButton && <ButtonModal modalID={`modal_import_file_${id}`} button_name="Import file excel" />} */}
                <DialogModal
                    modalID={`modal_import_file`} isLoading={false}
                    formID={`form_import_file`}
                    title='Thêm dữ liệu bằng việc Import file excel'
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    closeOnSave={false}
                    size={75}
                >
                    <form className="form-group" id={`form_import_file`}>
                        <button type="button" data-toggle="collapse" data-target="#confic_import_file" className="pull-right"
                            style={{ border: "none", background: "none", padding: 0 }}><i className="fa fa-gear" style={{ fontSize: "19px" }}></i></button>

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
                                                            <th>Mã số nhân viên</th>
                                                            <th>Tên nhân viên</th>
                                                            <th>Tiền lương chính</th>
                                                            {importConfiguration.bonus.length !== 0 &&
                                                                importConfiguration.bonus.map((x, index) => (
                                                                    <React.Fragment key={index}>
                                                                        <th>{x}</th>
                                                                    </React.Fragment>
                                                                ))
                                                            }
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <th>Tiêu đề tương ứng</th>
                                                            <td>{importConfiguration.employeeNumber}</td>
                                                            <td>{importConfiguration.employeeName}</td>
                                                            <td>{importConfiguration.mainSalary}</td>
                                                            {importConfiguration.bonus.length !== 0 &&
                                                                importConfiguration.bonus.map((x, index) => (
                                                                    <React.Fragment key={index}>
                                                                        <td>{x}</td>
                                                                    </React.Fragment>
                                                                ))
                                                            }
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
                                <label>Tháng lương</label>
                                <DatePicker
                                    id="month_Salary"
                                    dateFormat="month-year"
                                    value=""
                                    onChange={this.handleMonthChange}
                                />
                            </div>
                            <div className="form-group col-md-4 col-xs-12">
                                <label>File excel cần import</label>
                                <input type="file" className="form-control"
                                    accept=".xlms,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    onChange={this.handleChangeFileImport} />
                            </div>
                            <div className="form-group col-md-4 col-xs-12">
                                <label></label>
                                <a className='pull-right' href={LOCAL_SERVER_API + configurationSalary.file.fileUrl} target="_blank" style={{ paddingTop: 15 }}
                                    download={configurationSalary.file.fileName}><i className="fa fa-download"> &nbsp;Download file import mẫu!</i></a>
                            </div>

                            <div className="form-group col-md-12 col-xs-12">
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
                            </div>
                            <SlimScroll outerComponentId="croll-table-import" innerComponentId="importData" innerComponentWidth={1000} activate={true} />
                            <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
};

function mapState(state) {
    const { salary } = state;
    return { salary };
};

const actionCreators = {
    importSalary: SalaryActions.importSalary,
};

const importExcel = connect(mapState, actionCreators)(withTranslate(SalaryImportForm));
export { importExcel as SalaryImportForm };