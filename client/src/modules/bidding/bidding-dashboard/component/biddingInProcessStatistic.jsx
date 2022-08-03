import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { SelectBox } from '../../../../common-components'
import { genStepAuto } from './functionHelper'

const BiddingInProcessStatistic = (props) => {
    const { biddingPackagesManager, biddingContract } = props;
    const listBiddingPackages = biddingPackagesManager?.listBiddingPackages.filter(x => x.status !== 0);

    const [state, setState] = useState({
        bid: listBiddingPackages[0],
        currentStep: 0,
        steps: [
            {
                label: "Tìm kiếm HSMT",
                active: true,
            },
            {
                label: "Tạo HSDT",
                active: false,
            },
            {
                label: "Tạo hợp đồng",
                active: false,
            },
            {
                label: "Thực hiện dự án",
                active: false,
            },
            {
                label: "Kết Tthúc DA - TLHĐ",
                active: false,
            },
        ]
    })

    useEffect(() => {
        let bp = listBiddingPackages[0];
        if (bp) {
            const stepAuto = genStepAuto(bp, biddingContract.listBiddingContractStatistic);
            setState({
                ...state,
                bid: bp,
                currentStep: stepAuto.currentStep,
                steps: stepAuto.steps,
            })
        }
    }, [JSON.stringify(listBiddingPackages), JSON.stringify(biddingContract.listBiddingContractStatistic)]);

    const handleChangeBiddingPackage = (value) => {
        if (value.length === 0) {
            value = null
        };
        let bp = biddingPackagesManager?.listBiddingPackages?.find(x => x._id == value[0])
        if (bp) {
            const stepAuto = genStepAuto(bp, biddingContract.listBiddingContractStatistic);
            setState({
                ...state,
                bid: bp,
                currentStep: stepAuto.currentStep,
                steps: stepAuto.steps,
            })
        }
        else {
            setState({
                ...state,
                bid: null,
            })
        }
    }

    const { bid, currentStep, steps } = state;

    return (
        <div className="box box-primary">
            <div className="box-header with-border">
                <div className="box-title">Thống kê theo quy trình đấu thầu - thực hiện gói thầu</div>
            </div>
            <div className="box-body qlcv">
                <div className="form-inline" style={{ marginBottom: 15 }}>
                    {/* Tên gói thầu */}
                    <div className="form-group">
                        <label className="form-control-static">Chọn gói thầu</label>
                        <SelectBox
                            id={`process-select-package-statistic`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={listBiddingPackages?.map(x => {
                                return { text: x.name, value: x._id }
                            })}
                            options={{ placeholder: "Chọn gói thầu" }}
                            onChange={handleChangeBiddingPackage}
                            value={bid?._id}
                            multiple={false}
                        />
                    </div>
                </div>

                {bid && (
                    <div>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <span><a href={`/bidding/bidding-package?id=${bid._id}`} target="_blank"> Xem thông tin chi tiết gói thầu </a></span>
                        </div>
                        <br />

                        <div className="timeline">
                            <div className="timeline-progress" style={{ width: `${(currentStep * 100) / (steps.length - 1)}%` }}></div>
                            <div className="timeline-items">
                                {steps.map((item, index) => (
                                    <div
                                        className={`timeline-item ${item.active ? "active" : ""}`}
                                        key={index}
                                    >
                                        <div className="timeline-contain">{item.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>
    )
}

const mapStateToProps = (state) => (state)

const mapDispatchToProps = {
    // getAllBiddingPackage: BiddingPackageManagerActions.getAllBiddingPackage,
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(withTranslate(BiddingInProcessStatistic));
export { connectedComponent as BiddingInProcessStatistic }
