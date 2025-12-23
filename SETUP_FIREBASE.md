# Panduan Setup Firebase untuk Sistem Profil Penduduk Desa

## Langkah 1: Buat Proyek Firebase

1. Kunjungi [Firebase Console](https://console.firebase.google.com/)
2. Klik "Add project" atau "Tambah proyek"
3. Beri nama proyek (contoh: "desa-penduduk")
4. Ikuti wizard setup hingga selesai

## Langkah 2: Registrasi Web App

1. Di halaman overview proyek, klik icon Web (</>) 
2. Beri nama app (contoh: "Profil Penduduk Desa")
3. Centang "Also set up Firebase Hosting" (opsional)
4. Klik "Register app"
5. **PENTING**: Salin konfigurasi Firebase yang ditampilkan

## Langkah 3: Setup Firestore Database

1. Di sidebar, pilih "Firestore Database"
2. Klik "Create database"
3. Pilih mode:
   - **Production mode**: untuk production (dengan rules ketat)
   - **Test mode**: untuk development (akses lebih mudah)
4. Pilih lokasi server (sebaiknya pilih yang terdekat, contoh: asia-southeast2)
5. Klik "Enable"

## Langkah 4: Setup Authentication

1. Di sidebar, pilih "Authentication"
2. Klik "Get started"
3. Pilih tab "Sign-in method"
4. Aktifkan "Email/Password"
5. Klik "Enable" dan "Save"

## Langkah 5: Buat Admin User

1. Di Authentication, pilih tab "Users"
2. Klik "Add user"
3. Masukkan email dan password untuk admin
   - Contoh: admin@desa.id / password123
4. Klik "Add user"

## Langkah 6: Setup Environment Variables

1. Buka file `.env.local` di root project (buat jika belum ada)
2. Tambahkan konfigurasi Firebase dari Langkah 2:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Langkah 7: Update Firestore Rules (Opsional tapi Disarankan)

1. Di Firestore Database, pilih tab "Rules"
2. Ganti rules dengan:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read for all (untuk public dashboard)
    match /penduduk/{document} {
      allow read: if true;
      allow write: if request.auth != null; // Hanya admin yang sudah login
    }
  }
}
```

3. Klik "Publish"

## Langkah 8: Test Aplikasi

1. Jalankan aplikasi: `npm run dev`
2. Buka browser: `http://localhost:3000`
3. Coba login dengan akun admin yang dibuat di Langkah 5
4. Tambahkan data penduduk di dashboard admin
5. Kembali ke halaman utama, data akan tampil

## Langkah 9: Deploy (Opsional)

### Deploy ke Vercel:
1. Push code ke GitHub
2. Buka [Vercel](https://vercel.com)
3. Import repository
4. Tambahkan environment variables dari `.env.local`
5. Deploy!

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
- Cek kembali environment variables
- Pastikan semua variable NEXT_PUBLIC_* sudah benar

### Error: "Missing or insufficient permissions"
- Update Firestore Rules seperti di Langkah 7
- Pastikan user sudah login saat menambah data

### Data tidak muncul
- Cek koneksi internet
- Buka browser console untuk lihat error
- Pastikan Firestore sudah enabled

## Kontak & Support

Jika ada pertanyaan, hubungi developer atau buka dokumentasi:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

**PENTING**: Jangan commit file `.env.local` ke Git!
Tambahkan `.env.local` ke `.gitignore`
