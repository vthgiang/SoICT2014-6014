import React, { Component, forwardRef } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import XLSX from 'xlsx';

class ExportExcelMerge extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleExportExcel = () => {
        let wb = XLSX.utils.book_new();
        const { exportData } = this.state;
        exportData.dataSheets.forEach(x => {
            if (x.sheetName && x.tables.length !== 0) {
                let origin = 1, merge = [];
                // Thêm tên báo cáo
                let ws = XLSX.utils.json_to_sheet([{ "labelSheet": x.labelSheet ? x.labelSheet : "" }], { skipHeader: true, origin: `D${origin}` })
                if (x.labelSheet) {
                    origin += 2;
                }

                x.tables.forEach(y => {
                    let tableMerge = [],
                        rowHeader = y.rowHeader,
                        columns = y.columns,
                        merges = y.merges;

                    // Thêm tên cho từng bảng
                    if (y.tableName) {
                        XLSX.utils.sheet_add_json(ws, [{ "tableName": y.tableName }], { skipHeader: true, origin: `A${origin}` });
                        tableMerge = [...tableMerge,
                        {
                            s: { r: origin - 1, c: 0 },
                            e: { r: origin - 1, c: columns.length - 1 }
                        }]
                        origin += 1;
                    }

                    // Convert lại dữ liệu các dòng (nối key từ columns với data để dc dữ liệu theo đúng thứ tự)
                    let data = y.data.map(row => {
                        let result = [];
                        columns.forEach(col => {
                            result = { ...result, [col.value]: row[col.key] ? row[col.key] : "" };
                        })
                        return result;
                    });

                    let arrHeader = []
                    if (rowHeader && merges && Number(rowHeader) > 1) {
                        for (let i = 0; i < Number(rowHeader); i++) {
                            arrHeader = [...arrHeader, columns]
                        }
                        for (let j = arrHeader.length - 2; j >= 0; j--) {
                            arrHeader[j] = arrHeader[j].map(arr => {
                                let key = arr.key;
                                merges.forEach(mer => {
                                    if (key === mer.keyMerge) {
                                        arr = { ...arr, colspan: mer.colspan, value: mer.columnName }
                                    }
                                })
                                return arr;
                            })
                        };

                        // Lấy mảng rowspan cho header table
                        let rowspans = arrHeader[0].map(rowspan => Number(rowHeader));
                        for (let k = 0; k < arrHeader[0].length; k++) {
                            for (let row = 0; row < Number(rowHeader); row++) {
                                let rowData = arrHeader[row];
                                if (rowData[k].colspan && rowData[k].colspan > 1) {
                                    for (let count = 0; count < rowData[k].colspan; count++) {
                                        rowspans[k + count] = rowspans[k + count] - 1;
                                    }
                                }
                            }
                        }

                        // Thêm dữ liệu header table vào sheet 
                        arrHeader.forEach((arr, indexs) => {
                            let rowData = {};
                            arr.forEach((cell, index) => {
                                if (rowspans[index] === Number(rowHeader) - indexs) {
                                    tableMerge = [...tableMerge,
                                    {
                                        s: { r: origin - 1, c: index },
                                        e: { r: origin + rowspans[index] - 2, c: index }
                                    }]
                                }

                                rowData = { ...rowData, [cell.key]: cell.value }
                                if (cell.colspan && cell.colspan > 1) {
                                    tableMerge = [...tableMerge,
                                    {
                                        s: { r: origin - 1, c: index },
                                        e: { r: origin - 1, c: index + cell.colspan - 1 }
                                    }]
                                };
                            });
                            XLSX.utils.sheet_add_json(ws, [rowData], { skipHeader: true, origin: `A${origin}` });
                            origin = origin + 1;
                        })
                    };


                    // Thêm dữ liệu body table vào sheets
                    if (rowHeader && merges && Number(rowHeader) > 1) {
                        XLSX.utils.sheet_add_json(ws, data, { skipHeader: true, origin: `A${origin}` });
                        origin = origin + data.length + 3;
                    } else {
                        XLSX.utils.sheet_add_json(ws, data, { origin: `A${origin}` });
                        origin = origin + data.length + 4;
                    }

                    merge = merge.concat(tableMerge);
                })
                if (merge.length !== 0) {
                    ws["!merges"] = merge;
                }
                XLSX.utils.book_append_sheet(wb, ws, x.sheetName);
            }
        })
        XLSX.writeFile(wb, `${exportData.fileName}.xlsx`);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            id: nextProps.id,
            exportData: nextProps.exportData,
        }
    }

    render() {
        const { buttonName = "Xuất Báo cáo", style = {}, className = "btn btn-primary pull-right", title = "" } = this.props;
        return (
            <React.Fragment>
                <button type="button" style={style} className={className} title={title} onClick={this.handleExportExcel} >{buttonName}</button>
            </React.Fragment>
        )
    }
};

const exportExcel = connect(null, null)(withTranslate(ExportExcelMerge));
export { exportExcel as ExportExcelMerge };
