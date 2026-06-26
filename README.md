#  Ne Pişirsem

Kullanıcıların ellerinde bulunan malzemelere göre yapabilecekleri yemek tariflerini listeleyen, dinamik ve kullanıcı dostu bir web uygulamasıdır. 

Bu proje, modern web geliştirme mimarilerini (Backend ve Frontend haberleşmesi, veri tabanı entegrasyonu) uygulamalı olarak test etmek ve geliştirmek amacıyla tasarlanmıştır.

## Kullanılan Teknolojiler (Tech Stack)

*   **Backend (Arka Uç):** Node.js, Express.js
*   **Veri Tabanı:** PostgreSQL
*   **Frontend (Ön Yüz):** HTML, CSS, Bootstrap
*   **Mimari:** RESTful API

##  Kurulum ve Çalıştırma

Projeyi kendi bilgisayarınızda (lokal ortamda) çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

1. Projeyi bilgisayarınıza indirin (clone):
   ```bash
   git clone [https://github.com/Nevzatgzl/ne-pisirsem.git](https://github.com/Nevzatgzl/ne-pisirsem.git)
2.Proje dizinine gidin
    cd ne-pisirsem

3.Gerekli Node.js paketlerini (bağımlılıkları) yükleyin:
    npm install

4.PostgreSQL üzerinde projenin çalışması için gerekli veri tabanını oluşturun ve kod içerisindeki (örneğin db.js) bağlantı ayarlarını kendi veritabanı şifrenize göre güncelleyin.

5.Uygulamayı başlatın:
    npm start
    Uygulama varsayılan olarak http://localhost:3000 adresinde çalışacaktır.


Geliştirme Aşamasındaki Özellikler ve Bilinen Durumlar (Roadmap & Known Issues)
Bu proje aktif bir öğrenme ve geliştirme laboratuvarıdır. Şu an üzerinde çalışılan ve iyileştirilmesi planlanan bazı teknik başlıklar şunlardır:

API & Frontend Optimizasyonu: Backend'den dönen veri yapıları ile Bootstrap tabanlı ön yüzün (frontend script mantığı) daha senkronize çalışması için veri aktarım süreçleri iyileştiriliyor.

PostgreSQL Bağlantı Yönetimi: Yüksek sorgu durumlarında performans artışı sağlamak amacıyla veri tabanı bağlantı havuzu (connection pool) optimizasyonları üzerinde testler devam ediyor.



Geliştirici: Nevzat Güzel

