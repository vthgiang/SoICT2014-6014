import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { FormInfoProcess } from "./formInfoProcess";
import { DialogModal, SelectBox } from "../../../../common-components";
import { UserActions } from "../../../super-admin/user/redux/actions";
import { getStorage } from '../../../../config';
import BpmnModeler from 'bpmn-js/lib/Modeler';
// import Modeling from 'bpmn-js/lib/features/Modeling'
// import elementRegistry from ''
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import './processDiagram.css'
import { TaskProcessActions } from "../redux/actions";
import { DepartmentActions } from "../../../super-admin/organizational-unit/redux/actions";
import customModule from './custom'

import { is } from 'bpmn-js/lib/util/ModelUtil';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'
import { isExpanded } from 'bpmn-js/lib/util/DiUtil';
import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory';
import LabelEditingProvider from 'bpmn-js/lib/features/label-editing/LabelEditingProvider'
import { AddTaskTemplate } from "../../task-template/component/addTaskTemplate";


ElementFactory.prototype._getDefaultSize = function (semantic) {

   if (is(semantic, 'bpmn:Task')) {
      return { width: 160, height: 130 };
   }

   if (is(semantic, 'bpmn:Gateway')) {
      return { width: 50, height: 50 };
   }

   if (is(semantic, 'bpmn:Event')) {
      return { width: 36, height: 36 };
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
   delete entries['create.subprocess-expanded'];
   delete entries['create.data-store'];
   delete entries['create.data-object'];
   delete entries['create.group'];
   delete entries['create.participant-expanded'];
   delete entries['create.intermediate-event'];
   delete entries['create.task'];
   return entries;
}
const initialDiagram =
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


var zlevel = 1;

class ModalCreateTaskProcess extends Component {

   constructor() {
      super();
      this.state = {
         userId: getStorage("userId"),
         currentRole: getStorage('currentRole'),
         showInfo: false,
         selectedCreate: 'info',
         info: {},
         save: false
      }
      this.initialDiagram = initialDiagram
      this.modeler = new BpmnModeler({
         additionalModules: [
            customModule,
            // { moveCanvas: [ 'value', null ] },
            { zoomScroll: ['value', ''] }
         ],
      });
      this.modeling = this.modeler.get('modeling');
      this.generateId = "createprocess"
   }
   handleChangeBpmnName = async (e) => {
      let { value } = e.target;
      await this.setState(state => {
         return {
            ...state,
            processName: value,
         }
      });
   }

   handleChangeBpmnDescription = async (e) => {
      let { value } = e.target;
      await this.setState(state => {
         return {
            ...state,
            processDescription: value,
         }
      });
   }

   handleUpdateElement = (abc) => {
      console.log("hihihihi")
      const modeling = this.modeler.get('modeling');
      let element1 = this.modeler.get('elementRegistry').get(this.state.id);
      modeling.updateProperties(element1, {
         info: this.state.info,
      });
   }

   handleChangeName = async (value) => {
      const modeling = this.modeler.get('modeling');
      let element1 = this.modeler.get('elementRegistry').get(this.state.id);
      modeling.updateProperties(element1, {
         name: value,
      });
   }

   handleChangeDescription = async (value) => {
      let { listOrganizationalUnit } = this.props
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
      this.handleUpdateElement();
   }
   handleChangeOrganizationalUnit = async (value) => {
      await this.setState(state => {
         state.info[`${state.id}`] = {
            ...state.info[`${state.id}`],
            code: state.id,
            organizationalUnit: value,
         }
         return {
            ...state,
         }
      })
      this.handleUpdateElement();
   }

   handleChangeTemplate = async (value) => {
      await this.setState(state => {
         state.info[`${state.id}`] = {
            ...state.info[`${state.id}`],
            code: state.id,
            taskTemplate: value,
         }
         return {
            ...state,
         }
      })
      this.handleUpdateElement();
   }

   handleChangeResponsible = async (value) => {
      let { user } = this.props
      let responsible = []
      user.usercompanys.forEach(x => {
         if (value.some(y => y === x._id)) {
            responsible.push(x.name)
         }
      })
      const modeling = this.modeler.get('modeling');
      let element1 = this.modeler.get('elementRegistry').get(this.state.id);
      modeling.updateProperties(element1, {
         responsibleName: responsible
      });
   }

   handleChangeAccountable = async (value) => {
      let { user } = this.props
      let accountable = []
      user.usercompanys.forEach(x => {
         if (value.some(y => y === x._id)) {
            accountable.push(x.name)
         }
      })
      const modeling = this.modeler.get('modeling');
      let element1 = this.modeler.get('elementRegistry').get(this.state.id);
      modeling.updateProperties(element1, {
         accountableName: accountable
      });
   }
   shouldComponentUpdate(nextProps, nextState) {
      if (nextState.save === true) {
         this.props.getAllDepartments()
         this.modeler.importXML(this.initialDiagram);
         this.setState({
            save: false,
         });
         return true;
      }
      return true
   }
   componentDidMount() {

      this.props.getAllDepartments();
      this.modeler.attachTo('#' + this.generateId);
      this.modeler.importXML(this.initialDiagram);
      var eventBus = this.modeler.get('eventBus');

      //Vo hieu hoa double click edit label
      eventBus.on('element.dblclick', 10000, function (event) {
         var element = event.element;

         if (isAny(element, ['bpmn:Task'])) {
            return false; // will cancel event
         }
      });


      //Vo hieu hoa edit label khi tao shape
      eventBus.on([
         'create.end',
         'autoPlace.end'
      ], 250, (e) => {
         // if (e.element[0].type === "bpmn:Task") {
         this.modeler.get('directEditing').cancel()
         // }
      });

      this.modeler.on('element.click', 1, (e) => this.interactPopup(e));

      this.modeler.on('shape.remove', 1000, (e) => this.deleteElements(e));

      this.modeler.on('commandStack.shape.delete.revert', (e) => this.handleUndoDeleteElement(e));

      this.modeler.on('shape.changed', 1, (e) => this.changeNameElement(e));
   }
   done = (e) => {
      e.preventDefault()
      let element1 = this.modeler.get('elementRegistry').get(this.state.id);
      this.modeling.setColor(element1, {
         fill: '#dde6ca',
         stroke: '#6b7060'
      });
      let target = [];
      element1.outgoing.forEach(x => {
         target.push(x.target.id)
      })
      target.forEach(x => {
         this.modeling.setColor(this.modeler.get('elementRegistry').get(x), {
            fill: '#7236ff',
            stroke: '#7236ff'
         });
      })
   }
   interactPopup = (event) => {
      let element = event.element;
      console.log(element)
      let { department } = this.props
      let source = [];
      let destination = []
      element.incoming.forEach(x => {
         source.push(x.source.businessObject.name)
      })

      element.outgoing.forEach(x => {
         destination.push(x.target.businessObject.name)
      })
      let nameStr = element.type.split(':');
      this.setState(state => {
         if (element.type !== 'bpmn:Collaboration' && element.type !== 'bpmn:Process' && element.type !== 'bpmn:StartEvent' && element.type !== 'bpmn:EndEvent' && element.type !== 'bpmn:SequenceFlow') {

            if (!state.info[`${element.businessObject.id}`] ||
               (state.info[`${element.businessObject.id}`] && !state.info[`${element.businessObject.id}`].organizationalUnit)) {
               state.info[`${element.businessObject.id}`] = {
                  ...state.info[`${element.businessObject.id}`],
                  organizationalUnit: this.props.listOrganizationalUnit[0]?._id,
               }
            }
            return {
               ...state,
               showInfo: true,
               type: element.type,
               name: nameStr[1],
               taskName: element.businessObject.name,
               id: `${element.businessObject.id}`,
            }
         }
         else {
            return { ...state, showInfo: false, type: element.type, name: '', id: element.businessObject.id, }
         }
      }, () => console.log(this.state))
   }

   deleteElements = (event) => {
      var element = event.element;
   }

   handleUndoDeleteElement = (event) => {
      var element = event.context.shape;
   }

   changeNameElement = (event) => {
      this.setState(state => {
         state.info[`${state.id}`] = {
            ...state.info[`${state.id}`],
            nameTask: event.element.businessObject.name,
         }
         return {
            ...state,
         }
      })
   }
   save = async () => {
      let { department } = this.props
      let xmlStr;
      this.modeler.saveXML({ format: true }, function (err, xml) {
         xmlStr = xml;
      });
      await this.setState(state => {
         return {
            ...state,
            xmlDiagram: xmlStr,
         }
      })
      let data = {
         nameProcess: this.state.processName,
         description: this.state.processDescription,
         creator: this.state.userId,
         viewer: this.state.viewer,
         manager: this.state.manager,
         xmlDiagram: this.state.xmlDiagram,
         infoTask: this.state.info
      }
      for (const i in data.infoTask) {
         if (!data.infoTask[i].organizationalUnit) {
            data.infoTask[i].organizationalUnit = department.list[0]._id
         }
      }
      await this.props.createXmlDiagram(data)
      this.setState(state => {
         return {
            ...state,
            processName: null,
            processDescription: '',
            viewer: undefined,
            manager: undefined,
            save: true,
            selectedCreate: 'info',
            showInfo: false
         }
      });
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


   handleZoomOut = async () => {
      let zstep = 0.2;
      let canvas = this.modeler.get('canvas');
      let eventBus = this.modeler.get('eventBus');

      // set initial zoom level
      canvas.zoom(zlevel, 'auto');

      // update our zoom level on viewbox change
      await eventBus.on('canvas.viewbox.changed', function (evt) {
         zlevel = evt.viewbox.scale;
      });
      zlevel = Math.max(zlevel - zstep, zstep);
      canvas.zoom(zlevel, 'auto');
   }

   handleZoomReset = () => {
      let canvas = this.modeler.get('canvas');
      canvas.zoom('fit-viewport');
   }

   handleZoomIn = async () => {
      let zstep = 0.2;
      let canvas = this.modeler.get('canvas');
      let eventBus = this.modeler.get('eventBus');

      // set initial zoom level
      canvas.zoom(zlevel, 'auto');
      // update our zoom level on viewbox change
      await eventBus.on('canvas.viewbox.changed', function (evt) {
         zlevel = evt.viewbox.scale;
      });

      zlevel = Math.min(zlevel + zstep, 7);
      canvas.zoom(zlevel, 'auto');
   }

   // Các hàm xử lý sự kiện của form 
   handleChangeContent = async (content) => {
      await this.setState(state => {
         return {
            ...state,
            selectedCreate: content
         }
      })
   }

   handleChangeViewer = async (value) => {
      await this.setState(state => {

         return {
            ...state,
            viewer: value,
         }
      })
   }

   handleChangeManager = async (value) => {
      await this.setState(state => {

         return {
            ...state,
            manager: value,
         }
      })
   }

   handleChangeInfo = (value) => {
      let info = {
         ...value,
         codeId: this.state.id
      }

      this.setState(
         state => {
            state.info[`${state.id}`] = value
         }, () => console.log(this.state))

   }

   render() {
      const { translate, department, role } = this.props;
      const { id, name, info, showInfo, processDescription, processName, viewer, manager, selectedCreate } = this.state;
      const { listOrganizationalUnit } = this.props;

      let listRole = [];
      if (role && role.list.length !== 0) listRole = role.list;
      let listItem = listRole.filter(e => ['Admin', 'Super Admin', 'Dean', 'Vice Dean', 'Employee'].indexOf(e.name) === -1)
         .map(item => { return { text: item.name, value: item._id } });
      return (
         <React.Fragment>
            <DialogModal
               size='100'
               modalID="modal-create-process-task"
               isLoading={false}
               formID="form-create-process-task"
               resetOnSave={true}
               resetOnClose={true}
               title={this.props.title}
               func={this.save}
               bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
            >
               <form id="form-create-process-task">
                  <div>
                     <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none", marginBottom: 0 }}>
                        <ul className="nav nav-tabs">
                           <li className="active"><a href="#info-create" onClick={() => this.handleChangeContent("info")} data-toggle="tab">Thông tin quy trình</a></li>
                           <li><a href="#process-create" onClick={() => this.handleChangeContent("process")} data-toggle="tab">Quy trình công việc</a></li>
                        </ul>
                        <div className="tab-content">
                           <div className={selectedCreate === "info" ? "active tab-pane" : "tab-pane"} id="info-create">
                              <div className='row'>
                                 <div className='col-md-6'>
                                    <div className="form-group">
                                       <label>Tên quy trình</label>
                                       <input type="text"
                                          value={processName}
                                          className="form-control" placeholder="Mô tả công việc"
                                          onChange={this.handleChangeBpmnName}
                                       />
                                    </div>
                                    <div className="form-group">
                                       <label htmlFor="" >Người được phép xem</label>
                                       {
                                          <SelectBox
                                             id={`select-viewer-employee-create`}
                                             className="form-control select2"
                                             style={{ width: "100%" }}
                                             items={listItem}
                                             onChange={this.handleChangeViewer}
                                             multiple={true}
                                             value={viewer}
                                          />
                                       }
                                    </div>
                                    <div className="form-group">
                                       <label htmlFor="" >Người quản lý quy trình</label>
                                       {
                                          <SelectBox
                                             id={`select-manager-employee-create`}
                                             className="form-control select2"
                                             style={{ width: "100%" }}
                                             items={listItem}
                                             onChange={this.handleChangeManager}
                                             multiple={true}
                                             value={manager}
                                          />
                                       }
                                    </div>
                                 </div>
                                 <div className='col-md-6'>
                                    <div className="form-group">
                                       <label>Mô tả quy trình</label>
                                       <textarea type="text" rows={8}
                                          value={processDescription}
                                          className="form-control" placeholder="Mô tả công việc"
                                          onChange={this.handleChangeBpmnDescription}
                                       />
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="tab-content" style={{ padding: 0, marginTop: -15 }}>
                           <div className={selectedCreate === "process" ? "active tab-pane" : "tab-pane"} id="process-create">

                              <div className="">
                                 {/* Quy trình công việc */}
                                 <div className={`contain-border ${showInfo ? 'col-md-8' : 'col-md-12'}`}>
                                    <div className="tool-bar-xml" style={{ /*position: "absolute", right: 5, top: 5*/ }}>
                                       <button onClick={this.exportDiagram}>Export XML</button>
                                       <button onClick={this.downloadAsSVG}>Save SVG</button>
                                       <button onClick={this.downloadAsImage}>Save Image</button>
                                       <button onClick={this.downloadAsBpmn}>Download BPMN</button>
                                    </div>
                                    <div id={this.generateId}></div>
                                    <div className="row">
                                       <div className="io-zoom-controls">
                                          <ul className="io-zoom-reset io-control io-control-list">
                                             <li>
                                                <a style={{ cursor: "pointer" }} title="Reset zoom" onClick={this.handleZoomReset}>
                                                   <i className="fa fa-crosshairs"></i>
                                                </a>
                                             </li>
                                             <li>
                                                <a style={{ cursor: "pointer" }} title="Zoom in" onClick={this.handleZoomIn}>
                                                   <i className="fa fa-plus"></i>
                                                </a>
                                             </li>
                                             <li>
                                                <a style={{ cursor: "pointer" }} title="Zoom out" onClick={this.handleZoomOut}>
                                                   <i className="fa fa-minus"></i>
                                                </a>
                                             </li>
                                          </ul>
                                       </div>
                                    </div>
                                 </div>
                                 <div style={{overflow: "auto", height: "650px"}} className={showInfo ? 'col-md-4' : undefined}>
                                    {
                                       (showInfo) &&
                                       <div>
                                          <div>
                                             <h1>Option {name}</h1>
                                          </div>
                                          {/*
                                          <FormInfoProcess
                                             listOrganizationalUnit={listOrganizationalUnit}
                                             action='create'
                                             id={id}
                                             astemplate = {true}
                                             info={(info && info[`${id}`]) && info[`${id}`]}
                                             handleChangeName={this.handleChangeName}
                                             handleChangeDescription={this.handleChangeDescription}
                                             handleChangeResponsible={this.handleChangeResponsible}
                                             handleChangeAccountable={this.handleChangeAccountable}
                                             handleChangeOrganizationalUnit={this.handleChangeOrganizationalUnit}
                                             handleChangeTemplate={this.handleChangeTemplate}
                                             save={this.save}
                                             done={this.done}
                                          /> */}
                                          <AddTaskTemplate
                                             isProcess={true}
                                             id={id}
                                             info={(info && info[`${id}`]) && info[`${id}`]}
                                             onChangeTemplateData={this.handleChangeInfo}
                                             handleChangeName={this.handleChangeName} // cập nhật tên vào diagram
                                             handleChangeResponsible={this.handleChangeResponsible} // cập nhật hiển thi diagram
                                             handleChangeAccountable={this.handleChangeAccountable} // cập nhật hiển thị diagram
                                          />
                                       </div>
                                    }
                                 </div>
                              </div>
                           </div>
                        </div>

                     </div>

                  </div>
               </form>
            </DialogModal>
         </React.Fragment>
      )
   }
}


function mapState(state) {
   const { user, auth, department, role } = state;
   return { user, auth, department, role };
}

const actionCreators = {
   getAllDepartments: DepartmentActions.get,
   getDepartment: UserActions.getDepartmentOfUser,
   getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
   createXmlDiagram: TaskProcessActions.createXmlDiagram,
   getXmlDiagramById: TaskProcessActions.getXmlDiagramById,
};
const connectedModalAddProcess = connect(mapState, actionCreators)(withTranslate(ModalCreateTaskProcess));
export { connectedModalAddProcess as ModalCreateTaskProcess };
