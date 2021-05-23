import Swal from 'sweetalert2'

export const showWeeklyPoint = (translate, weeklyEvaluate) => {
    let weeklyPointHtml = ""

    if (weeklyEvaluate?.length > 0) {
        weeklyEvaluate.map(item => {
            weeklyPointHtml = weeklyPointHtml + `<li>${formatTitleWeeklyEvaluate(translate, item?.title)}: <strong>${item?.automaticPoint}</strong> - <strong>${item?.employeePoint}</strong> - <strong>${item?.approvedPoint}</strong></li>`
        })
    } else {
        weeklyPointHtml = `<strong>${translate('task.task_management.not_eval')}</strong>`
    }

    Swal.fire({
        html: `<h3 style="color: red"><div>Kết quả KPI tuần</div> </h3>
        <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
        <p>${translate('kpi.evaluation.employee_evaluation.weekly_point_field')}</b></p>
        <ul>${weeklyPointHtml}</ul>
        </div>`,
        width: "40%",
    })
}

const formatTitleWeeklyEvaluate = (translate, title) => {
    switch (title) {
        case "week1":
            return translate('kpi.evaluation.employee_evaluation.week1')
            break
        case "week2":
            return translate('kpi.evaluation.employee_evaluation.week2')
            break
        case "week3":
            return translate('kpi.evaluation.employee_evaluation.week3')
            break
        case "week4":
            return translate('kpi.evaluation.employee_evaluation.week4')
            break
    }
}