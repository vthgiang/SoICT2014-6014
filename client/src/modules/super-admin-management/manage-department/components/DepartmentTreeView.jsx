import React, { Component } from 'react';
import './department.css';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DepartmentActions } from '../redux/actions';
import DepartmentCreateForm from './DepartmentCreateForm';
import DepartmentEditForm from './DepartmentEditForm';
import {DeleteNotification, ModalButton} from '../../../../common-components';
import DepartmentCreateWithParent from './DepartmentCreateWithParent';

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
                {
                    department.list.length > 0 &&
                    <React.Fragment >
                        <div className="pull-left">
                            <i className="btn btn-sm btn-default fa fa-plus" onClick={ this.zoomIn } title={translate('manage_department.zoom_in')}></i>
                            <i className="btn btn-sm btn-default fa fa-minus" onClick={ this.zoomOut } title={translate('manage_department.zoom_out')}></i>
                        </div>
                        <div className="pull-right">
                            <DepartmentCreateForm />
                        </div>
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
                                    this.refs.departmentId !== undefined ?
                                    this.refs.departmentId.value :
                                    department.list[0]._id
                                }`}
                                title={translate('form.search')}
                            >{translate('form.search')}</a>
                        </div>
                    </React.Fragment>
                }
                {
                    tree !== null &&
                    tree.map(tree => 
                        <div className="tf-tree example" style={{ textAlign: 'left', fontSize: this.state.zoom, marginTop: '50px'}}>
                            <ul>
                                {
                                    this.displayTreeView(tree, translate)
                                }
                            </ul>
                        </div>
                    )
                }
                {
                    department.list.length > 0 && 
                    department.list.map(d => 
                        <React.Fragment>
                            <DepartmentCreateWithParent parentId={d._id}/>
                            <DepartmentEditForm parentId={d._id}/>
                        </React.Fragment>
                    )
                }
            </React.Fragment>
         );
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
        if(this.state.zoom > 16)
            this.setState({ zoom : this.state.zoom - 1});
    }

    showNodeContent = (data, translate) => {
        return (
            <React.Fragment>
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
                    <p style={{color:'#605CA8'}}><strong>{ data.name }</strong></p>
                    <div className="row">
                        <a 
                            style={{marginRight: '10px'}} 
                            className="text-black pull-right" 
                            onClick={() => this.toggleSetting(`department-setting-${data.id}`)}
                            title={translate('table.action')}
                        ><i className="fa fa-gear"></i></a>
                    </div>
                    <div id={`department-setting-${data.id}`} className="row" style={{display: 'none'}}>
                        <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                            <ModalButton modalID={`modal-create-department-${data.id}`}
                                button_type="add" color="green"
                                title={translate('manage_department.add_title')}
                            />
                        </div>
                        <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                            <ModalButton modalID={`modal-edit-department-${data.id}`}
                                button_type="edit" color="orange"
                                title={translate('manage_department.edit')}
                            />
                        </div>
                        <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                            <DeleteNotification 
                                content={{
                                    title: translate('manage_department.delete'),
                                    btnNo: translate('confirm.no'),
                                    btnYes: translate('confirm.yes'),
                                }}
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
    componentDidMount() {
        let script = document.createElement('script');
        script.src = '/lib/main/js/defindMultiSelect.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
}
 
const mapState = state => state;
const getState = {
    destroy: DepartmentActions.destroy
}
 
export default connect(mapState, getState) (withTranslate(DepartmentTreeView)); 