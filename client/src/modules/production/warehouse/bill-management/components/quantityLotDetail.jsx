import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, ButtonModal } from '../../../../../common-components';

class QuantityLotDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        const { quantityDetail, translate } = this.props;

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-detail-lot-quantity`}
                    formID={`form-detail-lot-quantity`}
                    title="Chi tiết số lượng"
                    size={50}
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
                                    <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>
                                </tr>
                            </thead>
                            <tbody id={`quantity-bill-lot-create`}>
                                {
                                    (typeof quantityDetail.lots !== 'undefined' && quantityDetail.lots.length > 0) ?
                                        quantityDetail.lots.map((x, index) =>
                                            <tr key={index}>
                                                <td>{x.lot.name}</td>
                                                <td>{x.quantity}</td>
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