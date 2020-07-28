import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, DataTableSetting, ImportFileExcel, ConFigImportFile, SlimScroll, PaginateBar, DatePicker } from '../../../../common-components';

import { LOCAL_SERVER_API } from '../../../../env';
import { configurationTimesheets } from './fileConfigurationImportTimesheets';

import { TimesheetsActions } from '../redux/actions';

class TimesheetsImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            configData: configurationTimesheets,
            checkFileImport: true,
            rowError: [],
            importData: [],
            month: null,
            limit: 100,
            page: 0
        };
    }
    componentDidUpdate() {
        const { timesheets } = this.props;
        timesheets.importStatus && window.$(`#modal_import_file`).modal("hide");
    }

    // Function Thay đổi cấu hình file import
    handleChangeConfig = (value) => {
        this.setState({
            configData: value,
            importData: [],
        })
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

    // Bắt sự kiện thay đổi tháng
    handleMonthChange = (value) => {
        const { timesheets } = this.props;
        let rowError = [], importData = [];
        if (timesheets.error.rowError !== undefined) {
            rowError = timesheets.error.rowError;
            importData = timesheets.error.data;
            importData = importData.map((x, index) => {
                if (x.errorAlert.find(y => y === "month_timesheets_have_exist") !== undefined) {
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
            })
        }

        let allDayOfMonth = this.getAllDayOfMonth(value);
        this.setState({
            ...this.state,
            allDayOfMonth: allDayOfMonth,
            month: value,
            changeMonth: true,
        });
    }

    // Function thay đổi file import
    handleImportExcel = (value, checkFileImport) => {
        if (checkFileImport) {
            let importData = [], rowError = [];
            for (let i = 0; i < value.length; i = i + 2) {
                let row1 = value[i];
                let row2 = value[i + 1];
                let workSession1 = row1.dateOfMonth.map(x => x ? true : false);
                let workSession2 = row2.dateOfMonth.map(x => x ? true : false);
                importData = [...importData, { employeeNumber: row1.employeeNumber, employeeName: row1.employeeName, workSession1: workSession1, workSession2: workSession2 }]
            }

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
            });
            this.setState({
                importData: importData,
                rowError: rowError,
                checkFileImport: checkFileImport,
            })
        } else {
            this.setState({
                checkFileImport: checkFileImport,
            })
        }
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
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
        let { limit, page, importData, rowError, configData, changeMonth, month, allDayOfMonth, checkFileImport } = this.state;

        if (timesheets.error.rowError !== undefined && changeMonth === false) {
            rowError = timesheets.error.rowError;
            importData = timesheets.error.data
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

                        <ConFigImportFile
                            id="import_timesheets_config"
                            configData={configData}
                            scrollTableWidth={850}
                            handleChangeConfig={this.handleChangeConfig}
                        />
                        <div className="row">
                            <div className="form-group col-md-4 col-xs-12">
                                <label>Tháng</label>
                                <DatePicker
                                    id="import_timesheets"
                                    dateFormat="month-year"
                                    deleteValue={false}
                                    value=""
                                    onChange={this.handleMonthChange}
                                />
                            </div>
                            <div className="form-group col-md-4 col-xs-12">
                                <ImportFileExcel
                                    configData={configData}
                                    handleImportExcel={this.handleImportExcel}
                                    disabled={!month ? true : false}
                                />
                            </div>
                            <div className="form-group col-md-4 col-xs-12">
                                <label></label>
                                <a className='pull-right' href={LOCAL_SERVER_API + configData.file.fileUrl} target="_blank" style={{ paddingTop: 15 }}
                                    download={configData.file.fileName}><i className="fa fa-download"> &nbsp;Download file import mẫu!</i></a>
                            </div>

                            <div className="form-group col-md-12 col-xs-12">
                                {
                                    !checkFileImport && <span style={{ fontWeight: "bold", color: "red" }}>File import không đúng định dạng </span>
                                }
                                {
                                    importDataCurrentPage.length !== 0 && (
                                        <React.Fragment>
                                            <DataTableSetting
                                                tableId="importData"
                                                limit={limit}
                                                setLimit={this.setLimit}
                                                hideColumnOption={false}
                                            />
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
                                                            <th className="col-fixed" style={{ width: 120 }}>Mã số nhân viên</th>
                                                            <th className="col-fixed" style={{ width: 120 }}>Tên nhân viên</th>
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
                                                                                    {workSession2[indexs] ? <i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i> :
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