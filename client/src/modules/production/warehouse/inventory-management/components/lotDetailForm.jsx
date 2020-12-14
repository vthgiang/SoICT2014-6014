import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal } from '../../../../../common-components';
import { translate } from 'react-redux-multilingual/lib/utils';

import LogLots from './logLots';

class LotDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

    render() {
        const { translate, lots } = this.props;
        const { lotDetail } = lots;
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-detail-lot`}
                    formID={`form-detail-lot`}
                    title={translate('manage_warehouse.inventory_management.lot_detail')}
                    msg_success={translate('manage_warehouse.bin_location_management.add_success')}
                    msg_faile={translate('manage_warehouse.bin_location_management.add_faile')}
                    size={75}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    
                    <form id={`form-detail-lot`} >
                        {
                            lotDetail ?
                            <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.inventory_management.lot_code')}:&emsp;</strong>
                                    {lotDetail.code}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.inventory_management.unit')}:&emsp;</strong>
                                    {lotDetail.good.baseUnit}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.inventory_management.stock')}:&emsp;</strong>
                                    Tất cả kho
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.inventory_management.from_to')}:&emsp;</strong>
                                    <a href="#">SX001</a>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.inventory_management.original_quantity')}:&emsp;</strong>
                                    {lotDetail.originalQuantity} {lotDetail.good.baseUnit}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.inventory_management.quantity')}:&emsp;</strong>
                                    {lotDetail.quantity} {lotDetail.good.baseUnit}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.inventory_management.date')}:&emsp;</strong>
                                    { this.formatDate(lotDetail.expirationDate)}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.inventory_management.description')}:&emsp;</strong>
                                    {lotDetail.description}
                                </div>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.inventory_management.bin')}</legend>
                                    {lotDetail.stocks.map((x, index) => <p key={index}><b>Kho {x.stock.name} có {x.quantity} {lotDetail.good.baseUnit}: </b>{x.binLocations.map(item => item.binLocation.path + "(" + item.quantity + lotDetail.good.baseUnit +"), " )}</p>)}
                                </fieldset>
                                <LogLots logs={lotDetail.lotLogs} />
                            </div>
                        </div> : []
                        }
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(LotDetailForm));