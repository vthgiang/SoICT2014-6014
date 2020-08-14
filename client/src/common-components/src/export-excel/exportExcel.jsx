import React, { Component, forwardRef } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import * as Excel from "exceljs";
import * as FileSaver from 'file-saver';

class ExportExcel extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * Function bắt sự kiện click xuất báo cáo
     */
    handleExportExcel = () => {
        const { exportData } = this.state;
        let workbook = new Excel.Workbook();

        exportData.dataSheets.forEach(x => {
            if (x.sheetName && x.tables.length !== 0) {
                let sheetName = x.sheetName.replace(/[*?:\\\/]/gi, '');
                let worksheet = workbook.addWorksheet(sheetName);

                let currentRow = 1;
                if (x.sheetTitle) { // Thêm tiêu đề sheet
                    worksheet.getCell('A1').value = x.sheetTitle;
                    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
                    worksheet.getCell('A1').font = { name: 'Arial', family: 4, size: 18, bold: true, color: { argb: 'FF2D1075' } };
                    worksheet.mergeCells('A1:M1');
                    currentRow = currentRow + 2;
                };

                x.tables.forEach(y => {
                    let rowHeader = y.rowHeader,
                        columns = y.columns,
                        merges = y.merges;

                    if (y.tableName) { // Thêm tên bảng
                        worksheet.getCell(`A${currentRow}`).value = y.tableName;
                        worksheet.getCell(`A${currentRow}`).alignment = { vertical: 'middle' };
                        worksheet.getCell(`A${currentRow}`).font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FF2D1075' } };
                        let endMergeTablename = worksheet.getRow(currentRow).getCell(columns.length).address;
                        worksheet.mergeCells(`A${currentRow}:${endMergeTablename}`);
                        currentRow = currentRow + 1;
                    };

                    let arrHeader = [];
                    if (rowHeader && merges && Number(rowHeader) > 1) {
                        for (let i = 0; i < Number(rowHeader); i++) {
                            arrHeader = [...arrHeader, columns]
                        }
                        for (let j = arrHeader.length - 2; j >= 0; j--) {
                            arrHeader[j] = arrHeader[j].map(arr => {
                                let key = arr.key;
                                merges.forEach(mer => {
                                    if (key === mer.keyMerge) {
                                        arr = { ...arr, key: mer.key, colspan: mer.colspan, value: mer.columnName }
                                    }
                                })
                                return arr;
                            });
                            for (let count = 0; count < j; count++) {
                                arrHeader[count] = arrHeader[j].map(arr => { return { key: arr.key, value: arr.value } });
                            }
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

                        // Thêm header của bảng khi rowHeader > 1
                        arrHeader.forEach((arr, index) => {
                            arr = arr.map(cell => cell.value);
                            worksheet.getRow(currentRow + index).values = arr;
                            for (let n = 1; n <= columns.length; n++) { // Thêm style cho header
                                let cell = worksheet.getRow(currentRow + index).getCell(n).address;
                                worksheet.getCell(cell).font = { name: 'Arial', size: 10, bold: true, color: { argb: "FFFFFFFF" } };
                                worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                                worksheet.getCell(cell).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: "FF2D1075" } };
                                worksheet.getCell(cell).border = { left: { style: "thin", color: { argb: "FFFFFFFF" } }, top: { style: "thin", color: { argb: "FFFFFFFF" } } };
                            }

                        });
                        arrHeader.forEach((arr, index) => {
                            arr = arr.map((cell, key) => {
                                let startMergeCell = worksheet.getRow(currentRow + index).getCell(key + 1).address;
                                if (cell.colspan && Number(cell.colspan) > 1) {
                                    let endMergeColum = worksheet.getRow(currentRow + index).getCell(key + Number(cell.colspan)).address;
                                    worksheet.mergeCells(`${startMergeCell}:${endMergeColum}`);
                                };
                                if (rowspans[key] === Number(rowHeader) - index && rowspans[key] > 1) {
                                    let endMergeRow = startMergeCell;
                                    endMergeRow = endMergeRow.replace(/[0-9]/gi, '').trim();
                                    worksheet.mergeCells(`${startMergeCell}:${endMergeRow}${currentRow + rowspans[key] - 1}`);
                                }
                            })
                        })
                        currentRow = currentRow + arrHeader.length;
                    } else {
                        // Thêm header của bảng khi rowHeader = 1
                        worksheet.getRow(currentRow).values = columns.map(col => col.value);
                        for (let n = 1; n <= columns.length; n++) { // Thêm style cho header
                            let cell = worksheet.getRow(currentRow).getCell(n).address;
                            worksheet.getCell(cell).font = { name: 'Arial', size: 10, bold: true, color: { argb: "FFFFFFFF" } };
                            worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                            worksheet.getCell(cell).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: "FF2D1075" } };
                            worksheet.getCell(cell).border = { left: { style: "thin", color: { argb: "FFFFFFFF" } } };
                        }
                        currentRow += 1;
                    };

                    worksheet.columns = columns.map(col => {
                        return { key: col.key, width: 15 }
                    });

                    // Thêm dữ liệu vào body table
                    worksheet.addRows(y.data);
                    y.data.forEach((obj, index) => {
                        worksheet.getRow(currentRow + index).font = { name: 'Arial' };
                        worksheet.getRow(currentRow + index).alignment = { wrapText: true };
                    })
                    currentRow = currentRow + y.data.length + 3;
                })
            }
        });
        workbook.xlsx.writeBuffer().then(data => {
            const blob = new Blob([data], { type: this.blobType });
            FileSaver.saveAs(blob, `${exportData.fileName}.xlsx`);
        });
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            id: nextProps.id,
            exportData: nextProps.exportData,
        }
    };

    render() {
        const { translate } = this.props;
        const { buttonName = translate('human_resource.name_button_export'), style = {}, className = "btn btn-primary pull-right", title = "" } = this.props;
        return (
            <React.Fragment>
                <button type="button" style={style} className={className} title={title} onClick={this.handleExportExcel} >{buttonName}</button>
            </React.Fragment>
        )
    }
};

const exportExcel = connect(null, null)(withTranslate(ExportExcel));
export { exportExcel as ExportExcel };
