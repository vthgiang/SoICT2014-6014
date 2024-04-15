import React, { useState } from "react";
import RetrainingModel from "./retrainingModel";

function OnTimePredictModelManagement() {
    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setModal(!modal);
        console.log(modal)
    };
    const handleRetraining = () => {
        window.$(`#modal-retraining-model`).modal('show')
        // setShowModal(true);
    }

    return (
        <React.Fragment>
            <button onClick={() => handleRetraining()} type="button" className="btn btn-info dropdown-toggle pull-right">Huấn luyện lại mô hình</button>
            <RetrainingModel showModal={showModal} setShowModal={setShowModal} />
            {/* {modal && (
                <div className="modal">
                    <div onClick={toggleModal} className="overlay"></div>
                    <div>
                        <h2>Hello Modal</h2>
                        <button className="close-modal" onClick={toggleModal}>
                            CLOSE
                        </button>
                    </div>
                </div>
            )} */}
            <div className="col-md-3" style={{ marginTop: "30px", marginBottom: "30px" }}>
                <i className="fa fa-usd" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%" }}></i>
                {"Số lượng đầu vào: " + 11}
            </div>
            <div className="col-md-3" style={{ marginTop: "30px", marginBottom: "30px" }}>
                <i className="fa fa-usd" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%" }}></i>
                {"Số lượng trường dữ liệu: " + 96439}
            </div>
            <div className="col-md-3" style={{ marginTop: "30px", marginBottom: "30px" }}>
                <i className="fa fa-usd" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%" }}></i>
                {"Số lượng siêu tham số:  " + 3}
            </div>
            <table className="table table-hover table-striped table-bordered" style={{ marginTop: '10px' }}>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Kích cỡ dữ liệu huấn luyện</th>
                        <th>Random State</th>
                        <th>Precision</th>
                        <th>Recall</th>
                        <th>f1 score</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr >
                        <td>1</td>
                        <td>85%</td>
                        {/* <td>{journey.data.totalDistance}</td> */}
                        <td>0.42</td>
                        <td>0.89</td>
                        <td>0.92</td>
                        <td>0.92</td>
                        <td style={{ textAlign: "center" }}>
                            <a className="text-blue"><i className="material-icons">visibility</i></a>
                            <a className="text-green"><i className="material-icons">check_circle</i></a>
                        </td>
                    </tr>
                    <tr >
                        <td>2</td>
                        <td>85%</td>
                        {/* <td>{journey.data.totalDistance}</td> */}
                        <td>0.42</td>
                        <td>0.85</td>
                        <td>0.92</td>
                        <td>0.92</td>
                        {/* <td>
                                        Chưa giao
                                    </td> */}
                        <td style={{ textAlign: "center" }}>
                            <a className="text-blue"><i className="material-icons">visibility</i></a>
                            <a className="text-green"><i className="material-icons">check_circle</i></a>
                        </td>
                    </tr>

                </tbody>
            </table>
        </React.Fragment>
    )
}

export default OnTimePredictModelManagement;