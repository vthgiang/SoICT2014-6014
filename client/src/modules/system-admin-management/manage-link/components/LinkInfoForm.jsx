import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { get as getRole } from '../../../super-admin-management/manage-role/redux/actions';
import { edit } from '../redux/actions';
import { reactLocalStorage } from 'reactjs-localstorage';

class LinkInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            id: this.props.linkId,
            url: this.props.linkName,
            description: this.props.linkDescription
         }
        this.inputChange = this.inputChange.bind(this);
        this.save = this.save.bind(this);
    }

    inputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    save(e){
        e.preventDefault();
        let select = this.refs.roles;
        let roles = [].filter.call(select.options, o => o.selected).map(o => o.value);
        var com = reactLocalStorage.getObject('company');
        const { id, url, description } = this.state;
        const link = { url, description, company: com._id, roles };

        this.props.editLink(id, link);
    }

    componentDidMount(){
        let script = document.createElement('script');
        script.src = '/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        this.props.getRole();
    }

    render() { 
        const { translate, role, linkName, linkDescription, linkRoles } = this.props;
        console.log("ROLES: ", linkRoles);
        return ( 
            <div className="modal fade" id={`modal-link-${this.props.linkId}`}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <h4 className="modal-title">{ translate('manageLink.linkInfo') }</h4>
                        </div>
                        <div className="modal-body">
                        <div className="box-body">
                            <div className="form-group">
                                <label>{ translate('manageResource.url') }</label>
                                <input name="url" type="text" className="form-control" defaultValue={linkName} onChange={this.inputChange} />
                            </div>
                            <div className="form-group">
                                <label>{ translate('manageResource.urlDescription') }</label>
                                <input name="description" type="text" className="form-control" defaultValue={linkDescription} onChange={this.inputChange} />
                            </div>
                            <div className="form-group">
                                <label>{ translate('manageResource.roleTo') }</label>
                                <select 
                                    name="roles"
                                    className="form-control select2" 
                                    multiple="multiple" 
                                    style={{ width: '100%' }} 
                                    onChange={ this.inputChange }
                                    value={ linkRoles }
                                    ref="roles"
                                >
                                    {
                                        
                                        role.list.map( role => 
                                            <option key={role._id} value={role._id}>
                                                { role.name }
                                            </option>
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                                
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">{ translate('table.close') }</button>
                            <button type="button" className="btn btn-primary" onClick={this.save} data-dismiss="modal">{ translate('table.save') }</button>
                        </div>
                    </div>
                </div>
            </div>
            
         );
    }
}
 
const mapState = state => state;
const getState = (dispatch, props) => {
    return {
        getRole: () => {
            dispatch(getRole());
        },
        editLink: (id, data) => {
            dispatch(edit(id, data));
        }
    }
}
 
export default connect(mapState, getState) (withTranslate(LinkInfoForm));