<template>
  <div class="top-bar">
    <div class="logo">
      <button @click="scroll">
        <router-link to="/">
          <img src="../../assets/cef_neg.png" alt="" />
        </router-link>
      </button>
      <a
        href="https://www3.bcb.gov.br/CALCIDADAO/publico/exibirFormCorrecaoValores.do?method=exibirFormCorrecaoValores"
        target="blank"
        ><span>Calculadora Correção BCB</span>
        <v-icon medium color="#fff">
          mdi-calculator
        </v-icon>
      </a>
    </div>
  </div>
</template>

<script>
import './styles.css';
export default {
  methods: {
    scroll: function() {
      window.scrollTo(0, 0);
    },
  },
};
</script>

<style></style>
