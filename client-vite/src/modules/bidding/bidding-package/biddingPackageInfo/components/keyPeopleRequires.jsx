import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { SelectBox, SelectMulti } from '../../../../../common-components'

function KeyPeopleRequireTab(props) {
  const [state, setState] = useState({})

  useEffect(() => {
    setState((state) => {
      return {
        ...state,
        id: props.id,
        keyPersonnelRequires: props.biddingPackage.keyPersonnelRequires
      }
    })
  }, [props.id])

  const { translate, listMajor, listCareer, listCertificate } = props

  const { id, biddingPackage, keyPersonnelRequires } = state

  let professionalSkillArr = [
    { value: null, text: 'Chọn trình độ' },
    { value: 1, text: 'Trình độ phổ thông' },
    { value: 2, text: 'Trung cấp' },
    { value: 3, text: 'Cao đẳng' },
    { value: 4, text: 'Đại học / Cử nhân' },
    { value: 5, text: 'Kỹ sư' },
    { value: 6, text: 'Thạc sĩ' },
    { value: 7, text: 'Tiến sĩ' },
    { value: 8, text: 'Giáo sư' },
    { value: 0, text: 'Không có' }
  ]

  let sameCareerPosition = listCareer
    ? listCareer.map((item) => {
        return { value: item._id, text: item.name }
      })
    : []

  return (
    <div id={id} className='tab-pane'>
      {keyPersonnelRequires?.map((item, listIndex) => {
        let majors = ''

        if (item.majors) {
          item.majors.map((y, index) => {
            majors = majors + `${listMajor.find((x) => x._id == y)?.name}`
            if (index != item.majors.length - 1) majors = majors + ', '
          })
        }

        return (
          <div key={`require-${listIndex}`} className='box-body' style={{ border: '1px solid #ccc', marginBottom: '10px' }}>
            <div className='row' style={{ marginTop: '15px' }}>
              <div className='form-group col-md-6'>
                <strong>Vị trí công việc&emsp; </strong>
                {listCareer.filter((x) => x._id == item.careerPosition).map((y) => y.name)}
              </div>
              <div className='form-group col-md-6'>
                <strong>Số lượng&emsp; </strong>
                {item.count}
              </div>
            </div>

            <div className='row' style={{ marginTop: '15px' }}>
              <div className='form-group col-md-6'>
                <strong>Chuyên ngành&emsp; </strong>
                {majors}
              </div>
              <div className='form-group col-md-6'>
                <strong>Trình độ chuyên môn&emsp; </strong>
                {professionalSkillArr.find((x) => x.value == item.professionalSkill).text}
              </div>
            </div>

            <div className='row' style={{ marginTop: '15px' }}>
              <div className='form-group col-md-6'>
                <strong>Thời gian làm việc trong các dự án, gói thầu&emsp;</strong>
                {item.experienceWorkInCarreer}
              </div>
              <div className='form-group col-md-6'>
                <strong>Số dự án, gói thầu đã tham gia&emsp;</strong>
                {item.numblePackageWorkInCarreer}
              </div>
            </div>
            <div className='row' style={{ marginTop: '15px' }}>
              {/* Vị trí công việc tương tự  */}
              <div className='form-group col-md-6'>
                <label>Vị trí công việc trong các dự án, gói thầu</label>
                <SelectMulti
                  id={`same-careerPosition-${id}-${listIndex}`}
                  multiple='multiple'
                  options={{ nonSelectedText: 'Chọn vị trí công việc tương đương', allSelectedText: 'Chọn tất cả' }}
                  items={sameCareerPosition}
                  value={item?.sameCareerPosition ? item.sameCareerPosition : []}
                ></SelectMulti>
              </div>
              <div className='form-group col-md-6'>
                <strong>Năm kinh nghiệm&emsp;</strong>
                {item.numberYearsOfExperience}
              </div>
            </div>

            <fieldset className='scheduler-border'>
              <legend className='scheduler-border'>
                <h4 className='box-title'>Yêu cầu chứng chỉ- bằng cấp</h4>
              </legend>

              <div className='row'>
                <div className='form-group col-md-12'>
                  <label>Danh sách chứng chỉ - bằng cấp</label>
                  <SelectBox
                    id={`certificate-${id}-${listIndex}`}
                    lassName='form-control select2'
                    style={{ width: '100%' }}
                    items={listCertificate?.map((x) => {
                      return { text: x.name, value: x._id }
                    })}
                    options={{ placeholder: 'Chọn chứng chỉ - bằng cấp' }}
                    value={item?.certificateRequirements?.certificates}
                    multiple={true}
                  />
                </div>
                <div className='form-group col-md-12'>
                  <label>Số chứng chỉ tối thiểu</label>
                  <input
                    type='number'
                    className='form-control'
                    name='count'
                    value={item?.certificateRequirements?.count}
                    autoComplete='off'
                    disabled={true}
                  />
                </div>
              </div>
            </fieldset>
          </div>
        )
      })}
    </div>
  )
}

const keyPeopleRequireTab = connect(null, null)(withTranslate(KeyPeopleRequireTab))
export { keyPeopleRequireTab as KeyPeopleRequireTab }
