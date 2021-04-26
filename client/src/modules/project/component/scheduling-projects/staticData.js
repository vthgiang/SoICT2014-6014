
export const fakeArr = [
    {
        "code": "A",
        "estimateOptimisticTime": 5,
        "estimateNormalTime": 6,
        "estimatePessimisticTime": 7,
        "predecessors": [],
        estimateNormalCost: 100000,
        estimateMaxCost: 105000,
    },
    {
        "code": "B",
        "estimateOptimisticTime": 1,
        "estimateNormalTime": 3,
        "estimatePessimisticTime": 5,
        "predecessors": [],
        estimateNormalCost: 100000,
        estimateMaxCost: 105000,
    },
    {
        "code": "C",
        "estimateOptimisticTime": 1,
        "estimateNormalTime": 4,
        "estimatePessimisticTime": 7,
        "predecessors": [],
        estimateNormalCost: 100000,
        estimateMaxCost: 105000,
    },
    {
        "code": "D",
        "estimateOptimisticTime": 1,
        "estimateNormalTime": 2,
        "estimatePessimisticTime": 3,
        "predecessors": [
            "A"
        ],
        estimateNormalCost: 100000,
        estimateMaxCost: 105000,
    },
    {
        "code": "E",
        "estimateOptimisticTime": 1,
        "estimateNormalTime": 2,
        "estimatePessimisticTime": 9,
        "predecessors": [
            "B"
        ],
        estimateNormalCost: 100000,
        estimateMaxCost: 105000,
    },
    {
        "code": "F",
        "estimateOptimisticTime": 1,
        "estimateNormalTime": 5,
        "estimatePessimisticTime": 9,
        "predecessors": [
            "C"
        ],
        estimateNormalCost: 100000,
        estimateMaxCost: 105000,
    },
    {
        "code": "G",
        "estimateOptimisticTime": 2,
        "estimateNormalTime": 2,
        "estimatePessimisticTime": 8,
        "predecessors": [
            "C"
        ],
        estimateNormalCost: 100000,
        estimateMaxCost: 105000,
    },
    {
        "code": "H",
        "estimateOptimisticTime": 4,
        "estimateNormalTime": 4,
        "estimatePessimisticTime": 10,
        "predecessors": [
            "E",
            "F"
        ],
        estimateNormalCost: 100000,
        estimateMaxCost: 105000,
    },
    {
        "code": "I",
        "estimateOptimisticTime": 2,
        "estimateNormalTime": 5,
        "estimatePessimisticTime": 8,
        "predecessors": [
            "D"
        ],
        estimateNormalCost: 100000,
        estimateMaxCost: 105000,
    },
    {
        "code": "J",
        "estimateOptimisticTime": 2,
        "estimateNormalTime": 2,
        "estimatePessimisticTime": 8,
        "predecessors": [
            "H",
            "G"
        ],
        estimateNormalCost: 100000,
        estimateMaxCost: 105000,
    }
]

export const fakeObj = {
    "A": {
        "id": "A",
        "optimisticTime": 5,
        "mostLikelyTime": 6,
        "pessimisticTime": 7,
        "predecessors": []
    },
    "B": {
        "id": "B",
        "optimisticTime": 1,
        "mostLikelyTime": 3,
        "pessimisticTime": 5,
        "predecessors": []
    },
    "C": {
        "id": "C",
        "optimisticTime": 1,
        "mostLikelyTime": 4,
        "pessimisticTime": 7,
        "predecessors": []
    },
    "D": {
        "id": "D",
        "optimisticTime": 1,
        "mostLikelyTime": 2,
        "pessimisticTime": 3,
        "predecessors": [
            "A"
        ]
    },
    "E": {
        "id": "E",
        "optimisticTime": 1,
        "mostLikelyTime": 2,
        "pessimisticTime": 9,
        "predecessors": [
            "B"
        ]
    },
    "F": {
        "id": "F",
        "optimisticTime": 1,
        "mostLikelyTime": 5,
        "pessimisticTime": 9,
        "predecessors": [
            "C"
        ]
    },
    "G": {
        "id": "G",
        "optimisticTime": 2,
        "mostLikelyTime": 2,
        "pessimisticTime": 8,
        "predecessors": [
            "C"
        ]
    },
    "H": {
        "id": "H",
        "optimisticTime": 4,
        "mostLikelyTime": 4,
        "pessimisticTime": 10,
        "predecessors": [
            "E",
            "F"
        ]
    },
    "I": {
        "id": "I",
        "optimisticTime": 2,
        "mostLikelyTime": 5,
        "pessimisticTime": 8,
        "predecessors": [
            "D"
        ]
    },
    "J": {
        "id": "J",
        "optimisticTime": 2,
        "mostLikelyTime": 2,
        "pessimisticTime": 8,
        "predecessors": [
            "H",
            "G"
        ]
    }
}
