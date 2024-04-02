import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components'
import { withTranslate } from 'react-redux-multilingual'
import ValidationHelper from '../../../../../helpers/validationHelper'

import { TransportDetailNewOne } from './detail-transport-requirement/transportDetailNewOne'
import { TransportDetailGoods } from './detail-transport-requirement/transportDetailGoods'
import { TransportDetailTime } from './detail-transport-requirement/transportDetailTime'

import { formatDate } from '../../../../../helpers/formatDate'
import { getTypeRequirement, getTransportRequirementStatus, getPlanStatus } from '../../transportHelper/getTextFromValue'
// import { MapContainer } from '../../transportHelper/googleReactMap/mapContainer'
import { MapContainer } from '../../transportHelper/mapbox/map'

function TransportRequirementsViewDetails(props) {
  // const { translate, example, page, perPage } = props;
  const { curentTransportRequirementDetail } = props

  const [detailRequirement, setDetatilRequirement] = useState({
    code: ''
  })

  const [map, setMap] = useState({
    height: 10,
    nonDirectLocations: []
  })

  // const { exampleName, description, exampleNameError } = state;

  // const isFormValidated = () => {
  //     if (!exampleNameError.status) {
  //         return false;
  //     }
  //     return true;
  // }
  useEffect(() => {
    console.log(curentTransportRequirementDetail)
    if (curentTransportRequirementDetail) {
      let locations = []
      if (curentTransportRequirementDetail.geocode) {
        locations.push({
          name: 's',
          location: curentTransportRequirementDetail.geocode.fromAddress
        })
        locations.push({
          name: 'd',
          location: curentTransportRequirementDetail.geocode.toAddress
        })
      }
      setMap({
        ...map,
        nonDirectLocations: locations
      })

      setDetatilRequirement({
        code: curentTransportRequirementDetail.code,
        type: getTypeRequirement(curentTransportRequirementDetail.type),
        status: getTransportRequirementStatus(curentTransportRequirementDetail.status),
        creator_name: curentTransportRequirementDetail.creator?.name,
        creator_email: curentTransportRequirementDetail.creator?.email,
        creator_date: formatDate(curentTransportRequirementDetail.createdAt),
        departmentName: curentTransportRequirementDetail.department?.organizationalUnit?.name,
        approver: curentTransportRequirementDetail.approver?.name,
        approver_email: curentTransportRequirementDetail.approver?.email,
        timeRequests: curentTransportRequirementDetail.timeRequests,
        transportPlan: curentTransportRequirementDetail.transportPlan,
        note:
          curentTransportRequirementDetail.note && curentTransportRequirementDetail.status === '0'
            ? curentTransportRequirementDetail.note
            : null
      })
    }
  }, [curentTransportRequirementDetail])

  useEffect(() => {
    setTimeout(() => {
      let h_map = 250
      let elementContainerTag = document.getElementById('transport-detail-container-map')
      if (elementContainerTag) {
        if (elementContainerTag.clientHeight > h_map) {
          h_map = elementContainerTag.clientHeight
        }
      }

      setMap({
        ...map,
        height: h_map
      })
    }, 1000)
  }, [detailRequirement])

  return (
    <DialogModal
      modalID={`modal-detail-info-example-hooks`}
      title={'Chi tiết yêu cầu vận chuyển'}
      formID={`form-detail-transport-requirement`}
      size={100}
      maxWidth={500}
      hasSaveButton={false}
      hasNote={false}
    >
      <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
        {/* <fieldset className="scheduler-border" style={{ background: "#f5f5f5" }}> */}

        <div className='box box-solid'>
          <div className='box-header'>
            <div className='box-title'>{'Thông tin vận chuyển'}</div>
          </div>
          <div className='box-body qlcv'>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6' id='transport-detail-container-map'>
                <p>
                  <strong>{'Mã yêu cầu vận chuyển: '}&emsp;</strong> {detailRequirement.code}
                </p>
                <p>
                  <strong>{'Loại vận chuyển: '}&emsp;</strong> {detailRequirement.type}
                </p>
                <p>
                  <strong>{'Trạng thái: '}&emsp;</strong> {detailRequirement.status}
                </p>
                {detailRequirement?.note && (
                  <p>
                    <strong>{'Ghi chú: '}&emsp;</strong> {detailRequirement.note}
                  </p>
                )}
                <p>
                  <strong>{'Người tạo: '}&emsp;</strong> {detailRequirement.creator_name} &emsp;{' - '}&emsp;{' '}
                  {detailRequirement.creator_email}
                </p>
                <p>
                  <strong>{'Ngày tạo: '}&emsp;</strong> {detailRequirement.creator_date}
                </p>
                <p>
                  <strong>{'Đơn vị chịu trách nhiệm: '}&emsp;</strong>
                  {detailRequirement.departmentName}
                </p>
                <p>
                  <strong>{'Người xử lí yêu cầu: '}&emsp;</strong>
                  {detailRequirement.approver} &emsp;{' - '}&emsp; {detailRequirement.approver_email}
                </p>

                <TransportDetailNewOne curentTransportRequirementDetail={curentTransportRequirementDetail} />
              </div>
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                <MapContainer
                  loadingElement={<div style={{ height: map.height + 'px' }} />}
                  // containerElement={containerElement || <div style={{height: "80vh"}}/>}
                  containerElement={<div style={{ height: map.height + 'px' }} />}
                  mapElement={<div style={{ height: map.height + 'px' }} />}
                  // mapElement={mapElement || <div style={{height: `400px`}}/>}
                  // defaultCenter={defaultCenter || {lat: 21.078017641, lng: 105.70710958}}
                  defaultZoom={8}
                  nonDirectLocations={map.nonDirectLocations ? map.nonDirectLocations : []}
                  mapHeight={map.height + 'px'}
                />
              </div>
            </div>
          </div>
        </div>

        <div className='box box-solid'>
          <div className='box-header'>
            <div className='box-title'>{'Hàng hóa'}</div>
          </div>
          <div className='box-body qlcv'>
            <TransportDetailGoods listGoodsChosen={curentTransportRequirementDetail?.goods} />
          </div>
        </div>

        <div className='box box-solid'>
          <div className='box-header'>
            <div className='box-title'>{'Thời gian mong muốn'}</div>
          </div>
          <div className='box-body qlcv'>
            <TransportDetailTime listTimeChosen={curentTransportRequirementDetail?.timeRequests} />
          </div>
        </div>
        <div className='box box-solid'>
          <div className='box-header'>
            <div className='box-title'>{'Tiến độ thực hiện'}</div>
          </div>
          <div className='box-body qlcv'>
            {curentTransportRequirementDetail && !curentTransportRequirementDetail.transportPlan && (
              <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                <p>
                  <strong>{'Trạng thái: '} &emsp;</strong> {'Chưa lên kế hoạch'}
                </p>
              </div>
            )}
            {curentTransportRequirementDetail && curentTransportRequirementDetail.transportPlan && (
              <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                <p>
                  <strong>{'Ngày thực hiện dự kiến: '} &emsp;</strong>{' '}
                  {formatDate(curentTransportRequirementDetail.transportPlan.startTime)}
                </p>
                <p>
                  <strong>{'Trạng thái: '} &emsp;</strong> {getPlanStatus(curentTransportRequirementDetail.transportPlan.status)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DialogModal>
  )
}

function mapState(state) {
  // const bills = state.bills.listPaginate;
  // return { bills }
}

const actions = {
  // getBillsByType: BillActions.getBillsByType,
  // getCustomers: CrmCustomerActions.getCustomers,
}

const connectedTransportRequirementsViewDetails = connect(mapState, actions)(withTranslate(TransportRequirementsViewDetails))
export { connectedTransportRequirementsViewDetails as TransportRequirementsViewDetails }
