import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createUnitKpiActions } from '../../../kpi-unit/kpi-unit-create/redux/actions';
import { createKpiActions } from "../redux/actions";

class ModalAddTargetKPIPersonal extends Component {
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
    // function: create new target of personal kpi
    onAddItem = async (event) => {
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
            window.$('body').css('padding-right',"0px");
        }
    }
    render() {
        var parentTargets;
        const { newTarget, adding } = this.state;
        const { createKpiUnit } = this.props;
        if (createKpiUnit.currentKPI) parentTargets = createKpiUnit.currentKPI.listtarget;
        return (
            <div className="modal fade" id="addNewTargetKPIPersonal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                            <h3 className="modal-title">Thêm mục tiêu KPI cá nhân</h3>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label>Tên mục tiêu:</label>
                                    <div className={'form-group has-feedback' + (adding && !newTarget.name ? ' has-error' : '')}>
                                        <input type="text" className="form-control" ref={input => this.name = input} placeholder="Tên mục tiêu" name="name" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Thuộc mục tiêu:</label>
                                    <div className={'form-group has-feedback'}>
{/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------                                         */}
                                        {(typeof parentTargets !== 'undefined' && parentTargets.length !== 0) && //giờ đang có parentTargets.length === 0
                                        <select className="form-control" id="selparent" name="parent" ref={input => this.parent = input}>
                                            {parentTargets.filter(item => item.default === 0).map(x => {
                                                return <option key={x._id} value={x._id}>{x.name}</option>
                                            })}
                                        </select>}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Mô tả tiêu chí đánh giá:</label>
                                    <div className={'form-group has-feedback' + (adding && !newTarget.criteria ? ' has-error' : '')}>
                                        <textarea type="text" className='form-control' ref={input => this.criteria = input} placeholder="Đánh giá mức độ hoàn thành dựa trên tiêu chí nào?" name="criteria" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Trọng số:</label>
                                    <div className={'form-group has-feedback' + (adding && !newTarget.weight ? ' has-error' : '')} id="inputname">
                                        <input type="number" min="0" max="100" className="form-control pull-right" ref={input => this.weight = input} placeholder="Trọng số của mục tiêu" name="weight" />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-success" onClick={(event) => this.onAddItem(event)}>Thêm mục tiêu</button>
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
    getParentTarget: createUnitKpiActions.getCurrentKPIUnit,
    addNewTargetPersonal: createKpiActions.addNewTargetPersonal
};
const connectedModalAddTargetKPIPersonal = connect(mapState, actionCreators)(ModalAddTargetKPIPersonal);
export { connectedModalAddTargetKPIPersonal as ModalAddTargetKPIPersonal };
