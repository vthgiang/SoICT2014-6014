import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DatePicker, DialogModal, ErrorLabel } from '../../../../../common-components';
import { formatToTimeZoneDate } from '../../../../../helpers/formatDate';
import { generateCode } from '../../../../../helpers/generateCode';
import { LotActions } from '../../../warehouse/inventory-management/redux/actions';
import { commandActions } from '../../manufacturing-command/redux/actions';
import moment from 'moment';

class ManufacturingLotCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 1 thành phẩm, 2 phế phẩm
            quantity1: '',
            quantity2: '',
            expirationDate1: '',
            expirationDate2: '',
            description1: '',
            description2: ''
        }
    }

    static getDerivedStateFromProps = (props, state) => {
        if (state.command !== props.command) {
            return {
                ...state,
                code1: props.code1,
                code2: props.code2,
                manufacturingCommandId: props.command._id,
                manufacturingCommandCode: props.command.code,
                good: props.command.good,
                expirationDate1: moment().add(props.command.good.good.numberExpirationDate, 'days').format('DD-MM-YYYY'),
                expirationDate2: moment().add(props.command.good.good.numberExpirationDate, 'days').format('DD-MM-YYYY'),
            }
        }
        return null;
    }


    handleQuantity1Change = (e) => {
        console.log();
        let { value } = e.target;
        this.validateQuantity1Change(value, true);
    }

    validateQuantity1Change = (value, willUpdateState = true) => {
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
                quantity1: value,
                errorQuantity1: msg
            }));

        }
        return msg;

    }

    handleExpirationDate1Change = (value) => {
        this.setState({
            expirationDate1: value
        })
    }

    handleQuantity2Change = (e) => {
        let { value } = e.target;
        this.validateQuantity2Change(value, true);
    }

    validateQuantity2Change = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value !== "" && value < 1) {
            msg = translate('manufacturing.lot.error_quantity_1_input')
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                quantity2: value,
                errorQuantity2: msg
            }));

        }
        return msg;

    }

    handleExpirationDate2Change = (value) => {
        this.setState({
            expirationDate2: value
        });
    }

    handleDescription1Change = (e) => {
        const { value } = e.target;
        this.setState({
            description1: value
        })
    }

    handleDescription2Change = (e) => {
        const { value } = e.target;
        this.setState({
            description2: value
        })
    }

    isFormValidated = () => {
        if (
            this.validateQuantity1Change(this.state.quantity1, false)
            || this.state.expirationDate1 === ""
            || (this.state.quantity2 > 0 && this.validateQuantity2Change(this.state.quantity2, false))
            || (this.state.quantity2 > 0 && this.state.expirationDate2 === "")
        ) {
            return false;
        }
        return true;
    }

    save = () => {
        if (this.isFormValidated()) {

            const data = [];
            const data1 = {
                code: this.state.code1,
                type: "product",
                originalQuantity: this.state.quantity1,
                productType: 1,
                manufacturingCommand: this.state.manufacturingCommandId,
                good: this.state.good.good._id,
                quantity: this.state.quantity1,
                status: 1,
                description: this.state.description1,
                expirationDate: formatToTimeZoneDate(this.state.expirationDate1),
                creator: localStorage.getItem("userId")
            }
            data.push(data1);
            if (this.state.quantity2 > 0) {
                const data2 = {
                    code: this.state.code2,
                    type: "product",
                    originalQuantity: this.state.quantity2,
                    productType: 2,
                    manufacturingCommand: this.state.manufacturingCommandId,
                    good: this.state.good.good._id,
                    quantity: this.state.quantity2,
                    status: 1,
                    description: this.state.description2,
                    expirationDate: formatToTimeZoneDate(this.state.expirationDate2),
                    creator: localStorage.getItem("userId")
                }
                data.push(data2);
            }
            this.props.createManufacturingLot(data);
            const dataCommandEdit = {
                finishedProductQuantity: this.state.quantity1 ? this.state.quantity1 : 0,
                substandardProductQuantity: this.state.quantity2 ? this.state.quantity2 : 0,
                finishedTime: new Date(Date.now()),
                status: 4
            }
            this.props.handleEditCommand(this.state.manufacturingCommandId, dataCommandEdit);
        }
    }

    render() {
        const { lots, translate } = this.props;
        const { manufacturingCommandCode, good, code1, quantity1, expirationDate1, code2, quantity2, expirationDate2, errorQuantity1, errorQuantity2, description1, description2 } = this.state;
        return (
            <React.Fragment>
                {/* <ButtonModal onButtonCallBack={this.handleClickCreate} modalID="modal-create-manufacturing-lot" button_name={translate('manufacturing.lot.add')} title={translate('manufacturing.lot.add_lot')} /> */}
                <DialogModal
                    modalID="modal-create-manufacturing-lot" isLoading={lots.isLoading}
                    formID="form-create-manufacturing-lot"
                    title={translate('manufacturing.lot.add_lot')}
                    msg_success={translate('manufacturing.lot.create_manufacturing_lot_successfully')}
                    msg_faile={translate('manufacturing.lot.create_manufacturing_lot_failed')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    <form id="form-create-manufacturing-lot">
                        <div className="form-group">
                            <label>{translate('manufacturing.lot.command_code')}:&emsp;</label>
                            {manufacturingCommandCode}
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.lot.good')}:&emsp;</label>
                            {good && good.good && good.good.name}
                        </div>
                        {/* <div className="form-group">
                            <label>{translate('manufacturing.lot.packing_rule')}:&emsp;</label>
                            {good && good.packingRule}
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.lot.quantity_packing_rule')}:&emsp;</label>
                            {good && good.quantity + " " + good.packingRule}
                        </div> */}
                        <div className="form-group">
                            <label>{translate('manufacturing.lot.base_unit')}:&emsp;</label>
                            {good && good.good && good.good.baseUnit}
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.lot.quantity_base_unit')}:&emsp;</label>
                            {good && good.quantity + " " + good.good.baseUnit}
                        </div>

                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manufacturing.lot.finished_product')}<span className="text-red">*</span></legend>
                            <div className="form-group">
                                <label>{translate('manufacturing.lot.code1')}<span className="text-red">*</span></label>
                                <input type="text" disabled={true} value={code1} className="form-control"></input>
                            </div>
                            <div className={`form-group ${!errorQuantity1 ? "" : "has-error"}`}>
                                <label>{translate('manufacturing.lot.quantity')} ({good && good.good.baseUnit})<span className="text-red">*</span></label>
                                <input type="number" value={quantity1} onChange={this.handleQuantity1Change} className="form-control"></input>
                                <ErrorLabel content={errorQuantity1} />
                            </div>
                            <div className="form-group">
                                <label>{translate('manufacturing.lot.expiration_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`expirationDate1-manufacturing-lot`}
                                    value={expirationDate1}
                                    onChange={this.handleExpirationDate1Change}
                                    disabled={false}
                                />
                            </div>
                            <div className="form-group">
                                <label>{translate('manufacturing.lot.description')}</label>
                                <textarea type="text" value={description1} onChange={this.handleDescription1Change} className="form-control"></textarea>
                            </div>
                        </fieldset>

                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manufacturing.lot.substandard_product')}</legend>
                            <div className="form-group">
                                <label>{translate('manufacturing.lot.code2')}</label>
                                <input type="text" disabled={true} value={code2} className="form-control"></input>
                            </div>
                            <div className={`form-group ${!errorQuantity2 ? '' : 'has-error'}`}>
                                <label>{translate('manufacturing.lot.quantity')} ({good && good.good.baseUnit})</label>
                                <input type="number" value={quantity2} onChange={this.handleQuantity2Change} className="form-control"></input>
                                <ErrorLabel content={errorQuantity2} />
                            </div>
                            <div className="form-group">
                                <label>{translate('manufacturing.lot.expiration_date')}{quantity2 && <span className="text-red">*</span>}</label>
                                <DatePicker
                                    id={`expirationDate2-manufacturing-lot`}
                                    value={expirationDate2}
                                    onChange={this.handleExpirationDate2Change}
                                    disabled={false}
                                />
                            </div>
                            <div className="form-group">
                                <label>{translate('manufacturing.lot.description')}</label>
                                <textarea type="text" value={description2} onChange={this.handleDescription2Change} className="form-control"></textarea>
                            </div>
                        </fieldset>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { lots } = state;
    return { lots }
}

const mapDispatchToProps = {
    createManufacturingLot: LotActions.createManufacturingLot,
    handleEditCommand: commandActions.handleEditCommand
}


export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingLotCreateForm));