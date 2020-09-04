import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AuthActions } from '../../../modules/auth/redux/actions';

class ImgShow extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.state = {
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if ((nextProps.id !== prevState.id && nextProps.src)) {
            return {
                id: nextProps.id,
                img: nextProps.src,
                dataStatus: 0
            }
        }
        return null
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (nextProps.src && nextProps.src.search(';base64,') < 0 && !nextProps.auth.isLoading && this.state.dataStatus === this.DATA_STATUS.NOT_AVAILABLE) {
            await this.props.downloadFile(nextProps.src, `avatar${nextProps.id}`, 'show');
            this.setState({
                dataStatus: this.DATA_STATUS.QUERYING
            });
        };
        if (this.state.dataStatus === this.DATA_STATUS.QUERYING && !nextProps.auth.isLoading) {
            this.setState({
                dataStatus: this.DATA_STATUS.AVAILABLE
            });
            return false;
        }
        if (this.state.dataStatus === this.DATA_STATUS.AVAILABLE && !nextProps.auth.isLoading && nextProps.auth.show_files.length !== 0) {
            let img = nextProps.auth.show_files.find(x => x.fileName === `avatar${nextProps.id}`);
            this.setState({
                dataStatus: this.DATA_STATUS.FINISHED,
                img: img ? img.file : '',
            });
            return true;
        };
        return true;
    }

    render() {
        const { className = 'attachment-img avarta', src } = this.props;

        let { img } = this.state;

        if (src.search(';base64,') >= 0) {
            img = src;
        }

        return (
            <img className={className} src={img} alt="Attachment" />
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

const imgShow = connect(mapState, actionCreators)(withTranslate(ImgShow));
export { imgShow as ImgShow }