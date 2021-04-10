import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../../common-components';

const ModalSetPositionSuggest = (props) => {
    const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, };

    const [state, setState] = useState({
        dataStatus: DATA_STATUS.NOT_AVAILABLE
    })
    

    if (props._id != state._id) {
        setState(state => ({
            ...state,
            _id: props._id,
            position: props.position ? props.position : "",
            emp: props.emp,
            suggestItem: props.suggestItem,
            dataStatus: 0,
        }))
    }

    const handleChangePos = async (e) => {
        let { value } = e.target;
        await setState(state => {
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

    const save = async () => {
        await setState(state => {
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

        console.log('gọi1', state.suggestItem);
        props.onChangeSuggest(state.suggestItem);
        props.addSuggest(state._id, state.suggestItem);
    }

    const { employeesInfo, translate } = props;

    let { _id, position } = state;
    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID={`suggest-modal-view-cv-form-employee${_id}`}
                formID={`suggest-modal-view-cv-form-employee${_id}`}
                title="Đề xuất nhân sự vào vị trí"
                func={save}
                hasNote={false}
            >
                <form className="form-group" id={`modal-view-cv-form-employee${_id}`} style={{ marginTop: "-15px" }}>
                    <div className="form-group">
                        <label>Vị trí công việc</label>
                        <input type="text" className="form-control" value={position} onChange={handleChangePos} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) { };

const actionCreators = {}

const connectedModalSetPositionSuggest = connect(mapState, actionCreators)(withTranslate(ModalSetPositionSuggest));
export { connectedModalSetPositionSuggest as ModalSetPositionSuggest };