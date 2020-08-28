import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DocumentActions } from '../../../redux/actions';
import { ExportExcel, Tree } from '../../../../../common-components';
import ListDocument from './ListDocument';
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

    componentDidMount() {
        this.props.getAllDocuments();
        this.props.getDocumentCategories();
        this.props.getDocumentDomains();
    }

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
            window.$(`#list-document`).slideDown();

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
    onChanged = async (e, data) => {
        console.log('data', data);
        await this.setState({
            currentDomain: data.node,
            dataStatus: this.DATA_STATUS.AVAILABLE,
        })
        window.$(`#list-document`).slideDown();
    }
    checkIn = (array, element) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i].id === element.id)
                return true;
        }
        return false;
    }
    checkChildrenNode = (array, element) => {

    }
    removeDuplicateInArrayObject = (array) => {
        let idArray = [];
        let newArray = [];
        for (let i = 0; i < array.length; i++) {
            if (!idArray.includes(array[i].id)) {
                idArray.push(array[i].id);
                newArray.push(array[i]);
            }
        }
        return newArray;
    }
    /**
     * Hàm thực hiện đếm số document trong danh mục và trả về mảng domain có chứa list các document đó
     * @param {*} domains : mảng danh mục
     * @param {*} documents : mảng document
     */
    countDocumentInDomain = (domains, documents) => {

        for (let i = 0; i < domains.length; i++) {
            let arrDocument = documents.filter(document => this.checkIn(document.domains, domains[i]));
            domains[i].documents = arrDocument;
            domains[i].title = domains[i].name + " - " + arrDocument.length;
            let inDomain = [];
            let x = domains[i];
            while (x.parent) {
                inDomain.push(x.parent)
                let parentX = domains.filter(domain => domain.id === x.parent);
                x = parentX[0];
            }
            domains[i].inDomain = inDomain;
        }

        for (let i = 0; i < domains.length; i++) {
            // gộp các tài liệu của danh mục con vào danh mục cha
            let children = domains.filter(domain => domain.inDomain.includes(domains[i].id))
            for (let j = 0; j < children.length; j++) {
                domains[i].documents = domains[i].documents.concat(children[j].documents);
            }
            //loại bỏ các tài liệu trùng nhau
            domains[i].documents = this.removeDuplicateInArrayObject(domains[i].documents);

        }

    }
    /**
     * Hàm thực hiện đếm số document trong mục lưu trữ và trả về mảng archive có chứa list các document đó
     * @param {*} archives : mảng lưu trữ
     * @param {*} documents : mảng document
     */
    countDocumentInArchive = (archives, documents) => {
        for (let i = 0; i < archives.length; i++) {
            let arrDocument = documents.filter(document => this.checkIn(document.archives, archives[i]));
            archives[i].documents = arrDocument;
            archives[i].title = archives[i].name + " - " + arrDocument.length;
            let inDomain = [];
            let x = archives[i];
            while (x.parent) {
                inDomain.push(x.parent)
                let parentX = archives.filter(archive => archive.id === x.parent);
                x = parentX[0];
            }
            archives[i].inDomain = inDomain;
        }

        for (let i = 0; i < archives.length; i++) {
            // gộp các tài liệu của danh mục con vào danh mục cha
            let children = archives.filter(archive => archive.inDomain.includes(archives[i].id))
            for (let j = 0; j < children.length; j++) {
                archives[i].documents = archives[i].documents.concat(children[j].documents);
            }
            //loại bỏ các tài liệu trùng nhau
            archives[i].documents = this.removeDuplicateInArrayObject(archives[i].documents);

        }
    }
    render() {
        const { documents, translate } = this.props;
        const categoryList = documents.administration.categories.list;
        const docList = documents.administration.data.list;
        const { list } = this.props.documents.administration.domains;
        const listArchives = this.props.documents.administration.archives.list;
        const docs = this.props.documents.administration.data.list;
        console.log('props', listArchives)
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
        this.countDocumentInDomain(list, docs)
        this.countDocumentInArchive(listArchives, docs);
        console.log('oooooooooo', list);

        const dataTreeDomains = list.map(node => {
            return {
                ...node,
                text: node.name + " -" + node.documents.length,
                state: { "opened": true },
                parent: node.parent ? node.parent.toString() : "#"
            }
        })
        const dataTreeArchives = listArchives.map(node => {
            return {
                ...node,
                text: node.name + " -" + node.documents.length,
                state: { "opened": true },
                parent: node.parent ? node.parent.toString() : "#"
            }
        })

        console.log('uuuuuuuuu', dataTreeDomains, dataTreeArchives)
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
            <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7" >
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <b className="text-left" style={{ fontSize: '20px' }}>Thống kê dữ liệu theo danh mục</b>
                        </div>
                        <div className="box-body qlcv" style={{ minHeight: "400px" }}>
                            <Tree
                                id="tree-qlcv-count-document-domain"
                                data={dataTreeDomains}
                                plugins={false}
                                onChanged={this.onChanged}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                    {
                        this.state.currentDomain &&
                        <ListDocument
                            documents={this.state.currentDomain.original.documents ? this.state.currentDomain.original.documents : []}
                        />
                    }
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7" >
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <b className="text-left" style={{ fontSize: '20px' }}>Thống kê dữ liệu theo mục lưu trữ</b>
                        </div>
                        <div className="box-body qlcv" style={{ minHeight: "400px" }}>
                            <Tree
                                id="tree-qlcv-count-document-archive"
                                data={dataTreeArchives}
                                plugins={false}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5"></div>
            </div>


        </React.Fragment>;

    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getAllDocuments: DocumentActions.getDocuments,
    getDocumentCategories: DocumentActions.getDocumentCategories,
    getDocumentDomains: DocumentActions.getDocumentDomains,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(AdministrationStatisticsReport));