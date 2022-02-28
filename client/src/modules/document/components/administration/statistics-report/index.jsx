import React, { Component, useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DocumentActions } from '../../../redux/actions';
import { ExportExcel } from '../../../../../common-components';
import TreeDomain from './domainChart/treeDomain';
import TreeArchive from './archiveChart/treeArchive';
import c3 from 'c3';
import 'c3/c3.css';



function AdministrationStatisticsReport(props) {
    const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
    const [state, setState] = useState({
        dataStatus: DATA_STATUS.QUERYING
    })
    const refDomain = React.createRef()
    const refCategory = React.createRef()
    const refDocument_view_down = React.createRef()
    const refArchives = React.createRef()
    useEffect(() => {
        props.getDataChart({listChart:["documentByCategory","documentByDomain","documentByViewAndDownload","documentByArchive"]})
    }, [])

    useEffect(()=>{
        pieChart();
        barChart();
    })

    const pieChart = () => {
        removePreviousPieChart();
        let dataChart = documents.administration.dataChart.chartCategory || []
        let chart = c3.generate({
            bindto: refCategory.current,

            // Căn lề biểu đồ
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            data: { // Dữ liệu biểu đồ
                columns: dataChart,
                type: 'pie',
                labels: true,
            }
        })
    }


    const barChart = () => {
        const { translate } = props;
        removePreviousBarChart();
        let dataChart = documents.administration.dataChart.chartViewDownLoad || []
        let x = [translate('document.views'), translate('document.downloads')];
        let chart = c3.generate({
            bindto: refDocument_view_down.current,


            // Căn lề biểu đồ
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },
            axis: {
                x: {
                    type: 'category',
                    categories: x,
                    tick: {
                        multiline: false
                    }
                },
                //  rotated: true
            },
            data: {
                columns: dataChart,
                type: 'bar',
                labels: true,
            },

        })
    }

    function removePreviousPieChart() {
        const chart = refCategory.current;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    function removePreviousBarChart() {
        const chart = refDocument_view_down.current;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    function removePreviousDomainChart() {
        const chart = refDomain.current;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    const convertDataToExportData = (data, data2) => {
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

    const onChanged = async (e, data) => {
        setState({
            ...state,
            currentDomain: data.node,
            dataStatus: DATA_STATUS.AVAILABLE,
        })
        window.$(`#list-document`).slideDown();
    }

    const checkIn = (array, element) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i].id === element.id)
                return true;
        }
        return false;
    }

    const removeDuplicateInArrayObject = (array) => {
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
    const countDocumentInDomainnn = (domains, documents) => {

        for (let i = 0; i < domains.length; i++) {
            let arrDocument = documents.filter(document => checkIn(document.domains, domains[i]));
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
            domains[i].documents = removeDuplicateInArrayObject(domains[i].documents);

        }

    }

    /**
     * Hàm thực hiện đếm số document trong mục lưu trữ và trả về mảng archive có chứa list các document đó
     * @param {*} archives : mảng lưu trữ
     * @param {*} documents : mảng document
     */
    const countDocumentInArchiveee = (archives, documents) => {
        for (let i = 0; i < archives.length; i++) {
            let arrDocument = documents.filter(document => checkIn(document.archives, archives[i]));
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
            archives[i].documents = removeDuplicateInArrayObject(archives[i].documents);

        }
    }

    const barChartDocumentInDomain = () => {
        removePreviousDomainChart();
        let dataChart = setDataDomainBarchart();

        let count = dataChart.count;
        let heightCalc
        if (dataChart.type) {
            heightCalc = dataChart.type.length * 24.8;
        }
        let height = heightCalc < 320 ? 320 : heightCalc;
        let chart = c3.generate({
            bindto: refDomain.current,

            data: {
                columns: [count],
                type: 'bar',
                labels: true,
            },

            padding: {
                top: 10,
                bottom: 20,
                right: 0,
                left: 100
            },

            axis: {
                x: {
                    type: 'category',
                    categories: dataChart.shortName,
                    tick: {
                        multiline: false
                    }
                },
                y: {
                    label: {
                        text: 'Số lượng',
                        position: 'outer-right'
                    }
                },
                rotated: true
            },

            size: {
                height: height
            },

            color: {
                pattern: ['#1f77b4']
            },

            legend: {
                show: false
            },

            tooltip: {
                format: {
                    title: function (index) { return dataChart.type[index] },

                }
            }
        });
    }

    const setDataDomainBarchart = () => {
        const domains = props.documents.administration.domains.list;
        const docs = props.documents.administration.data.list;
        let typeName = [], shortName = [], countDomain = [], idDomain = [];
        for (let i in domains) {
            countDomain[i] = 0;
            idDomain.push(domains[i].id)
        }

        if (docs) {
            docs.map(doc => {
                doc.domains.map(domain => {
                    let idx = idDomain.indexOf(domain);

                    countDomain[idx]++;
                })
            })
            for (let i in domains) {
                let longName = domains[i].name.slice(0, 15) + "...";
                let name = domains[i].name.length > 15 ? longName : domains[i].name;
                shortName.push(name);
                typeName.push(domains[i].name);

            }
        }
        let data = {
            count: countDomain,
            type: typeName,
            shortName: shortName
        }
        return data;
    }

    useCallback(() => {
        if (state.dataStatus === DATA_STATUS.QUERYING) {
            if (props.documents.administration.categories.list.length && props.documents.administration.data.list.length &&
                props.documents.administration.domains.list.length && props.documents.administration.archives.list.length) {
                setState({
                    ...state,
                    dataStatus: DATA_STATUS.AVAILABLE
                })
            }
            return false;
        }
        else if (state.dataStatus === DATA_STATUS.AVAILABLE) {
            pieChart();
            barChart();
            barChartDocumentInDomain();
            // barChartDocumentInArchive();
            window.$(`#list-document`).slideDown();

            setState({
                ...state,
                dataStatus: DATA_STATUS.FINISHED
            })

        }
        return false;

    }, [state.dataStatus])

    const { documents, translate } = props;
    const categoryList = documents.administration.categories.list;
    const docList = documents.administration.data.list;
    const listDomains  = props.documents.administration.domains.list;
    const listArchives = props.documents.administration.archives.list;
    const docs = props.documents.administration.data.list;
    let dataExport = [];
    let data2 = [];
    if (documents.isLoading === false) {
        dataExport = categoryList.map(category => {
            let docs = docList.filter(doc => doc.category !== undefined && doc.category === category.id);
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
            let docs = docList.filter(doc => doc.category !== undefined && doc.category === category.id).length;
            return [
                category.name,
                docs
            ]
        });
    }
    let exportData = convertDataToExportData(dataExport, data2);
    return <React.Fragment>
        <ExportExcel id="export-document-archive" exportData={exportData} style={{ marginRight: 5 }} buttonName={translate('document.export')} />

        {/* Thống kê số lượng tài liệu theo lĩnh vực, Thống kê số lượng tài liệu theo vị trí lưu trữ */}
        <div className="row">
            <div className="col-xs-12" >
                <div className="box box-solid">
                    <div className="box-header">
                        <div className="box-title">{translate('document.statistical_document_by_archive')}</div>
                    </div>
                    <div className="box-body qlcv" style={{ minHeight: "400px" }}>
                        <TreeArchive
                            archives={listArchives}
                            documents={docs}
                            chartArchive = {documents.administration.dataChart.chartArchive}
                        />
                    </div>
                </div>
            </div>
        </div>
        {/* Thống kê các loại tài liệu */}
        <div className="row">
            <div className="col-xs-12" >
                <div className="box box-solid">
                    <div className="box-header">
                        <div className="box-title">{translate('document.statistical_view_down')}</div>
                    </div>
                    <div className="box-body qlcv" style={{ minHeight: "400px" }}>
                        <div ref={refDocument_view_down}></div>
                    </div>
                </div>
            </div>
        </div>

        <div className="row">
            <div className="col-xs-12" >
                <div className="box box-solid">
                    <div className="box-header">
                        <div className="box-title">{translate('document.statistical_document_by_domain')}</div>
                    </div>
                    <div className="box-body qlcv" style={{ minHeight: "400px" }}>
                        <TreeDomain
                            domains={listDomains}
                            documents={docs}
                            chartDomain = {documents.administration.dataChart.chartDomain}
                        />
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-xs-12" >
                <div className="box box-solid">
                    <div className="box-header">
                        <div className="box-title">{translate('document.statistical_document')}</div>
                    </div>
                    <div className="box-body qlcv" style={{ minHeight: "400px" }}>
                        <div ref={refCategory}></div>
                    </div>
                </div>
            </div>
        </div>



    </React.Fragment>;

}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getAllDocuments: DocumentActions.getDocuments,
    getDocumentCategories: DocumentActions.getDocumentCategories,
    getDocumentDomains: DocumentActions.getDocumentDomains,
    getDataChart: DocumentActions.getDataChart
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(AdministrationStatisticsReport));