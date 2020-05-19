import React, { Component } from 'react';
import { connect } from 'react-redux';
import { managerActions } from '../redux/actions';
import { createUnitKpiActions } from '../../creation/redux/actions'

class ModalDetailKPI extends Component {
    componentDidMount() {
        // get all target of unit
        this.props.getCurrentKPIUnit(localStorage.getItem('currentRole'));
    }

    constructor(props) {
        super(props);
        this.state = {
            unit: '5dcadf02f0343012f09c1193',
            content: ""
        };
    }
    handleChangeContent = async (id) => {
        console.log("id---", id);
        await this.setState(state => {
            this.props.getChildTarget(id);
            return {
                ...state,
                content: id
            }
        })
    }
    render() {
        var currentKPI, listchildtarget;
        const { createKpiUnit, kpiunit, managerKpiUnit } = this.props;
        if (createKpiUnit.currentKPI) currentKPI = createKpiUnit.currentKPI;
        if( managerKpiUnit.childtarget)listchildtarget= managerKpiUnit.childtarget;
        // if(currentKPI.childtarget)
        console.log("----------------", listchildtarget);
        return (
            <div className="modal modal-full fade" id={"dataResultTask" + this.props.kpiunit._id} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog-full modal-tasktemplate">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header" style={{ textAlign: "center", background: "#605ca8", color: "white" }}>
                            <button type="button" className="close" data-dismiss="modal">
                                <span  className="modal-full" style={{color:"#ffffff"}}>×</span>
                                {/* <span className="sr-only">Close</span> */}
                            </button>
                            <h3 className="modal-title" id="myModalLabel">Thông tin chi tiết kpi đơn vị tháng 1 năm 2020</h3>
                        </div>
                        {/* Modal Body */}
                        <div className="modal-body modal-body-perform-task" >
                            <div className="left-modal">
                                <div className="header-left-modal" style={{ fontWeight: "500", background: "slateblue", color: "white" }}>
                                    <h4>Danh sách mục tiêu</h4>
                                </div>
                                <div className="content-left-modal" id="style-1" style={{ width: "24.5%" }}>
                                    <div className="scroll-content" style={{ borderRight: "3px solid #ddd" }}>
                                        {typeof kpiunit !== 'undefined' && kpiunit !== null && kpiunit.kpis.map((item, index) =>
                                            <a href="#abc" style={{ color: "black" }} onClick={() => this.handleChangeContent(item._id)} className="list-group-item" key={index}>
                                                {item.name}
                                                <span className="badge">{15 + index}</span>
                                            </a>)}
                                    </div>
                                </div>
                            </div>
                            <div className="right-modal">
                                {
                                    currentKPI && currentKPI.kpis.map(item => {
                                        if (item._id === this.state.content) return <React.Fragment key={item._id}>
                                            <div className="header-content-right">
                                                <div className="col-sm-12" style={{ fontWeight: "500" }}>
                                                    <h4>Thông tin mục tiêu</h4>
                                                </div>
                                                <div className="col-sm-12">
                                                    <label className="col-sm-2" style={{ fontWeight: "400" }}>Tiêu chí đính giá:</label>
                                                    <label className="col-sm-10" style={{ fontWeight: "400" }}>{item.name}</label>
                                                </div>
                                                <div className="col-sm-12">
                                                    <label className="col-sm-2" style={{ fontWeight: "400" }}>Trọng số:</label>
                                                    <label className="col-sm-10" style={{ fontWeight: "400" }}>{item.weight}</label>
                                                </div>
                                                <div className="col-sm-12">
                                                    <label className="col-sm-2" style={{ fontWeight: "400" }}>Kết quả thực hiện:</label>
                                                    <label className="col-sm-10" style={{ fontWeight: "400" }}>{item.result}</label>
                                                </div>
                                            </div>
                                            <div className="body-content-right">
                                                <div className="col-sm-12" style={{ fontWeight: "500" }}>
                                                    <h4>Danh sách các mục tiêu con</h4>
                                                </div>
                                                <table id="example1" className="table table-bordered table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: "20px" }}>STT</th>
                                                            <th>Tên mục tiêu</th>
                                                            <th style={{ width: "108px" }}>Người tạo</th>
                                                            <th>Đơn vị</th>
                                                            <th>Tiêu chí đánh giá</th>
                                                            <th>Kết quả đánh giá</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {    (typeof managerKpiUnit.childtarget !== "undefined" &&  managerKpiUnit.childtarget )? 
                                                        (listchildtarget.map((item, index) => 
                                                        <tr key={index}>
                                                            <td>{index+1}</td>
                                                            <td>{item.name}</td>
                                                            <td>{item.creator.name}</td>
                                                            <td>{item.organizationalUnit.name}</td>
                                                            <td>{item.criteria}</td>
                                                            <td>{item.approvedPoint}</td>
                                                        </tr>)): <tr><td colSpan={6}>Không có dữ liệu</td></tr>
                                                        
                                                    }
                                                
                                                    </tbody>
                                                </table>
                                                <div className="footer-content-right">
                                                    <button style={{ float: "right" }}>Xuất file</button>
                                                </div>
                                            </div>
                                        </React.Fragment>;
                                        return true;
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { createKpiUnit, managerKpiUnit } = state;
    return { createKpiUnit, managerKpiUnit };
}

const actionCreators = {
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
    getChildTarget: managerActions.getChildTargetOfCurrentTarget
};
const connectedModalDetailKPI = connect(mapState, actionCreators)(ModalDetailKPI);
export { connectedModalDetailKPI as ModalDetailKPI };