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
                img: nextProps.img,
                assetNumber: nextProps.asset.assetNumber,
                assetName: nextProps.asset.assetName,
                assetType: nextProps.asset.assetType,
                location: nextProps.asset.location,
                datePurchase: nextProps.asset.datePurchase,
                manager: nextProps.asset.manager,
                position: nextProps.asset.manager.position,
                person: nextProps.asset.person,
                position1: nextProps.asset.person.position1,
                dateStartUse: nextProps.asset.dateStartUse,
                dateEndUse: nextProps.asset.dateEndUse,
                initialPrice: nextProps.asset.initialPrice,
                description: nextProps.asset.description,
                status: nextProps.asset.status,
                detailInfo: nextProps.asset.detailInfo,
            }
        } else {
            return null;
        }
    }

    string2literal = (value) => {
        var maps = {
            "NaN": NaN,
            "null": null,
            "undefined": undefined,
            "Infinity": Infinity,
            "-Infinity": -Infinity
        }
        console.log((value in maps) ? maps[value] : value);
        return ((value in maps) ? maps[value] : value);
    };

    render() {
        const { id, translate } = this.props;

        const {
            img, assetNumber, assetName, asssetType, location, datePurchase, manager, position, person, position1, dateStartUse, dateEndUse, 
             initialPrice, description, status, detailInfo
        } = this.state;
        const user = this.props.user;
        const listAssetTypes = this.props.assetType;
        console.log('this.props.asset.person', this.props.asset.person);
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
                                    <div className={`form-group `}>
                                        <strong>Mã tài sản:&emsp; </strong>
                                        {assetNumber}
                                    </div>
                                    <div className={`form-group`}>
                                        <strong>Tên tài sản:&emsp; </strong>
                                        {assetName}
                                    </div>
                                    <div className={`form-group`}>
                                        <strong>Loại tài sản:&emsp; </strong>
                                        {asssetType}
                                    </div>
                                    <div className={`form-group`}>
                                        <strong>Vị trí tài sản:&emsp; </strong>
                                        {location}
                                    </div>
                                    <div className={`form-group`}>
                                        <strong>Ngày nhập:&emsp; </strong>
                                        {datePurchase}
                                    </div>
                                    <div className={`form-group`}>
                                        <strong>Người quản lý:&emsp; </strong>
                                        {datePurchase}
                                    </div>
                                    <div className="form-group">
                                        <strong>Chức vụ:&emsp; </strong>
                                        {position}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className={`form-group`}>
                                        <strong>Người được giao sử dụng tài sản:&emsp; </strong>
                                        {person}
                                    </div>
                                    <div className="form-group">
                                        <strong>Chức vụ:&emsp; </strong>
                                        {position1}
                                    </div>
                                    <div className="form-group">
                                        <strong>Thời gian sử dụng từ ngày:&emsp; </strong>
                                        {dateStartUse}
                                    </div>
                                    <div className="form-group">
                                        <strong>Thời gian sử dụng đến ngày:&emsp; </strong>
                                        {dateEndUse}
                                    </div>
                                    <div className={`form-group`}>
                                        <strong>Giá trị ban đầu:&emsp; </strong>
                                        {initialPrice} VNĐ
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
                            {/* <hr/> */}
                            <div>
                                <label>Thông tin chi tiết:<a title="Thông tin chi tiết"><i className="fa fa-plus" style={{ color: "#00a65a", marginLeft: 5 }}/></a></label>
                            </div>
                            <div>
                                <div className={`form-group`}>

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
