const cors = require('cors');
const express = require('express');
const path = require('path');
const app = express();

app.use(cors()); 
app.use(express.json());

const db = require('./db');
require('dotenv').config();

const port = process.env.PORT || 3000;

// HTML, CSS, JS dosyalarını serve et
app.use(express.static(__dirname));

// Ana sayfa

// Tarif detay sayfası (HTML'i göster)
/*app.get('/tarifler/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'tarif-detay.html'));
});*/

// API: Tüm tarifleri getir
// API: Tüm tarifleri getir ve Akıllı Arama Yap
app.get('/api/tarifler', async (req, res) => {
    const { search } = req.query; // Frontend'den gelen arama kelimesi (?search=...)
    try {
        let sorgu = 'SELECT * FROM recipes';
        let parametreler = [];

        // Eğer kullanıcı arama çubuğuna bir şey yazdıysa sorguyu genişletiyoruz
        if (search) {
            sorgu += ` WHERE title ILIKE $1 
                       OR category ILIKE $1 
                       OR ingredients ILIKE $1`;
            parametreler.push(`%${search}%`); // Kelimenin başında veya sonunda ne olursa olsun getir
        }

        sorgu += ' ORDER BY id DESC'; // En yeni eklenen tarif en üstte gelsin

        const querySonucu = await db.query(sorgu, parametreler);
        res.json(querySonucu.rows);
    } catch (err) {
        console.error("Arama SQL hatası:", err.message);
        res.status(500).send('Sunucu Hatası');
    }
});


// API: Belirli bir tarifi getir
app.get('/api/tarifler/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sonuc = await db.query('SELECT * FROM recipes WHERE id = $1', [id]);
        
        if (sonuc.rows.length === 0) {
            return res.status(404).json({ mesaj: "Tarif bulunamadı" });
        }
        
        res.json(sonuc.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Sunucu Hatası');
    }
});
// Benzersiz Yazarları Getirme Rotası
app.get('/api/yazarlar', async (req, res) => {
    try {
        // DİKKAT: Veritabanındaki yazar sütununun adının "author" olduğunu varsayıyoruz. 
        // Eğer pgAdmin'de farklıysa (örn: yazar_adi), aşağıdaki "author" kısımlarını ona göre değiştir.
        const result = await db.query('SELECT DISTINCT author FROM recipes WHERE author IS NOT NULL');
        res.json(result.rows);
    } catch (err) {
        console.error("Yazar çekme hatası:", err);
        res.status(500).json({ error: 'Yazarlar çekilemedi' });
    }
});
// API: Yeni Tarif Ekle (Adım 2)
// API: Yeni Tarif Ekle (Adım 2)
app.post('/api/tarifler', async (req, res) => {
    try {
        // Frontend'den (formdan) gelen verileri paketinden çıkarıyoruz
        const { 
            title, category, prep_time, cook_time, 
            difficulty, ingredients, instructions, 
            image_url, video_url, author, servings 
        } = req.body;

        // PostgreSQL'e bu verileri "ekle" emri veriyoruz
        const yeniKayit = await db.query(
            `INSERT INTO recipes (
                title, category, prep_time, cook_time, 
                difficulty, ingredients, instructions, 
                image_url, video_url, author, servings
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [title, category, prep_time, cook_time, difficulty, ingredients, instructions, image_url, video_url, author, servings]
        );

        // Her şey yolundaysa eklenen veriyi geri gönder
        res.status(201).json(yeniKayit.rows[0]); 
    } catch (err) {
        console.error("Kayıt hatası:", err.message);
        res.status(500).send('Sunucu tarafında veri kaydedilemedi.');
    }
});

// Belirli bir tarifin yorumlarını getir
// Belirli bir tarifin yorumlarını getir
app.get('/api/comments/:recipeId', async (req, res) => {
    const { recipeId } = req.params;
    try {
        // 'pool' yerine 'db' kullanıyoruz
        const result = await db.query(
            'SELECT * FROM comments WHERE recipe_id = $1 ORDER BY created_at DESC',
            [parseInt(recipeId)]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Yorum Getirme Hatası:", err.message);
        res.status(500).json({ error: 'Yorumlar getirilirken hata oluştu!' });
    }
});
// TÜM YORUMLARI GETİR (Profil istatistikleri için)
app.get('/api/all-comments', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM comments');
        res.json(result.rows);
    } catch (err) {
        console.error("Tüm yorumlar çekilemedi:", err.message);
        res.status(500).json({ error: 'Yorumlar getirilemedi!' });
    }
});
// Yeni yorum ekle
app.post('/api/comments', async (req, res) => {
    const { recipe_id, author_name, comment_text } = req.body;
    try {
        // 'pool' yerine 'db' kullanıyoruz
        const result = await db.query(
            'INSERT INTO comments (recipe_id, author_name, comment_text) VALUES ($1, $2, $3) RETURNING *',
            [recipe_id, author_name, comment_text]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Yorum Kaydetme Hatası:", err.message);
        res.status(500).json({ error: 'Yorum kaydedilemedi!' });
    }
});
// --- TARİF SİLME (DELETE) ---
app.delete('/api/tarifler/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Tablo adın 'recipes' ise ona göre kontrol et
        const sonuc = await db.query('DELETE FROM recipes WHERE id = $1', [id]);
        
        if (sonuc.rowCount > 0) {
            res.json({ success: true, message: 'Tarif başarıyla silindi.' });
        } else {
            res.status(404).json({ success: false, message: 'Tarif bulunamadı!' });
        }
    } catch (err) {
        console.error("Silme hatası:", err);
        res.status(500).json({ success: false, message: 'Sunucu hatası!' });
    }
});
// --- TÜM KULLANICILARI GETİR (Admin Panel) ---
app.get('/api/kullanicilar', async (req, res) => {
    try {
        const sonuc = await db.query(
            'SELECT id, username, email, role, created_at FROM users ORDER BY id ASC'
        );
        res.json(sonuc.rows);
    } catch (err) {
        console.error("Kullanıcı listeleme hatası:", err.message);
        res.status(500).json({ error: 'Kullanıcılar getirilemedi!' });
    }
});
// KULLANICI SİL (Admin)
app.delete('/api/kullanicilar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const sonuc = await db.query('DELETE FROM users WHERE id = $1', [id]);
        if (sonuc.rowCount > 0) {
            res.json({ success: true, message: 'Kullanıcı silindi.' });
        } else {
            res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı!' });
        }
    } catch (err) {
        console.error("Kullanıcı silme hatası:", err.message);
        res.status(500).json({ success: false, message: 'Sunucu hatası!' });
    }
});
// TÜM YORUMLARI GETİR - tarif adıyla birlikte (Admin panel)
app.get('/api/admin/yorumlar', async (req, res) => {
    try {
        const sonuc = await db.query(`
            SELECT c.id, c.recipe_id, c.author_name, c.comment_text, c.created_at,
                   r.title as tarif_adi
            FROM comments c
            LEFT JOIN recipes r ON c.recipe_id = r.id
            ORDER BY c.created_at DESC
        `);
        res.json(sonuc.rows);
    } catch (err) {
        console.error("Admin yorum hatası:", err.message);
        res.status(500).json({ error: 'Yorumlar getirilemedi!' });
    }
});

// YORUM SİL (Admin)
app.delete('/api/admin/yorumlar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const sonuc = await db.query('DELETE FROM comments WHERE id = $1', [id]);
        if (sonuc.rowCount > 0) {
            res.json({ success: true, message: 'Yorum silindi.' });
        } else {
            res.status(404).json({ success: false, message: 'Yorum bulunamadı!' });
        }
    } catch (err) {
        console.error("Yorum silme hatası:", err.message);
        res.status(500).json({ success: false, message: 'Sunucu hatası!' });
    }
});
// TÜM YORUMLARI TEMİZLE
app.delete('/api/admin/tum-yorumlar', async (req, res) => {
    try {
        await db.query('DELETE FROM comments');
        res.json({ success: true, message: 'Tüm yorumlar silindi.' });
    } catch (err) {
        console.error("Yorum temizleme hatası:", err.message);
        res.status(500).json({ success: false, message: 'Sunucu hatası!' });
    }
});

// ADMİN ŞİFRE DEĞİŞTİR
app.put('/api/admin/sifre-degistir', async (req, res) => {
    const { eskiSifre, yeniSifre } = req.body;
    try {
        const kontrol = await db.query(
            "SELECT * FROM users WHERE role = 'admin' AND password = $1", 
            [eskiSifre]
        );
        if (kontrol.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Mevcut şifre yanlış!' });
        }
        await db.query(
            "UPDATE users SET password = $1 WHERE role = 'admin'", 
            [yeniSifre]
        );
        res.json({ success: true, message: 'Şifre başarıyla güncellendi!' });
    } catch (err) {
        console.error("Şifre değiştirme hatası:", err.message);
        res.status(500).json({ success: false, message: 'Sunucu hatası!' });
    }
});
// TÜM KAYITLI KULLANICILARI GETİR (Yazarlar sayfası için)
app.get('/api/kullanicilar/yazarlar', async (req, res) => {
    try {
        const sonuc = await db.query(
            'SELECT id, username, email FROM users ORDER BY id ASC'
        );
        res.json(sonuc.rows);
    } catch (err) {
        console.error("Yazarlar hatası:", err.message);
        res.status(500).json({ error: 'Kullanıcılar getirilemedi!' });
    }
});
// SLIDER'I GETİR
app.get('/api/slider', async (req, res) => {
    try {
        const sonuc = await db.query(`
            SELECT s.slot, s.recipe_id, r.title, r.image_url, r.category, r.difficulty
            FROM slider s
            LEFT JOIN recipes r ON s.recipe_id = r.id
            ORDER BY s.slot ASC
        `);
        res.json(sonuc.rows);
    } catch (err) {
        console.error("Slider hatası:", err.message);
        res.status(500).json({ error: 'Slider getirilemedi!' });
    }
});

// SLIDER'I GÜNCELLE (Admin)
app.put('/api/slider/:slot', async (req, res) => {
    const { slot } = req.params;
    const { recipe_id } = req.body;
    try {
        await db.query(
            'UPDATE slider SET recipe_id = $1 WHERE slot = $2',
            [recipe_id, slot]
        );
        res.json({ success: true, message: 'Slider güncellendi!' });
    } catch (err) {
        console.error("Slider güncelleme hatası:", err.message);
        res.status(500).json({ success: false, message: 'Sunucu hatası!' });
    }
});
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde hazır.` );
});
// --- KULLANICI GİRİŞ (LOGIN) SİSTEMİ ---
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    console.log("Giriş denemesi:", username, password);

    try {
        // BURAYI DEĞİŞTİRDİK: Hem kullanıcı adına hem de e-postaya bakıyoruz
        const sonuc = await db.query(
            'SELECT * FROM users WHERE (username = $1 OR email = $1) AND password = $2', 
            [username, password]
        );
        
        console.log("Veritabanı sonucu:", sonuc.rows.length, "eşleşme bulundu.");

        if (sonuc.rows.length > 0) {
            const kullanici = sonuc.rows[0];
            res.json({ success: true, role: kullanici.role, username: kullanici.username });
        } else {
            res.status(401).json({ success: false, message: 'Kullanıcı adı/E-posta veya şifre hatalı!' });
        }
    } catch (err) {
        console.error("Sorgu hatası:", err);
        res.status(500).json({ success: false, message: 'Sunucu hatası!' });
    }
});
// --- YENİ KULLANICI KAYIT (REGISTER) ---
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Önce bu kullanıcı adı veya email zaten var mı diye bakalım
        const kontrol = await db.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        
        if (kontrol.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Bu kullanıcı adı veya e-posta zaten kullanımda!' });
        }

        // Yeni kullanıcıyı ekle (Varsayılan rolü 'user' yapıyoruz)
        const yeniKullanici = await db.query(
            'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, password, 'user']
        );

        res.json({ success: true, message: 'Kayıt başarıyla tamamlandı!' });
    } catch (err) {
        console.error("Kayıt hatası:", err);
        res.status(500).json({ success: false, message: 'Sunucu hatası!' });
    }
});
// --- TARİF GÜNCELLEME (PUT) ---
// --- TARİF GÜNCELLEME (PUT) - KESİN ÇÖZÜM ---
// --- TARİF GÜNCELLEME (PUT) - KESİN ÇÖZÜM ---
app.put('/api/tarifler/:id', async (req, res) => {
    const { id } = req.params;
    
    // 1. BURAYA 'servings' EKLENDİ!
    const { title, category, prep_time, cook_time, difficulty, ingredients, instructions, image_url, video_url, servings } = req.body;

    try {
        const query = `
            UPDATE recipes 
            SET title=$1, category=$2, prep_time=$3, cook_time=$4, difficulty=$5, instructions=$6, image_url=$7, video_url=$8, ingredients=$9, servings=$10 
            WHERE id=$11`; // ingredients 9. sırada, servings 10. sırada, id 11. sırada oldu
        
        // 2. BURAYA DA 'servings' EKLENDİ!
        const values = [title, category, prep_time, cook_time, difficulty, instructions, image_url, video_url, ingredients, servings, id];
        
        const sonuc = await db.query(query, values);

        if (sonuc.rowCount > 0) {
            res.json({ success: true, message: 'Tarif güncellendi!' });
        } else {
            res.status(404).json({ success: false, message: 'Tarif bulunamadı.' });
        }
    } catch (err) {
        console.error("SQL Hatası:", err.message);
        res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
    }
});

// BELİRLİ BİR KULLANICININ TARİFLERİNİ GETİR
app.get('/api/tarifler/kullanici/:yazarAd', async (req, res) => {
    const { yazarAd } = req.params;
    try {
        const sonuc = await db.query(
            'SELECT * FROM recipes WHERE author = $1 ORDER BY id DESC', 
            [yazarAd]
        );
        res.json(sonuc.rows);
    } catch (err) {
        console.error("Kullanıcı tarifleri çekilemedi:", err.message);
        res.status(500).json({ error: "Veri çekme hatası" });
    }
});