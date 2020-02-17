import React, { Component } from 'react';
import './department.css';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { destroy } from '../redux/actions';
import Swal from 'sweetalert2';
import DepartmentCreateForm from './DepartmentCreateForm';

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
        return ( 
            <React.Fragment>
                <div className="pull-left">
                    <i className="btn btn-sm btn-default fa fa-plus" onClick={ this.zoomIn }></i>
                    <i className="btn btn-sm btn-default fa fa-minus" onClick={ this.zoomOut }></i>
                </div>
                <div className="pull-right">
                    <DepartmentCreateForm />
                </div>
                
                {
                    department.list.length > 0 &&
                    <React.Fragment >
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 item-container">
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
                                    this.departmentId.current !== null ?
                                    this.departmentId.current.value :
                                    department.list[0]._id
                                }`}
                            ><i className="fa fa-search"></i></a>
                        </div>
                    </React.Fragment>
                }
                
                <div className="tf-tree example" style={{ textAlign: 'center', fontSize: this.state.zoom, marginTop: '50px'}}>
                    <ul>
                        {tree !== null && this.displayTreeView(tree[0], translate)}
                    </ul>
                </div>
            </React.Fragment>
         );
    }

    
    deleteDepartment = (departmentId, departmentName, deleteConfirm, no) =>{
        Swal.fire({
            title: deleteConfirm,
            html: `<h4>${departmentName}</h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: no, //Không
            confirmButtonText: deleteConfirm //Xóa
        }).then((result) => {
            if (result.value) {
                this.props.destroy(departmentId) //xóa user với tham số truyền vào là id của user
            }
        })
    }

    zoomIn = () => {
        if(this.state.zoom < 25)
        this.setState({ zoom : this.state.zoom + 1});
    }

    zoomOut = () => {
        if(this.state.zoom > 16)
            this.setState({ zoom : this.state.zoom - 1});
    }

    showNodeContent = (data, translate) => {
        return (
            <div
                id={`department-${data.id}`} 
                className="tf-nc pull-left w3-card-4 department" 
                title={ data.name }
                style={{ 
                    width: '150px',
                    height: 'auto',
                    textAlign: 'center'
                }}
            >
                <p style={{ marginBottom: '10px', fontSize: '12px' }}>{ data.name }</p>
                <a 
                    className="btn pull-right btn-create" 
                    data-toggle="modal" 
                    href={`#modal-create-department-with-parent-${data.id}`}
                    title={`Thêm phòng ban mới có phòng ban cha là ${data.name}`}
                    style={{
                        width: '26px'
                    }}
                ><i className="fa fa-plus"></i></a>
                <a 
                    className="btn pull-right btn-edit" 
                    data-toggle="modal" 
                    href={`#department-detail-${data.id}`}
                    title="Chi tiết"
                    style={{
                        width: '26px'
                    }}
                ><i className="fa fa-pencil"></i></a>
                <a 
                    href="#abc"
                    className="btn pull-right btn-delete" 
                    data-toggle="modal" 
                    onClick={() => this.deleteDepartment(
                        data.id, 
                        data.name, 
                        translate('delete'),
                        translate('question.no')
                    )}
                    title="Xóa phòng ban"
                    style={{
                        width: '26px'
                    }}
                ><i className="fa fa-trash"></i></a>
            </div>
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

    componentDidMount(){
        let script = document.createElement('script');
        script.src = '/lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
}
 
const mapState = state => state;
const getState = (dispatch, props) => {
    return {
        destroy: (id) => {
            dispatch(destroy(id));
        },
    }
}
 
export default connect(mapState, getState) (withTranslate(DepartmentTreeView)); 