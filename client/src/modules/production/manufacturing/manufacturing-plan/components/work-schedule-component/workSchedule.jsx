import React, { Component } from 'react';
import './workSchedule.css';

class WorkSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { checked } = this.state;
        const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
        return (
            <div className="box box-primary" style={{ border: "1px solid black" }}>
                <div className="box-header with-border">
                    <div className="box-title">Lịch sản xuất xưởng thuốc nước tháng 10/2020</div>
                    <div className="box-content" style={{ marginTop: "1rem" }}>
                        <table className="plan-table-custom plan-table-custom-bordered">
                            <thead>
                                <tr>
                                    <th rowSpan={2} style={{ backgroundColor: "#F0F0F0", width: "10%" }}>Ca</th>
                                    <th colSpan={days.length} style={{ backgroundColor: "#fff", color: "#FFFFFF" }}>October 2020</th>
                                </tr>
                                <tr>
                                    {
                                        days.map((day, index) => (
                                            <td key={index}>{day}</td>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Ca 1</td>
                                    {
                                        days.map((day, index) => (
                                            <td key={index}>
                                                <div className="plan-checkbox-custom">
                                                    <input type="checkbox" onChange={() => this.handleCheckBoxChange()} />
                                                </div>
                                            </td>

                                        ))
                                    }
                                </tr>
                                <tr>
                                    <td>Ca 2</td>
                                    {
                                        days.map((day, index) => (
                                            <td key={index}>
                                                <div className="plan-checkbox-custom">
                                                    <input type="checkbox" onChange={() => this.handleCheckBoxChange('shift1s', index)} />
                                                </div>
                                            </td>
                                        ))
                                    }
                                </tr>
                                <tr>
                                    <td>Tăng ca</td>
                                    {
                                        days.map((day, index) => (
                                            <td key={index}>
                                                <div className="plan-checkbox-custom">
                                                    <input type="checkbox" onChange={() => this.handleCheckBoxChange('shift1s', index)} />
                                                </div>
                                            </td>
                                        ))
                                    }
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        )
    }
}

export default WorkSchedule;