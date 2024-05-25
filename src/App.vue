<script setup>
import { computed, ref } from 'vue'
import { useCampaignStore } from './stores/campaigns.js'
import Campaign from './components/campaigns/Campaign.vue'
import EditCampaignModal from './components/interface/EditCampaignModal.vue'

const campaignStore = useCampaignStore()

const campaigns = computed(() => campaignStore.getCampaigns)

const campaignIDToEdit = ref(1)
const campaignToEdit = computed(() => {
    return campaignStore.getCampaign(campaignIDToEdit.value)
})

const showModal = ref(false)

// References for selected options
const showActiveCampaigns = ref(true)
const selectedClient = ref('All Clients')
const selectedPlatform = ref('All Platforms')

// Calculating options for select elements
const possibleClients = computed(() => {
    let clients = new Set(
        campaigns.value
            .filter((campaign) => campaign.isActive === Boolean(showActiveCampaigns.value))
            .filter(
                (campaign) => selectedPlatform.value === 'All Platforms' || campaign.platform === selectedPlatform.value
            )
            .map((campaign) => campaign.client)
    )

    // Make sure selected client is always in the list of possible clients
    // so it can not show an empty selection element.
    if (!clients.has(selectedClient.value)) {
        clients.add(selectedClient.value)
    }

    return clients
})

const possiblePlatforms = computed(() => {
    return new Set(
        campaigns.value
            .filter((campaign) => campaign.isActive === Boolean(showActiveCampaigns.value))
            .filter((campaign) => selectedClient.value === 'All Clients' || campaign.client === selectedClient.value)
            .map((campaign) => campaign.platform)
    )
})

// Filtered campaigns not respecting selection active / archived
const filteredCampaignsTotal = computed(() => {
    let filteredCampaigns = campaigns.value

    if (selectedClient.value !== 'All Clients') {
        filteredCampaigns = filteredCampaigns.filter((campaign) => campaign.client === selectedClient.value)
    }

    if (selectedPlatform.value !== 'All Platforms') {
        filteredCampaigns = filteredCampaigns.filter((campaign) => campaign.platform === selectedPlatform.value)
    }

    return filteredCampaigns
})

// Filtered campaigns respecting selection active / archived
const filteredCampaignsRespectingActiveArchived = computed(() => {
    let filtered = campaigns.value.filter((campaign) => campaign.isActive === Boolean(showActiveCampaigns.value))

    if (selectedClient.value !== 'All Clients') {
        filtered = filtered.filter((campaign) => campaign.client === selectedClient.value)
    }

    if (selectedPlatform.value !== 'All Platforms') {
        filtered = filtered.filter((campaign) => campaign.platform === selectedPlatform.value)
    }

    return filtered
})

// Additional information based on campaigns
const activeCampaigns = computed(() => campaigns.value.filter((campaign) => campaign.isActive))
const archivedCampaigns = computed(() => campaigns.value.filter((campaign) => !campaign.isActive))
const allPlatforms = computed(() => {
    return new Set(campaigns.value.map((campaign) => campaign.platform))
})
const allTypes = computed(() => {
    return new Set(campaigns.value.map((campaign) => campaign.type))
})

// Additional information based on specific filtered campaigns
const activeFilteredCampaignsTotal = computed(() =>
    filteredCampaignsTotal.value.filter((campaign) => campaign.isActive)
)
const archivedFilteredCampaignsTotal = computed(() =>
    filteredCampaignsTotal.value.filter((campaign) => !campaign.isActive)
)

const toggleModal = () => {
    showModal.value = !showModal.value
}
</script>

<template>
    <header class="header">
        <h1>Marketing Campaign Manager</h1>
    </header>

    <main class="main">
        <aside class="overview">
            <section class="overview-general">
                <h3 class="overview-title">Overview</h3>
                <ul class="overview-list">
                    <li class="overview-list-item">
                        Campaigns total
                        <span class="overview-campaign-information">{{ campaigns.length }}</span>
                    </li>
                    <li class="overview-list-item">
                        Active campaigns
                        <span class="overview-campaign-information">{{ activeCampaigns.length }}</span>
                    </li>
                    <li class="overview-list-item">
                        Archived campaigns
                        <span class="overview-campaign-information">
                            {{ archivedCampaigns.length }}
                        </span>
                    </li>
                </ul>
            </section>

            <section class="overview-client">
                <h3 class="overview-title">Specific Information</h3>
                <ul class="overview-list">
                    <li class="overview-list-item">
                        Campaigns total
                        <span class="overview-campaign-information">{{ filteredCampaignsTotal.length }}</span>
                    </li>
                    <li class="overview-list-item">
                        Active campaigns
                        <span class="overview-campaign-information">{{ activeFilteredCampaignsTotal.length }}</span>
                    </li>
                    <li class="overview-list-item">
                        Archived campaigns
                        <span class="overview-campaign-information">{{ archivedFilteredCampaignsTotal.length }}</span>
                    </li>
                </ul>
            </section>
        </aside>
        <div class="main-content">
            <div class="filter-container custom-select">
                <button
                    class="filter filter-button"
                    @click="showActiveCampaigns = !showActiveCampaigns"
                    :class="{ filterShowingActiveCampaigns: showActiveCampaigns }"
                    :disabled="archivedFilteredCampaignsTotal.length < 1 && showActiveCampaigns"
                >
                    <span class="filter-button-text">
                        {{ showActiveCampaigns ? 'Active' : 'Archived' }}
                    </span>
                </button>

                <select v-model="selectedClient" class="filter">
                    <option value="All Clients">All Clients</option>
                    <option v-for="client in possibleClients" :key="client" :value="client">{{ client }}</option>
                </select>

                <select v-model="selectedPlatform" class="filter">
                    <option value="All Platforms">All Platforms</option>
                    <option v-for="platform in possiblePlatforms" :key="platform" :value="platform">
                        {{ platform }}
                    </option>
                </select>
            </div>

            <div class="campaigns">
                <Campaign
                    @toggleActive="campaign.isActive = !campaign.isActive"
                    @editCampaign="(ci) => ((campaignIDToEdit = ci), (showModal = true))"
                    v-for="campaign in filteredCampaignsRespectingActiveArchived"
                    :campaign="campaign"
                    :key="campaign.id"
                />
            </div>
        </div>
    </main>

    <footer class="footer" @click="toggleModal"></footer>

    <EditCampaignModal
        @saveCampaign="showModal = false"
        @closeModal="showModal = false"
        :showModal="showModal"
        :campaign="campaignToEdit"
        :platforms="allPlatforms"
        :types="allTypes"
    />
</template>
