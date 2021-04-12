import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { UsageLogAddModal, UsageLogEditModal } from './combinedContent';
import { UseRequestActions } from '../../../admin/use-request/redux/actions'
import { CalendarUsage } from './calendarUsage';
function UsageLogTab(props) {
    const [state, setState] =useState({
        assignedToUser: props.assignedToUser,
        assignedToOrganizationalUnit: props.assignedToOrganizationalUnit,
    })
    const [prevProps, setPrevProps] = useState({
        id: null,
        typeRegisterForUse: null,
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

    // Function lưu giá trị mã phiếu vào state khi thay đổi
    const handleDistributeNumberChange = (event) => {
        const { name, value } = event.target;
        setState(state =>{
            return{
                ...state,
                [name]: value
            }
        });

    }

    // Function lưu giá trị mã tài sản vào state khi thay đổi
    const handleCodeChange = (event) => {
        const { name, value } = event.target;
        setState(state =>{
            return{
                ...state,
                [name]: value
            }
        });

    }

    // Function lưu giá trị tháng vào state khi thay đổi
    const handleMonthChange = (value) => {
        setState(state =>{
            return{
                ...state,
                month: value
            }
        });
    }

    // Function lưu giá trị loại phiếu vào state khi thay đổi
    const handleTypeChange = (value) => {
        if (value.length === 0) {
            value = null
        }
        ;
        setState(state =>{
            return{
                ...state,
                type: value
            }
        })
    }

    // Function bắt sự kiện tìm kiếm
    const handleSunmitSearch = async () => {
        if (state.month === "") {
            await setState(state =>{
                return{
                    ...state,
                    month: formatDate(Date.now())
                }
            })
        }

    }

    // Bắt sự kiện click edit phiếu
    const handleEdit = async (value, index) => {
        await setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-usage-editUsage${index}`).modal('show');
    }

    // Function thêm thông tin phiếu
    const handleAddUsage = async (data) => {
        const { usageLogs } = state
        let assignedToUser, assignedToOrganizationalUnit;
        if (data && data.calendar) {
            usageLogs.push(data.newUsage);
            assignedToUser = data.newUsage.usedByUser;
            assignedToOrganizationalUnit = data.newUsage.usedByOrganizationalUnit;
        } else {
            usageLogs.push(data);
            assignedToUser = data.usedByUser;
            assignedToOrganizationalUnit = data.usedByOrganizationalUnit;
        }
        let usageLogsData = usageLogs
        await setState(state =>{
            return {
                ...state,
                usageLogs: usageLogsData,
                assignedToUser: assignedToUser,
                assignedToOrganizationalUnit: assignedToOrganizationalUnit,
                status: "in_use",
            }
        })

        let createUsage = {
            usageLogs: usageLogs,
            status: "in_use",
            assignedToUser: assignedToUser,
            assignedToOrganizationalUnit: assignedToOrganizationalUnit,
        }
        if (props.assetId && !data.calendar) {
            await props.createUsage(props.assetId, createUsage)
        }

        if (props.id == `edit_usage${props.assetId}`) {
            await props.handleAddUsage({
                usageLogs: usageLogsData,
                assignedToUser: assignedToUser,
                assignedToOrganizationalUnit: assignedToOrganizationalUnit
            });
        } else {
            await props.handleAddUsage(usageLogsData, { status: "in_use" });
        }
    }


    // Function chỉnh sửa thông tin phiếu
    const handleEditUsage = async (data) => {
        const { usageLogs } = state;
        let assignedToUser, assignedToOrganizationalUnit, updateUsage;
        usageLogs[data.index] = data;
        if (data.index == (usageLogs.length - 1) && (state.assignedToUser || state.assignedToOrganizationalUnit)) {
            assignedToUser = data.usedByUser ? data.usedByUser : null;
            assignedToOrganizationalUnit = data.assignedToOrganizationalUnit ? data.assignedToOrganizationalUnit : null;
        } else {
            assignedToUser = state.assignedToUser;
            assignedToOrganizationalUnit = state.assignedToOrganizationalUnit
        }

        await setState(state =>{
            return{
                ...state,
                usageLogs: usageLogs,
                assignedToUser: assignedToUser,
                assignedToOrganizationalUnit: assignedToOrganizationalUnit,
            }
        })

        updateUsage = {
            _id: data._id,
            usedByUser: data.usedByUser,
            usedByOrganizationalUnit: data.usedByOrganizationalUnit,
            description: data.description,
            endDate: data.endDate,
            startDate: data.startDate,
            assignedToUser: assignedToUser,
            assignedToOrganizationalUnit: assignedToOrganizationalUnit,
        }
        if (props.assetId) {
            await props.updateUsage(props.assetId, updateUsage)
            await props.handleEditUsage({
                usageLogs: usageLogs,
                assignedToUser: assignedToUser,
                assignedToOrganizationalUnit: assignedToOrganizationalUnit,
            });
        } else {
            await props.handleEditUsage(usageLogs)
        }
    }

    // Function bắt sự kiện xoá thông tin phiếu
    const handleDeleteUsage = async (index) => {
        var { usageLogs } = state;
        var data = usageLogs[index];
        usageLogs.splice(index, 1);
        await setState(state =>{
            return{
                ...state,
                usageLogs: [...usageLogs]
            }
        })
        if (props.assetId) {
            await props.deleteUsage(props.assetId, data._id)
        }
    }

    const handleRecallAsset = async () => {
        let assetId = props.assetId;
        let assignedToUser = props.assignedToUser;

        await setState({
            ...state,
            assignedToUser: null,
            assignedToOrganizationalUnit: null,
            status: "ready_to_use",
        })
        let data = {
            usageId: assignedToUser,
        }

        if (props.assetId) {
            await props.recallAsset(assetId, data);
        }
        await props.handleRecallAsset({
            assignedToUser: null,
            assignedToOrganizationalUnit: null,
            status: "ready_to_use",
        })
    }
    
    if(prevProps.id !== props.id || prevProps.typeRegisterForUse !== props.typeRegisterForUse){
        setState(state => {
            return{ 
                ...state,
                id: props.id,
                usageLogs: props.usageLogs,
                assignedToUser: props.assignedToUser,
                assignedToOrganizationalUnit: props.assignedToOrganizationalUnit,
                typeRegisterForUse: props.typeRegisterForUse,
                managedBy: props.managedBy
            }
        })
        setPrevProps(props)
    }
    


   
    const { id, assetId } = props;
    const { translate, user, department } = props;
    const { assignedToOrganizationalUnit, assignedToUser, usageLogs, currentRow, typeRegisterForUse, managedBy } = state;
    var userlist = user.list, departmentlist = department.list;
    return (
        <div id={id} className="tab-pane">
            <div className="box-body qlcv">
                {/* Lịch sử sử dụng */}

                {/* <fieldset className="scheduler-border">
                    <legend className="scheduler-border"><h4 className="box-title">{translate('asset.asset_info.usage_logs')}</h4></legend> */}

                {/* Form thêm thông tin sử dụng */}
                {
                    props.typeRegisterForUse != 2 &&
                    <UsageLogAddModal handleChange={handleAddUsage} typeRegisterForUse={typeRegisterForUse} id={`addUsage${id}`} />

                }

                <div className="form-inline">
                    {
                        !props.assetId && props.typeRegisterForUse == 2 &&
                        <div><span style={{ color: "red" }}>Cần thêm tài sản trước khi thêm sử dụng theo giờ</span></div>
                    }
                    <div className="form-group">
                        <label style={{ width: "auto" }} className="form-control-static"> Đối tượng đang sử dụng:</label>
                        <div style={{ width: "auto" }} className="form-control-static">
                            {assignedToUser ?
                                userlist.filter(item => item._id === assignedToUser).pop() ? userlist.filter(item => item._id === assignedToUser).pop().name : "Chưa có đối tượng sử dụng" : ''}
                            {assignedToUser && assignedToOrganizationalUnit && ' , '}
                            {assignedToOrganizationalUnit ?
                                departmentlist.filter(item => item._id === assignedToOrganizationalUnit).pop() ? departmentlist.filter(item => item._id === assignedToOrganizationalUnit).pop().name : "Chưa có đối tượng sử dụng" : ''}
                            {!assignedToUser && !assignedToOrganizationalUnit && 'Chưa có'}
                        </div>
                    </div>

                    {(assignedToUser || assignedToOrganizationalUnit) &&
                        <div className="form-group" style={{ marginLeft: "20px" }}>
                            <button type="button" className="btn btn-success" onClick={handleRecallAsset} >Thu hồi</button>
                        </div>
                    }
                </div>

                {/* Bảng thông tin sử dụng */}
                {
                    (typeRegisterForUse == 1 || typeRegisterForUse == 3) &&
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.user')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.organization_unit')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.handover_from_date')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.handover_to_date')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.content')}</th>
                                <th style={{ width: '100px', textAlign: 'center' }}>{translate('table.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(usageLogs && usageLogs.length !== 0) &&
                                usageLogs.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.usedByUser ? (userlist.length && userlist.filter(item => item._id === x.usedByUser).pop() ? userlist.filter(item => item._id === x.usedByUser).pop().name : ' ') : ''}</td>
                                        <td>{x.usedByOrganizationalUnit ? (departmentlist.length && departmentlist.filter(item => item._id === x.usedByOrganizationalUnit).pop() ? departmentlist.filter(item => item._id === x.usedByOrganizationalUnit).pop().name : '') : ''}</td>
                                        <td>{x.startDate ? formatDate(x.startDate) : ''}</td>
                                        <td>{x.endDate ? formatDate(x.endDate) : ''}</td>
                                        <td>{x.description}</td>
                                        <td>
                                            <a onClick={() => handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa thông tin sử dụng"><i
                                                className="material-icons">edit</i></a>
                                            {((assignedToUser && index != (usageLogs.length - 1)) || !assignedToUser) &&
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => handleDeleteUsage(index)}><i className="material-icons"></i></a>
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                }
                {
                    typeRegisterForUse == 2 && props.assetId &&

                    <CalendarUsage
                        id={`edit-calendar-create-tab-${assetId}`}
                        assetId={assetId}
                        usageLogs={usageLogs}
                        assignedToUser={assignedToUser}
                        assignedToOrganizationalUnit={assignedToOrganizationalUnit}
                        typeRegisterForUse={typeRegisterForUse}
                        managedBy={managedBy}
                        handleChange={handleAddUsage}
                        linkPage={props.linkPage}
                    />
                }
                {typeRegisterForUse !== 2 &&
                    (!usageLogs || usageLogs.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                {/* </fieldset> */}

            </div>
            {
                currentRow &&
                <UsageLogEditModal
                    id={`editUsage${currentRow.index}`}
                    _id={currentRow._id}
                    index={currentRow.index}
                    usedByUser={currentRow.usedByUser}
                    usedByOrganizationalUnit={currentRow.usedByOrganizationalUnit}
                    startDate={currentRow.startDate}
                    endDate={currentRow.endDate}
                    description={currentRow.description}
                    handleChange={handleEditUsage}
                />
            }
        </div>
    );
};

function mapState(state) {
    const { user, department } = state;
    return { user, department };
};

const actionCreators = {
    recallAsset: UseRequestActions.recallAsset,
    createUsage: UseRequestActions.createUsage,
    deleteUsage: UseRequestActions.deleteUsage,
    updateUsage: UseRequestActions.updateUsage,
};

const usageLogTab = connect(mapState, actionCreators)(withTranslate(UsageLogTab));

export { usageLogTab as UsageLogTab };
