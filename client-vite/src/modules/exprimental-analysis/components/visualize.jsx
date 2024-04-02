import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import React, { useEffect } from 'react';
import { exprimentalAnalysisActions } from '../redux/actions'
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { useState } from 'react';
import { DialogModal } from '../../../common-components';
import customModule from './risk-diagram';
import { VisualizeRisk } from './risk-visualize';
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
    '<bpmn:process id="Process_4" isExecutable="false">' +
    '</bpmn:process>' +
    '<bpmndi:BPMNDiagram id="BPMNDiagram_2">' +
    '<bpmndi:BPMNPlane id="BPMNPlane_2" bpmnElement="Process_3">' +
    '</bpmndi:BPMNPlane>' +
    '</bpmndi:BPMNDiagram>' +
    '</bpmn:definitions>';
var zlevel = 1;

const Visualize = (props) => {
    const { translate, exprimentalData } = props
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
            }
        ],
    }))
    
    const [task,setTask] = useState(undefined)
    useEffect(()=>{
        window.$(`#visualize-risk`).modal("show");
    },[task])
    const interactPopup = (event) => {
        var element = event.element;
        if (element.type === 'bpmn:Task') {
            // console.log(element.businessObject.id)
            let taskData = exprimentalData.data.taskData
            let task = taskData.find(t=> t._id==element.businessObject.id)
            console.log(task)
            setTask(task)
            
            // alert('Hello')
            // if (element.type === 'bpmn:Task') {
            //     let risk = riskDistribution.find(rd => rd._id == element.businessObject.id)
            //     console.log('selected', risk)
            //     setRisk(risk)
            //     window.$(`#modal-show-risk`).modal("show");
            // }
        }

    }
    useEffect(() => {
        modeler.attachTo('#diagram');
        var eventBus = modeler.get('eventBus');
        console.log(eventBus)
        //Vo hieu hoa double click edit label
        eventBus.on('element.dblclick', 10000, function (event) {
            var element = event.element;
            if (isAny(element, ['bpmn:Task'])) {
                return false; // will cancel event
            }
        });
        modeler.on('element.click', 1000, (e) => interactPopup(e));

    }, [])
    useEffect(() => {
        if (exprimentalData.data.riskData.length != 0) {
            console.log('exprimental Data', exprimentalData)
            modeler.importXML(initialDiagram, function () {
                var elementFactory = modeler.get('elementFactory'),
                    elementRegistry = modeler.get('elementRegistry'),
                    modeling = modeler.get('modeling'),
                    bpmnFactory = modeler.get('bpmnFactory');
                var process = elementRegistry.get('Process_4');
                let riskData = exprimentalData.data.riskData
                let taskData = exprimentalData.data.taskData
                // update successors
                for(let task of taskData){
                    task.successor = taskData.filter(t=> t.predecessor.includes(task.ID)).map( t => t.ID)
                }
                console.log(taskData)
                let i = 0
                for (let task of taskData) {
                    console.log('draw', task)
                    var taskBusinessObject = bpmnFactory.create('bpmn:Task', {
                        id: task._id.toString(),
                        parents: task.parents,
                        riskProb: task.prob,
                        taskClass: task.taskClass,
                        riskName: task.name,
                        parentList: task.parentList,
                        riskID: task.ID,
                        isTask: true,
                        duration:task.duration,
                        es:task.es,
                        ef:task.ef,
                        lf:task.lf,
                        ls:task.ls
                    });
                    i += 200
                    var riskNode = elementFactory.createShape({ type: 'bpmn:Task', businessObject: taskBusinessObject });
                    // Search
                    modeling.createShape(riskNode, { x: 400 + i, y: 150 }, process);
                }
                // replace các vị trí
                let c= 0 
                let temp = []
                for(let task of taskData){
                    temp = [...temp,task.ID]
                    var successor = task.successor
                    if(successor.length==2){
                        let element1 = elementRegistry.get(taskData.find(t => t.ID == successor[0])._id);
                        modeling.moveElements([element1], {
                            x: 0,   
                            y: 150 
                        })
                        temp.push(successor[0])
                        let elements = taskData.filter(t => !temp.includes(t.ID)).map(t => elementRegistry.get(t._id))
                        modeling.moveElements(elements, {
                            x: -170,
                            y: 0
                        })
                    }
                    i++
                }
                //connect 
                for (let task of taskData) {
                    let dashed = false,
                        width = '2px',
                        colorUpdate = 'red';
                    let element1 = elementRegistry.get(task._id)
                    let successor = task.successor
                    if(successor.length!=0){
                        for(let succ of successor){
                            let succNode = elementRegistry.get(taskData.find(t => t.ID == succ)._id)
                            modeling.connect(element1, succNode, {
                                type: 'bpmn:SequenceFlow',
                                colorUpdate: colorUpdate,
                                dashed: dashed,
                                width: width,

                            });   
                        }
                        
                    }
                    

                }

            })

        }
        //vẽ mạng công việc

    }, [exprimentalData])
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
    const save = () => {

    }
    return (
        <React.Fragment>
            <DialogModal
                modalID="visualize"
                formID="visulize"
                title={"Input"}
                msg_success={translate('manage_risk.add_success')}
                msg_faile={translate('manage_risk.add_fail')}
                // func={save}
                // disableSubmit={!isFormValidated()}
                size={75}
                maxWidth={500}
            >
                {task&&<VisualizeRisk task = {task}></VisualizeRisk>}
                <div className="box">
                    <div className="box-body">
                        <div className="row">
                            <div id="diagram" style={{ height: 400 }}></div>
                        </div>
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
                </div>
            </DialogModal>
        </React.Fragment>
    )
}
function mapState(state) {
    const { risk, exprimentalData } = state;
    // console.log(risk)
    return { risk, exprimentalData }
}

const actions = {

}
const connectedVisualize = connect(mapState, actions)(withTranslate(Visualize));
export { connectedVisualize as Visualize };