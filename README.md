# PERAI: Yapay Zeka Destekli İngilizce Öğrenme Platformu

## Proje Özeti

*   **Proje Adı:** PERAI
*   **Hedef:** İngilizce dilbilgisi ve telaffuz hatalarını düzelten ve kişiselleştirilmiş geri bildirim sunan bir yapay zeka destekli web ve mobil platform geliştirmek.
*   **Kullanılan Teknolojiler:**
    *   **Frontend:** Angular, HTML, CSS, TypeScript
    *   **Backend:** Spring Boot, Java
    *   **Veritabanı:** PostgreSQL
    *   **Yapay Zeka:** GPT-40-mini (OpenAI) ve diğer dil düzeltme modelleri
    *   **Mobil Geliştirme:** (Mobil uygulama geliştiriliyorsa, kullanılan platformlar ve teknolojiler belirtilmeli - örn. React Native, Flutter)

## Özellikler

*   **Yapay Zeka Destekli Dilbilgisi ve Telaffuz Düzeltme:** Kullanıcı girdilerini analiz ederek hataları tespit eder ve düzeltmeler önerir.
*   **Kişiselleştirilmiş Geri Bildirim:** Kullanıcının öğrenme stiline ve ihtiyaçlarına göre uyarlanmış geri bildirimler sağlar.
*   **Web ve Mobil Platform:** Farklı cihazlarda erişilebilirlik sağlar.
*   **Kelime Bulmaca Oyunu:** Öğrenciler için eğlenceli bir kelime oyunu sunar.
*   **Öğretmen Paneli:** Öğretmenlerin öğrenci sözlüklerine kelime ataması yapmasını sağlar.
*   **Öğrenci Sözlükleri:** Öğrencilerin öğrenme süreçlerini takip edebilecekleri sözlükler sunar.

## Benchmarking (Performans Ölçümü)

*   **Model Performansını Ölçme:** Dil düzeltme modellerinin doğruluğunu, hızlarını ve genel performanslarını ölçmek için.
*   **Farklı Modelleri Karşılaştırma:** Farklı modellerin (örneğin, GPT-40-mini, pszemraj/grammar-synthesis-small) performanslarını karşılaştırmak.

## Yapay Zeka Entegrasyonu

*   **GPT-40-mini Modeli:** Dilbilgisi düzeltmeleri için OpenAI'nin GPT-40-mini modeli kullanılmıştır.

## Mimari

*   **Frontend:** Angular tabanlı bir web arayüzü.
*   **Backend:** Spring Boot ile geliştirilen bir Java REST API.
*   **Veritabanı:** PostgreSQL, kullanıcı verileri, sözlükler ve diğer bilgileri saklamak için.
*   **API Entegrasyonu:** OpenAI API'si ile entegrasyon sağlanmıştır.