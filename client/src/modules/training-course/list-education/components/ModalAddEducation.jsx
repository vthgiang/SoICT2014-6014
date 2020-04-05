import React, { Component } from 'react';
import { connect } from 'react-redux';
import { EducationActions } from '../redux/actions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class ModalAddEducation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newEducation: {
            }
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
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

    notifysuccess = (message) => toast(message);
    notifyerror = (message) => toast.error(message);
    notifywarning = (message) => toast.warning(message);
    handleChange(event) {
        const { name, value } = event.target;
        const { newEducation } = this.state;
        this.setState({
            newEducation: {
                ...newEducation,
                [name]: value
            }
        });
    }

    handleCloseModal = () => {
        this.setState({
            newEducation: {
            }
        });
        document.getElementById("add-education").reset();
        window.$(`#modal-addEducation`).modal("hide");
    }

    handleSubmit(event) {
        var { newEducation } = this.state;
        let select1 = this.refs.positionEducation;
        let positionEducation = [].filter.call(select1.options, o => o.selected).map(o => o.value);
        let select2 = this.refs.unitEducation;
        let unitEducation = [].filter.call(select2.options, o => o.selected).map(o => o.value);
        if (!newEducation.numberEducation) {
            this.notifyerror("Bạn chưa nhập mã chương trình đào tạo");
        } else if (!newEducation.nameEducation) {
            this.notifyerror("Bạn chưa nhập tên chương trình đào tạo");
        } else if (unitEducation.length <= 0) {
            this.notifyerror("Bạn chưa nhập đơn vị được áp dụng");
        } else if (positionEducation.length <= 0) {
            this.notifyerror("Bạn chưa nhập chức vụ được áp dụng");
        } else {
            const formData = new FormData();
            formData.append('numberEducation', newEducation.numberEducation);
            formData.append('nameEducation', newEducation.nameEducation);
            formData.append('unitEducation', []);
            formData.append('positionEducation', []);
            this.props.addNewEducation({ ...this.state.newEducation, unitEducation, positionEducation });
            this.setState({
                newEducation: {
                }
            })
            window.$(`#modal-addEducation`).modal("hide");
        }

    }
    render() {
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
            <div className="modal fade" id="modal-addEducation" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={() => this.handleCloseModal()}>
                                <span aria-hidden="true">×</span></button>
                            <h4 style={{textAlign:"center"}} className="modal-title">Thêm chương trình đào tạo</h4>
                        </div>
                        <div className="modal-body">
                            {/* /.box-header */}
                            <div className="box-body">
                                <form id="add-education">
                                    <div className="col-md-12">
                                        <div className="checkbox" style={{ marginTop: 0 }}>
                                            <label style={{ paddingLeft: 0 }}>
                                                (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="numberEducation">Mã chương trình đào tạo:<span className="text-red">&#42;</span></label>
                                            <input type="text" className="form-control" name="numberEducation" defaultValue="" onChange={this.handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="nameEducation">Tên chương trình đào tạo:<span className="text-red">&#42;</span></label>
                                            <input type="text" className="form-control" name="nameEducation" onChange={this.handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Áp dụng cho đơn vị:</label>
                                            <select
                                                id="tree-select2"
                                                name="unitEducation"
                                                className="form-control select2"
                                                multiple="multiple"
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
                                                //onChange={this.inputChange}
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
                                </form>
                            </div>
                            {/* /.box-body */}
                        </div>
                        <div className="modal-footer">
                            <button style={{ marginRight: 45 }} type="button" className="btn btn-default pull-right" onClick={() => this.handleCloseModal()}>Đóng</button>
                            <button style={{ marginRight: 15 }} type="button" title="Thêm mới chương trình đào tạo" className="btn btn-success pull-right" onClick={this.handleSubmit}>Thêm mới</button>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
};
function mapState(state) {
    const { education, department } = state;
    return { education, department };
};

const actionCreators = {
    addNewEducation: EducationActions.createNewEducation,
};

const connectedAddEducation = connect(mapState, actionCreators)(ModalAddEducation);
export { connectedAddEducation as ModalAddEducation };