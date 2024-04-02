import React, { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

function GoodListInTransportRequest(props) {

    const EMPTY_GOOD = {
        goodId: "1",
        goodObject: "",
        quantity: "",
        baseUnit: "",
        type: "0",
    };

    const [state, setState] = useState({
        listGoodsByType: [],
        good: Object.assign({}, EMPTY_GOOD),
        editGood: false,
        indexEditting: "",
    });

    const { translate, listGoods } = props;
    const { listGoodsByType, requestId, errorType } = state;
    useEffect(() => {
        if (listGoods) {
            setState({
                ...state,
                listGoodsByType: listGoods
            })
        }
    }, [listGoods]);
    return (
        <React.Fragment>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>{translate('production.request_management.index')}</th>
                        <th>{translate('production.request_management.good_code')}</th>
                        <th>{translate('production.request_management.good_name')}</th>
                        <th>{translate('production.request_management.good_base_unit')}</th>
                        <th>{translate('production.request_management.quantity')}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (!listGoodsByType || listGoodsByType.length === 0) ?
                            <tr>
                                <td colSpan={6}>
                                    <center>{translate('confirm.no_data')}</center>
                                </td>
                            </tr>
                            :
                            listGoodsByType.map((good, index) => {
                                return <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{good.goodObject.code}</td>
                                    <td>{good.goodObject.name}</td>
                                    <td>{good.goodObject.baseUnit}</td>
                                    <td>{good.quantity}</td>
                                </tr>
                            })
                    }
                </tbody>
            </table>
        </React.Fragment >
    );
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodListInTransportRequest));