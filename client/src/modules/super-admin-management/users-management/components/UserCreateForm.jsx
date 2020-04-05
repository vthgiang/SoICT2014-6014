import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserActions } from '../redux/actions';
import { RoleActions } from '../../roles-management/redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import { ModalDialog, ModalButton } from '../../../../common-components';
import { VALIDATE } from '../../../../helpers/Validate';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class UserCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.save = this.save.bind(this);
    }

    save = () => {
        const errorArr = [];
        const name = this.refs.name.value;
        const email = this.refs.email.value;
        if(name.length < 1) errorArr.push('Tên không được để trống');
        if(!VALIDATE.testName(name)) errorArr.push('Tên không được chứa kí tự đặc biệt');
        if(!VALIDATE.testEmail(email)) errorArr.push('Email không hợp lệ');
        if(errorArr.length > 0) errorArr.map(e => toast.warning(e, {containerId: 'toast-notification'}));
        else return this.props.create({
            name: this.refs.name.value,
            email: this.refs.email.value,
            roles: [].filter.call(this.refs.roles.options, o => o.selected).map(o => o.value)
        });
    }

    componentDidMount(){
        this.props.getRoles();
    }

    render() { 
        const{ translate, role, user } = this.props;
        return ( 
            <React.Fragment>
                <ModalButton modalID="modal-create-user" button_name={translate('manage_user.add')} title={translate('manage_user.add_title')}/>
                <ModalDialog
                    modalID="modal-create-user" isLoading={user.isLoading}
                    formID="form-create-user"
                    title={translate('manage_user.add_title')}
                    msg_success={translate('manage_user.add_success')}
                    msg_faile={translate('manage_user.add_faile')}
                    func={this.save}
                >
                    <form id="form-create-user" onSubmit={() => this.save(translate('manage_user.add_success'))}>
                        <div className="form-group">
                            <label>{ translate('table.name') }<span className="text-red">*</span></label>
                            <input type="text" className="form-control" ref="name"/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('table.email') }<span className="text-red">*</span></label>
                            <input type="email" className="form-control" ref="email"/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_user.roles') }</label>
                            <select
                                className="form-control select2" 
                                multiple="multiple" 
                                style={{ width: '100%' }} 
                                ref="roles"
                            >
                                {
                                    role.list.map( role => {
                                        if(role.name !== 'Super Admin') return <option key={role._id} value={role._id}>{role.name}</option>;
                                    })
                                }
                            </select>
                        </div>
                    </form>
                </ModalDialog>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps = {
    create: UserActions.create,
    getRoles: RoleActions.get
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(UserCreateForm) );