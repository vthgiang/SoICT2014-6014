import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ShowMoreShowLess } from '../../../../common-components/index';
import { roundProb, round } from '../TaskPertHelper'
import customModule from './diagram/risk-diagram'
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'


import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import { getColor, getRiskColor } from '../TaskPertHelper'
import './dashboard.css'
import { RiskDetailInfo } from './riskDetailModal';
import { CPT } from '../../risk-dash-board/components/CPT';
import { CPTTable } from './CPTTable';
// custom element
ElementFactory.prototype._getDefaultSize = function (semantic) {

    if (is(semantic, 'bpmn:Task')) {
        return { width: 160, height: 50 };
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
    return { width: 100, height: 80 };

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
    'id="Definitions_1">' +
    '<bpmn:process id="Process_2" isExecutable="false">' +
    // '<bpmn:startEvent id="StartEvent_1"/>' +
    '</bpmn:process>' +
    '<bpmndi:BPMNDiagram id="BPMNDiagram_1">' +
    '<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_2">' +
    '<bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">' +
    '<dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/>' +
    '</bpmndi:BPMNShape>' +
    '</bpmndi:BPMNPlane>' +
    '</bpmndi:BPMNDiagram>' +
    '</bpmn:definitions>';



// zoom level mặc định, dùng cho zoomin zoomout
var zlevel = 1;
const RiskModel = (props) => {

    const { riskDistribution, task, translate } = props
    const [state, setState] = useState({
        xmlDiagram: null,
        risks: [],
        taskClassName: '',
        riskRelate: [],
        riskProb: -1
    })
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
    useEffect(() => {
        modeler.attachTo('#diagram');
        var eventBus = modeler.get('eventBus');

        //Vo hieu hoa double click edit label
        eventBus.on('element.dblclick', 10000, function (event) {
            var element = event.element;
            if (isAny(element, ['bpmn:Task'])) {
                return false; // will cancel event
            }
        });

        modeler.on('element.click', 1000, (e) => interactPopup(e));
    }, [])
    const getTaskClassName = (classNum) => {
        if (classNum == 1) return 'Các công việc ảnh hưởng tới yếu tố con người'
        if (classNum == 2) return 'Các công việc ảnh hưởng tới yếu tố con người và thiết bị'
        if (classNum == 3) return 'Các công việc ảnh hưởng tới các yếu tố sản phẩm'
        if (classNum == 4) return 'Các công việc chịu ảnh hưởng bởi các yếu tố : Thiết bị và môi trường'
    }

    useEffect(() => {
        let riskRelate = riskDistribution.filter(rd => rd.parents.length > 0 && rd.taskClass.includes(task.class))
        console.log('riskRelate', riskRelate)
        let prob = 1
        for (let rl of riskRelate) {
            prob = prob * rl.prob
        }
        // setState({
        //     ...state,
        //     riskProb:prob
        // })
        let className = getTaskClassName(task.class)
        let riskRelates = riskDistribution.filter(rd => rd.riskID < 5 && rd.taskClass.includes(task.class)).map(rd => {
            let data = {
                name: rd.name,
                prob: rd.prob
            }
            return data
        })
        setState({
            ...state,
            riskProb: prob,
            className: className,
            riskRelate: riskRelates
        })
        if (task && riskDistribution) modeler.importXML(initialDiagram, function () {
            let NUM_RISK_CLASS = 5;

            // (1) Get the modules
            var elementFactory = modeler.get('elementFactory'),
                elementRegistry = modeler.get('elementRegistry'),
                modeling = modeler.get('modeling'),
                bpmnFactory = modeler.get('bpmnFactory');
            var process = elementRegistry.get('Process_2');
            // Chọn các rui ro có liên quan đến task
            let riskAvailableList = riskDistribution.filter(rd => rd.taskClass.includes(task.class))
            console.log('riskAvailableList', riskAvailableList)
            // Lấy các nút lớp của rủi ro
            let riskClassList = riskDistribution.filter(rd => rd < NUM_RISK_CLASS)


            // Tao cac nut
            for (let risk of riskDistribution) {
                var taskBusinessObject = bpmnFactory.create('bpmn:Task', {
                    id: risk._id.toString(),
                    parents: risk.parents,
                    riskProb: risk.prob,
                    taskClass: task.class,
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
            for (let risk of riskDistribution) {
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
            // Tao nut rui ro cha
            // console.log('taskClass', task)
            // Lấy các nút rủi ro tương ứng với task
            let riskRelate = riskDistribution.filter(rd => rd.parents.length > 0 && rd.taskClass.includes(task.class))
            let prob = 1
            for (let rl of riskRelate) {
                prob = prob * rl.prob
            }
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
            for (let risk of riskDistribution) {
                let dashed = riskAvailableList.includes(risk) ? false : true,
                    width = riskAvailableList.includes(risk) ? '3px' : '2px',
                    colorUpdate = riskAvailableList.includes(risk) ? 'red' : '#424242';
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
                fill: getColor(prob),
                stroke: '#14984c', //E02001
                width: '5px'
            });
            // Noi cac nut voi nhau
            for (let risk of riskDistribution) {
                let dashed = riskAvailableList.includes(risk) ? false : true,
                    width = riskAvailableList.includes(risk) ? '3px' : '2px',
                    colorUpdate = riskAvailableList.includes(risk) ? 'red' : '#424242';
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




    }, [task])


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
    const [risk, setRisk] = useState(null)
    const interactPopup = (event) => {
        var element = event.element;
        let nameStr = element.type.split(':');

        if (element.type === 'bpmn:Task') {
            console.log(element.businessObject.id)
            if (element.type === 'bpmn:Task') {
                let risk = riskDistribution.find(rd => rd._id == element.businessObject.id)
                console.log('selected', risk)
                setRisk(risk)
                window.$(`#modal-show-risk`).modal("show");
            }

        }

    }
    const handleShowListCPT = (e) => {
        window.$('#modal-show-list-cpt').modal('show')
    }
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-show-risk-data`}
                title={translate('process_analysis.risk_model.title')}
                hasSaveButton={false}
                size={100}>
                {risk && <RiskDetailInfo riskInfo={risk}></RiskDetailInfo>}
                <div className="contain-border col-sm-8" style={{ height: '500px' }}>
                    <div id="diagram" style={{ height: '470px' }}></div>
                    <div className="row">
                        <div className="io-zoom-controls">
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
                {/* Description  */}

                <div className='description-box without-border col-sm-4'>
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">{translate('process_analysis.risk_model.risk_model_info')}</div>
                        </div>
                        <div className="box-body">
                            
                            <div>
                                <strong>{translate('process_analysis.risk_model.occurrence_probability')}:  {task && <span>{roundProb(state.riskProb)} (%)</span>} </strong>
                                <div class="progress progress-sm active">
                                    <div class="progress-bar progress-bar-success progress-bar-striped"
                                        role="progressbar"
                                        aria-valuenow="20"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                        style={{
                                            width: roundProb(state.riskProb) + '%',
                                            backgroundColor: getRiskColor(state.riskProb)
                                        }}>
                                        <span class="sr-only">20% Complete</span>
                                    </div>
                                </div>

                            </div>
                            <div>
                                <strong>{'Tên công việc chịu ảnh hưởng'}:</strong>
                                <a>{task && task.name}</a>
                            </div>
                            <div>
                                <strong>{'Lớp công việc'}:</strong>
                                <span>{task && state.className}</span>
                            </div>
                            
                            <div>
                                <strong>{translate('process_analysis.risk_model.risk_class_related')}: </strong>
                                <ul>
                                    {state.riskRelate.map(rl => <li>{rl.name + '(' + roundProb(rl.prob) + ' % )'}</li>)}
                                </ul>
                            </div>
                            <div >
                                <a  onClick={handleShowListCPT}>{translate('process_analysis.risk_model.view_cpt')}</a>
                            </div>
                            <div style={{ textAlign: 'center',paddingBottom:'5px' }}>
                                {task && riskDistribution.length != 0 && riskDistribution != undefined && <CPTTable lists={riskDistribution}></CPTTable>}
                            </div>
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div className="box-title">{translate('process_analysis.risk_model.note')}</div>
                                </div>
                                <div className="box-body">
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <div style={{ backgroundColor: getRiskColor(0.4), height: "30px", width: "40px", border: "2px solid #000", borderRadius: "3px", marginRight: "5px", marginTop: 4 }}></div>{translate('process_analysis.risk_model.low')}
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <div style={{ backgroundColor: getRiskColor(0.6), height: "30px", width: "40px", border: "2px solid #14984c", borderRadius: "3px", marginRight: "5px", marginTop: 4 }}></div>{translate('process_analysis.risk_model.medium')}
                                    </div>
                                    <div style={{ display: "flex",alignItems: "center" }}>
                                        <div style={{ backgroundColor: getRiskColor(0.92), height: "30px", width: "40px", border: "2px solid #c4c4c7", borderRadius: "3px", marginRight: "5px", marginTop: 4 }}></div>{translate('process_analysis.risk_model.high')}
                                    </div>
                                    <div style={{display: "flex",alignItems: "center" }}>
                                        <p><span style={{fontSize:'30px'}}>&#8674;</span><span> :Không ảnh hưởng</span></p>
                                        <p><span style={{fontSize:'30px'}}>&#8594;</span><span> :Có ảnh hưởng</span></p>
                                    </div>
                                  
                                </div>
                            </div>


                        </div>
                    </div>

                </div>

            </DialogModal>
        </React.Fragment>
    )
}
function mapState(state) {
    const { taskPert } = state;
    return { taskPert };
}

const actionCreators = {

};
const connectedRiskModel = connect(mapState, actionCreators)(withTranslate(RiskModel));
export { connectedRiskModel as RiskModel };