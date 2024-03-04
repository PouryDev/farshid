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
    }, {
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
        }
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
    let flag = false

    const oldIDs = {}
    oldGroups.map(group => {
        oldIDs[group.name] = group.id
    })

    const newIDs = {}
    newGroups.map(group => {
        newIDs[group.name] = group.id
    })

    Object.keys(newIDs).forEach(key => {
        if (!oldIDs.hasOwnProperty(key)) {
            if (oldIDs[key] == newIDs[key]) {
                flag = true
            }
        }
    })

    if (flag) {
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
