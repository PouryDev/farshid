<script setup>
import {onMounted, reactive} from "vue";

import '../styles/style.css';
import '../style.css';
import Groups from '../scripts/groups.js'
import edit from "../scripts/comment.js"
import Modal from "./Modal.vue";


const getGroups = async (groups = null) => {
  if (groups === null) {
    groups = await Groups.getGroups()
  }

  let activeGroups = []

  groups.map(group => {
    if (!group.hasOwnProperty('Is_new')) {
      return
    }

    if (group['Is_new'] != 1) {
      return
    }

    activeGroups.push({
      id: group.topicID,
      name: group.GroupName,
      ack: group.AcknowledgeBy,
      date: group.Time,
      comment: group.Comment,
    })
  })

  try {
    await Groups.notify(states.activeGroups, activeGroups)
  } catch (e) {
    console.log('audio error', e)
  }
  states.activeGroups = activeGroups
  if (states.groupStatus === 'active') {
    states.groups = states.activeGroups
  }
}

const getArchivedGroups = groups => {
  let archivedGroups = []

  groups.map(group => {
    if (group['Is_new'] != 0) {
      return
    }

    archivedGroups.push({
      id: group.topicID,
      name: group.GroupName,
      ack: group.AcknowledgeBy,
      date: group.Time,
      comment: group.Comment,
    })
  })

  states.archivedGroups = archivedGroups
}

const changeGroupStatus = async (status = null) => {
  if (status !== null) {
    states.groupStatus = status
    return
  }
  if (states.groupStatus === 'active') {
    states.groupStatus = 'archived'
    states.groups = []
    const groups = await Groups.getArchivedGroups()
    getArchivedGroups(groups)
    states.groups = states.archivedGroups
  } else {
    states.groupStatus = 'active'
    states.groups = states.activeGroups
  }
}

const states = reactive({
  groups: [],
  archivedGroups: [],
  activeGroups: [],
  groupLen: 0,
  groupStatus: 'active',
  editCommentModal: {
    topicID: '',
    show: false,
    comment: '',
    name: '',
  },
  deleteGroupModal: {
    show: false,
    topicID: '',
    name: '',
  }
})

onMounted(async () => {
  await getGroups()
  states.groups = states.activeGroups
})

const editCommentShowUpdateHandler = () => {
  states.editCommentModal.show = false
  states.editCommentModal.comment = ''
}
const deleteGroupShowUpdateHandler = () => {
  states.deleteGroupModal.show = false
}

setInterval(async () => {
  await getGroups()
}, 3000)
setInterval(() => {
  Groups.archive()
}, 8000)

</script>

<template>
  <div class="overflow-x-auto rounded-box">
    <div class="form-control w-52">
      <label class="cursor-pointer label">
        <span class="label-text">Show Archived</span>
        <input type="checkbox" class="toggle toggle-primary" @change="changeGroupStatus()" />
      </label>
    </div>
    <table class="table table-zebra transition-shadow" style="text-align: center!important;">
      <thead class="bg-primary text-black">
      <tr>
        <th>Name</th>
        <th>Acknowledged by</th>
        <th>Start date</th>
        <th>Comment</th>
        <th>Edit comment</th>
        <th>Delete group</th>
      </tr>
      </thead>
      <tbody>
      <tr class="hover bg-base-100" v-for="group in states.groups">
        <td style="direction: rtl">{{ group.name }}</td>
        <td>{{ group.ack === null ? '-' : group.ack }}</td>
        <td>{{ group.date }}</td>
        <td style="direction: rtl">{{ group.comment === null ? '-' : group.comment }}</td>
        <td>
          <button v-if="states.groupStatus === 'active'" @click="states.editCommentModal = {topicID: group.id, show: true, name: group.name, comment: group.comment}"
                  class="btn btn-outline btn-primary btn-sm"
          >Edit
          </button>
          <span v-else>-</span>
        </td>
        <td>
          <button v-if="states.groupStatus === 'active'" class="btn btn-outline btn-error btn-sm"
                  @click="states.deleteGroupModal = {
                      topicID: group.id,
                      name: group.name,
                      show: true,
                    }"
          >Delete
          </button>
          <span v-else>-</span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>

  <Modal name="edit-comment"
         title="Edit comment"
         :show="states.editCommentModal.show"
         type="confirm"
         :on-success="edit"
         :on-success-args="[states.editCommentModal.topicID, states.editCommentModal.comment]"
         @update="editCommentShowUpdateHandler"
  >
    <div style="text-align: center">
      <span style="direction: rtl; font-weight: bold">{{ states.editCommentModal.name }}</span>
      <textarea v-model="states.editCommentModal.comment"
                class="textarea textarea-bordered"
                style="width: 100%; margin-top: 20px; direction: rtl"
                placeholder="Comment message"></textarea>
    </div>
  </Modal>

  <Modal name="delete-group"
         title="Delete group"
         :show="states.deleteGroupModal.show"
         type="confirm"
         :on-success="Groups.deleteGroup"
         :on-success-args="[states.deleteGroupModal.topicID, states.deleteGroupModal.name]"
         @update="deleteGroupShowUpdateHandler"
  >
    Are you sure you want to delete the thread for {{ states.deleteGroupModal.name }} group?
  </Modal>
</template>
