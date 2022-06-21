import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DialogModal } from '../../../../../common-components';
import { BiddingPackageManagerActions } from '../redux/actions';
import { BiddingPackageService } from '../redux/services';

const ModalProposeEmpForTask = (props) => {
    const [state, setState] = useState({
        id: "",
        page: 1,
        limit: 10,
        nameSearch: "",
    });
    const [proposedData, setProposedData] = useState({
        // type: "",
        // id: "",
        // proposal: null,
        // isComplete: 0,
    });
    const [isLoading, setLoading] = useState(false);
    const [showFormula, setShowFormula] = useState(false);

    const [dataProp, setDataProp] = useState(props.data);
    const save = async () => {
        console.log(18, proposedData);
        if (proposedData.isComplete) {
            props.handleAcceptProposal(proposedData.proposal)
        }
    }

    const { biddingPackagesManager, translate } = props;
    const { id, bidId } = state;

    useEffect(() => {
        setState({
            ...state,
            id: props.id,
            type: props.proposalType,
            bidId: props.bidId
        })
        setDataProp(props.data);
    }, [props.id,
        // JSON.stringify(props.data)
    ]);

    const handlePropose = async () => {
        setLoading(true);
        await BiddingPackageService.proposeEmployeeForTask(bidId, {
            type: dataProp.type,
            tags: dataProp.proposals?.tags,
            tasks: dataProp.proposals?.tasks,
            biddingPackage: dataProp.biddingPackage,
            unitOfTime: dataProp.unitOfTime,
            executionTime: dataProp.executionTime
        }).then(res => {
            const { data } = res;

            setProposedData(data.content);

        }).catch(err => {
            setProposedData({
                id: null,
                type: "",
                proposal: null,
                isComplete: 0,
            })
        }).finally(() => {
            setLoading(false)
        })
    }

    // useEffect(() => {
    //     if (biddingPackagesManager.propsalData) {
    //         setProposedData(biddingPackagesManager.propsalData)
    //     }
    // }, [JSON.stringify(biddingPackagesManager.propsalData)])

    return (
        <React.Fragment>
            <DialogModal
                size='75' modalID={`modal-view-propose-emp-for-task-${id}`}
                formID={`form-view-propose-emp-for-task-${id}`}
                title="Đề xuất nhân sự tự động"
                func={save}
                resetOnSave={true}
                resetOnClose={true}
                disableSubmit={!proposedData?.isComplete}
            >
                <div className='box-body' style={{ lineHeight: 2 }}>
                    {/* hiển thị công thức tính ở đây này */}
                    <div>
                        <a className='pull-right' style={{ cursor: 'pointer' }} onClick={() => setShowFormula(!showFormula)}>{showFormula ? "Ẩn cơ chế đề xuất" : "Hiển thị cơ chế đề xuất"}</a>
                        <br />
                        {!showFormula ? null : <div style={{ lineHeight: 2 }}>
                            <p>Các nhân viên sẽ được sắp xếp theo danh sách độ ưu tiên phân công vào công việc giảm dần.</p>
                            <p>Trong đó, độ ưu tiên này sẽ dựa vào các tiêu chí:</p>
                            <ul>
                                <li>Các nhân sự chủ chốt sẽ được sắp xếp lên đầu danh sách</li>
                                <li>Giữa các nhân viên sẽ được sắp xếp theo thứ tự ưu tiên trình độ từ Tiến sĩ - Thạc sĩ - Kỹ sư...</li>
                                <li>Giữa nhân viên cũng sẽ được sắp xếp theo số lượng công việc nhân viên đó phải làm trong thời gian diễn ra công việc đang muốn phân công</li>
                                <li>Các nhân sự ứng có khả năng thực hiện công việc sẽ lấy ra theo danh sách nhân viên phù hợp với các thẻ công việc (cần tối thiểu 2 nhân sự ứng với mỗi thẻ công việc)</li>
                                <li>Bên cạnh đó cơ chế đề xuất sẽ hỗ trợ hạn chế vấn đề mỗi nhân viên được đề xuất không phải làm quá nhiều công việc liên tiếp</li>
                            </ul>
                            <p>Sau khi tiền xử lý dữ liệu. Hệ thống sẽ sử dụng thuật toán đề xuất nhân sự (đệ quy, quay lui) để tính toán đề xuất.</p>
                            <br />
                        </div>}
                    </div>

                    <p style={{ color: 'green', lineHeight: 2 }}>* Nhấn nút "Đề xuất" bên dưới để tính toán đề xuất nhân sự *</p>
                    <button type='button' className='btn btn-success' onClick={() => handlePropose()}>Đề xuất</button>
                    <br />
                    <br />
                    {isLoading === true && <div style={{ display: 'flex', justifyContent: 'center' }}>Đang tính toán đề xuất...</div>}
                    {!proposedData ? null :
                        <div>
                            {isLoading === false && proposedData.isComplete === 0 && <div style={{ display: 'flex', justifyContent: 'center', color: 'red' }}>Không tính toán được, hãy kiểm tra lại danh sách nhân viên cho từng công việc!</div>}
                            {isLoading === false && proposedData.isComplete === 1 && <div style={{ display: 'flex', justifyContent: 'center', color: 'green' }}>Đã tính toán xong - hãy nhấn lưu để xem kết quả!</div>}

                        </div>
                    }
                </div>

            </DialogModal>
        </React.Fragment>
    );
};


function mapState(state) {
    const { biddingPackagesManager, user, tasks } = state;
    return { biddingPackagesManager, user, tasks };
}

const actionCreators = {
    proposeEmployeeForTask: BiddingPackageManagerActions.proposeEmployeeForTask,
};

const connectComponent = connect(mapState, actionCreators)(withTranslate(ModalProposeEmpForTask));
export { connectComponent as ModalProposeEmpForTask };
