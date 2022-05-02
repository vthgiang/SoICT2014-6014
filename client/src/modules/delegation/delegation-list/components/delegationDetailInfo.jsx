import React, { useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

import { DialogModal } from '../../../../common-components';

const DelegationDetailInfo = (props) => {
    const [state, setState] = useState({
        delegationID: undefined,
    })

    const { translate, delegation } = props;
    const { delegationID } = state;

    // Nhận giá trị từ component cha
    if (props.delegationID !== delegationID || props.delegationName !== state.delegationName || props.description !== state.description) {
        setState({
            ...state,
            delegationID: props.delegationID,
            delegationName: props.delegationName,
            description: props.description,
        })
    }

    const { delegationName, description } = state

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-info-delegation-hooks`} isLoading={delegation.isLoading}
                title={translate('manage_delegation.detail_info_delegation')}
                formID={`form-detail-delegation-hooks`}
                size={50}
                maxWidth={500}
                hasSaveButton={false}
                hasNote={false}
            >
                <form id={`form-detail-delegation-hooks`}>
                    {/* Tên ví dụ */}
                    <div className={`form-group`}>
                        <label>{translate('manage_delegation.delegationName')}:</label>
                        <span> {delegationName}</span>
                    </div>

                    {/* Mô tả ví dụ */}
                    <div className={`form-group`}>
                        <label>{translate('manage_delegation.description')}:</label>
                        <span> {description}</span>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const delegation = state.delegation;
    return { delegation };
}

const connectedDelegationDetailInfo = React.memo(connect(mapStateToProps, null)(withTranslate(DelegationDetailInfo)));
export { connectedDelegationDetailInfo as DelegationDetailInfo }