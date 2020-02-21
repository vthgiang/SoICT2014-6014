import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';

class UserCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: null,
            email: null
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

    save = (msg) => {
        const { name, email } = this.state;
        const user = {
            name, email
        };
        this.props.create(user).then(res => {
            Swal.fire({
                icon: 'success',
                title: msg,
                showConfirmButton: false,
                timer: 5000
            }) 
        });
    }

    render() { 
        const{ translate } = this.props;
        return ( 
            <React.Fragment>
                <a className="btn btn-success pull-right" data-toggle="modal" href='#modal-id' title={ translate('manage_user.add_title') }>{ translate('manage_user.add') }</a>
                <div className="modal fade" id="modal-id">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                                <h4 className="modal-title">{ translate('manage_user.add_title') }</h4>
                            </div>
                            <div className="modal-body">
                                <form style={{ marginBottom: '20px' }} >
                                    <div className="form-group">
                                        <label>{ translate('table.name') }</label>
                                        <input type="text" className="form-control" name="name" onChange={ this.inputChange }/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('table.email') }</label>
                                        <input type="email" className="form-control" name="email" onChange={ this.inputChange }/>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary" data-dismiss="modal">{ translate('form.close') }</button>
                                <button className="btn btn-success" 
                                    onClick={() => this.save(translate('manage_user.add_success'))} 
                                    data-dismiss="modal">{ translate('form.save') }</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps = {
    create: UserActions.create
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(UserCreateForm) );