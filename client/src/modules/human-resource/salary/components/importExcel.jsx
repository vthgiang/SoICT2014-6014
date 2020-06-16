import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, } from '../../../common-components';

import XLSX from 'xlsx';
class ImportExcel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            importData: [],
            configData: {
                sheets: ['Theo dõi chi tiết lương', 'Sheet1'],
                employeeNumber: 'Mã số nhân viên',
                month: 'Tháng',
                year: 'Năm',
                mainSalary: 'Tiền lương chính',
                employeeName: "Họ và tên",
                bonus: ['Thưởng đầu hộp SanfoVet', 'Thưởng đầu hộp ViaVet', 'Thưởng quý', 'Lương CTV']
            }
        };
    }
    handleChangeFile = (e) => {
        let configData = this.state.configData;
        let sheets = configData.sheets;
        let file = e.target.files[0];
        if (file !== undefined) {
            const reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = (evt) => {
                let sheet_lists = [];
                const fileImport = evt.target.result;
                const workbook = XLSX.read(fileImport, { type: 'binary' });
                let sheet_name_list = workbook.SheetNames;
                console.log(sheet_name_list);
                for (let n in sheets) {
                    console.log(sheets[n])
                    sheet_lists = [...sheet_lists, sheet_name_list.filter(x => x === sheets[n])]
                }
                console.log(sheet_lists);
                let importData = [];
                sheet_lists.forEach(x => {
                    let data = XLSX.utils.sheet_to_json(workbook.Sheets[x]);
                    data = data.map((x, index) => {
                        let mainSalary = x[`${configData.mainSalary}`];
                        let employeeNumber = x[`${configData.employeeNumber}`];
                        let month = x[`${configData.month}`] !== undefined ? Number(x[`${configData.month}`]).toString() : '';
                        let year = x[`${configData.year}`] !== undefined ? Number(x[`${configData.year}`]).toString() : '';
                        let employeeName = x[`${configData.employeeName}`];
                        let bonus = [];
                        configData.bonus.forEach(b => {
                            if (x[`${b}`] !== undefined) {
                                bonus = [...bonus, { nameBonus: b, number: Number(x[`${b}`]) }]
                            }
                        });
                        if (month.length === 2 && year !== '') {
                            month = month + "-" + year;
                        } else if (month.length === 1 && year !== '') {
                            month = "0" + month + "-" + year;
                        } else month = "";

                        return { mainSalary, employeeNumber, month, employeeName, bonus }
                    })
                    importData = importData.concat(data);
                })
                console.log(importData);
                this.setState({
                    importData: importData
                })

                // let worksheet = workbook.Sheets[sheet_name_list[5]];
                // console.log(worksheet);
                // var range = XLSX.utils.decode_range(worksheet['!ref']);
                // console.log(range);
                //console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[5]], { header: 1 }));
                // var worksheet = XLSX.utils.aoa_to_sheet(data);
                // console.log(worksheet);
            };

        }
    }

    render() {
        const { id, showButton = true } = this.props;
        const { importData } = this.state;
        return (
            <React.Fragment>
                {showButton && <ButtonModal modalID={`modal_import_file_${id}`} button_name="Import file excel" />}
                <DialogModal
                    modalID={`modal_import_file_${id}`} isLoading={false}
                    formID={`form_import_file_${id}`}
                    title='Thêm dữ liệu bằng việc Import file excel'
                    func={this.save}
                    disableSubmit={false}
                    size={50}
                >
                    <form className="form-group" id={`form_import_file_${id}`}>
                        <div className="form-group col-sm-6 col-xs-12">
                            <label>Chọn file excel</label>
                            <input type="file" className="form-control" accept=".xlms,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={this.handleChangeFile} />
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
                                        importData.map((x, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{x.employeeNumber}</td>
                                                <td>{x.employeeName}</td>
                                                <td>{x.month}</td>
                                                <td>{x.mainSalary}</td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>
                        }
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

const importExcel = connect(null, null)(withTranslate(ImportExcel));
export { importExcel as ImportExcel };