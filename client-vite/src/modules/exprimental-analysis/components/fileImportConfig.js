export const getRiskDatasetFromExcelFileConfig = (numOfRisks)=>{
    let riskDataSet = {
        sheets: {
            description: "Tên các sheet",
            value: ["Risk Dataset"]
        },
        rowHeader: {
            description: "Số dòng tiêu đề của bảng",
            value: 1
        },
        human: {
            columnName: "human",
            description: "human của các công việc",
            value: "human"
        },
        equipment: {
            columnName: "equipment",
            description: "equipment của các công việc",
            value: "equipment"
        },
        product: {
            columnName: "product",
            description: "product của các công việc",
            value: "product"
        },
        enviroment: {
            columnName: "enviroment",
            description: "enviroment của các công việc",
            value: "enviroment"
        },
    }
    for(let i=1;i<=numOfRisks;i++){
        riskDataSet[i.toString()]={
            columnName: i.toString(),
            description: "Risk Data",
            value: i.toString()
        }
    }
    return riskDataSet
}
export const taskDatasetInput = {
    sheets: {
        description: "Tên các sheet",
        value: ["Task Dataset"]
    },
    rowHeader: {
        description: "Số dòng tiêu đề của bảng",
        value: 1
    },
    A: {
        columnName: "A",
        description: "A của các công việc",
        value: "A"
    },
    B: {
        columnName: "B",
        description: "B của các công việc",
        value: "B"
    },
    C: {
        columnName: "C",
        description: "C của các công việc",
        value: "C"
    },
    D: {
        columnName: "D",
        description: "D của các công việc",
        value: "D"
    },
    E: {
        columnName: "E",
        description: "E của các công việc",
        value: "E"
    },
    F: {
        columnName: "F",
        description: "F của các công việc",
        value: "F"
    },
    G: {
        columnName: "G",
        description: "G của các công việc",
        value: "G"
    },
    H: {
        columnName: "H",
        description: "H của các công việc",
        value: "H"
    },
    I: {
        columnName: "I",
        description: "I của các công việc",
        value: "I"
    },

}
export const pertDataInputConfig = {
    sheets: {
        description: "Tên các sheet",
        value: ["PERT"]
    },
    rowHeader: {
        description: "Số dòng tiêu đề của bảng",
        value: 1
    },
    ID: {
        columnName: "ID",
        description: "ID của các công việc",
        value: "ID"
    },
    optimistic: {
        columnName: "optimistic",
        description: "optimistic của các công việc",
        value: "optimistic"
    },
    mostlikely: {
        columnName: "mostlikely",
        description: "mostlikely của các công việc",
        value: "mostlikely"
    },
    pessimistic: {
        columnName: "pessimistic",
        description: "pessimistic của các công việc",
        value: "pessimistic"
    },
    predecessor: {
        columnName: "predecessor",
        description: "predecessor của các công việc",
        value: "predecessor"
    },
    duration: {
        columnName: "duration",
        description: "duration của các công việc",
        value: "duration"
    }
}
export const taskInformation = {
    sheets: {
        description: "Tên các sheet",
        value: ["Task Information"]
    },
    rowHeader: {
        description: "Số dòng tiêu đề của bảng",
        value: 1
    },
    id: {
        columnName: "ID",
        description: "No của các công việc",
        value: "ID"
    },
    name:{
        columnName: "Name",
        description: "No của các công việc",
        value: "Name"
    },
    riskClass:{
        columnName: "riskClass",
        description: "No của các công việc",
        value: "riskClass"
    }
}
export const riskInformation ={
    sheets: {
        description: "Tên các sheet",
        value: ["Risk Information"]
    },
    rowHeader: {
        description: "Số dòng tiêu đề của bảng",
        value: 1
    },
    id: {
        columnName: "No",
        description: "No của các công việc",
        value: "No"
    },
    name: {
        columnName: "Risk factors",
        description: "name của các công việc",
        value: "Risk factors"
    },
    class: {
        columnName: "Class",
        description: "class của các công việc",
        value: "Class"
    },
    classID:{
        columnName: "ClassID",
        description: "class của các công việc",
        value: "ClassID"
    }

}