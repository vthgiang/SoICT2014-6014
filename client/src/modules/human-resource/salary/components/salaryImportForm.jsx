import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, } from '../../../../common-components';

import XLSX from 'xlsx';

class SalaryImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            importData: [],
            configData: {
                rowHeader: "1",
                sheets: ['Sheet1'],
                employeeNumber: 'Mã số nhân viên',
                month: 'Tháng',
                year: 'Năm',
                mainSalary: 'Tiền lương chính',
                employeeName: "Họ và tên",
                bonus: ['Thưởng đầu hộp SanFoVet', 'Thưởng đầu hộp ViaVet', 'Thưởng quý', 'Lương CTV']
            }
        };
    }
    handleChangeFile = (e) => {
        let configData = this.state.configData;
        let sheets = configData.sheets;
        let file = e.target.files[0];

        if (file !== undefined) {
            const reader = new FileReader();
            //reader.readAsDataURL(file);
            reader.readAsBinaryString(file);
            reader.onload = (evt) => {
                let sheet_lists = [];
                const fileImport = evt.target.result;
                const workbook = XLSX.read(fileImport, { type: 'binary' });
                //lấy danh sách các sheet của file import
                let sheet_name_list = workbook.SheetNames;
                // kiểm tra lọc lấy các sheet tồn tại mà người dùng muốn import
                for (let n in sheets) {
                    sheet_lists = [...sheet_lists, sheet_name_list.filter(x => x === sheets[n])]
                }
                let importData = [];
                // lấy dữ liệu từng sheet
                sheet_lists.forEach(x => {
                    let data = XLSX.utils.sheet_to_json(workbook.Sheets[x], { header: 1, blankrows: true, defval: null });
                    var indexEmployeeName, indexEmployeenumber, indexMonth, indexYear, indexMainSalary, indexBouns = [];

                    // lấy index của các tiều đề cột mà người dùng muốn import
                    for (let i = 0; i < Number(configData.rowHeader); i++) {
                        data[i].forEach((x, index) => {
                            if (x !== null) {
                                if (x.trim().toLowerCase() === configData.employeeName.trim().toLowerCase())
                                    indexEmployeeName = index;
                                if (x.trim().toLowerCase() === configData.employeeNumber.trim().toLowerCase())
                                    indexEmployeenumber = index;
                                if (x.trim().toLowerCase() === configData.month.trim().toLowerCase())
                                    indexMonth = index;
                                if (x.trim().toLowerCase() === configData.year.trim().toLowerCase())
                                    indexYear = index;
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
                            let month = x[indexMonth] !== null ? Number(x[indexMonth]).toString() : null;
                            let year = x[indexYear] !== null ? Number(x[indexYear]).toString() : null;
                            let employeeName = x[indexEmployeeName];
                            let bonus = [];
                            indexBouns.forEach((y, indexs) => {
                                if (x[y] !== null) {
                                    bonus = [...bonus, { nameBonus: configData.bonus[indexs], number: Number(x[y]) }]
                                }

                            })
                            if (month !== null && month.length === 2 && year !== null) {
                                month = month + "-" + year;
                            } else if (month !== null && month.length === 1 && year !== null) {
                                month = "0" + month + "-" + year;
                            } else month = null;
                            dataConvert = [...dataConvert, { mainSalary, employeeNumber, month, employeeName, bonus }]
                        }
                    })
                    importData = importData.concat(dataConvert);

                    // data = data.map((x, index) => {
                    //     let mainSalary = x[`${configData.mainSalary}`];
                    //     let employeeNumber = x[`${configData.employeeNumber}`];
                    //     let month = x[`${configData.month}`] !== undefined ? Number(x[`${configData.month}`]).toString() : '';
                    //     let year = x[`${configData.year}`] !== undefined ? Number(x[`${configData.year}`]).toString() : '';
                    //     let employeeName = x[`${configData.employeeName}`];
                    //     let bonus = [];
                    //     configData.bonus.forEach(b => {
                    //         if (x[`${b}`] !== undefined) {
                    //             bonus = [...bonus, { nameBonus: b, number: Number(x[`${b}`]) }]
                    //         }
                    //     });
                    //     if (month.length === 2 && year !== '') {
                    //         month = month + "-" + year;
                    //     } else if (month.length === 1 && year !== '') {
                    //         month = "0" + month + "-" + year;
                    //     } else month = "";

                    //     return { mainSalary, employeeNumber, month, employeeName, bonus }
                    // })
                    // importData = importData.concat(data);
                })
                this.setState({
                    importData: importData
                })
            };

        }
    }

    configFileImport = () => {
        window.$(`#confic_import_file`).collapse("hide");
    }

    render() {
        let formater = new Intl.NumberFormat();
        const { translate } = this.props;
        const { importData } = this.state;
        return (
            <React.Fragment>
                {/* {showButton && <ButtonModal modalID={`modal_import_file_${id}`} button_name="Import file excel" />} */}
                <DialogModal
                    modalID={`modal_import_file`} isLoading={false}
                    formID={`form_import_file`}
                    title='Thêm dữ liệu bằng việc Import file excel'
                    func={this.save}
                    disableSubmit={false}
                    size={75}
                >
                    <form className="form-group" id={`form_import_file`}>
                        <div>
                            <button type="button" data-toggle="collapse" data-target="#confic_import_file" className="pull-right" style={{ border: "none", background: "none", padding: 0 }}><i className="fa fa-gear" style={{ fontSize: "19px" }}></i></button>
                            <div id="confic_import_file" className="box box-solid box-default collapse col-sm-12 col-xs-12" style={{ padding: 0 }}>
                                <div className="box-header with-border">
                                    <h3 className="box-title">Cấu hình file import</h3>
                                    <div className="box-tools pull-right">
                                        <button type="button" className="btn btn-box-tool" data-toggle="collapse" data-target={`#confic_import_file`} ><i className="fa fa-times"></i></button>
                                    </div>
                                </div>
                                <div className="box-body">
                                    <div className="form-group col-sm-6 col-xs-12">
                                        <label>Tên các sheet<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" name="" value="" onChange={this.handleMSNVChange} autoComplete="off" placeholder="Tên các sheet VD: sheet1, sheet2" />
                                    </div>
                                    <div className="form-group col-sm-6 col-xs-12">
                                        <label>Số dòng của tiêu đề bảng<span className="text-red">*</span></label>
                                        <input type="number" className="form-control" name="" value="" onChange={this.handleMSNVChange} autoComplete="off" placeholder="Số dòng của tiêu đề bảng import" />
                                    </div>
                                    <div className="form-group col-sm-6 col-xs-12">
                                        <label>Mã số nhân viên<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" name="" value="" onChange={this.handleMSNVChange} autoComplete="off" placeholder="Tiêu đề cột ứng với mã nhân viên" />
                                    </div>
                                    <div className="form-group col-sm-6 col-xs-12">
                                        <label>Họ và tên nhân viên<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" name="" value="" onChange={this.handleMSNVChange} autoComplete="off" placeholder="Tiêu đề cột ứng với họ và tên nhân viên" />
                                    </div>
                                    <div className="form-group col-sm-6 col-xs-12">
                                        <label>Tháng lương<span className="text-red">*</span></label>
                                        <input type="number" className="form-control" name="" value="" onChange={this.handleMSNVChange} autoComplete="off" placeholder="Tiêu đề cột ứng với tháng lương" />
                                    </div>
                                    <div className="form-group col-sm-6 col-xs-12">
                                        <label>Năm<span className="text-red">*</span></label>
                                        <input type="number" className="form-control" name="" value="" onChange={this.handleMSNVChange} autoComplete="off" placeholder="Tiêu đề cột ứng với năm" />
                                    </div>
                                    <div className="form-group col-sm-6 col-xs-12">
                                        <label>Tiền lương chính<span className="text-red">*</span></label>
                                        <input type="number" className="form-control" name="" value="" onChange={this.handleMSNVChange} autoComplete="off" placeholder="Tiêu đề cột ứng với tiền lương chính" />
                                    </div>
                                    <div className="form-group col-sm-6 col-xs-12">
                                        <label>File import mẫu</label>
                                        <input type="file" className="form-control" />
                                    </div>
                                    <div className="form-group col-sm-12 col-xs-12">
                                        <label>Tên các loại lương thưởng khác<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" name="" value="" onChange={this.handleMSNVChange} autoComplete="off" placeholder="Tiêu đề cột ứng với các loại lương thưởng khác VD: thưởng quý, thưởng năm" />
                                    </div>
                                    <button type="button" className="btn btn-primary pull-right" style={{marginRight:15}} onClick={this.configFileImport}>{translate('table.update')}</button>
                                </div>
                            </div>
                            <div className="form-group col-md-8 col-xs-12" style={{ padding: 0 }}>
                                <label>Chọn file excel cần import</label>
                                <input type="file" className="form-control" accept=".xlms,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={this.handleChangeFile} />
                            </div>
                            <div className="form-group col-md-4 col-xs-12">
                                <a className='pull-right' style={{ paddingTop: '10px' }} href="" target="_blank" download=""><i className="fa fa-download"> &nbsp;Download file import mẫu!</i></a>
                            </div>
                            {
                                importData.length !== 0 &&
                                <table className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Mã số nhân viên</th>
                                            <th>Tên nhân viên</th>
                                            <th>Tháng</th>
                                            <th>Tiền lương chính</th>
                                            <th>Tổng lương</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            importData.map((x, index) => {
                                                if (x.bonus.length !== 0) {
                                                    var total = 0;
                                                    for (let count in x.bonus) {
                                                        total = total + parseInt(x.bonus[count].number)
                                                    }
                                                }
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{x.employeeNumber}</td>
                                                        <td>{x.employeeName}</td>
                                                        <td>{x.month}</td>
                                                        <td>{formater.format(parseInt(x.mainSalary))}</td>
                                                        <td>
                                                            {
                                                                (x.bonus.length === 0) ?
                                                                    formater.format(parseInt(x.mainSalary)) :
                                                                    formater.format(total + parseInt(x.mainSalary))
                                                            }
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                )
                                            })
                                        }

                                    </tbody>
                                </table>
                            }
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

// function mapState(state) {
//     const { salary, employeesManager } = state;
//     return { salary, employeesManager };
// };

// const actionCreators = {
// };

const importExcel = connect(null, null)(withTranslate(SalaryImportForm));
export { importExcel as SalaryImportForm };