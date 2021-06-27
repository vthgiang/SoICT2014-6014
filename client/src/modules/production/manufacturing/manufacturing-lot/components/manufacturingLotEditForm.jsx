import React, { Component, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DatePicker, DialogModal, ErrorLabel } from '../../../../../common-components';
import { formatDate, formatToTimeZoneDate } from '../../../../../helpers/formatDate';
import { LotActions } from '../../../warehouse/inventory-management/redux/actions';

function ManufacturingLotEditFrom(props) {
   const [state, setState] = useState({
       status:null
   })
   const [prevProps, setPrevProps] = useState({
       lotId: null,
   })

   useEffect(() => {
       if(props.lotId !== prevProps.lotId){
           setState({
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
           })
           setPrevProps(props)
       }
   }, [props.lotId])


    const handleQuantityChange = (e) => {
        let { value } = e.target;
        validateQuantityChange(value, true);
    }

    const validateQuantityChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (value === "") {
            msg = translate('manufacturing.lot.error_quantity_1')
        }
        if (value < 1) {
            msg = translate('manufacturing.lot.error_quantity_1_input')
        }
        if (willUpdateState) {
            setState((state) => ({
                ...state,
                quantity: value,
                errorQuantity: msg
            }));

        }
        return msg;

    }

    const handleExpirationDateChange = (value) => {
        setState({
            ...state,
            expirationDate: value
        });
    }


    const handleDescriptionChange = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            description: value
        });
    }



    const isFormValidated = () => {
        if (
            validateQuantityChange(state.quantity, false)
            || state.expirationDate === ""
        ) {
            return false;
        }
        return true;
    }

    const save = () => {
        if (isFormValidated()) {
            const { quantity, expirationDate, description } = state;
            const data = {
                originalQuantity: quantity,
                expirationDate: formatToTimeZoneDate(expirationDate),
                description: description
            }
            props.handleEditManufacturingLot(state.lotId, data);
        }
    }

    
    const { lots, translate } = props;
    const { code, manufacturingCommandCode, good, status, quantity, errorQuantity, expirationDate, description } = state;
    
    console.log(translate('manufacturing.lot.status'))
    return (
        <React.Fragment>
            {/* <ButtonModal onButtonCallBack={handleClickCreate} modalID="modal-create-manufacturing-lot" button_name={translate('manufacturing.lot.add')} title={translate('manufacturing.lot.add_lot')} /> */}
            <DialogModal
                modalID="modal-edit-manufacturing-lot" isLoading={lots.isLoading}
                formID="form-edit-manufacturing-lot"
                title={translate('manufacturing.lot.lot_edit')}
                msg_success={translate('manufacturing.lot.create_manufacturing_lot_successfully')}
                msg_faile={translate('manufacturing.lot.create_manufacturing_lot_failed')}
                func={save}
                disableSubmit={!isFormValidated()}
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
                        <span style={{ color: status ? translate(`manufacturing.lot.${status}.color`):null }}>
                            {status? translate(`manufacturing.lot.${status}.content`):null}
                        </span>
                    </div>
                    <div className={`form-group ${!errorQuantity ? "" : "has-error"}`}>
                        <label>{translate('manufacturing.lot.quantity')} ({good && good.baseUnit})<span className="text-red">*</span></label>
                        <input type="number" value={quantity} onChange={handleQuantityChange} className="form-control"></input>
                        <ErrorLabel content={errorQuantity} />
                    </div>
                    <div className="form-group">
                        <label>{translate('manufacturing.lot.expiration_date')}<span className="text-red">*</span></label>
                        <DatePicker
                            id={`expirationDate-manufacturing-lot-edit`}
                            value={expirationDate}
                            onChange={handleExpirationDateChange}
                            disabled={false}
                        />
                    </div>
                    <div className="form-group">
                        <label>{translate('manufacturing.lot.description')}</label>
                        <textarea type="text" value={description} onChange={handleDescriptionChange} className="form-control"></textarea>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );

}


function mapStateToProps(state) {
    const { lots } = state;
    return { lots };
}

const mapDispatchToProps = {
    handleEditManufacturingLot: LotActions.handleEditManufacturingLot
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingLotEditFrom));
