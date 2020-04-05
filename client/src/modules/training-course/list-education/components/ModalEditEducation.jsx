import React, { Component } from 'react';
import { connect } from 'react-redux';
import { EducationActions } from '../redux/actions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ModalEditEducation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            infoEducation: { ...this.props.data }
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    notifysuccess = (message) => toast(message);
    notifyerror = (message) => toast.error(message);
    notifywarning = (message) => toast.warning(message);
    componentDidMount() {
        let script = document.createElement('script');
        script.src = '/lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    displayTreeSelect = (data, i) => {
        i = i + 1;
        if (data !== undefined) {
            if (typeof (data.children) === 'undefined') {
                return (
                    <option key={data.id} data-level={i} value={data.id}>{data.name}</option>
                )
            } else {
                return (
                    <React.Fragment key={data.id}>
                        <option data-level={i} value={data.id} style={{ fontWeight: "bold" }}>{data.name}</option>
                        {
                            data.children.map(tag => this.displayTreeSelect(tag, i))
                        }
                    </React.Fragment>
                )
            }

        }
        else return null
    }

    handleChange(event) {
        const { name, value } = event.target;
        const { infoEducation } = this.state;
        this.setState({
            infoEducation: {
                ...infoEducation,
                [name]: value
            }
        });
    }

    handleSubmit(event) {
        var { infoEducation } = this.state;
        let select1 = this.refs.positionEducation;
        let positionEducation = [].filter.call(select1.options, o => o.selected).map(o => o.value);
        let select2 = this.refs.unitEducation;
        let unitEducation = [].filter.call(select2.options, o => o.selected).map(o => o.value);
        if (!infoEducation.nameEducation) {
            this.notifyerror("Bạn chưa nhập tên chương trình đào tạo");
        } else if (unitEducation.length > 0 && positionEducation.length <= 0) {
            this.notifyerror("Bạn chưa nhập chức vụ được áp dụng");
        } else {
            this.props.updateEducation(this.props.data._id, { ...this.state.infoEducation, positionEducation, unitEducation });
            window.$(`#modal-editEducation-${this.props.data.numberEducation}`).modal("hide");
        }
    }

    render() {
        var { data } = this.props;
        const { tree, list } = this.props.department;
        const { translate } = this.props;
        var listDepartment = list, listPosition = [];
        for (let n in listDepartment) {
            let position = [{ _id: listDepartment[n].dean._id, name: listDepartment[n].dean.name },
            { _id: listDepartment[n].vice_dean._id, name: listDepartment[n].vice_dean.name },
            { _id: listDepartment[n].employee._id, name: listDepartment[n].employee.name }]
            listPosition = listPosition.concat(position)
        }
        return (
            <div style={{ display: "inline" }}>
                <a href={`#modal-editEducation-${data.numberEducation}`} className="edit" title="Chỉnh sửa chương trình đào tạo" data-toggle="modal"><i className="material-icons"></i></a>
                <div className="modal fade" id={`modal-editEducation-${data.numberEducation}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 style={{textAlign:"center"}} className="modal-title">Chỉnh sửa chương trình đào tạo: {data.nameEducation + "-" + data.numberEducation}</h4>
                            </div>
                            <div className="modal-body">
                                {/* /.box-header */}
                                <div className="box-body">
                                    <div className="col-md-12">
                                        <div className="checkbox" style={{ marginTop: 0 }}>
                                            <label style={{ paddingLeft: 0 }}>
                                                (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="numberEducation">Mã chương trình đào tạo:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" defaultValue={data.numberEducation} name="numberEducation" disabled />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="nameEducation">Tên chương trình đào tạo:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" defaultValue={data.nameEducation} name="nameEducation" onChange={this.handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Áp dụng cho đơn vị:</label>
                                            <select
                                                name="unitEducation"
                                                className="form-control select2 tree-select"
                                                multiple="multiple"
                                                value={data.unitEducation.map(unit=>unit._id)}
                                                onChange={this.handleChange}
                                                style={{ width: '100%' }}
                                                ref="unitEducation"
                                            >
                                                {
                                                    tree !== null &&
                                                    tree.map((tree, index) => this.displayTreeSelect(tree, 0))
                                                }
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Áp dụng cho chức vụ:</label>
                                            <select
                                                name="positionEducation"
                                                className="form-control select2"
                                                multiple="multiple"
                                                value={data.positionEducation.map(position=>position._id)}
                                                onChange={this.handleChange}
                                                style={{ width: '100%' }}
                                                ref="positionEducation"
                                            >
                                                {
                                                    listPosition !== undefined &&
                                                    listPosition.map((position, index) => (
                                                        <option key={index} value={position._id}>{position.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {/* /.box-body */}
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 45 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                                <button style={{ marginRight: 15 }} type="button" title="Lưu lại các thay đổi" className="btn btn-success pull-right" onClick={this.handleSubmit}>Lưu thay đổi</button>
                            </div>
                        </div>
                    </div>
                </div >
            </div>
        );
    }
};
function mapState(state) {
    const { education, department } = state;
    return { education, department };
};

const actionCreators = {
    updateEducation: EducationActions.updateEducation,
};

const connectedEditEducation = connect(mapState, actionCreators)(ModalEditEducation);
export { connectedEditEducation as ModalEditEducation };