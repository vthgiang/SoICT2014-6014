import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../../common-components';

import {
    GeneralTab
} from '../../employee-info/components/combinedContent';

import { EmployeeInfoActions } from '../../employee-info/redux/actions';
import { WorkPlanActions } from '../../../work-plan/redux/actions'
class EmployeeViewForm extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, };
        this.state = {
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                dataStatus: 0,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (nextProps._id !== this.state._id && !nextProps.employeesInfo.isLoading) {
            await this.props.getEmployeeProfile({ id: nextProps._id, callAPIByUser: false });
            this.props.getListWorkPlan({ year: new Date().getFullYear() });
            this.setState({
                dataStatus: this.DATA_STATUS.QUERYING,
                employees: [],
                roles: [],
                totalAnnualLeaves: "",
            })
            return false;
        };
        if (this.state.dataStatus === this.DATA_STATUS.QUERYING && !nextProps.employeesInfo.isLoading && !nextProps.workPlan.isLoading) {
            let annualLeaves = nextProps.employeesInfo.annualLeaves;
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
            let totalAnnualLeaves = nextProps.workPlan.maximumNumberOfLeaveDays * 8 - total;
            this.setState({
                dataStatus: this.DATA_STATUS.AVAILABLE,
                employees: nextProps.employeesInfo.employees,
                roles: nextProps.employeesInfo.roles,
                totalAnnualLeaves: totalAnnualLeaves > 0 ? totalAnnualLeaves : 0

            });
            return true;
        };
        return false;
    }

    render() {
        const { employeesInfo, translate } = this.props;

        const { duplicate } = this.props;

        let { _id, employees, roles = [], totalAnnualLeaves } = this.state;
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
    };
}

function mapState(state) {
    const { employeesInfo, workPlan } = state;
    return { employeesInfo, workPlan };
};

const actionCreators = {
    getEmployeeProfile: EmployeeInfoActions.getEmployeeProfile,
    getListWorkPlan: WorkPlanActions.getListWorkPlan,
}

const viewForm = connect(mapState, actionCreators)(withTranslate(EmployeeViewForm));
export { viewForm as EmployeeViewForm };