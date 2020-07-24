import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, SlimScroll, PaginateBar, DatePicker, ButtonModal } from '../../../../common-components';
import { configurationHoliday } from './fileConfigurationImportHoliday';
import { LOCAL_SERVER_API } from '../../../../env';

import XLSX from 'xlsx';
import { HolidayActions } from '../redux/actions';

class HolidayImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowError: [],
            importData: [],
            configData: this.convertConfigurationToString(configurationHoliday),
            importConfiguration: configurationHoliday,
            limit: 100,
            page: 0
        };
    }
    componentDidUpdate() {
        const { holiday } = this.props;
        holiday.importStatus && window.$(`#modal_import_file`).modal("hide");
    }

    // Chuyển đổi dữ liệu file cấu hình để truyền vào state (rồi truyền vào textarea);
    convertConfigurationToString = (data) => {
        let sheets = data.sheets;
        if (sheets.length > 1) {
            sheets = sheets.map(x => `"${x}"`);
            sheets = sheets.join(', ');
        } else sheets = `"${sheets}"`
        let stringData = `{
            "${'Số dòng tiêu đề của bảng'}":  ${data.rowHeader},
            "${'Tên các sheet'}":  [${sheets}],
            "${'Tên tiêu đề ứng với ngày bắt đầu'}":  "${data.startDate}",
            "${'Tên tiêu để ứng với ngày kết thúc'}":  "${data.endDate}",
            "${'Tên tiêu để ứng với mô tả lịch nghỉ'}":  "${data.description}"
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
                if (index === "Tên tiêu đề ứng với ngày bắt đầu") obj = { ...obj, startDate: data[index] };
                if (index === "Tên tiêu để ứng với ngày kết thúc") obj = { ...obj, endDate: data[index] };
                if (index === "Tên tiêu để ứng với mô tả lịch nghỉ") obj = { ...obj, description: data[index] };
            }
            return obj
        } catch (error) {
            return null
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

    // Convert dữ liệu date trong excel thành dạng dd-mm-yyyy
    convertExcelDateToJSDate = (serial) => {
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

    // Bắt xự kiện chọn file import
    handleChangeFileImport = (e) => {
        const { importConfiguration } = this.state;
        let configData = importConfiguration !== null ? importConfiguration : configurationHoliday;
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
                    let indexStartDate, indexEndDate, indexDescription;

                    // Lấy index của các tiều đề cột mà người dùng muốn import
                    for (let i = 0; i < Number(configData.rowHeader); i++) {
                        data[i].forEach((x, index) => {
                            if (x !== null) {
                                if (x.trim().toLowerCase() === configData.startDate.trim().toLowerCase())
                                    indexStartDate = index;
                                if (x.trim().toLowerCase() === configData.endDate.trim().toLowerCase())
                                    indexEndDate = index;
                                if (x.trim().toLowerCase() === configData.description.trim().toLowerCase()) {
                                    indexDescription = index;
                                }
                            }
                        })
                    }

                    // Convert dữ liệu thành dạng array json mong muốn để gửi lên server
                    data.splice(0, Number(configData.rowHeader));
                    let dataConvert = [];
                    data.forEach(x => {
                        if (x[indexStartDate] !== null) {
                            let startDate = typeof (x[indexStartDate]) === 'String' ? x[indexStartDate] : this.convertExcelDateToJSDate(x[indexStartDate]);
                            let endDate = typeof (x[indexEndDate]) === 'String' ? x[indexEndDate] : this.convertExcelDateToJSDate(x[indexEndDate]);
                            let reason = x[indexDescription];
                            dataConvert = [...dataConvert, { startDate, endDate, reason }]
                        }
                    })
                    importData = importData.concat(dataConvert);
                })

                // Check dữ liệu import có hợp lệ hay không
                importData = importData.map((x, index) => {
                    let errorAlert = [];
                    if (x.startDate === null || x.endDate === null || x.reason === null) {
                        rowError = [...rowError, index + 1]
                        x = { ...x, error: true }
                    };
                    if (x.startDate === null) {
                        errorAlert = [...errorAlert, 'Ngày bắt đầu không được để trống'];
                    };
                    if (x.endDate === null) {
                        errorAlert = [...errorAlert, 'Ngày kết thúc không được để trống'];
                    };
                    if (x.reason === null) {
                        errorAlert = [...errorAlert, 'Mô tả lịch nghỉ không được để trống'];
                    };
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
        let { rowError, importData } = this.state;
        const { holiday } = this.props;
        if (holiday.error.rowError !== undefined) {
            rowError = holiday.error.rowError;
            importData = holiday.error.data
        }
        if (rowError.length === 0 && importData.length !== 0) {
            return true
        } return false
    }

    save = () => {
        let { importData } = this.state;
        let data = importData;
        for (let n in data) {
            let partStart = data[n].startDate.split('-');
            let startDate = [partStart[2], partStart[1], partStart[0]].join('-');
            let partEnd = data[n].endDate.split('-');
            let endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-');
            data[n] = { ...data[n], startDate: startDate, endDate: endDate };
        };
        this.props.importHoliday(data);
    }

    render() {
        const { translate, holiday } = this.props;
        let { importData, configData, importConfiguration, rowError, limit, page } = this.state;

        if (holiday.error.rowError !== undefined) {
            rowError = holiday.error.rowError;
            importData = holiday.error.data
        }
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
                                                            <th>Ngày bắt đầu</th>
                                                            <th>Ngày kết thúc</th>
                                                            <th>Mô tả lịch nghỉ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <th>Tiêu đề tương ứng</th>
                                                            <td>{importConfiguration.startDate}</td>
                                                            <td>{importConfiguration.endDate}</td>
                                                            <td>{importConfiguration.description}</td>
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
                                <label>File excel cần import</label>
                                <input type="file" className="form-control"
                                    accept=".xlms,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    onChange={this.handleChangeFileImport} />
                            </div>
                            <div className="form-group col-md-8 col-xs-12">
                                <label></label>
                                <a className='pull-right' href={LOCAL_SERVER_API + configurationHoliday.file.fileUrl} target="_blank" style={{ paddingTop: 15 }}
                                    download={configurationHoliday.file.fileName}><i className="fa fa-download"> &nbsp;Download file import mẫu!</i></a>
                            </div>

                            <div className="form-group col-md-12 col-xs-12">
                                {
                                    importDataCurrentPage.length !== 0 &&
                                    (<React.Fragment>
                                        {rowError.length !== 0 && (
                                            <React.Fragment>
                                                <span style={{ fontWeight: "bold", color: "red" }}>Có lỗi xảy ra ở các dòng: {rowError.join(', ')}</span>
                                            </React.Fragment>
                                        )}
                                        <div id="croll-table-import">
                                            <table id="importData" className="table table-striped table-bordered table-hover">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: 50 }}>STT</th>
                                                        <th>Ngày bắt đầu</th>
                                                        <th>Ngày kết thúc</th>
                                                        <th style={{ width: "50%" }}>Mô tả lịch nghỉ</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        importDataCurrentPage.map((x, index) => {
                                                            return (
                                                                <tr key={index} style={x.error ? { color: "#dd4b39" } : { color: '' }} title={x.errorAlert.join(', ')}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{x.startDate}</td>
                                                                    <td>{x.endDate}</td>
                                                                    <td>{x.reason}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>

                                    </React.Fragment>)}
                                <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
};

function mapState(state) {
    const { holiday } = state;
    return { holiday };
};

const actionCreators = {
    importHoliday: HolidayActions.importHoliday,
};

const importExcel = connect(mapState, actionCreators)(withTranslate(HolidayImportForm));
export { importExcel as HolidayImportForm };