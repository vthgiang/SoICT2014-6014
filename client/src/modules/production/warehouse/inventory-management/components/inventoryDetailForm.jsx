import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, Errorstrong, ButtonModal } from '../../../../../common-components';
import { translate } from 'react-redux-multilingual/lib/utils';

class InventoryDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { translate, goods, lots, id } = this.props;
        const { goodDetail } = goods;
        const { listLots } = lots;
        let lotOfGood = listLots ? listLots.filter(x => x.good ? x.good._id === id : x ) : [];
        let quantityTotal = lotOfGood ? lotOfGood.reduce(function (accumulator, currentValue){
            return accumulator + currentValue.quantity;
        }, 0) : 0;
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-detail-inventory`}
                    formID={`form-detail-inventory`}
                    title={translate('manage_warehouse.inventory_management.stock_card')}
                    msg_success={translate('manage_warehouse.bin_location_management.add_success')}
                    msg_faile={translate('manage_warehouse.bin_location_management.add_faile')}
                    size={75}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form id={`form-detail-inventory`} >
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.inventory_management.good_code')}:&emsp;</strong>
                                    {goodDetail.code}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.inventory_management.unit')}:&emsp;</strong>
                                    {goodDetail.baseUnit}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.inventory_management.name')}:&emsp;</strong>
                                    {goodDetail.name}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.inventory_management.quantity')}:&emsp;</strong>
                                    {quantityTotal} {goodDetail.baseUnit}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.inventory_management.description')}:&emsp;</strong>
                                    {goodDetail.description}
                                </div>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.inventory_management.history')}</legend>

                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th style={{width: "5%"}} title={translate('manage_warehouse.inventory_management.index')}>{translate('manage_warehouse.inventory_management.index')}</th>
                                                <th title={translate('manage_warehouse.inventory_management.date_month')}>{translate('manage_warehouse.inventory_management.date_month')}</th>
                                                <th title={translate('manage_warehouse.inventory_management.receipt')}>{translate('manage_warehouse.inventory_management.receipt')}</th>
                                                <th title={translate('manage_warehouse.inventory_management.issue')}>{translate('manage_warehouse.inventory_management.issue')}</th>
                                                <th title={translate('manage_warehouse.inventory_management.inventory')}>{translate('manage_warehouse.inventory_management.inventory')}</th>
                                                <th title={translate('manage_warehouse.inventory_management.stock')}>{translate('manage_warehouse.inventory_management.stock')}</th>
                                            </tr>
                                        </thead>
                                        <tbody id={`good-edit-manage-by-archive`}>
                                                    <tr>
                                                        <td>1</td>
                                                        <td>5-10-2020</td>
                                                        <td>100</td>
                                                        <td>0</td>
                                                        <td>100</td>
                                                        <td>Tạ Quang Bửu</td>
                                                    </tr>
                                                    <tr>
                                                        <td>2</td>
                                                        <td>6-10-2020</td>
                                                        <td>50</td>
                                                        <td>0</td>
                                                        <td>150</td>
                                                        <td>Trần Đại Nghĩa</td>
                                                    </tr>
                                                    <tr>
                                                        <td>3</td>
                                                        <td>6-10-2020</td>
                                                        <td>0</td>
                                                        <td>60</td>
                                                        <td>90</td>
                                                        <td>Tạ Quang Bửu</td>
                                                    </tr>
                                                    <tr>
                                                        <td>4</td>
                                                        <td>8-10-2020</td>
                                                        <td>0</td>
                                                        <td>30</td>
                                                        <td>60</td>
                                                        <td>Tạ Quang Bửu</td>
                                                    </tr>
                                                    <tr>
                                                        <td>5</td>
                                                        <td>8-10-2020</td>
                                                        <td>0</td>
                                                        <td>10</td>
                                                        <td>50</td>
                                                        <td>Trần Đại Nghĩa</td>
                                                    </tr>
                                        </tbody>
                                    </table>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, null)(withTranslate(InventoryDetailForm));