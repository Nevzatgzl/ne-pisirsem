// 1. VERİ HAVUZU (İleride burası PostgreSQL'den gelecek)
// İsmi değiştirdik ki script.js ile çakışmasın
const recipeDetayParams = new URLSearchParams(window.location.search);
const recipeId = recipeDetayParams.get('id');

// Eğer altta urlParams veya id değişkenleri varsa, onları recipeId ile değiştir!
// 2. SAYFA YÜKLENDİĞİNDE ÇALIŞACAK ANA FONKSİYON
document.addEventListener('DOMContentLoaded', async () => {
    // 1. URL'den ID'yi al


    if (!recipeId) {
        alert("Tarif ID bulunamadı!");
        return;
    }

    try {
        // 2. Backend'e TAM ADRES ile istek at (Port 3000)
        const cevap = await fetch(`http://localhost:3000/api/tarifler/${recipeId}`);

        if (!cevap.ok) throw new Error('Veri çekilemedi');

        const tarif = await cevap.json();

        // 3. Sayfayı doldur fonksiyonunu çağır
        sayfayiDoldur(tarif);
        yorumlariYukle(recipeId);

    } catch (hata) {
        console.error("Hata detayı:", hata);
        alert("Tarif yüklenemedi!");
    }
});
function convertYoutubeUrlToEmbed(url) {
    if (!url) return '';
    const regExp = /^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#&?\s]*).*/;
    const match = url.match(regExp);
    return (match && match[1].length === 11) ? `https://www.youtube.com/embed/${match[1]}` : url;
}

// 3. HTML ELEMANLARINI DOLDURMA FONKSİYONU
function sayfayiDoldur(tarif) {
    // 1. Yazılar ve Başlıklar
    const baslik = document.getElementById('tarifBaslik');
    if (baslik) baslik.innerText = tarif.title || "İsimsiz Tarif";

    const yazar = document.getElementById('yazarAdi');
    if (yazar) yazar.innerText = tarif.author || "Anonim";

    const hazirlama = document.getElementById('hazirlamaSuresi');
    if (hazirlama) hazirlama.innerText = (tarif.prep_time || '0') + " dk";

    const pisirme = document.getElementById('pisirmeSuresi');
    if (pisirme) pisirme.innerText = (tarif.cook_time || '0') + " dk";

    const adimlar = document.getElementById('hazirlanisAdimlari');
    if (adimlar) adimlar.innerText = tarif.instructions || "Adımlar eklenmemiş.";

    const zorluk = document.getElementById('zorlukDerecesi'); // HTML listende yoktu ama DB'de var, ekledim.
    if (zorluk) zorluk.innerText = tarif.difficulty || "Orta";
    const kisiSayisi = document.getElementById("kisiSayisi"); // Bu satırı ekleyin
    if (kisiSayisi) kisiSayisi.innerText = (tarif.servings || "Bilinmiyor") + " Kişilik"; // Bu satırı ekleyin


    // 2. Resim Güncelleme (tarifResmi)
    const resim = document.getElementById('tarifResmi');
    if (resim && tarif.image_url) {
        resim.src = tarif.image_url;
    }

    // 3. Video Güncelleme (tarifVideo)
    const videoAlani = document.getElementById('videoAlani');
    const video = document.getElementById('tarifVideo');
    if (tarif.video_url) {
        const embedUrl = tarif.video_url.includes('/embed/')
            ? tarif.video_url
            : convertYoutubeUrlToEmbed(tarif.video_url);
        video.src = embedUrl;
        if (videoAlani) videoAlani.style.display = 'block';
    } else {
        if (videoAlani) videoAlani.style.display = 'none';
    }
    // 4. Malzeme Listesi (malzemeListesi)
    const liste = document.getElementById('malzemeListesi');
    if (liste) {
        liste.innerHTML = ''; // İçini boşalt (Sufle malzemeleri gitsin)
        // Veritabanından gelen malzemeleri virgülüne göre ayırıp listeye ekle
        const malzemeler = tarif.ingredients ? tarif.ingredients.split(',') : [];
        malzemeler.forEach(m => {
            const li = document.createElement('li');
            li.className = 'list-group-item bg-transparent border-0';
            li.innerHTML = '<i class="far fa-circle me-2 text-muted small"></i>' + m.trim();
            liste.appendChild(li);
        });
    }
}

// 4. YORUM KAYDETME BUTONU (Frontend Mantığı)
async function yorumKaydet() {
    const urlParams = new URLSearchParams(window.location.search);
    const tarifId = urlParams.get('id');

    // Elementleri alıyoruz
    const adInput = document.getElementById('yorumYapan');
    const yorumInput = document.getElementById('yorumMetni');
    const puanSelect = document.getElementById('puanSecimi');

    // Değerleri alıyoruz
    const ad = adInput.value;
    const yorumMesaji = yorumInput.value;
    const secilenPuanMetni = puanSelect.options[puanSelect.selectedIndex].text;

    if (!ad || !yorumMesaji) {
        alert("Lütfen adınızı ve yorumunuzu yazın!");
        return;
    }

    // 1. HATA ÇÖZÜMÜ: Yıldız metni ile yorumu burada birleştiriyoruz
    const birlesikYorum = `${secilenPuanMetni} - ${yorumMesaji}`;

    const yeniVeri = {
        recipe_id: parseInt(tarifId),
        author_name: ad,
        // 2. HATA ÇÖZÜMÜ: Veritabanına birleşmiş metni (yıldızlı hali) gönderiyoruz
        comment_text: birlesikYorum
    };

    try {
        const cevap = await fetch('http://localhost:3000/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(yeniVeri)
        });

        if (cevap.ok) {
            yorumInput.value = ''; // Mesaj kutusunu temizle
            yorumlariYukle(tarifId); // Listeyi yenile ki anında görünülsün
        } else {
            alert("Yorum kaydedilemedi!");
        }
    } catch (err) {
        console.error("Gönderim hatası:", err);
    }
}
// API'den veri çek
// API'den tarifi çek ve sayfayı doldur
function tekTarifGetir(id) {
    fetch(`/api/tarifler/${id}`)
        .then(response => response.json())
        .then(tarif => {
            console.log("Veritabanından gelen tarif:", tarif);
            sayfayiDoldur(tarif);
        })
        .catch(err => {
            console.error("Hata:", err);
            alert("Tarif yüklenemedi!");
        });
}
async function yorumlariYukle(id) {
    try {
        const cevap = await fetch(`http://localhost:3000/api/comments/${id}`);
        const yorumlar = await cevap.json();

        const liste = document.getElementById('yorumListesi');
        const sayiSpan = document.getElementById('yorumSayisi');
        if (sayiSpan) sayiSpan.innerText = yorumlar.length;
        const sayiSpan2 = document.getElementById('tarifYorumSayisi');
        if (sayiSpan2) sayiSpan2.innerText = yorumlar.length;
        // Ortalama puanı hesapla
        const puanSpan = document.getElementById('tarifPuan');
        if (puanSpan && yorumlar.length > 0) {
            // Yorum metninden yıldız sayısını çıkar (⭐ sayısına göre)
            const puanlar = yorumlar.map(y => {
                const text = y.comment_text || '';
                const yildiz = (text.match(/⭐/g) || []).length;
                return yildiz > 0 ? yildiz : 5; // yıldız yoksa 5 say
            });
            const ortalama = puanlar.reduce((a, b) => a + b, 0) / puanlar.length;
            puanSpan.innerText = ortalama.toFixed(1);
        } else if (puanSpan) {
            puanSpan.innerText = '—';
        }
        if (!liste) return;

        if (yorumlar.length === 0) {
            liste.innerHTML = '<p class="text-muted text-center small my-4">Henüz yorum yapılmamış. İlk yorumu sen yap!</p>';
            return;
        }

        liste.innerHTML = yorumlar.map(y => `
            <div class="mb-4 border-bottom pb-3">
                <div class="d-flex align-items-center mb-2">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(y.author_name)}&background=random" class="rounded-circle me-2" width="35">
                    <div>
                        <div class="fw-bold small">${y.author_name}</div>
                        <div class="text-muted" style="font-size: 0.75rem;">${new Date(y.created_at).toLocaleDateString('tr-TR')}</div>
                    </div>
                </div>
                <p class="small text-secondary mb-0" style="margin-left: 43px;">${y.comment_text}</p>
            </div>
        `).join('');
    } catch (err) {
        console.error("Yorum yükleme hatası:", err);
    }
}
// =============================================
// FAVORİ SİSTEMİ (localStorage)
// =============================================
function favoriDurumunuGuncelle(id) {
    const kullanici = localStorage.getItem('aktifKullanici') || 'misafir';
    const favoriler = JSON.parse(localStorage.getItem('favoriler_' + kullanici) || '[]');
    const btn = document.getElementById('favoriBtn');
    if (!btn) return;

    if (favoriler.includes(String(id))) {
        btn.innerHTML = '<i class="fas fa-heart me-2"></i> Favorilerimden Çıkar';
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-outline-danger');
    } else {
        btn.innerHTML = '<i class="fas fa-heart me-2"></i> Tarifi Favorilerime Ekle';
        btn.classList.remove('btn-outline-danger');
        btn.classList.add('btn-danger');
    }
}

function favoriToggle() {
    const kullanici = localStorage.getItem('aktifKullanici');
    if (!kullanici) {
        alert('Favorilere eklemek için giriş yapmalısın!');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    let favoriler = JSON.parse(localStorage.getItem('favoriler_' + kullanici) || '[]');
    if (favoriler.includes(String(id))) {
        favoriler = favoriler.filter(f => f !== String(id));
        alert('Favorilerden çıkarıldı.');
    } else {
        favoriler.push(String(id));
        alert('Favorilere eklendi! ❤️');
    }
    localStorage.setItem('favoriler_' + kullanici, JSON.stringify(favoriler));

    favoriDurumunuGuncelle(id);
}

// Sayfa açılınca favori durumunu kontrol et
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) favoriDurumunuGuncelle(id);
});
