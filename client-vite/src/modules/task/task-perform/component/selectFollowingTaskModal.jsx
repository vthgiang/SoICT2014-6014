import React, { Component, useState } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'
import { DialogModal, SelectBox } from '../../../../common-components'
import { performTaskAction } from '../redux/actions'
import Swal from 'sweetalert2'

function SelectFollowingTaskModal(props) {
  const { user, translate } = props
  const { task } = props
  const [state, setState] = useState({
    selectedFollowing: {},
    statusOptions: props.task?.status
  })
  const { statusOptions, selectedFollowing } = state

  /**
   * Hàm cập nhật chọn status
   * @param {*} value giá trị status lựa chọn
   */
  const handleSelectedStatus = (value) => {
    setState((state) => {
      return {
        ...state,
        statusOptions: value[0]
      }
    })
  }

  /**
   * Hàm cập nhật các following task muốn kích hoạt
   * @param {*} e event - đối tượng sự kiện khi tác động thay đổi input
   * @param {*} id id của công việc được chọn
   */
  const changeSelectedFollowingTask = async (e, id) => {
    let { value, checked } = e.target
    await setState((state) => {
      state.selectedFollowing[id] = {
        checked: checked,
        value: value
      }
      return {
        ...state
      }
    })
    console.log('state', state)
  }

  /**
   * Hàm lưu, gửi request đến server
   */
  const save = () => {
    let selectedFollowing = state.selectedFollowing
    let listFollowing = []
    for (let i in selectedFollowing) {
      if (selectedFollowing[i].checked) {
        listFollowing.push(selectedFollowing[i].value)
      }
    }

    // Thông báo xác nhận kích hoạt công việc
    Swal.fire({
      title: props.translate('task.task_perform.notice_change_activate_task'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: props.translate('general.no'),
      confirmButtonText: props.translate('general.yes')
    }).then((result) => {
      if (result.value) {
        props.editActivateOfTask(props.id, props.typeOfTask, listFollowing)
        props.refresh()
      }
    })
  }

  /**
   * Hàm validate form gửi dữ liệu
   */
  const isFormValidated = () => {
    let { selectedFollowing } = state
    let listFollowing = []
    for (let i in selectedFollowing) {
      if (selectedFollowing[i].checked) {
        listFollowing.push(selectedFollowing[i].value)
      }
    }

    if (listFollowing.length > 0) {
      return true
    }
    return false
  }

  // biến kiểm tra có công việc CHƯA kích hoạt hay không
  let checkHasNonActivatedFollowTask = false
  if (task) {
    for (let i in task?.followingTasks) {
      if (task?.followingTasks[i].activated === false) {
        checkHasNonActivatedFollowTask = true
      }
    }
  }

  // biến kiểm tra có công việc ĐÃ kích hoạt hay không
  let checkHasActivatedFollowTask = false
  if (task) {
    for (let i in task?.followingTasks) {
      if (task?.followingTasks[i].activated === true) {
        checkHasActivatedFollowTask = true
      }
    }
  }

  // Mảng cấu hình trạng thái công việc
  let statusArr = [
    { value: 'inprocess', text: translate('task.task_management.inprocess') },
    { value: 'wait_for_approval', text: translate('task.task_management.wait_for_approval') },
    { value: 'finished', text: translate('task.task_management.finished') },
    { value: 'delayed', text: translate('task.task_management.delayed') },
    { value: 'canceled', text: translate('task.task_management.canceled') }
  ]

  return (
    <React.Fragment>
      <DialogModal
        modalID='modal-select-following-task'
        isLoading={user.isLoading}
        formID='form-select-following-task'
        title={props.title}
        func={save}
        disableSubmit={!isFormValidated()}
        size={50}
        hasSaveButton={checkHasNonActivatedFollowTask}
      >
        {/* Danh sách các công việc ĐÃ kích hoạt */}
        {checkHasActivatedFollowTask && (
          <div className='description-box'>
            <strong>{translate('task.task_perform.activated_task_list')}</strong>
            {task?.followingTasks.map((x, key) => {
              if (x.activated) {
                return (
                  <div key={key} style={{ paddingLeft: 20 }}>
                    {x.task.name} {x.link ? `- ${translate('task.task_perform.task_link_of_process')}: ${x.link}` : ''}
                  </div>
                )
              }
            })}
          </div>
        )}

        {/* Danh sách công việc CHƯA kích hoạt */}
        <div className='description-box'>
          <strong>
            {translate('task.task_perform.choose_following_task')}
            <span style={{ color: 'red' }}> *</span>
          </strong>

          {task?.followingTasks.length !== 0 ? (
            checkHasNonActivatedFollowTask ? (
              task?.followingTasks.map((x, key) => {
                if (x.activated === false) {
                  return (
                    <div key={key} style={{ paddingLeft: 20 }}>
                      <label style={{ fontWeight: 'normal' }}>
                        <input
                          type='checkbox'
                          checked={selectedFollowing[x.task._id] && selectedFollowing[x.task._id].checked === true}
                          value={x.task._id}
                          name='following'
                          onChange={(e) => changeSelectedFollowingTask(e, x.task._id)}
                        />
                        {x.task.name} {x.link ? `- ${translate('task.task_perform.task_link_of_process')}: ${x.link}` : ''}
                      </label>
                      <br />
                    </div>
                  )
                }
              })
            ) : (
              <div>{translate('task.task_perform.activated_all')}</div>
            )
          ) : (
            <div>{translate('task.task_perform.not_have_following')}</div>
          )}
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { tasks, performtasks, user } = state
  return { tasks, performtasks, user }
}

const actionCreators = {
  editActivateOfTask: performTaskAction.editActivateOfTask,
  getTaskById: performTaskAction.getTaskById
}
const connectedSelectFollowingTaskModal = connect(mapState, actionCreators)(withTranslate(SelectFollowingTaskModal))
export { connectedSelectFollowingTaskModal as SelectFollowingTaskModal }
