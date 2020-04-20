import React, { Component } from 'react';
import './organizationalUnit.css';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DepartmentActions } from '../redux/actions';
import DepartmentCreateForm from './organizationalUnitCreateForm';
import DepartmentEditForm from './organizationalUnitEditForm';
import {DeleteNotification, ButtonModal} from '../../../../common-components';
import DepartmentCreateWithParent from './organizationalUnitCreateWithParent';

class DepartmentTreeView extends Component {
    constructor(props) {
        super(props);
        this.departmentId = React.createRef();
        this.state = { 
            zoom: 16
        }
        this.displayTreeView = this.displayTreeView.bind(this);
        this.showNodeContent = this.showNodeContent.bind(this);
        this.zoomIn = this.zoomIn.bind(this);
        this.zoomOut = this.zoomOut.bind(this);
    } 

    render() { 
        const { tree } = this.props.department;
        const { translate, department } = this.props;
        const {currentRow} = this.state;
        return ( 
            <React.Fragment>
                <div className="pull-right">
                    <DepartmentCreateForm />
                </div>

                {/* Kiểm tra có dữ liệu về các đơn vị, phòng ban hay không */}
                {
                    department.list.length > 0 ?
                    <React.Fragment >
                        <div className="pull-left">
                            <i className="btn btn-sm btn-default fa fa-plus" onClick={ this.zoomIn } title={translate('manage_department.zoom_in')}></i>
                            <i className="btn btn-sm btn-default fa fa-minus" onClick={ this.zoomOut } title={translate('manage_department.zoom_out')}></i>
                        </div>
                        {/* <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 item-container">
                            <select 
                                className="select2"
                                ref="departmentId"
                                defaultValue={department.list[0]._id}
                                style={{
                                    backgroundColor: "#ECF0F5",
                                    border: '1px solid lightgray',
                                    width: '50%'
                            }}>
                                {
                                    department.list.map( department => <option key={department._id} value={department._id}>{department.name}</option>)
                                }
                            </select>
                            <a 
                                className="btn btn-success" 
                                href={`#department-${
                                    this.refs.departmentId !== undefined ?
                                    this.refs.departmentId.value :
                                    department.list[0]._id
                                }`}
                                title={translate('form.search')}
                            >{translate('form.search')}</a>
                        </div> */}
                    </React.Fragment>
                    : department.isLoading ?
                    <p className="text-center">{translate('confirm.loading')}</p>:
                    <p className="text-center">{translate('confirm.no_data')}</p>
            }

            {/* Hiển thị cơ cấu tổ chức của công ty */}
            <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    {
                        tree !== null &&
                        tree.map((tree,index) => 
                            <div key={index} className="tf-tree example" style={{ textAlign: 'left', fontSize: this.state.zoom, marginTop: '50px'}}>
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
                currentRow !== undefined &&
                <React.Fragment>
                    <DepartmentCreateWithParent departmentParent={currentRow.id}/>
                    <DepartmentEditForm
                        departmentId={currentRow.id}
                        departmentName={currentRow.name}
                        departmentDescription={currentRow.description}
                        departmentParent={currentRow.parent_id}
                        departmentDean={currentRow.dean}
                        departmentViceDean={currentRow.vice_dean}
                        departmentEmployee={currentRow.employee}
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

    handleCreateWithParent = async(department) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: department
            }
        });

        window.$('#modal-create-department-with-parent').modal('show');
    }

    toggleSetting = (id) => {
        if(document.getElementById(id).style.display === 'none')
            document.getElementById(id).style.display='block';
        else document.getElementById(id).style.display='none';
    }

    zoomIn = () => {
        if(this.state.zoom < 72)
        this.setState({ zoom : this.state.zoom + 1});
    }

    zoomOut = () => {
        if(this.state.zoom > 0)
            this.setState({ zoom : this.state.zoom - 1});
    }

    showNodeContent = (data, translate) => {
        return (
            <React.Fragment>
                <div
                    id={`department-${data.id}`} 
                    className="tf-nc w3-card-4 department" 
                    title={ data.name }
                >
                    <button style={{border: 'none', backgroundColor: 'white'}} onClick={() => this.toggleSetting(`department-setting-${data.id}`)}><i className="fa fa-gear"></i></button>
                    {` ${data.name} `}
                    <div id={`department-setting-${data.id}`} className="row" style={{display: 'none', marginTop: '8px'}}>
                        <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <a className="edit text-green" onClick={() => this.handleCreateWithParent(data)} title={translate('manage_department.add_title')}><i className="material-icons">add</i></a>
                        </div>
                        <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                            <a className="edit text-yellow" onClick={() => this.handleEdit(data)} title={translate('manage_department.edit')}><i className="material-icons">edit</i></a>
                        </div>
                        <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
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
                </div>
            </React.Fragment>
        )
    }

    displayTreeView = (data, translate) => {
        if(data !== undefined){
            if(typeof(data.children) === 'undefined') 
                return (
                    <li key={data.id}>
                        { this.showNodeContent(data, translate) }
                    </li>
                )
            return (
                <li key={data.id}>
                    { this.showNodeContent(data, translate) }
                    <ul>
                        {
                            data.children.map( tag => this.displayTreeView(tag, translate))
                        }
                    </ul>  
                </li>
            )
        }
        else return null
    }
}
 
const mapState = state => state;
const getState = {
    destroy: DepartmentActions.destroy
}
 
export default connect(mapState, getState) (withTranslate(DepartmentTreeView)); 