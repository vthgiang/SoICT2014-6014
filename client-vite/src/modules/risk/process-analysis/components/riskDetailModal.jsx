import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

import { DialogModal } from '../../../../common-components';
import { roundProb } from '../TaskPertHelper'

const RiskDetailInfo = (props) => {
    const { riskInfo, translate } = props
    useEffect(() => {
        console.log('riskInfo', riskInfo)

    }, [])
     const getTaskClassName = (classNum) => {
        if (classNum == 1) return 'Các công việc ảnh hưởng tới yếu tố con người'
        if (classNum == 2) return 'Các công việc ảnh hưởng tới yếu tố con người và thiết bị'
        if (classNum == 3) return 'Các công việc ảnh hưởng tới các yếu tố sản phẩm'
        if (classNum == 4) return 'Các công việc chịu ảnh hưởng bởi các yếu tố : Thiết bị và môi trường'
    }
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-show-risk`} isLoading={false}
                title={translate('process_analysis.risk_detail_modal.title')}
                formID={`form-detail-example-hooks`}
                size={50}
                maxWidth={500}
                hasSaveButton={false}
                hasNote={false}
            >
                <form id={`form-detail-example-hooks`}>
                    <div className={`form-group`}>
                        <div style={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
                            <div className="col-sm-3">
                                <p>{translate('process_analysis.risk_detail_modal.occurrence_probability')}</p>
                            </div>

                            <div className="progress-task col-sm-9" style={{ width: '50%', padding: '0px 0px 0px 0px', margin: '0' }}>
                                <div className="fillmult" data-width={`${riskInfo && roundProb(riskInfo.prob)}%`} style={{ width: `${riskInfo && roundProb(riskInfo.prob)}%`, backgroundColor: '#3c8dbc' }}></div>
                                <span className="perc"> {riskInfo && roundProb(riskInfo.prob)}%</span>
                            </div>

                        </div>
                    </div>
                    {/* Tên rủi ro */}
                    <div className={`form-group`}>
                        <label>{translate('manage_risk.riskName')}:</label>
                        <span> {riskInfo.name}</span>
                    </div>
                    {/* Mô tả rủi ro*/}
                    <div className={`form-group`}>
                        <label>{translate('process_analysis.risk_detail_modal.affected_task_class')}: </label>
                        {/* <span> {riskInfo.taskClass.join(',')}</span> */}
                        <ul>
                            {riskInfo && riskInfo.taskClass.lenght != 0 && riskInfo.taskClass.map((r, index) => (
                                <li key={index}> {r ? getTaskClassName(r) : 'None'}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={`form-group`}>
                        {riskInfo && riskInfo.parentList.lenght != 0}<label>{translate('process_analysis.risk_detail_modal.parents')}: </label>
                        <ul>
                            {riskInfo && riskInfo.parentList.lenght != 0 && riskInfo.parentList.map((r, index) => (
                                <li key={index}> {r.name ? r.name : 'None'}</li>
                            ))}
                        </ul>

                    </div>




                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const risk = state.risk;
    return { risk };
}

const connectedRiskDetailInfo = React.memo(connect(mapStateToProps, null)(withTranslate(RiskDetailInfo)));
export { connectedRiskDetailInfo as RiskDetailInfo }