import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { LOCAL_SERVER_API } from '../../../../env';

class GeneralTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
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

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                avatar: nextProps.avatar,
                code: nextProps.code,
                assetName: nextProps.assetName,
                serial: nextProps.serial,
                assetTypes: nextProps.assetTypes,
                purchaseDate: nextProps.purchaseDate,
                warrantyExpirationDate: nextProps.warrantyExpirationDate,
                managedBy: nextProps.managedBy,
                assignedTo: nextProps.assignedTo,
                handoverFromDate: nextProps.handoverFromDate,
                handoverToDate: nextProps.handoverToDate,
                location: nextProps.location,
                description: nextProps.description,
                status: nextProps.status,
                canRegisterForUse: nextProps.canRegisterForUse,
                detailInfo: nextProps.detailInfo,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id, translate, user, assetType } = this.props;
        var userlist = user.list;
        var assettypelist = assetType.listAssetTypes;
        const {
            img, avatar, code, assetName, serial, assetTypes, purchaseDate, warrantyExpirationDate,
            managedBy, assignedTo, handoverFromDate, handoverToDate, location, description, status, canRegisterForUse, detailInfo
        } = this.state;

        return (
            <div id={id} className="tab-pane active">
                <div className="box-body">
                    <div className="col-md-12">
                        {/* Anh tài sản */}
                        <div className="col-md-4" style={{ textAlign: 'center' }}>
                            <div>
                                <a href={LOCAL_SERVER_API + avatar} target="_blank">
                                    <img className="attachment-img avarta" src={LOCAL_SERVER_API + avatar} alt="Attachment" />
                                </a>
                            </div>
                        </div>

                        {/* Thông tin cơ bản */}
                        <label>Thông tin cơ bản:</label>
                        <br />
                        <div className="col-md-8">
                            <div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <strong>Mã tài sản:&emsp; </strong>
                                        {code}
                                    </div>
                                    <div className="form-group">
                                        <strong>Tên tài sản:&emsp; </strong>
                                        {assetName}
                                    </div>
                                    <div className="form-group">
                                        <strong>Số serial:&emsp; </strong>
                                        {serial}
                                    </div>
                                    <div className="form-group">
                                        <strong>Loại tài sản:&emsp; </strong>
                                        {assetTypes && assettypelist.length && assettypelist.filter(item => item._id === assetTypes).pop() ? assettypelist.filter(item => item._id === assetTypes).pop().typeName : 'Asset type is deleted'}
                                    </div>
                                    <div className="form-group">
                                        <strong>Ngày nhập:&emsp; </strong>
                                        {this.formatDate(purchaseDate)}
                                    </div>
                                    <div className="form-group">
                                        <strong>Ngày bảo hành:&emsp; </strong>
                                        {this.formatDate(warrantyExpirationDate)}
                                    </div>
                                    <div className="form-group">
                                        <strong>Người quản lý:&emsp; </strong>
                                        {managedBy && userlist.length && userlist.filter(item => item._id === managedBy).pop() ? userlist.filter(item => item._id === managedBy).pop().name : 'User is deleted'}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <strong>Người sử dụng:&emsp; </strong>
                                        {assignedTo ? (userlist.length && userlist.filter(item => item._id === assignedTo).pop() ? userlist.filter(item => item._id === assignedTo).pop().name : 'User is deleted') : ''}
                                    </div>
                                    <div className="form-group">
                                        <strong>Thời gian sử dụng từ ngày:&emsp; </strong>
                                        {handoverFromDate ? this.formatDate(handoverFromDate) : ''}
                                    </div>
                                    <div className="form-group">
                                        <strong>Thời gian sử dụng đến ngày:&emsp; </strong>
                                        {handoverToDate ? this.formatDate(handoverToDate) : ''}
                                    </div>
                                    <div className="form-group">
                                        <strong>Vị trí tài sản:&emsp; </strong>
                                        {location}
                                    </div>
                                    <div className="form-group">
                                        <strong>Mô tả:&emsp; </strong>
                                        {description}
                                    </div>
                                    <div className="form-group">
                                        <strong>Trạng thái:&emsp; </strong>
                                        {status}
                                    </div>
                                    <div className="form-group">
                                        <strong>Quyền đăng ký sử dụng:&emsp; </strong>
                                        {canRegisterForUse}
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin chi tiết */}
                            <div className="col-md-12">
                                <label>Thông tin chi tiết:<a title="Thông tin chi tiết"></a></label>
                                <div className="form-group">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Tên trường dữ liệu</th>
                                                <th>Giá trị</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(!detailInfo || detailInfo.length === 0) ? <tr>
                                                <td colSpan={3}>
                                                    <center> {translate('table.no_data')}</center>
                                                </td>
                                            </tr> :
                                                detailInfo.map((x, index) => {
                                                    return <tr key={index}>
                                                        <td>{x.nameField}</td>
                                                        <td>{x.value}</td>
                                                    </tr>
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

function mapState(state) {
    const { user, assetType } = state;
    return { user, assetType };
};

const tabGeneral = connect(mapState, null)(withTranslate(GeneralTab));
export { tabGeneral as GeneralTab };
