import React, { useEffect,useState } from 'react';
import { connect } from 'react-redux';
import { AuthActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';

const ForgotPassword = (props) => {
    const [state, setState] = useState({});

   

    const handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        setState({
            ...state,
            [name]: value
        });
    }

    const forgotPassword = () => {
        props.forgotPassword({
            
            portal: state.portal,
            email: state.email,
            password2: state.password2
        });
    }

    const { translate, auth } = props;
    const { portal, email, password2 } = state
    return (
        <div className="modal fade" id="modal-reset-password">
            <div className="modal-dialog" style={{ textAlign: 'left' }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 className="modal-title">{translate('form.reset_password')}</h4>
                    </div>
                    {
                        !auth.forgotPassword ?
                            <React.Fragment>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Portal</label>
                                        <input type="text" className="form-control" name="portal" onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>{translate('form.email')}</label>
                                        <input type="text" className="form-control" name="email" onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>{translate('form.password2')}</label>
                                        <input type="password" className="form-control" name="password2" onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">{translate('form.close')}</button>
                                    <button type="button" className="btn btn-primary" onClick={forgotPassword}>{translate('form.next')}</button>
                                </div>
                            </React.Fragment> :
                            <React.Fragment>
                                <div className="modal-body">
                                    <div className="alert alert-success alert-dismissible">
                                        <p>Mã xác thực đã được gửi đến <strong>{state.email}</strong></p>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <a href="https://mail.google.com/" className="btn btn-primary" > Kiểm tra email </a>
                                </div>
                            </React.Fragment>
                    }
                </div>
            </div>
        </div>
    );

}
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = {
    forgotPassword: AuthActions.forgotPassword
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ForgotPassword));