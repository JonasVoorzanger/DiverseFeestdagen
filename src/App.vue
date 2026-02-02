<template lang="pug">
v-app
  v-app-bar(color="primary" dark)
    v-app-bar-title Diverse Feestdagen
    v-spacer
    v-btn(icon)
      v-icon mdi-calendar-heart
  
  v-main
    v-container
      v-row(justify="center")
        v-col(cols="12" md="10" lg="8")
          v-card.mb-4
            v-card-title.text-h4.text-center Diverse Feestdagen
            v-card-subtitle.text-center Ontdek verschillende feestdagen uit de hele wereld
            
            v-card-text
              v-row.mb-4(align="center")
                v-col(cols="12" sm="6")
                  v-text-field(
                    v-model.number="daysAhead"
                    label="Aantal dagen vooruit"
                    type="number"
                    :min="1"
                    :max="365"
                    density="comfortable"
                    variant="outlined"
                  )
                v-col(cols="12" sm="6")
                  v-chip.ma-1(
                    v-for="type in uniqueTypes"
                    :key="type"
                    size="small"
                  ) {{ type }}
              
              v-divider.mb-4
              
              v-alert(v-if="loading" type="info" variant="tonal")
                | Feestdagen laden...
              
              v-alert(v-else-if="error" type="error" variant="tonal")
                | {{ error }}
              
              v-list(v-else-if="upcomingHolidays.length > 0")
                v-list-item(
                  v-for="(item, index) in upcomingHolidays"
                  :key="index"
                  :prepend-icon="item.icon"
                  @click="openLink(item)"
                  :class="{ 'clickable': item.link }"
                )
                  v-list-item-title {{ item.naam }}
                  v-list-item-subtitle 
                    | {{ formatDate(item.datum) }} ({{ item.type }})
                    v-icon(v-if="item.link" size="small" class="ml-2") mdi-open-in-new
              
              v-alert(v-else type="info" variant="tonal")
                | Geen feestdagen gevonden in de komende {{ daysAhead }} {{ daysAhead === 1 ? 'dag' : 'dagen' }}.
  
  v-footer(app)
    v-row(justify="center")
      v-col.text-center
        span.text-caption © 2026 Diverse Feestdagen - Open voor iedereen
</template>

<script>
export default {
  name: 'App',
  
  data() {
    return {
      allHolidays: [],
      daysAhead: 3,
      loading: true,
      error: null
    }
  },
  
  computed: {
    upcomingHolidays() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const futureDate = new Date(today)
      futureDate.setDate(today.getDate() + this.daysAhead)
      
      return this.allHolidays
        .filter(holiday => {
          const holidayDate = new Date(holiday.datum)
          return holidayDate >= today && holidayDate <= futureDate
        })
        .sort((a, b) => new Date(a.datum) - new Date(b.datum))
    },
    
    uniqueTypes() {
      const types = [...new Set(this.upcomingHolidays.map(h => h.type))]
      return types.sort()
    }
  },
  
  methods: {
    async loadHolidays() {
      try {
        this.loading = true
        this.error = null
        
        const response = await fetch('/DiverseFeestdagen/holidays.json')
        
        if (!response.ok) {
          throw new Error('Kon feestdagen niet laden')
        }
        
        this.allHolidays = await response.json()
        console.log(`Geladen: ${this.allHolidays.length} feestdagen`)
      } catch (err) {
        console.error('Error loading holidays:', err)
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      const options = { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }
      return date.toLocaleDateString('nl-NL', options)
    },
    
    openLink(holiday) {
      if (holiday.link) {
        window.open(holiday.link, '_blank', 'noopener,noreferrer')
      }
    }
  },
  
  mounted() {
    this.loadHolidays()
  }
}
</script>

<style>
* {
  font-family: 'Raleway', sans-serif;
}

.v-application {
  font-family: 'Raleway', sans-serif !important;
}

/* Campton for all headers */
h1, h2, h3, h4, h5, h6,
.v-card-title,
.v-card-subtitle,
.v-app-bar-title,
.text-h1, .text-h2, .text-h3, .text-h4, .text-h5, .text-h6 {
  font-family: 'Campton', sans-serif !important;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  background-color: rgba(0, 98, 171, 0.05);
}
</style>
