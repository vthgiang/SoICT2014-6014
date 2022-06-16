import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import CreateBiddingContract from '../../bidding-contract/component/createContract'
import CreateProjectByContractModal from '../../bidding-contract/component/createProjectByContractModal'

const ContractBidProjectRelation = (props) => {
    const { biddingPackagesManager, biddingContract, project } = props;
    const [selectedTab, setSelectedTab] = useState("contract-bid");
    const [state, setState] = useState({});

    const { currentRow, currentRowContract } = state;

    const handleCreateContract = (value) => {
        setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        setTimeout(() => {
            window.$(`#modal-create-package-biddingContract-${value._id}`).modal('show');
        }, 500);
    }

    const handleCreateProject = (value) => {
        setState({
            ...state,
            currentRowContract: value
        });
        setTimeout(() => {
            window.$(`#modal-create-project-for-contract--${value._id}`).modal('show');
        }, 500);
    }

    const formatTimeOfEffection = (unitOfTime, effectiveDate, endDate) => {
        let result = 100
        let fmEndDate = moment(endDate)
        let fmEffDate = moment(effectiveDate)
        result = fmEndDate.diff(fmEffDate, unitOfTime, true)

        return result.toFixed(2)
    }

    const numOfBP = biddingPackagesManager.listActiveBiddingPackage.filter(x => x?.hasContract === false).length || 0;
    let numOfCT = biddingContract.listBiddingContractStatistic.filter(x => x?.project === null || x?.project === undefined).length || 0;

    useEffect(() => {
        numOfCT = biddingContract.listBiddingContractStatistic.filter(x => x?.project === null || x?.project === undefined).length || 0;
    }, [JSON.stringify(biddingContract.listBiddingContractStatistic)])

    return (
        <div className="box box-primary">
            <div class="box-header with-border">
                <div class="box-title">Thống kê tổng quan</div>
            </div>
            <div className="box-body">
                <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none", marginBottom: 0 }}>
                    {/* Tabbed pane */}
                    <ul className="nav nav-tabs">
                        <li className="active"><a href="#contract-bid" onClick={() => setSelectedTab("contract-bid")} data-toggle="tab">Gói thầu đang thực hiện nhưng chưa có hợp đồng &nbsp;&nbsp;<small className="label label-danger"> {numOfBP} gói</small></a></li>
                        <li ><a href={`#contract-prj`} onClick={() => setSelectedTab(`contract-prj`)} data-toggle="tab">Hợp đồng chưa có dự án phân công thực hiện &nbsp;&nbsp;<small className="label label-danger"> {numOfCT} hợp đồng</small></a></li>
                    </ul>
                    <div className="tab-content">
                        <div className={selectedTab === "contract-bid" ? "active tab-pane" : "tab-pane"} id="contract-bid">

                            {/* From thêm mới hợp đồng */}
                            <CreateBiddingContract
                                id={currentRow ? currentRow._id : ""}
                            />
                            {
                                numOfBP > 0 ? biddingPackagesManager.listActiveBiddingPackage.filter(x => x?.hasContract === false).map((item, index) => {
                                    return <section className="col-lg-12 col-md-12" key={`section-contact-bid-${index}`}>
                                        <div style={{ borderBottom: "1px solid #eee" }}>
                                            <div className="box-header with-border">
                                                <p data-toggle="collapse" data-target={`#contact-bid-${index}`} aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "600", cursor: "pointer" }} onClick={() => {
                                                    window.$(`#arrow-up-contact-bid-${index}`).toggle();
                                                    window.$(`#arrow-down-contact-bid-${index}`).toggle();
                                                }}>
                                                    <span id={`arrow-up-contact-bid-${index}`} className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                                        {`keyboard_arrow_up`}
                                                    </span>
                                                    <span id={`arrow-down-contact-bid-${index}`} className="material-icons" style={{ display: 'none', fontWeight: "bold", marginRight: '10px' }}>
                                                        {`keyboard_arrow_down`}
                                                    </span>
                                                    <span>{item.name}</span>
                                                </p>
                                            </div>
                                            <div className="box-body collapse" data-toggle="collapse" id={`contact-bid-${index}`} style={{ lineHeight: 2 }}>
                                                <div><strong>Tên gói thầu: </strong><span>{item.name}</span></div>
                                                <div><strong>Mã gói thầu: </strong><span>{item.code}</span></div>
                                                <div><strong>Bên mời thầu: </strong><span>{item.customer}</span></div>
                                                <div><strong>Dự toán gói thầu: </strong><span>{item.price} (VND)</span></div>
                                                <a href="" onClick={() => handleCreateContract(item)} className="seemore-task">Tạo hợp đồng cho gói thầu này <i className="fa fa-arrow-right" ></i></a>
                                            </div>
                                        </div>
                                    </section>

                                }) : <span>Các gói thầu đang thực hiện đều đã có hợp đồng!</span>
                            }
                        </div>
                        <div className={selectedTab === "contract-prj" ? "active tab-pane" : "tab-pane"} id="contract-prj">

                            {/* From tạo dự án theo hợp đồng */}
                            {
                                <CreateProjectByContractModal
                                    id={currentRowContract ? currentRowContract._id : null}
                                    data={currentRowContract ? currentRowContract : null}
                                />
                            }
                            {
                                numOfCT > 0 ? biddingContract.listBiddingContractStatistic.filter(x => x?.project === null || x?.project === undefined).map((item, index) => {
                                    return <section className="col-lg-12 col-md-12" key={`section-contract-prj-${index}`}>
                                        <div style={{ borderBottom: "1px solid #eee" }}>
                                            <div className="box-header with-border">
                                                <p data-toggle="collapse" data-target={`#contract-prj-${index}`} aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "600", cursor: "pointer" }} onClick={() => {
                                                    window.$(`#arrow-up-contract-prj-${index}`).toggle();
                                                    window.$(`#arrow-down-contract-prj-${index}`).toggle();
                                                }}>
                                                    <span id={`arrow-up-contract-prj-${index}`} className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                                        {`keyboard_arrow_up`}
                                                    </span>
                                                    <span id={`arrow-down-contract-prj-${index}`} className="material-icons" style={{ display: 'none', fontWeight: "bold", marginRight: '10px' }}>
                                                        {`keyboard_arrow_down`}
                                                    </span>
                                                    <span>{item.name}</span>
                                                </p>
                                            </div>
                                            <div className="box-body collapse" data-toggle="collapse" id={`contract-prj-${index}`} style={{ lineHeight: 2 }}>
                                                <div><strong>Tên hợp đồng: </strong><span>{item.name}</span></div>
                                                <div><strong>Mã hợp đồng: </strong><span>{item.code}</span></div>
                                                <div><strong>Thời hạn hợp đồng: </strong><span>{formatTimeOfEffection(item.unitOfTime, item.effectiveDate, item.endDate)} ({item.unitOfTime})</span></div>
                                                <div><strong>Giá trị hợp đồng: </strong><span>{item.budget} ({item.currenceUnit})</span></div>
                                                <a href="" onClick={() => handleCreateProject(item)} className="seemore-task">Tạo dự án cho hợp đồng này <i className="fa fa-arrow-right" ></i></a>
                                            </div>
                                        </div>
                                    </section>

                                }) : <span>Các hợp đồng đều đã được tạo dự án!</span>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => (state)

const mapDispatchToProps = {
    // getAllBiddingPackage: BiddingPackageManagerActions.getAllBiddingPackage,
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(withTranslate(ContractBidProjectRelation));
export { connectedComponent as ContractBidProjectRelation }
