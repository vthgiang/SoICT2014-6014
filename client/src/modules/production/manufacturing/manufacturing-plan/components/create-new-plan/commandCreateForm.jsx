import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import sampleData from '../../../sampleData';
class CommandCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { translate, listGoods } = this.props
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manufacturing.plan.manufacturing_good_info')}</legend>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>{translate('manufacturing.plan.index')}</th>
                                        <th>{translate('manufacturing.plan.good_code')}</th>
                                        <th>{translate('manufacturing.plan.good_name')}</th>
                                        <th>{translate('manufacturing.plan.base_unit')}</th>
                                        <th>{translate('manufacturing.plan.quantity_good_inventory')}</th>
                                        <th>{translate('manufacturing.plan.quantity')}</th>
                                        <th>{translate('manufacturing.plan.quantity_commmanded')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listGoods && listGoods.length &&
                                        listGoods.map((x, index) => (
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{x.good.code}</td>
                                                <td>{x.good.name}</td>
                                                <td>{x.good.baseUnit}</td>
                                                <td>{x.inventory}</td>
                                                <td>{x.quantity}</td>
                                                <td>{x.quantity}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </fieldset>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manufacturing.plan.productivity_mill')}</legend>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>{translate('manufacturing.plan.index')}</th>
                                        <th>{translate('manufacturing.plan.good_code')}</th>
                                        <th>{translate('manufacturing.plan.good_name')}</th>
                                        <th>{translate('manufacturing.plan.base_unit')}</th>
                                        <th>{translate('manufacturing.plan.mill')}</th>
                                        <th>{translate('manufacturing.plan.productity')}</th>
                                        <th>{translate('manufacturing.plan.number_workers')}</th>
                                    </tr>
                                </thead>
                                <tbody>

                                </tbody>
                            </table>
                        </fieldset>
                    </div>
                </div >
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manufacturing.plan.divide_command')}</legend>
                        </fieldset>
                    </div>
                </div >
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {

}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CommandCreateForm));