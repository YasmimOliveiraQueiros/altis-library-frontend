```vue
<template>
  <section class="brand-panel">
    <div class="brand-content">
      <div class="book-icon">
        <q-icon
          name="menu_book"
          size="48px"/>
      </div>

      <h1>Altis+ Biblioteca</h1>
      <p>Sistema de gestão de aluguéis</p>

    </div>
  </section>
</template>

<style scoped>
.brand-panel {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-width: 0;
  background-color: #1d3b5c;
  color: #ffffff;
}

.brand-content {
  padding: 24px;
  text-align: center;
}

.book-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  margin: 0 auto 12px;
  border-radius: 14px;
  background-color: rgba(255, 255, 255, 0.12);
}

.brand-content h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.brand-content p {
  margin: 2px 0 0;
  font-size: 16px;
}

@media (max-width: 700px) {
  .brand-panel {
    flex: none;
    min-height: 200px;
  }

  .book-icon {
    width: 64px;
    height: 64px;
  }

  .book-icon :deep(.q-icon) {
    font-size: 36px !important;
  }

  .brand-content h1 {
    font-size: 21px;
  }

  .brand-content p {
    font-size: 14px;
  }
}
</style>
