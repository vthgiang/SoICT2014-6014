import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, ButtonModal } from '../../../../../../common-components';

class QuantityLotDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                day = '' + d.getDate(),
                month = '' + (d.getMonth() + 1),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        } else {
            return date
        }
    }

    render() {
        const { quantityDetail, group, translate } = this.props;

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-detail-lot-quantity`}
                    formID={`form-detail-lot-quantity`}
                    title="Chi tiết số lượng"
                    size={75}
                    hasSaveButton={false}
                    hasNote={false}
                >
                <form id={`form-detail-lot-quantity`}>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate('manage_warehouse.bill_management.lot')}</legend>

                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th title={translate('manage_warehouse.bill_management.lot_number')}>{translate('manage_warehouse.bill_management.lot_number')}</th>
                                    <th title={translate('manage_warehouse.bill_management.expiration_date')}>{translate('manage_warehouse.bill_management.expiration_date')}</th>
                                    { group !== '3' && <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>}
                                    { group === '3' && <th title={translate('manage_warehouse.bill_management.quantity_issue')}>{translate('manage_warehouse.bill_management.quantity_issue')}</th>}
                                    { group === '3' && <th title={translate('manage_warehouse.bill_management.quantity_return')}>{translate('manage_warehouse.bill_management.quantity_return')}</th>}
                                    { group === '4' && <th title={translate('manage_warehouse.bill_management.real_quantity')}>{translate('manage_warehouse.bill_management.real_quantity')}</th>}
                                    { group === '4' && <th title={translate('manage_warehouse.bill_management.difference')}>{translate('manage_warehouse.bill_management.difference')}</th>}
                                    <th title={translate('manage_warehouse.bill_management.description')}>{translate('manage_warehouse.bill_management.description')}</th>
                                </tr>
                            </thead>
                            <tbody id={`quantity-bill-lot-create`}>
                                {
                                    (typeof quantityDetail.lots !== 'undefined' && quantityDetail.lots.length > 0) ?
                                        quantityDetail.lots.map((x, index) =>
                                            <tr key={index}>
                                                <td>{x.lot ? x.lot.code : ''}</td>
                                                <td>{this.formatDate(x.lot.expirationDate)}</td>
                                                <td>{x.quantity}</td>
                                                {group === '3' && <td>{x.returnQuantity}</td>}
                                                {group === '4' && <td>{x.realQuantity}</td>}
                                                {group === '4' && <td>{x.damagedQuantity}</td>}
                                                <td>{x.note}</td>
                                            </tr>
                                        ) : <tr><td colSpan={3}><center>{translate('task_template.no_data')}</center></td></tr>
                                }
                            </tbody>
                        </table>
                    </fieldset>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuantityLotDetailForm));