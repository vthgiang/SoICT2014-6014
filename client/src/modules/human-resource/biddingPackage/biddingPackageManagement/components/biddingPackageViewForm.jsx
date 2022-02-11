import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../../common-components';

import {
    GeneralTab
} from '../../employee-info/components/combinedContent';

import { BiddingPackageInfoActions } from '../../employee-info/redux/actions';
import { WorkPlanActions } from '../../../work-plan/redux/actions'
const BiddingPackageViewForm = (props) => {
    const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, };
    
    const [state, setState] = useState({
        dataStatus: DATA_STATUS.NOT_AVAILABLE
    })

    if (props._id != state._id) {
        setState(state => ({
            ...state,
            _id: props._id,
            dataStatus: 0,
        }))
    }

       useEffect(() => {
        const shouldComponentDidUpdate = async () => {
            if (props._id !== state._id && !props.employeesInfo.isLoading) {
                await props.getBiddingPackageProfile({ id: props._id, callAPIByUser: false });
                props.getListWorkPlan({ year: new Date().getFullYear() });
                setState(state => ({
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                    employees: [],
                    roles: [],
                    totalAnnualLeaves: ""
                }))
            };
            if (state.dataStatus === DATA_STATUS.QUERYING && !props.employeesInfo.isLoading && !props.workPlan.isLoading) {
                let annualLeaves = props.employeesInfo.annualLeaves;
                let total = 0, data = [];
                annualLeaves.forEach(x => {
                    let check = false;
                    data.forEach(y => {
                        if (x.startDate === y.startDate && x.endDate === y.endDate) {
                            check = true;
                        }
                    })
                    if (!check) {
                        data = [...data, x];
                    }
                })
                data = data.filter(x => x.status === 'approved');
                data.forEach(x => {
                    if (x.totalHours && x.totalHours !== 0) {
                        total = total + x.totalHours;
                    } else {
                        total = total + (Math.round((new Date(x.endDate).getTime() - new Date(x.startDate).getTime()) / (24 * 60 * 60 * 1000)) + 1) * 8;
                    }
                });
                let totalAnnualLeaves = props.workPlan.maximumNumberOfLeaveDays * 8 - total;
                setState(state => ({
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE,
                    employees: props.employeesInfo.employees,
                    roles: props.employeesInfo.roles,
                    totalAnnualLeaves: totalAnnualLeaves > 0 ? totalAnnualLeaves : 0
                }));
            };
        }

        shouldComponentDidUpdate()
    }, [props._id, state._id, props.employeesInfo.isLoading, props.workPlan.isLoading, state.dataStatus]);

    const { employeesInfo, translate } = props;

    const { duplicate } = props;

    let { _id, employees, roles = [], totalAnnualLeaves } = state;
    return (
        <React.Fragment>
            <DialogModal
                size='75' modalID={duplicate ? `modal-view-employee-${duplicate}${_id}` : `modal-view-employee${_id}`} isLoading={employeesInfo.isLoading}
                formID={`form-view-employee${_id}`}
                title={translate('human_resource.profile.employee_management.employee_infor')}
                hasSaveButton={false}
                hasNote={false}
            >
                <form className="form-group" id={`form-view-employee${_id}`}>
                    {employees && employees.length !== 0 &&
                        employees.map((x, index) => (
                            <React.Fragment key={index}>
                                {/* Thông tin chung */}
                                <GeneralTab
                                    id={`view_one_general${_id}`}
                                    employee={x}
                                    roles={roles}
                                    totalAnnualLeaves={totalAnnualLeaves}
                                />
                            </React.Fragment>
                        ))}
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { employeesInfo, workPlan } = state;
    return { employeesInfo, workPlan };
};

const actionCreators = {
    getBiddingPackageProfile: BiddingPackageInfoActions.getBiddingPackageProfile,
    getListWorkPlan: WorkPlanActions.getListWorkPlan,
}

const viewForm = connect(mapState, actionCreators)(withTranslate(BiddingPackageViewForm));
export { viewForm as BiddingPackageViewForm };