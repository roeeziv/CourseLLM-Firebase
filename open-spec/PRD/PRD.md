# PRD.md – CourseLLM

This PRD defines the scope of the CourseLLM MVP and is aligned with the following project files:
- DraftPRD.md (high-level vision)
- DataModel.md (entities and relationships)
- UserStories.md (personas and flows)
- AcceptanceCriteria.md (measurable success conditions)
- Glossary.md (terminology)



## 1. Product Overview

**Product name:** CourseLLM  
**Goal:** Provide a course-specific, AI-assisted learning experience that helps CS students understand material more deeply, while giving teachers anonymized insight into class progress.  
**Core idea:** AI is constrained to *teacher-provided course materials* and uses a *Socratic* style to promote learning instead of answer-dumping.

The system is designed for a semester-long pilot within the Computer Science department and must be viable with a small engineering team.



## 2.Target, Problem & Rationale

### 2.1 Student-side Problems
- Students already use general-purpose LLMs but get answers that are out of scope or inconsistent with the course.
- Students cannot easily tell what they have mastered and what they still need to study.
- Feedback is too slow (often only at exams).

### 2.2 Teacher-side Problems
- Teachers cannot see where a whole class is struggling until it is too late.
- Assignments can often be solved by pasting them into ChatGPT.
- Creating topic-aligned practice questions is time-consuming.

### 2.3 Product Rationale
By limiting the AI to course material (RAG) and by logging interactions in a structured way, CourseLLM generates **learning signals** that can be used by both students (self-awareness) and teachers (class analytics).


## 3.User Experience 

### Student Experience
- The chatbot will use a conversational interface styled like common messaging apps.
- Students will interact via free-text input; the chatbot will respond with guiding questions, hints, or resource citations (Socratic method).
- A visual “Learning Trajectory Map” will show progress and completed concepts.
- Quiz results will include instant feedback and links to relevant course material.
- All interfaces will be mobile- and desktop-friendly.

### Teacher Experience
- Teachers will use a dashboard to upload course files (PDF, MD, DOCX).
- The dashboard will display student heatmaps indicating difficulty hotspots.
- Assignment creation will use templates and LLM-assisted question generators.
- Teachers will receive alerts when students deviate from the planned learning trajectory.

### Accessibility & Design
- The interface will support dark mode, keyboard navigation, and screen reader compatibility.
- Visuals will use color-blind-friendly palettes and accessible fonts.
- visually choose what is your role.
- check waht is the role for each user.



## 4. Scope (MVP)

The MVP must deliver the following capabilities:

1. **Course-bounded Socratic chatbot** for students.  
2. **Course material upload and indexing** for teachers.  
3. **Topic-based learning trajectories** with basic progress tracking.  
4. **Anonymized teacher dashboard** showing class-level performance.  
5. **Topic-based practice generation and logging.**

Anything outside this set is considered “later” unless trivial to implement.



## 5. Functional Requirements

### 5.1 Student Experience

**FR-S-1: Course Q&A (scoped)**  
- Student can select a course and ask a natural-language question.  
- System must run RAG over materials for that course only.  
- If no relevant material is found, system must return a restricted message.  
- Related entities: `ChatSession`, `ChatMessage`, `MessageCitation`, `MaterialChunk`.

**FR-S-2: Socratic Interaction**  
- First response should guide (ask, probe, clarify) before providing a full explanation.  
- System should mark such messages with `is_socratic = true` to enable auditing (see DataModel.md).

**FR-S-3: Practice by Topic**  
- Student can pick a topic from the course.  
- System provides 3–5 practice questions grounded in course material.  
- Each attempt is stored and tied to that topic.  
- Related entities: `Assessment` (or practice container), `AssessmentQuestion`, `StudentAnswer`.

**FR-S-4: Progress View**  
- Student sees a simple per-topic view with mastery labels: `not_started`, `in_progress`, `mastered`.  
- Progress should update after practice attempts or sufficient chat interaction.  
- Related entity: `StudentProgress`.

**FR-S-5: Motivation Layer**  
- For each topic, student can view a short explanation of “why this matters”.  
- Content may be AI-generated but must be editable by teachers.



### 5.2 Teacher / TA Experience

**FR-T-1: Material Upload & Management**  
- Teacher uploads files (PDF, PPTX, MD, TXT, external URL).  
- System stores file metadata in `Material` and extracted chunks in `MaterialChunk`.  
- Processed status shown to the teacher (pending, ready, error).

**FR-T-2: Topic & Trajectory Definition**  
- Teacher defines course topics in `Topic`.  
- Teacher creates ordered paths in `LearningTrajectory` and links topics via `TrajectoryTopic`.  
- The chatbot and practice tool must use these topics for tagging.

**FR-T-3: Anonymized Analytics Dashboard**  
- Teacher can view class-level aggregates: active students per topic, average practice score, count of chat questions per topic.  
- No individual student identities shown.  
- Must support identification of common misconceptions.

**FR-T-4: Practice/Question Review**  
- Teacher can view generated practice questions and optionally edit/approve them before publishing.  
- Edited questions should keep their topic linkage.

**FR-T-5: Consistency / Coverage Checks (lightweight)**  
- Teacher can trigger a simple validation that highlights missing prerequisites or contradictory terminology across materials.  
- Exact algorithm can be heuristic in MVP.



### 5.3 Administrator Experience

**FR-A-1: Access Control**  
- Ability to enable/disable access to specific courses or users.  
- Roles: student, teacher, admin (see Enrollment in DataModel.md).

**FR-A-2: Data Retention**  
- Ability to archive courses and keep anonymized logs for research or auditing.



## 6. Data & Model Requirements

This PRD adopts the schema in **DataModel.md**. The following are mandatory for MVP:

1. **Users and Courses** – `User`, `Course`, `Enrollment`.  
2. **Content for RAG** – `Material`, `MaterialChunk` with vector reference.  
3. **Learning Structure** – `Topic`, `LearningTrajectory`, `TrajectoryTopic`.  
4. **Interaction Logging** – `ChatSession`, `ChatMessage`, `MessageCitation`.  
5. **Practice & Progress** – `Assessment`/`AssessmentQuestion`/`StudentAnswer` (or PracticeAttempt) and `StudentProgress`.

All chatbot responses that claim to be based on material must be traceable through `MessageCitation` (see AcceptanceCriteria.md).



## 7. Non-Functional Requirements

**NFR-1 Performance**  
- 95% of chatbot responses should be returned in ≤ 3 seconds under expected pilot load (≈ 100 concurrent users).

**NFR-2 Availability**  
- System should be available ≥ 95% during the semester.

**NFR-3 Privacy**  
- Teacher-facing views must use anonymized or aggregated data only.  
- All traffic over HTTPS.  
- Logs must not expose student personal data in raw form.

**NFR-4 Deployability**  
- System must be deployable with Docker / docker-compose on a university server.

**NFR-5 Auditability**  
- Each bot answer should be auditable to: user, course, material chunk(s), and timestamp.



## 8. Success Metrics

These map directly to AcceptanceCriteria.md.

1. **Grounded Responses** – ≥ 98% of factual answers include a citation.  
2. **Scope Control** – ≥ 99% of out-of-course questions get a restricted response.  
3. **Learning Improvement** – Students show ≥ 20% improvement between first and last practice attempts on a topic.  
4. **Engagement** – ≥ 50% of enrolled students use CourseLLM at least once per week.  
5. **Teacher Adoption** – ≥ 2 pilot teachers upload materials and view dashboards weekly.  
6. **Satisfaction** – Average rating ≥ 4.0 / 5 in pilot survey.



## 9. Out of Scope (for MVP)

- Automatic grading of real course assignments.  
- Deep cheating detection and similarity analysis.  
- Full LMS (Moodle / Canvas) bidirectional integration.  
- Multi-course knowledge mixing (chatbot must stay in one course).  
- Mobile app (web is sufficient for pilot).



## 10. Risks & Mitigations

1. **Students prefer direct answers** → keep Socratic flow but allow “show explanation” after 1–2 guided turns.  
2. **Poor RAG quality** → add teacher-facing “material coverage” indicator.  
3. **High LLM cost** → cache retrieved chunks and limit context windows.  
4. **Teacher skepticism** → emphasize anonymized analytics and citation-based answers.

