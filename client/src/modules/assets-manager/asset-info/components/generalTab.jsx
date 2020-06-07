import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class GeneralTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                img: nextProps.asset.avatar,
                code: nextProps.asset.code,
                assetName: nextProps.asset.assetName,
                serial: nextProps.asset.serial,
                assetType: nextProps.asset.assetType,
                datePurchase: nextProps.asset.datePurchase,
                warrantyExpirationDate: nextProps.asset.warrantyExpirationDate,
                manager: nextProps.asset.manager,
                positionManager: nextProps.asset.manager.positionManager,
                person: nextProps.asset.person,
                positionPerson: nextProps.asset.person.positionPerson,
                dateStartUse: nextProps.asset.dateStartUse,
                dateEndUse: nextProps.asset.dateEndUse,
                location: nextProps.asset.location,
                description: nextProps.asset.description,
                status: nextProps.asset.status,
                detailInfo: nextProps.asset.detailInfo,
            }
        } else {
            return null;
        }
    }

    // string2literal = (value) => {
    //     var maps = {
    //         "NaN": NaN,
    //         "null": null,
    //         "undefined": undefined,
    //         "Infinity": Infinity,
    //         "-Infinity": -Infinity
    //     }
    //     console.log((value in maps) ? maps[value] : value);
    //     return ((value in maps) ? maps[value] : value);
    // };

    render() {
        const { id, translate } = this.props;

        const {
            img, avatar, code, assetName, serial, assetType, datePurchase, warrantyExpirationDate, manager, positionManager, person, positionPerson, dateStartUse, dateEndUse,
            location, description, status, detailInfo
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
                                <img className="attachment-img avarta" src={img} alt="Attachment" />
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
                                        {/* cái này la đoi tuowng nay no ko in ra dc vay dau. thế gọi ntn ôg */}
                                    </div>
                                    <div className="form-group">
                                        <strong>Ngày nhập:&emsp; </strong>
                                        {datePurchase}
                                    </div>
                                    <div className="form-group">
                                        <strong>Ngày bảo hành:&emsp; </strong>
                                        {warrantyExpirationDate}
                                    </div>
                                    <div className="form-group">
                                        <strong>Người quản lý:&emsp; </strong>
                                        {manager.name}
                                    </div>
                                    <div className="form-group">
                                        <strong>Chức vụ:&emsp; </strong>
                                        {positionManager}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <strong>Người được giao sử dụng tài sản:&emsp; </strong>
                                        {person.name}
                                    </div>
                                    <div className="form-group">
                                        <strong>Chức vụ:&emsp; </strong>
                                        {positionPerson}
                                    </div>
                                    <div className="form-group">
                                        <strong>Thời gian sử dụng từ ngày:&emsp; </strong>
                                        {dateStartUse}
                                    </div>
                                    <div className="form-group">
                                        <strong>Thời gian sử dụng đến ngày:&emsp; </strong>
                                        {dateEndUse}
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
