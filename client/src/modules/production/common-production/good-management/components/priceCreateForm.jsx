import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ErrorLabel, SelectBox } from '../../../../../common-components';
import Swal from "sweetalert2";

function PriceCreateForm(props) {

    const EMPTY_DISCOUNT = {
        discountType: '0',
        quantity: '',
        discountValue: ''
    };

    const [state, setState] = useState({
        defaultPrice: '',
        cost: '',
        taxProviderTaxCode: '',
        msrp: '',
        salePrice: '',
        discountTier: Object.assign({}, EMPTY_DISCOUNT),
        listDiscountTiers: [],
        editInfo: false,
    })

    let dataDiscountType = [
        {
            value: '0',
            text: 'Chọn nguồn loại giảm giá',
        },
        {
            value: '1',
            text: 'Giảm giá theo số tiền cố định (VND)',
        },
        {
            value: '2',
            text: 'Giảm giá theo phần trăm (%)',
        }
    ];

    const handleDiscountQuantityChange = (e) => {
        let value = e.target.value;
        validateDiscountQuantity(value, true);
    }

    const validateDiscountQuantity = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            state.discountTier.quantity = value;
            setState({
                ...state,
                errorOnDiscountQuantity: msg,
            });
        }
        return msg === undefined;
    }

    const handleDiscountValueChange = (e) => {
        let value = e.target.value;
        validateDiscountValue(value, true);
    }

    const validateDiscountValue = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            state.discountTier.discountValue = value;
            setState({
                ...state,
                errorOnDiscountValue: msg,
            });
        }
        return msg === undefined;
    }

    const handleDiscountTypeChange = (value) => {
        validateDiscountType(value[0], true);
    }

    const validateDiscountType = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (value !== "1" && value !== "2") {
            msg = translate("manage_warehouse.good_management.validate_source_product");
        }
        if (willUpdateState) {
            state.discountTier.discountType = value;
            setState({
                ...state,
                errorOnDiscountType: msg,
            });
        }
        return msg === undefined;
    }

    const isUnitsValidated = () => {
        let { discountTier } = state;
        let result =
            validateDiscountQuantity(discountTier.quantity, false) &&
            validateDiscountValue(discountTier.discountValue, false) &&
            validateDiscountType(discountTier.discountType, false);
        return result
    }


    const handleEditDiscountTier = async (discountTier, index) => {
        setState({
            ...state,
            editInfo: true,
            indexInfo: index,
            discountTier: Object.assign({}, discountTier)
        })
    }

    const handleSaveEditDiscountTier = async (e) => {
        e.preventDefault();
        const { listDiscountTiers, discountTier, indexInfo } = state;
        listDiscountTiers[indexInfo] = discountTier;
        await setState({
            ...state,
            listDiscountTiers: [...listDiscountTiers],
            editInfo: false,
            discountTier: Object.assign({}, EMPTY_DISCOUNT)
        })
        await props.onDataChange(state);
    }

    const handleCancelEditDiscountTier = async (e) => {
        e.preventDefault();
        setState({
            ...state,
            editInfo: false,
            discountTier: Object.assign({}, EMPTY_DISCOUNT)
        })
    }

    const handleClearDiscountTier = async (e) => {
        e.preventDefault();
        setState({
            ...state,
            discountTier: Object.assign({}, EMPTY_DISCOUNT)
        })
    }

    const handleDeleteDiscountTier = async (index) => {
        const { listDiscountTiers } = state;
        let newListDiscountTiers;
        if (listDiscountTiers) {
            newListDiscountTiers = listDiscountTiers.filter((item, x) => index !== x);
        }
        await setState({
            ...state,
            listDiscountTiers: newListDiscountTiers
        })

        props.onDataChange(state);
    }

    const handleAddDiscountTier = async (e) => {
        e.preventDefault();
        let { listDiscountTiers, discountTier } = state;
        listDiscountTiers.push(discountTier);
        await setState({
            ...state,
            listDiscountTiers: [...listDiscountTiers],
            discountTier: Object.assign({}, EMPTY_DISCOUNT),
        })
        await props.onDataChange(state);
    }

    const handleInputFieldChange = (e, inputField) => {
        let value = e.target.value;
        setState({
            ...state,
            [inputField]: value
        })
        props.onDataChange(state);
    }

    const showListExplainDiscountTier = () => {
        Swal.fire({
            icon: "question",
            html: `<h3 style="color: red"><div>Cài đặt giá cho hàng hóa</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <p>Giá mặc định: Giá mặc định của hàng hóa</p>
            <p>Mã số thuế: Mã số thuế của khách hàng</p>
            <p>Chi phí: Chi phí khi vận chuyển hàng hóa</p>
            <p>MSRP: Giá bán lẻ đề xuất của nhà sản xuất</p>
            <p>Giá sale: Giá hàng hóa sau khi giảm</p>
            <p>Quy tắc giảm giá dựa trên số lượng:</p>
            <p>Ví dụ: Mua 2 chiếc áo sẽ được giảm 10000 VND, mua 5 chiếc áo sẽ được giảm 10% của tổng giá 5 chiếc áo</p>`,
            width: "50%",
        })
    };

    const { translate, productDefaultPrice } = props;
    let { listDiscountTiers, discountTier } = state;
    return (

        <fieldset className="scheduler-border">
            <legend className="scheduler-border">{'Giá hàng hóa'}
                <a onClick={() => showListExplainDiscountTier()}>
                    <i className="fa fa-question-circle" style={{ cursor: 'pointer', marginLeft: '5px' }} />
                </a>
            </legend>

            <div className="col-xs-12 col-sm-6 ">
                <div className={`form-group`}>
                    <label>
                        {'Giá mặc định'}
                        <span className="text-red"> * </span>
                    </label>
                    <input type="text" className="form-control" value={productDefaultPrice? productDefaultPrice: ''} onChange={(e) => handleInputFieldChange(e, 'defaultPrice')}/>
                </div>
            </div>
            <div className="col-xs-12 col-sm-6 ">
                <div className={`form-group`}>
                    <label>
                        {'Mã số thuế nhà cung cấp'}
                    </label>
                    <input type="text" className="form-control" onChange={(e) => handleInputFieldChange(e, 'taxProviderTaxCode')}/>
                </div>
            </div>

            <div className="col-xs-12">
                <label className="control-label">{'Cài đặt giá nâng cao'}</label>
            </div>
            {/*setting giá nâng cao*/}

            <div className="col-xs-12 col-sm-6 ">
                <div className={`form-group`}>
                    <label>
                        {'Chi phí'}
                    </label>
                    <input type="text" className="form-control" onChange={(e) => handleInputFieldChange(e, 'cost')}/>
                </div>
                <div className={`form-group`}>
                    <label>
                        {'Giá sale'}
                    </label>
                    <input type="text" className="form-control" onChange={(e) => handleInputFieldChange(e, 'salePrice')}/>
                </div>
            </div>
            <div className="col-xs-12 col-sm-6 ">
                <div className={`form-group`}>
                    <label>
                        {'Giá bán lẻ đề xuất'}
                    </label>
                    <input type="text" className="form-control" onChange={(e) => handleInputFieldChange(e, 'msrp')}/>
                </div>
            </div>

            {/*Bulk Pricing*/}
            <div className="col-xs-12">
                <label className="control-label">{'Quy tắc giảm giá'}</label>
                <p>{'Tạo quy tắc giảm giá hàng loạt dựa trên số lượng'}</p>
            </div>
            <div className="col-xs-12 col-sm-6 ">
                <div className={`form-group`}>
                    <label className="control-label">{"Loại giảm"}</label>
                    <SelectBox
                        id={`select-discount-type`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        value={discountTier.discountType}
                        items={dataDiscountType}
                        onChange={handleDiscountTypeChange}
                        multiple={false}
                    />
                </div>
                <div className={`form-group`}>
                    <label className="control-label">{'Số lượng'}</label>
                    <div>
                        <input type="number" className="form-control" value={discountTier.quantity} onChange={handleDiscountQuantityChange} />
                    </div>
                </div>
            </div>

            <div className="col-xs-12 col-sm-6 ">
                <div className={`form-group`}>
                    <label className="control-label">{'Giá trị giảm /Giá 1 đơn vị tính cơ bản'}</label>
                    <div>
                        <input type="number" className="form-control" value={discountTier.discountValue} onChange={handleDiscountValueChange} />
                    </div>
                </div>
            </div>

            <div className="pull-right" style={{ marginBottom: "10px" }}>
                {state.editInfo ?
                    <React.Fragment>
                        <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={handleCancelEditDiscountTier}>{translate('task_template.cancel_editing')}</button>
                        <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={handleSaveEditDiscountTier}>{translate('task_template.save')}</button>
                    </React.Fragment> :
                    <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!isUnitsValidated()} onClick={handleAddDiscountTier}>{translate('task_template.add')}</button>
                }
                <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={handleClearDiscountTier}>{translate('task_template.delete')}</button>
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th title={'STT'}>{'STT'}</th>
                        <th title={'Số lượng'}>{'Số lượng'}</th>
                        <th title={'Loại giảm giá'}>{'Loại giảm giá'}</th>
                        <th title={'Giá trị giảm'}>{'Gía trị giảm'}</th>
                        <th>{translate('task_template.action')}</th>
                    </tr>
                </thead>
                <tbody id={`unit-create-good`}>
                    {
                        (typeof listDiscountTiers === 'undefined' || listDiscountTiers.length === 0) ? <tr><td colSpan={4}><center>{translate('task_template.no_data')}</center></td></tr> :
                            listDiscountTiers.map((item, index) =>
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.discountType === '1' ? 'Giảm giá theo số tiền cố định (VND)' : 'Giảm giá theo phần trăm (%)'}</td>
                                    <td>{item.discountValue}</td>
                                    <td>
                                        <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => handleEditDiscountTier(item, index)}><i className="material-icons"></i></a>
                                        <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => handleDeleteDiscountTier(index)}><i className="material-icons"></i></a>
                                    </td>
                                </tr>
                            )
                    }
                </tbody>
            </table>
        </fieldset >
    )
}

export default connect(null, null)(withTranslate(PriceCreateForm));
