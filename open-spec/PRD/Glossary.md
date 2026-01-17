# Glossary.md

This glossary defines the terms used in the CourseLLM PRD, AcceptanceCriteria.md, and DataModel.md. All future documents should reuse these names to keep the schema and behavior consistent.

## A

### Academic Integrity
Features and policies intended to discourage or detect misuse of AI or plagiarism in the course context. May include log analysis or anomaly detection, but is not the main MVP focus.

### Acceptance Criteria
Testable conditions that must be satisfied for a feature or the MVP to be considered complete. In this project they cover functional behavior (chatbot, uploads), performance (latency, indexing), and educational KPIs.


## C

### Chat Message
A single utterance (from user, assistant, or system) that belongs to a Chat Session. In the data model it stores sender type, text, timestamps, and may include an `is_socratic` flag or topic tag.

### Chat Session
A continuous conversation between a user and the CourseLLM chatbot inside the scope of one course. Used to group messages, preserve short-term context, and later analyze engagement.

### Citation
A reference that connects a bot message to the exact course material (document, slide, or chunk) that supported the answer. Implemented via the `MessageCitation` table. Citations are required by the acceptance criteria to prove answers are grounded.

### Course
Top-level container for all content, users, topics, and analytics related to a single class (e.g. “Data Structures 2025A”). Many entities (Material, Topic, Trajectory, Assessment) are defined per course.

### Course Role
The role a user holds *inside a course* (student, teacher, ta). Stored in the Enrollment table and used to control permissions.


## D

### Dashboard (Teacher)
Analytics view that shows aggregated, anonymized progress for a course: topic mastery, engagement level, common misconceptions. Built from StudentProgress and attempts data.

### Data Model
The structured description of entities, attributes, and relationships that the system persists. In this project it is implemented primarily in a relational DB (users, courses, topics, chat, assessments) with a separate vector store for retrieval.


## E

### Enrollment
The link between a user and a course with a specific course role. A user may be enrolled in many courses; each course can have many enrolled users.


## K

### Knowledge Base
The set of indexed course materials that the chatbot is allowed to use. It is the “ground truth” for RAG and must stay in scope of the current course.

### KPI (Key Performance Indicator)
A quantitative measure used in AcceptanceCriteria.md to decide whether the MVP delivered impact (e.g. ≥ 98% grounded responses, ≥ 20% improvement in quiz scores, ≥ 4.0/5 satisfaction).


## L

### Learning Trajectory
A teacher-defined ordered path of topics for a course. Stored using `LearningTrajectory` and `TrajectoryTopic` tables. Used by the chatbot to explain prerequisites and by dashboards to compute completion percentages.

### LLM (Large Language Model)
The AI model that generates answers and Socratic questions. In this system the LLM must be constrained through RAG and scope rules.


## M

### Material
Any uploaded or registered course file (PDF, PPTX, Markdown, URL) that becomes part of the course knowledge base. Each material is tied to a course and an uploader.

### Material Chunk
A small, extracted piece of a material (usually a paragraph or slide) that is embedded and stored in the vector store. Chatbot retrieval operates at the chunk level, not the whole document.

### Mastery Status
Label indicating how well a student knows a topic. In StudentProgress it is one of: `not_started`, `in_progress`, or `mastered`. Acceptance criteria require that practice and chat interactions update this status.


## O

### Out-of-Scope Question
A user query that is not covered by the course knowledge base. The acceptance criteria require the chatbot to detect these and return a restricted message instead of answering freely.


## P

### Practice Question
A teacher-created or AI-generated item attached to a topic and a course. Used to let students exercise material and to collect progress signals.

### Practice / Student Attempt
A record of how a student answered a practice question (correctness, timestamps, hints). Forms the basis for analytics and topic mastery.


## R

### RAG (Retrieval-Augmented Generation)
Architecture where the system first retrieves relevant material chunks for the current course and only then asks the LLM to generate an answer using those chunks. This is the main mechanism for keeping answers within course scope.

### Restricted-to-Course Response
A standard message used by the chatbot when the question is outside course content. Mentioned in acceptance criteria as part of scope control.


## S

### Socratic Learning
Interaction style where the chatbot guides the student with probing questions instead of giving immediate final answers. Logged per message using the `is_socratic` flag so teachers can audit adherence.

### Source Material
Synonym for “Material”; the original document a teacher uploaded. Citations always point back to source material.

### Student
Primary persona representing a learner enrolled in at least one course. Students chat with the bot, answer practice questions, and view their progress.

### Student Progress
A per-student, per-topic record indicating current mastery and last activity. Computed from attempts and chat, displayed to the student and aggregated for teachers.


## T

### Topic
Smallest curricular unit in a course (e.g. “Asymptotic Analysis”). Topics are referenced by materials, assessments, chat messages, and progress entries.

### Trajectory Topic
Join object that places a topic at a specific position inside a learning trajectory. Enables multiple trajectories per course with different orders.

### Teacher
Persona responsible for uploading materials, defining trajectories, and monitoring class progress. Has higher privileges than students inside the course.


## V

### Vector Store
External service or table that stores embeddings for material chunks. Queried during RAG to find the most relevant course content.

---

## W

### Weekly Active Users (WAU)
Engagement metric used to evaluate adoption during the pilot. Derived from chat sessions and practice attempts.

