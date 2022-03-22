import React, { useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

import { DialogModal } from '../../../../common-components';

const PolicyDetailInfo = (props) => {
    const [state, setState] = useState({
        policyID: undefined,
    })

    const { translate, policy } = props;
    const { policyID } = state;

    // Nhận giá trị từ component cha
    if (props.policyID !== policyID) {
        setState({
            ...state,
            policyID: props.policyID,
            policyName: props.policyName,
            description: props.description,
        })
    }

    const { policyName, description } = state

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-info-policy-hooks`} isLoading={policy.isLoading}
                title={translate('manage_policy.detail_info_policy')}
                formID={`form-detail-policy-hooks`}
                size={50}
                maxWidth={500}
                hasSaveButton={false}
                hasNote={false}
            >
                <form id={`form-detail-policy-hooks`}>
                    {/* Tên ví dụ */}
                    <div className={`form-group`}>
                        <label>{translate('manage_policy.policyName')}:</label>
                        <span> {policyName}</span>
                    </div>

                    {/* Mô tả ví dụ */}
                    <div className={`form-group`}>
                        <label>{translate('manage_policy.description')}:</label>
                        <span> {description}</span>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const policy = state.policy;
    return { policy };
}

const connectedPolicyDetailInfo = React.memo(connect(mapStateToProps, null)(withTranslate(PolicyDetailInfo)));
export { connectedPolicyDetailInfo as PolicyDetailInfo }