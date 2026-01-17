# DraftPRD.md – CourseLLM

## 1. Vision and Goal

**Vision:**  
To build a course-specific AI system that deepens student understanding through Socratic guidance, structured practice, and transparent progress tracking — while giving teachers class-level insights into learning outcomes.

**Primary Goal:**  
Enable genuine mastery of course materials without relying on generic AI tools, ensuring both **learning integrity** and **teaching efficiency**.

---

## 2. Target Users and Needs

### Students
- Seek help understanding complex topics and debugging problems.  
- Need personalized practice and awareness of what to study next.  
- Desire guidance that promotes reasoning, not shortcuts.

### Teachers / TAs
- Need a way to ensure students engage meaningfully with course content.  
- Want aggregated analytics about student progress and misconceptions.  
- Need tools to upload, organize, and validate course materials easily.

### Administrators
- Ensure secure, compliant data management and long-term platform stability.


## 3. Core Features

### 3.1 Socratic Chat Assistant
- Conversational AI that answers only within the course scope using RAG.  
- Guides students with hints and questions rather than giving direct answers.  
- Detects misconceptions and adapts follow-up questions accordingly.  
- Flags out-of-scope questions and returns restricted messages.  
- Logs chat sessions for progress tracking and anonymized analytics.

### 3.2 Course Material Management
- Teachers upload course content (PDFs, slides, code examples).  
- System indexes and chunks materials for semantic retrieval.  
- Detects terminology inconsistencies and validates RAG coverage.

### 3.3 Learning Trajectories and Progress Tracking
- Teachers define ordered topic paths.  
- Students see visual trajectories and mastery levels (“Needs Practice”, “Strong”).  
- Automatic updates to `StudentProgress` after each chat or quiz attempt.  
- Class-level dashboard aggregates progress metrics without personal identifiers.

### 3.4 Practice and Assessment
- AI generates topic-specific quiz questions and feedback.  
- Teachers can review, approve, and modify generated items.  
- Each attempt contributes to the student’s mastery status.  
- System ensures fairness and LLM-resilience for assessments.

### 3.5 Analytics Dashboard
- Aggregated insights: topic coverage, common misconceptions, engagement rate.  
- Accessible only to teachers in anonymized form.  
- Includes KPIs like usage frequency, quiz improvement, and response accuracy.

---

## 4. Technical Foundation

**Backend:** FastAPI (Python), PostgreSQL, Vector Store (FAISS/Pinecone)  
**Frontend:** React Web UI (future mobile support)  
**Authentication:** University SSO  
**LLM Integration:** GPT-based API with RAG scope enforcement  
**Privacy:** Encrypted logs, anonymized dashboards, role-based access  


## 5. Success Metrics

| Area | KPI | Target |
|------|-----|---------|
| Learning | ≥ 90% responses grounded in course material | Verified by citation logs |
| Engagement | ≥ 2 active sessions per student per week | Usage analytics |
| Progress | ≥ 20% improvement in practice accuracy | Pre/post comparison |
| Teacher Insight | ≥ 80% dashboard satisfaction score | Post-pilot survey |


## 6. Constraints and Risks

- **Scope:** Pilot limited to BGU CIS faculty courses.  
- **Risk:** Students may resist Socratic approach → mitigated via motivation layer.  
- **Risk:** High API costs → addressed with caching and limits.  
- **Constraint:** Teachers cannot access individual chat logs (privacy rule).  
- **Constraint:** Must comply with academic data regulations (GDPR-equivalent).


## 7. Next Steps

1. Validate MVP with 1–2 courses.  
2. Implement initial chat + progress modules.  
3. Expand to include analytics dashboard and teacher trajectory editor.  
4. Evaluate student learning outcomes post-semester.

