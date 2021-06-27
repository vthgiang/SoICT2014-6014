import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';

function TransportDepartmentDetails(props) {

    let { allDepartments, currentDepartment } = props;
    
    // Chứa 2 giá trị 2 trường nhập vào và lỗi

    const [organizationalUnit, setOrganizationUnit] = useState();

    const [formRoleUnit1, setFormRoleUnit1] = useState([])

    const [formRoleUnit2, setFormRoleUnit2] = useState([])

    const [formRoleUnit3, setFormRoleUnit3] = useState([])
    
    useEffect(() => {
        let listRoleUnit1 = [];
        let listRoleUnit2 = [];
        let listRoleUnit3 = [];
        if (currentDepartment){
            setOrganizationUnit(currentDepartment.organizationalUnit);

            if (currentDepartment.type && currentDepartment.type.length !==0){
                currentDepartment.type.map(role => {
                        
                    if (role.roleOrganizationalUnit && role.roleOrganizationalUnit.length !==0){
                        role.roleOrganizationalUnit.map(roleOrganizationalUnit => {
                            if (roleOrganizationalUnit.users && roleOrganizationalUnit.users.length!==0) {
                                roleOrganizationalUnit.users.map(user => {
                                    if (Number(role.roleTransport) === 1){
                                        listRoleUnit1.push({
                                            name: user.userId?.name,
                                            roleName: roleOrganizationalUnit.name,
                                        })
                                    }
                                    if (Number(role.roleTransport) === 2){
                                        listRoleUnit2.push({
                                            name: user.userId?.name,
                                            roleName: roleOrganizationalUnit.name,
                                        })
                                    }
                                    if (Number(role.roleTransport) === 3){
                                        listRoleUnit3.push({
                                            name: user.userId?.name,
                                            roleName: roleOrganizationalUnit.name,
                                        })
                                    }

                                })
                            }
                        })
                    }

                })
            }

        }
        console.log(listRoleUnit1, " koaskdoasdkoas");
        setFormRoleUnit1(listRoleUnit1);
        setFormRoleUnit2(listRoleUnit2);
        setFormRoleUnit3(listRoleUnit3);
    }, [currentDepartment])

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-department-details" 
                isLoading={false}
                formID="form-create-transport-requirements"
                title={"Chi tiết đơn vị vận chuyển"}
                msg_success={"success"}
                msg_faile={"fail"}
                // disableSubmit={!isFormValidated()}
                hasNote={false}
                size={50}
                maxWidth={500}
                hasSaveButton={false}
            >
                <form id="form-create-business-department">
                    
                    <div className={`form-group`}>
                        <label>
                            {"Đơn vị: "}
                        </label>
                        <p>
                            {organizationalUnit?.name}
                        </p>
                    </div>

                    <div className={`form-group`}>
                        
                        <div className="box box-solid">
                            <label>
                                {"Vai trò phê duyệt yêu cầu, tạo kế hoạch vận chuyển"}
                            </label>
                            {
                                formRoleUnit1 && formRoleUnit1.length!==0
                                && 
                                <table id={`select-role-for-transport-department-1`} className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên</th>
                                            <th>Chức danh</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        formRoleUnit1.map((item, index) => (
                                            item &&
                                            <tr key={index}>
                                                <td>{index+1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.roleName}</td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </table>                            
                            }
                        </div>

                        <div className="box box-solid">
                            <label>
                                {"Vai trò giám sát thực hiện kế hoạch vận chuyển"}
                            </label>
                            {
                                formRoleUnit2 && formRoleUnit2.length!==0
                                && 
                                <table id={`select-role-for-transport-department-2`} className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên</th>
                                            <th>Chức danh</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        formRoleUnit2.map((item, index) => (
                                            item &&
                                            <tr key={index}>
                                                <td>{index+1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.roleName}</td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </table>                            
                            }
                            {/* <ErrorLabel content={roleError} /> */}
                        </div>

                        <div className="box box-solid">
                            <label>
                                {"Vai trò nhân viên tham gia vận chuyển"}
                            </label>
                            {
                                formRoleUnit3 && formRoleUnit3.length!==0
                                && 
                                <table id={`select-role-for-transport-department-1`} className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên</th>
                                            <th>Chức danh</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        formRoleUnit3.map((item, index) => (
                                            item &&
                                            <tr key={index}>
                                                <td>{index+1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.roleName}</td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </table>                            
                            }
                        </div>
                    </div>
                    
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    return {  }
}

const actions = {
}

const connectedTransportDepartmentDetails = connect(mapState, actions)(withTranslate(TransportDepartmentDetails));
export { connectedTransportDepartmentDetails as TransportDepartmentDetails };