import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { kpiUnitActions as createUnitKpiActions } from '../../../redux-actions/CombineActions';
import { createUnitKpiActions } from '../redux/actions';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { withTranslate } from 'react-redux-multilingual';


class ModalAddTargetKPIUnit extends Component {
    componentDidMount() {
        // get all parent target of unit
        this.props.getParentTarget(localStorage.getItem("currentRole"));
    }
    constructor(props) {
        super(props);
        this.state = {
            submitted: false
        };

    }

    // function: notification the result of an action
    notifysuccess = (message) => toast(message, {containerId: 'toast-notification'});
    notifyerror = (message) => toast.error(message, {containerId: 'toast-notification'});
    notifywarning = (message) => toast.warning(message, {containerId: 'toast-notification'});

    onAddItem = async (event) => {
        event.preventDefault();

        const { translate } = this.props;

        await this.setState(state => {
            return {
                ...state,
                target: {
                    name: this.name.value,
                    parent: (this.parent) ? this.parent.value : null,//fix
                    weight: this.weight.value,
                    criteria: this.criteria.value,
                    kpiunit: this.props.kpiunit
                },
                adding: true
            }
        });
        const { target } = this.state;
        // check: all filled fields => update database
        if (target.name && target.weight && target.criteria) {
            this.props.addTargetKPIUnit(target);

            this.notifysuccess(translate('kpi_unit_create.add_target_success')); 

            window.$("#addNewTargetKPIUnit").modal("hide");
        }
        else{
            this.notifyerror(translate('kpi_unit_create.error'));
        }
    }
    render() {
        var parentKPI;
        const { target, adding } = this.state;
        const { createKpiUnit, unit } = this.props;
        if (createKpiUnit.parent) parentKPI = createKpiUnit.parent;

        // hàm để chuyển sang song ngữ
        const { translate } = this.props;

        return (
            <div className="modal fade" id="addNewTargetKPIUnit">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                            <h3 className="modal-title">{translate('kpi_unit_create.add_title')}</h3>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>{translate('kpi_unit_create.target_name')}:</label>
                                <div className={'form-group has-feedback' + (adding && !target.name ? ' has-error' : '')}>
                                    <input type="text" className="form-control" ref={input => this.name = input} id="inputname" placeholder="Tên mục tiêu" name="name" />
                                </div>
                            </div>
                            {(typeof unit !== "undefined" && unit.parent !== null) &&//unit.parent === null này!!! kiểm tra xem đây là đơn vị gốc hay không!
                                <div className="form-group">
                                    <label>{translate('kpi_unit_create.on_target')}:</label>
                                    <div className={'form-group has-feedback' + (adding && !target.parent ? ' has-error' : '')}>
{/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
                                        {(typeof parentKPI !== 'undefined' && parentKPI !== null) &&
                                            <select defaultValue={parentKPI.listtarget[0]._id} ref={input => this.parent = input} className="form-control" id="selparent" name="parent">
                                                {parentKPI.listtarget.filter(item => item.default === 0).map(x => {//default !==0 thì đc. cái này để loại những mục tiêu mặc định?
                                                    return <option key={x._id} value={x._id}>{x.name}</option>
                                                })}
                                            </select>}
                                    </div>
                                </div>}
                            <div className="form-group">
                                <label>{translate('kpi_unit_create.criteria')}:</label>
                                <div className={'form-group has-feedback' + (adding && !target.criteria ? ' has-error' : '')}>
                                    <textarea type="text" className='form-control' ref={input => this.criteria = input} placeholder="Đánh giá mức độ hoàn thành dựa trên tiêu chí nào?" name="criteria" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>{translate('kpi_unit_create.weight')}:</label>
                                <div className={'form-group has-feedback' + (adding && !target.weight ? ' has-error' : '')} id="inputname">
                                    <input type="Number" min="0" max="100" ref={input => this.weight = input} className="form-control pull-right" placeholder="Trọng số của mục tiêu" name="weight" />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-success" onClick={(event)=>this.onAddItem(event)}>{translate('kpi_unit_create.add_new')}</button>
                            <button type="cancel" className="btn btn-primary" data-dismiss="modal">{translate('kpi_unit_create.cancel')}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


function mapState(state) {
    const { createKpiUnit } = state;
    return { createKpiUnit };
}

const actionCreators = {
    getParentTarget: createUnitKpiActions.getKPIParent,
    addTargetKPIUnit: createUnitKpiActions.addTargetKPIUnit
};
const connectedModalAddTargetKPIUnit = connect(mapState, actionCreators)(withTranslate(ModalAddTargetKPIUnit));
export { connectedModalAddTargetKPIUnit as ModalAddTargetKPIUnit };