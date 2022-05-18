import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ConfirmNotification, DataTableSetting, DatePicker, SelectBox } from '../../../../../common-components';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import getEmployeeSelectBoxItems from '../../../../task/organizationalUnitHelper';
import { EmployeeManagerActions } from '../../../../human-resource/profile/employee-management/redux/actions';
import getAllEmployeeSelectBoxItems from './employeeHelper';

function KeyPeople(props) {
    const [state, setState] = useState({
    });
    
    const { translate, listMajor, employeesManager, listCareer, listCertificate, keyPersonnelRequires } = props;
    const { id, biddingPackage, keyPeople } = state;

    useEffect(() => {
        props.getAllEmployee();

        if (props.biddingPackage) {
            setState(state => {
                return {
                    ...state,
                    id: props.id,
                    keyPeople: props.biddingPackage.keyPeople && props.biddingPackage.keyPeople.length ? props.biddingPackage.keyPeople : props.biddingPackage.keyPersonnelRequires ? props.biddingPackage.keyPersonnelRequires.map(item => {
                        return {
                            careerPosition: item.careerPosition,
                            employees: []
                        }
                    }) : [],
                    keyPersonnelRequires: props.biddingPackage.keyPersonnelRequires ? props.biddingPackage.keyPersonnelRequires : []
                }
            })
        }
    }, [props.id])

    useEffect(() => {
        
        if (props.biddingPackage) {
            setState(state => {
                return {
                    ...state,
                    id: props.id,
                    keyPeople: props.biddingPackage.keyPeople && props.biddingPackage.keyPeople.length ? props.biddingPackage.keyPeople : props.biddingPackage.keyPersonnelRequires ? props.biddingPackage.keyPersonnelRequires.map(item => {
                        return {
                            careerPosition: item.careerPosition,
                            employees: []
                        }
                    }) : [],
                    keyPersonnelRequires: props.biddingPackage ? props.biddingPackage.keyPersonnelRequires : []
                }
            })
        }
    }, [props.id, props.biddingPackage.keyPersonnelRequires, props.keyPersonnelRequires])

    const handleKeyEmployee = (value, listIndex) => {
        if (value) {
            let newList = state.keyPeople.map((item, index) => {
                if (index === listIndex) {
                    return {
                        ...item,
                        employees: value
                    }
                }
                return item;
            })

            setState( state => {
                return {
                    ...state,
                    keyPeople: newList
                }
            });

            props.handleChange("keyPeople", newList);
        }
    }


    let professionalSkillArr = [
        { value: null, text: "Chọn trình độ" },
        { value: 1, text: "Trình độ phổ thông" },
        { value: 2, text: "Trung cấp" },
        { value: 3, text: "Cao đẳng" },
        { value: 4, text: "Đại học / Cử nhân" },
        { value: 5, text: "Kỹ sư" },
        { value: 6, text: "Thạc sĩ" },
        { value: 7, text: "Tiến sĩ" },
        { value: 8, text: "Giáo sư" },
        { value: 0, text: "Không có" },
    ];

    let allEmployee;
    if (employeesManager && employeesManager.listAllEmployees) {
        allEmployee = employeesManager.listAllEmployees
    }

    let allEmployeeCompany = getAllEmployeeSelectBoxItems(allEmployee)

    return (
        <div id = {id} className="tab-pane">
            {
                state.keyPeople && state.keyPersonnelRequires && state.keyPersonnelRequires.map((y, index) => 
                    {
                        let keyEmployee = state.keyPeople[index]?.employees
                        return (
                            <div key={`${id}-${index}`} className={`form-group`}>
                                <label className="control-label">Vị trí công việc: { `${listCareer?.find(x => x._id == y.careerPosition)?.name}` }</label>
                                {allEmployeeCompany && <SelectBox
                                    id={`key-employee-${id}-${index}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={allEmployeeCompany ? allEmployeeCompany : []}
                                    onChange={(value) => handleKeyEmployee(value, index)}
                                    options={{ placeholder: translate('task.task_management.add_resp') }}
                                    value={keyEmployee}
                                    multiple={true}
                                />}
                            </div>
                        );
                    }
                ) 
            }
        </div>
    );
};


function mapState(state) {
    const { employeesManager } = state;
    return { employeesManager };
}

const actionCreators = {
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
};

const keyPeople = connect(mapState, actionCreators)(withTranslate(KeyPeople));
export { keyPeople as KeyPeople };