# UserStories.md

## 1. Purpose
User stories describe the needs of CourseLLM’s primary personas—**Students**, **Teachers**, and **Administrators**—in a way that guides both feature design and validation.  
They ensure that the MVP delivers measurable educational value while staying within the technical and data scope defined in the system documents.


## 2. Persona A – Student (Learner Persona)

### Focus
Learning through Socratic interaction, practice, and self-awareness of progress.

**US-S-1 – Course-Bound Q&A**  
As a student, I want to ask questions about my course material so that I can receive relevant, accurate, and scoped answers derived from the official materials.

**US-S-2 – Socratic Guidance**  
As a student, I want the chatbot to guide me through concepts using hints and questions rather than providing the final answer, so I can improve my reasoning and understanding.

**US-S-3 – Misconception Correction**  
As a student, I want the system to recognize when I hold a misunderstanding and ask follow-up questions that help me correct it.

**US-S-4 – Out-of-Scope Awareness**  
As a student, I want the chatbot to tell me when a question is outside the course scope so I stay focused on relevant content.

**US-S-5 – Practice Generation**  
As a student, I want to generate practice questions per topic so I can immediately apply what I’ve learned.

**US-S-6 – Feedback and Progress**  
As a student, I want instant feedback after each practice attempt and visible mastery indicators (e.g., “Needs Practice”, “Getting There”, “Strong”).

**US-S-7 – Learning Trajectories**  
As a student, I want to see a visual map of topics and dependencies so I can understand what to study next.

**US-S-8 – Motivation View**  
As a student, I want to read short, meaningful explanations of why each topic matters so I remain engaged.



## 3. Persona B – Teacher / TA (Instructor Persona)

### Focus
Content management, class insight, and course structure definition.



**US-T-1 – Material Upload**  
As a teacher, I want to upload and manage my course materials so the chatbot and students access only verified, up-to-date content.

**US-T-2 – Content Indexing and Review**  
As a teacher, I want the system to automatically index and flag inconsistencies in my materials so that I can fix errors before the semester begins.

**US-T-3 – Trajectory Design**  
As a teacher, I want to create and order topics into learning trajectories so that students have a structured path to follow.

**US-T-4 – Practice Question Management**  
As a teacher, I want to review or edit generated practice questions so I can maintain academic quality and difficulty balance.

**US-T-5 – Analytics Dashboard**  
As a teacher, I want an anonymized overview of student progress per topic so I can identify which areas require reinforcement.

**US-T-6 – Misconception Analytics**  
As a teacher, I want to see aggregated patterns of common student misconceptions so I can adapt my teaching approach.

**US-T-7 – Academic Integrity**  
As a teacher, I want visibility into unusual behavior or suspected AI misuse so that I can maintain fair assessment conditions.



## 4. Persona C – Administrator (System Oversight Persona)

### Focus
Platform stability, compliance, and long-term data management.



**US-A-1 – Access Control**  
As an administrator, I want to manage who can access courses and content so that data privacy is protected.

**US-A-2 – Data Security and Backups**  
As an administrator, I want regular backups of all relational and vector data so that the system can recover from failure safely.

**US-A-3 – Data Retention and Archiving**  
As an administrator, I want to manage old courses and anonymized datasets so that we retain institutional history without violating privacy.



## 5. Mapping to Acceptance Criteria

| User Story ID | Acceptance Criteria Reference | Related Feature / Entity |
|----------------|--------------------------------|---------------------------|
| US-S-1 | Functional 3.1 Socratic Learning Assistant | ChatSession, ChatMessage, MessageCitation |
| US-S-2 | Functional 3.1.1 Socratic Interaction | ChatMessage (is_socratic) |
| US-S-3 | Functional 3.1.2 Misconception Handling | ChatMessage.misconception_tag |
| US-S-4 | Functional 3.1.3 Scope Restriction | Knowledge Base, RAG Filter |
| US-S-5 | Functional 3.3 Personalized Practice | PracticeQuestion, Assessment |
| US-S-6 | Functional 3.4 Progress Tracking | StudentProgress |
| US-S-7 | Functional 3.4.1 Learning Trajectories | LearningTrajectory, TrajectoryTopic |
| US-T-1 | Functional 3.2 Course Material Management | Material, MaterialChunk |
| US-T-5 | Functional 3.5 Analytics and Monitoring | Derived Views, Dashboard |
| US-A-2 | Technical 4.0 Data Management | Backup and Storage |



## 6. Notes
- Each story connects to a measurable acceptance criterion to ensure testability.  
- Only essential MVP functions are included; post-MVP features (e.g., grading automation, plagiarism detection) are deferred.  
- Story identifiers (e.g., US-S-1) should remain consistent across design, sprint planning, and validation documents.




