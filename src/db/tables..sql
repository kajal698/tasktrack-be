--projects 
CREATE TABLE projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    added_by UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


-- users 
CREATE TABLE users(
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password TEXT NOT NULL,
    added_by VARCHAR(100),
    projects TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

)  

--task
CREATE TABLE tasks (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    task VARCHAR(500) NOT NULL,
    project_id uuid NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    added_by VARCHAR(255) NOT NULL,
    assigned_to uuid NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_project_id
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_assigned_to
        FOREIGN KEY (assigned_to)
        REFERENCES users(id)
        ON DELETE SET NULL
);



CREATE TABLE dummy_notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,           -- jinhe nu notification dikhni hai
    message TEXT NOT NULL,           -- notification text
    type VARCHAR(50),                -- task_created, task_assigned, comment_added
    is_read BOOLEAN DEFAULT FALSE,   -- read / unread
    created_at TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);


-- users task assign

--comments
CREATE TABLE comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    task_id uuid NOT NULL,
    comment_text TEXT NOT NULL,
    added_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




