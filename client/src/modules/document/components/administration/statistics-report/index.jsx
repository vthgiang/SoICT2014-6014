import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DocumentActions } from '../../../redux/actions';
import { ExportExcel } from '../../../../../common-components';
import c3 from 'c3';
import 'c3/c3.css';



class AdministrationStatisticsReport extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        this.state = {
            dataStatus: this.DATA_STATUS.QUERYING
        }
    }

    // componentDidMount(){
    //     this.props.getAllDocuments();
    // }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if (nextProps.documents.administration.categories.list.length && nextProps.documents.administration.data.list.length) {
                this.setState(state => {
                    return {
                        ...state,
                        dataStatus: this.DATA_STATUS.AVAILABLE
                    }
                })
            }
            return false;
        }
        else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE) {
            this.pieChart();
            this.barChart();
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED
                }
            })

        }
        return false;
    }

    getDataDocumentAnalys = () => {
        const { documents } = this.props;
        const categoryList = documents.administration.categories.list;
        const docList = documents.administration.data.list;
        const data = categoryList.map(category => {
            let docs = docList.filter(doc => doc.category !== undefined && doc.category.name === category.name).length;
            return [
                category.name,
                docs
            ]
        });
        return data;
    }

    pieChart = () => {
        this.removePreviousPieChart();
        let dataChart = this.getDataDocumentAnalys();
        this.chart = c3.generate({
            bindto: this.refs.piechart,

            // Căn lề biểu đồ
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            data: {                                 // Dữ liệu biểu đồ
                columns: dataChart,
                type: 'pie',
                labels: true,
            }
        })
    }

    getDataViewDownloadBarChart = () => {
        const { documents } = this.props;
        const categoryList = documents.administration.categories.list;
        const docList = documents.administration.data.list;

        const data = categoryList.map(category => {
            let docs = docList.filter(doc => doc.category !== undefined && doc.category.name === category.name);
            let totalDownload = 0;
            let totalView = 0;
            for (let index = 0; index < docs.length; index++) {
                const element = docs[index];
                totalDownload = totalDownload + element.numberOfDownload;
                totalView = totalView + element.numberOfView;
            }
            return [
                category.name,
                totalView,
                totalDownload
            ]
        });
        return data;
    }
    barChart = () => {
        this.removePreviousBarChart();
        let dataChart = this.getDataViewDownloadBarChart();
        let x = ["Xem", "Download"];
        this.chart = c3.generate({
            bindto: this.refs.barchart,

            // Căn lề biểu đồ
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            data: {                                 // Dữ liệu biểu đồ
                columns: dataChart,
                type: 'bar',
            },
            axis: {
                type: 'category',
                value: x,
            }
        })
    }
    removePreviousPieChart() {
        const chart = this.refs.piechart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }
    removePreviousBarChart() {
        const chart = this.refs.barchart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }
    convertDataToExportData = (data, data2) => {
        console.log(data2);
        let dataCategory = [];
        let dataDownload = [];
        let dataView = [];
        let j = 0, k = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i][1] !== 0) {
                k++;
                dataView = [...dataView, {
                    "STT": k,
                    "name": data[i][0],
                    "number": data[i][1],
                }]
            }
            if (data[i][2] !== 0) {
                j++;
                dataDownload = [...dataDownload, {
                    "STT": j,
                    "name": data[i][0],
                    "number": data[i][2],
                }]
            }
        }
        for (let i = 0; i < data2.length; i++) {
            dataCategory = [...dataCategory, {
                "STT": i + 1,
                "name": data2[i][0],
                "number": data2[i][1],
            }]
        }
        let exportData = {
            fileName: "Bảng thống kê báo cáo",
            dataSheets: [
                {
                    sheetName: "Sheet1",
                    tables: [
                        {
                            tableName: "Bảng thống kê loại tài liệu sử dụng",
                            rowHeader: 1,
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "name", value: "Tên loại tài liệu" },
                                { key: "number", value: "Số lần sử dụng" },
                            ],
                            data: dataCategory
                        },
                        {
                            tableName: "Bảng thống kê số lượt xem",
                            rowHeader: 1,
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "name", value: "Tên loại tài liệu" },
                                { key: "number", value: "Số lượt xem" },
                            ],
                            data: dataView
                        },
                        {
                            tableName: "Bảng thống kê số lượt download",
                            rowHeader: 1,
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "name", value: "Tên loại tài liệu" },
                                { key: "number", value: "Số lượt download" }
                            ],
                            data: dataDownload
                        }
                    ]
                },
            ]
        }
        return exportData;
    }
    render() {
        const { documents, translate } = this.props;
        const categoryList = documents.administration.categories.list;
        const docList = documents.administration.data.list;
        console.log('props', categoryList)
        console.log('stataeee', docList)
        let dataExport = [];
        let data2 = [];
        if (documents.isLoading === false) {
            dataExport = categoryList.map(category => {
                let docs = docList.filter(doc => doc.category !== undefined && doc.category.name === category.name);
                let totalDownload = 0;
                let totalView = 0;
                for (let index = 0; index < docs.length; index++) {
                    const element = docs[index];
                    totalDownload = totalDownload + element.numberOfDownload;
                    totalView = totalView + element.numberOfView;
                }
                return [
                    category.name,
                    totalView,
                    totalDownload
                ]
            });
            data2 = categoryList.map(category => {
                let docs = docList.filter(doc => doc.category !== undefined && doc.category.name === category.name).length;
                return [
                    category.name,
                    docs
                ]
            });
        }
        let exportData = this.convertDataToExportData(dataExport, data2);
        return <React.Fragment>
            {<ExportExcel id="export-document-archive" exportData={exportData} style={{ marginRight: 5, marginTop: 2 }} />}
            <div className="row">
                <div className="col-xs-12" >
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <b className="text-left" style={{ fontSize: '20px' }}>{translate('document.statistical_document')}</b>
                        </div>
                        <div className="box-body qlcv" style={{ minHeight: "400px" }}>
                            <div ref="piechart"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12" >
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <b className="text-left" style={{ fontSize: '20px' }}>{translate('document.statistical_view_down')}</b>
                        </div>
                        <div className="box-body qlcv" style={{ minHeight: "400px" }}>
                            <div ref="barchart"></div>
                        </div>
                    </div>
                </div>
            </div>


        </React.Fragment>;

    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getAllDocuments: DocumentActions.getDocuments
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(AdministrationStatisticsReport));