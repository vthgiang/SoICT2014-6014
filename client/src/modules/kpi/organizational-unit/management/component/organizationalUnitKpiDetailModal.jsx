import React, { Component } from 'react';
import { connect } from 'react-redux';
import { managerActions } from '../redux/actions';

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
        await this.setState(state => {
            return {
                ...state,
                content: id
            }
        })
        this.props.getChildTarget(id);
    }
    render() {
        var currentKPI;
        const { managerKpiUnit, kpiunit } = this.props;
        if (managerKpiUnit.currentKPI) currentKPI = managerKpiUnit.currentKPI;
        return (
            <div className="modal modal-full fade" id={"dataResultTask" + this.props.kpiunit._id} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog-full modal-tasktemplate">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header" style={{ textAlign: "center", background: "#605ca8", color: "white" }}>
                            <button type="button" className="close" data-dismiss="modal">
                                <span  classname="modal-full" style={{color:"#ffffff"}}>×</span>
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
                                        {typeof kpiunit !== 'undefined' && kpiunit !== null && kpiunit.listtarget.map((item, index) =>
                                            <a href="#abc" style={{ color: "black" }} onClick={() => this.handleChangeContent(item._id)} className="list-group-item" key={index}>
                                                {item.name}
                                                <span className="badge">{15 + index}</span>
                                            </a>)}
                                    </div>
                                </div>
                            </div>
                            <div className="right-modal">
                                {
                                    currentKPI && currentKPI.listtarget.map(item => {
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
                                                            <th style={{ width: "20px" }}>Stt</th>
                                                            <th>Tên mục tiêu</th>
                                                            <th style={{ width: "108px" }}>Người tạo</th>
                                                            <th>Đơn vị</th>
                                                            <th>Tiêu chí đánh giá</th>
                                                            <th>Kết quả đánh giá</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>1</td>
                                                            <td>Hoàn thành quy trình kiểm thử</td>
                                                            <td>Lê Thị Phương</td>
                                                            <td>Phòng đảm bảo chất lượng</td>
                                                            <td>Các công việc theo mục tiêu đều đạt yêu cầu đầu ra</td>
                                                            <td>0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>2</td>
                                                            <td>Hoàn thành quy trình kiểm thử</td>
                                                            <td>Nguyễn Văn Hải</td>
                                                            <td>Phòng đảm bảo chất lượng</td>
                                                            <td>Các công việc theo mục tiêu đều đạt yêu cầu đầu ra</td>
                                                            <td>0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>3</td>
                                                            <td>Hoàn thành quy trình kiểm thử</td>
                                                            <td>Nguyễn Văn Hải</td>
                                                            <td>Phòng đảm bảo chất lượng</td>
                                                            <td>Các công việc theo mục tiêu đều đạt yêu cầu đầu ra</td>
                                                            <td>0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>5</td>
                                                            <td>Hoàn thành quy trình kiểm thử</td>
                                                            <td>Nguyễn Văn Hải</td>
                                                            <td>Phòng đảm bảo chất lượng</td>
                                                            <td>Các công việc theo mục tiêu đều đạt yêu cầu đầu ra</td>
                                                            <td>0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>6</td>
                                                            <td>Hoàn thành quy trình kiểm thử</td>
                                                            <td>Nguyễn Văn Hải</td>
                                                            <td>Phòng đảm bảo chất lượng</td>
                                                            <td>Các công việc theo mục tiêu đều đạt yêu cầu đầu ra</td>
                                                            <td>0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>7</td>
                                                            <td>Hoàn thành quy trình kiểm thử</td>
                                                            <td>Nguyễn Văn Hải</td>
                                                            <td>Phòng đảm bảo chất lượng</td>
                                                            <td>Các công việc theo mục tiêu đều đạt yêu cầu đầu ra</td>
                                                            <td>0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>8</td>
                                                            <td>Hoàn thành quy trình kiểm thử</td>
                                                            <td>Nguyễn Văn Hải</td>
                                                            <td>Phòng đảm bảo chất lượng</td>
                                                            <td>Các công việc theo mục tiêu đều đạt yêu cầu đầu ra</td>
                                                            <td>0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>9</td>
                                                            <td>Hoàn thành quy trình kiểm thử</td>
                                                            <td>Nguyễn Văn Hải</td>
                                                            <td>Phòng đảm bảo chất lượng</td>
                                                            <td>Các công việc theo mục tiêu đều đạt yêu cầu đầu ra</td>
                                                            <td>0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>10</td>
                                                            <td>Hoàn thành quy trình kiểm thử</td>
                                                            <td>Nguyễn Văn Hải</td>
                                                            <td>Phòng đảm bảo chất lượng</td>
                                                            <td>Các công việc theo mục tiêu đều đạt yêu cầu đầu ra</td>
                                                            <td>0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>11</td>
                                                            <td>Hoàn thành quy trình kiểm thử</td>
                                                            <td>Nguyễn Văn Hải</td>
                                                            <td>Phòng đảm bảo chất lượng</td>
                                                            <td>Các công việc theo mục tiêu đều đạt yêu cầu đầu ra</td>
                                                            <td>0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>12</td>
                                                            <td>Hoàn thành quy trình kiểm thử</td>
                                                            <td>Nguyễn Văn Hải</td>
                                                            <td>Phòng đảm bảo chất lượng</td>
                                                            <td>Các công việc theo mục tiêu đều đạt yêu cầu đầu ra</td>
                                                            <td>0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>13</td>
                                                            <td>Hoàn thành quy trình kiểm thử</td>
                                                            <td>Nguyễn Văn Hải</td>
                                                            <td>Phòng đảm bảo chất lượng</td>
                                                            <td>Các công việc theo mục tiêu đều đạt yêu cầu đầu ra</td>
                                                            <td>0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>14</td>
                                                            <td>Hoàn thành quy trình kiểm thử</td>
                                                            <td>Nguyễn Văn Hải</td>
                                                            <td>Phòng đảm bảo chất lượng</td>
                                                            <td>Các công việc theo mục tiêu đều đạt yêu cầu đầu ra</td>
                                                            <td>0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>15</td>
                                                            <td>Hoàn thành quy trình kiểm thử</td>
                                                            <td>Nguyễn Văn Hải</td>
                                                            <td>Phòng đảm bảo chất lượng</td>
                                                            <td>Các công việc theo mục tiêu đều đạt yêu cầu đầu ra</td>
                                                            <td>0</td>
                                                        </tr>
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
    const { managerKpiUnit } = state;
    return { managerKpiUnit };
}

const actionCreators = {
    getCurrentKPIUnit: managerActions.getCurrentKPIUnit,
    getChildTarget: managerActions.getChildTargetOfCurrentTarget
};
const connectedModalDetailKPI = connect(mapState, actionCreators)(ModalDetailKPI);
export { connectedModalDetailKPI as ModalDetailKPI };