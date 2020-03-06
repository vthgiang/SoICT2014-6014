import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RoleActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import { ModalDialog, ModalButton } from '../../../../common-components';


class RoleCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.save = this.save.bind(this);
    }

    render() { 
        const{ translate, role } = this.props;
        return ( 
            <React.Fragment>
                <ModalButton modalID="modal-create-role" button_name={translate('manage_role.add')} title={translate('manage_role.add_title')}/>
                <ModalDialog
                    modalID="modal-create-role"
                    formID="form-create-role"
                    title={translate('manage_role.add_title')}
                    msg_success={translate('manage_role.add_success')}
                    msg_faile={translate('manage_role.add_faile')}
                    func={this.save}
                    reload={this.reload}
                >
                    <form id="form-create-role">
                        <div className="form-group">
                            <label>{ translate('manage_role.name') }<span className="text-red"> * </span></label>
                            <input className="form-control" type="text" ref="name"/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_role.extends') }</label>
                            <select 
                                id="form-vnist"
                                className="form-control select2" 
                                multiple="multiple" 
                                style={{ width: '100%' }} 
                                ref="parents"
                            >
                                {
                                    role.list !== undefined
                                    ? role.list.map( role => <option key={role._id} value={role._id}>{role.name}</option>)
                                    :null
                                }
                            </select>
                        </div>
                    </form>
                </ModalDialog>
            </React.Fragment>
         );
    }

    componentDidMount(){
        this.props.get();
        let script = document.createElement('script');
        script.src = '/lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    save(){
        const name = this.refs.name.value;
        const select = this.refs.parents;
        const parents = [].filter.call(select.options, o => o.selected).map(o => o.value);

        return this.props.create({name, parents});
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps =  {
    get: RoleActions.get,
    create: RoleActions.create
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(RoleCreateForm) );