import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { FormInfoTask } from "./formInfoTask";
import { DialogModal, SelectBox } from "../../../../common-components";
import { UserActions } from "../../../super-admin/user/redux/actions";
import { getStorage } from '../../../../config';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import './processDiagram.css'
import { TaskProcessActions } from "../redux/actions";
import { DepartmentActions } from "../../../super-admin/organizational-unit/redux/actions";

//Xóa element khỏi pallette theo data-action
var _getPaletteEntries = PaletteProvider.prototype.getPaletteEntries;
PaletteProvider.prototype.getPaletteEntries = function (element) {
   var entries = _getPaletteEntries.apply(this);
   delete entries['create.subprocess-expanded'];
   delete entries['create.data-store'];
   delete entries['create.data-object'];
   delete entries['create.group'];
   delete entries['create.participant-expanded'];
   delete entries['create.intermediate-event'];
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
      this.modeler = new BpmnModeler();
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

   handleChangeName = async (value) => {
      let { listOrganizationalUnit } = this.props
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

      this.modeler.on('element.click', 1, (e) => this.interactPopup(e));

      this.modeler.on('shape.remove', 1000, (e) => this.deleteElements(e));

      this.modeler.on('commandStack.shape.delete.revert', (e) => this.handleUndoDeleteElement(e));

      this.modeler.on('shape.changed', 1, (e) => this.changeNameElement(e));
   }

   interactPopup = (event) => {
      let element = event.element;
      let { department } = this.props
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
      var element = event.element;
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
      console.log('state', this.state);
   }

   handleChangeManager = async (value) => {
      await this.setState(state => {

         return {
            ...state,
            manager: value,
         }
      })
      console.log('state', this.state);
   }

   render() {
      const { translate, department, role } = this.props;
      const { id, info, showInfo, processDescription, processName, viewer, manager, selectedCreate } = this.state;
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
            >
               <form id="form-create-process-task">
                  <div>
                     <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none" }}>
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
                        <div className="tab-content">
                           <div className={selectedCreate === "process" ? "active tab-pane" : "tab-pane"} id="process-create">
                              <fieldset className="scheduler-border">
                                 {/* <legend className="scheduler-border">Quy trình công việc</legend> */}
                                 <div className='row'>
                                    <div id={this.generateId} className={this.state.showInfo ? 'col-md-8' : 'col-md-12'}></div>
                                    <div className={this.state.showInfo ? 'col-md-4' : undefined}>

                                       {
                                          (showInfo) &&
                                          <div>
                                             <div>
                                                <h1>Option {this.state.name}</h1>
                                             </div>
                                             <FormInfoTask
                                                listOrganizationalUnit={listOrganizationalUnit}
                                                action='create'
                                                id={id}
                                                info={(info && info[`${id}`]) && info[`${id}`]}
                                                handleChangeName={this.handleChangeName}
                                                handleChangeDescription={this.handleChangeDescription}
                                                handleChangeOrganizationalUnit={this.handleChangeOrganizationalUnit}
                                                handleChangeResponsible={this.handleChangeResponsible}
                                                handleChangeAccountable={this.handleChangeAccountable}
                                                save={this.save}
                                             />
                                          </div>
                                       }
                                    </div>
                                 </div>
                                 <div>
                                    <button onClick={this.exportDiagram}>Export XML</button>
                                    <button onClick={this.downloadAsSVG}>Save SVG</button>
                                    <button onClick={this.downloadAsImage}>Save Image</button>
                                    <button onClick={this.downloadAsBpmn}>Download BPMN</button>
                                 </div>
                              </fieldset>
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
