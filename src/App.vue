<script setup>
import { computed } from 'vue'
import { useCampaignStore } from './stores/campaigns.js'
import Campaign from './components/campaigns/Campaign.vue'

const campaignStore = useCampaignStore()

const campaigns = computed(() => campaignStore.getCampaigns)
</script>

<template>
    <header class="header">
        <h1>Marketing Campaign Manager</h1>
    </header>

    <main class="main">
        <aside class="navigation"></aside>
        <div class="main-content">
            <div class="campaigns">
                <Campaign v-for="campaign in campaigns" :campaign="campaign" :key="campaign.id" />
            </div>
        </div>
    </main>

    <footer class="footer"></footer>
</template>

<style scoped></style>
