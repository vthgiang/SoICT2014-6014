import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { MaintainanceLogAddModal, MaintainanceLogEditModal } from './combinedContent';

function MaintainanceLogTab(props) {
    const [state, setState] = useState({
        maintainanceLogs: []
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
        await setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-maintainance-editMaintainance${index}`).modal('show');
    }

    // Function thêm thông tin bảo trì
    const handleAddMaintainance = async (data) => {
        let { maintainanceLogs } = state;
        if(maintainanceLogs === undefined){
            maintainanceLogs = [];
        }
        const values = [...maintainanceLogs, {
            ...data
        }]

        await setState(state => {
            return {
                ...state,
                maintainanceLogs: values
            }
        })
        props.handleAddMaintainance(values, data)
    }

    // Function chỉnh sửa thông tin bảo trì
    const handleEditMaintainance = async (data) => {
        let { maintainanceLogs } = state;
        if(maintainanceLogs === undefined){
            maintainanceLogs = [];
        }        maintainanceLogs[data.index] = data;
        await setState(state => {
            return {
                ...state,
                maintainanceLogs: maintainanceLogs
            }
        });
        props.handleEditMaintainance(maintainanceLogs, data)
    }

    // Function bắt sự kiện xoá thông tin bảo trì
    const handleDeleteMaintainance = async (index) => {
        let { maintainanceLogs } = state;
        if(maintainanceLogs === undefined){
            maintainanceLogs = [];
        }        var data = maintainanceLogs[index];
        maintainanceLogs.splice(index, 1);
        await setState({
            ...state,
            maintainanceLogs: [...maintainanceLogs]
        })
        props.handleDeleteMaintainance([...maintainanceLogs], data)
    }

    if (prevProps.id !== props.id) {
        setState({
            ...state,
            id: props.id,
            maintainanceLogs: props.maintainanceLogs,
        })
        setPrevProps(props)
    }

    const formatType = (type) => {
        const { translate } = props;

        switch (type) {
            case "1":
                return translate('asset.asset_info.repair');
            case "2":
                return translate('asset.asset_info.replace');
            case "3":
                return translate('asset.asset_info.upgrade');
            case "Sửa chữa":
                return translate('asset.asset_info.repair');
            case "Thay thế":
                return translate('asset.asset_info.replace');
            case "Nâng cấp":
                return translate('asset.asset_info.upgrade');
            default:
                return '';
        }
    }

    const formatStatus = (status) => {
        const { translate } = props;

        switch (status) {
            case "1":
                return translate('asset.asset_info.unfulfilled');
            case "2":
                return translate('asset.asset_info.processing');
            case "3":
                return translate('asset.asset_info.made');
            default:
                return '';
        }
    }


    const { id } = props;
    const { translate } = props;
    const { maintainanceLogs, currentRow } = state;

    var formater = new Intl.NumberFormat();

    return (
        <div id={id} className="tab-pane">
            <div className="box-body qlcv">
                {/* Lịch sử bảo trì */}
                {/* <fieldset className="scheduler-border">
                    <legend className="scheduler-border"><h4 className="box-title">{translate('asset.asset_info.maintainance_logs')}</h4></legend> */}

                {/* Form thêm thông tin bảo trì */}
                <MaintainanceLogAddModal handleChange={handleAddMaintainance} id={`addMaintainance${id}`} />

                {/* Bảng phiếu bảo trì */}
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: "8%" }}>{translate('asset.general_information.form_code')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.create_date')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.type')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.content')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.start_date')}</th>
                            <th style={{ width: "12%" }}>{translate('asset.general_information.end_date')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.expense')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.status')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(maintainanceLogs && maintainanceLogs.length !== 0) &&
                            maintainanceLogs.map((x, index) => (
                                <tr key={index}>
                                    <td>{x.maintainanceCode}</td>
                                    <td>{x.createDate ? formatDate(x.createDate) : ''}</td>
                                    <td>{formatType(x.type)}</td>
                                    <td>{x.description}</td>
                                    <td>{x.startDate ? formatDate(x.startDate) : ''}</td>
                                    <td>{x.endDate ? formatDate(x.endDate) : ''}</td>
                                    <td>{x.expense ? formater.format(parseInt(x.expense)) : ''} VNĐ</td>
                                    <td>{formatStatus(x.status)}</td>
                                    <td>
                                        <a onClick={() => handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('asset.asset_info.edit_maintenance_card')}><i
                                            className="material-icons">edit</i></a>
                                        <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => handleDeleteMaintainance(index)}><i className="material-icons"></i></a>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {
                    (!maintainanceLogs || maintainanceLogs.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                {/* </fieldset> */}
            </div>

            {/* Form chỉnh sửa phiếu bảo trì */}
            {
                currentRow &&
                <MaintainanceLogEditModal
                    id={`editMaintainance${currentRow.index}`}
                    _id={currentRow._id}
                    index={currentRow.index}
                    maintainanceCode={currentRow.maintainanceCode}
                    createDate={currentRow.createDate}
                    type={currentRow.type}
                    description={currentRow.description}
                    startDate={currentRow.startDate}
                    endDate={currentRow.endDate}
                    expense={currentRow.expense}
                    status={currentRow.status}
                    handleChange={handleEditMaintainance}
                />
            }
        </div>
    );
};


const maintainanceLogTab = connect(null, null)(withTranslate(MaintainanceLogTab));

export { maintainanceLogTab as MaintainanceLogTab };
