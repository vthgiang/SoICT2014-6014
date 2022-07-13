
const handleChangeTagForm = (key, e) => {
    let { value } = e.target;

    setState({
        ...state,
        currentTag: {
            ...state.currentTag,
            [key]: value
        }
    })
}
const handleChangeTagEmployee = (key, value) => {
    setState({
        ...state,
        currentTag: {
            ...state.currentTag,
            [key]: value
        }
    })
}

const handleDeleteTask = (listIndex) => {
    let newList = proposals.tags
    newList.splice(listIndex, 1)

    let newProposal = {
        ...proposals,
        tags: newList,
    }
    setProposals(newProposal);
    props.handleChange("proposals", newProposal);
}

const handleResetTask = () => {
    setState({
        ...state,
        type: ADD_TYPE,
        currentTag: initTag,
        currentTagIndex: null
    })
}

const handleCancel = () => {
    setState({
        ...state,
        type: ADD_TYPE,
        currentTag: initTag,
        currentTagIndex: null
    })
}

const handleEditTask = (listIndex) => {
    setState({
        ...state,
        type: EDIT_TYPE,
        currentTag: proposals.tags[listIndex],
        currentTagIndex: listIndex
    })
}

const handleSaveTask = (listIndex) => {
    let unitTime = proposals.unitOfTime;
    let { currentTag } = state;
    let newList = proposals.tags.map((x, idx) => {

        if (idx === listIndex) {
            x = { ...currentTag }
        }
        return x;
    })

    let newProposal = {
        ...proposals,
        tags: newList,
    }

    setState({
        ...state,
        type: ADD_TYPE,
        currentTag: initTag,
        currentTagIndex: null
    })
    setProposals(newProposal);
    props.handleChange("proposals", newProposal);
}

const handleAddTask = () => {
    let { currentTag } = state
    let newList = proposals.tags

    newList.push(currentTag)

    let newProposal = {
        ...proposals,
        tags: newList,
    }


    setState({
        ...state,
        type: ADD_TYPE,
        currentTag: initTag,
        currentTagIndex: null
    })
    setProposals(newProposal);
    props.handleChange("proposals", newProposal);
}
