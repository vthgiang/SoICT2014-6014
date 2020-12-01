import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DatePicker, DialogModal, ErrorLabel } from '../../../../../common-components';
import { formatDate, formatToTimeZoneDate } from '../../../../../helpers/formatDate';
import { LotActions } from '../../../warehouse/inventory-management/redux/actions';
class ManufacturingLotEditFrom extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    static getDerivedStateFromProps = (props, state) => {
        if (props.lotId !== state.lotId) {
            return {
                ...state,
                code: props.code,
                lotId: props.lotId,
                manufacturingCommandCode: props.manufacturingCommandCode,
                good: props.good,
                quantity: props.quantity,
                description: props.description,
                expirationDate: formatDate(props.expirationDate),
                status: props.status,
                errorQuantity: undefined
            }
        }
        return null;
    }



    handleQuantityChange = (e) => {
        let { value } = e.target;
        this.validateQuantityChange(value, true);
    }

    validateQuantityChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "") {
            msg = translate('manufacturing.lot.error_quantity_1')
        }
        if (value < 1) {
            msg = translate('manufacturing.lot.error_quantity_1_input')
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                quantity: value,
                errorQuantity: msg
            }));

        }
        return msg;

    }

    handleExpirationDateChange = (value) => {
        this.setState({
            expirationDate: value
        });
    }


    handleDescriptionChange = (e) => {
        const { value } = e.target;
        this.setState({
            description: value
        });
    }



    isFormValidated = () => {
        if (
            this.validateQuantityChange(this.state.quantity, false)
            || this.state.expirationDate === ""
        ) {
            return false;
        }
        return true;
    }

    save = () => {
        if (this.isFormValidated()) {
            const { quantity, expirationDate, description } = this.state;
            const data = {
                originalQuantity: quantity,
                expirationDate: formatToTimeZoneDate(expirationDate),
                description: description
            }
            this.props.handleEditManufacturingLot(this.state.lotId, data);
        }
    }

    render() {
        const { lots, translate } = this.props;
        const { code, manufacturingCommandCode, good, status, quantity, errorQuantity, expirationDate, description } = this.state;
        return (
            <React.Fragment>
                {/* <ButtonModal onButtonCallBack={this.handleClickCreate} modalID="modal-create-manufacturing-lot" button_name={translate('manufacturing.lot.add')} title={translate('manufacturing.lot.add_lot')} /> */}
                <DialogModal
                    modalID="modal-edit-manufacturing-lot" isLoading={lots.isLoading}
                    formID="form-edit-manufacturing-lot"
                    title={translate('manufacturing.lot.lot_edit')}
                    msg_success={translate('manufacturing.lot.create_manufacturing_lot_successfully')}
                    msg_faile={translate('manufacturing.lot.create_manufacturing_lot_failed')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    <form id="form-edit-manufacturing-lot">
                        <div className="form-group">
                            <label>{translate('manufacturing.lot.command_code')}:&emsp;</label>
                            {code}
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.lot.command_code')}:&emsp;</label>
                            {manufacturingCommandCode}
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.lot.good')}:&emsp;</label>
                            {good && good.name}
                        </div>
                        <div className="form-group">
                            <strong>{translate('manufacturing.lot.status')}:&emsp;</strong>
                            <span style={{ color: translate(`manufacturing.lot.${status}.color`) }}>
                                {translate(`manufacturing.lot.${status}.content`)}
                            </span>
                        </div>
                        <div className={`form-group ${!errorQuantity ? "" : "has-error"}`}>
                            <label>{translate('manufacturing.lot.quantity')} ({good && good.baseUnit})<span className="text-red">*</span></label>
                            <input type="number" value={quantity} onChange={this.handleQuantityChange} className="form-control"></input>
                            <ErrorLabel content={errorQuantity} />
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.lot.expiration_date')}<span className="text-red">*</span></label>
                            <DatePicker
                                id={`expirationDate-manufacturing-lot-edit`}
                                value={expirationDate}
                                onChange={this.handleExpirationDateChange}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.lot.description')}</label>
                            <textarea type="text" value={description} onChange={this.handleDescriptionChange} className="form-control"></textarea>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}


function mapStateToProps(state) {
    const { lots } = state;
    return { lots };
}

const mapDispatchToProps = {
    handleEditManufacturingLot: LotActions.handleEditManufacturingLot
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingLotEditFrom));
