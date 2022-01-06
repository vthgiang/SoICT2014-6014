import React, { Component, useEffect, useState } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { getStorage } from '../../../../../config';
import { TaskProcessActions } from '../../redux/actions';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import { ErrorLabel, QuillEditor, SelectBox } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';

function ViewProcessTemplateChild(props) {
    // let userId = getStorage
    let userId = getStorage("userId")

    const [state, setState] = useState({
        
        currentRole: localStorage.getItem('currentRole'),
    })
    useEffect(async() => {
        const {infoTemplate} = props
        // console.log(infoTemplate);
        await props.getXmlDiagramById(infoTemplate.process)
        // setState({
        //     ...state,
        //     newProcessTemplate: {
        //         creator:currentDiagram.creator ? currentDiagram.creator : '',
        //         numberOfUse:currentDiagram.numberOfUse ? currentDiagram.numberOfUse : "",
        //         privileges:currentDiagram.privileges ? currentDiagram.privileges : "",
        //         processDescription:currentDiagram.processDescription ? currentDiagram.processDescription : "",
        //         processName:currentDiagram.processName ? currentDiagram.processName : "",
        //         tasks:currentDiagram.tasks ? currentDiagram.tasks : [],
        //         xmlDiagram:currentDiagram.xmlDiagram ? currentDiagram.xmlDiagram : "",
        //         _id:currentDiagram._id,
        //         viewer: currentDiagram.viewer ? currentDiagram.viewer : [],
        //         manager: currentDiagram.manager ? currentDiagram.manager : [] ,
        //     },
        //     show:currentDiagram.processName ? true : false ,
        // })
        
        // props.getAllDepartments()
        // props.getAllXmlDiagram(state.pageNumber, state.noResultsPerPage, "");
        // props.getRoles();
    }, [props.id])
   
 
    const showProcessTemplate = async (item) => {
        props.handleDataProcessTempalte(props.taskProcess.currentDiagram)
        // window.$(`#modal-show-process-tempalte`).modal("show");
    }
    const {translate, taskProcess, role} = props
    const {newProcessTemplate,show} = state
    const { currentDiagram} = taskProcess
    // console.log(currentDiagram);

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-lg-12">
                    {currentDiagram && 
                        <div>
                            {/**Tên mẫu quy trình */}
                            <div className={`form-group ${currentDiagram.errorOnName === undefined ? "" : "has-error"}`} >
                                <label className="control-label">{translate('task.task_template.process_template_name')} <span style={{ color: "red" }}>*</span></label>
                                <p type="Name">{currentDiagram.processName}</p>
                            </div>
                            {/* Mô tả quy trình */}
                            <div className={`form-group`}>
                                <label className="control-label">{translate('task.task_process.process_description')}</label>
                                <p>{currentDiagram.processDescription}</p>
                            </div>
                            <div className="description-box">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ fontSize: '17px', marginRight: '5px' }} className="material-icons">
                                        people_alt
                                    </span>
                                    <h4>
                                        {translate('task.task_management.role')}
                                    </h4>
                                    
                                </div>
                                {/* Người quản lý mẫu quy trình */}
                                <strong>{translate("task.task_process.manager")}:</strong>
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {
                                        currentDiagram?.manager?.length > 0 && currentDiagram.manager.map((item, index) => {
                                            return( 
                                                <span key={index} className="raci-style">
                                                    <img src={process.env.REACT_APP_SERVER + "/upload/avatars/user.png"} className="img-circle" style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} alt="User avatar" />    
                                                    <span>{item.name}</span>
                                                </span>
                                            )
                                        })
                                    }
                                </div>

                                {/* Người được xem mẫu quy trình */}
                                <strong>{translate("task.task_process.viewer")}:</strong>
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {
                                        currentDiagram?.viewer?.length > 0 && currentDiagram.viewer.map((item, index) => {
                                            return( 
                                                <span key={index} className="raci-style">
                                                    <img src={process.env.REACT_APP_SERVER + "/upload/avatars/user.png"} className="img-circle" style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} alt="User avatar" />    
                                                    <span>{item.name}</span>
                                                </span>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <span onClick={showProcessTemplate}>
                                Xem chi tiết quy trình 
                            </span>
                        </div>
                    }
                </div>
            </div>
        </React.Fragment>
    );
}

function mapState(state) {
    const { taskProcess } = state;
    return {taskProcess};
}

const actionCreators = {
    getXmlDiagramById: TaskProcessActions.getXmlDiagramById,
};
const connectedAddProcessTemplate = connect(mapState, actionCreators)(withTranslate(ViewProcessTemplateChild));
export { connectedAddProcessTemplate as ViewProcessTemplateChild };