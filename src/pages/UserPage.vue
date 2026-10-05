<template>
  <q-page class="q-pa-md user-page">

    <section class="topo">
      <div class="cards">

        <q-card class="card">
          <q-card-section>
            <div class="card-title">
              <span class="indicador ativo"></span>
              Ativos
            </div>

            <div class="card-value">0</div>
          </q-card-section>
        </q-card>

        <q-card class="card">
          <q-card-section>
            <div class="card-title">
              <span class="indicador inativo"></span>
              Inativos
            </div>

            <div class="card-value">0</div>
          </q-card-section>
        </q-card>

        <q-card class="card">
          <q-card-section>
            <div class="card-title">
              <span class="indicador total"></span>
              Total
            </div>

            <div class="card-value">0</div>
          </q-card-section>
        </q-card>

      </div>
    </section>


    <section class="pesquisa">

      <q-input
        v-model="campoBusca"
        outlined
        dense
        placeholder="Buscar por nome ou email"
        class="campo-busca"
      />

      <q-select
        v-model="filtroStatus"
        outlined
        dense
        :options="opcoesStatus"
        class="filtro-status"
      />

    </section>

    <section class="tabela">
      <q-table
        flat
        :rows="usuarios"
        :columns="colunas"
        row-key="id"
        hide-pagination
        :rows-per-page-options="[0]"
        no-data-label="Dados serão carregados pelo backend."
        class="user-table"
      />
    </section>
  </q-page>

  
</template>


<script setup lang="ts">
import { ref } from 'vue';
import type { QTableColumn } from 'quasar';

const campoBusca = ref('');
const filtroStatus = ref('Todos os status');

const opcoesStatus = [
  'Todos os status',
  'Ativo',
  'Inativo',
];


const usuarios = ref([]);

const colunas: QTableColumn[] = [
  {
    name: 'nome',
    label: 'Nome',
    field: 'nome',
    align: 'left',
  },
  {
    name: 'email',
    label: 'Email',
    field: 'email',
    align: 'left',
  },
  {
    name: 'telefone',
    label: 'Telefone',
    field: 'telefone',
    align: 'left',
  },
  {
    name: 'livros',
    label: 'Livros alugados',
    field: 'livros',
    align: 'center',
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center',
  },
  {
    name: 'acao',
    label: 'Ação',
    field: 'acao',
    align: 'center',
  },
];
</script>


<style scoped>
.user-page {
  padding: 15px 20px;
  background-color: #ffffff;
  color: #1b3a5c;
}

.topo {
  margin-bottom: 25px;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.card {
  width: 115px;
  height: 80px;
  padding: 8px;
  background-color: #ffffff;
  border: 1px solid #1b3a5c;
  border-radius: 6px;
  box-shadow: none;
}

.card :deep(.q-card__section) {
  padding: 0;
}

.card-title {
  color: #34454d;
  font-size: 13px;
}

.indicador {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 2px;
}

.indicador.ativo {
  background-color: #4CAF50;
}

.indicador.inativo {
  background-color: #E94B4B;
}

.indicador.total {
  background-color: #1B3A5C;
}

.card-value {
  margin-top: 8px;
  color: #1b3a5c;
  font-size: 30px;
  line-height: 30px;
  font-weight: 600;
  text-align: center;
}

.pesquisa {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
  min-width: 0;
}

.campo-busca {
  flex: 1;
}

.filtro-status {
  width: 180px;
}

.tabela {
  width: 100%;
  min-height: 250px;
  overflow-x: auto;
  overflow-y: hidden;
  border: 1px solid #1b3a5c;
  border-radius: 6px;
  background-color: #ffffff;
}

.user-table {
  width: 100%;
}

.user-table :deep(th) {
  border-bottom: 1px solid #bdbdbd;
  color: #1b3a5c;
  font-size: 13px;
  font-weight: 600;
}

.user-table :deep(td) {
  border-bottom: 1px solid #eeeeee;
  color: #444444;
  font-size: 13px;
}

@media (max-width: 700px) {
  .pesquisa {
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }

  .filtro-status {
    width: 100%;
  }
}
</style>