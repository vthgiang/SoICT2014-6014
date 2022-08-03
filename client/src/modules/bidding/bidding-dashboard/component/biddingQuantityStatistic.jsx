import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import c3 from 'c3';
import 'c3/c3.css';

const BiddingStatusQuantityStatistic = (props) => {
    const { biddingPackagesManager, biddingContract, project } = props;
    const refBiddingStatusByQuantity = React.createRef();

    const numofBP = biddingPackagesManager.totalList;
    const numOfContract = biddingContract.totalList;
    const numOfPrj = biddingContract.listBiddingContractStatistic.filter(x => x.project !== null)?.length ?? project.data.totalDocs;

    const setDataChart = () => {
        let bidColumns, categories;

        categories = ["Hoạt động", "Ngưng hoạt động", "Đang chờ kết quả dự thầu", "Đang thực hiện", "Hoàn thành"];
        bidColumns = [];
        // 1: hoạt động, 0: ngưng hoạt động, 2: đang chờ kết quả dự thầu, 3: Đang thực hiện gói thầu, 4:hoàn thành
        const numberOfActive = biddingPackagesManager?.listBiddingPackages.filter(x => x.status === 1)?.length;
        const numberOfInactive = biddingPackagesManager?.listBiddingPackages.filter(x => x.status === 0)?.length;
        const numberOfWaitForBidding = biddingPackagesManager?.listBiddingPackages.filter(x => x.status === 2)?.length;
        const numberOfInProcess = biddingPackagesManager?.listBiddingPackages.filter(x => x.status === 3)?.length;
        const numberOfComplete = biddingPackagesManager?.listBiddingPackages.filter(x => x.status === 4)?.length;

        bidColumns=["Số lượng gói thầu theo trạng thái", numberOfActive, numberOfInactive, numberOfWaitForBidding, numberOfInProcess, numberOfComplete];

        return {
            dataChart: [bidColumns],
            categories: categories,
        }
    }

    const removePreviousChart = () => {
        const chart = refBiddingStatusByQuantity.current;

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild)
            }
        }
    };

    const renderChart = () => {
        removePreviousChart();
        const { translate } = props;

        let { dataChart, categories } = setDataChart();

        let chart = c3.generate({
            bindto: refBiddingStatusByQuantity.current,

            padding: {
                top: 20,
                bottom: 20,
                right: 20
            },

            data: {
                columns: dataChart,
                type: "bar",
                labels: true,
            },
            bar: {
                width: {
                    ratio: 0.2
                }
            },

            axis: {
                x: {
                    type: 'categories',
                    categories: categories,
                    label: "Trạng thái"
                },
                y: {
                    label: "Số lượng gói thầu",
                },
            },

            zoom: {
                enabled: false
            }
        });
    };

    useEffect(() => {
        renderChart();
    }, [JSON.stringify(biddingPackagesManager)])

    return (
        <div className='box'>
            <div className="box-header with-border">
                <div className="box-title">Thống kê trạng thái gói thầu</div>
            </div>
            <div className="box-body">
                <section ref={refBiddingStatusByQuantity}></section>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => (state)

const mapDispatchToProps = {}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(withTranslate(BiddingStatusQuantityStatistic));
export { connectedComponent as BiddingStatusQuantityStatistic }
