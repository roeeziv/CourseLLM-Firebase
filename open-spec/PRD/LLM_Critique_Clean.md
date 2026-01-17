# LLM_Critique.md


## 1. Overview

During the PRD creation process for **CourseLLM**, I used an LLM to assist in drafting structured requirement files — including the Draft PRD, main PRD, User Stories, Data Model, and Acceptance Criteria.  
Afterward, the same LLM reviewed the outputs for internal consistency, scope alignment, and clarity.


## 2. LLM Critique Summary

### Strengths
- **Strong alignment:** The PRD, user stories, and acceptance criteria all reference the same features (chatbot, RAG system, progress tracking, dashboards), showing clear internal consistency.  
- **Personas well-defined:** Both student and teacher roles are clearly described with goals and pain points that map directly to the features.  
- **Measurable outcomes:** The success metrics include clear, testable KPIs such as response time, engagement rate, and understanding improvement.  
- **Realistic scope:** The PRD clearly separates MVP features from future enhancements, ensuring the project remains feasible within the semester timeline.  
- **Clarity of structure:** The LLM helped maintain consistent formatting and logical order (objectives → features → UX → tech specs → metrics).

### Weaknesses / Improvement Points
1. **Feature overlap:** The “technical assistance” part for students (setup, debugging help) overlaps with general chatbot support and could be scoped down or merged.  
2. **Dashboard detail:** The teacher dashboard could include clearer data sources (e.g., practice logs, conversation analytics) to make the metrics reproducible.  
3. **Assessment terminology:** “Assessment” and “PracticeAttempt” are both used — standardizing the naming would make the data model cleaner.  
4. **Performance load detail:** Latency goals are defined, but expected load (number of users) could be stated more explicitly.  
5. **Privacy clarification:** The PRD mentions anonymized data, but could add one line specifying that IDs are stored internally while teacher views show only aggregates.


## 3. Experience Using the LLM

- **Helped with structure:** The LLM provided a strong outline and ensured consistent formatting across all markdown files.  
- **Improved clarity:** It offered better phrasing for goals and objectives, making them sound more professional.  
- **Required supervision:** Without guidance, the model tended to add extra features or over-scope; steering it toward the MVP kept it realistic.  
- **Useful for cross-checking:** The critique process highlighted small inconsistencies that are easy to miss manually, such as naming or metric alignment.  
- **Time-efficient:** Using the LLM significantly reduced the time spent writing repetitive parts, allowing more focus on design logic and scope.

---

## 4. Reflections and Takeaways

- LLMs can effectively support **requirements engineering** by maintaining structure, consistency, and completeness across documents.  
- The human role remains essential for **deciding priorities and interpreting scope** — the LLM ensures coherence but not judgment.  
- The critique process itself improved the overall quality of the PRD package by forcing cross-document validation.  
- The final PRD set (PRD.md, UserStories.md, DataModel.md, AcceptanceCriteria.md, Glossary.md) forms a coherent and testable foundation for the CourseLLM MVP.

