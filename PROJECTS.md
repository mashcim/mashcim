# 🚀 Tech Stack Projects by Zeynep Sude (mashcim)

Bu repo, farklı teknoloji kategorilerinde oluşturulmuş projeleri içermektedir. Her proje kendi alanında en iyi pratikleri göstermektedir.

## 📁 Proje Yapısı

```
projects/
├── 🛡️ cybersecurity/     # Siber Güvenlik Projeleri
├── 🎨 frontend/          # Frontend Geliştirme
├── 🔧 backend/           # Backend Geliştirme  
├── 🗄️ cloud/             # Bulut Hizmetleri
├── 🛠️ tools/             # Geliştirme Araçları
├── 🤖 ai-ml/             # AI/ML Projeleri
├── 🎮 gamification/      # Oyunlaştırma Platformları
├── 📱 mobile/            # Mobil Uygulamalar
├── 🔗 blockchain/        # Blockchain ve Web3
├── 🌐 web3/              # DeFi ve Web3
└── 🎯 ar-vr/             # AR/VR Deneyimleri
```

---

## 🤖 AI/ML Projects

### Threat Detection System (`projects/ai-ml/threat_detector.py`)
**Teknolojiler:** Python, TensorFlow, Scikit-learn, Flask, Redis

**Özellikler:**
- Machine Learning tabanlı tehdit tespiti
- Isolation Forest, Random Forest, LSTM modelleri
- Real-time anomaly detection
- RESTful API ile entegrasyon
- Model training ve deployment otomasyonu

**Başlatma:**
```bash
cd projects/ai-ml
pip install -r requirements.txt
python threat_detector.py
```

---

## 🎮 Gamification Projects

### Security CTF Platform (`projects/gamification/ctf_platform/app.py`)
**Teknolojiler:** Python, Flask, SQLite, WebSocket, HTML5

**Özellikler:**
- Capture The Flag oyun platformu
- Real-time leaderboard
- Achievement ve badge sistemi
- Multiplayer desteği
- Interactive challenge'lar

**Başlatma:**
```bash
cd projects/gamification/ctf_platform
pip install -r requirements.txt
python app.py
```

---

## 📱 Mobile Projects

### React Native Security App (`projects/mobile/react_native_security/App.tsx`)
**Teknolojiler:** React Native, TypeScript, Expo, Native APIs

**Özellikler:**
- Cross-platform mobil güvenlik uygulaması
- Real-time threat monitoring
- Device security scanning
- Network analysis tools
- Permission management

**Başlatma:**
```bash
cd projects/mobile/react_native_security
npm install
npx expo start
```

---

## 🔗 Blockchain Projects

### Smart Contract Auditor (`projects/blockchain/smart_contract_auditor/`)
**Teknolojiler:** Solidity, Hardhat, OpenZeppelin, Web3.js

**Özellikler:**
- Otomatik smart contract güvenlik denetimi
- Vulnerability scanning
- Auditor reputation sistemi
- DeFi güvenlik analizi
- Gas optimization önerileri

**Başlatma:**
```bash
cd projects/blockchain/smart_contract_auditor
npm install
npx hardhat compile
npx hardhat test
```

---

## 🌐 Web3 Projects

### DeFi Security Dashboard (`projects/web3/defi_security_dashboard/`)
**Teknolojiler:** React, Ethers.js, Web3.js, DeFi API'leri

**Özellikler:**
- DeFi portfolio güvenlik monitoring
- Real-time threat detection
- Smart contract interaction
- Yield farming güvenlik analizi
- Multi-protocol destek

**Başlatma:**
```bash
cd projects/web3/defi_security_dashboard
npm install
npm start
```

---

## 🎯 AR/VR Projects

### Cybersecurity Training Simulator (`projects/ar-vr/cybersecurity_training/`)
**Teknolojiler:** A-Frame, WebXR, Three.js, JavaScript

**Özellikler:**
- AR/VR siber güvenlik eğitim simülatörü
- Interactive network visualization
- Gamified learning experience
- Real-time threat simulation
- Multi-platform destek

**Başlatma:**
```bash
# Local server ile çalıştırın
cd projects/ar-vr/cybersecurity_training
python -m http.server 8000
# Tarayıcıda: http://localhost:8000
```

---

## 🛡️ Cybersecurity Projects

### Port Scanner (`projects/cybersecurity/port_scanner.py`)
**Teknolojiler:** Python, Socket Programming, Threading

**Özellikler:**
- Multi-threaded port tarama
- Servis tespiti
- JSON sonuç kaydetme
- Hızlı ve kapsamlı tarama modları
- Komut satırı arayüzü

**Kullanım:**
```bash
python port_scanner.py example.com -p 1-1000 -t 100 -o results.json
```

---

## 🎨 Frontend Projects

### Security Dashboard (`projects/frontend/dashboard/`)
**Teknolojiler:** React, Vite, TailwindCSS, Chart.js, Lucide Icons

**Özellikler:**
- Gerçek zamanlı güvenlik istatistikleri
- Interactive chart'lar ve grafikler
- Responsive tasarım
- Modern UI/UX
- WebSocket entegrasyonu hazır

**Başlatma:**
```bash
cd projects/frontend/dashboard
npm install
npm run dev
```

---

## 🔧 Backend Projects

### Security API (`projects/backend/api/`)
**Teknolojiler:** Node.js, Express, JWT, bcrypt, Winston, Rate Limiting

**Özellikler:**
- RESTful API tasarımı
- JWT authentication
- Rate limiting ve güvenlik
- Comprehensive logging
- Input validation (Joi)
- API documentation hazır

**Başlatma:**
```bash
cd projects/backend/api
npm install
npm start
```

---

## 🗄️ Cloud Projects

### AWS S3 Upload Service (`projects/cloud/aws-s3-upload/`)
**Teknolojiler:** Python, Flask, Boto3, AWS S3

**Özellikler:**
- Güvenli dosya upload
- Presigned URL generation
- File type validation
- Pagination desteği
- API key authentication
- Comprehensive error handling

**Başlatma:**
```bash
cd projects/cloud/aws-s3-upload
pip install -r requirements.txt
python app.py
```

---

## 🛠️ Tools Projects

### Docker Security Scanner (`projects/tools/docker-security/`)
**Teknolojiler:** Docker, Docker Compose, Python, Flask, Redis, Nginx, Prometheus, Grafana

**Özellikler:**
- Web-based security scanner
- Nmap entegrasyonu
- Redis caching
- Monitoring (Prometheus + Grafana)
- Load balancing (Nginx)
- Container security best practices

**Başlatma:**
```bash
cd projects/tools/docker-security
docker-compose up -d
```

---

## 🎯 Öne Çıkan Özellikler

### 🔒 Security Focus
- Input validation ve sanitization
- Authentication ve authorization
- Rate limiting ve DoS protection
- Secure file handling
- Container security

### 📊 Monitoring & Logging
- Comprehensive logging (Winston)
- Metrics collection (Prometheus)
- Visualization (Grafana)
- Health checks
- Error tracking

### 🚀 Performance
- Async operations
- Caching (Redis)
- Load balancing
- Containerization
- Scalability

### 🛠️ Development Best Practices
- Clean architecture
- Error handling
- Documentation
- Testing ready
- Environment configuration

---

## 🌟 Teknoloji Kapsamı

### 🛡️ Cybersecurity Tools
- Python, Kali Linux, Arch Linux
- Metasploit, Wireshark, Burp Suite
- Nmap, John the Ripper

### 🎨 Frontend Development
- HTML5, CSS3, JavaScript
- React, Vue.js, TypeScript
- Tailwind CSS, SASS

### 🔧 Backend Development
- Python, Node.js, Java
- C++, Go, Rust, PHP, Ruby

### 🗄️ Database & Cloud
- MySQL, MongoDB, PostgreSQL
- Redis, Firebase
- AWS, Google Cloud, Azure

### 🛠️ Tools & Technologies
- Git, VS Code, Docker
- Kubernetes, Jenkins
- GraphQL, REST API
- Linux, Windows, macOS

---

*Bu projeler sürekli güncellenmektedir. Her proje kendi alanında en iyi pratikleri göstermektedir.*
