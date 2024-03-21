import React from 'react'
import PropTypes from 'prop-types'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal } from '../../../../common-components'
import EvaluationTabInfoForm from './evaluationTabInfoForm'
import HistoriesActionTabForm from './historiesActionTabForm'
EvaluationInfoForm.propTypes = {}

function EvaluationInfoForm(props) {
  const { translate, evaluationInfo } = props
  return (
    <React.Fragment>
      <DialogModal
        modalID='modal-crm-evaluation-info'
        //isLoading={crm.cares.isLoading}
        formID='modal-crm-evaluation-info'
        title={translate('crm.care.info')}
        size={50}
        disableSubmit={true}
      >
        {/* Form xem công việc chăm sóc khách hàng */}

        <div className='description-box' style={{ lineHeight: 1.5 }}>
          <div className='nav-tabs-custom'>
            <ul className='nav nav-tabs'>
              <li className='active'>
                <a href={`#evaluation-tab`} data-toggle='tab'>
                  Thông tin đánh giá nhân viên
                </a>
              </li>
              <li>
                <a href={`#histories-action`} data-toggle='tab'>
                  Lịch sử làm việc
                </a>
              </li>
            </ul>
            <div className='tab-content'>
              {/* Tab thông tin đánh giá nhân viên */}

              <EvaluationTabInfoForm id={`evaluation-tab`} evaluationInfo={evaluationInfo} />
              {/* Tab lịch sử làm việc */}
              <HistoriesActionTabForm id={'histories-action'} />
            </div>
          </div>
        </div>
      </DialogModal>
    </React.Fragment>
  )
}
export default withTranslate(EvaluationInfoForm)
