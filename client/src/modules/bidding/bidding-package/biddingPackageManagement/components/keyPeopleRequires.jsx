import { random } from 'lodash'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DatePicker, SelectBox, SelectMulti } from '../../../../../common-components'

function KeyPeopleRequire(props) {
  const [state, setState] = useState({
    keyPersonnelRequires: []
  })

  const [list, setList] = useState(props.biddingPackage.keyPersonnelRequires ? props.biddingPackage.keyPersonnelRequires : [])

  const { translate, listMajor, listCareer, listCertificate, biddingPackage } = props
  const { id, keyPeople, keyPersonnelRequires } = state

  useEffect(() => {
    setState((state) => {
      return {
        ...state,
        keyPersonnelRequires: list
      }
    })
  }, [list])

  useEffect(() => {
    if (props.biddingPackage) {
      setState((state) => {
        return {
          ...state,
          id: props.id,
          keyPeople:
            props.biddingPackage.keyPeople && props.biddingPackage.keyPeople?.length
              ? props.biddingPackage.keyPeople
              : props.biddingPackage.keyPersonnelRequires
                ? props.biddingPackage.keyPersonnelRequires?.map((x) => {
                    return {
                      careerPosition: x.careerPosition,
                      employees: []
                    }
                  })
                : []
        }
      })
    }
  }, [props.id, props.biddingPackage.keyPeople])

  useEffect(() => {
    if (props.biddingPackage) {
      setState((state) => {
        return {
          ...state,
          id: props.id,
          keyPersonnelRequires: props.biddingPackage ? props.biddingPackage.keyPersonnelRequires : []
        }
      })

      setList(props.biddingPackage.keyPersonnelRequires ? props.biddingPackage.keyPersonnelRequires : [])
    }
  }, [props.id, props.biddingPackage.keyPersonnelRequires])

  /**
   * Function format dữ liệu Date thành string
   * @param {*} date : Ngày muốn format
   * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
   */
  const formatDate = (date, monthYear = false) => {
    if (date) {
      let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      if (monthYear === true) {
        return [month, year].join('-')
      } else return [day, month, year].join('-')
    } else {
      return date
    }
  }

  /** Function bắt sự kiện thay đổi vị trí công việc */
  const handleCareer = (e, listIndex) => {
    let { value } = e.target

    let newList = list.map((item, index) => {
      if (index === listIndex) {
        return {
          ...item,
          careerPosition: value
        }
      }
      return item
    })

    let newListEmployee = state.keyPeople
    newListEmployee[listIndex]['careerPosition'] = value

    setList(newList)
    props.handleChange('keyPeople', newListEmployee)
    props.handleChange('keyPersonnelRequires', newList)
  }

  /** Function bắt sự kiện thay đổi vị trí công việc tương tự*/
  const handleSameCareer = (value, listIndex) => {
    let newList = list.map((item, index) => {
      if (index === listIndex) {
        return {
          ...item,
          sameCareerPosition: value
        }
      }
      return item
    })
    setList(newList)
    props.handleChange('keyPersonnelRequires', newList)
  }

  /** Function bắt sự kiện thay đổi điều kiện chuyên ngành */
  const handleMajor = (value, listIndex) => {
    let newList = list.map((item, index) => {
      if (index === listIndex) {
        return {
          ...item,
          majors: value
        }
      }
      return item
    })
    setList(newList)
    props.handleChange('keyPersonnelRequires', newList)
  }

  /** Function bắt sự kiện thay đổi vị trí công việc */
  const handleCount = (e, listIndex) => {
    let { value } = e.target
    let newList = list.map((item, index) => {
      if (index === listIndex) {
        return {
          ...item,
          count: Number(value)
        }
      }
      return item
    })
    setList(newList)
    props.handleChange('keyPersonnelRequires', newList)
  }

  /** Function bắt sự kiện thay đổi vị trí công việc */
  const handleYearOfExperiment = (e, listIndex) => {
    let { value } = e.target
    let newList = list.map((item, index) => {
      if (index === listIndex) {
        return {
          ...item,
          numberYearsOfExperience: value
        }
      }
      return item
    })
    setList(newList)
    props.handleChange('keyPersonnelRequires', newList)
  }

  /** Function bắt sự kiện thay đổi vị trí công việc */
  const handleExperimentWorkInCareer = (e, listIndex) => {
    let { value } = e.target
    let newList = list.map((item, index) => {
      if (index === listIndex) {
        return {
          ...item,
          experienceWorkInCarreer: value
        }
      }
      return item
    })
    setList(newList)
    props.handleChange('keyPersonnelRequires', newList)
  }

  /** Function bắt sự kiện thay đổi vị trí công việc */
  const handleNumberBiddingPackageInCareer = (e, listIndex) => {
    let { value } = e.target
    let newList = list.map((item, index) => {
      if (index === listIndex) {
        return {
          ...item,
          numblePackageWorkInCarreer: value
        }
      }
      return item
    })
    setList(newList)
    props.handleChange('keyPersonnelRequires', newList)
  }

  /** Function bắt sự kiện thay đổi điện thoại đi động 1 */
  const handleChangeProfessionalSkill = (e, listIndex) => {
    let { value } = e.target
    let newList = list.map((item, index) => {
      if (index === listIndex) {
        return {
          ...item,
          professionalSkill: Number(value)
        }
      }
      return item
    })
    setList(newList)
    props.handleChange('keyPersonnelRequires', newList)
  }

  /** Function bắt sự kiện thay đổi điện thoại đi động 1 */
  const handleCertificates = (value, listIndex) => {
    let newList = list.map((item, index) => {
      if (index === listIndex) {
        return {
          ...item,
          certificateRequirements: {
            ...item.certificateRequirements,
            certificates: value
          }
        }
      }
      return item
    })
    setList(newList)
    props.handleChange('keyPersonnelRequires', newList)
  }

  /** Function bắt sự kiện thay đổi điện thoại đi động 1 */
  const handleCertificateCount = (e, listIndex) => {
    let { value } = e.target

    let newList = list.map((item, index) => {
      if (index === listIndex) {
        return {
          ...item,
          certificateRequirements: {
            ...item.certificateRequirements,
            count: value
          }
        }
      }
      return item
    })
    setList(newList)
    props.handleChange('keyPersonnelRequires', newList)
  }

  /** Function bắt sự kiện thay đổi điện thoại đi động 1 */
  const handleCertificateEndDate = (value, listIndex) => {
    if (value) {
      let partValue = value.split('-')
      let endDate = [partValue[2], partValue[1], partValue[0]].join('-')

      let newList = list.map((item, index) => {
        if (index === listIndex) {
          return {
            ...item,
            certificateRequirements: {
              ...item.certificateRequirements,
              certificatesEndDate: endDate
            }
          }
        }
        return item
      })

      setList(newList)
      props.handleChange('keyPersonnelRequires', newList)
    }
  }

  const handleDeletePositionKeyRequire = (listIndex) => {
    let newList = list
    newList.splice(listIndex, 1)
    let newListEmployee = state.keyPeople.splice(listIndex, 1)

    setList(newList)
    props.handleChange('keyPeople', newListEmployee)
    props.handleChange('keyPersonnelRequires', newList)
  }

  const handleAddPositionKeyRequire = () => {
    let newList = list

    newList.push({
      careerPosition: '',
      sameCareerPosition: [],
      majors: [],
      count: 0,
      numberYearsOfExperience: 0,
      experienceWorkInCarreer: 0,
      numblePackageWorkInCarreer: 0,
      certificateRequirements: {
        certificates: [],
        count: 0,
        certificatesEndDate: null
      }
    })

    let newListEmployee = state.keyPeople
    newListEmployee.push({
      careerPosition: '',
      employees: []
    })
    setList(newList)
    props.handleChange('keyPeople', newListEmployee)
    props.handleChange('keyPersonnelRequires', newList)
  }

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
      {list?.map((item, listIndex) => {
        return (
          <div key={listIndex} className='box-body' style={{ border: '1px solid #ccc', marginBottom: '10px' }}>
            <div className='row' style={{ marginRight: '5px' }}>
              <button
                className='pull-right btn btn-danger'
                style={{ fontWeight: 700 }}
                onClick={() => handleDeletePositionKeyRequire(listIndex)}
              >
                –
              </button>
            </div>
            <div className='row' style={{ paddingTop: '10px' }}>
              <div className='form-group col-md-6'>
                <label className='form-control-static'>Vị trí công việc</label>
                <select
                  key={`careerPosition${id}-${listIndex}`}
                  name={`career-${listIndex}`}
                  style={{ border: '1px solid #aaa', borderRadius: '4px' }}
                  className='form-control select2'
                  value={item?.careerPosition}
                  onChange={(value) => handleCareer(value, listIndex)}
                >
                  <option key={`id-${listIndex}`} value='0'>
                    Chọn vị trí công việc
                  </option>
                  {listCareer?.map((x) => {
                    return (
                      <option key={x._id} value={x._id}>
                        {x.name}
                      </option>
                    )
                  })}
                </select>
              </div>

              <div className='form-group col-md-6'>
                <label className='form-control-static'>Số lượng</label>
                <input
                  type='number'
                  className='form-control'
                  name={`count-${listIndex}`}
                  onChange={(value) => handleCount(value, listIndex)}
                  value={item.count}
                  placeholder='Số lượng nhân viên'
                  autoComplete='off'
                />
              </div>
            </div>

            <div className='row' style={{ marginTop: '15px' }}>
              <div className='form-group col-md-6'>
                <label>Chuyên ngành</label>
                <SelectBox
                  id={`major-${id}-${listIndex}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={listMajor?.map((x) => {
                    return { text: x.name, value: x._id }
                  })}
                  options={{ placeholder: 'Chọn chuyên ngành' }}
                  onChange={(value) => handleMajor(value, listIndex)}
                  value={item?.majors}
                  multiple={true}
                />
              </div>
              <div className='form-group col-md-6'>
                <label>Trình độ chuyên môn</label>
                <select
                  key={`professionalSkill-${id}-${listIndex}`}
                  name={`professionalSkill-${listIndex}`}
                  style={{ border: '1px solid #aaa', borderRadius: '4px' }}
                  className='form-control select2'
                  value={Number(item?.professionalSkill)}
                  onChange={(value) => handleChangeProfessionalSkill(value, listIndex)}
                >
                  <option key={`id-professionalSkill-${listIndex}`} value='0'>
                    Chọn trình độ chuyên môn
                  </option>
                  {professionalSkillArr.map((x) => {
                    return (
                      <option key={x.value} value={x.value}>
                        {x.text}
                      </option>
                    )
                  })}
                </select>
                {/* <SelectBox
                                        id={`professionalSkill-${id}-${listIndex}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={professionalSkillArr}
                                        options={{ placeholder: "Chọn trình độ chuyên môn" }}
                                        onChange={(value) => handleChangeProfessionalSkill(value, listIndex)}
                                        value={Number(item?.professionalSkill)}
                                    /> */}
              </div>
            </div>
            <div className='row' style={{ marginTop: '15px' }}>
              <div className='form-group col-md-6'>
                <label>Thời gian làm việc trong các dự án, gói thầu</label>
                <input
                  type='number'
                  className='form-control'
                  name={`experiment-time-${listIndex}`}
                  onChange={(value) => handleExperimentWorkInCareer(value, listIndex)}
                  value={item.experienceWorkInCarreer}
                  placeholder='Thời gian làm việc ở vị trí tương đương'
                  autoComplete='off'
                />
              </div>
              <div className='form-group col-md-6'>
                <label>Số dự án, gói thầu đã tham gia</label>
                <input
                  type='number'
                  className='form-control'
                  name={`numble-package-${listIndex}`}
                  onChange={(value) => handleNumberBiddingPackageInCareer(value, listIndex)}
                  value={item.numblePackageWorkInCarreer}
                  placeholder='Số dự án ở vị trí tương đương'
                  autoComplete='off'
                />
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
                  onChange={(value) => handleSameCareer(value, listIndex)}
                ></SelectMulti>
                {/* <SelectBox
                                        id={`same-careerPosition-${id}-${listIndex}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={listCareer?.map(x => {
                                            return { text: x.name, value: x._id }
                                        })}
                                        options={{ placeholder: "Chọn vị trí công việc tương đương" }}
                                        onChange={(value) => handleSameCareer(value, listIndex)}
                                        value={item?.sameCareerPosition}
                                        multiple={true}
                                    /> */}
              </div>
              <div className='form-group col-md-6'>
                <label>Năm kinh nghiệm</label>
                <input
                  type='number'
                  className='form-control'
                  step={0.5}
                  name={`year-experiment-${listIndex}`}
                  onChange={(value) => handleYearOfExperiment(value, listIndex)}
                  value={item.numberYearsOfExperience}
                  placeholder='Số năm kinh nghiệm'
                  autoComplete='off'
                />
              </div>
            </div>

            <fieldset className='scheduler-border'>
              <legend className='scheduler-border'>
                <h4 className='box-title'>Yêu cầu chứng chỉ- bằng cấp</h4>
              </legend>

              <div className='row'>
                <div className='form-group col-md-12'>
                  <label>Danh sách chứng chỉ</label>
                  <SelectBox
                    id={`certificate-${id}-${listIndex}`}
                    key={`certificate-${id}-${listIndex}`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={listCertificate?.map((x) => {
                      return { text: x.name + ' (' + x.abbreviation + ')', value: x._id }
                    })}
                    options={{ placeholder: 'Chọn chứng chỉ' }}
                    onChange={(value) => handleCertificates(value, listIndex)}
                    value={item.certificateRequirements.certificates}
                    multiple={true}
                  />
                </div>
                <div className='form-group col-md-12'>
                  <label>Số chứng chỉ tối thiểu</label>
                  <input
                    type='number'
                    className='form-control'
                    name={`count-certificate-${listIndex}`}
                    onChange={(value) => handleCertificateCount(value, listIndex)}
                    value={item.certificateRequirements.count}
                    placeholder={translate('human_resource.profile.address')}
                    autoComplete='off'
                  />
                </div>
                <div className='form-group col-md-12'>
                  <label>Hiệu lực</label>

                  <DatePicker
                    id={`certificatesEndDate-${id}-${listIndex}`}
                    value={formatDate(
                      item.certificateRequirements.certificatesEndDate ? item.certificateRequirements.certificatesEndDate : ''
                    )}
                    onChange={(value) => handleCertificateEndDate(value, listIndex)}
                  />
                </div>
              </div>
            </fieldset>
          </div>
        )
      })}

      <button
        className='btn btn-success'
        onClick={() => {
          handleAddPositionKeyRequire()
        }}
      >
        Thêm
      </button>
    </div>
  )
}

const mapState = (state) => state

const keyPeopleRequire = connect(mapState, null)(withTranslate(KeyPeopleRequire))
export { keyPeopleRequire as KeyPeopleRequire }
