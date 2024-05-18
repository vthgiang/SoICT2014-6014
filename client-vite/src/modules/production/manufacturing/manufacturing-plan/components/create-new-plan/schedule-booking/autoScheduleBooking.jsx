import React, { useState } from "react"
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { Collapse, IconButton } from "@mui/material";
import PlanningGanttChart from "../../../../manufacturing-command/components/planning-gantt-chart";
import moment from "moment";

const RowData = (props) => {
    const { translate, command } = props;
    const [open, setOpen] = useState(false);

    return (
        <>
            <tr>
                <td style={{ textAlign: "center" }}>
                    <IconButton onClick={() => setOpen(!open)}>
                        {open ? (
                            <i className="material-icons">expand_less</i>
                        ) : (
                            <i className="material-icons">expand_more</i>
                        )}
                    </IconButton>
                </td>
                <td>{command.code}</td>
                <td>{command.good.code}</td>
                <td>{command.good.name}</td>
                <td>{command.good.baseUnit}</td>
                <td>{command.quantity}</td>
            </tr>
            <tr>
                <td colSpan={8}>
                    <Collapse in={open}>
                        <table className='table table-striped table-bordered table-hover'>
                            <tbody>
                                <tr>
                                    <td><IconButton /></td>
                                    <td>{translate('manufacturing.plan.index')}</td>
                                    <td className="text-left">{translate('manufacturing.plan.operation')}</td>
                                    <td className="text-left">{translate('manufacturing.plan.mill')}</td>
                                    <td>{translate('manufacturing.plan.hourProduction')}</td>
                                    <td>{translate('manufacturing.plan.worker_num')}</td>
                                </tr>
                                {command.routing.operations.map((operation, index) => {
                                    const workerNum = operation.workers.reduce(
                                        (sum, worker) => sum + worker.number,
                                        0
                                    );
                                    return (
                                        <tr key={index}>
                                            <td><IconButton /></td>
                                            <td>{index + 1}</td>
                                            <td className="text-left">{operation.name}</td>
                                            <td className="text-left">{operation.manufacturingMill.name}</td>
                                            <td>{operation.hourProduction}</td>
                                            <td>{workerNum}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </Collapse>
                </td>
            </tr>
        </>
    )
}

const ManufacturingCommandTable = (props) => {
    const { translate, manufacturingCommands } = props;
    return (
        <table className='table table-striped table-bordered' style={{ marginTop: "1rem" }}>
            <thead>
                <tr>
                    <th></th>
                    <th>{translate('manufacturing.plan.command_code')}</th>
                    <th>{translate('manufacturing.plan.good_code')}</th>
                    <th>{translate('manufacturing.plan.good_name')}</th>
                    <th>{translate('manufacturing.plan.base_unit')}</th>
                    <th>{translate('manufacturing.plan.quantity')}</th>
                </tr>
            </thead>
            <tbody>
                {manufacturingCommands.map((command, index) => (
                    <RowData key={index} translate={translate} command={command} />
                ))}
            </tbody>
        </table>
    )
}

const autoGenerateSchedule = (props) => {
    const { translate, manufacturingCommands, planStartDate, onManufacturingCommandsChange } = props;
    const [scheduleSuccess, setScheduleSuccess] = useState(false);

    // Call API auto schedule
    const scheduleResult = manufacturingCommands.map((command) => {
        let prevEndDate, prevEndHour;

        return {
            ...command,
            completed: true,
            workOrders: command.routing.operations.map((operation, index) => {
                let startDate, endDate, startHour, endHour;
                const requireHour = Math.ceil(command.quantity / operation.hourProduction);
                if (index === 0) {
                    startDate = moment(`${planStartDate} 06`, "DD-MM-YYYY HH");
                    startHour = 6;
                } else {
                    startDate = prevEndDate;
                    startHour = prevEndHour;
                }
                endDate = startDate.clone().add(requireHour, 'hours');
                endHour = (startHour + requireHour) % 24;

                prevEndDate = endDate;
                prevEndHour = endHour;

                return {
                    operationName: operation.name,
                    manufacturingMill: operation.manufacturingMill,
                    startDate: startDate.format("DD-MM-YYYY"),
                    endDate: endDate.format("DD-MM-YYYY"),
                    responsibles: ["663e6721d467e33204316109"],
                    startHour: startHour,
                    endHour: endHour
                }
            })
        }
    })

    const calcTurnFromHour = (hour) => {
        if (hour >= 6 && hour < 14) {
            return 1;
        } else if (hour >= 14 && hour < 22) {
            return 2;
        } else {
            return 3;
        }
    }

    const handleSaveSchedule = () => {
        const newManufacturingCommands = scheduleResult.map((command) => {
            const workOrders = command.workOrders;
            return {
                ...command,
                startDate: workOrders[0].startDate,
                endDate: workOrders[workOrders.length - 1].endDate,
                startTurn: calcTurnFromHour(workOrders[0].startHour),
                endTurn: calcTurnFromHour(workOrders[workOrders.length - 1].endHour),
                workOrders: workOrders.map((wo) => {
                    return {
                        operation: wo.operationName,
                        manufacturingMill: wo.manufacturingMill._id,
                        responsibles: wo.responsibles,
                        machines: [],
                        startDate: wo.startDate,
                        endDate: wo.endDate,
                        startHour: wo.startHour,
                        endHour: wo.endHour
                    }
                })
            }
        });
        onManufacturingCommandsChange(newManufacturingCommands);
    }
    
    return (
        <>
            <div style={{ display: "flex", justifyContent: "end", gap: "1rem" }}>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setScheduleSuccess(true)}
                >
                    {translate('manufacturing.work_schedule.add_work_schedule_button')}
                </button>

                {scheduleSuccess && (
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={handleSaveSchedule}
                    >
                        {translate('manufacturing.work_schedule.save_work_schedule_button')}
                    </button>
                )}
            </div>

            {scheduleSuccess && (
                <div style={{ clear: "right", marginBottom: "1rem" }}>
                    <PlanningGanttChart listCommands={scheduleResult} />
                </div>
            )}
            <ManufacturingCommandTable
                translate={translate}
                manufacturingCommands={manufacturingCommands}
            />
        </>
    )
}


export default connect(null, null)(withTranslate(autoGenerateSchedule));
