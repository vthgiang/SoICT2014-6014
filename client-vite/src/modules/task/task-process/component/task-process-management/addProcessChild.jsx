import React, { Component, useEffect, useState } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'
import { getStorage } from '../../../../../config'
import { TaskProcessActions } from '../../redux/actions'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import { ErrorLabel, QuillEditor, SelectBox } from '../../../../../common-components'
import ValidationHelper from '../../../../../helpers/validationHelper'

function AddProcessChild(props) {
  // let userId = getStorage
  const userId = getStorage('userId')

  const [state, setState] = useState({
    newProcess: {
      processName: '',
      processDescription: '',
      viewer: [],
      manager: [],
      xmlDiagram: '',
      tasks: [],
      id: ''
    },
    currentRole: localStorage.getItem('currentRole'),
    show: false
  })
  useEffect(() => {
    props.getAllTaskProcess(1, 100000000, '')
  }, [])
  useEffect(() => {
    const { infoProcess, taskProcess } = props
    const taskProcessSelected = taskProcess.listTaskProcess?.find((data) => data._id === infoProcess)
    console.log(infoProcess, taskProcess)
    setState({
      ...state,
      newProcess: {
        creator: taskProcessSelected && taskProcessSelected.creator ? taskProcessSelected.creator : '',
        numberOfUse: taskProcessSelected && taskProcessSelected.numberOfUse ? taskProcessSelected.numberOfUse : '',
        privileges: taskProcessSelected && taskProcessSelected.privileges ? taskProcessSelected.privileges : '',
        processDescription: taskProcessSelected && taskProcessSelected.processDescription ? taskProcessSelected.processDescription : '',
        processName: taskProcessSelected && taskProcessSelected.processName ? taskProcessSelected.processName : '',
        tasks: taskProcessSelected && taskProcessSelected.tasks ? taskProcessSelected.tasks : [],
        xmlDiagram: taskProcessSelected && taskProcessSelected.xmlDiagram ? taskProcessSelected.xmlDiagram : '',
        _id: taskProcessSelected && taskProcessSelected._id,
        viewer: taskProcessSelected && taskProcessSelected.viewer ? taskProcessSelected.viewer : [],
        manager: taskProcessSelected && taskProcessSelected.manager ? taskProcessSelected.manager : []
      },
      show: !!(taskProcessSelected && taskProcessSelected.processName)
    })

    // props.getAllDepartments()
    // props.getAllXmlDiagram(state.pageNumber, state.noResultsPerPage, "");
    // props.getRoles();
  }, [props.id])
  const handleChangeProcessTemplate = (value) => {
    const { taskProcess } = props
    const taskProcessSelected = taskProcess.listTaskProcess.find((data) => data._id === value[0])
    setState({
      ...state,
      newProcess: {
        creator: taskProcessSelected.creator,
        numberOfUse: taskProcessSelected.numberOfUse,
        privileges: taskProcessSelected.privileges,
        processDescription: taskProcessSelected.processDescription,
        quillDescriptionDefault: taskProcessSelected.processDescription,
        processName: taskProcessSelected.processName,
        tasks: taskProcessSelected.tasks,
        processTemplates: taskProcessSelected.processTemplates,
        xmlDiagram: taskProcessSelected.xmlDiagram,
        _id: taskProcessSelected._id,
        viewer: taskProcessSelected.viewer,
        manager: taskProcessSelected.manager
      },
      show: true
    })
    props.setBpmnProcess(taskProcessSelected)
  }
  // const handleProcessTemplateName = (e) => {
  //     let { value } = e.target;
  //     let { isProcess, translate } = props
  //     let { message } = ValidationHelper.validateName(translate, value, 1, 255);
  //     let { newProcessTemplate } = state;
  //     newProcessTemplate.processName = value;
  //     newProcessTemplate.errorOnName = message;
  //     // props.onChangeTemplateData(newTemplate);
  //     setState({
  //         ...state,
  //         newProcessTemplate
  //     });
  //     props.handleChangeName(value)
  // }
  // const handleProcessTemplateDesc = (value, imgs) => {
  //     setState(state => {
  //         return {
  //             ...state,
  //             newProcessTemplate: {
  //                 ...state.newProcessTemplate,
  //                 processDescription: value,
  //             }
  //         };
  //     });

  // }

  // Hàm cập nhật người được xem quy trình
  // const handleChangeViewer = async (value) => {
  // 	let { message } = ValidationHelper.validateArrayLength(props.translate, value);

  // 	await setState(state => {

  // 		return {
  // 			...state,
  //             newProcessTemplate: {
  //                 ...state.newProcessTemplate,
  //                 viewer: value,
  // 			    errorOnViewer: message,
  //             }
  // 		}
  // 	})
  // }

  // Hàm cập nhật người quản lý quy trình
  // const handleChangeManager = async (value) => {
  // 	let { message } = ValidationHelper.validateArrayLength(props.translate, value);

  // 	await setState(state => {

  // 		return {
  // 			...state,
  //             newProcessTemplate: {
  //                 ...state.newProcessTemplate,
  //                 manager: value,
  // 			    errorOnManager: message,
  //             }
  // 		}
  // 	})
  // }

  const showProcessTemplate = async (item) => {
    props.handleDataProcessTempalte(state.newProcessTemplate)
    // window.$(`#modal-show-process-tempalte`).modal("show");
  }
  const { translate, taskProcess, role } = props
  const { newProcess, show } = state
  console.log(taskProcess.listTaskProcess)
  // console.log(state.newProcessTemplate._id,taskProcess.xmlDiagram && taskProcess.xmlDiagram.map(x => {
  //     return {  value: x._id , text: x.processName}
  // }));
  return (
    <div className='row'>
      <div className='col-lg-12'>
        <div className='form-group'>
          <label>{translate('menu.task_process_template')}</label>
          <SelectBox
            id='select-process-template'
            lassName='form-control select2'
            style={{ width: '100%' }}
            items={
              taskProcess.listTaskProcess &&
              taskProcess.listTaskProcess
                .filter((x) => x._id !== props.idParent && !x.processParent)
                .map((x) => {
                  return { value: x._id, text: x.processName }
                })
            }
            options={{
              placeholder: translate('task.task_template.select_task_process_template')
            }}
            onChange={handleChangeProcessTemplate}
            value={newProcess._id}
            multiple={false}
          />
        </div>
        {show && (
          <div>
            {/** Tên mẫu quy trình */}
            <div className={`form-group ${newProcess.errorOnName === undefined ? '' : 'has-error'}`}>
              <label className='control-label'>
                {translate('task.task_template.process_template_name')} <span style={{ color: 'red' }}>*</span>
              </label>
              <p type='Name'>{newProcess.processName}</p>
            </div>
            {/* Mô tả quy trình */}
            <div className='form-group'>
              <label className='control-label'>{translate('task.task_process.process_description')}</label>
              <p>{newProcess.processDescription}</p>
            </div>
            <div className='description-box'>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '17px', marginRight: '5px' }} className='material-icons'>
                  people_alt
                </span>
                <h4>{translate('task.task_management.role')}</h4>
              </div>
              {/* Người quản lý mẫu quy trình */}
              <strong>{translate('task.task_process.manager')}:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {newProcess?.manager?.length > 0 &&
                  newProcess.manager.map((item, index) => {
                    return (
                      <span key={index} className='raci-style'>
                        <img
                          src={`${process.env.REACT_APP_SERVER}/upload/avatars/user.png`}
                          className='img-circle'
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            marginRight: '5px'
                          }}
                          alt='User avatar'
                        />
                        <span>{item.name}</span>
                      </span>
                    )
                  })}
              </div>

              {/* Người được xem mẫu quy trình */}
              <strong>{translate('task.task_process.viewer')}:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {newProcess?.viewer?.length > 0 &&
                  newProcess.viewer.map((item, index) => {
                    return (
                      <span key={index} className='raci-style'>
                        <img
                          src={`${process.env.REACT_APP_SERVER}/upload/avatars/user.png`}
                          className='img-circle'
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            marginRight: '5px'
                          }}
                          alt='User avatar'
                        />
                        <span>{item.name}</span>
                      </span>
                    )
                  })}
              </div>
            </div>
            <a className='viewbpmnprocesschild' href={`/process-template?processId=${newProcess._id}`} target='_blank'>
              Xem chi tiết quy trình
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

function mapState(state) {
  const { department, user, taskProcess, role } = state
  // const adding = state.tasktemplates;
  return { department, user, taskProcess, role }
}

const actionCreators = {
  getAllXmlDiagram: TaskProcessActions.getAllXmlDiagram,
  deleteXmlDiagram: TaskProcessActions.deleteXmlDiagram,
  getAllTaskProcess: TaskProcessActions.getAllTaskProcess
}
const connectedAddProcessTemplate = connect(mapState, actionCreators)(withTranslate(AddProcessChild))
export { connectedAddProcessTemplate as AddProcessChild }
