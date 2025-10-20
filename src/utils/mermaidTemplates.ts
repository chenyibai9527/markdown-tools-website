export interface MermaidTemplate {
  id: string
  name: string
  description: string
  category: string
  template: string
  variables?: { name: string; description: string; defaultValue: string }[]
}

export const mermaidTemplates: MermaidTemplate[] = [
  {
    id: 'flowchart-basic',
    name: 'Basic Flowchart',
    description: 'Simple linear flowchart',
    category: 'Flowchart',
    template: `graph TD
    A[Start] --> B{Condition?}
    B -->|Yes| C[Execute Action]
    B -->|No| D[End]
    C --> D`,
  },
  {
    id: 'flowchart-complex',
    name: 'Complex Flowchart',
    description: 'Flowchart with multiple branches and loops',
    category: 'Flowchart',
    template: `graph TD
    A[Start] --> B[Initialize]
    B --> C{Check Condition}
    C -->|Satisfied| D[Process Data]
    C -->|Not Satisfied| E[Wait]
    E --> C
    D --> F{More Operations?}
    F -->|Yes| G[Continue Processing]
    F -->|No| H[End]
    G --> F`,
  },
  {
    id: 'sequence-basic',
    name: 'Basic Sequence Diagram',
    description: 'Simple interaction sequence diagram',
    category: 'Sequence Diagram',
    template: `sequenceDiagram
    participant A as User
    participant B as Frontend
    participant C as Backend
    participant D as Database

    A->>B: Send Request
    B->>C: Forward Request
    C->>D: Query Data
    D-->>C: Return Data
    C-->>B: Process Result
    B-->>A: Response to User`,
  },
  {
    id: 'sequence-api',
    name: 'API Call Sequence Diagram',
    description: 'RESTful API call flow',
    category: 'Sequence Diagram',
    template: `sequenceDiagram
    participant Client as Client
    participant API as API Service
    participant Auth as Auth Service
    participant DB as Database

    Client->>API: POST /api/login
    API->>Auth: Verify User Credentials
    Auth->>DB: Query User Information
    DB-->>Auth: Return User Data
    Auth-->>API: Authentication Result
    API-->>Client: Return Token`,
  },
  {
    id: 'mindmap-basic',
    name: 'Basic Mind Map',
    description: 'Simple topic structure diagram',
    category: 'Mind Map',
    template: `mindmap
  root((Topic))
    Main Branch 1
      Sub Topic 1.1
      Sub Topic 1.2
    Main Branch 2
      Sub Topic 2.1
      Sub Topic 2.2
    Main Branch 3
      Sub Topic 3.1
      Sub Topic 3.2`,
  },
  {
    id: 'mindmap-project',
    name: 'Project Planning Mind Map',
    description: 'Project planning and task breakdown',
    category: 'Mind Map',
    template: `mindmap
  root((Project))
    Requirements Analysis
      User Research
      Competitor Analysis
      Feature Planning
    Technical Design
      Architecture Design
      Database Design
      API Design
    Development Phase
      Frontend Development
      Backend Development
      Testing
    Deployment
      Server Configuration
      Deployment Testing
      Monitoring Setup`,
  },
  {
    id: 'gantt-basic',
    name: 'Basic Gantt Chart',
    description: 'Project timeline planning',
    category: 'Gantt Chart',
    template: `gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1
    Requirements Analysis     :a1, 2024-01-01, 7d
    Design Phase     :a2, after a1, 14d
    section Phase 2
    Development Phase     :b1, after a2, 21d
    Testing Phase     :b2, after b1, 10d
    section Phase 3
    Deployment     :c1, after b2, 3d`,
  },
  {
    id: 'class-diagram',
    name: 'Class Diagram',
    description: 'Object-oriented design class diagram',
    category: 'UML',
    template: `classDiagram
    class Animal {
        +String name
        +int age
        +void eat()
        +void sleep()
    }

    class Dog {
        +String breed
        +void bark()
    }

    class Cat {
        +Boolean indoor
        +void meow()
    }

    Animal <|-- Dog
    Animal <|-- Cat`,
  },
  {
    id: 'state-diagram',
    name: 'State Diagram',
    description: 'System state transition diagram',
    category: 'UML',
    template: `stateDiagram-v2
    [*] --> Pending
    Pending --> Processing: Start Processing
    Processing --> Completed: Processing Success
    Processing --> Failed: Processing Failed
    Failed --> Pending: Retry
    Completed --> [*]`
  },
  {
    id: 'er-diagram',
    name: 'ER Diagram',
    description: 'Database entity relationship diagram',
    category: 'Database',
    template: `erDiagram
    USER {
        int id PK
        string name
        string email
        datetime created_at
    }

    POST {
        int id PK
        int user_id FK
        string title
        text content
        datetime created_at
    }

    COMMENT {
        int id PK
        int post_id FK
        int user_id FK
        text content
        datetime created_at
    }

    USER ||--o{ POST : creates
    USER ||--o{ COMMENT : writes
    POST ||--o{ COMMENT : has`
  }
]

export function getTemplateById(id: string): MermaidTemplate | undefined {
  return mermaidTemplates.find(template => template.id === id)
}

export function getTemplatesByCategory(category: string): MermaidTemplate[] {
  return mermaidTemplates.filter(template => template.category === category)
}

export function getAllCategories(): string[] {
  return Array.from(new Set(mermaidTemplates.map(template => template.category)))
}