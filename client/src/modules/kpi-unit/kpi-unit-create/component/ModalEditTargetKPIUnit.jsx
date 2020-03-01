import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { kpiUnitActions as createUnitKpiActions } from '../../../redux-actions/KPIUnitActions';
import { createUnitKpiActions } from '../redux/actions';

class ModalEditTargetKPIUnit extends Component {
    componentDidMount() {
        // get all parent target of unit
        this.props.getParentTarget(localStorage.getItem("currentRole"));
    }
    constructor(props) {
        super(props);
        this.state = {
            newTarget: {
                name: '',
                parent: '',
                weight: '',
                criteria: ''
            },
            editing: false
        };

    }

    handleEditTarget = async (event, id) => {
        event.preventDefault();
        await this.setState({
            editing: true,
            newTarget: {
                name: this.name.value,
                parent: this.parent.value,
                weight: this.weight.value,
                criteria: this.criteria.value
            }
        });
        const { newTarget } = this.state;
        // check: all filled fields => update database
        if (newTarget.name && newTarget.weight && newTarget.criteria) {
            this.props.editTargetKPIUnit(id, newTarget);
        }
        window.$(`#editTargetKPIUnit${id}`).modal("hide");
    }
    render() {
        const { createKpiUnit, target, unit } = this.props;
        const {editing, newTarget} = this.state;
        var parentKPI;
        if (createKpiUnit.parent) parentKPI = createKpiUnit.parent;
        return (
            <div className="modal fade" id={`editTargetKPIUnit${target._id}`}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                            <h3 className="modal-title">Chỉnh sửa mục tiêu KPI đơn vị</h3>
                        </div>
                        <div className="modal-body">
                                <div className="form-group">
                                    <label>Tên mục tiêu:</label>
                                    <div className={'form-group has-feedback' + (editing && !newTarget.name ? ' has-error' : '')}>
                                        <input type="text" className="form-control" ref={input => this.name = input} defaultValue={target.name} placeholder="Tên mục tiêu" name="name" />
                                    </div>
                                </div>
                                {(typeof unit !== "undefined" && unit.parent !== null) &&
                                <div className="form-group">
                                    <label>Thuộc mục tiêu:</label>
                                    <div className={'form-group has-feedback' + (editing && !newTarget.parent ? ' has-error' : '')}>
                                        {(typeof parentKPI !== 'undefined' && parentKPI !== null) &&
                                            <select defaultValue={target.parent!==null?target.parent._id:parentKPI.listtarget[0]._id} ref={input => this.parent = input} className="form-control" name="parent">
                                                {parentKPI.listtarget.map(x => {
                                                    return <option key={x._id} value={x._id}>{x.name}</option>
                                                })}
                                            </select>}
                                    </div>
                                </div>}
                                <div className="form-group">
                                    <label>Mô tả tiêu chí đánh giá:</label>
                                    <div className={'form-group has-feedback' + (editing && !newTarget.criteria ? ' has-error' : '')}>
                                        <textarea style={{height: "auto"}} ref={input => this.criteria = input} type="text" className='form-control' defaultValue={target.criteria} placeholder="Đánh giá mức độ hoàn thành dựa trên tiêu chí nào?" name="criteria" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Trọng số:</label>
                                    <div className={'form-group has-feedback' + (editing && !newTarget.weight ? ' has-error' : '')}>
                                        <input type="Number" min="0" max="100" ref={input => this.weight = input} defaultValue={target.weight} className="form-control pull-right" placeholder="Trọng số của mục tiêu" name="weight" />
                                    </div>
                                </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-success" onClick={(event)=>this.handleEditTarget(event, target._id)}>Lưu thay đổi</button>
                            <button type="cancel" className="btn btn-primary" data-dismiss="modal">Hủy bỏ</button>
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
    editTargetKPIUnit: createUnitKpiActions.editTargetKPIUnit
};
const connectedModalEditTargetKPIUnit = connect(mapState, actionCreators)(ModalEditTargetKPIUnit);
export { connectedModalEditTargetKPIUnit as ModalEditTargetKPIUnit };