import React, { useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { AuthActions } from '../redux/actions';
import './answerAuthQuestion.css';
import Swal from 'sweetalert2';

const AnswerAuthQuestionPage = ({ answerAuthQuestion }) => {
    const [state, setState] = useState({});

    const _handleQ1 = (e) => {
        setState({
            ...state,
            q1: e.target.value
        })
    }

    const _handleQ2 = (e) => {
        setState({
            ...state,
            q2: e.target.value
        })
    }

    const _handleQ3 = (e) => {
        setState({
            ...state,
            q3: e.target.value
        })
    }

    const _save = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Xác nhận ghi nhận thông tin câu hỏi?',
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
                        q1: state.q1,
                        q2: state.q2,
                        q3: state.q3,
                    }).then(res => {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Lưu thông tin thành công',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }).catch(err => {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'Lưu thông tin thất bại!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    })
                }, 2000)
            }
        })
    }

    return (
        <div style={{ width: '100vw', height: '100vh', backgroundColor: '#e1e1e1' }}>

            <div className="one-edge-shadow">
                <h3 className="text-center">Câu hỏi xác thực tài khoản</h3>
                <p className="text-center">***</p>

                <form onSubmit={_save}>
                    <label className="auth-text">Câu hỏi 1: Ngày sinh của bạn? <span className="text-red">*</span></label>
                    <input className="auth-input" onChange={_handleQ1} />

                    <label className="auth-text">Câu hỏi 2: Môn thể thao mà bạn thích nhất? <span className="text-red">*</span></label>
                    <input className="auth-input" onChange={_handleQ2} />

                    <label className="auth-text">Câu hỏi 3: Nơi bạn đang sống? <span className="text-red">*</span></label>
                    <input className="auth-input" onChange={_handleQ3} />

                    <span>(<span className="text-red">*</span>) Trường thông tin bắt buộc</span>
                    <button type="submit" className="auth-button pull-right">Xác nhận</button>
                </form>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return { auth: state.auth }
}

const mapDispatchToProps = {
    answerAuthQuestion: AuthActions.answerAuthQuestion
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(AnswerAuthQuestionPage));