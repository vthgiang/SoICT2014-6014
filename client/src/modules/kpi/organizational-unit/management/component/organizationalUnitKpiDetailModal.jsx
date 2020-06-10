import React, { Component } from 'react';
import { connect } from 'react-redux';
import { managerActions } from '../redux/actions';
import { createUnitKpiActions } from '../../creation/redux/actions';
import { DialogModal } from '../../../../../common-components/index';


class ModalDetailKPI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unit: '5dcadf02f0343012f09c1193',
            content: ""
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                idkpiunit: nextProps.idkpiunit,
                date: nextProps.date
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.id !== this.state.id) {
            this.props.getChildTarget(nextProps.idkpiunit, nextProps.date);
            return false;
        }
        return true;
    }
    componentDidMount() {

    }

    handleChangeContent = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                content: id
            }
        })
    }
    formatMonth(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }
    render() {
        var currentKPI, listchildtarget;
        const { managerKpiUnit } = this.props;
        if (managerKpiUnit.childtarget) {
            // console.log("=======================")
            listchildtarget = managerKpiUnit.childtarget;
        }
        //  console.log("++++++++++++", this.props.kpiunit._id);

        return (
            <DialogModal
                modalID={`dataResultTask`}
                title={`Thông tin chi tiết kpi đơn vị tháng ${this.formatMonth(this.props.date)}`}
                hasSaveButton={false}
                size={100}>

                <div className="col-xs-12 col-sm-4">
                    <div className="box box-solid" style={{border: "1px solid #ecf0f6", borderBottom: "none"}}>
                        <div className="box-header with-border">
                            <h3 className="box-title" style={{fontWeight: 800}}>Danh sách KPI đơn vị</h3>
                        </div>
                        <div className="box-body no-padding">
                            <ul className="nav nav-pills nav-stacked">
                                {typeof listchildtarget !== 'undefined' && listchildtarget !== null && 
                                listchildtarget.map((item, index) =>
                                    <li key={index} className={this.state.content===item._id && "active"}>
                                        <a href="#abc" onClick={() => this.handleChangeContent(item._id)}>
                                            {item.name}
                                            <span className="label label-primary pull-right">{item.arrtarget.length}</span>
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>


                <div className="col-xs-12 col-sm-8">
                    {
                        listchildtarget && listchildtarget.map(item => {
                            if (item._id === this.state.content) return <React.Fragment key={item._id}>
                                <h4>{`Thông tin KPI "${item.name}"`}</h4>
                                <div style={{lineHeight: 2}}>
                                    <div>
                                        <label>Tiêu chí:</label>
                                        <span> {item.criteria}</span>
                                    </div>
                                    
                                    <div>
                                        <label>Trọng số:</label>
                                        <span> {item.weight}/100</span>
                                    </div>

                                    <div>
                                        <label>Kết quả thực hiện (Tự động - Tự đánh giá - Người phê duyệt đánh giá):</label>
                                        <span> {item.approvedPoint === null ? "Chưa đánh giá" : item.automaticPoint + "-" + item.employeePoint + "-" + item.approvedPoint}</span>
                                    </div>
                                </div>
                                <br/>
                                <br/>

                                
                                <h4>Danh sách các KPI con</h4>
                                <table id="example1" className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th style={{width:"35px"}} className="col-fixed">STT</th>
                                            <th>Tên mục tiêu</th>
                                            <th style={{ width: "108px" }}>Người tạo</th>
                                            <th>Đơn vị</th>
                                            <th>Tiêu chí đánh giá</th>
                                            <th>Kết quả đánh giá</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(typeof item !== "undefined" && item.arrtarget) ?
                                            (item.arrtarget.map((data, index) =>

                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{data.target.name}</td>
                                                    <td>{data.creator.name}</td>
                                                    <td>{data.organizationalUnit.name}</td>
                                                    <td>{data.target.criteria}</td>
                                                    <td>{data.target.approvedPoint}</td>
                                                </tr>)) : <tr><td colSpan={6}>Không có dữ liệu</td></tr>

                                        }

                                    </tbody>
                                </table>
                                <div>
                                    <button className="btn btn-primary pull-right">Xuất file</button>
                                </div>
                            </React.Fragment>;
                            return true;
                        })
                    }
                </div>
            
            </DialogModal>
            
                       

        )}
}

function mapState(state) {
    const { managerKpiUnit } = state;
    return { managerKpiUnit };
}

const actionCreators = {
    getChildTarget: managerActions.getChildTargetOfCurrentTarget
};
const connectedModalDetailKPI = connect(mapState, actionCreators)(ModalDetailKPI);
export { connectedModalDetailKPI as ModalDetailKPI };