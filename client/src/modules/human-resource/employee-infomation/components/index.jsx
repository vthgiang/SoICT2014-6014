import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { UserActions } from "../../../super-admin/user/redux/actions";
import { UserServices } from "../../../super-admin/user/redux/services";
import DetailUser from "./detailUser";
import { SelectBox } from "../../../../common-components"
import { SelectMulti, DatePicker } from '../../../../common-components';

function EmployeeInfomation(props) {
    const { user } = props
    const [currentUser, setCurrentUser] = useState()
    const [idUser, setIdUser] = useState("")
    const [listUsers, setListUsers] = useState([])
    const formatDate = (date, monthYear = false) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }
        return date;
    };
    let date = new Date()
    let _startDate = formatDate(date.setMonth(new Date().getMonth() - 6), true);
    const [state, setState] = useState({
        startDate: _startDate,
        endDate: formatDate(Date.now(), true)
    })
    const [search, setSearch] = useState(0)
    const handleSunmitSearch = () => {
        setSearch(search + 1)
    }
    const handleStartMonthChange = (value) => {
        setState({
            ...state,
            startDate: value
        })
    }

    const handleEndMonthChange = (value) => {
        setState({
            ...state,
            endDate: value,
        })
    }
    useEffect(() => {
        let currentRole = localStorage.getItem("currentRole")
        props.getAllUserSameDepartment(currentRole)
    }, [])
    const { userdepartments } = user
    const { translate } = props
    let listUser = [], list = []
    if (userdepartments) {
        const { deputyManagers, employees, managers } = userdepartments
        let keyDeputyManagers = Object.keys(deputyManagers)
        let keyEmployees = Object.keys(employees)
        if (employees[keyEmployees[0]]) {
            listUser = listUser.concat(employees[keyEmployees[0]].members)
            list = employees[keyEmployees[0]].members.map(category => { return { value: category._id, text: category.name } });
        }
        if (deputyManagers[keyDeputyManagers[0]]) {
            listUser = listUser.concat(deputyManagers[keyDeputyManagers[0]].members)
            list = list.concat(deputyManagers[keyDeputyManagers[0]].members.map(category => { return { value: category._id, text: category.name } }));
        }
        if (JSON.stringify(listUser) !== JSON.stringify(listUsers)) {
            setListUsers(listUser)
        }
        if (!currentUser && listUsers) {
            setCurrentUser(listUsers[0])
        }
    }
    const handchangeUser = (data) => {
        let dataUser = listUsers.find(value => value._id === data[0])
        setCurrentUser(dataUser)
        setIdUser(data[0])
    }

    return (
        <div>
            <div className="qlcv" style={{ textAlign: "left" }}>
                <div className="form-inline" >

                    <div class="form-group" >
                        <label class="form-control-static" >Nhân viên</label>
                        {
                            listUser &&
                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                id={`select-box-edit-name`}
                                className="form-control select2"
                                style={{ width: "auto" }}
                                items={list}
                                value={currentUser ? currentUser._id : null}
                                onChange={handchangeUser}
                                multiple={false}
                                options={{ placeholder: "chọn nhân viên" }}
                            />
                        }

                    </div>
                    <div className="form-group">
                        <label style={{ width: "auto" }}>Từ ngày</label>
                        <DatePicker
                            id="form-month-annual-leave"
                            dateFormat="month-year"
                            deleteValue={false}
                            value={state.startDate}
                            onChange={handleStartMonthChange}
                        />
                    </div>
                    <div className='form-group'>
                        <label style={{ width: "auto" }}>Đến ngày</label>
                        <DatePicker
                            id="to-month-annual-leave"
                            dateFormat="month-year"
                            deleteValue={false}
                            value={state.endDate}
                            onChange={handleEndMonthChange}
                        />
                    </div>
                    <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => handleSunmitSearch()} >{translate('general.search')}</button>

                </div>
            </div>

            {
                currentUser &&
                <DetailUser user={currentUser} id={userdepartments._id} state={state} search={search} ></DetailUser>
            }

        </div>
    )
}
function mapState(state) {
    const { auth, role, user } = state;

    return { auth, role, user }
}

const mapDispatchToProps = {
    getChildrenOfOrganizationalUnitsAsTree: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
}



export default connect(mapState, mapDispatchToProps)(withTranslate(EmployeeInfomation));