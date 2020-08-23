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
                // console.log('aaaaaaaaaaaaaaa',nextProps. documents.administration.categories.list)
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
        //console.log('pieeeeeeeee', dataChart);
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
    convertDataToExportData = (data) => {
        console.log(data);
        data = data.map((x, index) => {
            return {
                STT: index + 1,
                name: x.name,
                // description: x.description,
                // path: x.path,
            }
        })
        let exportData = {
            fileName: "Bảng thống kê bao cao",
            dataSheets: [
                {
                    sheetName: "Sheet1",
                    tables: [
                        {
                            tableName: "Bảng thống kê loai tai lieu",
                            rowHeader: 1,
                            columns: [
                                { key: "STT", value: "STT"},
                                { key: "name", value: "Tên danh mục"},
                                // { key: "description", value: "Mô tả danh mục"},
                                // { key: "path", value: "Đường dẫn danh mục"},
                            ],
                            data: data
                        },
                        {
                            tableName: "Bảng thống kê so luot download",
                            rowHeader: 1,
                            columns: [
                                { key: "STT", value: "STT"},
                                { key: "name", value: "Tên danh mục"},
                                // { key: "description", value: "Mô tả danh mục"},
                                // { key: "path", value: "Đường dẫn danh mục"},
                            ],
                            data: data
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
        if ( documents.isLoading === false ) {
            // dataExport = this.getDataViewDownloadBarChart();
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
            // console.log(data);
        }
        console.log(dataExport);
        let exportData = this.convertDataToExportData(dataExport);
        // let exportData = this.convertDataToExportData(dataExport);
        return <React.Fragment>
            {<ExportExcel id="export-document-archive" exportData={exportData} style={{ marginRight: 5, marginTop: 2 }} />}
            <div className="row">
                <div className="box">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <b className="text-left" style={{ fontSize: '20px' }}>{translate('document.statistical_document')}</b>
                        <div ref="piechart"></div>
                    </div>
                </div>
                <div className="box">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ marginTop: '50px', paddingTop: '10px' }}>
                        <b className="text-left" style={{ fontSize: '20px' }}>{translate('document.statistical_view_down')}</b>
                        <div ref="barchart"></div>
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