import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { DialogModal } from '../../../../../../common-components'
import { manufacturingQualityCriteriaActions } from '../redux/actions'
import { formatDate } from '../../../../../../helpers/formatDate'

function CriteriaDetailInfo(props) {
    const { translate, criteriaDetailId, manufacturingQualityCriteria } = props
    const { currentCriteria } = manufacturingQualityCriteria

    useEffect(() => {
        const getData = async () => {
            await props.getDetailManufacturingQualityCriteria(criteriaDetailId);
        }
        if (criteriaDetailId) {
            getData();
        }
    }, [criteriaDetailId])
    
    return (
        <>
            <DialogModal
                modalID={`modal-detail-info-criteria`}
                isLoading={false}
                title={translate('manufacturing.quality.criteria.detail')}
                formID={`form-detail-criteria`}
                size={75}
                maxWidth={600}
                hasSaveButton={false}
                hasNote={false}
            >

                <form id={`form-detail-error`}>
                    <div className='row'>
                        <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
                            <div className='form-group'>
                                <strong>{translate('manufacturing.quality.criteria.code')}:&emsp;</strong>
                                {currentCriteria?.code}
                            </div>
                            <div className='form-group'>
                                <strong>{translate('manufacturing.quality.good')}:&emsp;</strong>
                                {currentCriteria?.operation}
                            </div>
                            <div className='form-group'>
                                <strong>{translate('manufacturing.quality.created_at')}:&emsp;</strong>
                                {formatDate(currentCriteria?.createdAt)}
                            </div>
                        </div>

                        <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
                            <div className='form-group'>
                                <strong>{translate('manufacturing.quality.criteria.name')}:&emsp;</strong>
                                {currentCriteria?.name}
                            </div>
                            <div className='form-group'>
                                <strong>{translate('manufacturing.quality.criteria.creator')}:&emsp;</strong>
                                {currentCriteria?.creator.name}
                            </div>
                            <div className='form-group'>
                                <strong>{translate('manufacturing.quality.status')}:&emsp;</strong>
                                <span style={{ color: currentCriteria? translate(`manufacturing.quality.${currentCriteria.status}.color`) : "" }}>
                                    {currentCriteria? translate(`manufacturing.quality.${currentCriteria.status}.content`) : ""}
                                </span>
                            </div>
                            <div className='form-group'>
                                <strong>{translate('manufacturing.quality.good')}:&emsp;</strong>
                                <ul>
                                    {currentCriteria?.goods.map((item, index) => (
                                        <li key={index}>{item.name}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                            <fieldset className='scheduler-border'>
                                <legend className='scheduler-border'>{translate('manufacturing.quality.criteria.checklist')}</legend>
                                <div className={`form-group`}>
                                    <table className='table'>
                                        <thead>
                                            <tr>
                                                <th>{translate('manufacturing.quality.index')}</th>
                                                <th>{translate('manufacturing.quality.criteria.name')}</th>
                                                <th>{translate('manufacturing.quality.criteria.method')}</th>
                                                <th>{translate('manufacturing.quality.criteria.accepted_value')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentCriteria?.checklist.map((item, index) => (
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.method}</td>
                                                    <td>{item.acceptedValue}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </form>
            </DialogModal>
        </>
    )
}

function mapStateToProps(state) {
    const { manufacturingQualityCriteria } = state
    return { manufacturingQualityCriteria }
}

const mapDispatchToProps = {
    getDetailManufacturingQualityCriteria: manufacturingQualityCriteriaActions.getDetailManufacturingQualityCriteria,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CriteriaDetailInfo))
