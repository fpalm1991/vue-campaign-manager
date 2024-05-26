import { defineStore } from 'pinia'

export const useCampaignStore = defineStore('campaigns', {
    state: () => ({
        campaigns: [],
    }),
    getters: {
        getCampaigns: (state) => state.campaigns,
        getCampaign: (state) => (id) => state.campaigns.find((campaign) => campaign.id === id),
    },
    actions: {
        updateCampaign(updateCampaign) {
            const index = this.campaigns.findIndex((campaign) => campaign.id === updateCampaign.id)
            if (index !== -1) {
                this.campaigns.splice(index, 1, updateCampaign)
            }
        },

        createCampaign(createCampaign) {
            this.campaigns.push(createCampaign)
        },

        async fetchCampaigns() {
            this.error = null

            try {
                const response = await fetch('https://vue-campaign-manager.felix-palm.ch/index.php/api/campaigns')
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }

                const data = await response.json()
                this.campaigns = data.campaigns
            } catch (error) {
                this.error = 'Failed to fetch campaigns'
                console.log(error)
            } finally {
                this.isLoading = false
            }
        },
    },
})
