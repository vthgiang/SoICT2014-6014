import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ButtonModal, DatePicker, DialogModal, SelectBox, SlimScroll } from '../../../../../../common-components';
import { formatToTimeZoneDate, formatYearMonth } from '../../../../../../helpers/formatDate';
import { UserActions } from '../../../../../super-admin/user/redux/actions';
import { worksActions } from '../../../manufacturing-works/redux/actions';
import { workScheduleActions } from '../../redux/actions';

class WorkerScheduleCreateForm extends Component {
    constructor(props) {
        super(props);
        let currentDate = Date.now();
        let currentMonthYear = formatYearMonth(currentDate);
        let allDaysOfMonth = this.getAllDaysOfMonth(currentMonthYear);
        this.state = {
            month: currentMonthYear,
            allDaysOfMonth: allDaysOfMonth,
            numberOfTurns: 3,
            user: 'all',
            // Biến showModal được dùng để nhận biết lần đầu tiên ấn vào ButtonModal Create
            // Để gọi api lấy dữ liệu nhân viên
            showModal: false
        }
    }

    getAllDaysOfMonth = (month) => {
        let arrayMonthYear = month.split("-");
        let lastDaysOfMonth = new Date(arrayMonthYear[1], arrayMonthYear[0], 0);
        let days = lastDaysOfMonth.getDate();

        let arrayDayOfMonth = [];
        for (let i = 1; i <= days; i++) {
            arrayDayOfMonth.push(i);
        }
        return arrayDayOfMonth;
    }


    handleMonthChange = (value) => {
        let allDaysOfMonth = this.getAllDaysOfMonth(value);
        this.setState((state) => ({
            ...state,
            month: value,
            allDaysOfMonth: allDaysOfMonth
        }));
    }

    // getListUserOfAllWorks = () => {
    //     const { translate, user, manufacturingWorks } = this.props;
    //     // Lấy ra cá nhà máy đang hoạt động
    //     const { employees } = user;
    //     const { listWorks } = manufacturingWorks;
    //     console.log(employees);
    //     console.log(listWorks);
    //     let arrayRoleIdManagers = [];
    //     listWorks.map(works => {
    //         arrayRoleIdManagers = [...arrayRoleIdManagers, ...works.organizationalUnit.managers]
    //     });
    //     arrayRoleIdManagers = arrayRoleIdManagers.map(role => role._id);

    //     // Lấy ra tất cả các nhân viên trong 2 nhà máy đó
    //     // Lấy ra các roleId của các trưởng phòng

    //     let listUserArray = [{
    //         value: 'all',
    //         text: translate('manufacturing.work_schedule.choose_all_user')
    //     }];

    //     if (employees) {
    //         let arrayEmployees = employees.filter((employee) => !arrayRoleIdManagers.includes(employee.roleId._id))
    //         console.log(arrayEmployees);
    //         arrayEmployees.map((e) => {
    //             listUserArray.push({
    //                 value: e.userId._id,
    //                 text: e.userId.name + " - " + e.userId.email
    //             })
    //         });
    //     }

    //     return listUserArray;

    // }

    getListUserOfAllWorks = () => {
        const { translate, manufacturingWorks } = this.props;
        const { employees } = manufacturingWorks;

        let listUserArray = [{
            value: 'all',
            text: translate('manufacturing.work_schedule.choose_all_user')
        }];

        if (employees) {
            employees.map((e) => {
                listUserArray.push({
                    value: e.userId._id,
                    text: e.userId.name + " - " + e.userId.email
                })
            });
        }
        return listUserArray;
    }

    handleUserChange = (value) => {
        const user = value[0];
        this.setState((state) => ({
            ...state,
            user: user
        }))
    }

    // handleNumberOfTurnsChange = (e) => {
    //     const { value } = e.target;
    //     this.setState((state) => ({
    //         ...state,
    //         numberOfTurns: value
    //     }))
    // }

    save = () => {
        let { user, month, numberOfTurns } = this.state;
        let data = {};
        if (user === "all") {
            data = {
                allUser: true,
                month: formatToTimeZoneDate(month),
                numberOfTurns: numberOfTurns,
                currentRole: localStorage.getItem("currentRole")
            }
        } else {
            data = {
                user: user,
                month: formatToTimeZoneDate(month),
                numberOfTurns: numberOfTurns,
                currentRole: localStorage.getItem("currentRole")
            }
        }

        this.props.createWorkSchedule(data);
    }

    handleClickCreate = () => {
        this.setState({
            showModal: true
        });
    }

    shouldComponentUpdate = (nextPorps, nextState) => {
        if (nextState.showModal !== this.state.showModal) {
            // const { manufacturingWorks } = this.props;
            // const { listWorks } = manufacturingWorks;
            // let arrayOrganizationalUnitIds = []
            // if (listWorks.length) {
            //     listWorks.map((works) => {
            //         arrayOrganizationalUnitIds.push(works.organizationalUnit._id)
            //     });
            // }
            // this.props.getAllEmployeeOfUnitByIds(arrayOrganizationalUnitIds);
            this.props.getAllUsersByWorksManageRole({ currentRole: localStorage.getItem('currentRole') });
            return false;
        }
        return true;
    }

    render() {
        const { translate, workSchedule } = this.props;
        const { user, month, allDaysOfMonth, numberOfTurns } = this.state;
        // Tao mang cac ca
        let turns = []
        for (let i = 1; i <= numberOfTurns; i++) {
            turns.push(i)
        }
        return (
            < React.Fragment >
                <ButtonModal onButtonCallBack={this.handleClickCreate} modalID="modal-create-worker-work-schedule" button_name={translate('manufacturing.work_schedule.add_work_schedule_button')} title={translate('manufacturing.work_schedule.add_work_schedule')} />
                <DialogModal
                    modalID="modal-create-worker-work-schedule" isLoading={workSchedule.isLoading}
                    formID="form-create-worker-work-schedule"
                    title={translate('manufacturing.work_schedule.add_work_schedule_mill')}
                    msg_success={translate('manufacturing.work_schedule.create_successfully')}
                    msg_faile={translate('manufacturing.work_schedule.create_failed')}
                    func={this.save}
                    // disableSubmit={!this.isFormValidated()}
                    hasNote={false}
                    size={50}
                    maxWidth={500}
                >
                    <form id="form-create-worker-work-schedule">
                        <div className={`form-group`}>
                            <label>{translate('manufacturing.work_schedule.employee')}</label>
                            <SelectBox
                                id={`select-worker-create-work-schedule`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={user}
                                items={this.getListUserOfAllWorks()}
                                onChange={this.handleUserChange}
                                multiple={false}
                            />
                        </div>
                        <div className={`form-group`}>
                            <label>{translate('manufacturing.work_schedule.month')}</label>
                            <DatePicker
                                id={`work-schedule-create-month-worker`}
                                value={month}
                                dateFormat={"month-year"}
                                onChange={this.handleMonthChange}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.work_schedule.number_turns')}<span className="text-red">*</span></label>
                            <input type="number" disabled={true} value={numberOfTurns} className="form-control" onChange={this.handleNumberOfTurnsChange}></input>
                        </div>
                        <div id="create-croll-table-worker" className="form-inline">
                            <table id="create-work-schedule-table-worker" className="table table-striped table-bordered table-hover not-sort">
                                <thead>
                                    <tr>
                                        <th style={{ width: 100 }}>{translate('manufacturing.work_schedule.work_turns')}</th>
                                        {
                                            allDaysOfMonth.map((day, index) => (
                                                <th key={index}>{day}</th>
                                            ))

                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        turns.map((turn, index) => {
                                            return (
                                                <tr key={index}>

                                                    <td>{translate(`manufacturing.work_schedule.turn_${turn}`)}</td>
                                                    {
                                                        allDaysOfMonth.map((day, index2) =>
                                                            (
                                                                <td key={index2}>
                                                                    <input type="checkbox" disabled={true} />
                                                                </td>
                                                            )
                                                        )
                                                    }
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <SlimScroll outerComponentId='create-croll-table-worker' innerComponentId='create-work-schedule-table-worker' innerComponentWidth={1000} activate={true} />
                    </form>
                </DialogModal>
            </React.Fragment >
        )

    }


}

function mapStateToProps(state) {
    const { workSchedule, user, manufacturingWorks } = state;
    return { workSchedule, user, manufacturingWorks }
}

const mapDispatchToProps = {
    createWorkSchedule: workScheduleActions.createWorkSchedule,
    // getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
    getAllUsersByWorksManageRole: worksActions.getAllUsersByWorksManageRole
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(WorkerScheduleCreateForm));