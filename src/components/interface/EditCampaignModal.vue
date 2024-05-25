<script setup>
import { defineProps, watch } from 'vue'
import { useCampaignStore } from '../../stores/campaigns'

const props = defineProps({
    showModal: Boolean,
    campaign: Object,
    platforms: Set,
    types: Set,
})

const emits = defineEmits(['saveCampaign', 'closeModal'])

const campaignStore = useCampaignStore()

const saveCampaign = () => {
    campaignStore.updateCampaign(props.campaign)
    emits('saveCampaign')
}

watch(
    () => props.showModal,
    (newValue) => {
        if (newValue) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
    }
)
</script>

<template>
    <Teleport to="body">
        <div class="modal-container" v-show="showModal" @click="$emit('closeModal')">
            <div class="modal edit-campaign" @click.stop>
                <h1>Edit {{ campaign.name }}</h1>

                <div class="edit-campaign-element">
                    <input type="text" v-model="campaign.name" />
                </div>

                <div class="edit-campaign-row">
                    <div class="edit-campaign-element">
                        <select v-model="campaign.platform">
                            <option v-for="platform in platforms" :value="platform" :key="platform">
                                {{ platform }}
                            </option>
                        </select>
                    </div>

                    <div class="edit-campaign-element">
                        <select v-model="campaign.type">
                            <option v-for="type in types" :value="type" :key="type">{{ type }}</option>
                        </select>
                    </div>
                </div>

                <div class="edit-campaign-element">
                    <input type="text" v-model="campaign.client" />
                </div>

                <div class="edit-campaign-element">
                    <input type="number" v-model="campaign.budget" />
                </div>

                <div class="edit-campaign-element">
                    <input type="text" v-model="campaign.currency" />
                </div>

                <div class="edit-campaign-row">
                    <div class="edit-campaign-element">
                        <label for="start-date">Start Date</label>
                        <input type="date" v-model="campaign.startDate" id="start-date" />
                    </div>

                    <div class="edit-campaign-element">
                        <label for="end-date">End Date</label>
                        <input type="date" v-model="campaign.endDate" id="end-date" />
                    </div>
                </div>

                <button class="button-update-campaign" @click="saveCampaign">Update Campaign</button>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1;
    display: grid;
    place-items: center;
}

.modal {
    width: 60%;
    background-color: grey;
    border-radius: 8px;
    padding: 2rem;
    z-index: 11;
}

.edit-campaign {
    display: flex;
    flex-direction: column;
    row-gap: 1.2rem;
}

.edit-campaign-element {
    flex: 1;
}

.edit-campaign-element input,
.edit-campaign-element select {
    font-size: 1rem;
    width: 100%;
    padding: 8px 22px;
    border-radius: 8px;
    border: none;
}

.button-update-campaign {
    padding: 12px 28px;
    border-radius: 8px;
    background-color: rgb(98, 58, 5);
    border: none;
}

.button-update-campaign:hover {
    cursor: pointer;
}

.edit-campaign-row {
    column-gap: 1rem;
    display: flex;
    justify-content: space-between;
}
</style>
