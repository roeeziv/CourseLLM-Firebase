# DataModel.md


## 1. Purpose
This document describes the data structures required to implement the CourseLLM MVP. It is based on the PRD and supports: course-bounded chatbot interactions, material upload and RAG, topic-based learning trajectories, student progress tracking, and basic assessments. The model is written to fit a relational database (e.g. PostgreSQL) with a companion vector store for retrieval.

---

## 2. High-Level Architecture
CourseLLM data is organized into three layers:

1. **Relational layer** – users, courses, topics, trajectories, chat sessions, assessment records.
2. **Content/RAG layer** – uploaded materials and their extracted chunks, each chunk linked to a vector embedding stored outside the relational DB.
3. **Analytics/progress layer** – student/topic progress records and aggregated views for teachers.

This split keeps the core entities normalized while allowing fast semantic retrieval over course material.

---

## 3. Core Entities

### 3.1 User
Represents anyone using the system.

- `user_id` (UUID, PK)
- `full_name` (string)
- `email` (string, unique)
- `global_role` (enum: student, teacher, ta, admin)
- `is_active` (boolean)
- `created_at` (timestamp)
- `last_login_at` (timestamp, nullable)

### 3.2 Course
Logical container for all course-specific data.

- `course_id` (UUID, PK)
- `course_code` (string, e.g. CS101)
- `name` (string)
- `description` (text, nullable)
- `semester` (string, e.g. 2025A)
- `created_by` (UUID → User)
- `is_active` (boolean)
- `created_at` (timestamp)

### 3.3 Enrollment
Links users to courses with a role in that course (student vs. teacher).

- `enrollment_id` (UUID, PK)
- `user_id` (UUID → User)
- `course_id` (UUID → Course)
- `course_role` (enum: student, teacher, ta)
- `created_at` (timestamp)

*Constraint:* `(user_id, course_id)` should be unique.

---

## 4. Content and RAG Entities

### 4.1 Material
Uploaded or registered course content used as the knowledge base.

- `material_id` (UUID, PK)
- `course_id` (UUID → Course)
- `uploader_id` (UUID → User)
- `title` (string)
- `source_type` (enum: upload, external_url)
- `file_type` (enum: pdf, pptx, md, txt, other)
- `storage_path` (string) – location in object storage or file system
- `processed_status` (enum: pending, processing, ready, error)
- `created_at` (timestamp)

### 4.2 MaterialChunk
Extracted text segments from materials; these are what get embedded for retrieval.

- `chunk_id` (UUID, PK)
- `material_id` (UUID → Material)
- `chunk_index` (int) – order inside the material
- `text` (text)
- `page_number` (int, nullable)
- `vector_ref` (string) – foreign key/key in vector store
- `topic_id` (UUID → Topic, nullable)

*A matching vector entry (embedding) is stored in FAISS/Pinecone/pgvector but not in this table.*

---

## 5. Learning Structure

### 5.1 Topic
Atomic learning unit inside a course (e.g. “Recursion”, “Big-O”).

- `topic_id` (UUID, PK)
- `course_id` (UUID → Course)
- `name` (string)
- `description` (text, nullable)
- `order_index` (int, nullable)
- `is_active` (boolean)
- `created_at` (timestamp)

### 5.2 LearningTrajectory
Named path through the topics of a course.

- `trajectory_id` (UUID, PK)
- `course_id` (UUID → Course)
- `name` (string)
- `description` (text, nullable)
- `is_default` (boolean)
- `created_at` (timestamp)

### 5.3 TrajectoryTopic
Junction table that orders topics inside a trajectory.

- `trajectory_topic_id` (UUID, PK)
- `trajectory_id` (UUID → LearningTrajectory)
- `topic_id` (UUID → Topic)
- `position` (int)

*Constraint:* `(trajectory_id, topic_id)` should be unique.

### 5.4 TopicMotivation (Optional but supported by PRD)
Stores the “why this matters” text shown to students.

- `topic_motivation_id` (UUID, PK)
- `topic_id` (UUID → Topic)
- `text` (text)
- `created_by` (UUID → User)
- `is_approved` (boolean)
- `created_at` (timestamp)

---

## 6. Interaction and Chat

### 6.1 ChatSession
Represents one conversational thread between a user and the course chatbot.

- `session_id` (UUID, PK)
- `user_id` (UUID → User)
- `course_id` (UUID → Course)
- `started_at` (timestamp)
- `ended_at` (timestamp, nullable)
- `mode` (enum: chat, practice_review)

### 6.2 ChatMessage
Messages exchanged in a session.

- `message_id` (UUID, PK)
- `session_id` (UUID → ChatSession)
- `sender_type` (enum: user, assistant, system)
- `content` (text)
- `created_at` (timestamp)
- `is_socratic` (boolean, nullable)
- `topic_id` (UUID → Topic, nullable)

### 6.3 MessageCitation
Links a bot message to the exact material used to answer it.

- `message_id` (UUID → ChatMessage, PK part)
- `material_id` (UUID → Material, PK part)
- `snippet` (text, nullable)

This table enables traceable, course-bounded answers as required by the PRD.

---

## 7. Assessment and Practice

### 7.1 Assessment
Generic container for quizzes, exams, or generated practice sets.

- `assessment_id` (UUID, PK)
- `course_id` (UUID → Course)
- `creator_user_id` (UUID → User)
- `title` (string)
- `assessment_type` (enum: quiz, exam, practice)
- `created_at` (timestamp)

### 7.2 AssessmentQuestion
Individual questions inside an assessment.

- `question_id` (UUID, PK)
- `assessment_id` (UUID → Assessment)
- `question_text` (text)
- `question_type` (enum: multiple_choice, short_answer, code)
- `options_json` (json, nullable)
- `correct_answer` (text, nullable)
- `topic_id` (UUID → Topic, nullable)

### 7.3 StudentAnswer
Stores a student’s answer to a question.

- `answer_id` (UUID, PK)
- `question_id` (UUID → AssessmentQuestion)
- `user_id` (UUID → User)
- `answer_text` (text)
- `is_correct` (boolean, nullable)
- `graded_at` (timestamp, nullable)

### 7.4 PracticeAttempt (Alternative lightweight form)
If the practice flow is per-question rather than per-assessment.

- `attempt_id` (UUID, PK)
- `question_id` (UUID → AssessmentQuestion or PracticeQuestion)
- `user_id` (UUID → User)
- `submitted_answer` (text)
- `is_correct` (boolean)
- `started_at` (timestamp)
- `completed_at` (timestamp)

---

## 8. Progress and Analytics

### 8.1 StudentProgress
Tracks mastery for a student on a specific topic.

- `user_id` (UUID → User, PK part)
- `topic_id` (UUID → Topic, PK part)
- `status` (enum: not_started, in_progress, mastered)
- `last_activity_at` (timestamp)

This table is updated from quiz attempts and chat interactions.

### 8.2 Derived Views (not mandatory as tables)
To support teacher dashboards, the system can expose materialized views such as:

- **TopicStats** (per course, per topic): attempts, avg score, number of active students, last activity.
- **StudentActivity**: last login, last chat, last practice per course.

These may be computed periodically instead of stored as full tables in the MVP.

---

## 9. Relationships (Text Summary)
- A **User** can be enrolled in many **Course** records (via **Enrollment**).
- A **Course** can have many **Material** records.
- A **Material** can have many **MaterialChunk** records.
- A **Course** has many **Topic** records.
- A **LearningTrajectory** belongs to one **Course** and has many **Topic** entries through **TrajectoryTopic**.
- A **Student** has many **ChatSession** records; each session has many **ChatMessage** records.
- A bot **ChatMessage** can have many **MessageCitation** records, each pointing to one **Material**.
- A **Course** can have many **Assessment** records; each assessment has many **AssessmentQuestion** records.
- A **Student** can submit many **StudentAnswer** or **PracticeAttempt** records.
- A **Student** has one **StudentProgress** record per **Topic**.

---

## 10. Notes on Vector Store
- Each `MaterialChunk` entry stores only a pointer (`vector_ref`) to the actual embedding.
- The retrieval pipeline should always filter by `course_id` so that answers stay in scope.
- If documents are re-uploaded, chunks should be re-generated and old chunks either versioned or marked inactive.

