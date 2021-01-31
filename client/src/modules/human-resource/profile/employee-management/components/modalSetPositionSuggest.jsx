import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../../common-components';

class ModalSetPositionSuggest extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, };
        this.state = {
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                position: nextProps.position ? nextProps.position : "",
                emp: nextProps.emp,
                suggestItem: nextProps.suggestItem,
                dataStatus: 0,
            }
        } else {
            return null;
        }
    }

    handleChangePos = async (e) => {
        let { value } = e.target;
        await this.setState(state => {
            return {
                position: value,
                suggestItem: {
                    ...state.suggestItem,
                    suggested: true,
                    emp: state.emp,
                    id: state._id,
                    position: value
                }
            }
        });
    }

    save = async () => {
        await this.setState(state => {
            return {
                suggestItem: {
                    ...state.suggestItem,
                    suggested: true,
                    emp: state.emp,
                    id: state._id,
                    position: state.position
                }
            }
        });

        console.log('gọi1', this.state.suggestItem);
        this.props.onChangeSuggest(this.state.suggestItem);
        this.props.addSuggest(this.state._id, this.state.suggestItem);
    }

    render() {
        const { employeesInfo, translate } = this.props;

        let { _id, position } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`suggest-modal-view-cv-form-employee${_id}`}
                    formID={`suggest-modal-view-cv-form-employee${_id}`}
                    title="Đề xuất nhân sự vào vị trí"
                    func={this.save}
                    hasNote={false}
                >
                    <form className="form-group" id={`modal-view-cv-form-employee${_id}`} style={{ marginTop: "-15px" }}>
                        <div className="form-group">
                            <label>Vị trí công việc</label>
                            <input type="text" className="form-control" value={position} onChange={this.handleChangePos} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    };
}

function mapState(state) { };

const actionCreators = {}

const connectedModalSetPositionSuggest = connect(mapState, actionCreators)(withTranslate(ModalSetPositionSuggest));
export { connectedModalSetPositionSuggest as ModalSetPositionSuggest };