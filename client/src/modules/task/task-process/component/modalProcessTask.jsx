import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { FormInfoTask } from "./formInfoTask";
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/diagram-js.css';

class ModalProcessTask extends Component {

    constructor() {
        super();
        this.state = {
            showInfo: false,
            info: {},
        }
        this.modeler = new BpmnModeler();
        this.generateId = 'createprocess';
        this.initialDiagram =
            '<?xml version="1.0" encoding="UTF-8"?>' +
            '<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
            'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
            'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
            'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" ' +
            'targetNamespace="http://bpmn.io/schema/bpmn" ' +
            'id="Definitions_1">' +
            '<bpmn:process id="Process_1" isExecutable="false">' +
            // '<bpmn:startEvent id="StartEvent_1"/>' +
            '</bpmn:process>' +
            '<bpmndi:BPMNDiagram id="BPMNDiagram_1">' +
            '<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">' +
            '<bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">' +
            '<dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/>' +
            '</bpmndi:BPMNShape>' +
            '</bpmndi:BPMNPlane>' +
            '</bpmndi:BPMNDiagram>' +
            '</bpmn:definitions>';
    }

    render() {
        // return (
        // <React.Fragment>
        //     <div>
        //         <div id={this.generateId}></div>
        //         <button onClick={this.exportDiagram}>Export XML</button>
        //         <button onClick={this.downloadAsSVG}>Save SVG</button>
        //         <button onClick={this.downloadAsImage}>Save Image</button>
        //         <button onClick={this.downloadAsBpmn}>Download BPMN</button>
        //     </div>
        // </React.Fragment>

        // );
        return (
            <React.Fragment>
                <div className='box'>
                    <div className='row'>
                        <div id={this.generateId} className={this.state.showInfo ? 'col-md-8' : 'col-md-12'}></div>
                        <div className={this.state.showInfo ? 'col-md-4' : undefined}>
                            {/* <Header name={this.state.name && this.state.name} /> */}
                            <div>
                                <h1>Option {this.state.name}</h1>
                            </div>
                            {
                                (this.state.showInfo) &&
                                <div>
                                    <Header name={this.state.name && this.state.name} />
                                    <FormInfoTask
                                        id={this.state.id}
                                        info={this.state.info}
                                        handleChangeName={this.handleChangeName}
                                        handleChangeDescription={this.handleChangeDescription}
                                        handleChangeResponsible={this.handleChangeResponsible}
                                        handleChangeAccountable={this.handleChangeAccountable}

                                        save={this.save}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div>
                    {/* <div id={this.generateId}></div> */}
                    <button onClick={this.exportDiagram}>Export XML</button>
                    <button onClick={this.downloadAsSVG}>Save SVG</button>
                    <button onClick={this.downloadAsImage}>Save Image</button>
                    <button onClick={this.downloadAsBpmn}>Download BPMN</button>
                </div>

            </React.Fragment>
        )
    }

    save = async (e) => {
        // save button
        console.log('Click Save button!!! Call API');
    }

    handleChangeName = async (e) => {
        let { value } = e.target;
        // console.log('e.target.value', value);
        await this.setState(state => {
            state.info[`${state.id}`] = {
                ...state.info[`${state.id}`],
                code: state.id,
                nameTask: value,
            }
            return {
                ...state,
            }
        })
        console.log(this.state.info);
    }

    handleChangeDescription = async (e) => {
        let { value } = e.target;
        await this.setState(state => {
            state.info[`${state.id}`] = {
                ...state.info[`${state.id}`],
                code: state.id,
                description: value,
            }
            return {
                ...state,
            }
        })
        console.log(this.state.info);
    }

    handleChangeResponsible = async (value) => {
        // let { value } = e.target;
        await this.setState(state => {
            state.info[`${state.id}`] = {
                ...state.info[`${state.id}`],
                code: state.id,
                responsible: value,
            }
            return {
                ...state,
            }
        })
        console.log(this.state.info);
    }

    handleChangeAccountable = async (value) => {
        await this.setState(state => {
            state.info[`${state.id}`] = {
                ...state.info[`${state.id}`],
                code: state.id,
                accountable: value,
            }
            return {
                ...state,
            }
        })
        console.log(this.state.info);
    }

    componentDidMount() {
        this.modeler.attachTo('#' + this.generateId);
        this.modeler.importXML(this.initialDiagram, function (err) {

        });

        var eventBus = this.modeler.get('eventBus');
        console.log(eventBus);
        this.modeler.on('element.click', 1, (e) => this.interactPopup(e));

        this.modeler.on('shape.remove', 1000, (e) => this.deleteElements(e));

        this.modeler.on('commandStack.shape.delete.revert', (e) => this.handleUndoDeleteElement(e));

        this.modeler.on('shape.changed', 1, (e) => this.changeNameElement(e));
        // console.log(eventBus);
    }

    // interactPopup = (event) => {
    //     var element = event.element;
    //     console.log(element, event);
    //     this.setState(state => {
    //         return {
    //             ...state,
    //             showForm: !this.state.showForm,
    //         }
    //     })
    // }

    interactPopup = (event) => {
        var element = event.element;
        let nameStr = element.type.split(':');
        console.log(nameStr);
        this.setState(state => {
            if (element.type !== 'bpmn:Collaboration') {
                return { ...state, showInfo: true, type: element.type, name: nameStr[1], taskName: element.businessObject.name, id: element.businessObject.id, }
            }
            else {
                return { ...state, showInfo: false, type: element.type, name: '', id: element.businessObject.id, }
            }

        })
        console.log(event, element, element.businessObject.id);
    }

    deleteElements = (event) => {
        var element = event.element;
        console.log(element);
    }

    handleUndoDeleteElement = (event) => {
        var element = event.context.shape;
        console.log(element);
    }

    changeNameElement = (event) => {
        var element = event.element;
        console.log(element);
    }

    exportDiagram = () => {
        let xmlStr;
        this.modeler.saveXML({ format: true }, function (err, xml) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(xml);
                xmlStr = xml;
            }
        });
        this.setState(state => {
            // state.info[`xmlDiagram`] = xmlStr;
            return {
                ...state,
                xmlDiagram: xmlStr,
            }
        })
    }

    downloadAsSVG = () => {
        this.modeler.saveSVG({ format: true }, function (error, svg) {
            if (error) {
                return;
            }

            var svgBlob = new Blob([svg], {
                type: 'image/svg+xml'
            });

            var fileName = Math.random(36).toString().substring(7) + '.svg';

            var downloadLink = document.createElement('a');
            downloadLink.download = fileName;
            downloadLink.innerHTML = 'Get BPMN SVG';
            downloadLink.href = window.URL.createObjectURL(svgBlob);
            downloadLink.onclick = function (event) {
                document.body.removeChild(event.target);
            };
            downloadLink.style.visibility = 'hidden';
            document.body.appendChild(downloadLink);
            downloadLink.click();
        });
    }

    downloadAsBpmn = () => {
        this.modeler.saveXML({ format: true }, function (error, xml) {
            if (error) {
                return;
            }
        });
    }

    downloadAsImage = () => {
        this.modeler.saveSVG({ format: true }, function (error, svg) {
            if (error) {
                return;
            }
            function triggerDownload(imgURI) {
                var evt = new MouseEvent('click', {
                    view: window,
                    bubbles: false,
                    cancelable: true
                });

                var a = document.createElement('a');
                a.setAttribute('download', 'MY_COOL_IMAGE.png');
                a.setAttribute('href', imgURI);
                a.setAttribute('target', '_blank');

                a.dispatchEvent(evt);
            }
            var canvas = document.createElement("CANVAS");
            var ctx = canvas.getContext('2d');
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
            var DOMURL = window.URL || window.webkitURL || window;

            var img = new Image();
            var svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
            var url = DOMURL.createObjectURL(svgBlob);

            img.onload = function () {

                DOMURL.revokeObjectURL(url);
                ctx.drawImage(img, 0, 0);
                var imgURI = canvas
                    .toDataURL('image/png')
                    .replace('image/png', 'image/octet-stream');

                triggerDownload(imgURI);
            };

            img.src = url;
        });
    }
}


function mapState(state) {
    const { user, auth } = state;
    return { user, auth };
}

const actionCreators = {
    // getTaskTemplateByUser: taskTemplateActions.getAllTaskTemplateByUser,
    // getDepartment: UserActions.getDepartmentOfUser,
    // _delete: taskTemplateActions._delete
};
const connectedModalAddProcess = connect(mapState, actionCreators)(withTranslate(ModalProcessTask));
export { connectedModalAddProcess as ModalProcessTask };
