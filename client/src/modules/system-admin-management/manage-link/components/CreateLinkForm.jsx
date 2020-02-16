import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RoleActions } from '../../../super-admin-management/manage-role/redux/actions';
import { LinkActions } from '../redux/actions';
import { reactLocalStorage } from 'reactjs-localstorage';

class CreateLinkForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            url: null,
            description: null
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
        const { url, description } = this.state;
        const link = { url, description, company: com._id, roles };

        this.props.createLink(link);
    }

    componentDidMount(){
        this.props.getRole();
    }

    render() { 
        const { translate, role } = this.props;
        return ( 
            <React.Fragment>
                <a className="btn btn-success pull-right" data-toggle="modal" href="#modal-create-link" title={ translate('manageResource.createLink') }>{ translate('add') }</a>
                <div className="modal fade" id="modal-create-link"  style={{ textAlign: 'left' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <h4 className="modal-title">{ translate('manageLink.add') }</h4>
                        </div>
                        <div className="modal-body">
                        <div className="box-body">
                            <div className="form-group">
                                <label>{ translate('manageResource.url') }</label>
                                <input name="url" type="text" className="form-control" onChange={this.inputChange}/>
                            </div>
                            <div className="form-group">
                                <label>{ translate('manageResource.urlDescription') }</label>
                                <input name="description" type="text" className="form-control" onChange={this.inputChange}/>
                            </div>
                            <div className="form-group">
                                <label>{ translate('manageResource.roleTo') }</label>
                                <select 
                                    name="roles"
                                    className="form-control select2" 
                                    multiple="multiple" 
                                    onChange={ this.inputChange }
                                    style={{ width: '100%' }} 
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
                
            </React.Fragment>
         );
    }
}
 
const mapState = state => state;
const getState = {
    getRole: RoleActions.get,
    createLink: LinkActions.create
}
 
export default connect(mapState, getState) (withTranslate(CreateLinkForm));
