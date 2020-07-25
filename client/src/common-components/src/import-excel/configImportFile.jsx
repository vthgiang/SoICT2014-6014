import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SlimScroll } from '../../../common-components'

class ConFigImportFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textareaValue: this.convertConfigurationToString(this.props.configData, this.props.titleArr),
            configData: this.props.configData,
        };
    }

    // Chuyển đổi dữ liệu file cấu hình (object) thành String
    convertConfigurationToString = (configData, titleArr) => {
        let sheets = configData.sheets;
        if (sheets.length > 1) {
            sheets = sheets.map(x => `"${x}"`);
            sheets = sheets.join(', ');
        } else sheets = `"${sheets}"`

        let stringData = "{";
        let config = { ...configData }, headerTable = [];
        delete config.file;
        for (let key in config) {
            headerTable = [...headerTable, { key: key, value: config[key] }]
        }

        for (let n in headerTable) {
            let title = titleArr.find(x => x.key === headerTable[n].key);
            if (!Array.isArray(headerTable[n].value)) {

                stringData = stringData + `
                "${title.value}": "${headerTable[n].value}",`
            } else {
                let arr = headerTable[n].value;
                if (arr.length > 1) {
                    arr = arr.map(x => `"${x}"`);
                    arr = arr.join(', ');
                } else {
                    arr = `"${arr}"`
                }
                stringData = stringData + `
                "${title.value}": [${arr}],`
            }
        }
        stringData = stringData + `
}`
        return stringData;
    }

    // Chuyển đổi dữ liệu người dùng nhập vào ở textarea (String) thành object
    convertStringToObject = (data, titleArr) => {
        try {
            data = data.substring(1, data.length - 1); // xoá dấu "{" và "}"" ở đầu và cuối String
            data = data.split(',').map(x => x.trim()); // xoá các space dư thừa
            data = data.join(',');

            if (data[data.length - 1] === ',') {    // xoá dấu "," nếu tồn tại ở cuối chuỗi để chuyển đổi dc về dạng string
                data = data.substring(0, data.length - 1);
            }
            data = JSON.parse(`{${data}}`);

            let obj = {};
            titleArr.forEach(x => {
                for (let index in data) {
                    if (index === x.value) {
                        obj = { ...obj, [x.key]: data[index] }
                    }
                }
            })
            return obj
        } catch (error) {
            return null
        }
    }

    // Bắt sự kiện thay đổi (textarea);
    handleChange = (e) => {
        const { configData, titleArr, handleChangeConfig } = this.props;
        const { value } = e.target;
        let config = this.convertStringToObject(value, titleArr);
        if (config) {
            this.setState({
                textareaValue: value,
                configData: config,
            })
            config = { ...config, file: configData.file }
            handleChangeConfig(config);
        } else {
            this.setState({
                textareaValue: value,
            })
        }

    }

    render() {
        const { textareaValue, configData = {} } = this.state;
        const { id, scrollTableWidth = 1000 } = this.props;
        return (
            <React.Fragment>
                <button type="button" data-toggle="collapse" data-target={`#confic_import_file-${id}`} className="pull-right"
                    style={{ border: "none", background: "none", padding: 0 }}><i className="fa fa-gear" style={{ fontSize: "19px" }}></i></button>

                <div id={`confic_import_file-${id}`} className="box box-solid box-default collapse col-sm-12 col-xs-12" style={{ padding: 0 }}>
                    <div className="box-header with-border">
                        <h3 className="box-title">Cấu hình file import</h3>
                        <div className="box-tools pull-right">
                            <button type="button" className="btn btn-box-tool" data-toggle="collapse"
                                data-target={`#confic_import_file-${id}`} ><i className="fa fa-times"></i></button>
                        </div>
                    </div>
                    <div className="box-body row">
                        <div className="form-group col-sm-12 col-xs-12">
                            <textarea className="form-control" rows="8" name="reason"
                                value={textareaValue} onChange={this.handleChange}></textarea>
                        </div>

                        <div className="form-group col-sm-12 col-xs-12">
                            <label>Cấu hình file import của bạn như sau:</label><br />
                            <span>File import có</span>
                            <span className="text-success" style={{ fontWeight: "bold" }}>&nbsp;{configData.rowHeader}&nbsp;</span>
                            <span>dòng tiêu đề và đọc dữ liệu các sheet: </span>
                            <span className="text-success" style={{ fontWeight: "bold" }}>&nbsp;{configData.sheets.length > 1 ? configData.sheets.join(', ') : configData.sheets}</span>

                            <div id={`croll-table-${id}`} style={{ marginTop: 5 }}>
                                <table id={`importConfig-${id}`} className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>Tên các thuộc tính</th>
                                            <th>Mã số nhân viên</th>
                                            <th>Tên nhân viên</th>
                                            <th>Tiền lương chính</th>
                                            {configData.bonus.length !== 0 &&
                                                configData.bonus.map((x, index) => (
                                                    <React.Fragment key={index}>
                                                        <th>{x}</th>
                                                    </React.Fragment>
                                                ))
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>Tiêu đề tương ứng</th>
                                            <td>{configData.employeeNumber}</td>
                                            <td>{configData.employeeName}</td>
                                            <td>{configData.mainSalary}</td>
                                            {configData.bonus.length !== 0 &&
                                                configData.bonus.map((x, index) => (
                                                    <React.Fragment key={index}>
                                                        <td>{x}</td>
                                                    </React.Fragment>
                                                ))
                                            }
                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
                <SlimScroll outerComponentId={`croll-table-${id}`} innerComponentId={`importConfig-${id}`} innerComponentWidth={scrollTableWidth} activate={true} />
            </React.Fragment>
        )
    }
}

const config = connect(null, null)(withTranslate(ConFigImportFile));
export { config as ConFigImportFile };