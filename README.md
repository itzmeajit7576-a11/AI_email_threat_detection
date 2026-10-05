# AI Email Threat Detection & Forensic Intelligence Platform

> Enterprise-grade Security Operations Center (SOC) web application for automated email threat triage, phishing classification, Business Email Compromise (BEC) detection, cryptographic authentication analysis (SPF / DKIM / DMARC), and incident forensic reporting.

---

## 🛡️ Key Features

- **Multi-Vector Threat Detection**:
  - **Phishing**: Credential harvesting signals, fake account warnings, suspicious login lures.
  - **Business Email Compromise (BEC)**: Executive impersonation (CEO fraud), urgent wire transfer requests, secrecy tactics, gift card scams.
  - **Spoofing**: RFC 822 From vs. Reply-To domain divergence, display name deception.
  - **Malicious URLs**: Obfuscation, typosquatting domains, IP address hosts, excessive subdomains.
  - **Payload Attachments**: Double-extension masking (`.pdf.exe`), executable binaries, macro containers.
  - **Spam**: Heuristic bulk commercial advertising analysis.
- **Cryptographic Authentication Telemetry**:
  - Full dissection of `Received-SPF`, `DKIM-Signature`, and `Authentication-Results`.
  - Granular classification: `PASS`, `FAIL`, `SOFTFAIL`, `NONE`, `UNKNOWN`.
- **Explainable AI Forensic Intelligence**:
  - Transparent reasoning layer explaining *why* an email was flagged without making unsubstantiated claims.
  - Pluggable AI provider architecture supporting Google Gemini, OpenAI, or a built-in Offline Neural Mock Engine.
- **SOC Intelligence Dashboard**:
  - Live security KPI metrics: Total Analyzed, Threats Detected, Critical Threats, Mean Risk Index.
  - Interactive Recharts: 7-Day Threat Activity Trends, Threat Distribution Pie, Risk Index Histogram, Auth Breakdown.
  - Real-time incident filtering and search table.
- **Forensic Report Generation**:
  - Exportable Indicators of Compromise (IOC) list for SIEM / firewall ingestion.
  - Print / PDF export and downloadable JSON audit files.
- **Zero Geolocation Guarantee**:
  - Strictly no IP-geolocation, tracking maps, or location telemetry used anywhere in the platform.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Custom Dark Cybersecurity / SOC Theme
- **Charts**: Recharts
- **Icons**: Lucide React
- **Validation**: Zod
- **Database**: Dual-mode SQLite (WAL mode) with resilient persistent JSON store fallback
- **Testing**: Jest + ts-jest

---

## 🚀 Quick Start & Installation

### 1. Requirements
- Node.js 18+ or 20+
- npm or yarn

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configurable options:
```env
# AI Provider: "mock" (default, no API key needed), "gemini", or "openai"
AI_PROVIDER=mock

# Google Gemini API Key (optional)
GEMINI_API_KEY=

# OpenAI API Key (optional)
OPENAI_API_KEY=

# Database path
DATABASE_PATH=./data/email-threat.db
```

### 4. Run the Local Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analyze-email` | Ingests raw RFC 822 email text, headers, or simulated fields |
| `POST` | `/api/analyze-eml` | Uploads and processes `.eml` or `.msg` files up to 10MB |
| `GET` | `/api/analyses` | Returns paginated and filtered email analyses |
| `GET` | `/api/analyses/:id` | Returns complete forensic breakdown for an incident |
| `DELETE`| `/api/analyses/:id` | Deletes an incident record from local storage |
| `GET` | `/api/dashboard` | Returns SOC aggregated metrics, distributions, and charts |
| `GET` | `/api/report/:id` | Returns formatted incident report data |
| `POST` | `/api/seed` | Seeds realistic demo threat samples |

---

## 🧪 Running Tests

Execute the unit and integration test suite:
```bash
npm test
```

Tests cover:
- RFC 822 Email header parsing
- SPF, DKIM, and DMARC alignment validation
- Phishing and BEC heuristic keyword detection
- URL extraction and obfuscation analysis
- Malicious attachment scoring
- Composite 0–100 risk score formulation
- AI Provider abstraction and fallback resilience

---

## 🔒 Security & Safe Handling

- **Untrusted Ingestion**: All uploaded emails and headers are parsed as untrusted strings.
- **No Attachment Execution**: Attached binaries are inspected via static metadata only and are never executed or rendered unsafely.
- **Secret Isolation**: API credentials reside strictly in server-side environment variables and are never exposed to client-side bundles.
