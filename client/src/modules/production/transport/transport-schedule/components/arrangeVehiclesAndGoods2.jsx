import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DataTableSetting, DeleteNotification, PaginateBar, SlimScroll, SelectBox } from '../../../../../common-components'
import { formatToTimeZoneDate } from '../../../../../helpers/formatDate'
import './arrangeVehiclesAndGoods.css'
import { transportRequirementsActions } from '../../transport-requirements/redux/actions'
import { transportVehicleActions } from '../../transport-vehicle/redux/actions'
import { transportScheduleActions } from '../redux/actions'
import { transportPlanActions } from '../../transport-plan/redux/actions'
import { MapContainer } from './googleReactMap/maphook'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'

function ArrangeVehiclesAndGoods(props) {
  let { currentTransportSchedule, callBackStateData } = props

  const [transportArrangeRequirements, setAransportArrangeRequirements] = useState([])

  /**
   * = transportPlan.transportVehicles
   * [
   *  carriers: [],
   *  transportVehicle: {
   *      _id, payload, volume, asset....
   * }
   * ]
   */
  const [allTransportVehicle, setAllTransportVehicle] = useState([])

  /**
   * Trạng thái các lựa chọn hiện tại
   * [{
   *  vehicle: id,
   *  transportRequirements: [{
   *      id, id...
   * }]
   * }]
   */

  const [distributionState, setDistributionState] = useState([])

  useEffect(() => {
    props.getAllTransportVehicles({ page: 1, limit: 100 })
    props.getAllTransportRequirements({ page: 1, limit: 100 })
    props.getAllTransportPlans({ page: 1, limit: 100 })
  }, [])

  useEffect(() => {
    console.log(currentTransportSchedule, ' currentTransportScheduleaaaaaaaaaaaa')
    if (currentTransportSchedule) {
      if (currentTransportSchedule.transportPlan) {
        console.log(currentTransportSchedule.transportPlan)
        setAransportArrangeRequirements(currentTransportSchedule.transportPlan.transportRequirements)
        setAllTransportVehicle(currentTransportSchedule.transportPlan.transportVehicles)
        if (currentTransportSchedule.transportVehicles) {
          let distributionList = []
          currentTransportSchedule.transportVehicles.map((item, index) => {
            let transportRequirementsList = []
            item.transportRequirements.map((item2, index2) => {
              transportRequirementsList.push(item2._id)
            })
            distributionList.push({
              vehicle: item.transportVehicle._id,
              transportRequirements: transportRequirementsList
            })
          })
          setDistributionState(distributionList)
        }
      }
    }
  }, [currentTransportSchedule])

  useEffect(() => {
    // console.log(distributionState, "sad");
  }, [distributionState])

  const handleSelectVehicle = async (transportRequirement, transportVehicle, indexRequirement, indexVehicle) => {
    /**
     *
     * distributionList =
     * [{vehicle: id
     * transportRequirements: [
     *      id1,id2
     * ]}]
     *
     * thực hiện xóa bỏ transportRequirement ở element cũ và thêm vào element mới
     */
    let distributionList = [...distributionState]

    const requirementId = String(transportRequirement._id)
    const vehicleId = String(transportVehicle.vehicle._id)
    let newDistribution = []

    if (distributionList && distributionList.length !== 0) {
      /**
       * Lọc bỏ requirement đc xếp ở xe cũ
       */
      let isDelete = false
      for (let i = 0; i < distributionList.length; i++) {
        let distribution = distributionList[i]
        if (distribution.transportRequirements && distribution.transportRequirements.length !== 0) {
          // Kiểm tra có phaỉ click lại xe hiện tại ko, đúng === xóa bỏ phân phối
          let trace = distribution.transportRequirements.filter((r) => String(r) === requirementId)
          if (trace && trace.length !== 0) {
            if (distribution.vehicle === vehicleId) {
              isDelete = true
            }
          }
          distribution.transportRequirements = distribution.transportRequirements.filter((r) => String(r) !== requirementId)
        }
      }
      if (isDelete) {
        setDistributionState(distributionList)
        return
      }
      /**
       * Thêm requirement vào xe
       */
      let check = distributionList.filter((r) => String(r.vehicle) === vehicleId)
      if (check && check.length !== 0) {
        check[0].transportRequirements.push(requirementId)
      } else {
        // chưa có xe => tạo mới
        newDistribution = {
          vehicle: vehicleId,
          transportRequirements: [requirementId]
        }
        distributionList.push(newDistribution)
      }
    } else {
      // Chưa có list -> tạo mới
      distributionList = [
        {
          vehicle: vehicleId,
          transportRequirements: [requirementId]
        }
      ]
    }
    setDistributionState(distributionList)
  }

  /**
   * trả về trạng thái hàng được xếp lên xe này hay ko, trả về tên class iconactive
   * @param {*} vehicleId
   * @param {*} requirementId
   * @returns
   */
  const getStatusTickBox = (vehicleId, requirementId, distributionList) => {
    // Kiểm tra có state trạng thái các phân phối lựa chọn hay chưa
    if (distributionList && distributionList.length !== 0) {
      // Tìm xe
      let distribution = distributionList.filter((r) => String(r.vehicle) === String(vehicleId))
      // console.log(distribution, " b1");
      if (distribution && distribution.length !== 0) {
        // Kiểm tra có requirementId trên xe này không
        let check = distribution[0].transportRequirements.filter((r) => String(r) === String(requirementId))
        // console.log(check, " b2")
        if (check && check.length !== 0) {
          return 'iconactive'
        } else {
          return 'iconinactive'
        }
      } else {
        return 'iconinactive'
      }
    } else {
      return 'iconinactive'
    }
  }

  const handleSubmitDistribution = () => {
    console.log(distributionState)
    let data = []
    /**
     * data =
     * [
     *  transportVehicle: id,
     *  transportRequirements: [id1, id2,...]
     * ]
     * item = [
     *      vehicle: id,
     *      transportRequirements: [id, id]
     * ]
     * data model tương ứng:
     * transportVehicles: [
     *      transportVehicle: id,
     *      transportRequirements: [id, id];
     * ]
     */
    if (distributionState && distributionState.length !== 0) {
      distributionState.map((item, index) => {
        let singleData = {
          transportVehicle: item.vehicle,
          transportRequirements: item.transportRequirements
        }
        data.push(singleData)
      })
    }
    console.log(data)
    props.editTransportScheduleByPlanId(currentTransportSchedule?.transportPlan?._id, { transportVehicles: data })
    // reloadOrdinalTransport();
  }

  useEffect(() => {
    let data = []
    /**
     * data =
     * [
     *  transportVehicle: id,
     *  transportRequirements: [id1, id2,...]
     * ]
     * item = [
     *      vehicle: id,
     *      transportRequirements: [id, id]
     * ]
     * data model tương ứng:
     * transportVehicles: [
     *      transportVehicle: id,
     *      transportRequirements: [id, id];
     * ]
     */
    if (distributionState && distributionState.length !== 0) {
      distributionState.map((item, index) => {
        let singleData = {
          transportVehicle: item.vehicle,
          transportRequirements: item.transportRequirements
        }
        data.push(singleData)
      })
    }
    callBackStateData({ transportVehicles: data })
  }, [distributionState])

  return (
    <React.Fragment>
      <div className='box-body qlcv'>
        {/* <div className="form-inline">

                <div className="form-group">
                    <button type="button" className="btn btn-success" title="Lưu" 
                        onClick={handleSubmitDistribution}
                    >
                        Lưu
                    </button>
                </div>
            </div> */}
        {
          // <MapContainer
          //     locations={[
          //         {
          //             name: "1",
          //             location: {
          //                 lat: 21.0058354500001,
          //                 lng: 105.842277338
          //             }
          //         },
          //         {
          //             name: "2",
          //             location: {
          //                 lat: 21.0365079490001,
          //                 lng: 105.783347768
          //             }
          //         },
          //         // {
          //         //     name: "3",
          //         //     location: {
          //         //         lat: 21.037254283,
          //         //         lng: 105.774934226
          //         //     }
          //         // },
          //         // {
          //         //     name: "4",
          //         //     location: {
          //         //         lat: 21.081394706,
          //         //         lng: 105.710463162
          //         //     }
          //         // },
          //     ]}
          // />
        }
        {allTransportVehicle && allTransportVehicle.length !== 0 && (
          <div className={'divTest'}>
            <table className={'tableTest table-bordered table-hover not-sort'}>
              <thead>
                <tr className='word-no-break'>
                  <th rowSpan={3}>{'STT'}</th>
                  <th colSpan={3} rowSpan={3}>
                    {'Yêu cầu vận chuyển'}
                  </th>
                  {allTransportVehicle &&
                    allTransportVehicle.length !== 0 &&
                    allTransportVehicle.map((item, index) => item && <th key={'v' + index}>{item.vehicle.name}</th>)}
                </tr>
                <tr className='word-no-break'>
                  {allTransportVehicle &&
                    allTransportVehicle.length !== 0 &&
                    allTransportVehicle.map(
                      (item, index) => item && <td key={index + 'trongtai'}>{'Trọng tải: ' + item.vehicle.payload}</td>
                    )}
                </tr>
                <tr className='word-no-break'>
                  {allTransportVehicle &&
                    allTransportVehicle.length !== 0 &&
                    allTransportVehicle.map(
                      (item, index) => item && <td key={index + 'thetich'}>{'Thể tích thùng: ' + item.vehicle.volume}</td>
                    )}
                </tr>
              </thead>
              <tbody className='transport-special-row'>
                {transportArrangeRequirements &&
                  transportArrangeRequirements.length !== 0 &&
                  transportArrangeRequirements.map(
                    (item, index) =>
                      item && (
                        <tr key={index + 'tt'} className='word-no-break'>
                          <td>{index + 1}</td>
                          <td>
                            <div>
                              <p className='p-header'>{'Mã yêu cầu:'}</p>
                              <p>{item.code}</p>
                            </div>
                            <div>
                              <p className='p-header'>{'Loại yêu cầu:'}</p>
                              <p>{'Giao hàng'}</p>
                            </div>
                          </td>
                          <td>
                            <div>
                              <p className='p-header'>{'Điểm nhận:'}</p>
                              <p>{item.fromAddress}</p>
                            </div>
                            <div>
                              <p className='p-header'>{'Điểm giao:'}</p>
                              <p>{item.toAddress}</p>
                            </div>
                          </td>
                          <td>
                            <div>
                              <p className='p-header'>{'Khối lượng:'}</p>
                              <p>{item.payload}</p>
                            </div>
                            <div>
                              <p className='p-header'>{'Thể tích:'}</p>
                              <p>{item.volume}</p>
                            </div>
                          </td>

                          {allTransportVehicle &&
                            allTransportVehicle.length !== 0 &&
                            allTransportVehicle.map(
                              (item1, index1) =>
                                item1 && (
                                  <td key={'vehicle ' + index + ' ' + index1} className='tooltip-checkbox'>
                                    <span
                                      className={'icon ' + getStatusTickBox(item1.vehicle._id, item._id, distributionState)}
                                      title={'alo'}
                                      onClick={() => handleSelectVehicle(item, item1, index, index1)}
                                    ></span>
                                    {/* <span className="tooltiptext">
                                                <a style={{ color: "white" }} 
                                                    // onClick={() => this.handleShowDetailManufacturingCommand(command)}
                                                >{"1"}</a>
                                            </span> */}
                                  </td>
                                )
                            )}
                        </tr>
                      )
                  )}

                {/* <tr className="word-no-break">
                        <th>{"Điểm nhận"}</th>
                        <td colSpan={3}>{"Lê Thanh Nghị Bách Khoa, Hai Bà Trưng, Hà Nội "}</td>
                        <th>{"Khối lượng"}</th>
                        <td>{"100"}</td>
                    </tr>
                    <tr className="word-no-break">
                        <th>{"Điểm giao"}</th>
                        <td colSpan={3}>{"Thái Hà"}</td>
                        <th>{"Thể tích"}</th>
                        <td>{"1000"}</td>
                    </tr>

                    <tr className="word-no-break">
                        <th>{"Mã yêu cầu"}</th>
                        <td>{"123"}</td>
                        <th>{"Loại yêu cầu"}</th>
                        <td>{"Giao hàng"}</td>
                        <th>{"Hành động"}</th>
                        <td>{"Xem"}</td>
                        <td colSpan={2} rowSpan={3} key={"2"} className="tooltip-checkbox">
                            <span className="icon" title={"alo"} style={{ backgroundColor: "white"}}></span>
                            <span className="tooltiptext">
                                <a style={{ color: "white" }} 
                                    // onClick={() => this.handleShowDetailManufacturingCommand(command)}
                                >{"1"}</a>
                            </span>
                        </td>
                    </tr>
                    <tr className="word-no-break">
                        <th>{"Điểm nhận"}</th>
                        <td colSpan={3}>{"Lê Thanh Nghị Bách Khoa, Hai Bà Trưng, Hà Nội "}</td>
                        <th>{"Khối lượng"}</th>
                        <td>{"100"}</td>
                    </tr>
                    <tr className="word-no-break">
                        <th>{"Điểm giao"}</th>
                        <td colSpan={3}>{"Thái Hà"}</td>
                        <th>{"Thể tích"}</th>
                        <td>{"1000"}</td>
                    </tr>

                    <tr className="word-no-break">
                        <th>{"Mã yêu cầu"}</th>
                        <td>{"123"}</td>
                        <th><div>{"Loại yêu cầu"}</div><div>{"Loại yêu cầu"}</div></th>
                        <td>{"Giao hàng"}</td>
                        <th>{"Hành động"}</th>
                        <td>{"Xem"}</td>
                        <td colSpan={2} rowSpan={3} key={"2"} className="tooltip-checkbox">
                            <span className="icon" title={"alo"} style={{ backgroundColor: "white"}}></span>
                            <span className="tooltiptext">
                                <a style={{ color: "white" }} 
                                    // onClick={() => this.handleShowDetailManufacturingCommand(command)}
                                >{"1"}</a>
                            </span>
                        </td>
                    </tr>
                    <tr className="word-no-break">
                        <th>{"Điểm nhận"}</th>
                        <td colSpan={3}>{"Lê Thanh Nghị Bách Khoa, Hai Bà Trưng, Hà Nội "}</td>
                        <th>{"Khối lượng"}</th>
                        <td>{"100"}</td>
                    </tr>
                    <tr className="word-no-break">
                        <th>{"Điểm giao"}</th>
                        <td colSpan={3}>{"Thái Hà"}</td>
                        <th>{"Thể tích"}</th>
                        <td>{"1000"}</td>
                    </tr> */}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const transportArrangeRequirements = state.transportRequirements.lists
  const allTransportVehicle = state.transportVehicle.lists
  const allTransportPlans = state.transportPlan.lists
  const { currentTransportSchedule } = state.transportSchedule
  return { allTransportPlans, currentTransportSchedule }
}

const actions = {
  getAllTransportRequirements: transportRequirementsActions.getAllTransportRequirements,
  editTransportRequirement: transportRequirementsActions.editTransportRequirement,
  getAllTransportVehicles: transportVehicleActions.getAllTransportVehicles,
  getTransportScheduleByPlanId: transportScheduleActions.getTransportScheduleByPlanId,
  editTransportScheduleByPlanId: transportScheduleActions.editTransportScheduleByPlanId,
  getAllTransportPlans: transportPlanActions.getAllTransportPlans
}

const connectedArrangeVehiclesAndGoods = connect(mapState, actions)(withTranslate(ArrangeVehiclesAndGoods))
export { connectedArrangeVehiclesAndGoods as ArrangeVehiclesAndGoods }
