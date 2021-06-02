import { compareByFieldSpec } from '@fullcalendar/react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-redux-multilingual/lib/utils';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { ErrorLabel, SelectBox } from '../../../../../common-components';
import { millActions } from '../../../manufacturing/manufacturing-mill/redux/actions';

class InfoMillCreateForm extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_MILL = {
            manufacturingMill: {
                _id: "1"
            },
            productivity: '',
            personNumber: ''
        }
        this.state = {
            manufacturingMill: Object.assign({}, this.EMPTY_MILL),
            editInfo: false,
            listManufacturingMills: []
        }
    }

    componentDidMount = () => {
        this.props.getAllManufacturingMills()
    }

    getListManufacturingMills = () => {
        const { translate, manufacturingMill } = this.props;
        let listManufacturingMillArr = [{
            value: '1',
            text: translate('manage_warehouse.good_management.choose_mill')
        }];

        const { listMills } = manufacturingMill;
        if (listMills) {
            listMills.map(item => {
                listManufacturingMillArr.push({
                    value: item._id,
                    text: item.name + " - " + item.code
                });
            });
        }
        return listManufacturingMillArr;
    }

    handleManufacturingMillChange = (value) => {
        const millId = value[0];
        this.validateManufacturingMillChange(millId, true);
    }

    validateManufacturingMillChange(value, willUpdateState) {
        let msg = undefined;
        const { translate } = this.props;
        if (!value || value === "1") {
            msg = translate('manage_warehouse.good_management.error_choose_mill')
        }
        if (willUpdateState) {
            let { manufacturingMill } = this.state;
            const { listMills } = this.props.manufacturingMill;
            let mill = listMills.filter(x => x._id === value)[0];
            if (mill) {
                manufacturingMill.manufacturingMill = mill;
            } else {
                manufacturingMill.manufacturingMill = Object.assign({}, this.EMPTY_MILL);
            }
            this.setState((state) => ({
                ...state,
                manufacturingMill: { ...manufacturingMill },
                errorOnManufacturingMill: msg
            }));
        }
        return msg;
    }

    handleProductivityChange = (e) => {
        const { value } = e.target;
        this.validateProductivity(value, true);
    }

    validateProductivity(value, willUpdateState = true) {
        let msg = undefined;
        const { translate } = this.props;
        if (value < 1) {
            msg = translate('manage_warehouse.good_management.error_productivity')
        }
        if (willUpdateState) {
            const { manufacturingMill } = this.state;
            manufacturingMill.productivity = value;
            this.setState((state) => ({
                ...state,
                manufacturingMill: { ...manufacturingMill },
                errorOnProductivity: msg
            }));
        }
        return msg;
    }


    handlePersonNumberChange = (e) => {
        const { value } = e.target;
        this.validatePersonNumber(value, true);
    }

    validatePersonNumber(value, willUpdateState = true) {
        let msg = undefined;
        const { translate } = this.props;
        if (value < 1) {
            msg = translate('manage_warehouse.good_management.error_person_number')
        }
        if (willUpdateState) {
            const { manufacturingMill } = this.state;
            manufacturingMill.personNumber = value;
            this.setState((state) => ({
                ...state,
                manufacturingMill: { ...manufacturingMill },
                errorOnPersonNumber: msg
            }));
        }
        return msg;
    }

    isMillValidated = () => {
        const { manufacturingMill } = this.state
        if (this.validateManufacturingMillChange(manufacturingMill.manufacturingMill._id, false)
            || this.validateProductivity(manufacturingMill.productivity, false)
            || this.validatePersonNumber(manufacturingMill.personNumber, false)) {
            return false;
        }
        return true;
    }

    handleAddMill = async (e) => {
        e.preventDefault();
        let { listManufacturingMills, manufacturingMill } = this.state;
        listManufacturingMills.push(manufacturingMill);
        await this.setState((state) => ({
            ...state,
            listManufacturingMills: [...listManufacturingMills],
            manufacturingMill: Object.assign({}, this.EMPTY_MILL)
        }))
        this.props.onDataChange(this.state.listManufacturingMills)
    }

    handleClearMill = (e) => {
        e.preventDefault();
        this.setState((state) => ({
            ...state,
            manufacturingMill: Object.assign({}, this.EMPTY_MILL)
        }))
    }

    handleEditMill = (manufacturingMill, index) => {
        this.setState((state) => ({
            ...state,
            indexInfo: index,
            manufacturingMill: Object.assign({}, manufacturingMill),
            editInfo: true
        }));
    }
    handleCancelEditMill = (e) => {
        e.preventDefault();
        this.setState((state) => ({
            ...state,
            manufacturingMill: Object.assign({}, this.EMPTY_MILL),
            editInfo: false
        }))
    }

    handleDeleteMill = async (index) => {
        let { listManufacturingMills } = this.state;
        listManufacturingMills.splice(index, 1);

        await this.setState((state) => ({
            ...state,
            listManufacturingMills: [...listManufacturingMills]
        }));

        this.props.onDataChange(this.state.listManufacturingMills)

    }

    handleSaveEditMill = async (e) => {
        e.preventDefault();
        const { listManufacturingMills, manufacturingMill, indexInfo } = this.state;
        listManufacturingMills[indexInfo] = manufacturingMill;
        await this.setState((state) => ({
            ...state,
            editInfo: false,
            manufacturingMill: Object.assign({}, this.EMPTY_MILL),
            listManufacturingMills: [...listManufacturingMills]
        }))

        this.props.onDataChange(this.state.listManufacturingMills)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                listManufacturingMills: nextProps.initialData
            }
        }
        else {
            return null;
        }
    }

    render() {
        const { translate, id } = this.props;
        const { errorOnProductivity, errorOnPersonNumber, errorOnManufacturingMill, manufacturingMill, listManufacturingMills } = this.state;
        return (

            <fieldset className="scheduler-border">
                <legend className="scheduler-border">{translate('manage_warehouse.good_management.info_mill')}</legend>
                <div className={`form-group ${!errorOnManufacturingMill ? "" : "has-error"}`}>
                    <label>{translate('manage_warehouse.good_management.manufacturingMill')}</label>
                    <SelectBox
                        id={`select-manufacturingMill-${id}`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        value={manufacturingMill.manufacturingMill._id}
                        items={this.getListManufacturingMills()}
                        onChange={this.handleManufacturingMillChange}
                        multiple={false}
                    />
                    <ErrorLabel content={errorOnManufacturingMill} />
                </div>

                <div className={`form-group ${!errorOnProductivity ? "" : "has-error"}`}>
                    <label className="control-label">{translate('manage_warehouse.good_management.productivity')}</label>
                    <div>
                        <input type="number" className="form-control" placeholder={translate('manage_warehouse.good_management.productivity')} value={manufacturingMill.productivity} onChange={this.handleProductivityChange} />
                    </div>
                    <ErrorLabel content={errorOnProductivity} />
                </div>
                <div className={`form-group ${!errorOnPersonNumber ? "" : "has-error"}`}>
                    <label className="control-label">{translate('manage_warehouse.good_management.person_number')}</label>
                    <div>
                        <input type="number" className="form-control" placeholder={translate('manage_warehouse.good_management.person_number')} value={manufacturingMill.personNumber} onChange={this.handlePersonNumberChange} />
                    </div>
                    <ErrorLabel content={errorOnPersonNumber} />
                </div>

                <div className="pull-right" style={{ marginBottom: "10px" }}>
                    {this.state.editInfo ?
                        <React.Fragment>
                            <button className="btn btn-success" onClick={this.handleCancelEditMill} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                            <button className="btn btn-success" disabled={!this.isMillValidated()} onClick={this.handleSaveEditMill} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                        </React.Fragment> :
                        <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!this.isMillValidated()} onClick={this.handleAddMill}>{translate('task_template.add')}</button>
                    }
                    <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearMill}>{translate('task_template.delete')}</button>
                </div>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>{translate('manage_warehouse.good_management.index')}</th>
                            <th>{translate('manage_warehouse.good_management.mill_code')}</th>
                            <th>{translate('manage_warehouse.good_management.mill_name')}</th>
                            <th>{translate('manage_warehouse.good_management.productivity')}</th>
                            <th>{translate('manage_warehouse.good_management.person_number')}</th>
                            <th>{translate('task_template.action')}</th>
                        </tr>
                    </thead>
                    <tbody id={`manufacturingMill-create-1`}>
                        {
                            (typeof listManufacturingMills === 'undefined' || listManufacturingMills.length === 0) ? <tr><td colSpan={6}><center>{translate('task_template.no_data')}</center></td></tr> :
                                listManufacturingMills.map((x, index) =>
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{x.manufacturingMill.code}</td>
                                        <td>{x.manufacturingMill.name}</td>
                                        <td>{x.productivity}</td>
                                        <td>{x.personNumber}</td>
                                        <td>
                                            <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => this.handleEditMill(x, index)}><i className="material-icons"></i></a>
                                            <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => this.handleDeleteMill(index)}><i className="material-icons"></i></a>
                                        </td>
                                    </tr>
                                )
                        }
                    </tbody>
                </table>
            </fieldset>
        );
    }
}

function mapStateToProps(state) {
    const { manufacturingMill } = state;
    return { manufacturingMill };
}

const mapDispatchToProps = {
    getAllManufacturingMills: millActions.getAllManufacturingMills
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(InfoMillCreateForm));