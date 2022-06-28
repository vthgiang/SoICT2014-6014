import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DialogModal } from '../../../../../common-components';
import { BiddingPackageManagerActions } from '../redux/actions';
import { BiddingPackageService } from '../redux/services';
import { convertEmpIdToName } from './employeeHelper';

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
        // compareVersion: [],
        // proposal: null,
        // isComplete: 0,
    });
    const [isLoading, setLoading] = useState(false);
    const [showFormula, setShowFormula] = useState(false);
    const [showListTag, setShowListTag] = useState(true);
    const [showKeyMember, setShowKeyMember] = useState(true);

    const [dataProp, setDataProp] = useState(props.data);
    const save = async () => {
        console.log(18, proposedData);
        if (proposedData.isComplete) {
            props.handleAcceptProposal(proposedData.proposal)
        }
    }

    const { biddingPackagesManager, translate } = props;
    const { id, bidId, allEmployee, listCareer, allTag } = state;

    useEffect(() => {
        setState({
            ...state,
            id: props.id,
            type: props.proposalType,
            bidId: props.bidId,
            allEmployee: props.allEmployee,
            listCareer: props.listCareer,
            allTag: props.allTag,
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
                compareVersion: [],
                proposal: null,
                isComplete: 0,
            })
        }).finally(() => {
            setLoading(false)
        })
    }

    const checkInArr = (item, arr) => {
        let check = arr.find(x => String(x) === String(item));
        if (check) return true;
        return false;
    }

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
                                <li>Các nhân sự chủ chốt sẽ được sắp xếp lên đầu danh sách ( <a style={{ cursor: 'pointer' }} onClick={() => setShowKeyMember(!showKeyMember)}>{showKeyMember ? "Ẩn danh sách nhân sự chủ chốt" : "Hiển thị danh sách nhân sự chủ chốt"}</a> )
                                    {!showKeyMember ? null : <>
                                        <table id="key-member-explain-show-data" className="table not-has-action table-striped table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>Vị trí công việc</th>
                                                    <th>Nhân sự chủ chốt</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    dataProp.biddingPackage?.keyPeople?.map((item, listIndex) => {
                                                        return (
                                                            <tr key={`tag-${listIndex}`}>
                                                                <td>{listIndex + 1}</td>
                                                                <td>{listCareer?.find(x => String(item?.careerPosition) === String(x._id))?.name}</td>
                                                                <td>{item?.employees.map(userItem => convertEmpIdToName(allEmployee, userItem)).join(', ')}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                        <br />
                                    </>}
                                </li>
                                <li>Giữa các nhân viên sẽ được sắp xếp theo thứ tự ưu tiên trình độ từ Tiến sĩ - Thạc sĩ - Kỹ sư...</li>
                                <li>Giữa nhân viên cũng sẽ được sắp xếp theo số lượng công việc nhân viên đó phải làm trong thời gian diễn ra công việc đang muốn phân công</li>
                                <li>Các nhân sự ứng có khả năng thực hiện công việc sẽ lấy ra theo danh sách nhân viên phù hợp với các thẻ công việc (cần tối thiểu 2 nhân sự ứng với mỗi thẻ công việc)
                                    ( <a style={{ cursor: 'pointer' }} onClick={() => setShowListTag(!showListTag)}>{showListTag ? "Ẩn danh sách" : "Hiển thị danh sách"}</a> )
                                    {!showListTag ? null : <>
                                        <table id="tag-explain-show-data" className="table not-has-action table-striped table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>Tên thẻ</th>
                                                    <th>Mô tả</th>
                                                    <th>Nhân sự thực hiện</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    allTag?.filter(x => dataProp?.proposals?.tasks?.find(t => String(t?.tag) === String(x?._id))).map((item, listIndex) => {
                                                        return (
                                                            <tr key={`tag-${listIndex}`}>
                                                                <td>{listIndex + 1}</td>
                                                                <td>{item?.name}</td>
                                                                <td>{item?.description}</td>
                                                                <td>{item?.employees.map(userItem => convertEmpIdToName(allEmployee, userItem)).join(', ')}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                        <br />
                                    </>}
                                </li>
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
                            {isLoading === false && proposedData.isComplete === 1 && <>
                                <div style={{ display: 'flex', justifyContent: 'center', color: 'green' }}>Đã tính toán xong - hãy nhấn lưu để áp dụng kết quả đề xuất!</div>
                                <table id="proposal-result-show-data" className="table not-has-action table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Công việc</th>
                                            {proposedData?.compareVersion[0]?.old?.directEmployees?.length <= 0 && <th>Nhân sự phù hợp</th>}
                                            {proposedData?.compareVersion[0]?.old?.directEmployees?.length > 0 && <th>Nhân sự phân công ban đầu</th>}
                                            <th>Nhân sự đề xuất tự động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            proposedData.compareVersion?.map((item, listIndex) => {
                                                return (
                                                    <tr key={`tag-${listIndex}`}>
                                                        <td>{listIndex + 1}</td>
                                                        <td>{item?.name}</td>
                                                        {item?.old?.directEmployees?.length <= 0 && <td>
                                                            {allTag?.find(x => String(item?.tag) === String(x?._id)) ? 
                                                                allTag?.find(x => String(item?.tag) === String(x?._id)).employees.map(userItem => convertEmpIdToName(allEmployee, userItem)).join(', ')
                                                                : "N/A"
                                                            }
                                                        </td>}
                                                        {item?.old?.directEmployees?.length > 0 && <td>
                                                            <div><strong>Nhân sự trực tiếp: </strong>
                                                                {item?.old?.directEmployees.map(userItem => convertEmpIdToName(allEmployee, userItem)).join(', ')}
                                                            </div>
                                                            <div><strong>Nhân sự dự phòng: </strong>
                                                                {item?.old?.backupEmployees?.length > 0 ? item?.old?.backupEmployees?.map(userItem => convertEmpIdToName(allEmployee, userItem)).join(', ') : "N/A"}
                                                            </div>
                                                        </td>}
                                                        <td>
                                                            <div><strong>Nhân sự trực tiếp: </strong>
                                                                {item?.new?.directEmployees.map(userItem => {
                                                                    return <span> {/** &cedil; */}
                                                                        <span style={checkInArr(userItem, item?.old?.directEmployees) ? { color: "green", fontWeight: 600 } : { color: "red", fontWeight: 600 }}>{`${convertEmpIdToName(allEmployee, userItem)}`}</span>&#44;
                                                                    </span>
                                                                })}
                                                            </div>
                                                            <div><strong>Nhân sự dự phòng: </strong>
                                                                {item?.new?.backupEmployees?.length > 0 ? item?.new?.backupEmployees?.map(userItem => {
                                                                    return <span> {/** &cedil; */}
                                                                        <span style={checkInArr(userItem, item?.old?.backupEmployees) ? { color: "green", fontWeight: 600 } : { color: "red", fontWeight: 600 }}>{`${convertEmpIdToName(allEmployee, userItem)}`}</span>&#44;
                                                                    </span>
                                                                }) : "N/A"}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </>}
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
