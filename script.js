/* =========================================================
   MasaKilat - KilaMeal | script.js
   Daftar fitur interaktif:
   1. Menu hamburger untuk layar kecil
   2. Ganti tema terang / gelap (disimpan di localStorage)
   3. Slider galeri (library Swiper)
   4. Filter katalog produk
   5. Modal detail produk
   6. Kalkulator Susun Bekalmu (validasi + ringkasan real-time)
   7. Validasi form kontak + pesan WhatsApp otomatis
   8. Accordion FAQ (hanya satu yang terbuka)
   9. Tombol kembali ke atas
   10. Animasi muncul saat di-scroll (IntersectionObserver)
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Konfigurasi terpusat ----------
     Ubah di sini saja jika harga, nomor, atau periode promo berubah. */
  const CONFIG = {
    WA_NUMBER: '6285800274774',   // Verifikasi nomor WhatsApp bisnis sebelum publikasi
    PRICE_NORMAL: 55000,          // Harga normal per paket lengkap
    PRICE_PROMO: 49999,           // Harga promo peluncuran
    PROMO_ACTIVE: true            // Ubah ke false jika periode promo sudah berakhir
  };

  const currentPrice = CONFIG.PROMO_ACTIVE ? CONFIG.PRICE_PROMO : CONFIG.PRICE_NORMAL;

  // Tandai bahwa JavaScript aktif (dipakai CSS untuk animasi muncul saat scroll)
  document.documentElement.classList.add('js');

  /* ---------- Fungsi pembantu ---------- */
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const formatRp = (n) => 'Rp' + Number(n).toLocaleString('id-ID');

  const isIntIn = (n, min, max) => Number.isInteger(n) && n >= min && n <= max;

  const waLink = (message) =>
    `https://wa.me/${CONFIG.WA_NUMBER}?text=${encodeURIComponent(message)}`;

  const setError = (id, message) => {
    const el = document.getElementById(id);
    if (el) el.textContent = message || '';
  };

  /* ==========================================================
     1. Menu hamburger
     ========================================================== */
  function initNav() {
    const header = $('.site-header');
    const toggle = $('.menu-toggle');
    if (!header || !toggle) return;

    toggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.innerHTML = isOpen ? '&times;' : '&#9776;';
    });

    // Tutup menu setelah salah satu link dipilih
    $$('.nav-links a').forEach((link) => {
      link.addEventListener('click', () => {
        header.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '&#9776;';
      });
    });
  }

  /* ==========================================================
     2. Tema terang / gelap
     ========================================================== */
  function initTheme() {
    const root = document.documentElement;
    const buttons = $$('.theme-toggle');

    const apply = (theme) => {
      root.setAttribute('data-theme', theme);
      buttons.forEach((btn) => {
        btn.innerHTML = theme === 'dark' ? '&#9728;' : '&#9790;';
        btn.setAttribute('aria-label', theme === 'dark' ? 'Gunakan tema terang' : 'Gunakan tema gelap');
      });
    };

    let saved = null;
    try {
      saved = localStorage.getItem('masakilat-theme');
    } catch (e) {
      // localStorage tidak tersedia (mis. mode privat): lanjut dengan tema default
    }
    apply(saved || 'light');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        apply(next);
        try {
          localStorage.setItem('masakilat-theme', next);
        } catch (e) { /* abaikan */ }
      });
    });
  }

  /* ==========================================================
     3. Slider galeri (Swiper)
     ========================================================== */
  function initSwiper() {
    if (typeof Swiper === 'undefined' || !$('.gallery-swiper')) return;

    new Swiper('.gallery-swiper', {
      loop: true,
      autoplay: { delay: 4000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });
  }

  /* ==========================================================
     4. Filter katalog produk
     ========================================================== */
  function initProductFilter() {
    const buttons = $$('.filter-btn');
    const cards = $$('.product-card[data-cat]');
    if (!buttons.length || !cards.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        buttons.forEach((b) => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });

        cards.forEach((card) => {
          const show = filter === 'semua' || card.dataset.cat === filter;
          card.classList.toggle('hidden', !show);
        });
      });
    });
  }

  /* ==========================================================
     5. Modal detail produk
     ========================================================== */
  function initProductModal() {
    const modal = $('#product-modal');
    if (!modal) return;

    const titleEl = $('#modal-title', modal);
    const descEl = $('#modal-desc', modal);
    const priceEl = $('#modal-price', modal);
    const qtyEl = $('#modal-qty', modal);
    const waBtn = $('#modal-wa', modal);
    const closeBtn = $('.modal-close', modal);
    let currentProduct = null;
    let lastFocused = null;

    const priceLabel = () =>
      CONFIG.PROMO_ACTIVE
        ? `${formatRp(CONFIG.PRICE_PROMO)} (promo, normal ${formatRp(CONFIG.PRICE_NORMAL)})`
        : formatRp(CONFIG.PRICE_NORMAL);

    const open = (name, desc, img) => {
      currentProduct = name;
      lastFocused = document.activeElement;
      titleEl.textContent = name;
      descEl.textContent = desc;
      priceEl.textContent = priceLabel();
      qtyEl.value = 1;
      setError('modal-err', '');
      const modalImg = $('#modal-img', modal);
      if (img) modalImg.src = img;
      modal.classList.add('open');
      qtyEl.focus();
    };

    const close = () => {
      modal.classList.remove('open');
      if (lastFocused) lastFocused.focus();
    };

    $$('.btn-detail').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.product-card');
        const img = card ? card.querySelector('img').getAttribute('src') : '';
        open(btn.dataset.name, btn.dataset.desc, img);
      });
    });

    closeBtn.addEventListener('click', close);

    // Tutup jika klik area gelap di luar kotak
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    // Tutup dengan tombol Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });

    // Validasi jumlah lalu kirim ke WhatsApp
    waBtn.addEventListener('click', () => {
      const qty = Number(qtyEl.value);
      if (!isIntIn(qty, 1, 50)) {
        setError('modal-err', 'Jumlah kemasan harus antara 1 dan 50.');
        qtyEl.classList.add('invalid');
        qtyEl.focus();
        return;
      }
      qtyEl.classList.remove('invalid');
      setError('modal-err', '');

      const message =
        `Halo admin MasaKilat, saya ingin memesan KilaMeal ${currentProduct}.\n` +
        `Jumlah: ${qty} kemasan\n` +
        `Subtotal produk: ${formatRp(qty * currentPrice)}\n` +
        `Mohon konfirmasi stok, ongkir, dan cara pembayaran.`;

      window.open(waLink(message), '_blank', 'noopener');
    });
  }

  /* ==========================================================
     6. Kalkulator Susun Bekalmu
     Rumus: jumlah kemasan yang disarankan = jumlah orang x waktu makan
     (contoh dari brief: 4 orang x 2 waktu makan = 8 kemasan)
     ========================================================== */
  function initCalculator() {
    const form = $('#calc-form');
    if (!form) return;

    const peopleEl = $('#people');
    const mealsEl = $('#meals');
    const dateEl = $('#trip-date');
    const notesEl = $('#notes');
    const variantEls = $$('input[data-name]', form);
    const suggestEl = $('#sum-suggest');
    const selectedEl = $('#sum-selected');
    const itemsEl = $('#sum-items');
    const totalEl = $('#sum-total');
    const noteEl = $('#sum-note');
    const waBtn = $('#calc-wa');

    // Membaca dan memvalidasi seluruh input
    function computeState() {
      const errs = {};
      const people = Number(peopleEl.value);
      const meals = Number(mealsEl.value);

      if (!isIntIn(people, 1, 50)) errs.people = 'Masukkan jumlah orang antara 1 dan 50.';
      if (!isIntIn(meals, 1, 10)) errs.meals = 'Masukkan waktu makan antara 1 dan 10.';

      let selected = 0;
      let total = 0;
      let variantInvalid = false;
      const items = [];

      variantEls.forEach((input) => {
        const raw = input.value;
        const qty = Number(raw);
        if (raw === '' || !isIntIn(qty, 0, 100)) {
          variantInvalid = true;
          return;
        }
        if (qty > 0) {
          const price = currentPrice;
          items.push({ name: input.dataset.name, qty, subtotal: qty * price });
          selected += qty;
          total += qty * price;
        }
      });

      if (variantInvalid) errs.variant = 'Jumlah setiap varian harus bilangan bulat 0 sampai 100.';

      return {
        errs,
        people,
        meals,
        suggest: errs.people || errs.meals ? null : people * meals,
        selected,
        total,
        items,
        noneSelected: !variantInvalid && selected === 0,
        date: dateEl.value,
        notes: notesEl.value.trim()
      };
    }

    function showErrors(errs) {
      setError('err-people', errs.people);
      setError('err-meals', errs.meals);
      setError('err-variant', errs.variant);
      peopleEl.classList.toggle('invalid', !!errs.people);
      mealsEl.classList.toggle('invalid', !!errs.meals);
    }

    // Memperbarui panel ringkasan di sisi kanan
    function renderSummary(state) {
      suggestEl.textContent = state.suggest === null ? '–' : state.suggest;
      selectedEl.textContent = state.selected;
      totalEl.textContent = formatRp(state.total);

      itemsEl.innerHTML = '';
      state.items.forEach((item) => {
        const li = document.createElement('li');
        const left = document.createElement('span');
        const right = document.createElement('span');
        left.textContent = `${item.name} × ${item.qty}`;
        right.textContent = formatRp(item.subtotal);
        li.append(left, right);
        itemsEl.appendChild(li);
      });

      if (state.errs.variant) {
        noteEl.textContent = state.errs.variant;
      } else if (state.suggest === null) {
        noteEl.textContent = 'Isi jumlah orang dan waktu makan dengan angka yang benar untuk melihat perkiraan.';
      } else if (state.noneSelected) {
        noteEl.textContent = 'Pilih minimal satu kemasan untuk melihat total harga.';
      } else if (state.selected === state.suggest) {
        noteEl.textContent = 'Jumlah kemasan sudah sesuai perkiraan.';
      } else {
        noteEl.textContent = 'Jumlah kemasan berbeda dari perkiraan. Tidak masalah, sesuaikan dengan kebutuhanmu.';
      }

      const hasErrors = Object.keys(state.errs).length > 0;
      waBtn.disabled = hasErrors || state.noneSelected;
    }

    // Perbarui ringkasan setiap kali input berubah (tanpa menampilkan pesan error)
    function update() {
      const state = computeState();
      showErrors(state.errs);
      renderSummary(state);
    }

    form.addEventListener('input', update);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const state = computeState();
      showErrors(state.errs);

      if (Object.keys(state.errs).length) {
        const first = Object.keys(state.errs)[0];
        const target = first === 'people' ? peopleEl : first === 'meals' ? mealsEl : variantEls[0];
        if (target) target.focus();
        renderSummary(state);
        return;
      }

      if (state.noneSelected) {
        setError('err-variant', 'Pilih minimal satu kemasan untuk dihitung.');
      } else {
        setError('err-variant', '');
      }
      renderSummary(state);
    });

    // Reset: tunggu nilai input kembali ke default, lalu hitung ulang
    form.addEventListener('reset', () => {
      setTimeout(() => {
        ['err-people', 'err-meals', 'err-variant'].forEach((id) => setError(id, ''));
        peopleEl.classList.remove('invalid');
        mealsEl.classList.remove('invalid');
        update();
      }, 0);
    });

    // Kirim ringkasan ke WhatsApp dengan format draf dari brief
    waBtn.addEventListener('click', () => {
      const state = computeState();
      showErrors(state.errs);
      if (Object.keys(state.errs).length || state.noneSelected) return;

      const lines = state.items.map((i) => `- ${i.name}: ${i.qty} kemasan`).join('\n');
      const message =
        `Halo admin MasaKilat, saya ingin memesan KilaMeal.\n` +
        `Jumlah orang: ${state.people}, waktu makan: ${state.meals}\n` +
        `Rincian:\n${lines}\n` +
        `Total kemasan: ${state.selected}\n` +
        `Subtotal produk: ${formatRp(state.total)}\n` +
        `Tanggal dibutuhkan: ${state.date || '-'}\n` +
        `Catatan: ${state.notes || '-'}\n` +
        `Mohon konfirmasi stok, ongkir, dan cara pembayaran.`;

      window.open(waLink(message), '_blank', 'noopener');
    });

    update();
  }

  /* ==========================================================
     7. Validasi form kontak + pesan WhatsApp
     ========================================================== */
  function initContactForm() {
    const form = $('#contact-form');
    if (!form) return;

    const nameEl = $('#c-name');
    const waEl = $('#c-wa');
    const topicEl = $('#c-topic');
    const orderEl = $('#c-order');
    const msgEl = $('#c-msg');
    const successEl = $('#form-success');

    // Nomor Indonesia: 08xxxxxxxxxx atau +628xxxxxxxxxx / 628xxxxxxxxxx
    const WA_PATTERN = /^(\+?62|0)8\d{7,11}$/;

    const topicLabels = {
      tanya: 'Tanya produk',
      pesan: 'Pesan',
      keluhan: 'Keluhan',
      lainnya: 'Lainnya'
    };

    function validate() {
      let valid = true;
      const name = nameEl.value.trim();
      const wa = waEl.value.replace(/[\s()-]/g, '');
      const msg = msgEl.value.trim();

      if (name.length < 2) {
        setError('err-name', 'Nama minimal 2 karakter.');
        nameEl.classList.add('invalid');
        valid = false;
      } else {
        setError('err-name', '');
        nameEl.classList.remove('invalid');
      }

      if (!WA_PATTERN.test(wa)) {
        setError('err-wa', 'Masukkan nomor WhatsApp yang valid, contoh 08123456789.');
        waEl.classList.add('invalid');
        valid = false;
      } else {
        setError('err-wa', '');
        waEl.classList.remove('invalid');
      }

      if (!topicEl.value) {
        setError('err-topic', 'Pilih salah satu topik.');
        topicEl.classList.add('invalid');
        valid = false;
      } else {
        setError('err-topic', '');
        topicEl.classList.remove('invalid');
      }

      if (msg.length < 10) {
        setError('err-msg', 'Pesan minimal 10 karakter.');
        msgEl.classList.add('invalid');
        valid = false;
      } else {
        setError('err-msg', '');
        msgEl.classList.remove('invalid');
      }

      return valid;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      successEl.classList.add('hidden');

      if (!validate()) {
        const firstInvalid = form.querySelector('.invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const message =
        `Halo admin MasaKilat.\n` +
        `Nama: ${nameEl.value.trim()}\n` +
        `WhatsApp: ${waEl.value.trim()}\n` +
        `Topik: ${topicLabels[topicEl.value]}\n` +
        `Nomor pesanan: ${orderEl.value.trim() || '-'}\n` +
        `Pesan: ${msgEl.value.trim()}`;

      successEl.textContent = 'Terima kasih! Pesanmu sudah disiapkan. Lanjutkan dengan mengirim pesan di WhatsApp yang terbuka.';
      successEl.classList.remove('hidden');
      window.open(waLink(message), '_blank', 'noopener');
      form.reset();
    });
  }

  /* ==========================================================
     8. Accordion FAQ (hanya satu yang terbuka)
     ========================================================== */
  function initFAQ() {
    const items = $$('.faq-item');
    if (!items.length) return;

    items.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (!item.open) return;
        items.forEach((other) => {
          if (other !== item) other.open = false;
        });
      });
    });

    // Buka FAQ yang dituju dari tautan #faq atau pertanyaan tertentu
    if (window.location.hash === '#faq') {
      const faqSection = $('#faq');
      if (faqSection) faqSection.scrollIntoView();
    }
  }

  /* ==========================================================
     9. Tombol kembali ke atas
     ========================================================== */
  function initBackToTop() {
    const btn = $('.to-top');
    if (!btn) return;

    const onScroll = () => {
      btn.classList.toggle('show', window.scrollY > 400);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    onScroll();
  }

  /* ==========================================================
     10. Animasi muncul saat di-scroll
     ========================================================== */
  function initReveal() {
    const items = $$('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach((el) => observer.observe(el));
  }

  /* ---------- Isi harga di kartu produk sesuai CONFIG ---------- */
  function fillPrices() {
    $$('.price-now').forEach((el) => {
      el.textContent = formatRp(currentPrice);
    });
    $$('.price-normal').forEach((el) => {
      if (CONFIG.PROMO_ACTIVE) {
        el.textContent = formatRp(CONFIG.PRICE_NORMAL);
      } else {
        el.style.display = 'none';
      }
    });
  }

  /* ---------- Jalankan semua fitur setelah halaman siap ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    fillPrices();
    initNav();
    initTheme();
    initSwiper();
    initProductFilter();
    initProductModal();
    initCalculator();
    initContactForm();
    initFAQ();
    initBackToTop();
    initReveal();
  });
})();
