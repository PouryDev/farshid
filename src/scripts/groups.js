import axios from "axios";

const getActiveGroups = async () => {
    const response = await axios.get('/getlist.php')
    return response.data
}

const deleteGroup = async (id, name) => {
    const response = await axios.post('/deleterecord.php', {
        topicID: id,
        GroupName: name,
    })

    return response.status === 200
}

const archive = async () => {
    const response = await axios.get('/archive.php')

    return response.status === 200
}

const getArchivedGroups = async () => {
    try {
        const response = await axios.get('/getarchivedgroups.php')
        return response.data
    } catch (e) {
        console.log(e)
        return null
    }
}

export default {
    getGroups: getActiveGroups,
    archive,
    deleteGroup,
    getArchivedGroups,
}
