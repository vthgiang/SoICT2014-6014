import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DataTableSetting, DialogModal } from '../../../../../common-components'
import { BiddingPackageManagerActions } from '../redux/actions'
import { BiddingPackageService } from '../redux/services'
import { convertEmpIdToName } from './employeeHelper'

const ModalProposeEmpForTask = (props) => {
  const [state, setState] = useState({
    id: '',
    page: 1,
    limit: 10,
    nameSearch: ''
  })
  const [proposedData, setProposedData] = useState({
    // type: "",
    // id: "",
    // compareVersion: [],
    // proposal: null,
    // isComplete: 0,
  })
  const [isLoading, setLoading] = useState(false)
  const [showFormula, setShowFormula] = useState(true)
  const [showListTag, setShowListTag] = useState(true)
  const [showKeyMember, setShowKeyMember] = useState(true)

  const [dataProp, setDataProp] = useState(props.data)
  const save = async () => {
    console.log(18, proposedData)
    if (proposedData.isComplete) {
      props.handleAcceptProposal(proposedData.proposal)
    }
  }

  const { biddingPackagesManager, translate } = props
  const { id, bidId, allEmployee, listCareer, allTag } = state

  useEffect(() => {
    setState({
      ...state,
      id: props.id,
      type: props.proposalType,
      bidId: props.bidId,
      allEmployee: props.allEmployee,
      listCareer: props.listCareer,
      allTag: props.allTag,
      isPreferedHighSkill: props.data?.isPreferedHighSkill ? true : false
    })
    setDataProp(props.data)
  }, [
    props.id,
    JSON.stringify(props.data?.biddingPackage),
    JSON.stringify(props.listCareer),
    JSON.stringify(props.proposalType),
    JSON.stringify(props.allEmployee),
    JSON.stringify(props.allTag)
  ])

  const handlePropose = async () => {
    setLoading(true)
    await BiddingPackageService.proposeEmployeeForTask(bidId, {
      type: dataProp.type,
      tags: dataProp.proposals?.tags,
      tasks: dataProp.proposals?.tasks,
      biddingPackage: dataProp.biddingPackage,
      unitOfTime: dataProp.unitOfTime,
      executionTime: dataProp.executionTime,
      isPreferedHighSkill: dataProp.isPreferedHighSkill
    })
      .then((res) => {
        const { data } = res

        setProposedData(data.content)
      })
      .catch((err) => {
        setProposedData({
          id: null,
          type: '',
          compareVersion: [],
          proposal: null,
          isComplete: 0
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const changeIsPreferedHighSkill = (skill) => {
    setState({ ...state, isPreferedHighSkill: skill })
    setDataProp({ ...dataProp, isPreferedHighSkill: skill })
    props.setIsPreferedHighSkill(skill)
  }

  const checkInArr = (item, arr) => {
    let check = arr.find((x) => String(x) === String(item))
    if (check) return true
    return false
  }

  const { isPreferedHighSkill } = state

  return (
    <React.Fragment>
      <DialogModal
        size='100'
        modalID={`modal-view-propose-emp-for-task-${id}`}
        formID={`form-view-propose-emp-for-task-${id}`}
        title='Cơ chế đề xuất nhân sự tự động'
        func={save}
        resetOnSave={true}
        resetOnClose={true}
        disableSubmit={!proposedData?.isComplete}
        hasSaveButton={false}
      >
        <div className='box-body' style={{ lineHeight: 2 }}>
          {/* hiển thị công thức tính ở đây này */}
          <div>
            {/* <a className='pull-right' style={{ cursor: 'pointer' }} onClick={() => setShowFormula(!showFormula)}>{showFormula ? "Ẩn cơ chế đề xuất" : "Hiển thị cơ chế đề xuất"}</a> */}
            {/* <br /> */}
            {/* !showFormula ? null :  */}
            {
              <div style={{ lineHeight: 2 }}>
                <p>Các nhân viên sẽ được sắp xếp theo danh sách độ ưu tiên phân công vào công việc giảm dần.</p>
                <p>Trong đó, độ ưu tiên này sẽ dựa vào các tiêu chí:</p>
                <ul>
                  <li>
                    Các nhân sự chủ chốt sẽ được sắp xếp lên đầu danh sách ({' '}
                    <a style={{ cursor: 'pointer' }} onClick={() => setShowKeyMember(!showKeyMember)}>
                      {showKeyMember ? 'Ẩn danh sách nhân sự chủ chốt' : 'Hiển thị danh sách nhân sự chủ chốt'}
                    </a>{' '}
                    )
                    {!showKeyMember ? null : (
                      <>
                        <table id='key-member-explain-show-data' className='table not-has-action table-striped table-bordered table-hover'>
                          <thead>
                            <tr>
                              <th>STT</th>
                              <th>Vị trí công việc</th>
                              <th>Nhân sự chủ chốt</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dataProp.biddingPackage?.keyPeople?.map((item, listIndex) => {
                              return (
                                <tr key={`tag-${listIndex}`}>
                                  <td>{listIndex + 1}</td>
                                  <td>{listCareer?.find((x) => String(item?.careerPosition) === String(x._id))?.name}</td>
                                  <td>{item?.employees.map((userItem) => convertEmpIdToName(allEmployee, userItem)).join(', ')}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                        <br />
                      </>
                    )}
                  </li>
                  <li>
                    Giữa các nhân viên sẽ được sắp xếp theo thứ tự ưu tiên theo một trong hai cách:
                    <div className='form-check'>
                      <input
                        className='form-check-input'
                        type='radio'
                        name='isPreferedHighSkill'
                        id='isPreferedHighSkill1'
                        value={false}
                        checked={isPreferedHighSkill === true}
                        onChange={() => changeIsPreferedHighSkill(!isPreferedHighSkill)}
                      />
                      <label className='form-check-label' htmlFor='isPreferedHighSkill1' style={{ fontWeight: 'normal' }}>
                        Trình độ chuyên môn được sắp xếp ưu tiên từ cao tới thấp (từ Tiến sĩ - Thạc sĩ - Kỹ sư - Cử nhân - Đại học - Cao
                        đẳng - Trung cấp)
                      </label>
                    </div>
                    <div className='form-check'>
                      <input
                        className='form-check-input'
                        type='radio'
                        name='isPreferedHighSkill'
                        id='isPreferedHighSkill2'
                        value={true}
                        checked={isPreferedHighSkill === false}
                        onChange={() => changeIsPreferedHighSkill(!isPreferedHighSkill)}
                      />
                      <label className='form-check-label' htmlFor='isPreferedHighSkill2' style={{ fontWeight: 'normal' }}>
                        Trình độ chuyên môn được sắp xếp theo thứ tự ưu tiên đáp ứng được nhu cầu về trình độ và chi phí bỏ ra không quá lớn
                        (từ Kỹ sư - Cử nhân - Thạc sĩ - Tiến sĩ - Đại học - Cao đẳng - Trung cấp)
                      </label>
                    </div>
                  </li>
                  <li>
                    Giữa nhân viên cũng sẽ được sắp xếp theo số lượng công việc nhân viên đó phải làm trong thời gian diễn ra công việc đang
                    muốn phân công
                  </li>
                  <li>
                    Các nhân sự ứng có khả năng thực hiện công việc sẽ lấy ra theo danh sách nhân viên phù hợp với công việc dựa trên các
                    tag đã chọn. Bên cạnh đó các nhân viên cũng được sắp xếp theo thứ tự độ phù hợp với các tag đã chọn từ cao đến thấp ({' '}
                    <a style={{ cursor: 'pointer' }} onClick={() => setShowListTag(!showListTag)}>
                      {showListTag ? 'Ẩn danh sách' : 'Hiển thị danh sách'}
                    </a>{' '}
                    )
                    {!showListTag ? null : (
                      <>
                        <table id='tag-explain-show-data' className='table not-has-action table-striped table-bordered table-hover'>
                          <thead>
                            <tr>
                              <th>STT</th>
                              <th>Tên thẻ</th>
                              <th>Mô tả</th>
                              <th>Nhân sự thực hiện</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allTag
                              ?.filter((x) => dataProp?.proposals?.tasks?.find((t) => t?.tag?.find((tg) => String(tg) === String(x?._id))))
                              .map((item, listIndex) => {
                                return (
                                  <tr key={`tag-${listIndex}`}>
                                    <td>{listIndex + 1}</td>
                                    <td>{item?.name}</td>
                                    <td>{item?.description}</td>
                                    <td>{item?.employees.map((userItem) => convertEmpIdToName(allEmployee, userItem)).join(', ')}</td>
                                  </tr>
                                )
                              })}
                          </tbody>
                        </table>
                        <br />
                      </>
                    )}
                  </li>
                  <li>
                    Bên cạnh đó cơ chế đề xuất sẽ hỗ trợ hạn chế vấn đề mỗi nhân viên được đề xuất không phải làm quá nhiều công việc liên
                    tiếp
                  </li>
                </ul>
                <p>Sau khi tiền xử lý dữ liệu. Hệ thống sẽ sử dụng thuật toán đề xuất nhân sự (đệ quy, quay lui) để tính toán đề xuất.</p>
                <br />
              </div>
            }
          </div>

          <div style={{ display: 'none' }}>
            <p style={{ color: 'green', lineHeight: 2 }}>* Nhấn nút "Đề xuất" bên dưới để tính toán đề xuất nhân sự *</p>
            <button type='button' className='btn btn-success' onClick={() => handlePropose()}>
              Đề xuất
            </button>
            <br />
            <br />
            {isLoading === true && <div style={{ display: 'flex', justifyContent: 'center' }}>Đang tính toán đề xuất...</div>}
            {!proposedData ? null : (
              <div>
                {isLoading === false && proposedData.isComplete === 0 && (
                  <div style={{ display: 'flex', justifyContent: 'center', color: 'red' }}>
                    Không tính toán được, hãy kiểm tra lại danh sách nhân viên cho từng công việc!
                  </div>
                )}
                {isLoading === false && proposedData.isComplete === 1 && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'center', color: 'green' }}>
                      Đã tính toán xong - hãy nhấn lưu để áp dụng kết quả đề xuất!
                    </div>
                    <table id='proposal-result-show-data' className='table not-has-action table-striped table-bordered table-hover'>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Công việc</th>
                          <th>Nhân sự phân công ban đầu</th>
                          <th>Nhân sự đề xuất tự động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {proposedData.compareVersion?.map((item, listIndex) => {
                          return (
                            <tr key={`tag-${listIndex}`}>
                              <td>{listIndex + 1}</td>
                              <td>{item?.name}</td>
                              <td>
                                <div>
                                  <strong>Nhân sự trực tiếp: </strong>
                                  {item?.old?.directEmployees.map((userItem) => convertEmpIdToName(allEmployee, userItem)).join(', ')}
                                </div>
                                <div>
                                  <strong>Nhân sự dự phòng: </strong>
                                  {item?.old?.backupEmployees?.length > 0
                                    ? item?.old?.backupEmployees?.map((userItem) => convertEmpIdToName(allEmployee, userItem)).join(', ')
                                    : 'N/A'}
                                </div>
                              </td>
                              <td>
                                <div>
                                  <strong>Nhân sự trực tiếp: </strong>
                                  {item?.new?.directEmployees.map((userItem) => {
                                    return (
                                      <span>
                                        {' '}
                                        {/** &cedil; */}
                                        <span
                                          style={
                                            checkInArr(userItem, item?.old?.directEmployees)
                                              ? { color: 'green', fontWeight: 600 }
                                              : { color: 'red', fontWeight: 600 }
                                          }
                                        >{`${convertEmpIdToName(allEmployee, userItem)}`}</span>
                                        &#44;
                                      </span>
                                    )
                                  })}
                                </div>
                                <div>
                                  <strong>Nhân sự dự phòng: </strong>
                                  {item?.new?.backupEmployees?.length > 0
                                    ? item?.new?.backupEmployees?.map((userItem) => {
                                        return (
                                          <span>
                                            {' '}
                                            {/** &cedil; */}
                                            <span
                                              style={
                                                checkInArr(userItem, item?.old?.backupEmployees)
                                                  ? { color: 'green', fontWeight: 600 }
                                                  : { color: 'red', fontWeight: 600 }
                                              }
                                            >{`${convertEmpIdToName(allEmployee, userItem)}`}</span>
                                            &#44;
                                          </span>
                                        )
                                      })
                                    : 'N/A'}
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { biddingPackagesManager, user, tasks } = state
  return { biddingPackagesManager, user, tasks }
}

const actionCreators = {
  proposeEmployeeForTask: BiddingPackageManagerActions.proposeEmployeeForTask
}

const connectComponent = connect(mapState, actionCreators)(withTranslate(ModalProposeEmpForTask))
export { connectComponent as ModalProposeEmpForTask }
