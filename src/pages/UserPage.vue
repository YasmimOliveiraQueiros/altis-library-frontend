<template>
  <q-page class="q-pa-md user-page">

    <section class="topo">
      <div class="cards">
        <q-card v-for="card in statisticCards" :key="card.label" class="card">
          <q-card-section>
            <div class="card-title">
              <span class="indicador" :class="card.indicatorClass"></span>
              {{ card.label }}
            </div>
            <div class="card-value">{{ card.value }}</div>
          </q-card-section>
        </q-card>
      </div>
    </section>


    <section class="pesquisa">

      <q-input
        v-model="campoBusca"
        outlined
        dense
        :placeholder="t('users.searchPlaceholder')"
        class="campo-busca"
        @keyup.enter="pesquisarUsuarios"
      />

    </section>

    <section class="tabela">
      <q-table
        flat
        :rows="usuarios"
        :columns="colunas"
        row-key="id"
        :loading="carregando"
        hide-pagination
        hide-bottom
        :rows-per-page-options="[0]"
        :no-data-label="noDataLabel"
        class="user-table">
      
      <template #body-cell-acao="props">
        <q-td :props="props">
          <q-btn
          outline
          dense
          no-caps
          :label="props.row.active ? t('users.actions.deactivate') : t('users.actions.activate')"
          :loading="carregando"
          @click="alternarStatus(props.row)"
          />
        </q-td>
      </template>
     </q-table>

      <div class="pagination-controls">
        <div class="page-size-control">
          <span>{{ t('users.pagination.rowsPerPage') }}</span>
          <q-select
            v-model="tamanhoPagina"
            dense
            outlined
            :options="opcoesTamanhoPagina"
            class="page-size-select"
            popup-content-class="filter-select-menu"
            :aria-label="t('users.pagination.rowsPerPage')"
            @update:model-value="alterarTamanhoPagina"
          />
        </div>

        <div class="page-navigation">
          <span class="page-label">{{ pageLabel }}</span>
          <q-btn
            flat
            round
            dense
            icon="chevron_left"
            :aria-label="t('users.pagination.previous')"
            :disable="carregando || pagina === 0 || totalPaginas === 0"
            @click="irParaPaginaAnterior"
          />
          <q-btn
            flat
            round
            dense
            icon="chevron_right"
            :aria-label="t('users.pagination.next')"
            :disable="carregando || pagina + 1 >= totalPaginas"
            @click="irParaProximaPagina"
          />
        </div>
      </div>
    </section>
  </q-page>  
</template>


<script setup lang="ts">

import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useI18n } from 'vue-i18n';
import type { QTableColumn } from 'quasar';
import { UserService } from '@/services/UserService';
import type { UserResponse } from '@/types/User';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const { t } = useI18n();
const campoBusca = ref('');
const buscaAplicada = ref('');
const opcoesTamanhoPagina = [10, 25, 50, 100];
const pagina = ref(0);
const tamanhoPagina = ref(10);
const totalPaginas = ref(0);
const totalEncontrado = ref(0);


const usuarios = ref<UserResponse[]>([]);


const totalAtivos = ref(0);
const totalInativos = ref(0);
const totalUsuarios = ref(0);

const statisticCards = computed(() => [
  { label: t('users.stats.active'), value: totalAtivos.value, indicatorClass: 'ativo' },
  { label: t('users.stats.inactive'), value: totalInativos.value, indicatorClass: 'inativo' },
  { label: t('users.stats.total'), value: totalUsuarios.value, indicatorClass: 'total' },
]);

const pageLabel = computed(() =>
  totalPaginas.value > 0
    ? t('users.pagination.page', {
        current: pagina.value + 1,
        total: totalPaginas.value,
        count: totalEncontrado.value,
      })
    : t('users.pagination.noPages'),
);

const carregando = ref(false);
const erro = ref('');

const noDataLabel = computed(() => erro.value || t('users.empty'));

function getRequestErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return t('users.errors.serviceUnavailable');
    if (error.response.status === 401) return t('users.errors.unauthorized');
    if (error.response.status === 403) return t('users.errors.forbidden');
  }

  return t('users.errors.generic');
}

async function carregarUsuarios(atualizarEstatisticas = false) {
  carregando.value = true;
  erro.value = '';

  try {
    if (atualizarEstatisticas) {
      const tamanhoPagina = 100;
      let pagina = 0;
      let totalPaginas = 1;
      let ativos = 0;
      let inativos = 0;
      let total = 0;

      do {
        const resposta = await UserService.getUsers({
          page: pagina,
          size: tamanhoPagina,
        });

        total = resposta.totalElements;
        totalPaginas = resposta.totalPages;

        for (const usuario of resposta.content) {
          if (usuario.active) {
            ativos++;
          } else {
            inativos++;
          }
        }

        pagina++;
      } while (pagina < totalPaginas);

      totalAtivos.value = ativos;
      totalInativos.value = inativos;
      totalUsuarios.value = total;
    }

    const respostaTabela = await UserService.getUsers({
      ...(buscaAplicada.value ? { search: buscaAplicada.value } : {}),
      page: pagina.value,
      size: tamanhoPagina.value,
    });

    usuarios.value = respostaTabela.content ?? [];
    pagina.value = respostaTabela.number;
    totalEncontrado.value = respostaTabela.totalElements;
    totalPaginas.value = respostaTabela.totalPages;
  } catch (error: unknown) {
    console.error('Erro ao carregar usuários:', error);
    erro.value = getRequestErrorMessage(error);
  } finally {
    carregando.value = false;
  }
}

async function alternarStatus(usuario: UserResponse) {
  const novoStatus = !usuario.active;

  try {
    await UserService.updateStatus(usuario.id, novoStatus);
    await carregarUsuarios(true);

    $q.notify({
      type: 'positive',
      message: novoStatus
      ? t('users.success.activated')
      : t('users.success.deactivated'),
      position: 'top-right',
      timeout: 3000,
    });
  } catch (error: unknown) {
    console.error('Erro ao atualizar status do usuário:', error);

    $q.notify({
      type: 'negative',
      message: getRequestErrorMessage(error),
      position: 'top-right',
      timeout: 3000,
    });
  }
}

function pesquisarUsuarios() {
  buscaAplicada.value = campoBusca.value.trim();
  pagina.value = 0;
  void carregarUsuarios();
}

function alterarTamanhoPagina() {
  pagina.value = 0;
  void carregarUsuarios();
}

function irParaPaginaAnterior() {
  if (pagina.value === 0) return;
  pagina.value--;
  void carregarUsuarios();
}

function irParaProximaPagina() {
  if (pagina.value + 1 >= totalPaginas.value) return;
  pagina.value++;
  void carregarUsuarios();
}

onMounted(() => {
  void carregarUsuarios(true);
});

const colunas = computed<QTableColumn[]>(() => [
  {
    name: 'nome',
    label: t('users.table.name'),
    field: 'name',
    align: 'left',
  },
  {
    name: 'email',
    label: t('users.table.email'),
    field: 'email',
    align: 'left',
  },
  {
    name: 'telefone',
    label: t('users.table.phone'),
    field: 'phone',
    align: 'left',
  },
  {
    name: 'status',
    label: t('users.table.status'),
    field: (row: UserResponse) => row.active ? t('users.status.active') : t('users.status.inactive'),
    align: 'center',
  },
  {
    name: 'acao',
    label: t('users.table.action'),
    field: 'acao',
    align: 'center',
  },
]);

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

.pagination-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
  border-top: 1px solid #eeeeee;
  color: #34454d;
  font-size: 13px;
}

.page-size-control,
.page-navigation {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-size-select {
  width: 75px;
}

.page-label {
  min-width: 105px;
  text-align: right;
}

@media (max-width: 700px) {
  .pesquisa {
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
