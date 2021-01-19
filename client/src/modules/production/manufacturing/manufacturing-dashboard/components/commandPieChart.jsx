
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { commandActions } from '../../manufacturing-command/redux/actions';
import { connect } from 'react-redux';

class CommandPieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRole: localStorage.getItem("currentRole")
        }
    }

    componentDidMount() {
        this.props.getNumberCommandsStatus({ currentRole: this.state.currentRole })
    }

    pieChart = (translate, commandNumberStatus) => {
        let chart = c3.generate({
            bindto: this.refs.quantityCommandStatus,

            data: {
                columns: [
                    [translate('manufacturing.command.6.content'), commandNumberStatus.command6 ? commandNumberStatus.command6 : 0],
                    [translate('manufacturing.command.1.content'), commandNumberStatus.command1 ? commandNumberStatus.command1 : 0],
                    [translate('manufacturing.command.2.content'), commandNumberStatus.command2 ? commandNumberStatus.command2 : 0],
                    [translate('manufacturing.command.3.content'), commandNumberStatus.command3 ? commandNumberStatus.command3 : 0],
                    [translate('manufacturing.command.4.content'), commandNumberStatus.command4 ? commandNumberStatus.command4 : 0],
                    [translate('manufacturing.command.5.content'), commandNumberStatus.command5 ? commandNumberStatus.command5 : 0],
                ],
                type: 'pie',
            },

            pie: {
                label: {
                    format: function (value, ratio, id) {
                        return value;
                    }
                }
            },

            color: {
                pattern: [
                    translate('manufacturing.command.6.color'),
                    translate('manufacturing.command.1.color'),
                    translate('manufacturing.command.2.color'),
                    translate('manufacturing.command.3.color'),
                    translate('manufacturing.command.4.color'),
                    translate('manufacturing.command.5.color'),
                ]
            },

            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            tooltip: {
                format: {
                    title: function (d) { return d; },
                    value: function (value) {
                        return value;
                    }
                }
            },

            legend: {
                show: true
            }
        });
    }

    render() {
        const { translate, manufacturingCommand } = this.props;
        let commandNumberStatus = {}
        if (manufacturingCommand.commandNumberStatus && manufacturingCommand.isLoading === false) {
            commandNumberStatus = manufacturingCommand.commandNumberStatus
        }
        this.pieChart(translate, commandNumberStatus);
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <i className="fa fa-bar-chart-o" />
                        <h3 className="box-title">
                            {translate('manufacturing.command.command_number_status')}
                        </h3>
                        <div ref="quantityCommandStatus"></div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    const { manufacturingCommand } = state;
    return { manufacturingCommand }
}

const mapDispatchToProps = {
    getNumberCommandsStatus: commandActions.getNumberCommandsStatus
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CommandPieChart));