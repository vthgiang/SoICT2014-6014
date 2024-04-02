import React, { useEffect } from 'react';
import { exprimentalAnalysisActions } from '../redux/actions'
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { useState } from 'react';
import { UploadFile, ImportFileExcel, ExportExcel, SelectBox } from '../../../common-components';
import { pertDataInputConfig, getRiskDatasetFromExcelFileConfig, taskDatasetInput, riskInformation, taskInformation } from './fileImportConfig'
import PertCompareChart from './pertCompareChart';
import { Visualize } from './visualize';
const ExprimentalAnalysis = (props) => {
    const [data, setData] = useState(null)
    const initState = {
        importData: [],
        importDataShow: [],
        checkImportData: false
    }
    const [state, setState] = useState(initState)
    const { translate, exprimentalData } = props
    useEffect(() => {
        console.log(exprimentalData)
        if (props.exprimentalData.length != 0) {

            setState({
                ...state,
                importData: [props.exprimentalData.data],
            })
        }
        setState({
            ...state,
            checkImportData: exprimentalData.riskInfo == true
                && exprimentalData.taskInfo == true
                && exprimentalData.riskDataset == true
        })


    }, [props.exprimentalData])
    let getEngNameClass = new Map([['Con người', 'human'], ['Thiết bị', 'equipment'], ['Môi trường', 'enviroment'], ['Sản phẩm', 'product']])
    /**
     * Hàm sử lý sự kiện khi import input cho giải thuật PERT
     * @param {*} value 
     * @param {*} checkFileImport 
     */
    const handleImportPertInputData = (value, checkFileImport) => {
        let data = []
        if (checkFileImport) {
            for (let task of value) {
                let predecessor = task.predecessor == null ? [] : task.predecessor.split(',')
                data.push({
                    ID: task.ID,
                    duration: task.duration,
                    mostlikely: task.mostlikely,
                    optimistic: task.optimistic,
                    pessimistic: task.pessimistic,
                    predecessor: predecessor
                })
            }
            props.createPertData(data)
        }

    }
    /**
     * Hàm sử lý sự kiện khi import dataset của các risk
     * @param {*} value 
     * @param {*} checkFileImport 
     */
    const handleImportRiskDataset = (value, checkFileImport) => {
        // console.log('riskDataset',value)
        if (checkFileImport) {
            let dataset = []
            for (let data of value) {
                var vals = Object.keys(data).map(function (key) {
                    return {
                        ID: key.toString(),
                        value: data[key]
                    }
                });
                dataset.push(vals)
            }
            props.createRiskDataset(dataset)
        }

    }
    /**
     * Hàm sử lý sự kiện import thông tin cơ bản của các công việc
     * @param {*} value 
     * @param {*} checkFileImport 
     */
    const handleImportTaskInformation = (value, checkFileImport) => {
        // console.log('taskInfo',value)
        let dataset = []
        if (checkFileImport) {
            for (let task of value) {
                let riskClass = task.riskClass.split(',')
                riskClass = riskClass.map(rc => getEngNameClass.get(rc))
                // console.log(riskClass)
                dataset.push({
                    ID: task.id,
                    name: task.name,
                    riskClass: riskClass
                })
            }
            props.createTaskInformation(dataset)
        }
    }
    /**
     * Hàm xử lý sự kiện khi import file thông tin cơ bản của các rủi ro
     * @param {*} value 
     * @param {*} checkFileImport 
     */
    const handleImportRiskInformation = (value, checkFileImport) => {
        console.log('riskInfo', value)
        let dataset = []
        if (checkFileImport) {
            let riskClassNameMap = new Map(value.map(risk => [risk.classID, risk.class]))

            let riskClassIDs = value.map(risk => risk.classID)
            riskClassIDs = Array.from(new Set(riskClassIDs))
            for (let riskClassID of riskClassIDs) {
                console.log(riskClassNameMap.get(riskClassID))
                dataset.push({
                    ID: getEngNameClass.get(riskClassNameMap.get(riskClassID)),
                    name: riskClassNameMap.get(riskClassID),
                    parents: value.filter(r => r.classID == riskClassID).map(r => r.id.toString()),
                    isRiskClass: true
                })
            }
            for (let risk of value) {
                dataset.push({
                    ID: risk.id.toString(),
                    name: risk.name,
                    isRiskClass: false,
                    parents: []
                })
            }
            props.createRiskInformation(dataset)
        }
    }
    /**
     * Hàm đọc file excel
     * @param {*} files 
     */
    const handleImportExcel = (files) => {
        console.log('change file')
        //set state to init state
        setState(initState)
        // Import pert input data 
        ImportFileExcel.importData(files[0], pertDataInputConfig, handleImportPertInputData);
        // Import Risk dataset
        ImportFileExcel.importData(files[0], getRiskDatasetFromExcelFileConfig(13), handleImportRiskDataset)
        // Import risk information
        ImportFileExcel.importData(files[0], riskInformation, handleImportRiskInformation)
        //Import taskInformation
        ImportFileExcel.importData(files[0], taskInformation, handleImportTaskInformation)

    }
    const handleSubmit = () => {
        props.analysis()
        props.getProbabilityDistribution()
        if (props.exprimentalData.data.length != 0) {

        }
    }
    const visualize = () => {
        window.$(`#visualize`).modal("show");
    }
    return (
        <div className="box" style={{ minHeight: "450px" }}>
            <div className="box-body">
                <div className="row">
                    <div className="col-md-3">
                        <UploadFile
                            importFile={handleImportExcel}
                        />
                    </div>
                    <br></br>

                </div>
                <div className="row">
                    <div className="col-md-6">
                        <button className="btn btn-success" onClick={handleSubmit} disabled={!state.checkImportData}>Phân tích</button>
                    </div>
                    {exprimentalData.data.length != 0
                        && <div className="col-md-6" >
                            <button className="btn btn-success" onClick={visualize}>
                                Visualize
                            </button>
                        </div>
                    }
                </div>
                <br />
                {exprimentalData.data.length != 0 && <Visualize
                    chartData={exprimentalData.data}
                />}
                {exprimentalData.data.length != 0 && <PertCompareChart
                    chartData={exprimentalData.data}
                />}
            </div>
        </div>
    );
}
function mapState(state) {
    const { risk, exprimentalData } = state;
    // console.log(risk)
    return { risk, exprimentalData }
}

const actions = {
    analysis: exprimentalAnalysisActions.analysis,
    createRiskDataset: exprimentalAnalysisActions.createRiskDataset,
    createTaskDataset: exprimentalAnalysisActions.createTaskDataset,
    createRiskInformation: exprimentalAnalysisActions.createRiskInformation,
    createTaskInformation: exprimentalAnalysisActions.createTaskInformation,
    createPertData: exprimentalAnalysisActions.createPertData,
    getProbabilityDistribution: exprimentalAnalysisActions.getProbabilityDistribution
}
const connectedExprimentalAnalysis = connect(mapState, actions)(withTranslate(ExprimentalAnalysis));
export { connectedExprimentalAnalysis as ExprimentalAnalysis };