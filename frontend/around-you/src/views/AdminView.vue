<template>
  <main class="min-h-screen bg-[#C1D2DE] px-4 py-12">
    <section class="mx-auto max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-[0_24px_80px_rgba(9,75,123,0.16)]">
      <div class="border-b border-[#094b7b]/10 bg-[#C1D2DE] px-8 py-8">
        <p class="text-xs font-semibold uppercase tracking-[0.32em] text-[#de5826]">Admin panel</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight text-[#094b7b]">Administration</h1>
      </div>

      <div class="grid gap-6 px-8 py-10 md:grid-cols-2">
        <article class="rounded-[24px] border border-[#094b7b]/10 bg-[#C1D2DE] p-6">
          <h2 class="text-xl font-bold text-[#094b7b]">Brugerstyring</h2>
          <p class="mt-3 text-slate-600">Her kan du samle moderation, brugerstatus og adgangsstyring, når backend-adminfunktionerne er på plads.</p>
        </article>

        <article class="rounded-[24px] border border-[#094b7b]/10 bg-[#C1D2DE] p-6">
          <h2 class="text-xl font-bold text-[#094b7b]">Indholdsoversigt</h2>
          <p class="mt-3 text-slate-600">Panelet er nu beskyttet i routeren og vises kun i navbaren, når frontend kan aflæse et admin-claim.</p>
        </article>
      </div>
    </section>
  </main>
</template>