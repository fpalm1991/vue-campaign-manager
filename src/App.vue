<script setup>
import { computed, ref } from 'vue'
import { useCampaignStore } from './stores/campaigns.js'
import Campaign from './components/campaigns/Campaign.vue'
import EditCampaignModal from './components/interface/EditCampaignModal.vue'
import CreateCampaignModal from './components/interface/CreateCampaignModal.vue'

// Store and reading campaigns
const campaignStore = useCampaignStore()
const campaigns = computed(() => campaignStore.getCampaigns)

// Creating new Campaign
const campaignIDToEdit = ref(1)
const campaignToEdit = computed(() => {
    return campaignStore.getCampaign(campaignIDToEdit.value)
})

// Modals
const showEditModal = ref(false)
const showCreateModal = ref(false)

// Selected filter options
const showActiveCampaigns = ref(true)
const selectedClient = ref('All Clients')
const selectedPlatform = ref('All Platforms')

// Calculating options for selection elements
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
    if (!clients.has(selectedClient.value) && selectedClient.value !== 'All Clients') {
        clients.add(selectedClient.value)
    }

    return clients
})

const possiblePlatforms = computed(() => {
    let platforms = new Set(
        campaigns.value
            .filter((campaign) => campaign.isActive === Boolean(showActiveCampaigns.value))
            .filter((campaign) => selectedClient.value === 'All Clients' || campaign.client === selectedClient.value)
            .map((campaign) => campaign.platform)
    )

    if (!platforms.has(selectedPlatform.value) && selectedPlatform.value !== 'All Platforms') {
        platforms.add(selectedPlatform.value)
    }

    return platforms
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
    let filteredCampaigns = campaigns.value.filter(
        (campaign) => campaign.isActive === Boolean(showActiveCampaigns.value)
    )

    if (selectedClient.value !== 'All Clients') {
        filteredCampaigns = filteredCampaigns.filter((campaign) => campaign.client === selectedClient.value)
    }

    if (selectedPlatform.value !== 'All Platforms') {
        filteredCampaigns = filteredCampaigns.filter((campaign) => campaign.platform === selectedPlatform.value)
    }

    return filteredCampaigns
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

const allClients = computed(() => {
    return new Set(campaigns.value.map((campaign) => campaign.client))
})

// Additional information based on specific filtered campaigns
const activeFilteredCampaignsTotal = computed(() =>
    filteredCampaignsTotal.value.filter((campaign) => campaign.isActive)
)

const archivedFilteredCampaignsTotal = computed(() =>
    filteredCampaignsTotal.value.filter((campaign) => !campaign.isActive)
)

// Showing specific information when specific platform or client gets selected
const showSpecificCampaignInformation = computed(() => {
    return selectedClient.value !== 'All Clients' || selectedPlatform.value !== 'All Platforms'
})
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

            <section v-show="showSpecificCampaignInformation" class="overview-client">
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

                <button class="button-create-campaign" @click="showCreateModal = true">Create Campaign</button>
            </div>

            <div class="campaigns">
                <Campaign
                    @toggleActive="campaign.isActive = !campaign.isActive"
                    @editCampaign="(ci) => ((campaignIDToEdit = ci), (showEditModal = true))"
                    v-for="campaign in filteredCampaignsRespectingActiveArchived"
                    :campaign="campaign"
                    :key="campaign.id"
                />
            </div>
        </div>
    </main>

    <footer class="footer"></footer>

    <EditCampaignModal
        @saveCampaign="showEditModal = false"
        @closeModal="showEditModal = false"
        :showModal="showEditModal"
        :campaign="campaignToEdit"
        :platforms="allPlatforms"
        :types="allTypes"
    />

    <CreateCampaignModal
        @createCampaign="showCreateModal = false"
        @closeModal="showCreateModal = false"
        :showModal="showCreateModal"
        :platforms="allPlatforms"
        :clients="allClients"
        :types="allTypes"
    />
</template>
