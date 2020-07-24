import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import XLSX from 'xlsx';

class ImportFileExcel extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // Bắt xự kiện chọn file import
    handleChangeFileImport = (e) => {
        const { configData } = this.state;
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

                let importData = [];
                let indexKeyImport = { ...configData };
                delete indexKeyImport.sheets;
                delete indexKeyImport.rowHeader;
                delete indexKeyImport.file;

                sheet_lists.length !== 0 && sheet_lists.forEach(x => {
                    let data = XLSX.utils.sheet_to_json(workbook.Sheets[x], { header: 1, blankrows: false, defval: null });
                    // Lấy index của các tiều đề cột mà người dùng muốn import
                    for (let i = 0; i < Number(configData.rowHeader); i++) {
                        data[i].forEach((x, index) => {
                            if (x !== null) {
                                for (let key in configData) {
                                    if (Array.isArray(configData[key]) && key !== 'sheets' && key !== 'rowHeader' && key !== 'file') {
                                        let arr = [...indexKeyImport[key]];
                                        arr = arr.map(y => {
                                            if (typeof y === 'string' && x.trim().toLowerCase() === y.trim().toLowerCase()) {
                                                return index
                                            } else {
                                                return y
                                            }
                                        });
                                        indexKeyImport[key] = arr;
                                        break;
                                    } else if (key !== 'sheets' && key !== 'rowHeader' && key !== 'file') {
                                        if (!Array.isArray(configData[key]) && x.trim().toLowerCase() === configData[key].trim().toLowerCase()) {
                                            indexKeyImport[key] = index;
                                            break;
                                        }
                                    }
                                }
                            }
                        });
                    }

                    // Convert dữ liệu thành dạng array json theo key trong configData
                    data.splice(0, Number(configData.rowHeader));
                    data.forEach((x, index) => {
                        let rowData;
                        for (let n in indexKeyImport) {
                            if (Array.isArray(indexKeyImport[n])) {
                                let obj = indexKeyImport[n].map(ob => x[ob]);
                                rowData = { ...rowData, [n]: obj };
                            } else {
                                rowData = { ...rowData, [n]: x[indexKeyImport[n]] }
                            }
                        }
                        data[index] = rowData;
                    })
                    importData = importData.concat(data);
                })
                this.props.handleImportExcel(importData);
            };
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                configData: nextProps.configData,
                id: nextProps.id
            }
        } else {
            return null
        }
    }

    render() {
        return (
            <React.Fragment>
                <label>File excel cần import</label>
                <input type="file" className="form-control"
                    accept=".xlms,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={this.handleChangeFileImport} />
            </React.Fragment>
        )
    }
}

const importExcel = connect(null, null)(withTranslate(ImportFileExcel));
export { importExcel as ImportFileExcel };