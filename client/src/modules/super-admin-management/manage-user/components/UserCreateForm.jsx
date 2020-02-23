import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import { Modal } from '../../../../common-components';

class UserCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.save = this.save.bind(this);
    }

    save = () => {
        
        return this.props.create({
            name: this.refs.name.value,
            email: this.refs.email.value
        });
    }

    render() { 
        const{ translate } = this.props;
        return ( 
            <React.Fragment>
                <Modal
                    title={translate('manage_user.add_title')}
                    size='50' id="create-user"
                    button_name={translate('manage_user.add')} 
                    msg_success={translate('manage_user.add_success')}
                    msg_faile={translate('manage_user.add_faile')}
                    func={this.save}
                >
                    <form id="create-user" onSubmit={() => this.save(translate('manage_user.add_success'))}>
                        <div className="form-group">
                            <label>{ translate('table.name') }<span className="text-red">*</span></label>
                            <input type="text" className="form-control" ref="name"/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('table.email') }<span className="text-red">*</span></label>
                            <input type="email" className="form-control" ref="email"/>
                        </div>
                    </form>
                </Modal>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps = {
    create: UserActions.create
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(UserCreateForm) );