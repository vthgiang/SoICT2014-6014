import React from 'react';
import { connect } from 'react-redux';

import { withTranslate } from "react-redux-multilingual";

import { DelegationTable } from './delegationTable';

import { DelegationTableTask } from './delegationTableTask';

function ManageDelegation(props) {
    const { translate } = props;

    return (
        <div className="nav-tabs-custom">
            <ul className="nav nav-tabs">
                <li className="active"><a title={translate('manage_delegation.delegateTypeRole')} data-toggle="tab" href={`#role_delegation`}>{translate('manage_delegation.delegateTypeRole')}</a></li>
                <li><a title={translate('manage_delegation.delegateTypeTask')} data-toggle="tab" href={`#task_delegation`}>{translate('manage_delegation.delegateTypeTask')}</a></li>
            </ul>
            <div className="tab-content">


                <div className="tab-pane active" id="role_delegation">
                    <DelegationTable
                    />

                </div>


                <div className="tab-pane" id="task_delegation">
                    <DelegationTableTask
                    />
                </div>


            </div>
        </div>
    );
}
const mapStateToProps = state => state;

export default connect(mapStateToProps, null)(withTranslate(ManageDelegation));