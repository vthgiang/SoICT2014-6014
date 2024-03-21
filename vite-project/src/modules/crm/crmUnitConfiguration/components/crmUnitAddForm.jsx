import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ButtonModal, DialogModal, SelectBox } from '../../../../common-components'
import { CrmUnitActions } from '../redux/actions'

/**
 * Giao diện thêm đơn vị chăm sóc khách hàng
 * trong chức năng Quản lý khách hàng/ Cấu hình đơn vị chăm sóc khách hàng
 */
function CrmUnitAddForm(props) {
  const { department, translate, crm } = props
  const [newCrmUnit, setNewCrmUnit] = useState()

  const handleChangeUnit = async (value) => {
    await setNewCrmUnit(value[0])
  }
  const save = () => {
    props.createCrmUnit({ organizationalUnit: newCrmUnit })
  }

  let listDepartment
  console.log('department', department)
  console.log('crm', crm)
  if (department && department.list) {
    listDepartment = department.list.map((unit) => ({ text: unit.name, value: unit._id }))
  }

  return (
    <React.Fragment>
      <ButtonModal modalID='modal-crm-unit-create' button_name={'Thêm đơn vị chăm sóc khách hàng'} title={translate('crm.group.add')} />
      <DialogModal
        modalID='modal-crm-unit-create'
        isLoading={false}
        formID='form-crm-unit-create'
        func={save}
        size={50}
        // disableSubmit={!this.isFormValidated()}
      >
        <form id='form-crm-unit-create'>
          {/* tên trạng thái khách hàng */}
          <div className={`form-group`}>
            <label>
              {'Đơn vị chăm sóc khách hàng'}
              <span className='attention'> * </span>
            </label>
            {listDepartment && (
              <SelectBox
                id={`crm-unit-create`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={listDepartment}
                onChange={handleChangeUnit}
                multiple={false}
                options={{ placeholder: 'Chọn đơn vị CSKH' }}
                required
              />
            )}
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { crm, department } = state
  return { crm, department }
}

const mapDispatchToProps = {
  createCrmUnit: CrmUnitActions.createCrmUnit
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmUnitAddForm))
