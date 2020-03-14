import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RoleActions } from '../../../super-admin-management/manage-role/redux/actions';
import { ComponentActions } from '../redux/actions';
import { ModalButton, ModalDialog } from '../../../../common-components';

class ComponentCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.save = this.save.bind(this);
    }

    render() { 
        const { translate, role, link } = this.props;
        return ( 
            <React.Fragment>
                <ModalButton modalID="modal-create-component" button_name={translate('manage_component.add')} title={translate('manage_component.add_title')}/>
                <ModalDialog
                    modalID="modal-create-component"
                    formID="form-create-component"
                    title={translate('manage_component.add_title')}
                    msg_success={translate('manage_component.add_success')}
                    msg_faile={translate('manage_component.add_faile')}
                    func={this.save}
                >
                    <form id="form-create-component">
                        <div className="form-group">
                            <label>{ translate('manage_component.name') }<span className="text-red"> * </span></label>
                            <input type="text" className="form-control" ref="name"/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_component.description') }</label>
                            <input type="text" className="form-control" ref="description"/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_component.link') }</label>
                            {
                                link.list.length > 0 &&
                                <select 
                                    className="form-control select2"
                                    style={{ width: '100%' }} 
                                    defaultValue={link.list[0]._id}
                                    ref="linkId"
                                >
                                    {
                                        link.list.map( link => 
                                            <option key={link._id} value={link._id}>
                                                { link.url }
                                            </option>
                                        )
                                    }
                                </select>
                            }
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_component.roles') }</label>
                            <select 
                                className="form-control select2" 
                                multiple="multiple" 
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
                    </form>
                </ModalDialog>
            </React.Fragment>
         );
    }

    save = () =>{
        // let select = this.refs.roles;
        // let roles = [].filter.call(select.options, o => o.selected).map(o => o.value);
        return this.props.createComponet({
            name: this.refs.name.value,
            description: this.refs.description.value,
            linkId: this.refs.linkId.value,
            roles: [].filter.call(this.refs.roles.options, o => o.selected).map(o => o.value)
        });
    }

    componentDidMount(){
        this.props.getRole();
    }
}
 
const mapState = state => state;
const getState = {
    getRole: RoleActions.get,
    createComponet: ComponentActions.create
}
 
export default connect(mapState, getState) (withTranslate(ComponentCreateForm));
