import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, SlimScroll, PaginateBar, DatePicker } from '../../../../common-components';

import { LOCAL_SERVER_API } from '../../../../env';
import { configurationTimesheets } from './fileConfigurationImportTimesheets';

import { TimesheetsActions } from '../redux/actions';

import XLSX from 'xlsx';

class TimesheetsImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowError: [],
            importData: [],
            month: null,
            configData: this.convertConfigurationToString(configurationTimesheets),
            importConfiguration: configurationTimesheets,
            limit: 50,
            page: 0
        };
    }
    componentDidUpdate() {
        const { timesheets } = this.props;
        timesheets.importStatus && window.$(`#modal_import_file`).modal("hide");
    }

    // Function lấy danh sách các ngày trong tháng
    getAllDayOfMonth = (month) => {
        let partMonth = month.split('-');
        let lastDayOfmonth = new Date(partMonth[1], partMonth[0], 0);
        let arrayDay = [], days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 1; i <= lastDayOfmonth.getDate(); i++) {
            let day = i;
            if (i.toString().length < 2)
                day = '0' + i;
            let date = new Date([partMonth[1], partMonth[0], day]);
            arrayDay = [...arrayDay, { day: days[date.getDay()], date: date.getDate() }]
        }
        return arrayDay
    }

    // Chuyển đổi dữ liệu file cấu hình để truyền vào state (rồi truyền vào textarea);
    convertConfigurationToString = (data) => {
        let sheets = data.sheets;
        if (sheets.length > 1) {
            sheets = sheets.map(x => `"${x}"`);
            sheets = sheets.join(', ');
        } else sheets = `"${sheets}"`
        let stringData = `{
            "${'Số dòng tiêu đề của bảng'}": ${data.rowHeader},
            "${'Tên các sheet'}": [${sheets}],
            "${'Tên tiêu đề ứng với mã số nhân viên'}": "${data.employeeNumber}",
            "${'Tên tiêu để ứng với họ và tên'}": "${data.employeeName}",
            "${'Tên tiêu để ứng với các ngày trong tháng'}": "${data.dateOfMonth}",
}`
        return stringData;
    }

    // Chuyển đổi dữ liệu người dùng nhập vào ở textarea thành object để xử lý logic
    convertStringToObject = (data) => {
        try {
            data = data.substring(1, data.length - 1); // Xoá dấu "{" và "}"" ở đầu và cuối String
            data = data.split(',').map(x => x.trim()); // Xoá các space dư thừa
            data = data.join(',');
            if (data[data.length - 1] === ',') {    // Xoá dấu "," nếu tồn tại ở cuối chuỗi để chuyển đổi dc về dạng string
                data = data.substring(0, data.length - 1);
            }
            data = JSON.parse(`{${data}}`);
            let obj = {};
            for (let index in data) {
                if (index === "Số dòng tiêu đề của bảng") obj = { ...obj, rowHeader: data[index] };
                if (index === "Tên các sheet") obj = { ...obj, sheets: data[index] };
                if (index === "Tên tiêu đề ứng với mã số nhân viên") obj = { ...obj, employeeNumber: data[index] };
                if (index === "Tên tiêu để ứng với họ và tên") obj = { ...obj, employeeName: data[index] };
                if (index === "Tên tiêu để ứng với các ngày trong tháng") obj = { ...obj, dateOfMonth: data[index] };
            }
            return obj
        } catch (error) {
            return null
        }
    }

    // Bắt sự kiện thay đổi tháng lương
    handleMonthChange = (value) => {
        const { timesheets, month } = this.props;
        let rowError = [], importData = [];
        if (timesheets.error.rowError !== undefined) {
            rowError = timesheets.error.rowError;
            importData = timesheets.error.data;
            console.log(importData);
            importData = importData.map((x, index) => {
                if (x.errorAlert.find(y => y === "month_timesheets_have_exist") !== undefined) {
                    console.log("adadawd")
                    x.errorAlert = x.errorAlert.filter(y => y !== "month_timesheets_have_exist");
                    x.error = false;
                    rowError = rowError.filter(y => y !== index + 1);
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

        let checkImportFile;
        if (value) {
            checkImportFile = true;
            let allDayOfMonth = this.getAllDayOfMonth(value);
            this.setState({
                ...this.state,
                month: value,
                allDayOfMonth: allDayOfMonth,
                checkImportFile: checkImportFile
            });
        } else {
            this.setState({
                ...this.state,
                month: value,
                checkImportFile: checkImportFile
            });
        }


    }
    // Bắt sự kiện thay đổi (textarea);
    handleChange = (e) => {
        const { value } = e.target;
        this.setState({
            configData: value,
            importConfiguration: this.convertStringToObject(value) !== null ?
                this.convertStringToObject(value) : this.state.importConfiguration,
        })
    }
    // Bắt xự kiện chọn file import
    handleChangeFileImport = (e) => {
        const { importConfiguration, allDayOfMonth } = this.state;
        let configData = importConfiguration !== null ? importConfiguration : configurationTimesheets;
        let sheets = configData.sheets;
        let file = e.target.files[0];

        if (file !== undefined) {
            const reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = (evt) => {
                let sheet_lists = [];
                const fileImport = evt.target.result;
                const workbook = XLSX.read(fileImport, { type: 'binary' });
                // Lấy danh sách các sheet của file import
                let sheet_name_list = workbook.SheetNames;
                // Kiểm tra lọc lấy các sheet tồn tại mà người dùng muốn import
                for (let n in sheets) {
                    sheet_lists = sheet_lists.concat(sheet_name_list.filter(x => x.trim().toLowerCase() === sheets[n].trim().toLowerCase()));
                }
                let importData = [], rowError = [];
                sheet_lists.length !== 0 && sheet_lists.forEach(x => {
                    let data = XLSX.utils.sheet_to_json(workbook.Sheets[x], { header: 1, blankrows: false, defval: null });
                    let indexEmployeeName, indexEmployeenumber, indexDateOfMonth;

                    // Lấy index của các tiều đề cột mà người dùng muốn import
                    for (let i = 0; i < Number(configData.rowHeader); i++) {
                        data[i].forEach((x, index) => {
                            if (x !== null && typeof x === 'string') {
                                if (x.trim().toLowerCase() === configData.employeeName.trim().toLowerCase())
                                    indexEmployeeName = index;
                                if (x.trim().toLowerCase() === configData.employeeNumber.trim().toLowerCase())
                                    indexEmployeenumber = index;
                                if (x.trim().toLowerCase() === configData.dateOfMonth.trim().toLowerCase()) {
                                    indexDateOfMonth = index;
                                }
                            }
                        }
                        )
                    }

                    // Convert dữ liệu thành dạng array json mong muốn để gửi lên server(hiện thi ra table)
                    data.splice(0, Number(configData.rowHeader));
                    let dataConvert = [];
                    data.forEach((x, indexs) => {
                        let workSession1 = [], workSession2 = [], employeeNumber, employeeName;
                        if (x[indexEmployeenumber] !== null || x[indexEmployeeName] !== null) {
                            employeeNumber = x[indexEmployeenumber];
                            employeeName = x[indexEmployeeName];
                            allDayOfMonth.forEach((y, index) => {
                                workSession1 = [...workSession1, x[indexDateOfMonth + index] ? true : false];
                            })
                            dataConvert = [...dataConvert, { workSession1, employeeNumber, employeeName }]
                        }
                        if (x[indexEmployeenumber] === null && x[indexEmployeeName] === null) {
                            allDayOfMonth.forEach((y, index) => {
                                workSession2 = [...workSession2, x[indexDateOfMonth + index] ? true : false];
                            })
                            dataConvert[dataConvert.length - 1] = { ...dataConvert[dataConvert.length - 1], workSession2 };
                        }
                    })
                    importData = importData.concat(dataConvert);
                })

                // Check dữ liệu import có hợp lệ hay không
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
        if (rowError.length === 0 && month && importData.length !== 0) {
            return true
        } return false
    }

    save = () => {
        let { importData, month } = this.state;
        let partMonth = month.split('-');
        let timesheetsMonth = [partMonth[1], partMonth[0]].join('-');
        importData = importData.map(x => ({ ...x, month: timesheetsMonth }));
        this.props.importTimesheets(importData);
        this.setState({
            changeMonth: false
        })
    }

    render() {
        const { translate, timesheets } = this.props;
        let { importData, configData, importConfiguration, rowError, limit, page, checkImportFile, changeMonth, allDayOfMonth } = this.state;
        if (timesheets.error.rowError !== undefined && changeMonth === false) {
            rowError = timesheets.error.rowError;
            importData = timesheets.error.data
        }
        console.log(importData);
        var pageTotal = (importData.length % limit === 0) ?
            parseInt(importData.length / limit) :
            parseInt((importData.length / limit) + 1);
        var currentPage = parseInt((page / limit) + 1);
        let importDataCurrentPage = importData.slice(page, page + limit);
        return (
            <React.Fragment>
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

                                            <div style={{ marginTop: 5 }}>
                                                <table className="table table-bordered table-striped table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>Tên các thuộc tính</th>
                                                            <th>Mã số nhân viên</th>
                                                            <th>Tên nhân viên</th>
                                                            <th>Các ngày trong tháng</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <th>Tiêu đề tương ứng</th>
                                                            <td>{importConfiguration.employeeNumber}</td>
                                                            <td>{importConfiguration.employeeName}</td>
                                                            <td>{importConfiguration.dateOfMonth}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-4 col-xs-12">
                                <label>Tháng lương</label>
                                <DatePicker
                                    id="import_timesheets"
                                    dateFormat="month-year"
                                    deleteValue={false}
                                    value=""
                                    onChange={this.handleMonthChange}
                                />
                            </div>
                            <div className="form-group col-md-4 col-xs-12">
                                <label>File excel cần import</label>
                                <input type="file" className="form-control" disabled={checkImportFile ? false : true}
                                    accept=".xlms,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    onChange={this.handleChangeFileImport} />
                            </div>
                            <div className="form-group col-md-4 col-xs-12">
                                <label></label>
                                <a className='pull-right' href={LOCAL_SERVER_API + configurationTimesheets.file.fileUrl} target="_blank" style={{ paddingTop: 15 }}
                                    download={configurationTimesheets.file.fileName}><i className="fa fa-download"> &nbsp;Download file import mẫu!</i></a>
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
                                                            <th style={{ width: 100 }}>Mã số nhân viên</th>
                                                            <th style={{ width: 100 }}>Tên nhân viên</th>
                                                            {allDayOfMonth.map((x, index) => (
                                                                <th key={index}>{x.day}&nbsp; {x.date}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            importDataCurrentPage.map((x, index) => {
                                                                let workSession1 = x.workSession1, workSession2 = x.workSession2;
                                                                return (
                                                                    <React.Fragment key={index}>
                                                                        <tr style={x.error ? { color: "#dd4b39" } : { color: '' }} title={x.errorAlert.join(', ')}>
                                                                            <td rowSpan="2">{page + index + 1}</td>
                                                                            <td rowSpan="2">{x.employeeNumber}</td>
                                                                            <td rowSpan="2">{x.employeeName}</td>
                                                                            {
                                                                                allDayOfMonth.map((y, indexs) => (
                                                                                    <td key={indexs}>
                                                                                        {workSession1[indexs] ? <i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i> :
                                                                                            <i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i>}
                                                                                    </td>
                                                                                ))
                                                                            }
                                                                        </tr>
                                                                        <tr>{
                                                                            allDayOfMonth.map((y, indexs) => (
                                                                                <td key={indexs}>
                                                                                    {workSession2[indexs] === true ? <i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i> :
                                                                                        <i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i>}
                                                                                </td>
                                                                            ))
                                                                        }
                                                                        </tr>
                                                                    </React.Fragment>
                                                                )
                                                            })
                                                        }

                                                    </tbody>
                                                </table>
                                            </div>

                                        </React.Fragment>
                                    )}
                            </div>
                            <SlimScroll outerComponentId="croll-table-import" innerComponentId="importData" innerComponentWidth={1500} activate={true} />
                            <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
};

function mapState(state) {
    const { timesheets, salary } = state;
    return { timesheets, salary };
};

const actionCreators = {
    importTimesheets: TimesheetsActions.importTimesheets,
};

const importExcel = connect(mapState, actionCreators)(withTranslate(TimesheetsImportForm));
export { importExcel as TimesheetsImportForm };