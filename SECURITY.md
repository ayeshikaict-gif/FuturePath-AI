# FuturePath AI — Security & Privacy Architecture

## 1. Threat Modeling & OWASP Compliance
FuturePath AI is engineered to protect student privacy, sensitive educational records, and uploaded documents in compliance with OWASP Top 10 standards.

## 2. Authentication & Session Management
- **Password Hashing**: Industry-standard `bcrypt` with salt rounds >= 12.
- **Tokens**: Cryptographically signed JSON Web Tokens (JWT) using `HS256` or `RS256` with strict expiration windows (e.g., 60 minutes for access tokens).
- **Session Transport**: Standard Bearer authorization header with optional HttpOnly, Secure, SameSite=Lax cookies for browser sessions.

## 3. Server-Side Authorization & Multi-Tenancy
- **Strict Ownership Checks**: Every private resource query filters explicitly by `current_user.id`. A student cannot access or modify CVs, notes, roadmaps, or evidence belonging to another student.
- **Portfolio Privacy**: Portfolios remain strictly private (`portfolio_published = false`) until the user explicitly toggles public sharing. The public portfolio route only exposes approved public fields (Name, Bio, Skills, Projects, Public links) and never leaks CV files, raw transcripts, or internal notes.

## 4. Secure File Handling & Document Parsing
- **MIME & Extension Validation**: Only `.pdf`, `.docx`, and `.txt` files under 10MB are permitted. Magic byte inspection prevents executable or disguised files.
- **Path Traversal Protection**: Uploaded files are renamed using secure UUIDs (`uuid4()`) and stored outside web server public directories.
- **Untrusted Content Treatment**: Document text is parsed in memory and never executed. Output is escaped before presentation in the UI to prevent Stored XSS.

## 5. Audit Logging & Data Deletion
- **Audit Trails**: Security-sensitive events (logins, password updates, CV uploads, account deletions) are logged to the `audit_events` table.
- **Right to Erasure (GDPR / Privacy)**: When a student requests account deletion, a cascading purge removes all associated records, uploaded CVs, lecture transcripts, and roadmaps.
