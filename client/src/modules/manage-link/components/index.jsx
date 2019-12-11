import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { get } from '../redux/actions';
import Swal from 'sweetalert2';
// import LinkDetail from './LinkDetail';

class ManageLink extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            url: null,
            description: null,
            role: null
        }
        this.inputChange = this.inputChange.bind(this);
        // this.createLink = this.createLink.bind(this);
    }

    inputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    // createLink(e){
    //     e.preventDefault();
    //     const { url, description, role } = this.state;
    //     this.props.create(url, description, role);
    // }

    componentDidMount(){
        this.props.get();
        // this.props.getSuperRole();
    }

    alert(id){
        Swal.fire({
            title: 'Delete this link?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete'
        }).then((res) => {
            if(res.value){
                this.props.destroy(id)
            }
        });
    }

    render() { 
        const { translate, link } = this.props;
        // console.log("link create :", this.state);
        return ( 
            <React.Fragment>
                {/* <a className="btn btn-primary" data-toggle="modal" href="#modal-create-link">{ translate('manageResource.createLink') }</a>
                <div className="modal fade" id="modal-create-link">
                    <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                        <h4 className="modal-title">{ translate('manageResource.createLink') }</h4>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="box-body">
                                    <div className="form-group">
                                        <label>{ translate('manageResource.url') }</label>
                                        <input name="url" className="form-control" onChange={this.inputChange}/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('manageResource.urlDescription') }</label>
                                        <input name="description" className="form-control" onChange={this.inputChange}/>
                                    </div>
                                    <div className="form-group">
                                    <label>{ translate('manageResource.roleTo') }</label>
                                        <select 
                                            className="form-control" 
                                            style={{width: '100%'}} 
                                            name="role" 
                                            onChange={this.inputChange}>
                                                <option>{ translate('manageResource.selectRole') }</option>
                                            {
                                                roles.super !== undefined && 
                                                roles.super.map( role => 
                                                    <option key={role._id} value={role._id}>
                                                        { role.name}
                                                    </option>)
                                            }
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">{ translate('table.close') }</button>
                        <button type="button" className="btn btn-primary" onClick={this.createLink} data-dismiss="modal">{ translate('table.save') }</button>
                        </div>
                    </div>
                    </div>
                </div>
                 */}
                <table 
                    style={{marginTop: '50px'}}
                    className="table table-bordered">
                    <thead>
                        <tr>
                            <th>{ translate('table.url') }</th>
                            <th>{ translate('table.description') }</th>
                            <th style={{width: "15%"}}>{ translate('table.action') }</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            link.list.map( link => 
                                <tr key={link._id}>
                                    <td>{ link.url }</td>
                                    <td>{ link.description }</td>
                                    <td>
                                        <a className="btn btn-sm btn-primary" data-toggle="modal" href={ `#modal-id-${link.id}` }><i className="fa fa-edit"></i></a>
                                            
                                        {/* <a className="btn btn-sm btn-primary" to={`/admin/resource/link/edit/${link.id}`}><i className="fa fa-eye"></i></a> */}
                                        {/* <a className="btn btn-sm btn-primary" data-toggle="modal" href={`#link-${link.id}`}><i className="fa fa-edit"></i></a> */}
                                        <button className="btn btn-sm btn-danger" onClick={() => this.alert(link.id)}><i className="fa fa-trash"></i></button>
                                        {/* <LinkDetail 
                                            linkId={ link.id }
                                        /> */}
                                        
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
                </React.Fragment>
         );
    }
}
 
const mapState = state => state;
const getState = (dispatch, props) => {
    return {
        get: () => {
            dispatch(get());
        },
        // getSuperRole: () => {
        //     dispatch(getSuperRole());
        // },
        // create: (url, description, role) => {
        //     dispatch(create(url, description, role));
        // },
        // destroy: (id) => {
        //     dispatch(destroy(id));
        // }
    }
}
 
export default connect(mapState, getState) (withTranslate(ManageLink));