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
    showImage = () => {
        // Get the modal
        let modal = document.getElementById("modal-files-attach");

        // Get the image and insert it inside the modal - use its "alt" text as a caption
        let img = document.getElementById("modal-image-attach");
        let modalImg = document.getElementById("image-attach");
        let captionText = document.getElementById("caption-files-attach");
        modal.style.display = "block";
        modalImg.src = this.state.image;
        captionText.innerHTML = this.props.fileName;
    }
    closeImage = () => {
        // Get the <span> element that closes the modal
        let span = document.getElementsByClassName("close-files-attach")[0];
        let modal = document.getElementById("modal-files-attach");
        modal.style.display = "none";
    }
    render() {
        const { className, style, alt = "File not available" } = this.props;

        let { image } = this.state;

        return (
            <React.Fragment>
                <img className={className} id="modal-image-attach" onClick={this.showImage} style={style} src={image} alt={alt} />
                <div id="modal-files-attach" class="modal-files-attach">
                    <span class="close-files-attach" onClick={this.closeImage}>&times;</span>
                    <img class="modal-content-files-attach" id="image-attach" />
                    <div id="caption-files-attach"></div>
                </div>
            </React.Fragment>
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