# Money Manager: UPI Transaction Tracker & Insights

A production-ready, full-stack FinTech application that acts as an automated "Money Manager". The application ingests unstructured bank SMS messages, intelligently parses and categorizes them, and provides a real-time, aesthetically premium dashboard (Arctic Slate theme) to track spending versus income.

## 🚀 Features
- **Automated SMS Parsing**: Uses Regex-based pattern matching in Java to extract transaction amounts, merchants, and debit/credit status from raw text.
- **Auto-Categorization Engine**: Automatically routes transactions to logical buckets (Food & Dining, Travel, Salary, Miscellaneous).
- **Real-Time Visual Analytics**: Dynamic Pie Charts and progress bars (using Recharts and Framer Motion) that instantly recalculate as new transactions are added or recategorized.
- **Vibe Check / Reward System**: Injects "Expected Savings" (e.g. 5% cashback on Zomato/Uber) into the transaction metadata based on business logic.
- **Production-Ready Docker Environment**: Fully containerized using multi-stage builds and NGINX reverse-proxying.

---

## 🛠️ Tech Stack
- **Backend**: Java 21, Spring Boot 3.2.5, Spring Web, Spring Data JPA, H2 Database, Lombok.
- **Frontend**: React.js, Vite, Framer Motion, Recharts, Vanilla CSS, Lucide React.
- **Deployment**: Docker, Docker Compose, Nginx.

---

## ⚙️ Setup Instructions

### Option 1: Docker (Recommended for Production)
1. Ensure Docker Desktop is running.
2. Navigate to the root directory and run:
   ```bash
   docker-compose up --build -d
   ```
3. The app is live at `http://localhost`. (Nginx handles routing and API proxying automatically).

### Option 2: Local Development
**Backend:**
1. Navigate to `./bank-backend`.
2. Run `.\mvnw clean spring-boot:run`
3. The API will start on `http://localhost:8080`.

**Frontend:**
1. Navigate to `./bank-frontend`.
2. Run `npm install` followed by `npm run dev`.
3. The UI will start on `http://localhost:5173`.

---

## 🚧 Challenges Faced & How We Overcame Them

During the development lifecycle, we encountered and systematically resolved several critical engineering challenges:

### 1. Build Dependencies & Versioning Conflicts
**Problem:** The Spring Boot backend was failing to compile due to missing `<version>` tags in test dependencies (`spring-boot-starter-webmvc-test`) and a mismatched `maven-compiler-plugin`. The IDE also reported "cannot be resolved" for MockMvc imports.
**Solution:** We identified that the `<parent>` pom tag was missing. By injecting the `spring-boot-starter-parent` (v3.2.5), we enabled Spring's dependency management, which automatically resolved versions for all child starters (like MockMvc and JUnit). We also explicitly aligned the Lombok version to match the Java 21 compiler configuration.

### 2. Analytical Data Pollution (The "Salary in Expenses" Bug)
**Problem:** The backend `getMetrics()` API was iterating over all transactions and merging them by `Category` label using a `HashMap`. Because "Salary" is technically a category, it was being injected into the Frontend's expense Pie Chart and total debit calculations, inflating user spending data incorrectly.
**Solution:** We refactored the backend parsing logic and metrics generation. Instead of trusting labels, we introduced a strict evaluation of the `Transaction.getType()` (CREDIT vs DEBIT). All `CREDIT` transactions are now grouped into a reserved, isolated key (`__TOTAL_INCOME__`), while only `DEBIT` transactions populate the category expense buckets.

### 3. Edge-Case Parsing for Incomes
**Problem:** The regex parser failed to categorize messages like `"Received Rs. 1400 from Employer"` because the keyword list strictly looked for "salary" or "private company". As a result, income fell into the "Miscellaneous" fallback bucket.
**Solution:** We expanded the keyword heuristics in `TransactionParserService.java` to aggressively catch common Indian salary triggers, including `employer`, `pvt ltd`, `neft`, `imps`, and `credited by`.

### 4. CORS Restrictions
**Problem:** The React development server (`:5173`) was blocked by browser security policies from accessing the Spring Boot API (`:8080`).
**Solution:** We applied `@CrossOrigin(origins = "*")` on the `TransactionController` for local development. For production, we orchestrated an **Nginx Reverse Proxy** in the Docker container (`nginx.conf`) to internally route `/api/` calls to the backend, completely eliminating CORS by serving both on Port 80.

### 5. UI/UX "Vibe"
**Problem:** The initial design relied on basic HTML elements, making the platform feel like a rudimentary prototype rather than a FinTech product.
**Solution:** We executed a full UI rewrite to an "Arctic Slate" theme. We replaced native select boxes and static bars with **Framer Motion** for micro-animations (card slide-ins, hover lifts) and **Recharts** for an interactive SVG donut chart. We applied extensive glassmorphism and subtle glowing gradients to achieve an Apple-tier aesthetic.
