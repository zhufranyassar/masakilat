# MasaKilat - KilaMeal: Website Responsif dan Interaktif

Website informasi untuk **MasaKilat** dan produk **KilaMeal** (nasi dan lauk siap santap untuk hiking dan camping). Dibangun dengan HTML5, CSS3, dan JavaScript murni, tanpa framework.

## Struktur Folder

```
project-web/
├── index.html        # Home: hero, manfaat, galeri slider, langkah pesan, CTA
├── about.html        # About Us: identitas, cerita pengembangan, nilai, tim
├── services.html     # Produk: katalog, filter, dan modal detail produk
├── bekal.html        # Susun Bekalmu: kalkulator jumlah kemasan (form + validasi)
├── contact.html      # Cara Pesan, FAQ (accordion), dan form kontak
├── css/
│   └── style.css     # Seluruh styling (variabel warna, layout, responsive)
├── js/
│   └── script.js     # Seluruh interaksi JavaScript
├── image/           # Logo, maskot, dan foto/ilustrasi produk
└── README.md
```

Halaman dibuka lewat `index.html`. Tidak perlu server; cukup klik dua kali file tersebut di browser. Untuk pengalaman terbaik, gunakan ekstensi **Live Server** di VS Code.

## Pemenuhan Ketentuan Minimal

| Komponen | Ketentuan | Implementasi |
|---|---|---|
| Halaman/section | Minimal 4 | 5 halaman HTML |
| Navigation | Wajib | Menu di setiap halaman, hamburger di layar kecil |
| Header/Hero | Wajib | Hero di `index.html`, page header di halaman lain |
| Content | Wajib | Section About, Produk, Susun Bekalmu, FAQ |
| Image | Wajib | Logo, maskot, galeri, foto produk |
| Card/komponen informasi | Wajib | Kartu manfaat, kartu produk, kartu langkah, kartu tim |
| Form | Minimal 1 | Kalkulator bekal dan form kontak |
| JavaScript | Minimal 4 fitur | 10 fitur (lihat daftar di bawah) |
| Responsive | Wajib | Breakpoint 1024px, 860px, dan 600px |
| Library/component | Minimal 1 | Swiper (lihat bagian Library) |
| Footer | Wajib | Footer di setiap halaman |

## Fitur JavaScript (`js/script.js`)

1. **Menu hamburger**: menu tampil dan tertutup di layar kecil, dengan atribut `aria-expanded`.
2. **Tema terang dan gelap**: pilihan disimpan di `localStorage`, sehingga tetap tersimpan saat halaman dibuka lagi.
3. **Slider galeri**: dibuat dengan library Swiper (lihat bagian Library).
4. **Filter produk**: menyaring kartu berdasarkan kategori (Semua, Ayam, Sayuran).
5. **Modal detail produk**: menampilkan detail, memvalidasi jumlah kemasan, lalu membuka WhatsApp. Bisa ditutup dengan tombol Esc atau klik di luar kotak.
6. **Kalkulator Susun Bekalmu**: menghitung perkiraan kemasan (jumlah orang × waktu makan), menjumlahkan harga per varian, dan memperbarui ringkasan secara langsung.
7. **Validasi form kontak**: memeriksa nama, format nomor WhatsApp Indonesia, topik, dan panjang pesan, lalu membuka WhatsApp dengan pesan yang sudah terisi.
8. **Accordion FAQ**: hanya satu jawaban yang terbuka pada satu waktu.
9. **Tombol kembali ke atas**: muncul setelah halaman di-scroll lebih dari 400px.
10. **Animasi saat scroll**: elemen muncul perlahan menggunakan `IntersectionObserver`.

Konfigurasi harga, nomor WhatsApp, dan status promo berada di bagian atas `script.js` (objek `CONFIG`), sehingga cukup diubah di satu tempat.

## Library yang Digunakan: Swiper

- **Nama**: Swiper (versi 11), library slider untuk web.
- **Tujuan**: membuat galeri geser yang bisa di-swipe di HP, dengan autoplay, navigasi panah, dan titik pagination.
- **Lokasi di website**: section "Lihat Isi Paket" pada `index.html`.
- **Cara pakai**:
  - CSS dimuat di `<head>` dari CDN jsDelivr, dan JS dimuat sebelum `script.js`.
  - Struktur HTML mengikuti format Swiper: `.swiper > .swiper-wrapper > .swiper-slide`, dengan `.swiper-pagination` dan tombol navigasi.
  - Inisialisasi dilakukan di `initSwiper()` dalam `script.js` dengan opsi `loop`, `autoplay`, `pagination`, dan `navigation`.
- Gaya tampilan slide (kartu, bayangan, teks caption) ditulis sendiri di `style.css`, bukan menyalin contoh dari dokumentasi.

Library lain yang bisa ditambahkan jika diperlukan: AOS (animasi scroll) atau Font Awesome (ikon).

## Font

Google Fonts: **Fredoka** untuk judul dan **Nunito** untuk teks isi.

## Palet Warna

Diambil dari palet brand: oranye `#F06A10`, cokelat `#BA5712`, cokelat tua `#72230E`, merah `#C93628`, kuning `#FFD80C`, hijau lime `#97B800`, dan krem `#FBEEE4`.

## Hal yang Perlu Diverifikasi Sebelum Publikasi

Beberapa data di website bersifat sementara atau bertentangan antar-dokumen. Sebaiknya dicek dengan tim MasaKilat:

- **Isi per kemasan**: brief menyebut 100 g nasi + 100 g lauk (200 g). Desain kemasan (pouch) bertuliskan "Berat bersih 4 packs × 100 g". Website mengikuti brief. Perlu dipastikan mana yang benar.
- **Nomor WhatsApp dan Instagram**: `+62 858-0027-4774` dan `@masakilat` diambil dari desain kemasan. Konstanta `CONFIG.WA_NUMBER` di `script.js` perlu diverifikasi.
- **Nama varian**: Ayam Chili Padi, Ayam Teriyaki, Mix Vegetable, dan Capcay adalah nama sementara dari desain kemasan.
- **Kategori Capcay**: saat ini dimasukkan ke kategori "Sayuran". Jika ternyata mengandung daging, pindahkan atribut `data-cat` di `services.html`.
- **Harga dan promo**: harga normal Rp55.000 dan promo Rp49.999. Jika periode promo sudah berakhir, ubah `PROMO_ACTIVE` menjadi `false` di `script.js`.
- **Status stok**: semua produk ditandai "Preorder" karena kesiapan stok belum dikonfirmasi.
- **Foto produk**: kartu produk masih memakai ilustrasi `bowl.jpg`. Ganti dengan foto aktual kemasan dan hasil penyajian.
- **Komposisi, alergen, waktu pemanasan, dan masa simpan**: sengaja belum ditampilkan sebagai angka pasti karena belum tervalidasi. Isi setelah pengujian selesai.
- **Klaim gizi**: tidak ditampilkan karena belum ada dasar data yang dapat dipertanggungjawabkan.

## Batasan Versi Ini

Ini adalah versi **frontend** untuk tugas proyek. Fitur berikut belum dibuat karena membutuhkan backend atau database: akun pengguna, keranjang belanja, checkout website, pembayaran otomatis, pelacakan pesanan, dan dashboard admin. Pemesanan saat ini dilakukan melalui WhatsApp, yang juga sesuai dengan alur pada brief.

## Cara Demonstrasi Responsive

Saat demo, tunjukkan website pada minimal dua ukuran layar. Cara termudah: buka halaman di browser, tekan `F12`, lalu aktifkan "Toggle device toolbar" (ikon HP). Bandingkan tampilan desktop (±1200px) dengan tampilan smartphone (±390px), misalnya saat menu hamburger dibuka dan kartu produk tersusun satu kolom.

## Sub-CPMK yang Terpenuhi

- **Sub-CPMK 1**: struktur HTML5 dengan `header`, `nav`, `main`, `section`, `article`, dan `footer`.
- **Sub-CPMK 2**: CSS3 (flexbox dan grid, variabel, transition, hover, styling form) serta JavaScript (10 fitur interaktif).
- **Sub-CPMK 3**: UI responsif dan interaktif, dengan library Swiper dan integrasi frontend.
