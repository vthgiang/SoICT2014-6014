import React, { Component } from 'react'
import { connect } from 'react-redux'
import { SelectBox } from '../../../../../common-components/index'
import { withTranslate } from 'react-redux-multilingual'
import getEmployeeSelectBoxItems from '../../../organizationalUnitHelper'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { taskTemplateActions } from '../../../task-template/redux/actions'
class FormInfoTask extends Component {
  constructor(props) {
    super(props)
    let { info, id, listOrganizationalUnit } = this.props
    this.state = {
      id: id,
      startDate: info && info.startDate ? info.startDate : '',
      endDate: info && info.endDate ? info.endDate : '',
      priority: info && info.priority ? info.priority : 1,
      nameTask: info && info.nameTask ? info.nameTask : '',
      description: info && info.description ? info.description : '',
      organizationalUnit: info && info.organizationalUnit ? info.organizationalUnit : [],
      taskTemplate: info && info.taskTemplate ? info.taskTemplate : '',
      responsible: info && info.responsibleName ? info.responsibleName : [],
      accountable: info && info.accountableName ? info.accountableName : []
    }
  }

  componentDidMount() {
    this.props.getTaskTemplateByUser(1, 0, [])
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.id !== this.state.id) {
      let { info, listOrganizationalUnit } = nextProps
      this.setState((state) => {
        return {
          id: nextProps.id,
          startDate: info && info.startDate ? info.startDate : '',
          endDate: info && info.endDate ? info.endDate : '',
          priority: info && info.priority ? info.priority : 1,
          nameTask: info && info.nameTask ? info.nameTask : '',
          description: info && info.description ? info.description : '',
          organizationalUnit: info && info.organizationalUnit ? info.organizationalUnit : [],
          taskTemplate: info && info.taskTemplate ? info.taskTemplate : '',
          responsible: info && info.responsibleName ? info.responsibleName : [],
          accountable: info && info.accountableName ? info.accountableName : []
        }
      })
      return false
    } else return true
  }

  handleChangeName = (e) => {
    const { value } = e.target
    this.setState({
      nameTask: value
    })
    this.props.handleChangeName(value)
  }
  handleChangeDescription = (e) => {
    const { value } = e.target
    this.setState({
      description: value
    })
    this.props.handleChangeDescription(value)
  }
  handleChangeOrganizationalUnit = (value) => {
    this.setState({
      organizationalUnit: value[0]
    })
    this.props.handleChangeOrganizationalUnit(value[0])
  }
  handleChangeTemplate = (value) => {
    this.setState({
      taskTemplate: value[0]
    })
    this.props.handleChangeTemplate(value[0])
  }
  handleChangeResponsible = (value) => {
    this.setState({
      responsible: value
    })
    this.props.handleChangeResponsible(value)
  }
  handleChangeAccountable = (value) => {
    this.setState(
      {
        accountable: value
      },
      () => console.log(this.state)
    )
    this.props.handleChangeAccountable(value)
  }

  handleChangeTaskStartDate = (value) => {
    this.setState({
      startDate: value
    })
    this.props.handleChangeTaskStartDate(value)
  }

  handleChangeTaskEndDate = (value) => {
    this.setState({
      endDate: value
    })

    this.props.handleChangeTaskEndDate(value)
  }

  handleChangeTaskPriority = (event) => {
    let { value } = event.target
    this.setState((state) => {
      return {
        ...state,
        priority: value
      }
    })
    this.props.handleChangeTaskPriority(value)
  }

  render() {
    const { user, translate, role, tasktemplates } = this.props
    const { id, info, action, listOrganizationalUnit, disabled, template, listUser, task } = this.props

    const { nameTask, description, organizationalUnit, taskTemplate, startDate, endDate, priority, responsible, accountable } = this.state
    console.log(info)
    let usersOfChildrenOrganizationalUnit,
      listTaskTemplate,
      listUserAccountable = [],
      listUserResponsible = []
    if (user && user.usersOfChildrenOrganizationalUnit) {
      usersOfChildrenOrganizationalUnit = user.usersOfChildrenOrganizationalUnit
    }

    let unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit)
    let listRoles = []
    let listItem = []
    listOrganizationalUnit.forEach((x) => {
      if (x._id === info?.organizationalUnit) {
        listRoles = [...x.managers, ...x.deputyManagers, ...x.employees]
      }
    })
    listItem = listRoles.map((x) => {
      return { text: x.name, value: x._id }
    })

    //Xử lí khởi tạo quy trình
    if (listUser) {
      listUser.forEach((x) => {
        if (info?.accountable.some((y) => y === x.roleId)) {
          listUserAccountable.push({ value: x.userId._id, text: x.userId.name })
        }
      })
      listUser.forEach((x) => {
        if (info?.responsible.some((y) => y === x.roleId)) {
          listUserResponsible.push({ value: x.userId._id, text: x.userId.name })
        }
      })
    }

    // list template
    let listTemp = [{ value: '', text: '--Chọn mẫu công việc--' }]
    if (listTaskTemplate && listTaskTemplate.length !== 0) {
      listTaskTemplate.map((item) => {
        listTemp.push({ value: item._id, text: item.name })
      })
    }
    return (
      <div>
        <form>
          <div className='form-group'>
            <label style={{ float: 'left' }}>Tên công việc</label>
            <input
              type='text'
              disabled={disabled}
              value={nameTask}
              className='form-control'
              placeholder='Nhập tên công việc'
              onChange={this.handleChangeName}
            />
          </div>
          <div className='form-group'>
            <label style={{ float: 'left' }}>Mô tả</label>
            <input
              type='text'
              disabled={disabled}
              value={description}
              className='form-control'
              placeholder='Mô tả công việc'
              onChange={this.handleChangeDescription}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='exampleFormControlSelect1' style={{ float: 'left' }}>
              Đơn vị
            </label>
            {
              <SelectBox
                id={`select-organizationalUnit-employee-${id}-${action}`}
                className='form-control select2'
                style={{ width: '100%' }}
                // items={unitMembers}
                multiple={false}
                items={listOrganizationalUnit.map((x) => {
                  return { text: x.name, value: x._id }
                })}
                onChange={this.handleChangeOrganizationalUnit}
                value={organizationalUnit}
                disabled={disabled}
              />
            }
          </div>
          {listTaskTemplate && listTaskTemplate.length !== 0 && (
            <div className='form-group'>
              <label htmlFor='exampleFormControlSelect1' style={{ float: 'left' }}>
                Mẫu công việc
              </label>
              {
                <SelectBox
                  id={`select-template-employee-${id}-${action}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  multiple={false}
                  items={listTemp}
                  onChange={this.handleChangeTemplate}
                  value={taskTemplate}
                  disabled={disabled}
                />
              }
            </div>
          )}
          <div className='form-group'>
            <label htmlFor='exampleFormControlSelect1' style={{ float: 'left' }}>
              Người thực hiện
            </label>
            {
              // unitMembers &&
              <SelectBox
                id={`select-responsible-employee-${id}-${action}`}
                className='form-control select2'
                style={{ width: '100%' }}
                // items={unitMembers}
                items={listUserResponsible}
                onChange={this.handleChangeResponsible}
                multiple={true}
                value={responsible}
                disabled={disabled}
              />
            }
          </div>

          <div className='form-group'>
            <label htmlFor='exampleFormControlSelect2' style={{ float: 'left' }}>
              Người phê duyệt
            </label>
            {
              // unitMembers &&
              <SelectBox
                id={`select-accountable-employee-${id}-${action}`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={listUserAccountable}
                onChange={this.handleChangeAccountable}
                multiple={true}
                value={accountable}
                disabled={disabled}
              />
            }
          </div>

          <button className='btn btn-primary' onClick={this.props.done}>
            {' '}
            Hoàn thành
          </button>
        </form>
      </div>
    )
  }
}

function mapState(state) {
  const { user, auth, role, tasktemplates } = state
  return { user, auth, role, tasktemplates }
}

const actionCreators = {
  getDepartment: UserActions.getDepartmentOfUser,
  // getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
  getTaskTemplateByUser: taskTemplateActions.getAllTaskTemplateByUser
}
const connectedFormInfoTask = connect(mapState, actionCreators)(withTranslate(FormInfoTask))
export { connectedFormInfoTask as FormInfoTask }
