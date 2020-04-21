import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ToastContainer, toast } from 'react-toastify';
import { ModalDetailEducation } from './educationProgramDetailModal';
import { ModalEditEducation } from './educationProgramEditModal';
import { ModalAddEducation } from './educationProgramAddModal';
import { EducationActions } from '../redux/actions';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { DeleteNotification, PaginateBar, DataTableSetting } from '../../../../common-components';

class ListEducation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: "All",
            department: "All",
            page: 0,
            limit: 5,
            hideColumn:[]

        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.props.getListEducation(this.state);
        this.props.getDepartment();
        let script1 = document.createElement('script');
        script1.src = 'lib/main/js/GridSelect.js';
        script1.async = true;
        script1.defer = true;
        document.body.appendChild(script1);

    }
    componentDidUpdate() {
        this.hideColumn();
    }
    hideColumn = () => {
        if (this.state.hideColumn !== undefined) {
            var hideColumn = this.state.hideColumn;
            for (var j = 0, len = hideColumn.length; j < len; j++) {
                window.$(`#education-table td:nth-child(` + hideColumn[j] + `)`).hide();
            }
        }
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
        this.setState({
            [name]: value
        });
    }

    handleSunmitSearch = () => {
        this.props.getListEducation(this.state);
    }

    setLimit = async (number, hideColumn) => {
        await this.setState({
            limit: parseInt(number),
            hideColumn: hideColumn
        });
        this.props.getListEducation(this.state);
    }

    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * (this.state.limit);
        await this.setState({
            page: parseInt(page),
        });
        this.props.getListEducation(this.state);
    }

    render() {
        var lists = this.props.education.listEducation;
        const { tree, list } = this.props.department;
        const { translate } = this.props;
        var listDepartment = list, listPosition;
        for (let n in listDepartment) {
            if (listDepartment[n]._id === this.state.department) {
                listPosition = [
                    { _id: listDepartment[n].dean._id, name: listDepartment[n].dean.name },
                    { _id: listDepartment[n].viceDean._id, name: listDepartment[n].viceDean.name },
                    { _id: listDepartment[n].employee._id, name: listDepartment[n].employee.name }
                ]
            }
        }
        var pageTotal = (this.props.education.totalList % this.state.limit === 0) ?
            parseInt(this.props.education.totalList / this.state.limit) :
            parseInt((this.props.education.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box">
                <div className="box-body qlcv">
                    <div className="form-inline">
                        <div className="form-group">
                            <h4 className="box-title">Danh sách chương trình đào tạo bắt buộc:</h4>
                        </div>
                        <button type="button" style={{ marginBottom: 15 }} className="btn btn-success pull-right" data-toggle="modal" data-target="#modal-addEducation">Thêm chương trình đào tạo</button>

                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.unit')}:</label>
                            <select className="form-control" defaultValue="All" id="tree-select" name="department" onChange={this.handleChange}>
                                <option value="All" level={1}>--Tất cả---</option>
                                {
                                    tree !== null &&
                                    tree.map((tree, index) => this.displayTreeSelect(tree, 0))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.position')}:</label>
                            <select className="form-control" defaultValue="All" name="position" onChange={this.handleChange}>
                                <option value="All">--Tất cả--</option>
                                {
                                    listPosition !== undefined &&
                                    listPosition.map((position, index) => (
                                        <option key={index} value={position._id}>{position.name}</option>
                                    ))
                                }
                            </select>
                            <button type="button" className="btn btn-success" onClick={this.handleSunmitSearch} title="Tìm kiếm" >Tìm kiếm</button>
                        </div>
                    </div>
                    <table id="education-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th title="Mã chương trình đào tạo">Mã chương trình</th>
                                <th title="Tên chương trình đào tạo">Tên chương trình</th>
                                <th>Áp dụng cho đơn vị</th>
                                <th>Áp dụng cho chức vụ</th>
                                <th style={{ width: '120px' }}>Hành động
                                <DataTableSetting
                                        tableId="education-table"
                                        columnArr={[
                                            "Mã chương trình",
                                            "Tên chương trình đào tạo",
                                            "Áp dụng cho đơn vị",
                                            "Áp dụng cho chức vụ"
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(typeof lists === 'undefined' || lists.length === 0) ? <tr><th colSpan={5 - this.state.hideColumn.length}><center> Không có dữ liệu</center></th></tr> :
                                lists.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.numberEducation}</td>
                                        <td>{x.nameEducation}</td>
                                        <td>{(typeof x.unitEducation === 'undefined' || x.unitEducation.length === 0) ? "" :
                                            x.unitEducation.map((y, indexs) => {
                                                if (indexs === 0) {
                                                    return y.name
                                                }
                                                return ", " + y.name
                                            })}
                                        </td>
                                        <td>{(typeof x.positionEducation === 'undefined' || x.positionEducation.length === 0) ? "" :
                                            x.positionEducation.map((y, indexs) => {
                                                if (indexs === 0) {
                                                    return y.name
                                                }
                                                return ", " + y.name
                                            })}
                                        </td>
                                        <td>
                                            <ModalDetailEducation data={x} />
                                            <ModalEditEducation data={x} />
                                            <DeleteNotification
                                                content={{
                                                    title: "Xoá chương trình đào tạo",
                                                    btnNo: translate('confirm.no'),
                                                    btnYes: translate('confirm.yes'),
                                                }}
                                                data={{
                                                    id: x._id,
                                                    info: x.nameEducation + " - " + x.numberEducation
                                                }}
                                                func={this.props.deleteEducation}
                                            />
                                        </td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                </div>
                <ToastContainer />
                <ModalAddEducation />
            </div>
        );
    };
};

function mapState(state) {
    const { education, department } = state;
    return { education, department };
};

const actionCreators = {
    getDepartment: DepartmentActions.get,
    getListEducation: EducationActions.getListEducation,
    deleteEducation: EducationActions.deleteEducation,
};

const connectedListEducation = connect(mapState, actionCreators)(withTranslate(ListEducation));
export { connectedListEducation as ListEducation };