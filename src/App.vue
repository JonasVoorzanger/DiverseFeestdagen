<template lang="pug">
v-app
  v-app-bar(color="primary" dark)
    v-toolbar-title.flex-grow-1
      span Feest- en themadagen
    v-toolbar-subtitle
      span.font-weight-light.ml-3.translucent(
        @click="openLink({ link: 'https://linktr.ee/feestdagen' })"
        style="cursor: pointer;"
      ) linktr.ee/feestdagen
    v-btn(icon @click="toggleLookupMode" :title="isLookupMode ? 'Naar normale weergave' : 'Naar zoek weergave'")
      v-icon(size="small") {{ isLookupMode ? 'mdi-view-dashboard' : 'mdi-magnify' }}
  
  v-main
    v-container(fluid)
      v-card
        v-card-text
          v-alert(v-if="loading" type="info" variant="tonal")
            | Feestdagen laden...
          
          v-alert(v-else-if="error" type="error" variant="tonal")
            | {{ error }}
          
          div(v-else)
            div(v-if="isLookupMode")
              v-row.mb-3
                v-col(cols="12")
                  v-btn(
                    color="secondary"
                    prepend-icon="mdi-plus-circle"
                    @click="openSuggestionForm"
                    block
                  ) Stel een nieuwe feestdag voor
              
              v-row.mb-4
                v-col(cols="12" md="4")
                  v-checkbox(
                    v-model="hidePastHolidays"
                    label="Verberg verleden"
                    density="compact"
                    hide-details
                  )
                v-col(cols="12" md="4")
                  v-select(
                    v-model="selectedTypes"
                    :items="allTypesWithIcons"
                    item-title="type"
                    item-value="type"
                    label="Filter op type"
                    multiple
                    chips
                    clearable
                    variant="outlined"
                    density="compact"
                    hide-details
                  )
                    template(v-slot:chip="{ item }")
                      v-chip
                        v-icon(start size="small") {{ item.raw.icon }}
                        | {{ item.raw.type }}
                    template(v-slot:item="{ item, props }")
                      v-list-item(v-bind="props" :title="item.raw.type")
                        template(v-slot:prepend="{ isActive }")
                          v-list-item-action(start)
                            v-checkbox-btn(:model-value="isActive")
                        template(v-slot:append)
                          v-icon {{ item.raw.icon }}
                v-col(cols="12" md="4")
                  v-text-field(
                    v-model="searchText"
                    label="Zoek op naam"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    density="compact"
                    hide-details
                  )
              
              v-divider.mb-4
              
              div(v-if="Object.keys(groupedByMonth).length > 0")
                div(v-for="(holidays, month) in groupedByMonth" :key="month")
                  v-subheader.text-h4.mb-2.mt-4 {{ month }}
                  v-list
                    v-list-item(
                      v-for="(item, index) in holidays"
                      :key="'lookup-' + index"
                      :prepend-icon="item.icon"
                      @click="openLink(item)"
                      :class="{ 'clickable': item.link }"
                    )
                      v-list-item-title.font-weight-bold {{ item.naam }}
                      v-list-item-subtitle {{ formatDate(item.datum) }} ({{ item.type }})
              
              v-alert(v-else type="info" variant="tonal")
                | Geen feestdagen gevonden met de huidige filters.
            
            div(v-else)
              div(v-if="groupedHolidays.today.length > 0")
                v-subheader.text-h4.mb-2 Vandaag
                v-list
                  v-list-item(
                    v-for="(item, index) in groupedHolidays.today"
                    :key="'today-' + index"
                    :prepend-icon="item.icon"
                    @click="openLink(item)"
                    :class="{ 'clickable': item.link }"
                  )
                    v-list-item-title.font-weight-bold {{ item.naam }}
                    v-list-item-subtitle {{ formatDate(item.datum) }} ({{ item.type }})
              
              div(v-if="groupedHolidays.tomorrow.length > 0")
                v-subheader.text-h4.mb-2.mt-4 Morgen
                v-list
                  v-list-item(
                    v-for="(item, index) in groupedHolidays.tomorrow"
                    :key="'tomorrow-' + index"
                    :prepend-icon="item.icon"
                    @click="openLink(item)"
                    :class="{ 'clickable': item.link }"
                  )
                    v-list-item-title.font-weight-bold {{ item.naam }}
                    v-list-item-subtitle {{ formatDate(item.datum) }} ({{ item.type }})
              
              div(v-if="groupedHolidays.dayAfterTomorrow.length > 0")
                v-subheader.text-h4.mb-2.mt-4 Overmorgen
                v-list
                  v-list-item(
                    v-for="(item, index) in groupedHolidays.dayAfterTomorrow"
                    :key="'dayAfterTomorrow-' + index"
                    :prepend-icon="item.icon"
                    @click="openLink(item)"
                    :class="{ 'clickable': item.link }"
                  )
                    v-list-item-title.font-weight-bold {{ item.naam }}
                    v-list-item-subtitle {{ formatDate(item.datum) }} ({{ item.type }})
              
              div(v-if="groupedHolidays.later.length > 0")
                v-subheader.text-h4.mb-2.mt-4(v-if="groupedHolidays.today.length > 0 || groupedHolidays.tomorrow.length > 0 || groupedHolidays.dayAfterTomorrow.length > 0") Later
                v-list
                  v-list-item(
                    v-for="(item, index) in groupedHolidays.later"
                    :key="'later-' + index"
                    :prepend-icon="item.icon"
                    @click="openLink(item)"
                    :class="{ 'clickable': item.link }"
                  )
                    v-list-item-title.font-weight-bold {{ item.naam }}
                    v-list-item-subtitle {{ formatDate(item.datum) }} ({{ item.type }})
              
              v-alert(v-if="totalDisplayedHolidays === 0" type="info" variant="tonal")
                | Geen feestdagen gevonden in de komende {{ maxHolidays }} {{ maxHolidays === 1 ? 'dag' : 'dagen' }}.
  
  v-snackbar(
    v-model="showToast"
    :timeout="3000"
    location="bottom"
  )
    | Deze dag heeft (nog) geen aparte website
  </template>

<script>
export default {
  name: 'App',
  
  data() {
    return {
      allHolidays: [],
      maxHolidays: 5,
      loading: true,
      error: null,
      isLookupMode: false,
      hidePastHolidays: true,
      selectedTypes: [],
      searchText: '',
      showToast: false
    }
  },
  
  computed: {
    allTypes() {
      const types = [...new Set(this.allHolidays.map(h => h.type))]
      return types.sort()
    },
    
    allTypesWithIcons() {
      const typeIconMap = {}
      this.allHolidays.forEach(h => {
        if (!typeIconMap[h.type]) {
          typeIconMap[h.type] = h.icon
        }
      })
      
      return this.allTypes.map(type => ({
        type: type,
        icon: typeIconMap[type] || 'mdi-calendar'
      }))
    },
    
    filteredHolidays() {
      if (!this.isLookupMode) return []
      
      let filtered = this.allHolidays
      
      if (this.hidePastHolidays) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        filtered = filtered.filter(h => {
          const date = new Date(h.datum)
          return date >= today
        })
      }
      
      if (this.selectedTypes.length > 0) {
        filtered = filtered.filter(h => this.selectedTypes.includes(h.type))
      }
      
      if (this.searchText) {
        const search = this.searchText.toLowerCase()
        filtered = filtered.filter(h => 
          h.naam.toLowerCase().includes(search)
        )
      }
      
      return filtered.sort((a, b) => new Date(a.datum) - new Date(b.datum))
    },
    
    groupedByMonth() {
      if (!this.isLookupMode) return {}
      
      const grouped = {}
      this.filteredHolidays.forEach(holiday => {
        const date = new Date(holiday.datum)
        const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 
                           'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
        const monthKey = monthNames[date.getMonth()]
        
        if (!grouped[monthKey]) {
          grouped[monthKey] = []
        }
        grouped[monthKey].push(holiday)
      })
      
      return grouped
    },
    
    groupedHolidays() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)
      
      const dayAfterTomorrow = new Date(today)
      dayAfterTomorrow.setDate(today.getDate() + 2)
      
      const threeDaysAhead = new Date(today)
      threeDaysAhead.setDate(today.getDate() + 3)
      
      const sortedHolidays = this.allHolidays
        .filter(holiday => {
          const holidayDate = new Date(holiday.datum)
          return holidayDate >= today
        })
        .sort((a, b) => new Date(a.datum) - new Date(b.datum))
      
      const todayHolidays = sortedHolidays.filter(h => {
        const date = new Date(h.datum)
        date.setHours(0, 0, 0, 0)
        return date.getTime() === today.getTime()
      })
      
      const tomorrowHolidays = sortedHolidays.filter(h => {
        const date = new Date(h.datum)
        date.setHours(0, 0, 0, 0)
        return date.getTime() === tomorrow.getTime()
      })
      
      const dayAfterTomorrowHolidays = sortedHolidays.filter(h => {
        const date = new Date(h.datum)
        date.setHours(0, 0, 0, 0)
        return date.getTime() === dayAfterTomorrow.getTime()
      })
      
      const laterHolidays = sortedHolidays.filter(h => {
        const date = new Date(h.datum)
        return date >= threeDaysAhead
      })
      
      let result = {
        today: todayHolidays,
        tomorrow: [],
        dayAfterTomorrow: [],
        later: []
      }
      
      const remainingSlots = Math.max(0, this.maxHolidays - todayHolidays.length)
      
      if (remainingSlots > 0) {
        const tomorrowCount = Math.min(tomorrowHolidays.length, remainingSlots)
        result.tomorrow = tomorrowHolidays.slice(0, tomorrowCount)
        
        const afterTomorrowRemaining = remainingSlots - tomorrowCount
        if (afterTomorrowRemaining > 0) {
          const dayAfterTomorrowCount = Math.min(dayAfterTomorrowHolidays.length, afterTomorrowRemaining)
          result.dayAfterTomorrow = dayAfterTomorrowHolidays.slice(0, dayAfterTomorrowCount)
          
          const laterRemainingSlots = afterTomorrowRemaining - dayAfterTomorrowCount
          if (laterRemainingSlots > 0) {
            result.later = laterHolidays.slice(0, laterRemainingSlots)
          }
        }
      }
      
      return result
    },
    
    totalDisplayedHolidays() {
      return this.groupedHolidays.today.length + 
             this.groupedHolidays.tomorrow.length + 
             this.groupedHolidays.dayAfterTomorrow.length + 
             this.groupedHolidays.later.length
    }
  },
  
  methods: {
    getUrlParameter(name) {
      const urlParams = new URLSearchParams(window.location.search)
      return urlParams.get(name)
    },
    
    toggleLookupMode() {
      this.isLookupMode = !this.isLookupMode
      const url = new URL(window.location)
      if (this.isLookupMode) {
        url.searchParams.set('lookup', 'true')
      } else {
        url.searchParams.delete('lookup')
      }
      window.history.pushState({}, '', url)
    },
    
    updateUrlWithFilters() {
      const url = new URL(window.location)
      
      if (!this.hidePastHolidays) {
        url.searchParams.set('showPast', 'true')
      } else {
        url.searchParams.delete('showPast')
      }
      
      if (this.selectedTypes.length > 0) {
        url.searchParams.set('types', this.selectedTypes.join(','))
      } else {
        url.searchParams.delete('types')
      }
      
      if (this.searchText) {
        url.searchParams.set('search', this.searchText)
      } else {
        url.searchParams.delete('search')
      }
      
      window.history.pushState({}, '', url)
    },
    
    async loadHolidays() {
      try {
        this.loading = true
        this.error = null
        
        const lookupParam = this.getUrlParameter('lookup')
        this.isLookupMode = lookupParam === 'true' || lookupParam === '1'
        
        const urlMax = this.getUrlParameter('n')
        if (urlMax) {
          const parsed = parseInt(urlMax)
          if (!isNaN(parsed) && parsed > 0) {
            this.maxHolidays = parsed
          }
        }
        
        // Load filter values from URL
        const showPastParam = this.getUrlParameter('showPast')
        if (showPastParam === 'true' || showPastParam === '1') {
          this.hidePastHolidays = false
        }
        
        const typesParam = this.getUrlParameter('types')
        if (typesParam) {
          this.selectedTypes = typesParam.split(',').filter(t => t.trim())
        }
        
        const searchParam = this.getUrlParameter('search')
        if (searchParam) {
          this.searchText = searchParam
        }
        
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
      } else {
        this.showToast = true
      }
    },
    
    openSuggestionForm() {
      window.open('https://docs.google.com/forms/d/e/1FAIpQLSfhckWxlz8X8qezLuUhImog4rW0KXXNojAThOd2akLe5JcAsA/viewform?usp=publish-editor', '_blank', 'noopener,noreferrer')
    }
  },
  
  mounted() {
    this.loadHolidays()
    if (this.isLookupMode) {
      document.documentElement.classList.add('lookup-mode')
    }
  },
  
  watch: {
    isLookupMode(newVal) {
      if (newVal) {
        document.documentElement.classList.add('lookup-mode')
      } else {
        document.documentElement.classList.remove('lookup-mode')
      }
    },
    
    hidePastHolidays() {
      if (this.isLookupMode) {
        this.updateUrlWithFilters()
      }
    },
    
    selectedTypes() {
      if (this.isLookupMode) {
        this.updateUrlWithFilters()
      }
    },
    
    searchText() {
      if (this.isLookupMode) {
        this.updateUrlWithFilters()
      }
    }
  }
}
</script>

<style>
html:not(.lookup-mode) {
  font-size: clamp(1rem, 4vmin, 6rem);
}

html.lookup-mode {
  font-size: 16px;
}

html:not(.lookup-mode) .v-app-bar {
  font-size: 25px !important;
}

html:not(.lookup-mode) .v-app-bar * {
  font-size: inherit !important;
}

* {
  font-family: 'Raleway', sans-serif;
}

.v-application {
  font-family: 'Raleway', sans-serif !important;
}

h1, h2, h3, h4, h5, h6,
.v-card-title,
.v-card-subtitle,
.v-app-bar-title,
.v-subheader,
.text-h1, .text-h2, .text-h3, .text-h4, .text-h5, .text-h6 {
  font-family: 'Campton', sans-serif !important;
}

v-subheader,
v-subheader.text-h4 {
  font-size: 1.5rem !important;
  font-weight: 500 !important;
  color: #666666 !important;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  background-color: rgba(0, 98, 171, 0.05);
}

.v-container--fluid {
  padding: 24px !important;
}

html:not(.lookup-mode) .v-card {
  margin-bottom: 0 !important;
}

html:not(.lookup-mode) .v-main {
  padding-bottom: 0 !important;
}

html.lookup-mode .v-container {
  max-width: 800px !important;
  margin: 0 auto !important;
}

.v-list-item-title {
  font-size: 1.1rem !important;
}

.v-list-item__prepend {
  margin-right: 2px !important;
}

.v-list-item__prepend > .v-icon {
  margin-inline-end: 0 !important;
}

.v-chip .v-icon {
  margin-left: 4px !important;
  margin-right: 4px !important;
}

.translucent{
  opacity: 0.7;
}
</style>
