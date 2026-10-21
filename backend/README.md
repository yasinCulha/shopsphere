# ShopSphere Backend

## Neon veritabanını hazırlama

1. Neon Console'da ShopSphere projesini, kullanacağınız branch'i ve veritabanını seçin.
2. **SQL Editor**'ü açın.
3. [`database/schema.sql`](./database/schema.sql) dosyasının tamamını editöre yapıştırıp çalıştırın.
4. Sol taraftaki **Tables** bölümünde `public` şemasını yenileyin. `products`, `users` ve `refresh_tokens` tabloları görünmelidir.

Şema dosyası `IF NOT EXISTS` kullandığı için aynı başlangıç SQL'ini tekrar çalıştırmak var olan tabloları silmez.

Ürünleri eklemek için backend klasöründe `npm run seed` komutunu çalıştırın. Bu komut yalnızca `products` tablosuna ürün yazar; tabloları oluşturmaz.

Backend bağlantısı için `backend/.env` dosyasında `DATABASE_URL` ve `JWT_ACCESS_SECRET` tanımlı olmalıdır. `DATABASE_URL`, Neon Console'da seçtiğiniz branch ve veritabanına ait bağlantı adresi olmalıdır.
