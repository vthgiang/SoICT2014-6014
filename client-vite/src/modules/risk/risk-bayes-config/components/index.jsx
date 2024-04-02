import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal } from '../../../../common-components';
import { getColor } from '../../process-analysis/TaskPertHelper';
import { CPT } from '../../risk-dash-board/components/CPT'
import { RiskDistributionActions } from '../../risk-dash-board/redux/actions';
import customModule from './risk-diagram';
import { getRiskColor } from '../../process-analysis/TaskPertHelper';
// import { toast } from 'react-toastify';
import ServerResponseAlert from '../../../alert/components/serverResponseAlert';
import { ToastContainer, toast } from 'react-toastify';
// custom element
ElementFactory.prototype._getDefaultSize = function (semantic) {

    if (is(semantic, 'bpmn:Task')) {
        return { width: 50, height: 50 };
    }

    if (is(semantic, 'bpmn:Gateway')) {
        return { width: 50, height: 50 };
    }

    if (is(semantic, 'bpmn:Event')) {
        return { width: 36, height: 36 };
    }

    if (is(semantic, 'bpmn:Participant')) {
        return { width: 350, height: 250 };
    }

    if (is(semantic, 'bpmn:TextAnnotation')) {
        return { width: 100, height: 30 };
    }
    return { width: 50, height: 80 };

};

//Xóa element khỏi palette 
var _getPaletteEntries = PaletteProvider.prototype.getPaletteEntries;
PaletteProvider.prototype.getPaletteEntries = function (element) {
    var entries = _getPaletteEntries.apply(this);
    // for (let entry in entries) {
    //     delete entries[entry]
    // }
    delete entries['create.subprocess-expanded'];
    delete entries['create.data-store'];
    delete entries['create.data-object'];
    delete entries['create.group'];
    // delete entries['create.participant-expanded'];
    delete entries['create.intermediate-event'];
    delete entries['create.task'];
    // delete entries
    return entries;
}
var zlevel = 1;
// diagram khởi tạo
const InitialDiagram =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
    'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
    'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
    'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" ' +
    'targetNamespace="http://bpmn.io/schema/bpmn" ' +
    'id="Definitions_2">' +
    '<bpmn:process id="Process_3" isExecutable="false">' +
    '</bpmn:process>' +
    '<bpmndi:BPMNDiagram id="BPMNDiagram_2">' +
    '<bpmndi:BPMNPlane id="BPMNPlane_2" bpmnElement="Process_3">' +
    '</bpmndi:BPMNPlane>' +
    '</bpmndi:BPMNDiagram>' +
    '</bpmn:definitions>';
var zlevel = 1;
const BayesianNetworkConfig = (props) => {
    const { translate, getRiskDistributions, riskDistribution, notifications } = props
    useEffect(() => {
        getRiskDistributions()
        props.updateProb()
    }, [])
    const [flag, setFlag] = useState('nothing')
    const [state, setState] = useState({
        xmlDiagram: null,
        risks: [],
        taskClassName: '',
        riskRelate: [],
        riskProb: -1,
        tech: "expert",
        isValidated: false,
        currentRow: null,
    })
    const { tech, currentRow } = state
    const initialDiagram = InitialDiagram
    const [modeler, setModeler] = useState(new BpmnModeler({
        additionalModules: [
            customModule,
            {
                contextPad: ["value", {}],
                contextPadProvider: ["value", {}],
                palette: ["value", {}],
                paletteProvider: ["value", {}],
                dragging: ["value", {}],
                move: ["value", {}],
                create: ["value", {}],
                // ...
            }
            // { zoomScroll: ['value', ''] }
        ],
    }))
    // useEffect(() => {
    //     if (riskDistribution.lists.length != 0) {
    //         // let check = riskDistribution.lists.find(r => r.tech != 'mle')
    //         setState({
    //             ...state,
    //             lists: riskDistribution.lists,
    //             tech:  'mle'
    //         })
    //     }
    // }, [riskDistribution.lists])
    // các hàm thu nhỏ, phóng to, vừa màn hình cho diagram
    const handleZoomOut = async () => {
        let zstep = 0.2;
        let canvas = modeler.get('canvas');
        let eventBus = modeler.get('eventBus');

        // set initial zoom level
        canvas.zoom(zlevel, 'auto');

        // update our zoom level on viewbox change
        await eventBus.on('canvas.viewbox.changed', function (evt) {
            zlevel = evt.viewbox.scale;
        });
        zlevel = Math.max(zlevel - zstep, zstep);
        canvas.zoom(zlevel, 'auto');
    }

    const handleZoomReset = () => {

        let canvas = modeler.get('canvas');
        canvas.zoom('fit-viewport');
    }

    const handleZoomIn = async () => {
        let zstep = 0.2;
        let canvas = modeler.get('canvas');
        let eventBus = modeler.get('eventBus');

        // set initial zoom level
        canvas.zoom(zlevel, 'auto');
        // update our zoom level on viewbox change
        await eventBus.on('canvas.viewbox.changed', function (evt) {
            zlevel = evt.viewbox.scale;
        });
        zlevel = Math.min(zlevel + zstep, 7);
        canvas.zoom(zlevel, 'auto');
    }
    useEffect(() => {
        if (notifications.associatedData?.length != 0) {
            console.log('notiBayes', notifications.associatedData)
            if (notifications.associatedData.dataType == "realtime_close_task_process") {
                // alert('close')
                // props.getRisks({ type: 'getByUser', riskName, page, perPage });
                getRiskDistributions()
            }
        }
    }, [notifications])
    useEffect(() => {

        if (riskDistribution.lists.length != 0 || flag == "updateDiagram")
            modeler.importXML(initialDiagram, function () {
                let NUM_RISK_CLASS = 5;
                // (1) Get the modules
                var elementFactory = modeler.get('elementFactory'),
                    elementRegistry = modeler.get('elementRegistry'),
                    modeling = modeler.get('modeling'),
                    bpmnFactory = modeler.get('bpmnFactory');
                var process = elementRegistry.get('Process_3');
                // Tao cac nut
                for (let risk of riskDistribution.lists) {
                    // console.log(risk.prob)
                    var taskBusinessObject = bpmnFactory.create('bpmn:Task', {
                        id: risk._id.toString(),
                        parents: risk.parents,
                        riskProb: risk.prob,
                        taskClass: risk.taskClass,
                        riskName: risk.name,
                        parentList: risk.parentList,
                        riskID: risk.riskID
                    });
                    var riskNode = elementFactory.createShape({ type: 'bpmn:Task', businessObject: taskBusinessObject });
                    // Search
                    modeling.createShape(riskNode, { x: 400, y: 150 }, process);
                    let element1 = elementRegistry.get(riskNode.id);

                    modeling.setColor(element1, null);
                    element1 && modeling.setColor(element1, {
                        fill: getColor(risk.prob),
                        stroke: '#14984c', //E02001
                        width: '5px'
                    });
                }
                // di chuyen cho dung vi tri
                for (let risk of riskDistribution.lists) {
                    let element1 = elementRegistry.get(risk._id);
                    // console.log(risk.riskID)
                    let down = 1
                    let parentList = risk.parentList.map(par => par._id)
                    // console.log('parentList', parentList)
                    if (parentList.length != 0) {
                        modeling.moveElements([element1], {
                            x: 270 * (risk.riskID - 1),
                            y: 0
                        })
                        for (let parId of parentList) {
                            let parent = elementRegistry.get(parId)
                            modeling.moveElements([parent], {
                                x: 270 * (risk.riskID - 1) + 135,
                                y: 150 * down
                            })
                            if (down <= parentList.length) {
                                down++
                            }
                        }
                    }

                }
                let prob = 110
                var taskBusinessObject = bpmnFactory.create('bpmn:Task', {
                    id: 'risk_total',
                    parents: [],
                    riskProb: prob,
                    taskClass: 0,
                    riskName: 'Rủi ro',
                    parentList: [],
                    riskID: 0,
                });
                var riskNode = elementFactory.createShape({ type: 'bpmn:Task', businessObject: taskBusinessObject });

                modeling.createShape(riskNode, { x: 750, y: 10 }, process);
                let element1 = elementRegistry.get(riskNode.id);
                // Nối các class với nút Risk
                for (let risk of riskDistribution.lists) {
                    let dashed = false,
                        width = '2px',
                        colorUpdate = '#424242';
                    if (risk.parents.length != 0) {
                        let element = elementRegistry.get(risk._id)
                        modeling.connect(element, element1, {
                            type: 'bpmn:SequenceFlow',
                            colorUpdate: colorUpdate,
                            dashed: dashed,
                            width: width,
                            riskID: risk.riskID
                        })
                    }
                }
                modeling.setColor(element1, null);
                element1 && modeling.setColor(element1, {
                    fill: '#58ACFA',
                    stroke: '#14984c', //E02001
                    width: '5px'
                });
                // Noi cac nut voi nhau
                for (let risk of riskDistribution.lists) {
                    let dashed = false,
                        width = '2px',
                        colorUpdate = '#424242';
                    let element1 = elementRegistry.get(risk._id)
                    let parentList = risk.parentList.map(par => par._id)
                    if (parentList.length != 0) {
                        for (let parId of parentList) {
                            let parent = elementRegistry.get(parId)

                            modeling.connect(parent, element1, {
                                type: 'bpmn:SequenceFlow',
                                colorUpdate: colorUpdate,
                                dashed: dashed,
                                width: width,

                            });
                            // modeling.connect(parent, element1)
                        }
                    }

                }
            })
    }, [riskDistribution.lists, flag])
    const [check, setCheck] = useState(false)
    useEffect(() => {
        console.log(check)
        if (check) {
            handleZoomReset()
        }
    }, [check])
    useEffect(() => {

        if (riskDistribution.lists.length != 0) {
            let check = riskDistribution.lists.find(r => r.tech !== "mle")
            check && check.length != 0 ? props.changeTech('expert') : props.changeTech('mle')
            modeler.attachTo('#diagram-config');
            console.log(modeler)
            var eventBus = modeler.get('eventBus');
            console.log(eventBus)
            //Vo hieu hoa double click edit label
            eventBus.on('element.dblclick', 10000, function (event) {
                var element = event.element;
                if (isAny(element, ['bpmn:Task'])) {
                    return false; // will cancel event
                }
            });
            modeler.on('import.done', (event) => {
                setCheck(true)
                // return alert(warnings);
            });


            modeler.on('element.click', 1000, (e) => interactPopup(e));
        }

    }, [riskDistribution.lists])
    useEffect(() => {
        if (currentRow && currentRow != null) {
            if (riskDistribution.tech == "expert") {
                window.$(`#modal-config`).modal("show");
            } else {
                window.$(`#modal-no-config`).modal("show");
            }

        }
    }, [currentRow])

    const interactPopup = (event) => {
        var element = event.element;
        let nameStr = element.type.split(':');

        if (element.type === 'bpmn:Task') {
            console.log(element.businessObject.id)
            if (element.type === 'bpmn:Task') {
                console.log(riskDistribution.lists)
                let risk = riskDistribution.lists.find(rd => rd._id == element.businessObject.id)
                console.log('selected', risk)
                setState({
                    ...state,
                    currentRow: risk
                })


            }

        }
    }
    const clone = (ob) => {
        return JSON.parse(JSON.stringify(ob))
    }

    useEffect(() => {
        if (flag == "updateProb") {
            props.updateProb()
        }
        if (flag == "updateDiagram") {
            getRiskDistributions()
            // updateDiagram()
        }
        if (flag == "changeToMLE") {
            props.updateProb()
            // props.getRiskDistributions()
        }
    }, [flag])
    // useEffect(()=>{

    // },[riskDistribution.tech])
    const [changeTech, setChange] = useState('')
    useEffect(() => {
        if (changeTech == 'mle')
            window.$(`#mle`).modal("show");
    }, [changeTech])
    const handleChangeTech = (event) => {
        props.changeTech(event.target.value)
        if (event.target.value == "mle" && riskDistribution.lists.length > 0) {
            let temp = clone(riskDistribution.lists[0])
            delete temp.tech
            props.editRiskDistribution(temp._id, temp)
            // getRiskDistributions()
            // setFlag('updateDiagram')
            setFlag('updateProb')

        }
        setChange(event.target.value)
        console.log('techChange')
    }
    const getTechName = (value) => {
        // if (value == "mle") return "MLE"
        return translate(`manage_risk.risk_bayes_config.${value}`)
    }

    const updateDiagram = () => {
        const modeling = modeler.get('modeling');
        for (let risk of riskDistribution.lists) {
            let element1 = modeler.get('elementRegistry').get(risk._id);
            modeling.updateProperties(element1, {
                riskProb: 100,
            });
        }

    }

    useEffect(() => {
        if (riskDistribution.bayesData.riskInfo && riskDistribution.bayesData.riskInfo.length != 0) {
            console.log(riskDistribution.bayesData)
            props.getRiskDistributions()
            // updateDiagram()
            setFlag('updateDiagram')
        }
    }, [riskDistribution.bayesData])
    const [checkSave, setCheckSave] = useState('')
    const handleSave = (risk) => {
        props.editRiskDistribution(risk._id, risk)
        // riskDistribution.lists.map(r=> r._id== risk._id ? risk:r)
        // props.getRiskDistributions()
        setFlag('updateProb')

    }
    return (
        <React.Fragment>
            {/* <div className="row"> */}
            <ToastContainer />
            <DialogModal
                modalID={'mle'} isLoading={false}
                title={translate(`manage_risk.risk_bayes_config.mle`)}
                formID={`form-detail-example-hooks`}
                size={25}
                // disableSubmit={!isFormValidated()}
                maxWidth={300}
                hasSaveButton={true}
                hasNote={false}
                func={() => {
                    if (riskDistribution.lists.length > 0) {
                        let temp = clone(riskDistribution.lists[0])
                        delete temp.tech
                        props.editRiskDistribution(temp._id, temp)
                        // getRiskDistributions()
                        // setFlag('updateDiagram')
                        setFlag('updateProb')
                        setChange(!changeTech)
                        // toast("Wow so easy!");
                        toast.success(

                            'Đã sử dụng MLE'
                        );
                        // props.updateAlg()
                    }
                }}
            >{translate(`manage_risk.risk_bayes_config.mle_use_noti`)}</DialogModal>
            {currentRow != null && <CPT
                handleSave={handleSave}
                action={riskDistribution.tech == "expert" ? "config" : "no-config"} tech={riskDistribution.tech} risk={currentRow} ></CPT>}
            <div className="col-sm-8">
                <div className="box box-primary" >
                    <div className="box-header with-border">
                        <div className="box-title">{translate(`manage_risk.risk_bayes_config.risk_info`)}</div>
                    </div>
                    <div className=" box-body">
                        {/* {riskDistribution.lists.length != 0 && */}
                        <div className="row">
                            <div className="col-sm-12" >
                                <div id="diagram-config" style={{ height: 450 }}></div>
                                <div className="row">
                                    <div className="io-zoom-controls ">
                                        <ul className="io-zoom-reset io-control io-control-list">
                                            <li>
                                                <a id="reset" style={{ cursor: "pointer" }} title="Reset zoom" onClick={handleZoomReset}>
                                                    <i className="fa fa-crosshairs"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a style={{ cursor: "pointer" }} title="Zoom in" onClick={handleZoomIn}>
                                                    <i className="fa fa-plus"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a style={{ cursor: "pointer" }} title="Zoom out" onClick={handleZoomOut}>
                                                    <i className="fa fa-minus"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div id="diagram-config" style={{ height: 400 }}></div>
                        </div>

                        {/* } */}
                    </div>
                </div>
            </div>

            <div className="col-sm-4">
                <div className="box box-primary" >
                    <div className="box-header with-border">
                        <div className="box-title">{translate(`manage_risk.risk_bayes_config.config`)}</div>
                    </div>
                    <div className=" box-body">
                        <div className="form-group">
                            <label htmlFor="">{translate(`manage_risk.risk_bayes_config.using_tech`)} :</label>
                            <span style={{ color: 'blue' }}>{riskDistribution && riskDistribution.tech.length != 0 && getTechName(riskDistribution.tech)}</span>
                        </div>
                        {/* <form> */}
                        <div className="form-group">
                            <label htmlFor="">{translate(`manage_risk.risk_bayes_config.select_tech`)}</label>
                            <select className={`form-control`} value={riskDistribution.tech} onChange={(e) => handleChangeTech(e)} >
                                <option key="ex" value="expert">{translate(`manage_risk.risk_bayes_config.expert`)}</option>
                                <option key="m" value="mle">{translate(`manage_risk.risk_bayes_config.mle`)}</option>
                            </select>
                        </div>
                        {riskDistribution.tech == 'expert' && <div className="form-group">
                            <p className="text-blue">
                                {translate(`manage_risk.risk_bayes_config.configuration_guide`)} :
                            </p>
                            <div>
                                <p>{translate(`manage_risk.risk_bayes_config.guide_1`)}</p>
                                <p>{translate(`manage_risk.risk_bayes_config.guide_2`)}</p>
                                <p>{translate(`manage_risk.risk_bayes_config.guide_3`)}</p>
                            </div>
                        </div>}
                        <div className="form-group">
                            {/* <div className="box-title">{translate('process_analysis.risk_model.note')}</div> */}

                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div style={{ backgroundColor: getRiskColor(0.4), height: "30px", width: "40px", border: "2px solid #000", borderRadius: "3px", marginRight: "5px", marginTop: 4 }}></div>{translate('process_analysis.risk_model.low')}
                            </div>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div style={{ backgroundColor: getRiskColor(0.6), height: "30px", width: "40px", border: "2px solid #14984c", borderRadius: "3px", marginRight: "5px", marginTop: 4 }}></div>{translate('process_analysis.risk_model.medium')}
                            </div>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div style={{ backgroundColor: getRiskColor(0.92), height: "30px", width: "40px", border: "2px solid #c4c4c7", borderRadius: "3px", marginRight: "5px", marginTop: 4 }}></div>{translate('process_analysis.risk_model.high')}
                            </div>


                        </div>
                        {/* <button className="btn btn-success" onClick={(e) => { setFlag('updateProb') }}>Ap dung</button> */}

                        {/* </form> */}
                        <div className="form-group">
                            <span className="text-red">{translate(`manage_risk.risk_bayes_config.warning`)}</span>
                        </div>

                    </div>
                </div>
            </div>

            {/* </div> */}
        </React.Fragment>)
}
const mapState = (state) => {
    let { riskDistribution, notifications } = state
    return { riskDistribution, notifications }
}
const mapActions = {
    getRiskDistributions: RiskDistributionActions.getRiskDistributions,
    changeTech: RiskDistributionActions.changeTech,
    editRiskDistribution: RiskDistributionActions.editRiskDistribution,
    updateProb: RiskDistributionActions.updateProb,
    updateAlg: RiskDistributionActions.updateAlg

}
const connectedBayesianNetworkConfigForm = connect(mapState, mapActions)(withTranslate(BayesianNetworkConfig));
export { connectedBayesianNetworkConfigForm as BayesianNetworkConfig };