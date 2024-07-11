import React, { useState } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { DialogModal, SelectBox } from '../../../../../../common-components'

const FailureCreateForm = (props) => {
    const { translate, failureCauses, onKpiChange } = props
    const [failure, setFailure] = useState({
        type: '',
        count: 0
    })

    const getFailureCauseArr = () => {
        let failureCauseArr = [
            { value: '', text: translate('manufacturing.performance.choose_cause_type') }
        ]

        failureCauses.map((cause, index) => {
            failureCauseArr.push({
                value: index,
                text: translate(`manufacturing.performance.${cause.type}`)
            })
        })

        return failureCauseArr
    }

    const handleSelectChange = (name, value) => {
        setFailure({
            ...failure,
            [name]: value
        })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFailure({
            ...failure,
            [name]: value
        })
    }

    const isFormValidated = () => {
        if (failure.type === '' || failure.count <= 0) {
            return false
        }
        return true
    }

    const save = () => {
        const newFailureCauses = [...failureCauses]
        newFailureCauses[failure.type].count += Number(failure.count)
        onKpiChange({ failureCauses: newFailureCauses })
    }

    return (
        <DialogModal
            modalID='modal-add-failure'
            isLoading={false}
            formID='form-add-failure'
            title={translate('manufacturing.performance.add_failure')}
            msg_success={translate('manufacturing.performance.add_failure_success')}
            msg_failure={translate('manufacturing.performance.add_failure_failure')}
            func={save}
            disableSubmit={!isFormValidated()}
            size={50}
            maxWidth={500}
        >
            <form id='form-add-failure'>
                <div className='row'>
                    <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                        <div className='form-group'>
                            <label>
                                {translate('manufacturing.performance.failure_reason')}
                                <span className='text-red'>*</span>
                            </label>
                            <SelectBox
                                id='select-cause-type'
                                className='form-control select'
                                style={{ width: '100%' }}
                                items={getFailureCauseArr()}
                                disabled={false}
                                onChange={(value) => handleSelectChange('type', value[0])}
                                value={failure.type}
                            />
                        </div>
                        <div className='form-group'>
                            <label>
                                {translate('manufacturing.performance.count')}
                                <span className='text-red'>*</span>
                            </label>
                            <input
                                className='form-control'
                                type='number'
                                name='count'
                                value={failure.count}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </DialogModal>
    )
}

export default connect(null, null)(withTranslate(FailureCreateForm))
