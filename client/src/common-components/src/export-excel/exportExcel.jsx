import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import ReactExport from "react-data-export";


class ExportExcel extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // Function chuyển đổi dữ liệu truyền vào thành dạng dữ liệu export
    convertData = (data) => {
        // Cấu hình style cho header
        const styleHeader = {
            font: { sz: "12", bold: true, color: { rgb: "FFFFFF" }, name: 'Times New Roman' },
            fill: { fgColor: { rgb: "2d1075" } },
            border: { left: { style: "thin", color: { rgb: "FFFFFF" } } },
            alignment: { vertical: "center", horizontal: 'center', wrapText: true }
        };
        // Cấu hình style cho body
        const styleBodyofText = {
            font: { sz: "12", name: 'Times New Roman' },
            alignment: { vertical: "center", horizontal: 'left', wrapText: true }
        }
        const styleBodyofNumber = {
            ...styleBodyofText,
            numFmt: "0"
        }

        let dataSheets = data.dataSheets.map(x => {
            let tables = x.tables.map(y => {
                let data = y.data.map(row => {
                    let result = [];
                    y.columns.forEach(col => {
                        result = [...result, { value: row[col.key] ? row[col.key] : "", style: (col.type === "Number") ? styleBodyofNumber : styleBodyofText }];
                    })
                    return result;
                });
                let column = y.columns.map(col => {
                    return { title: col.value, style: styleHeader }
                });
                return { columns: column, data: data }
            })
            return { sheetName: x.sheetName, tables: tables }
        })
        return { fileName: data.fileName, dataSheets: dataSheets }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            id: nextProps.id,
            exportData: nextProps.exportData,
            buttonName: nextProps.buttonName
        }
    }

    render() {
        const ExcelFile = ReactExport.ExcelFile;
        const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
        let { buttonName = "Xuất Báo cáo", exportData, style = { marginTop: 10 }, className = "btn btn-primary pull-right", title = "" } = this.state;

        if (exportData) {
            exportData = this.convertData(exportData);
        }
        return (
            <React.Fragment>
                <ExcelFile filename={exportData.fileName} element={<button type="button" style={style} className={className} title={title} >{buttonName}</button>}>
                    {exportData.dataSheets.map((x, key) =>
                        <ExcelSheet key={key} dataSet={x.tables} name={x.sheetName} />
                    )}
                </ExcelFile>
            </React.Fragment>
        )
    }
};

const exportExcel = connect(null, null)(withTranslate(ExportExcel));
export { exportExcel as ExportExcel };
