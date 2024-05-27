import { useTranslate } from 'react-redux-multilingual'
import React, { useEffect, useState } from 'react'
import { DialogModal, SelectBox } from '../../../../../../common-components'

function AllocationToOrganizationalUnit({ month, currentKPI }) {
  const translate = useTranslate()
  const [listUnit, setListUnit] = useState([])
  const [selectedValue, setSelectedValue] = useState([])

  useEffect(() => {
    const { organizationalUnitImportances } = currentKPI

    const formattedData = organizationalUnitImportances.map((item) => ({
      value: item.organizationalUnit._id,
      text: item.organizationalUnit.name
    }))
    setListUnit(formattedData)
  }, [])

  const handleSelectAll = () => {
    const allValue = listUnit.map((item) => {
      return item.value
    })
    setSelectedValue(allValue)
  }

  const handleClearAll = () => {
    setSelectedValue([])
  }
  return (
    <DialogModal
      modalID='allocation-kpi-into-unit'
      isLoading={false}
      formID='form-allocation-kpi-into-unit'
      title={`Phân bổ KPI cho các phòng ban tháng ${month}`}
      //   msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
      //   msg_failure={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
      //   func={handleSubmit}
      hasNote={false}
      //   disableSubmit={isFormValidated()}
    >
      Lựa chọn bộ phận để phân bổ
      <div className='flex gap-[16px] my-[8px]'>
        <button type='button' className='btn btn-success' onClick={() => handleSelectAll()}>
          Selected all
        </button>
        <button type='button' className='btn btn-primary' onClick={() => handleClearAll()}>
          Clear all selected value
        </button>
      </div>
      <SelectBox
        id='user-role-form'
        className='form-control select2'
        style={{ width: '100%' }}
        items={listUnit}
        // onChange={handleChangeRequireCertificates}
        value={selectedValue}
        multiple
      />
      <button type='button' className='btn btn-primary my-[8px]'>
        Bắt đầu phân bổ
      </button>
    </DialogModal>
  )
}

export default AllocationToOrganizationalUnit
