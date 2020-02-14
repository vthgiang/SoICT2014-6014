import React, { Component } from 'react';
// import './css/TreeView.css';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { destroy } from '../redux/actions';
import Swal from 'sweetalert2';

class DepartmentTreeView extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            zoom: 13
        }
        this.displayTreeView = this.displayTreeView.bind(this);
        this.showNodeContent = this.showNodeContent.bind(this);
        this.zoomIn = this.zoomIn.bind(this);
        this.zoomOut = this.zoomOut.bind(this);
        // this.configName = this.configName.bind(this);
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

    // configName = (name) => {
    //     const room = name.slice(0, 5);
    //     if(room === 'Phòng' || room  === 'phòng' || room === 'Phong' || room === "phong"){
    //         const newName = name.slice(5, 20);
    //         return "P."+ newName + "...";
    //     }
    //     return "P." + name.slice(0, 7) + "...";
    // }

    zoomIn = () => {
        if(this.state.zoom < 30)
        this.setState({ zoom : this.state.zoom + 1});
    }

    zoomOut = () => {
        if(this.state.zoom > 13)
            this.setState({ zoom : this.state.zoom - 1});
    }

    showNodeContent = (data, translate) => {
        return (
            <span 
                className="tf-nc pull-left" 
                title={ data.name }
                style={{ 
                    borderRadius: '10px',
                    width: '150px'
                }}
            >
                <p style={{ marginBottom: '10px', fontSize: '12px' }}>{ data.name }</p>
                <a 
                    className="btn pull-right" 
                    data-toggle="modal" 
                    href={`#modal-create-department-with-parent-${data.id}`}
                    title={`Thêm phòng ban mới có phòng ban cha là ${data.name}`}
                    style={{
                        borderRadius: '5px',
                        border: '1px solid lightgray',
                        width: '26px',
                        marginLeft: '2px',
                        color: '#333333'
                    }}
                ><i className="fa fa-plus"></i></a>
                <a 
                    className="btn pull-right" 
                    data-toggle="modal" 
                    href={`#department-detail-${data.id}`}
                    title="Chi tiết"
                    style={{
                        borderRadius: '5px',
                        border: '1px solid lightgray',
                        width: '26px',
                        marginLeft: '2px',
                        color: '#333333'
                    }}
                ><i className="fa fa-pencil"></i></a>
                <a 
                    href="#abc"
                    className="btn pull-right" 
                    data-toggle="modal" 
                    onClick={() => this.deleteDepartment(
                        data.id, 
                        data.name, 
                        translate('delete'),
                        translate('question.no')
                    )}
                    title="Xóa phòng ban"
                    style={{
                        borderRadius: '5px',
                        border: '1px solid lightgray',
                        width: '26px',
                        marginLeft: '2px',
                        color: '#333333'
                    }}
                ><i className="fa fa-trash"></i></a>
            </span>
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

    render() { 
        const { tree } = this.props.department;
        const { translate } = this.props;
        return ( 
            <React.Fragment>
                <i className="btn btn-sm btn-default fa fa-plus" onClick={ this.zoomIn }></i>
                <i className="btn btn-sm btn-default fa fa-minus" onClick={ this.zoomOut }></i>
                <div className="tf-tree example" style={{ textAlign: 'center', fontSize: this.state.zoom }}>
                    <ul>
                        {tree !== null && this.displayTreeView(tree[0], translate)}
                    </ul>
                </div>
            </React.Fragment>
         );
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