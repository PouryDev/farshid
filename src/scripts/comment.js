import axios from "axios";

const edit = async (topicID, comment) => {
    const response = await axios.post('/editrecord.php', {
        topicID: topicID,
        newComment: comment,
    })

    return response.status === 200
}

export default edit
