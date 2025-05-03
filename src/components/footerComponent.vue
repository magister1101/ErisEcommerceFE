<template>
  <div class="bg-dark text-white q-pa-md">
    <div class="row q-col-gutter-sm q-mb-md">
      <!-- Left Side (Logo + Brand) -->
      <div class="col-12 col-md-6 text-left q-pa-xl sides">
        <div class="logo-section items-left cursor-pointer" @click="$router.push('/')">
          <img
            src="https://res.cloudinary.com/dvyjiepra/image/upload/v1744075727/Eris_LOGO_wy0z2j.png"
            alt="Eris Logo"
            style="width: 120px; height: auto"
          />
          <q-space />
          <span class="q-ml-sm text-h6 text-bold">ERIS エリス</span>
          <q-space />
          <span class="q-ml-sm text-caption text-bold"
            >Thank you for choosing Eris. We’re excited to support all your card game needs and look
            forward to providing you with an exceptional experience.</span
          >
        </div>
      </div>

      <!-- Right Side (Menu) -->
      <div class="col-12 col-md-6 text-left q-pa-xl sides">
        <div class="menu-section">
          <p class="text-h5 menu-title">MENU</p>
          <q-btn
            flat
            dense
            label="Cards"
            @click="$router.push('/cards')"
            class="menuBtn q-mt-lg"
            size="sm"
          />
          <q-btn
            flat
            dense
            label="Pre-Orders"
            @click="$router.push('/preOrders')"
            class="menuBtn"
            size="sm"
          />
          <q-btn
            flat
            dense
            label="Others"
            @click="$router.push('/others')"
            class="menuBtn"
            size="sm"
          />
          <q-btn flat dense label="FAQ" @click="$router.push('/faq')" class="menuBtn" size="sm" />
          <q-btn
            flat
            dense
            label="Contact Us"
            @click="$router.push('/contactUs')"
            class="menuBtn"
            size="sm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No changes needed here
</script>

<style lang="sass" scoped>
.bg-dark
  background-color: #2c3e50

.items-left
  display: flex
  flex-direction: column
  justify-content: flex-start
  align-items: flex-start

.menu-section
  display: flex
  flex-direction: column
  align-items: flex-start

.menu-title
  margin-bottom: 10px
  font-weight: bold

// ✅ Change text size inside q-btn
.menu-section :deep(.q-btn__content)
  font-size: 14px

.menuBtn
  color: #868686
.sides
  padding: 150px

@media (max-width: 768px)
  .q-gutter-md
    display: flex
    flex-direction: column
    align-items: center
  .sides
    padding: 50px
</style>
