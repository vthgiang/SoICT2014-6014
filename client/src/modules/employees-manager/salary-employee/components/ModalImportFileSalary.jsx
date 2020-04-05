import React, { Component } from 'react';
import readXlsxFile from 'read-excel-file';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { toast } from 'react-toastify';
import { EmployeeManagerActions } from '../../employee-manager/redux/actions';
import 'react-toastify/dist/ReactToastify.css';
import { SalaryActions } from '../redux/actions';
class ModalImportFileSalary extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.fileHandler = this.fileHandler.bind(this);
        this.handlSubmit = this.handlSubmit.bind(this);
    }

    // function: notification the result of an action
    notifysuccess = (message) => toast(message);
    notifyerror = (message) => toast.error(message);
    notifywarning = (message) => toast.warning(message);

    async fileHandler(event) {
        let file = event.target.files[0];
        await readXlsxFile(file).then((rows) => {
            var initCols = ["STT", "Tháng", "Năm", "Mã số nhân viên", "Họ tên", "Tiền lương chính"]
            var cols = rows[0];
            var colCheck = rows[0].slice(0, 6);
            if (JSON.stringify(initCols) == JSON.stringify(colCheck)) {
                rows.splice(0, 1);
                this.setState({
                    cols: cols,
                    rows: rows,
                    checkFile: true
                })
            } else {
                this.setState({
                    checkFile: false,
                    cols: undefined,
                    rows: undefined
                })
            }
        })
        var arrayMSNV = [], arraySalary = [];
        for (let n in this.state.rows) {
            let row = this.state.rows[n];
            arrayMSNV[n] = row[3];
            let month = "";
            if (row[1].length === 2) {
                month = row[1] + "-" + row[2];
            } else {
                month = "0" + row[1] + "-" + row[2];
            }
            arraySalary[n] = { employeeNumber: row[3], month: month }
        }
        await this.props.checkArrayMSNV({ arrayMSNV: arrayMSNV });
        await this.props.checkArraySalary({ arraySalary: arraySalary });

    }
    handleCloseModal = () => {
        this.setState({
            checkFile: undefined,
            cols: undefined,
            rows: undefined
        });
        document.getElementById("formImportSalary").reset();
        window.$(`#modal-importFileSalary`).modal("hide");
    }
    handlSubmit() {
        this.props.importSalary({ rows: this.state.rows, cols: this.state.cols });
        document.getElementById("formImportSalary").reset();
        window.$(`#modal-importFileSalary`).modal("hide");
    }
    render() {
        var arrayMSNV = this.props.employeesManager.checkArrayMSNV;
        var arraySalary = this.props.salary.checkArraySalary;
        var arrayCheck = [];
        if (arraySalary !== [] && arrayMSNV !== []) {
            arrayCheck = arraySalary.concat(arrayMSNV);
        }
        console.log(arrayCheck);
        return (
            <div className="modal modal-full fade" id="modal-importFileSalary" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog-full">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={() => this.handleCloseModal()}>
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Thêm nhiều bảng lương:</h4>
                        </div>
                        <div className="modal-body" >
                            <div className="col-md-12">
                                <form id="formImportSalary">
                                    <div className="form-group">
                                        <label htmlFor="employeeNumber">Chọn file Import:</label>
                                        <input type="file" className="form-control" accept=".xlms,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={this.fileHandler} />
                                    </div>
                                </form>
                                {this.state.checkFile !== undefined && this.state.checkFile === false &&
                                    <span className="text-red">File đã chọn không đúng chuẩn mẫu</span>
                                }
                            </div>
                            {
                                this.state.cols !== undefined &&
                                <React.Fragment>
                                    <div className="box-header col-md-12" style={{ paddingLeft: 15 }}>
                                        <h3 className="box-title">Danh sách bảng lương: </h3>
                                    </div>
                                    <div className="timekeeping col-md-12">
                                        {
                                            arrayCheck.length !== 0 && <span className="text-red"> Lỗi dữ liệu ở dòng: {arrayCheck.map(row => {
                                                var newRow = parseInt(row) + 1;
                                                return " " + newRow + ","
                                            })}</span>
                                        }
                                        <table className="table table-striped table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    {this.state.cols.map((col, index) => (
                                                        <td key={index} style={{ width: 90 }}><b>{col}</b></td>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.rows.map((row, index) => {
                                                    if (arrayMSNV === [] && arraySalary === []) {
                                                        return <tr key={index} className={index}>
                                                            {
                                                                row.map((data, indexs) => (
                                                                    <td key={indexs}>{data}</td>
                                                                ))
                                                            }
                                                        </tr>
                                                    } else {
                                                        var checkMSNV = false, checkSalary = false;
                                                        for (let n in arrayMSNV) {
                                                            if (index === arrayMSNV[n]) {
                                                                checkMSNV = true;
                                                            }
                                                        }
                                                        for (let i in arraySalary) {
                                                            if (index === arraySalary[i]) {
                                                                checkSalary = true;
                                                            }
                                                        }
                                                        if (checkMSNV === true) {
                                                            return <tr key={index} className={index} style={{ color: "red" }} title="Mã số nhân viên không tồn tại">
                                                                {
                                                                    row.map((data, indexs) => (
                                                                        <td key={indexs}>{data}</td>
                                                                    ))
                                                                }
                                                            </tr>
                                                        } else if (checkSalary === true) {
                                                            return <tr key={index} className={index} style={{ color: "red" }} title="Tháng lương nhân viên đã tồn tại">
                                                                {
                                                                    row.map((data, indexs) => (
                                                                        <td key={indexs}>{data}</td>
                                                                    ))
                                                                }
                                                            </tr>
                                                        } else {
                                                            return <tr key={index} className={index}>
                                                                {
                                                                    row.map((data, indexs) => (
                                                                        <td key={indexs}>{data}</td>
                                                                    ))
                                                                }
                                                            </tr>
                                                        }
                                                    }
                                                }
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </React.Fragment>
                            }

                        </div>
                        <div className="modal-footer">
                            <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" onClick={() => this.handleCloseModal()}>Đóng</button>
                            {
                                (arrayMSNV.length === 0 && arraySalary.length === 0) ?
                                    <button style={{ marginRight: 15 }} type="button" className="btn btn-success" onClick={this.handlSubmit} title="Thêm nhiều bảng lương">Import</button> :
                                    <button style={{ marginRight: 15 }} type="button" className="btn btn-success" onClick={this.handlSubmit} title="Thêm nhiều bảng lương" disabled>Import</button>
                            }


                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

function mapState(state) {
    const { salary, employeesManager } = state;
    return { salary, employeesManager };
};

const actionCreators = {
    createNewSalary: SalaryActions.createNewSalary,
    checkArrayMSNV: EmployeeManagerActions.checkArrayMSNV,
    checkArraySalary: SalaryActions.checkArraySalary,
    importSalary: SalaryActions.importSalary,
};

const importSalary = connect(mapState, actionCreators)(withTranslate(ModalImportFileSalary));
export { importSalary as ModalImportFileSalary };