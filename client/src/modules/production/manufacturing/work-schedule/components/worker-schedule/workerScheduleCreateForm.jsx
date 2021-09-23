import React, { Component,useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ButtonModal, DatePicker, DialogModal, SelectBox, SlimScroll } from '../../../../../../common-components';
import { formatToTimeZoneDate, formatYearMonth } from '../../../../../../helpers/formatDate';
import { UserActions } from '../../../../../super-admin/user/redux/actions';
import { worksActions } from '../../../manufacturing-works/redux/actions';
import { workScheduleActions } from '../../redux/actions';

function WorkerScheduleCreateForm(props) {
    const getAllDaysOfMonth = (month) => {
        let arrayMonthYear = month.split("-");
        let lastDaysOfMonth = new Date(arrayMonthYear[1], arrayMonthYear[0], 0);
        let days = lastDaysOfMonth.getDate();

        let arrayDayOfMonth = [];
        for (let i = 1; i <= days; i++) {
            arrayDayOfMonth.push(i);
        }
        return arrayDayOfMonth;
    }

    let currentDateDefault = Date.now();
    let currentMonthYearDefault = formatYearMonth(currentDateDefault);
    let allDaysOfMonthDefault = getAllDaysOfMonth(currentMonthYearDefault);
    const [state, setState] = useState({
        month: currentMonthYearDefault,
        allDaysOfMonth: allDaysOfMonthDefault,
        numberOfTurns: 3,
        user: 'all',
        // Biến showModal được dùng để nhận biết lần đầu tiên ấn vào ButtonModal Create
        // Để gọi api lấy dữ liệu nhân viên
        showModal: false
    })
    const [prevState, setPrevState] = useState(state);

    useEffect(() => {
        if(prevState.showModal !== state.showModal){
            props.getAllUsersByWorksManageRole({ currentRole: localStorage.getItem('currentRole') });
            setPrevState(state);
        }
    },[state])

    const handleMonthChange = (value) => {
        let allDaysOfMonth = getAllDaysOfMonth(value);
        setState((state) => ({
            ...state,
            month: value,
            allDaysOfMonth: allDaysOfMonth
        }));
    }

    // getListUserOfAllWorks = () => {
    //     const { translate, user, manufacturingWorks } = props;
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

    const getListUserOfAllWorks = () => {
        const { translate, manufacturingWorks } = props;
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

    const handleUserChange = (value) => {
        const user = value[0];
        setState((state) => ({
            ...state,
            user: user
        }))
    }

    // handleNumberOfTurnsChange = (e) => {
    //     const { value } = e.target;
    //     setState((state) => ({
    //         ...state,
    //         numberOfTurns: value
    //     }))
    // }

    const save = () => {
        let { user, month, numberOfTurns } = state;
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

        props.createWorkSchedule(data);
    }

    const handleClickCreate = () => {
        setState({
            ...state,
            showModal: true
        });
    }

    const { translate, workSchedule } = props;
    const { user, month, allDaysOfMonth, numberOfTurns } = state;
    // Tao mang cac ca
    let turns = []
    for (let i = 1; i <= numberOfTurns; i++) {
        turns.push(i)
    }
    return (
        < React.Fragment >
            <ButtonModal onButtonCallBack={handleClickCreate} modalID="modal-create-worker-work-schedule" button_name={translate('manufacturing.work_schedule.add_work_schedule_button')} title={translate('manufacturing.work_schedule.add_work_schedule')} />
            <DialogModal
                modalID="modal-create-worker-work-schedule" isLoading={workSchedule.isLoading}
                formID="form-create-worker-work-schedule"
                title={translate('manufacturing.work_schedule.add_work_schedule_mill')}
                msg_success={translate('manufacturing.work_schedule.create_successfully')}
                msg_failure={translate('manufacturing.work_schedule.create_failed')}
                func={save}
                // disableSubmit={!isFormValidated()}
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
                            items={getListUserOfAllWorks()}
                            onChange={handleUserChange}
                            multiple={false}
                        />
                    </div>
                    <div className={`form-group`}>
                        <label>{translate('manufacturing.work_schedule.month')}</label>
                        <DatePicker
                            id={`work-schedule-create-month-worker`}
                            value={month}
                            dateFormat={"month-year"}
                            onChange={handleMonthChange}
                            disabled={false}
                        />
                    </div>
                    <div className="form-group">
                        <label>{translate('manufacturing.work_schedule.number_turns')}<span className="text-red">*</span></label>
                        <input type="number" disabled={true} value={numberOfTurns} className="form-control" ></input>
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

function mapStateToProps(state) {
    const { workSchedule, user, manufacturingWorks } = state;
    return { workSchedule, user, manufacturingWorks }
}

const mapDispatchToProps = {
    createWorkSchedule: workScheduleActions.createWorkSchedule,
    getAllUsersByWorksManageRole: worksActions.getAllUsersByWorksManageRole
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(WorkerScheduleCreateForm));