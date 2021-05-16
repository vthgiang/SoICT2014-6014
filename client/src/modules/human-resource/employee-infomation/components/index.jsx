import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { UserActions } from "../../../super-admin/user/redux/actions";
import { UserServices } from "../../../super-admin/user/redux/services";
import DetailUser from "./detailUser";



function EmployeeInfomation(props) {
    const { user } = props
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
    const [currentUser, setCurrentUser] = useState()
    useEffect(() => {
        let currentRole = localStorage.getItem("currentRole")
        props.getAllUserSameDepartment(currentRole)
    }, [])
    const { userdepartments } = user
    let listUser = []
    if (userdepartments) {
        const {deputyManagers, employees, managers} = userdepartments
        let keyDeputyManagers = Object.keys(deputyManagers)
        let keyEmployees = Object.keys(employees)
        listUser= listUser.concat(deputyManagers[keyDeputyManagers[0]].members)
        listUser= listUser.concat(employees[keyEmployees[0]].members)
    }
    const handchangeUser = (data) =>{
        setCurrentUser(data)
    }

    return (
        <div>
            <p>Trang thông tin nhân viên</p>
            <div className="row" >
               {
                listUser &&
                listUser.map((x, index) =>
                        <p onClick={()=>{handchangeUser(x)}} >{x.name}</p>
                )
               }
            </div>
            {
                currentUser &&
                <DetailUser user={currentUser} id={userdepartments._id}></DetailUser>
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