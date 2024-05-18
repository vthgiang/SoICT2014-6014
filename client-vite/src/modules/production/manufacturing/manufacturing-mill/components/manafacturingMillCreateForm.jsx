import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { ButtonModal, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components'
import { generateCode } from '../../../../../helpers/generateCode'
import ValidationHelper from '../../../../../helpers/validationHelper'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { millActions } from '../redux/actions'

const ManufacturingMillCreateForm = (props) => {
  const { translate, manufacturingMill } = props

  const [mill, setMill] = useState({
    code: '',
    name: '',
    worksValue: '',
    description: '',
    status: '',
    teamLeaderValue: ''
  })
  const [nameError, setNameError] = useState("")
  const [worksValueError, setWorksValueError] = useState("")
  const [teamLeaderValueError, setTeamLeaderValueError] = useState("")
  const [statusError, setStatusError] = useState("")

  const handleClickCreate = () => {
    const code = generateCode('XSX')
    setMill({...mill, code: code})
  }

  const getListUsers = () => {
    const { translate, user } = props
    let listUsersArray = [
      {
        value: '',
        text: translate('manufacturing.manufacturing_mill.choose_team_leader')
      }
    ]

    let { userdepartments } = user
    if (userdepartments) {
      userdepartments = userdepartments[0]
      if (userdepartments.employees && Object.keys(userdepartments.employees).length > 0) {
        let members = userdepartments.employees[Object.keys(userdepartments.employees)[0]].members
        if (members.length) {
          members.map((member) => {
            listUsersArray.push({
              value: member._id,
              text: member.name
            })
          })
        }
      }
    }

    return listUsersArray
  }

  const getListWorks = () => {
    const { translate, manufacturingWorks } = props
    let listWorksArray = [
      {
        value: '',
        text: translate('manufacturing.manufacturing_mill.choose_works')
      }
    ]

    const { listWorks } = manufacturingWorks

    if (listWorks) {
      listWorks.map((item) => {
        listWorksArray.push({
          value: item._id,
          text: item.name,
          organizationalUnit: item.organizationalUnit._id
        })
      })
    }
    return listWorksArray
  }

  const handleManufacturingWorksChange = (value) => {
    const worksValue = value[0]
    validateManufacturingWorks(worksValue, true)
  }

  const validateManufacturingWorks = (value, willUpdateState) => {
    let msg = undefined
    const { translate } = props
    if (value === '') {
      msg = translate('manufacturing.manufacturing_mill.worksValue_error')
    }
    if (willUpdateState) {
      setMill({
        ...mill,
        worksValue: value,
        teamLeaderValue: ''
      })
      setWorksValueError(msg)
    }
    return msg
  }

  const handleTeamLeaderValueChange = (value) => {
    const teamLeaderValue = value[0]
    validateTeamLeader(teamLeaderValue, true)
  }

  const validateTeamLeader = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (value === '') {
      msg = translate('manufacturing.manufacturing_mill.team_leader_error')
    }
    if (willUpdateState) {
      setMill({
        ...mill,
        teamLeaderValue: value,
      })
      setTeamLeaderValueError(msg)
    }
    return msg
  }

  const handleNameChange = (e) => {
    const { value } = e.target
    setMill({...mill, name: value})

    let { translate } = props
    let { message } = ValidationHelper.validateName(translate, value, 6, 255)
    setNameError(message)
  }

  const handleDescriptionChange = (e) => {
    const { value } = e.target
    setMill({...mill, description: value})
  }

  const handleStatusChange = (value) => {
    const status = value[0]
    validateStatus(status, true)
  }

  const validateStatus = (value, willUpdateState) => {
    let msg = undefined
    const { translate } = props
    if (value === '') {
      msg = translate('manufacturing.manufacturing_mill.status_error')
    }
    if (willUpdateState) {
      setMill({
        ...mill,
        status: value,
      })
      setStatusError(msg)
    }
    return msg
  }

  const isFormValidated = () => {
    const { name, worksValue, status, teamLeaderValue } = mill
    const { translate } = props
    if (
      validateManufacturingWorks(worksValue, false) ||
      validateStatus(status, false) ||
      validateTeamLeader(teamLeaderValue, false) ||
      !ValidationHelper.validateName(translate, name, 6, 255).status
    ) {
      return false
    }
    return true
  }

  const save = () => {
    if (isFormValidated) {
      const data = {
        code: mill.code,
        name: mill.name,
        manufacturingWorks: mill.worksValue,
        teamLeader: mill.teamLeaderValue,
        description: mill.description,
        status: mill.status
      }
      props.createManufacturingMill(data)
    }
  }

  // Tìm trong trong listWorksArray object có value = value truyền vào
  const findIndex = (array, value) => {
    let result = -1
    array.map((item, index) => {
      if (item.value === value) {
        result = index
      }
    })
    return result
  }

  
  useEffect(() => {
      const listWorks = getListWorks()
      let result = findIndex(listWorks, mill.worksValue)
      props.getAllUserOfDepartment(listWorks[result].organizationalUnit)
  }, [mill.worksValue])


    return (
      <React.Fragment>
        <ButtonModal
          onButtonCallBack={handleClickCreate}
          modalID='modal-create-mill'
          button_name={translate('manufacturing.manufacturing_mill.create_mill')}
          title={translate('manufacturing.manufacturing_mill.create_mill')}
        />
        <DialogModal
          modalID='modal-create-mill'
          isLoading={manufacturingMill.isLoading}
          formID='form-create-mill'
          title={translate('manufacturing.manufacturing_mill.create_manufacturing_mill')}
          msg_success={translate('manufacturing.manufacturing_mill.create_mill_successfully')}
          msg_failure={translate('manufacturing.manufacturing_mill.create_mill_failed')}
          func={save}
          disableSubmit={!isFormValidated()}
          size={50}
          maxWidth={500}
        >
          <form id='form-create-mill'>
            <div className='form-group'>
              <label>
                {translate('manufacturing.manufacturing_mill.code')}
                <span className='text-red'>*</span>
              </label>
              <input type='text' value={mill.code} className='form-control' disabled={true}></input>
            </div>
            <div className={`form-group ${!nameError ? '' : 'has-error'}`}>
              <label>
                {translate('manufacturing.manufacturing_mill.name')}
                <span className='text-red'>*</span>
              </label>
              <input type='text' className='form-control' value={mill.name} onChange={handleNameChange}></input>
              <ErrorLabel content={nameError} />
            </div>
            <div className={`form-group ${!worksValueError ? '' : 'has-error'}`}>
              <label>
                {translate('manufacturing.manufacturing_mill.works')}
                <span className='text-red'>*</span>
              </label>
              <SelectBox
                id={`select-works`}
                className='form-control select2'
                style={{ width: '100%' }}
                value={mill.worksValue}
                items={getListWorks()}
                onChange={handleManufacturingWorksChange}
                multiple={false}
              />
              <ErrorLabel content={worksValueError} />
            </div>
            {mill.worksValue !== '' && (
              <div className={`form-group ${!teamLeaderValueError ? '' : 'has-error'}`}>
                <label>
                  {translate('manufacturing.manufacturing_mill.team_leader')}
                  <span className='text-red'>*</span>
                </label>
                <SelectBox
                  id={`select-teamLeader-create`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={mill.teamLeaderValue}
                  items={getListUsers()}
                  onChange={handleTeamLeaderValueChange}
                  multiple={false}
                />
                <ErrorLabel content={teamLeaderValueError} />
              </div>
            )}
            <div className={`form-group ${!statusError ? '' : 'has-error'}`}>
              <label>
                {translate('manufacturing.manufacturing_mill.status')}
                <span className='text-red'>*</span>
              </label>
              <SelectBox
                id={`select-status`}
                className='form-control select2'
                style={{ width: '100%' }}
                value={mill.status}
                items={[
                  { value: '', text: translate('manufacturing.manufacturing_mill.choose_status') },
                  { value: '1', text: translate('manufacturing.manufacturing_mill.1') },
                  { value: '0', text: translate('manufacturing.manufacturing_mill.0') }
                ]}
                onChange={handleStatusChange}
                multiple={false}
              />
              <ErrorLabel content={statusError} />
            </div>
            <div className='form-group'>
              <label>{translate('manufacturing.manufacturing_mill.description')}</label>
              <textarea type='text' className='form-control' value={mill.description} onChange={handleDescriptionChange}></textarea>
            </div>
          </form>
        </DialogModal>
      </React.Fragment>
    )
}

function mapStateToProps(state) {
  const { manufacturingWorks, manufacturingMill, user } = state
  return { manufacturingWorks, manufacturingMill, user }
}

const mapDispatchToProps = {
  createManufacturingMill: millActions.createManufacturingMill,
  getAllUserOfDepartment: UserActions.getAllUserOfDepartment
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingMillCreateForm))
