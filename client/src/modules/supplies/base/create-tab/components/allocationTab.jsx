import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { getPropertyOfValue } from '../../../../../helpers/stringMethod';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { AllocationAddModal } from './allocationAddModal';
import { AllocationEditModal } from './allocationEditModal';

import { PurchaseAddModal, PurchaseEditModal } from './combinedContent';

function AllocationTab(props) {
    const [state, setState] = useState({
        allocationHistory: []
    });
    const [prevProps, setPrevProps] = useState({
        id: null
    })

    // Function format dữ liệu Date thành string
    const formatDate = (date, monthYear = false) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
    }

    // Bắt sự kiện click edit phiếu
    const handleEdit = async (value, index) => {
        await setState({
            ...state,
            currentRow: { ...value, index: index }
        });
        window.$(`#modal-edit-allocation-editAllocation${index}`).modal('show');
    }

    // Function thêm thông tin bảo trì
    const handleAddAllocation = async (data) => {
        let { allocationHistory } = state;
        if (allocationHistory === undefined) {
            allocationHistory = [];
        }
        const values = [...allocationHistory, {
            ...data
        }]

        await setState({
            ...state,
            allocationHistory: values
        })
        props.handleAddAllocation(values, data)
    }

    // Function chỉnh sửa thông tin bảo trì
    const handleEditAllocation = async (data) => {
        let { allocationHistory } = state;
        if (allocationHistory === undefined) {
            allocationHistory = [];
        }
        allocationHistory[data.index] = data;
        await setState({
            ...state,
            allocationHistory: allocationHistory
        });
        props.handleEditAllocation(allocationHistory, data)
    }

    // Function bắt sự kiện xoá thông tin bảo trì
    const handleDeleteAllocation = async (index) => {
        let { allocationHistory } = state;
        if (allocationHistory === undefined) {
            allocationHistory = [];
        } var data = allocationHistory[index];
        allocationHistory.splice(index, 1);
        await setState({
            ...state,
            allocationHistory: [...allocationHistory]
        })
        props.handleDeleteAllocation([...allocationHistory], data)
    }

    if (prevProps.id !== props.id) {
        setState({
            ...state,
            id: props.id,
            allocationHistory: props.allocationHistory,
        })
        setPrevProps(props)
    }

    const { id } = props;
    const { translate, user, department } = props;
    const { allocationHistory, currentRow } = state;

    const getDepartment = () => {
        let { department } = props;
        let listUnit = department && department.list
        let unitArr = [];

        listUnit.map(item => {
            unitArr.push({
                value: item._id,
                text: item.name
            })
        })

        return unitArr;
    }

    var userList = user.list, departmentList = department.list;

    return (
        <div id={id} className="tab-pane">
            <div className="box-body qlcv">

                {/* Form thêm thông tin bảo trì */}
                <AllocationAddModal
                    handleChange={handleAddAllocation}
                    id={`addAllocation${id}`}
                />

                {/* Bảng hoa don */}
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: "15%" }}>{translate('supplies.allocation_management.date')}</th>
                            <th style={{ width: "20%" }}>{translate('supplies.allocation_management.quantity')}</th>
                            <th style={{ width: "25%" }}>{translate('supplies.allocation_management.allocationToOrganizationalUnit')}</th>
                            <th style={{ width: "20%" }}>{translate('supplies.allocation_management.allocationToUser')}</th>
                            <th style={{ width: '20%', textAlign: 'center' }}>{translate('table.action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(allocationHistory && allocationHistory.length !== 0) &&
                            allocationHistory.map((x, index) => (
                                <tr key={index}>
                                    <td>{x.date ? formatDate(x.date) : ''}</td>
                                    <td>{x.quantity}</td>
                                    <td>{getPropertyOfValue(x.allocationToOrganizationalUnit, 'name', false, departmentList)}</td>
                                    <td>{getPropertyOfValue(x.allocationToUser, 'email', false, userList)}</td>
                                    <td>
                                        <a onClick={() => handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('supplies.general_information.add_purchase_invoice')}><i
                                            className="material-icons">edit</i></a>
                                        <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => handleDeleteAllocation(index)}><i className="material-icons"></i></a>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {
                    (!allocationHistory || allocationHistory.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                {/* </fieldset> */}
            </div>

            {/* Form chỉnh sửa phiếu bảo trì */}
            {
                currentRow &&
                <AllocationEditModal
                    id={`editAllocation${currentRow.index}`}
                    _id={currentRow._id}
                    index={currentRow.index}
                    date={currentRow.date}
                    allocationToOrganizationalUnit={currentRow.allocationToOrganizationalUnit}
                    quantity={currentRow.quantity}
                    allocationToUser={currentRow.allocationToUser}
                    handleChange={handleEditAllocation}
                />
            }
        </div>
    );
};

function mapState(state) {
    const { auth, user, department } = state;
    return { auth, user, department };
};

const actionCreators = {
    getUser: UserActions.get,
    getAllDepartments: DepartmentActions.get,
};

const allocationTab = connect(mapState, actionCreators)(withTranslate(AllocationTab));
export { allocationTab as AllocationTab };
