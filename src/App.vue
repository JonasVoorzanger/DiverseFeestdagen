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
        v-col(cols="12" md="8")
          v-card.mb-4
            v-card-title.text-h4.text-center Welkom bij Diverse Feestdagen!
            v-card-subtitle.text-center Ontdek verschillende feestdagen uit de hele wereld
            
            v-card-text
              v-alert(
                type="info"
                variant="tonal"
                prominent
              )
                | Dit is een voorbeeld Vue applicatie met Options API, Pug templating en Vuetify.
              
              v-list
                v-list-item(
                  v-for="item in feestdagen"
                  :key="item.id"
                  :prepend-icon="item.icon"
                )
                  v-list-item-title {{ item.naam }}
                  v-list-item-subtitle {{ item.datum }}
              
              v-row.mt-4
                v-col(cols="12" sm="6")
                  v-text-field(
                    v-model="zoekterm"
                    label="Zoek een feestdag"
                    prepend-icon="mdi-magnify"
                    clearable
                  )
                v-col(cols="12" sm="6")
                  v-btn(
                    color="primary"
                    block
                    @click="zoekFeestdag"
                  ) Zoeken
              
              v-card.mt-4(v-if="zoekResultaat" variant="outlined")
                v-card-text
                  p.text-body-1 {{ zoekResultaat }}
  
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
      feestdagen: [
        { id: 1, naam: 'Nieuwjaar', datum: '1 januari', icon: 'mdi-party-popper' },
        { id: 2, naam: 'Valentijnsdag', datum: '14 februari', icon: 'mdi-heart' },
        { id: 3, naam: 'Koningsdag', datum: '27 april', icon: 'mdi-crown' },
        { id: 4, naam: 'Bevrijdingsdag', datum: '5 mei', icon: 'mdi-flag' },
        { id: 5, naam: 'Sinterklaas', datum: '5 december', icon: 'mdi-gift' },
        { id: 6, naam: 'Kerstmis', datum: '25 december', icon: 'mdi-pine-tree' }
      ],
      zoekterm: '',
      zoekResultaat: ''
    }
  },
  
  methods: {
    zoekFeestdag() {
      if (!this.zoekterm) {
        this.zoekResultaat = 'Voer een zoekterm in om te zoeken.'
        return
      }
      
      const gevonden = this.feestdagen.find(f => 
        f.naam.toLowerCase().includes(this.zoekterm.toLowerCase())
      )
      
      if (gevonden) {
        this.zoekResultaat = `Gevonden: ${gevonden.naam} op ${gevonden.datum}`
      } else {
        this.zoekResultaat = 'Geen feestdag gevonden met deze zoekterm.'
      }
    }
  },
  
  mounted() {
    console.log('App mounted! Feestdagen geladen:', this.feestdagen.length)
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
</style>
