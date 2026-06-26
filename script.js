
// =============================================
// AUTH MODAL - TÜM SAYFALARA OTOMATİK INJECT
// =============================================
function authModalYukle() {
    const modalHTML = `
    <div class="modal fade" id="authModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-4 border-0 shadow-lg">

                <div class="modal-header p-0 border-0">
                    <ul class="nav nav-tabs w-100" id="authTab" role="tablist">
                        <li class="nav-item w-50" role="presentation">
                            <button class="nav-link active w-100 py-3 fw-bold text-uppercase border-0"
                                id="login-tab" data-bs-toggle="tab" data-bs-target="#login"
                                type="button" role="tab" style="color: black;">Giriş Yap</button>
                        </li>
                        <li class="nav-item w-50" role="presentation">
                            <button class="nav-link w-100 py-3 fw-bold text-uppercase border-0 text-muted"
                                id="register-tab" data-bs-toggle="tab" data-bs-target="#register"
                                type="button" role="tab">Kayıt Ol</button>
                        </li>
                    </ul>
                    <button type="button" class="btn-close me-3" data-bs-dismiss="modal" aria-label="Kapat"></button>
                </div>

                <div class="modal-body p-4">
                    <div class="tab-content" id="authTabContent">

                        <!-- GİRİŞ YAP -->
                        <div class="tab-pane fade show active" id="login" role="tabpanel">
                            <div class="mb-3">
                                <label class="form-label fw-bold small">Kullanıcı Adı veya E-Posta</label>
                                <input type="text" id="loginUser" class="form-control bg-light border-0 py-2"
                                    placeholder="Kullanıcı adınız veya e-postanız">
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold small">Şifre</label>
                                <input type="password" id="loginPass" class="form-control bg-light border-0 py-2"
                                    placeholder="Şifrenizi giriniz">
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="beniHatirla">
                                    <label class="form-check-label small" for="beniHatirla">Beni Hatırla</label>
                                </div>
                                <a href="#" class="text-decoration-none small fw-bold"
                                    style="color: #C0392B;" onclick="sifremiUnuttum()">Şifremi Unuttum</a>
                            </div>
                            <button type="button" onclick="girisKontrol()"
                                class="btn w-100 py-2 fw-bold text-white shadow-sm"
                                style="background-color: #C0392B; border-radius: 8px;">GİRİŞ YAP</button>
                        </div>

                        <!-- KAYIT OL -->
                        <div class="tab-pane fade" id="register" role="tabpanel">
                            <div class="mb-3">
                                <label class="form-label fw-bold small">Kullanıcı Adı</label>
                                <input type="text" id="regUser" class="form-control bg-light border-0 py-2"
                                    placeholder="Örn: nevzat123">
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold small">E-Posta Adresiniz</label>
                                <input type="email" id="regEmail" class="form-control bg-light border-0 py-2"
                                    placeholder="E-posta adresinizi giriniz">
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold small">Şifre Oluşturun</label>
                                <input type="password" id="regPass" class="form-control bg-light border-0 py-2"
                                    placeholder="En az 4 karakter">
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold small">Şifre Tekrar</label>
                                <input type="password" id="regPassTekrar" class="form-control bg-light border-0 py-2"
                                    placeholder="Şifrenizi tekrar giriniz">
                            </div>
                            <div class="mb-4">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="terms">
                                    <label class="form-check-label small text-muted" for="terms">
                                        <a href="javascript:void(0)"
                                            onclick="alert('KVKK: Verileriniz yalnızca platformumuzda kullanılır, üçüncü taraflarla paylaşılmaz.')"
                                            class="text-decoration-none fw-bold"
                                            style="color: #C0392B;">Kullanım Şartları</a>'nı okudum ve kabul ediyorum.
                                    </label>
                                </div>
                            </div>
                            <button type="button" onclick="kayitOl(event)"
                                class="btn w-100 py-2 fw-bold text-white shadow-sm"
                                style="background-color: #C0392B; border-radius: 8px;">KAYIT OL</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>`;

    // Eğer modal zaten yoksa ekle
    if (!document.getElementById('authModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    // Beni hatırla kontrolü — modal inject edildikten sonra çalışır
    setTimeout(() => {
        const beniHatirla = localStorage.getItem('beniHatirla');
        if (beniHatirla === 'true') {
            const input = document.getElementById('loginUser');
            const pass = document.getElementById('loginPass');
            const checkbox = document.getElementById('beniHatirla');
            if (input) input.value = localStorage.getItem('hatirlaKullanici') || '';
            if (checkbox) checkbox.checked = true;
        }
    }, 100);
    // Tab switching
    document.querySelectorAll('#authTab [data-bs-toggle="tab"]').forEach(tab => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelectorAll('#authTab .nav-link').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            document.querySelectorAll('#authTabContent .tab-pane').forEach(pane => {
                pane.classList.remove('show', 'active');
            });

            const targetId = this.getAttribute('data-bs-target');
            const targetPane = document.querySelector(targetId);
            if (targetPane) targetPane.classList.add('show', 'active');
        });
    });
}

// Sayfa yüklenince çalıştır
document.addEventListener('DOMContentLoaded', authModalYukle);
let secilenlerListesi = [];
const malzemeInput = document.getElementById('malzemeInput');
const btnEkle = document.getElementById('btnEkle');
const secilenlerAlani = document.getElementById('secilenMalzemeler');
let tumTarifler = [];
let gorunurSayisi = 8;
const loadMoreBtn = document.getElementById('loadMoreBtn');

// ==========================================
// 2. MALZEME EKLEME / SİLME İŞLEMLERİ
// ==========================================
function malzemeEkle(isim) {
    if (!isim) return;

    const temizIsim = isim.toLowerCase().trim();
    if (secilenlerListesi.includes(temizIsim)) return;

    secilenlerListesi.push(temizIsim);

    const yeniBadge = document.createElement('span');
    yeniBadge.className = "badge rounded-pill bg-danger p-2 px-3 me-2 shadow-sm mb-2";
    yeniBadge.style.cursor = "pointer";
    yeniBadge.innerHTML = `${isim} <i class="ms-1">×</i>`;

    yeniBadge.onclick = function () {
        secilenlerListesi = secilenlerListesi.filter(item => item !== temizIsim);
        this.remove();
        malzemeyeGoreFiltrele();
    };

    secilenlerAlani.appendChild(yeniBadge);
    malzemeyeGoreFiltrele();
}

btnEkle?.addEventListener('click', () => {
    const malzeme = malzemeInput.value.trim();
    if (malzeme !== "") {
        malzemeEkle(malzeme);
        malzemeInput.value = "";
    }
});

document.addEventListener('click', (e) => {
    if (e.target.closest('.populer-secimler-wrapper') && e.target.tagName === 'BUTTON') {
        const malzemeAdi = e.target.innerText.replace('+', '').trim();
        malzemeEkle(malzemeAdi);
    }
});
function navbarGuncelle() {
    const authAlan = document.getElementById('auth-alan');
    const kullaniciAdi = localStorage.getItem('aktifKullanici');
    const rol = localStorage.getItem('userRole');

    if (!authAlan) return;

    if (kullaniciAdi) {
        const isAdmin = (rol === 'admin');
        // İkonu istersen kaldırabiliriz ama çok ufak bir taç şık durur
        const ikon = isAdmin ? '👑' : '🧑‍🍳';

        // Renkleri sadeleştiriyoruz: Hepsi standart siyah/koyu tonlarda
        authAlan.innerHTML = `
                <div class="dropdown">
                    <button class="btn btn-outline-dark dropdown-toggle fw-bold shadow-sm" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        <span class="me-1">${ikon}</span> ${kullaniciAdi}
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2" aria-labelledby="userDropdown">
                        <li><a class="dropdown-item py-2" href="profil.html"><i class="fas fa-user-circle me-2"></i>Profilim</a></li>
                        
                        ${isAdmin ? `
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item py-2  text-dark" href="admin.html"><i class="fas  me-2"></i>Yönetim Paneli</a></li>
                        ` : ''}
                        
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item py-2 text-danger" href="#" onclick="cikisYap()"><i class="fas fa-sign-out-alt me-2"></i>Güvenli Çıkış</a></li>
                    </ul>
                </div>
            `;
    } else {
        authAlan.innerHTML = `<button class="btn btn-dark px-4 rounded-pill" data-bs-toggle="modal" data-bs-target="#authModal">Giriş / Kayıt</button>`;
    }
}
// ==========================================
// 3. SAYFA YÜKLENİNCE ÇALIŞACAKLAR
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const currentUrl = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll(".nav-link");
    navbarGuncelle();
    adminTarifleriGetir();

    // Bekleyen onay - yorum sayısını göster
    fetch('http://localhost:3000/api/admin/yorumlar')
        .then(r => r.json())
        .then(yorumlar => {
            const el = document.getElementById('bekleyen-sayi');
            if (el) el.innerText = yorumlar.length;
        })
        .catch(() => { });

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentUrl) {
            link.classList.add("active");
            link.style.fontWeight = "bold";
            link.style.color = "black";
        } else {
            link.classList.remove("active");
        }
    });

    if (document.getElementById('tarif-listesi')) {
        tarifleriGetir();
    }
});

// ==========================================
// 4. KULLANICI / LOGİN VE SEKMELER
// ==========================================

async function girisKontrol() {
    const kullanici = document.getElementById('loginUser').value.trim().toLowerCase();
    const sifre = document.getElementById('loginPass').value.trim();
    const beniHatirla = document.getElementById('beniHatirla')?.checked;

    if (kullanici === "" || sifre === "") {
        alert("Lütfen tüm alanları doldurun.");
        return;
    }

    // Admin girişi
    if (kullanici === 'admin' && sifre === 'admin123') {
        localStorage.setItem('aktifKullanici', 'Yönetici');
        localStorage.setItem('userRole', 'admin');
        if (beniHatirla) {
            localStorage.setItem('beniHatirla', 'true');
        }
        alert("Yönetici girişi onaylandı!");
        window.location.href = 'admin.html';
        return;
    }

    try {
        const cevap = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: kullanici, password: sifre })
        });
        const sonuc = await cevap.json();

        if (sonuc.success) {
            localStorage.setItem('aktifKullanici', sonuc.username);
            localStorage.setItem('userRole', sonuc.role);
            if (beniHatirla) {
                localStorage.setItem('beniHatirla', 'true');
                localStorage.setItem('hatirlaKullanici', kullanici);

            } else {
                localStorage.removeItem('beniHatirla');
                localStorage.removeItem('hatirlaKullanici');
                localStorage.removeItem('hatirlanaSifre');
            }
            alert("Giriş başarılı! Hoş geldin " + sonuc.username);
            window.location.href = 'profil.html';
        } else {
            alert(sonuc.message);
        }
    } catch (err) {
        alert("Sunucu kapalı! node server.js'i başlat.");
    }
}
// ==========================================
// 5. VERİ ÇEKME VE EKRANA BASMA
// ==========================================
async function tarifleriGetir() {
    try {
        const cevap = await fetch('http://127.0.0.1:3000/api/tarifler');
        tumTarifler = await cevap.json();
        tarifleriGoster();

        // KRİTİK DÜZELTME: Veriler veritabanından gelip HTML'e basıldığı AN burası çalışır.
        // Artık kronometreye ihtiyacımız yok!
        urlDenGelenAramayiYap();

    } catch (err) {
        console.error('Veri çekilirken hata oluştu:', err);
    }
}

function tarifleriGoster() {
    const liste = document.getElementById('tarif-listesi');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (!liste) return;
    liste.innerHTML = '';

    const dilim = tumTarifler.slice(0, gorunurSayisi);

    dilim.forEach(tarif => {
        const kategori = tarif.category ? tarif.category.toLocaleLowerCase('tr-TR') : "";
        const malzemeler = tarif.ingredients ? tarif.ingredients.toLocaleLowerCase('tr-TR') : "";
        const yazar = tarif.author ? tarif.author.toLocaleLowerCase('tr-TR') : "";

        // ... fonksiyonun üst kısmı aynı kalıyor ...

        const kartHTML = `
            <div class="col-md-3 mb-4">
                <div class="card h-100 shadow-sm border-0 recipe-card" 
                    onclick="window.location.href='tarif-detay.html?id=${tarif.id}'"
                    style="cursor: pointer;"
                    data-ingredients="${malzemeler}"
                    data-category="${kategori}"
                    data-author="${yazar}">
            
                    <img src="${tarif.image_url}" class="card-img-top" alt="${tarif.title}" style="height:200px; object-fit:cover;">
                    
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold">${tarif.title}</h5>
                        <p class="text-muted small mb-1">👨‍🍳 Şef: <span class="fw-bold">${tarif.author || 'Bilinmiyor'}</span></p>
                        
                        <div class="text-warning small mb-2">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                
                        <button type="button" 
                           class="btn btn-outline-danger btn-sm mt-auto w-100"
                           onclick="event.stopPropagation(); window.location.href='tarif-detay.html?id=${tarif.id}'">
                           Tarife Git
                        </button>
                    </div>
                </div>
            </div>
        `;

        // ... fonksiyonun alt kısmı aynı kalıyor ...
        liste.innerHTML += kartHTML;
    });

    if (loadMoreBtn) {
        loadMoreBtn.style.display = (gorunurSayisi >= tumTarifler.length) ? 'none' : 'block';
    }
}

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        gorunurSayisi += 8;
        tarifleriGoster();
    });
}

function sayfayiDoldur(tarif) {
    // 1. Resim ve Video (Zaten sende vardı)
    const resim = document.getElementById('tarifResmi');
    if (resim && tarif.image_url) resim.src = tarif.image_url;

    const video = document.getElementById('tarifVideo');
    if (video && tarif.video_url) video.src = tarif.video_url;

    // 2. Başlık
    if (document.getElementById('tarifBaslik'))
        document.getElementById('tarifBaslik').innerText = tarif.title;

    // 3. İŞTE SENİN İSTEDİĞİN KİŞİ SAYISI (O 4 RAKAMINI BURASI DEĞİŞTİRECEK)
    if (document.getElementById('kisiSayisi'))
        document.getElementById('kisiSayisi').innerText = (tarif.servings || "Belirtilmedi");

    // 4. SÜRELER VE ZORLUK (Bunlar da dinamik olsun, ss'teki o garip rakamlar düzelsin)
    if (document.getElementById('hazirlamaSuresi'))
        document.getElementById('hazirlamaSuresi').innerText = (tarif.prep_time || "0") + " dk";

    if (document.getElementById('pisirmeSuresi'))
        document.getElementById('pisirmeSuresi').innerText = (tarif.cook_time || "0") + " dk";

    if (document.getElementById('zorlukDerecesi'))
        document.getElementById('zorlukDerecesi').innerText = tarif.difficulty || "Orta";

    // 5. MALZEMELER VE HAZIRLANIŞ
    if (document.getElementById('malzemeListesi') && tarif.ingredients) {
        const liste = document.getElementById('malzemeListesi');
        liste.innerHTML = ""; // Eski sabit malzemeleri temizle
        const mDizi = tarif.ingredients.split(", ");
        mDizi.forEach(m => {
            liste.innerHTML += `<li class="list-group-item bg-transparent border-0"><i class="far fa-circle me-2 text-muted small"></i>${m}</li>`;
        });
    }

    if (document.getElementById('hazirlanisAdimlari'))
        document.getElementById('hazirlanisAdimlari').innerText = tarif.instructions || tarif.content || "Tarif detayları eklenmemiş.";
}


// ==========================================
// 7. AKILLI ARAMA VE FİLTRELEME MOTORU
// ==========================================
// ==========================================
// 7. AKILLI ARAMA VE FİLTRELEME MOTORU (YENİLENDİ)
// ==========================================
const aramaInput = document.getElementById('tarifAramaInput');
const aramaFormu = document.getElementById('aramaFormu');

if (aramaFormu) {
    aramaFormu.addEventListener('submit', async function(e) {
        e.preventDefault(); // Sayfanın kendi kendine yenilenmesini (refresh) kesinlikle engelliyoruz!

        const kelime = aramaInput ? aramaInput.value.trim() : "";

        // Eğer kullanıcı ana sayfada değilse, arama kelimesiyle ana sayfaya yönlendir
        if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
            window.location.href = `index.html?q=${encodeURIComponent(kelime)}`;
            return;
        }
            
        // Ana sayfadaysak direkt backend'e istek at
        try {
            const cevap = await fetch(`http://localhost:3000/api/tarifler?search=${encodeURIComponent(kelime)}`);
            tumTarifler = await cevap.json(); // Global diziyi veritabanından gelen filtrelenmiş veriyle doldur
            
            gorunurSayisi = 8; // Sayacı sıfırla
            tarifleriGoster(); // Listeyi ekranda yeniden çiz
            
            // Kullanıcıyı hafifçe tarif listesine doğru kaydır (Şık bir UX)
            const hedefEleman = document.getElementById('tarif-listesi');
            if (hedefEleman) hedefEleman.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (err) {
            console.error('Arama yapılırken hata oluştu:', err);
        }
    });
}
function filtrele(kelime) {
    const aranan = kelime.toLocaleLowerCase('tr-TR');
    const kartlar = document.querySelectorAll('.recipe-card');

    kartlar.forEach(kart => {
        const baslik = kart.querySelector('.card-title')?.innerText.toLocaleLowerCase('tr-TR') || "";
        const kategori = kart.getAttribute('data-category')?.toLocaleLowerCase('tr-TR') || "";
        const malzemeler = kart.getAttribute('data-ingredients')?.toLocaleLowerCase('tr-TR') || "";
        const yazar = kart.getAttribute('data-author')?.toLocaleLowerCase('tr-TR') || "";

        const anaKutu = kart.closest('.col-md-3') || kart.parentElement;

        if (baslik.includes(aranan) || kategori.includes(aranan) || malzemeler.includes(aranan) || yazar.includes(aranan)) {
            anaKutu.style.display = "block";
            anaKutu.classList.add('d-block');
            anaKutu.classList.remove('d-none');
        } else {
            anaKutu.style.display = "none";
            anaKutu.classList.add('d-none');
            anaKutu.classList.remove('d-block');
        }
    });
}

function malzemeyeGoreFiltrele() {
    const kartlar = document.querySelectorAll('.recipe-card');
    if (secilenlerListesi.length === 0) {
        kartlar.forEach(k => k.closest('.col-md-3').style.display = "block");
        return;
    }
    kartlar.forEach(kart => {
        const tarifMalzemeleri = kart.getAttribute('data-ingredients') || "";
        const anaKutu = kart.closest('.col-md-3');
        const tamEslesme = secilenlerListesi.some(malzeme =>
            tarifMalzemeleri.toLocaleLowerCase('tr-TR').includes(malzeme.toLocaleLowerCase('tr-TR'))
        );
        if (tamEslesme) {
            anaKutu.style.display = "block";
        } else {
            anaKutu.style.display = "none";
        }
    });
}

// ==========================================
// 8. BAŞKA SAYFADAN GELEN URL YAKALAYICI (DÜZELTİLDİ)
// ==========================================
function urlDenGelenAramayiYap() {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');

    if (q) {
        const aramaInputDOM = document.getElementById('tarifAramaInput');
        const hedefEleman = document.getElementById('tarif-basligi') || document.getElementById('tarif-listesi');

        // Input kutusuna kelimeyi yaz
        if (aramaInputDOM) {
            aramaInputDOM.value = q;
        }

        // Kartlar şu an kesinlikle ekranda, güvenle filtreleyebiliriz
        filtrele(q);

        // Tarayıcının çizimi tamamlaması için çok kısa bir an (100ms) bekleyip kaydır
        if (hedefEleman) {
            setTimeout(() => {
                hedefEleman.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
}
// --- KAYIT OLMA FONKSİYONU ---
// ==========================================
// KAYIT OLMA FONKSİYONU (TEK VE TEMİZ)
// ==========================================
async function kayitOl(e) {
    if (e) e.preventDefault();

    const user = document.getElementById('regUser').value.trim();
    const mail = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value.trim();
    const passTekrar = document.getElementById('regPassTekrar').value.trim();
    const terms = document.getElementById('terms')?.checked;

    if (!user || !mail || !pass || !passTekrar) {
        alert("Lütfen tüm alanları doldurun!");
        return;
    }
    if (pass !== passTekrar) {
        alert("Şifreler eşleşmiyor!");
        return;
    }
    if (pass.length < 4) {
        alert("Şifre en az 4 karakter olmalı!");
        return;
    }
    if (!terms) {
        alert("Devam etmek için Kullanım Şartları'nı kabul etmelisiniz!");
        return;
    }

    try {
        const cevap = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, email: mail, password: pass })
        });
        const sonuc = await cevap.json();

        if (sonuc.success || cevap.ok) {
            alert("Kayıt başarılı! Hoş geldin " + user + " 🎉");

            // Direkt giriş yap
            localStorage.setItem('aktifKullanici', user);
            localStorage.setItem('userRole', 'user');

            window.location.href = 'profil.html';
        } else {
            alert("Kayıt başarısız: " + sonuc.message);
        }
    } catch (err) {
        alert("Sunucu hatası oluştu!");
    }
}
// Formu dinlemeye başla (Bu kod en altta durmalı)
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', kayitOl);
}

// Formu dinleyelim

function sifremiUnuttum() {
    const kullanici = document.getElementById('loginUser').value.trim();
    if (kullanici) {
        alert(`"${kullanici}" hesabı için şifre sıfırlama talebiniz alındı.\n\nLütfen admin ile iletişime geçin:\nadmin@nepisirsem.com`);
    } else {
        alert("Lütfen önce kullanıcı adınızı veya e-postanızı girin, sonra tekrar deneyin.");
    }
}
function navbarGuncelle() {
    const authAlan = document.getElementById('auth-alan');
    const kullaniciAdi = localStorage.getItem('aktifKullanici');
    const rol = localStorage.getItem('userRole'); // 'userRole' bakıyoruz

    // Hata ayıklama için Console'a yazdır (F12'den kontrol et)
    console.log("Navbar Kontrolü -> Kullanıcı:", kullaniciAdi, "Rol:", rol);

    if (!authAlan) return;

    if (kullaniciAdi) {
        const isAdmin = (rol === 'admin'); // 'admin' kelimesi tam eşleşmeli
        const ikon = isAdmin ? '👑' : '🧑‍🍳';
        const butonRengi = isAdmin ? 'btn-outline-warning' : 'btn-outline-dark';

        authAlan.innerHTML = `
                <div class="dropdown">
                    <button class="btn ${butonRengi} dropdown-toggle fw-bold shadow-sm" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        <span class="me-1">${ikon}</span> ${kullaniciAdi}
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow border-0" aria-labelledby="userDropdown">
                        <li><a class="dropdown-item" href="profil.html">Profilim</a></li>
                        ${isAdmin ? '<li><a class="dropdown-item fw-bold text-primary" href="admin.html">🛡️ Yönetim Paneli</a></li>' : ''}
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger fw-bold" href="#" onclick="cikisYap()">Güvenli Çıkış</a></li>
                    </ul>
                </div>
            `;
    } else {
        authAlan.innerHTML = `<button class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#authModal">Giriş / Kayıt</button>`;
    }
}

// ÇIKIŞ YAPMA FONKSİYONU
function cikisYap() {
    localStorage.removeItem('aktifKullanici');
    localStorage.removeItem('userRole');
    localStorage.removeItem('beniHatirla');
    localStorage.removeItem('hatirlaKullanici');
    localStorage.removeItem('hatirlanaSifre');
    alert("Başarıyla çıkış yapıldı.");
    window.location.href = 'index.html';
}
// --- ADMİN: TARİFLERİ TABLOYA ÇEK ---
let adminSayfaNo = 1;
const adminSayfaBoyutu = 8;

async function adminTarifleriGetir(sayfa = 1) {
    const tabloGovdesi = document.getElementById('admin-tarif-tablosu');
    if (!tabloGovdesi) return;

    adminSayfaNo = sayfa;

    try {
        const cevap = await fetch('http://localhost:3000/api/tarifler');
        const tumTarifler = await cevap.json();

        const toplamSayfa = Math.ceil(tumTarifler.length / adminSayfaBoyutu);
        const baslangic = (sayfa - 1) * adminSayfaBoyutu;
        const tarifler = tumTarifler.slice(baslangic, baslangic + adminSayfaBoyutu);

        tabloGovdesi.innerHTML = '';

        tarifler.forEach(tarif => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="align-middle fw-bold">${tarif.title}</td>
                <td class="align-middle">${tarif.author || 'Bilinmiyor'}</td>
                <td class="align-middle text-muted">${new Date().toLocaleDateString('tr-TR')}</td>
                <td class="align-middle"><span class="badge bg-success">Yayında</span></td>
                <td class="align-middle text-end">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="location.href='tarif-ekle.html?id=${tarif.id}'">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="tarifSil(${tarif.id})">
                        <i class="fas fa-trash"></i> Sil
                    </button>
                </td>
            `;
            tabloGovdesi.appendChild(tr);
        });

        // Pagination güncelle
        adminPaginationGuncelle(sayfa, toplamSayfa);

    } catch (err) {
        console.error("Admin listeleme hatası:", err);
    }
}

function adminPaginationGuncelle(mevcutSayfa, toplamSayfa) {
    const pagination = document.querySelector('#tarif-bolumu .pagination');
    if (!pagination) return;

    let html = `
        <li class="page-item ${mevcutSayfa === 1 ? 'disabled' : ''}">
            <a class="page-link border-0 shadow-sm mx-1 rounded text-dark" href="#"
                onclick="adminTarifleriGetir(${mevcutSayfa - 1})">Önceki</a>
        </li>`;

    for (let i = 1; i <= toplamSayfa; i++) {
        html += `
        <li class="page-item ${i === mevcutSayfa ? 'active' : ''}">
            <a class="page-link border-0 shadow-sm mx-1 rounded ${i === mevcutSayfa ? '' : 'text-dark'}"
                ${i === mevcutSayfa ? 'style="background-color:#C0392B;"' : ''}
                href="#" onclick="adminTarifleriGetir(${i})">${i}</a>
        </li>`;
    }

    html += `
        <li class="page-item ${mevcutSayfa === toplamSayfa ? 'disabled' : ''}">
            <a class="page-link border-0 shadow-sm mx-1 rounded text-dark" href="#"
                onclick="adminTarifleriGetir(${mevcutSayfa + 1})">Sonraki</a>
        </li>`;

    pagination.innerHTML = html;
}
// --- ADMİN: TARİF SİLME İŞLEMİ ---
async function tarifSil(id) {
    // 1. Önce kullanıcıya sor
    if (!confirm("Bu tarifi veritabanından tamamen silmek istediğine emin misin?")) return;

    try {
        // 2. IŞIK HIZINDA GÜNCELLEME (Optimistic UI)
        // Hiç beklemeyelim, kullanıcı sildiği an sayı düşsün!
        const sayiAlani = document.getElementById('istatistikTarifSayisi');
        if (sayiAlani) {
            let mevcutSayi = parseInt(sayiAlani.innerText) || 0;
            if (mevcutSayi > 0) {
                sayiAlani.innerText = mevcutSayi - 1; // Sayıyı hemen düşürdük
            }
        }

        // 3. Veritabanına silme isteğini gönder
        const cevap = await fetch(`http://localhost:3000/api/tarifler/${id}`, {
            method: 'DELETE'
        });
        const sonuc = await cevap.json();

        if (sonuc.success) {
            // 4. Kartı/Tabloyu ekrandan kaldır
            // Eğer kartın ID'si "tarif-12" gibiyse onu bulup siliyoruz
            const kart = document.querySelector(`[onclick*="tarifSil(${id})"]`)?.closest('.col-md-4');
            if (kart) kart.remove();

            console.log("Tarif başarıyla silindi ve sayı güncellendi.");

            // Eğer admin panelindeyse orayı da tazele
            if (typeof adminTarifleriGetir === 'function') adminTarifleriGetir();

        } else {
            // Eğer silme başarısız olursa sayıyı eski haline getir (Güvenlik önlemi)
            alert("Hata: " + sonuc.message);
            window.location.reload(); // En temizi sayfayı yenilemek
        }
    } catch (err) {
        console.error("Silme işlemi başarısız:", err);
    }
}
// 1. Modalı açan ve içini dolduran fonksiyon
async function tarifDuzenleAc(id) {
    try {
        // Önce veritabanından o tarifin güncel bilgilerini çekelim
        const cevap = await fetch(`http://localhost:3000/api/tarifler`);
        const tarifler = await cevap.json();
        const tarif = tarifler.find(t => t.id === id);

        if (tarif) {
            // Modal içindeki inputları doldur
            document.getElementById('duzenleId').value = tarif.id;
            document.getElementById('duzenleBaslik').value = tarif.title;
            document.getElementById('duzenleYazar').value = tarif.author || 'Nevzat';

            // Modalı göster
            const myModal = new bootstrap.Modal(document.getElementById('duzenleModal'));
            myModal.show();
        }
    } catch (err) {
        console.error("Veri çekme hatası:", err);
    }
}

// 2. Değişiklikleri backend'e gönderen fonksiyon
async function tarifGuncelleKaydet() {
    const id = document.getElementById('duzenleId').value;
    const yeniBaslik = document.getElementById('duzenleBaslik').value;
    const yeniYazar = document.getElementById('duzenleYazar').value;

    try {
        const cevap = await fetch(`http://localhost:3000/api/tarifler/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: yeniBaslik, author: yeniYazar })
        });
        const sonuc = await cevap.json();

        if (sonuc.success) {
            alert("Tarif başarıyla güncellendi!");
            location.reload(); // Sayfayı yenile ki liste güncellensin
        }
    } catch (err) {
        console.error("Güncelleme hatası:", err);
    }
}
// --- TARİF EKLE / GÜNCELLEME MANTIĞI ---
const urlParams = new URLSearchParams(window.location.search);
const tarifId = urlParams.get('id'); // URL'den ?id=... kısmını yakalar

document.addEventListener('DOMContentLoaded', async () => {
    // Eğer tarif-ekle sayfasındaysak ve bir ID varsa (Düzenleme Modu)
    const baslikAlani = document.querySelector('h3');
    const kaydetButon = document.getElementById('kaydetButon');

    if (tarifId && baslikAlani && kaydetButon) {
        baslikAlani.innerText = "Tarifi Güncelle";
        kaydetButon.innerText = "Değişiklikleri Kaydet";

        try {
            // Veritabanından bu ID'ye sahip tek bir tarifi getiren rotayı çağırıyoruz
            const cevap = await fetch(`http://localhost:3000/api/tarifler/${tarifId}`);
            const tarif = await cevap.json();

            if (tarif) {
                // HTML'indeki ID'lerin bunlarla aynı olduğundan emin ol!
                document.getElementById('tarifBaslik').value = tarif.title;
                document.getElementById('tarifKategori').value = tarif.category;
                document.getElementById('tarifIcerik').value = tarif.content;
            }
        } catch (err) {
            console.error("Düzenleme verisi çekilemedi:", err);
        }
    }
});

// Kaydet/Güncelle Butonuna Basıldığında Çalışacak Fonksiyon
// ==========================================
// TARİF KAYDETME VE GÜNCELLEME (DÜZELTİLMİŞ)
// ==========================================
function convertYoutubeUrlToEmbed(url) {
    if (!url) return '';
    const regExp = /^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#&?\s]*).*/;
    const match = url.match(regExp);
    return (match && match[1].length === 11) ? `https://www.youtube.com/embed/${match[1]}` : url;
}
async function tarifKaydet(e) {

    if (e) e.preventDefault();

    // 1. Giriş yapan kullanıcı bilgilerini al
    const aktifKullanici = localStorage.getItem('aktifKullanici') || "Misafir";
    const aktifRol = localStorage.getItem('userRole');

    // 2. Seçilen malzemeleri birleştir
    const toplananMalzemeler = (typeof secilenlerListesi !== 'undefined' && secilenlerListesi.length > 0)
        ? secilenlerListesi.join(", ")
        : "Malzeme belirtilmedi";

    // 3. Form verilerini topla
    const data = {
        title: document.getElementById('tarifBaslikInput').value,
        category: document.getElementById('kategoriInput').value,
        prep_time: parseInt(document.getElementById('hazirlamaInput').value) || 0,
        cook_time: parseInt(document.getElementById('pisirmeInput').value) || 0,
        difficulty: document.getElementById('zorlukInput').value,
        servings: document.getElementById('kisiInput').value,
        instructions: document.getElementById('tarifDetayInput').value,
        image_url: document.getElementById('resimUrlInput').value,
        video_url: convertYoutubeUrlToEmbed(document.getElementById('videoUrlInput').value),
        author: aktifKullanici, // Artık sabit "Nevzat" değil, giriş yapan kişi!
        ingredients: toplananMalzemeler
    };

    // 4. Ekleme mi Güncelleme mi olduğunu anla
    const urlParams = new URLSearchParams(window.location.search);
    const guncellenecekId = urlParams.get('id');
    const metod = guncellenecekId ? 'PUT' : 'POST';
    const url = guncellenecekId ? `http://localhost:3000/api/tarifler/${guncellenecekId}` : `http://localhost:3000/api/tarifler`;

    try {
        const res = await fetch(url, {
            method: metod,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const sonuc = await res.json();

        if (sonuc.success || res.ok) {
            alert(guncellenecekId ? "Tarif başarıyla güncellendi! ✅" : "Yeni tarif başarıyla eklendi! 👨‍🍳");

            // 5. KRİTİK DÜZELTME: Rol kontrolüne göre yönlendirme
            if (aktifRol === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'profil.html';
            }
        } else {
            alert("İşlem başarısız: " + sonuc.message);
        }
    } catch (err) {
        console.error("Hata:", err);
        alert("Sunucu hatası! Lütfen terminali kontrol edin.");
    }
}

// Formun submit olayını bağla (Eğer dosyanın sonunda yoksa ekle)
document.getElementById('tarifFormu')?.addEventListener('submit', tarifKaydet);

// ==========================================
// 9. AKILLI EKLEME VE GÜNCELLEME SİSTEMİ
// ==========================================
const urlParametreleri = new URLSearchParams(window.location.search);
const gelenId = urlParametreleri.get('id');

document.addEventListener('DOMContentLoaded', async () => {
    const sayfaBaslik = document.getElementById('sayfaBaslik');
    const kaydetBtn = document.getElementById('kaydetButon');

    if (gelenId && sayfaBaslik && kaydetBtn) {
        sayfaBaslik.innerText = "Tarifi Düzenle";
        kaydetBtn.innerText = "Değişiklikleri Kaydet";

        try {
            const cevap = await fetch(`http://localhost:3000/api/tarifler/${gelenId}`);
            const veri = await cevap.json();

            if (veri) {
                // HTML'indeki input ID'lerine göre verileri dolduruyoruz
                document.getElementById('tarifBaslikInput').value = veri.title || "";
                document.getElementById('kategoriInput').value = veri.category || "";
                document.getElementById('hazirlamaInput').value = veri.prep_time || "";
                document.getElementById('pisirmeInput').value = veri.cook_time || "";
                document.getElementById('zorlukInput').value = veri.difficulty || "Orta";
                document.getElementById('kisiInput').value = veri.servings || "";
                document.getElementById('tarifDetayInput').value = veri.instructions || "";
                document.getElementById('resimUrlInput').value = veri.image_url || "";
                document.getElementById('videoUrlInput').value = convertYoutubeUrlToEmbed(veri.video_url) || "";
                // Malzemeleri yükle
                if (veri.ingredients) {
                    secilenlerListesi = [];
                    document.getElementById('secilenMalzemeler').innerHTML = '';
                    const malzemeler = veri.ingredients.split(', ');
                    malzemeler.forEach(m => {
                        if (m.trim()) malzemeEkle(m.trim());
                    });
                }
            }
        } catch (h) { console.error("Veri çekme hatası:", h); }
    }
});


// DETAY SAYFASI VERİ ÇEKME MOTORU
if (window.location.pathname.includes('tarif-detay.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        fetch(`http://localhost:3000/api/tarifler/${id}`)
            .then(res => res.json())
            .then(tarif => {
                console.log("Veritabanından Gelen Veri:", tarif); // 👈 1. BURAYA BAK! (F12 Console)
                sayfayiDoldur(tarif);
            })
            .catch(err => console.error("Detay hatası:", err));
    }
}
// ==========================================
// 10. PROFİL SAYFASI İŞLEMLERİ
// ==========================================
// profil.html yüklendiğinde çalışacak fonksiyon
// 1. KULLANICI TARİFLERİNİ LİSTELEME
// ==========================================
// 10. PROFİL SAYFASI İŞLEMLERİ
// ==========================================

// 1. KULLANICI TARİFLERİNİ KART OLARAK LİSTELEME
async function kullaniciTarifleriniGetir() {
    const kartAlani = document.getElementById('kullanici-tarif-karti-alani');
    const aktifKullanici = localStorage.getItem('aktifKullanici');

    // Eğer profil sayfasında değilsek veya giriş yapılmamışsa çalışma
    if (!kartAlani || !aktifKullanici) return;

    try {
        const cevap = await fetch(`http://localhost:3000/api/tarifler/kullanici/${aktifKullanici}`);
        const tarifler = await cevap.json();

        kartAlani.innerHTML = ''; // Önce alanı temizle

        // Döngüyle senin tariflerini kart olarak ekle
        // Döngüyle senin tariflerini kart olarak ekle
        tarifler.forEach(tarif => {
            kartAlani.innerHTML += `
                <div class="col-sm-6 col-lg-4">
                    <!-- Karta tıklayınca detay sayfasına gitmesi için onclick ve cursor eklendi -->
                    <div class="card h-100 shadow-sm border-0 recipe-card rounded-3 overflow-hidden" 
                         onclick="location.href='tarif-detay.html?id=${tarif.id}'" 
                         style="cursor: pointer;">
                        
                        <img src="${tarif.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300'}" 
                             class="card-img-top" alt="${tarif.title}" style="height: 160px; object-fit: cover;">
                        
                        <div class="card-body p-3">
                            <h6 class="card-title fw-bold mb-1 text-truncate">${tarif.title}</h6>
                            <div class="text-muted small mb-2"><i class="fas fa-tag me-1"></i>${tarif.category}</div>
                            
                            <div class="d-flex gap-1 mt-auto">
                                <!-- event.stopPropagation( ) ekleyerek butonun kart tıklamasını tetiklemesini engelledik -->
                                <button class="btn btn-outline-dark btn-sm w-100 py-1" style="font-size: 10px;" 
                                    onclick="event.stopPropagation(); location.href='tarif-ekle.html?id=${tarif.id}'">Düzenle</button>
                                
                                <button class="btn btn-outline-danger btn-sm w-100 py-1" style="font-size: 10px;" 
                                    onclick="event.stopPropagation(); kullaniciTarifSil(${tarif.id})">Sil</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });


        // En sona senin o "Daha fazla tarif paylaş..." kesik çizgili kartını otomatik ekliyoruz
        kartAlani.innerHTML += `
            <div class="col-sm-6 col-lg-4" style="cursor:pointer;" onclick="location.href='tarif-ekle.html'">
                <div class="card h-100 shadow-sm border-0 recipe-card rounded-3 overflow-hidden text-center d-flex align-items-center justify-content-center bg-light border-dashed" style="border: 2px dashed #ddd; min-height: 200px;">
                    <div class="p-4">
                        <i class="fas fa-plus-circle fa-2x text-muted mb-2"></i>
                        <p class="text-muted small mb-0">Daha fazla tarif paylaş...</p>
                    </div>
                </div>
            </div>
        `;

    } catch (err) {
        console.error("Tarifler yüklenirken hata:", err);
    }
}

// 2. KULLANICI TARİF SİLME 
async function kullaniciTarifSil(id) {
    if (!confirm("Kendi tarifini silmek istediğine emin misin?")) return;

    try {
        const cevap = await fetch(`http://localhost:3000/api/tarifler/${id}`, { method: 'DELETE' });
        const sonuc = await cevap.json();

        if (sonuc.success) {
            alert("Tarif başarıyla silindi! 🗑️");
            kullaniciTarifleriniGetir(); // Kartları hemen yenile
        } else {
            alert("Silme işlemi başarısız: " + sonuc.message);
        }
    } catch (err) {
        alert("Sunucu hatası: " + err.message);
    }
}

// 3. SAYFA YÜKLENDİĞİNDE TETİKLE
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('kullanici-tarif-karti-alani')) {
        kullaniciTarifleriniGetir();
    }
});
// İletişim Formu Kontrolü
document.getElementById('iletisimFormu')?.addEventListener('submit', function (e) {
    e.preventDefault(); // Sayfanın yenilenmesini engeller

    // Kullanıcıya geri bildirim veriyoruz
    alert("Mesajınız başarıyla iletildi! En kısa sürede dönüş yapacağız.");

    // Formu temizle
    this.reset();
});
// --- ADMİN: BÖLÜM GÖSTERME (TARİF / KULLANICI) ---
function bolumGoster(bolumId) {
    // Tüm bölümleri gizle
    document.getElementById('tarif-bolumu').style.display = 'none';
    document.getElementById('kullanici-bolumu').style.display = 'none';

    // Seçilen bölümü göster
    document.getElementById(bolumId).style.display = 'block';

    // Eğer kullanıcılar bölümü açıldıysa verileri çek
    if (bolumId === 'kullanici-bolumu') {
        adminKullanicilariGetir();
    }
}

// --- ADMİN: KULLANICILARI LİSTELE ---
async function adminKullanicilariGetir() {
    const tabloGovdesi = document.getElementById('admin-kullanici-tablosu');
    if (!tabloGovdesi) return;

    try {
        const cevap = await fetch('http://localhost:3000/api/admin/users');
        const kullanicilar = await cevap.json();

        tabloGovdesi.innerHTML = ''; // Tabloyu temizle

        kullanicilar.forEach(user => {
            const tr = document.createElement('tr');
            const tarih = new Date(user.created_at).toLocaleDateString('tr-TR');
            const rolRozet = user.role === 'admin' ? 'bg-danger' : 'bg-primary';

            tr.innerHTML = `
                <td>${user.id}</td>
                <td class="fw-bold">${user.username}</td>
                <td>${user.email}</td>
                <td><span class="badge ${rolRozet}">${user.role}</span></td>
                <td>${tarih}</td>
            `;
            tabloGovdesi.appendChild(tr);
        });
    } catch (err) {
        console.error("Kullanıcılar yüklenirken hata:", err);
    }
}
