import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { reactLocalStorage } from 'reactjs-localstorage';
import { edit } from '../redux/actions';

class ComponentInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            id: this.props.componentId,
            name: this.props.componentName,
            description: this.props.componentDescription
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
        const { id, name, description } = this.state;
        const component = { name, description, company: com._id, roles };

        this.props.editComponent(id, component);
    }

    componentDidMount(){
        let script = document.createElement('script');
        script.src = '/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    render() { 
        const { componentId, componentName, componentDescription, componentRoles, translate, role } = this.props;
        return ( 
            <React.Fragment>
                <div className="modal fade" id={`modal-component-${componentId}`}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-blue">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                <h4 className="modal-title">{ translate('manageComponent.componentInfo') }</h4>
                            </div>
                            <div className="modal-body">
                            <div className="box-body">
                                <div className="form-group">
                                    <label>{ translate('table.name') }</label>
                                    <input name="name" type="text" className="form-control" defaultValue={componentName} onChange={this.inputChange} />
                                </div>
                                <div className="form-group">
                                    <label>{ translate('table.description') }</label>
                                    <input name="description" type="text" className="form-control" defaultValue={componentDescription} onChange={this.inputChange} />
                                </div>
                                <div className="form-group">
                                    <label>{ translate('manageResource.roleTo') }</label>
                                    <select 
                                        name="roles"
                                        className="form-control select2" 
                                        multiple="multiple" 
                                        style={{ width: '100%' }} 
                                        onChange={ this.inputChange }
                                        value={ componentRoles }
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
                                <button type="button" className="btn btn-danger pull-left" data-dismiss="modal">{ translate('table.close') }</button>
                                <button type="button" className="btn btn-success" onClick={this.save} data-dismiss="modal">{ translate('table.save') }</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}
 
const mapState = state => state;
const getState = (dispatch, props) => {
    return {
        editComponent: (id, data) => {
            dispatch(edit(id, data));
        },
        // destroy: (id) => {
        //     dispatch(destroy(id));
        // },
    }
}
 
export default connect(mapState, getState) (withTranslate(ComponentInfoForm));