const {
    ManufacturingMetric,
    TaskTemplate,
    OrganizationalUnit,
    ManufacturingWorks,
    ManufacturingCommand

} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);

function formatToTimeZoneDate(stringDate) {
    let dateArray = stringDate.split("-");
    if (dateArray.length == 3) {
        let day = dateArray[0];
        let month = dateArray[1];
        let year = dateArray[2];
        return `${year}-${month}-${day}`
    }
    else if (dateArray.length == 2) {
        let month = dateArray[0];
        let year = dateArray[1];
        return `${year}-${month}`
    }
}

// lấy ra giá trị của element trong các task
const getElementValueOfTasks = (tasks, elementCode) => {
    const now = new Date();
    return tasks.flatMap(task => {
        return task.taskInformations.flatMap(info => {
            if (info.code === elementCode && info.type === 'number' && info.value) {
                const startDate = new Date(task.startDate)
                const endDate = new Date(task.endDate)
                const effectiveEndDate = endDate > now ? now : endDate
                const days = Math.ceil((effectiveEndDate - startDate) / (1000 * 60 * 60 * 24))
                const dailyValue = info.value / days

                return Array.from({ length: days }, (_, i) => {
                    const date = new Date(startDate)
                    date.setDate(date.getDate() + i)

                    return {
                        recordDate: date,
                        value: dailyValue
                    }
                })
            }

            return []

        }).filter(record => record !== undefined);
    }, [])
}

// lấy ra các task và element trong các task
const getElementRecord = async (currentRole, portal, element) => {
    const organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal))
        .findOne({ 'managers': currentRole });
    const manufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal))
        .findOne({ 'organizationalUnit': organizationalUnit._id });
    const listMillIds = manufacturingWorks.manufacturingMills
    const [elementType, elementCode] = element.split('.'); 
    
    const manufacturingCommands = await ManufacturingCommand(connect(DB_CONNECTION, portal))
        .find({
            'status': { $in: [3, 4] }, // 'Đang thực hiện', 'Đã hoàn thành
            'workOrders': {
                $elemMatch: {
                    'manufacturingMill': {
                        $in: listMillIds
                    }
                }
            }
        })
        .populate([{
            path: 'workOrders.tasks.task',
            select: 'startDate endDate taskInformations',
            match: { progress: { $gt: 0 }}
        }, {
            path: 'workOrders.qualityControlTasks',
            select: 'startDate endDate taskInformations',
            match: { progress: { $gt: 0 }}
        }])

    let tasks = [];
    let qualityControlTasks = [];
    
    for (let command of manufacturingCommands) {
        for (let workOrder of command.workOrders) {
            if (workOrder.qualityControlTasks) {
                qualityControlTasks.push(...workOrder.qualityControlTasks);
            }
            
            for (let task of workOrder.tasks) {
                if (task.task) {
                    tasks.push(task.task);
                }
            }
        }
    }


    if (elementType === 'responsible') {
        return getElementValueOfTasks(tasks, elementCode);
    } else if (elementType === 'qualityControl') {
        return getElementValueOfTasks(qualityControlTasks, elementCode);
    }
}

const processKpiValue = async (data, portal) => {
    const { currentRole, metric, period } = data

    const elements = metric.formula.match(/\b\w+\.\w+\b/g);

    /* 
        tạo map chứa giá trị của các element
        key: code của element
        value: map chứa các giá trị của element theo period
        labels: các period (ngày, tháng, quý, năm) của kpi
    */
    const elementMaps = {}
    let labels = []
    for (const element of elements) {
        const elementRecords = await getElementRecord(currentRole, portal, element) || []
        const elementCode = element.split('.')[1]
        elementMaps[elementCode] = new Map()

        elementRecords.forEach(record => {
            const recordDate = record.recordDate
            let label;
            if (period === 'month') {
                label = `${recordDate.getMonth() + 1}-${recordDate.getFullYear()}`
            } else if (period === 'quater') {
                label = `Q${Math.floor(recordDate.getMonth() / 3) + 1}-${recordDate.getFullYear()}`
            } else if (period === 'year') {
                label = `${recordDate.getFullYear()}`
            } else {
                label = `${recordDate.getDate()}-${recordDate.getMonth() + 1}-${recordDate.getFullYear()}`
            }
    
            labels.push(label)
            const sum = (elementMaps[elementCode].get(label) || 0) + record.value
            elementMaps[elementCode].set(label, sum)
        })
    }

    labels = [...new Set(labels)].sort();

    const kpiValues = labels.map(label => {
        let formula = metric.formula;
        for (let element of elements) {
            elementCode = element.split('.')[1];
            const value = elementMaps[elementCode].get(label);

            // thay thế giá trị của element vào công thức kpi
            formula = formula.replace(new RegExp(`\\b${element}\\b`, 'g'), value);
        }

        let result = eval(formula);
        if (metric.unit === '%') {
            result =  result * 100;
        }

        return result.toFixed(2);
    })

    // khởi tạo trend của kpi
    const trend = {
        value: 0,
        direction: 'up'
    }

    // tính toán trend của kpi của data point hiện tại so với data point trước đó
    if (kpiValues.length > 1) {
        const currenKPIValue = kpiValues[kpiValues.length - 1]
        const preKPIValue = kpiValues[kpiValues.length - 2]
        trend.value = (currenKPIValue - preKPIValue) / preKPIValue * 100
        trend.direction = currenKPIValue > preKPIValue ? 'up' : 'down'
        trend.value = trend.value.toFixed(2)
    }

    return { labels, kpiValues, trend }
}

exports.getAllManufacturingKpis = async (query, portal) => {
    const { currentRole, period } = query
    let metrics = await ManufacturingMetric(connect(DB_CONNECTION, portal)).find()
    
    let docs = []
    for (let i = 0; i < metrics.length; i++) {
        const metric = metrics[i];
        const data = {
            currentRole,
            metric,
            period
        }

        const { labels, kpiValues, trend } = await processKpiValue(data, portal)
        
        docs.push({
            _id: metric._id,
            code: metric.code,
            name: metric.name,
            category: metric.category,
            unit: metric.unit,
            target: metric.target,
            trend,
            dataGrid: metric.dataGrid,
            customize: metric.customize,
            widget: metric.widget,
            values: kpiValues,
            labels
        })
    }

    let manufacturingMetrics = {}
    manufacturingMetrics.docs = docs
    
    return { manufacturingMetrics }
}

exports.getManufacturingKpiById = async (metricId, currentRole, portal) => {
    let metric = await ManufacturingMetric(connect(DB_CONNECTION, portal))
        .findById(metricId)
        .populate([{
            path: 'actions.responsibles',
            select: 'name'
        }])

    const data = {
        currentRole,
        metric,
        period: 'day'
    }
    
    const { labels, kpiValues, trend } = await processKpiValue(data, portal)

    const manufacturingMetric = {
        _id: metric._id,
        code: metric.code,
        name: metric.name,
        category: metric.category,
        unit: metric.unit,
        target: metric.target,
        alerts: metric.alerts,
        thresholds: metric.thresholds,
        failureCauses: metric.failureCauses,
        actions: metric.actions,
        dataGrid: metric.dataGrid,
        customize: metric.customize,
        widget: metric.widget,
        trend,
        values: kpiValues,
        labels
    }

    return { manufacturingMetric }
}

exports.createManufacturingKpi = async (data, portal) => {
    let manufacturingMetric = await ManufacturingMetric(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        name: data.name,
        description: data.description? data.description : '',
        category: data.category,
        unit: data.unit,
        target: data.target,
        thresholds: data.thresholds? data.thresholds : [],
        creator: data.creator,
        type: 1, // default new metric is KPI
        formula: data.formula,
    })

    await manufacturingMetric.save()

    return { manufacturingMetric }
}

exports.editManufacturingKpis = async (data, portal) => {
    const { listKpis } = data

    for (let kpi of listKpis) {
        let metric = await ManufacturingMetric(connect(DB_CONNECTION, portal)).findById(kpi._id)
        metric.displayName = kpi.displayName ? kpi.displayName : metric.displayName
        metric.description = kpi.description ? kpi.description : metric.description
        metric.target = kpi.target ? kpi.target : metric.target
        metric.unit = kpi.unit ? kpi.unit : metric.unit
        metric.category = kpi.category ? kpi.category : metric.category
        metric.thresholds = kpi.thresholds ? kpi.thresholds : metric.thresholds
        metric.dataGrid = kpi.dataGrid ? kpi.dataGrid : metric.dataGrid
        metric.customize = kpi.customize ? kpi.customize : metric.customize
        metric.widget = kpi.widget ? kpi.widget : metric.widget

        await metric.save()
    }

    let metrics = await ManufacturingMetric(connect(DB_CONNECTION, portal)).find()

    return { manufacturingMetrics: metrics }
}

exports.editManufacturingKpi = async (id, data, portal) => {
    let manufacturingMetric = await ManufacturingMetric(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([{
            path: 'actions.responsibles',
            select: 'name'
        }])
    
    if (data.action) {
        manufacturingMetric.actions.push({
            ...data.action,
            startDate: formatToTimeZoneDate(data.action.startDate),
            endDate: formatToTimeZoneDate(data.action.endDate),
            milestones: data.action.milestones.map(milestone => ({
                ...milestone,
                time: formatToTimeZoneDate(milestone.time)
            }))
        })
    } 

    manufacturingMetric.actions = data.actions ? data.actions : manufacturingMetric.actions
    manufacturingMetric.failureCauses = data.failureCauses ? data.failureCauses : manufacturingMetric.failureCauses

    await manufacturingMetric.save()

    const newManufacturingMetric = await ManufacturingMetric(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([{
            path: 'actions.responsibles',
            select: 'name'
        }])

    return { manufacturingMetric: newManufacturingMetric }
}

// lấy ra tất cả các phần tử báo cáo trong taskTemplate
exports.getAllReportElements = async (query, portal) => {
    const currentRole = query.currentRole

    const taskTemplates = await TaskTemplate(connect(DB_CONNECTION, portal))
        .find({
            readByEmployees: currentRole
        })
    
    const reportElements = []
    const taskType = ['responsible', 'qualityControl']

    taskTemplates.forEach((taskTemplate, index) => {
        const taskInformations = taskTemplate.taskInformations
        taskInformations.forEach(taskInformation => {
            const element = {
                code: `${taskType[index]}.${taskInformation.code}`,
                name: taskInformation.name,
                type: taskInformation.type,
            }
            reportElements.push(element)
        })
    })

    return { reportElements }
}
