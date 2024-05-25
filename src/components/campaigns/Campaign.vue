<script setup>
const props = defineProps({
    campaign: Object,
})

const emits = defineEmits(['toggleActive', 'editCampaign'])
</script>

<template>
    <article class="campaign">
        <header class="campaign-header">
            <h4>{{ campaign.name }}</h4>
            <p class="campaign-client">{{ campaign.client }}</p>
            <div class="campaign-details">
                <div class="campaign-detail">{{ campaign.platform }}</div>
                <div class="campaign-detail">{{ campaign.type }}</div>
            </div>
        </header>
        <main class="campaign-main">
            <div class="campaign-info">{{ campaign.currency }} {{ campaign.budget }}</div>
            <div class="campaign-info">Start Date {{ new Date(campaign.startDate).toLocaleDateString() }}</div>
            <div class="campaign-info">End Date {{ new Date(campaign.endDate).toLocaleDateString() }}</div>
        </main>
        <footer class="campaign-footer">
            <button @click="$emit('editCampaign', campaign.id)" class="campaign-button">Edit</button>
            <button @click="$emit('toggleActive')" class="campaign-button">
                {{ campaign.isActive ? 'Archive' : 'Activate' }}
            </button>
        </footer>
    </article>
</template>

<style scoped>
.campaign {
    min-height: 14rem;
    padding: 1rem 2.2rem;
    background-color: rgb(219, 219, 219);
    color: var(--color-dark);
    border-radius: var(--basic-border-radius);
    display: grid;
    grid-template-rows: auto 1fr auto;
}

.campaign-header {
    text-align: left;
}

.campaign-client {
    margin-bottom: 0.6rem;
}

.campaign-main {
    margin-bottom: 2rem;
}

.campaign-details {
    display: flex;
    column-gap: 0.4rem;
    margin-bottom: 0.8rem;
}

.campaign-detail {
    font-size: 0.8rem;
    background-color: rgb(3, 3, 87);
    display: inline-block;
    padding: 2px 8px;
    color: var(--color-bright);
    border-radius: calc(var(--basic-border-radius) / 2);
}

.campaign-footer {
    display: flex;
    column-gap: 0.4rem;
}

.campaign-button {
    flex: 1;
    padding: 4px 18px;
    border: none;
    border-radius: calc(var(--basic-border-radius) / 2);
    background-color: rgb(4, 67, 67);
}

.campaign-button:hover {
    cursor: pointer;
}
</style>
