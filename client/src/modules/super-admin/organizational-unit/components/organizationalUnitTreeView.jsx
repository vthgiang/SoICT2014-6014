import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import './organizationalUnit.css';

import { DeleteNotification } from '../../../../common-components';

import { DepartmentActions } from '../redux/actions';

import DepartmentCreateForm from './organizationalUnitCreateForm';
import DepartmentEditForm from './organizationalUnitEditForm';
import DepartmentCreateWithParent from './organizationalUnitCreateWithParent';


class DepartmentTreeView extends Component {
    constructor(props) {
        super(props);

        this.departmentId = React.createRef();

        this.state = {
            zoom: 16,
        }
    }

    render() {
        const { tree } = this.props.department;
        const { translate, department } = this.props;
        const { currentRow } = this.state;

        return (
            <React.Fragment>
                {/* Button thêm mới một phòng ban */}
                <div className="pull-right">
                    <DepartmentCreateForm />
                </div>

                {/* Kiểm tra có dữ liệu về các đơn vị, phòng ban hay không */}
                {
                    department.list && department.list.length > 0 ?
                        <React.Fragment >
                            <div className="pull-left">
                                <i className="btn btn-sm btn-default fa fa-plus" onClick={this.zoomIn} title={translate('manage_department.zoom_in')}></i>
                                <i className="btn btn-sm btn-default fa fa-minus" onClick={this.zoomOut} title={translate('manage_department.zoom_out')}></i>
                            </div>
                        </React.Fragment>
                        : department.isLoading ?
                            <p className="text-center">{translate('confirm.loading')}</p> :
                            <p className="text-center">{translate('confirm.no_data')}</p>
                }

                {/* Hiển thị cơ cấu tổ chức của công ty */}
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        {
                            tree &&
                            tree.map((tree, index) =>
                                <div key={index} className="tf-tree example" style={{ textAlign: 'left', fontSize: this.state.zoom, marginTop: '50px' }}>
                                    <ul>
                                        {
                                            this.displayTreeView(tree, translate)
                                        }
                                    </ul>
                                </div>
                            )
                        }
                    </div>
                </div>

                {/* Các form edit và thêm mới một phòng ban mới với phòng ban cha được chọn */}
                {
                    currentRow &&
                    <React.Fragment>
                        <DepartmentCreateWithParent
                            departmentId={currentRow.id}
                            departmentParent={currentRow.id}
                        />
                        <DepartmentEditForm
                            departmentId={currentRow.id}
                            departmentName={currentRow.name}
                            departmentDescription={currentRow.description}
                            departmentParent={currentRow.parent_id}
                            deans={currentRow.deans}
                            viceDeans={currentRow.viceDeans}
                            employees={currentRow.employees}
                        />
                    </React.Fragment>
                }
            </React.Fragment>
        );
    }

    // Cac ham xu ly du lieu voi modal
    handleEdit = async (department) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: department
            }
        });

        window.$('#modal-edit-department').modal('show');
    }

    handleCreateWithParent = async (department) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: department
            }
        });

        window.$('#modal-create-department-with-parent').modal('show');
    }

    toggleSetting = (id) => {
        if (document.getElementById(id).style.display === 'none') {
            document.getElementById(id).style.display = 'block';
        } else {
            document.getElementById(id).style.display = 'none';
        }
    }

    zoomIn = () => {
        if (this.state.zoom < 72) {
            this.setState({ zoom: this.state.zoom + 1 });
        }
    }

    zoomOut = () => {
        if (this.state.zoom > 0) {
            this.setState({ zoom: this.state.zoom - 1 });
        }
    }

    showNodeContent = (data, translate) => {
        return (
            <div className="tf-nc w3-card-4 department" style={{ borderTop: '2px solid gray' }}>
                <div id={`department-${data.id}`} title={data.name}>
                    <a href="#abc" title="Ẩn/hiện điều khiển" style={{ border: 'none', backgroundColor: 'transparent' }} onClick={() => this.toggleSetting(`department-setting-${data.id}`)}><i className="fa fa-gear"></i></a>
                    {` ${data.name} `}
                </div>
                <div id={`department-setting-${data.id}`} className="pull-right" style={{
                    display: 'none', marginTop: '8px',
                    borderRadius: '3px',
                    border: 'none',
                    padding: '4px 2px 0px 2px',
                    backgroundColor: '#ECF0F5'
                }}>
                    <a href="#setting-organizationalUnit" className="edit text-green" onClick={() => this.handleCreateWithParent(data)} title={translate('manage_department.add_title')}><i className="material-icons">add</i></a>
                    <a href="#setting-organizationalUnit" className="edit text-yellow" onClick={() => this.handleEdit(data)} title={translate('manage_department.edit_title')}><i className="material-icons">edit</i></a>
                    <DeleteNotification
                        content={translate('manage_department.delete')}
                        data={{
                            id: data.id,
                            info: data.name
                        }}
                        func={this.props.destroy}
                    />
                </div>
            </div>
        )
    }

    displayTreeView = (data, translate) => {
        if (data) {
            if (!data.children) {
                return (
                    <li key={data.id}>
                        {this.showNodeContent(data, translate)}
                    </li>
                )
            }

            return (
                <li key={data.id}>
                    {this.showNodeContent(data, translate)}
                    <ul>
                        {
                            data.children.map(tag => this.displayTreeView(tag, translate))
                        }
                    </ul>
                </li>
            )
        } else {
            return null
        }
    }

}

function mapState(state) {
    const { department } = state;
    return { department };
}

const getState = {
    destroy: DepartmentActions.destroy
}

export default connect(mapState, getState)(withTranslate(DepartmentTreeView)); 