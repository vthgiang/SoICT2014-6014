import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { UserActions } from "../../../super-admin/user/redux/actions";
import { UserServices } from "../../../super-admin/user/redux/services";
import DetailUser from "./detailUser";
import { SelectBox } from "../../../../common-components"


function EmployeeInfomation(props) {
    const { user } = props
    const [currentUser, setCurrentUser] = useState()
    const [idUser, setIdUser ] = useState("")
    const [listUsers,setListUsers] = useState([])
    useEffect(() => {
        let currentRole = localStorage.getItem("currentRole")
        props.getAllUserSameDepartment(currentRole)
    }, [])
    const { userdepartments } = user
    const { translate } = props
    let listUser = [] , list = []
    if (userdepartments) {
        const {deputyManagers , employees, managers } = userdepartments
        let keyDeputyManagers = Object.keys(deputyManagers)
        let keyEmployees = Object.keys(employees)
        if (employees[keyEmployees[0]]){
            listUser = listUser.concat(employees[keyEmployees[0]].members)
            list = employees[keyEmployees[0]].members.map(category => { return { value: category._id, text: category.name } });
        }
        if (deputyManagers[keyDeputyManagers[0]]){
            listUser = listUser.concat(deputyManagers[keyDeputyManagers[0]].members)
            list = list.concat(deputyManagers[keyDeputyManagers[0]].members.map(category => { return { value: category._id, text: category.name } }));
        }
        if (JSON.stringify(listUser)!==JSON.stringify(listUsers)){
            setListUsers(listUser)
        }
        if (!currentUser && listUsers){
            setCurrentUser(listUsers[0])
        }
    }
    const handchangeUser = (data) => {
        let dataUser = listUsers.find(value=>value._id===data[0])
        setCurrentUser(dataUser)
        setIdUser(data[0])
    }

    return (
        <div>
            <p>Trang thông tin nhân viên</p>
            <div class="form-group" >
            <label class="form-control-static" >Nhân viên</label>
               {
                listUser &&
                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                id={`select-box-edit-name`}
                className="form-control select2"
                style={{ width: "auto" }}
                items={list }
                value={currentUser?currentUser._id:null}
                onChange={handchangeUser}
                multiple={false}
                options={{ placeholder: "chọn nhân viên" }}
            />
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