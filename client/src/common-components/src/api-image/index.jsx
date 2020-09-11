import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AuthActions } from '../../../modules/auth/redux/actions';

class ApiImage extends Component {
    static DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
    
    constructor(props) {
        super(props);
        this.state = {
            dataStatus: ApiImage.DATA_STATUS.NOT_AVAILABLE
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.src && nextProps.src !== prevState.src) {
            if (nextProps.src.search(';base64,') < 0) { // Cần download ảnh để hiển thị
                nextProps.downloadFile(nextProps.src, `${nextProps.src}`, false);
                return {
                    ...prevState,
                    src: nextProps.src,
                    dataStatus: ApiImage.DATA_STATUS.QUERYING,
                };
            } else { // Ảnh đã ở dạng base64, sẵn sàng hiển thị
                return {
                    ...prevState,
                    src: nextProps.src,
                    image: nextProps.src,
                    dataStatus: ApiImage.DATA_STATUS.AVAILABLE,
                }
            }
        }
        return null;
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (this.state.dataStatus === ApiImage.DATA_STATUS.QUERYING && nextProps.auth.showFiles && nextProps.auth.showFiles.find(x => x.fileName === nextState.src)) { // Dữ liệu đã về
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: ApiImage.DATA_STATUS.AVAILABLE,
                    image: nextProps.auth.showFiles.find(x => x.fileName === nextState.src).file,
                }
            });
            return false;
        }

        if (this.state.dataStatus === ApiImage.DATA_STATUS.AVAILABLE) {
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: ApiImage.DATA_STATUS.FINISHED,
                }
            });
            return true;
        };

        return false;
    }


    render() {
        const { className, style, alt="File not available"} = this.props;

        let { image } = this.state;

        return (
            <img className={className} style={style} src={image} alt={alt} />
        );
    }
}

function mapState(state) {
    const { auth } = state;
    return { auth };
};

const actionCreators = {
    downloadFile: AuthActions.downloadFile,
};

const apiImage = connect(mapState, actionCreators)(withTranslate(ApiImage));
export { apiImage as ApiImage }