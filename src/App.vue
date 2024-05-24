<script setup>
import { computed, onMounted, ref } from 'vue'
import { useCampaignStore } from './stores/campaigns.js'
import Campaign from './components/campaigns/Campaign.vue'

const campaignStore = useCampaignStore()

const showActiveCampaigns = ref(true)

const campaigns = computed(() => campaignStore.getCampaigns)

const filteredCampaigns = computed(() => {
    return campaigns.value.filter((campaign) => campaign.active === Boolean(showActiveCampaigns.value))
})
</script>

<template>
    <header class="header">
        <h1>Marketing Campaign Manager</h1>
    </header>

    <main class="main">
        <aside class="navigation"></aside>
        <div class="main-content">
            <div class="filter-container">
                <select v-model="showActiveCampaigns" class="filter">
                    <option :value="true">Active Campaigns</option>
                    <option :value="false">Archived Campaigns</option>
                </select>
            </div>

            <div class="campaigns">
                <Campaign
                    @toggleActive="campaign.active = !campaign.active"
                    v-for="campaign in filteredCampaigns"
                    :campaign="campaign"
                    :key="campaign.id"
                />
            </div>
        </div>
    </main>

    <footer class="footer"></footer>
</template>

<style scoped></style>
