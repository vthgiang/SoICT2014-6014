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

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        if (monthYear === true) {
            return [month, year].join('-');
        } else return [day, month, year].join('-');
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                avatar: nextProps.asset.avatar,
                code: nextProps.asset.code,
                assetName: nextProps.asset.assetName,
                serial: nextProps.asset.serial,
                assetType: nextProps.asset.assetType,
                purchaseDate: nextProps.asset.purchaseDate,
                warrantyExpirationDate: nextProps.asset.warrantyExpirationDate,
                managedBy: nextProps.asset.managedBy,
                assignedTo: nextProps.asset.assignedTo,
                handoverFromDate: nextProps.asset.handoverFromDate,
                handoverToDate: nextProps.asset.handoverToDate,
                location: nextProps.asset.location,
                description: nextProps.asset.description,
                status: nextProps.asset.status,
                detailInfo: nextProps.asset.detailInfo,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id, translate } = this.props;

        const {
                img, avatar, code, assetName, serial, assetType, purchaseDate, warrantyExpirationDate, 
                managedBy, assignedTo, handoverFromDate, handoverToDate, location, description, status, detailInfo
            } = this.state;
        console.log('this.state', this.state);
        console.log('code', code);
        const user = this.props.user;
        const listAssetTypes = this.props.assetType;

        return (
            <div id={id} className="tab-pane active">
                <div className="box-body">
                    <div className="col-md-12">
                        <div className="col-md-4" style={{ textAlign: 'center' }}>
                            <div>
                                <a href={LOCAL_SERVER_API + avatar} target="_blank">
                                <img className="attachment-img avarta" src={LOCAL_SERVER_API + avatar} alt="Attachment" />
                                </a>
                            </div>
                        </div>
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
                                        {assetType.typeName}
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
                                        {managedBy.name}
                                    </div>
                                    {/* <div className="form-group">
                                        <strong>Chức vụ:&emsp; </strong>
                                        {positionManager}
                                    </div> */}
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <strong>Người được giao sử dụng tài sản:&emsp; </strong>
                                        {assignedTo.name}
                                    </div>
                                    {/* <div className="form-group">
                                        <strong>Chức vụ:&emsp; </strong>
                                        {positionPerson}
                                    </div> */}
                                    <div className="form-group">
                                        <strong>Thời gian sử dụng từ ngày:&emsp; </strong>
                                        {this.formatDate(handoverFromDate)}
                                    </div>
                                    <div className="form-group">
                                        <strong>Thời gian sử dụng đến ngày:&emsp; </strong>
                                        {this.formatDate(handoverToDate)}
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
                                </div>
                            </div>
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
                                            {(typeof detailInfo === 'undefined' || detailInfo.length === 0) ? <tr>
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

const tabGeneral = connect(null, null)(withTranslate(GeneralTab));
export { tabGeneral as GeneralTab };
