import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { AuthActions } from '../redux/actions';
import './answerAuthQuestion.css';
import Swal from 'sweetalert2';

const AnswerAuthQuestionPage = ({ auth, answerAuthQuestion, checkExistsPassword2, autoRedirectAfterQuestionAnswer }) => {
    const [state, setState] = useState({
        hide: true
    });

    const _handlePassword2 = (e) => {
        setState({
            ...state,
            password2: e.target.value
        })
    }

    const _handleShowHide = (e) => {
        setState({
            ...state,
            hide: !state.hide
        })
    }

    const _save = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Xác nhận mật khẩu cấp 2?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Nhập lại',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Hệ thống đang xử lý dữ liệu',
                    allowOutsideClick: false
                })
                Swal.showLoading();

                setTimeout(() => {
                    answerAuthQuestion({
                        password2: state.password2,
                    }).then(res => {
                        Swal.close();
                    }).catch(err => {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'Lưu thông tin thất bại!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    })
                }, 1000)
            }
        })
    }

    useEffect(() => {
        checkExistsPassword2();
    }, [])

    return (
        <div style={{ width: '100vw', height: '100vh', backgroundColor: '#e1e1e1' }}>

            <div className="one-edge-shadow">
                {
                    !auth.password2AlreadyExists ?
                        <form onSubmit={_save}>
                            <div className="auth-info-line">
                                <label className="auth-text">Tạo mật khẩu cấp 2<span className="text-red">*</span></label>
                                <div style={{ display: 'flex' }}>
                                    <input className="form-control auth-input" type={state.hide ? 'password' : 'text'} placeholder="Nhập ..." onChange={_handlePassword2} />
                                    <span className="auth-input-action" style={{ position: 'absolute', top: "60px", right: '25px', cursor: 'pointer' }} onClick={_handleShowHide}><i className={state.hide ? 'fa fa-eye' : 'fa fa-eye-slash'}></i></span>
                                </div>
                            </div>

                            <span>(<span className="text-red">*</span>) Trường thông tin bắt buộc</span>
                            <button type="submit" className="btn btn-success pull-right">Xác nhận</button>
                        </form> :
                        <div className="text-center">
                            <h3 className="text-green">
                                <i className="fa fa-check" style={{ fontSize: '24px' }}></i>{`${auth.password2AlreadyExists && !auth.autoRedirectAfterQuestionAnswer ? 'Bạn đã có mật khẩu cấp 2' : 'Lưu thông tin thành công'}`}
                            </h3>
                            <a href="/"><span style={{ fontSize: '16px', color: 'blue' }}><u>Chuyển đến trang chủ</u></span></a>
                        </div>
                }
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return { auth: state.auth }
}

const mapDispatchToProps = {
    answerAuthQuestion: AuthActions.answerAuthQuestion,
    checkExistsPassword2: AuthActions.checkExistsPassword2,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(AnswerAuthQuestionPage));