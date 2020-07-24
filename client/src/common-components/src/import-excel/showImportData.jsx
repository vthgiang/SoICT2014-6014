import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SlimScroll, PaginateBar } from '../../../common-components';

class ShowImportData extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        this.props.setPage(pageNumber)
    }

    render() {
        const { id, limit, page, importData = [], rowError = [], configData, scrollTableWidth = 1000 } = this.props;

        let config = { ...configData }, headerTable = [];
        delete config.sheets;
        delete config.rowHeader;
        delete config.file;

        for (let key in config) {
            headerTable = [...headerTable, { key: key, value: config[key] }]
        }

        let pageTotal = (importData.length % limit === 0) ?
            parseInt(importData.length / limit) :
            parseInt((importData.length / limit) + 1);
        let currentPage = parseInt((page / limit) + 1);
        let importDataCurrentPage = importData.slice(page, page + limit);
        return (
            <React.Fragment>
                {
                    importDataCurrentPage.length !== 0 && (
                        <React.Fragment>
                            {rowError.length !== 0 && (
                                <React.Fragment>
                                    <span style={{ fontWeight: "bold", color: "red" }}>Có lỗi xảy ra ở các dòng: {rowError.join(', ')}</span>
                                </React.Fragment>
                            )}
                            <div id={`croll-table-import-${id}`}>
                                <table id={`importData-${id}`} className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            {
                                                headerTable.map((x, index) => {
                                                    if (Array.isArray(x.value)) {
                                                        let arr = x.value;
                                                        return arr.map((y, n) => <th key={n}>{y}</th>)
                                                    } else {
                                                        return <th key={index}>{x.value}</th>
                                                    }
                                                })
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            importDataCurrentPage.map((row, index) => {
                                                return (
                                                    <tr key={index} style={row.error ? { color: "#dd4b39" } : { color: '' }} title={row.errorAlert.join(', ')}>
                                                        <td>{page + index + 1}</td>
                                                        {headerTable.map((x, indexs) => {
                                                            if (Array.isArray(x.value)) {
                                                                let arr = row[x.key];
                                                                return arr.map((y, n) => <td key={n}>{y}</td>)
                                                            } else {
                                                                return <td key={indexs}>{row[x.key]}</td>
                                                            }
                                                        })}
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </React.Fragment>
                    )}
                <SlimScroll outerComponentId={`croll-table-import-${id}`} innerComponentId={`importData-${id}`} innerComponentWidth={scrollTableWidth} activate={true} />
                <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
            </React.Fragment>
        )
    }
}

const showData = connect(null, null)(withTranslate(ShowImportData));
export { showData as ShowImportData };