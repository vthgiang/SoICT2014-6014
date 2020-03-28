import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RoleDefaultActions } from '../../roles-default-management/redux/actions';
import { ComponentDefaultActions } from '../redux/actions';
import { ModalButton, ModalDialog } from '../../../../common-components';
import { LinkDefaultActions } from '../../links-default-management/redux/actions';

class ComponentCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.save = this.save.bind(this);
    }

    render() { 
        const { translate, rolesDefault, linksDefault } = this.props;
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
                                linksDefault.list.length > 0 &&
                                <select 
                                    className="form-control select2"
                                    style={{ width: '100%' }} 
                                    defaultValue={linksDefault.list[0]._id}
                                    ref="link"
                                >
                                    {
                                        linksDefault.list.map( link => 
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
                                    rolesDefault.list.map( role => 
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
        return this.props.createComponent({
            name: this.refs.name.value,
            description: this.refs.description.value,
            link: this.refs.link.value,
            roles: [].filter.call(this.refs.roles.options, o => o.selected).map(o => o.value)
        });
    }

    componentDidMount(){
        this.props.getRole();
        this.props.getLink();
    }
}
 
const mapState = state => state;
const getState = {
    getRole: RoleDefaultActions.get,
    getLink: LinkDefaultActions.get,
    createComponent: ComponentDefaultActions.create
}
 
export default connect(mapState, getState) (withTranslate(ComponentCreateForm));
