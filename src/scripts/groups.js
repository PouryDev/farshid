import axios from "axios";

const getActiveGroups = async () => {
    const response = await axios.get('/getlist.php')
    if (typeof response.data === 'string') {
        try {
            return JSON.parse(response.data)
        } catch (e) {
            console.log('ge', e)
            return []
        }
    }

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
        if (typeof response.data === 'string') {
            try {
                return JSON.parse(response.data)
            } catch (e) {
                return []
            }
        }
        return response.data
    } catch (e) {
        console.log(e)
        return null
    }
}


const notify = async (oldGroups, newGroups) => {
    const oldIDs = oldGroups.map(record => record.topicID)
    const currentIDs = newGroups.map(record => record.topicID)
    const newTopicIDs = currentIDs.filter(id => !oldIDs.includes(id))
    console.log('new topic', newTopicIDs)
    if (newTopicIDs.length > 0) {
        const audio = new Audio('/933-preview.mp3');
        audio.addEventListener('canplay', () => {
            audio.play()
        });
    }
}

export default {
    getGroups: getActiveGroups,
    archive,
    deleteGroup,
    getArchivedGroups,
    notify,
}
