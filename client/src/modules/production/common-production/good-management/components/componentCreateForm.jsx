import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { GoodActions } from '../redux/actions';

import { ErrorLabel, SelectBox } from '../../../../../common-components';

function ComponentCreateForm(props) {
    const EMPTY_GOOD = {
        good: '',
        quantity: '',
    };

    const [state, setState] = useState({
        material: Object.assign({}, EMPTY_GOOD),
        listMaterial: props.initialData,
        editInfo: false
    })

    useEffect(() => {
        let type = 'material';
        props.getAllGoodsByType({ type });
    }, [])

    if (props.id !== state.id) {
        setState({
            ...state,
            id: props.id,
            listMaterial: props.initialData
        })
    }

    const handleQuantityChange = (e) => {
        let value = e.target.value;
        validateQuantity(value, true);
    }

    const validateQuantity = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            state.material.quantity = value;
            setState({
                ...state,
                errorOnMaterialQuantity: msg,
            });
        }
        return msg === undefined;
    }

    const handleGoodChange = (value) => {
        let material = value[0];
        validateGood(material, true);
    }

    const validateGood = async (value, willUpdateState = true) => {
        const dataGoodByType = await getGoodsByType();

        let msg = undefined;
        const { translate } = props;
        let { material } = state;
        if (!value) {
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            let goodName = dataGoodByType.find(x => x.value === value);
            material.good = { _id: value, name: goodName.text };
            setState({
                ...state,
                material: { ...material },
                errorOnGood: msg
            });
        }
        return msg === undefined;
    }

    const getGoodsByType = () => {
        let { goods, translate } = props;
        let listGoodsByType = goods.listGoodsByType;
        let goodArr = [{ value: '', text: translate('manage_warehouse.good_management.choose_category') }];

        listGoodsByType.map(item => {
            goodArr.push({
                value: item._id,
                text: item.name + " - " + item.baseUnit
            })
        })

        return goodArr;
    }

    const isMaterialsValidated = () => {
        let result =
            validateQuantity(state.material.quantity, false) &&
            validateGood(state.material.good, false)
        return result
    }

    const handleAddMaterial = async (e) => {
        e.preventDefault();
        let { listMaterial, material } = state;
        listMaterial.push(material);
        await setState({
            ...state,
            listMaterial: [...listMaterial],
            material: Object.assign({}, EMPTY_GOOD),
        })
        props.onDataChange(state.listMaterial);

    }

    const handleEditMaterial = async (material, index) => {
        setState({
            ...state,
            editInfo: true,
            indexInfo: index,
            material: Object.assign({}, material)
        })
    }

    const handleSaveEditMaterial = async (e) => {
        e.preventDefault();
        const { listMaterial, material, indexInfo } = state;
        listMaterial[indexInfo] = material;
        await setState({
            ...state,
            listMaterial: [...listMaterial],
            editInfo: false,
            material: Object.assign({}, EMPTY_GOOD),
        })
        props.onDataChange(state.listMaterial);


    }

    const handleCancelEditMaterial = async (e) => {
        e.preventDefault();
        await setState({
            ...state,
            editInfo: false,
            material: Object.assign({}, EMPTY_GOOD)
        })
    }

    const handleClearMaterial = async (e) => {
        e.preventDefault();
        await setState({
            ...state,
            material: Object.assign({}, EMPTY_GOOD)
        })
    }

    const handleDeleteMaterial = async (index) => {
        const { listMaterial } = state;
        let newListMaterial;
        if (listMaterial) {
            newListMaterial = listMaterial.filter((item, x) => index !== x);
        }
        await setState({
            ...state,
            listMaterial: newListMaterial
        })

        props.onDataChange(state.listMaterial);
    }

    const { translate, id, type } = props;
    const { listMaterial, material, errorOnMaterialQuantity, errorOnGood } = state;
    const dataGoodByType = getGoodsByType();
    let component = '';
    if (material.good) {
        component = material.good._id
    }

    return (

        <fieldset className="scheduler-border">
            <legend className="scheduler-border">{translate('manage_warehouse.good_management.materials')}<span className="attention">*</span></legend>

            <div className={`form-group ${!errorOnGood ? "" : "has-error"}`}>
                <label>{translate('manage_warehouse.good_management.material')}</label>
                <SelectBox
                    id={`select-material-by-${id}`}
                    className="form-control select2"
                    style={{ width: "100%" }}
                    value={component ? component : { value: '', text: translate('manage_warehouse.good_management.choose_category') }}
                    items={dataGoodByType}
                    onChange={handleGoodChange}
                    multiple={false}
                />
                <ErrorLabel content={errorOnGood} />
            </div>

            <div className={`form-group ${!errorOnMaterialQuantity ? "" : "has-error"}`}>
                <label className="control-label">{translate('manage_warehouse.good_management.quantity')}</label>
                <div>
                    <input type="number" className="form-control" placeholder={translate('manage_warehouse.good_management.quantity')} value={material.quantity} onChange={handleQuantityChange} />
                </div>
                <ErrorLabel content={errorOnMaterialQuantity} />
            </div>

            <div className="pull-right" style={{ marginBottom: "10px" }}>
                {state.editInfo ?
                    <React.Fragment>
                        <button className="btn btn-success" onClick={handleCancelEditMaterial} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                        <button className="btn btn-success" disabled={!isMaterialsValidated()} onClick={handleSaveEditMaterial} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                    </React.Fragment> :
                    <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!isMaterialsValidated()} onClick={handleAddMaterial}>{translate('task_template.add')}</button>
                }
                <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={handleClearMaterial}>{translate('task_template.delete')}</button>
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th title={translate('manage_warehouse.good_management.material')}>{translate('manage_warehouse.good_management.material')}</th>
                        <th title={translate('manage_warehouse.good_management.quantity')}>{translate('manage_warehouse.good_management.quantity')}</th>
                        <th>{translate('task_template.action')}</th>
                    </tr>
                </thead>
                <tbody id={`material-create-${id - type}`}>
                    {
                        (typeof listMaterial === 'undefined' || listMaterial.length === 0) ? <tr><td colSpan={3}><center>{translate('task_template.no_data')}</center></td></tr> :
                            listMaterial.map((x, index) =>
                                <tr key={index}>
                                    <td>{x.good.name}</td>
                                    <td>{x.quantity}</td>
                                    <td>
                                        <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => handleEditMaterial(x, index)}><i className="material-icons"></i></a>
                                        <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => handleDeleteMaterial(index)}><i className="material-icons"></i></a>
                                    </td>
                                </tr>
                            )
                    }
                </tbody>
            </table>
        </fieldset>
    )
}

function mapStateToProps(state) {
    const { goods } = state;
    return { goods };
}

const mapDispatchToProps = {
    getAllGoodsByType: GoodActions.getAllGoodsByType
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ComponentCreateForm));
