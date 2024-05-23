<script setup>
const props = defineProps({
    campaign: Object,
})
</script>

<template>
    <div v-show="campaign.active" class="campaign">
        <header class="campaign-header">
            <h4>{{ campaign.name }}</h4>
            <p>Client 1</p>
            <div class="campaign-details">
                <div class="campaign-detail">{{ campaign.platform }}</div>
                <div class="campaign-detail">{{ campaign.type }}</div>
            </div>
        </header>
        <main class="campaign-main">
            <div class="campaign-info">{{ campaign.curreny }} {{ campaign.budget }}</div>
        </main>
        <footer class="campaign-footer">
            <button class="campaign-button">Edit</button>
            <button class="campaign-button">Archive</button>
        </footer>
    </div>
</template>
