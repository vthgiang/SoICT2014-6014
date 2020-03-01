import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createUnitKpiActions } from '../../../kpi-unit/kpi-unit-create/redux/actions';
import { createKpiActions } from "../redux/actions";

class ModalEditTargetKPIPersonal extends Component {
    componentDidMount() {
        // get all parent target of unit
        this.props.getParentTarget(localStorage.getItem("currentRole"));
    }
    constructor(props) {
        super(props);
        this.state = {
            editing: false,

        };

    }
    // function: chỉnh sửa một mục tiêu của KPI cá nhân
    saveEditTarget = async (event) => {
        event.preventDefault();
        await this.setState(state => {
            return {
                adding: true,
                newTarget: {
                    name: this.name.value,
                    parent: this.parent.value,
                    weight: this.weight.value,
                    criteria: this.criteria.value,
                    kpipersonal: this.props.kpipersonal
                }
            }
        });
        const { newTarget } = this.state;
        if (newTarget.parent && newTarget.name && newTarget.weight && newTarget.criteria) {
            this.props.addNewTargetPersonal(newTarget);
            window.$("#addNewTargetKPIPersonal").modal("hide");
            window.$(".modal-backdrop").remove();
            window.$('body').removeClass('modal-open');
            window.$('body').css('padding-right', "0px");
        }
    }
    editTargetKPiPersonal = async (event, id) => {
        event.preventDefault();
        await this.setState({
            editing: false,
            newTarget: {
                name: this.name.value,
                parent: this.parent.value,
                criteria: this.criteria.value,
                weight: this.weight.value
            }
        });
        const {newTarget} = this.state;
        console.log(newTarget);
        if (newTarget.parent && newTarget.name && newTarget.weight && newTarget.criteria) {
            this.props.editTargetPersonal(id, newTarget);
            this.handleCloseModal(id);
        }
    }
    handleCloseModal = (id) => {
        var element = document.getElementsByTagName("BODY")[0];
        element.classList.remove("modal-open");
        var modal = document.getElementById(`editTargetKPIPersonal${id}`);
        modal.classList.remove("in");
        modal.style = "display: none;";
    }
    render() {
        var parentTargets;
        const {target} = this.props;
        const {editing, newTarget} = this.state;
        const { createKpiUnit } = this.props;
        if (createKpiUnit.currentKPI) parentTargets = createKpiUnit.currentKPI.listtarget;
        return (
            <div className="modal fade" id={`editTargetKPIPersonal${target._id}`}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" onClick={()=>this.handleCloseModal(target._id)} aria-hidden="true">×</button>
                            <h3 className="modal-title">Chỉnh sửa mục tiêu KPI cá nhân</h3>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label>Tên mục tiêu:</label>
                                    <div className={'form-group has-feedback' + (editing && !newTarget.name ? ' has-error' : '')}>
                                        <input type="text" className="form-control" defaultValue={target.name} ref={input => this.name = input} placeholder="Tên mục tiêu" name="name" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Thuộc mục tiêu:</label>
                                    <div className={'form-group has-feedback'}>
                                        {(typeof parentTargets !== 'undefined' && parentTargets.length !== 0) &&
                                            <select className="form-control" defaultValue={target.parent._id} id="selparent" name="parent" ref={input => this.parent = input}>
                                                {parentTargets.map(x => {
                                                    return <option key={x._id} value={x._id}>{x.name}</option>
                                                })}
                                            </select>}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Mô tả tiêu chí đánh giá:</label>
                                    <div className={'form-group has-feedback' + (editing && !newTarget.criteria ? ' has-error' : '')}>
                                        <textarea style={{height: "auto"}} defaultValue={target.criteria} type="text" className='form-control' ref={input => this.criteria = input} placeholder="Đánh giá mức độ hoàn thành dựa trên tiêu chí nào?" name="criteria" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Trọng số:</label>
                                    <div className={'form-group has-feedback' + (editing && !newTarget.weight ? ' has-error' : '')} id="inputname">
                                        <input type="number" min="0" max="100" defaultValue={target.weight} className="form-control pull-right" ref={input => this.weight = input} placeholder="Trọng số của mục tiêu" name="weight" />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-success" onClick={(event) => this.editTargetKPiPersonal(event, target._id)}>Lưu thay đổi</button>
                            <button type="cancel" className="btn btn-primary" data-dismiss="modal" onClick={()=>this.handleCloseModal(target._id)}>Hủy bỏ</button>
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
    getParentTarget: createUnitKpiActions.getCurrentKPIUnit,
    editTargetPersonal: createKpiActions.editTargetKPIPersonal
};
const connectedModalEditTargetKPIPersonal = connect(mapState, actionCreators)(ModalEditTargetKPIPersonal);
export { connectedModalEditTargetKPIPersonal as ModalEditTargetKPIPersonal };