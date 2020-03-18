import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ComponentActions } from '../redux/actions';
import { ModalButton, ModalDialog} from '../../../../common-components';

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

    save(){
        let select = this.refs.roles;
        let roles = [].filter.call(select.options, o => o.selected).map(o => o.value);
        const { id, name, description } = this.state;
        const component = { name, description, roles };

        return this.props.editComponent(id, component);
    }

    componentDidMount(){
        let script = document.createElement('script');
        script.src = 'lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    render() { 
        const { componentId, componentName, componentDescription, componentRoles, translate, role } = this.props;
        return ( 
            <React.Fragment>
                <ModalButton modalID={`modal-edit-component-${componentId}`} button_type="edit" title={translate('manage_component.edit')}/>
                <ModalDialog
                    size='50' func={this.save} type="edit"
                    modalID={`modal-edit-component-${componentId}`}
                    formID={`form-edit-component-${componentId}`}
                    title={translate('manage_component.edit')}
                    msg_success={translate('manage_component.edit_success')}
                    msg_faile={translate('manage_component.edit_faile')}
                >
                    <form id={`form-edit-component-${componentId}`}>
                        <div className="form-group">
                            <label>{ translate('table.name') }<span className="text-red"> * </span></label>
                            <input name="name" type="text" className="form-control" defaultValue={componentName} onChange={this.inputChange} />
                        </div>
                        <div className="form-group">
                            <label>{ translate('table.description') }</label>
                            <input name="description" type="text" className="form-control" defaultValue={componentDescription} onChange={this.inputChange} />
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_component.roles') }</label>
                            <select 
                                className="form-control select2" 
                                multiple="multiple" 
                                style={{ width: '100%' }} 
                                defaultValue={ componentRoles }
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
                    </form>
                </ModalDialog>
            </React.Fragment>
         );
    }
}
 
const mapState = state => state;
const getState = {
    editComponent: ComponentActions.edit
}
 
export default connect(mapState, getState) (withTranslate(ComponentInfoForm));