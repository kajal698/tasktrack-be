-- all queries here


-- ALTER TABLE projects
-- ADD COLUMN prompt_type VARCHAR(255) DEFAULT NULL;



ALTER TABLE users
ADD COLUMN password VARCHAR(255);

ALTER TABLE users
ALTER COLUMN added_by DROP NOT NULL,
ALTER COLUMN projects DROP NOT NULL;



ALTER TABLE users
ALTER COLUMN added_by DROP NOT NULL;


ALTER TABLE users ADD COLUMN password TEXT NOT NULL;


SELECT version();

INSERT INTO users (
  id, username, email, added_by, projects, role, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'kajal',
  'kajal@apyhub.com',
  gen_random_uuid(),
  ARRAY[]::uuid[],=
  'developer',
  NOW(),===
  NOW()
)

ALTER TABLE users
ADD COLUMN password VARCHAR(255);



//25

SELECT * FROM projects WHERE id = '78ec30e3-63d9-423d-ac2f-aaa184f4adf2';

UPDATE users SET projects = NULL;

ALTER TABLE users
ALTER COLUMN projects TYPE UUID
USING projects::uuid;

ALTER TABLE users DROP COLUMN projects;
ALTER TABLE users
ADD COLUMN project UUID NULL;


ALTER TABLE projects ALTER COLUMN added_by DROP NOT NULL;

UPDATE projects
SET name = $1, updated_at = NOW()
WHERE id = $2
RETURNING *;


INSERT INTO users (id, first_name, last_name, email)
VALUES )

CREATE TABLE usersInfo (
  id VARCHAR(50) PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100)
);





-- Assign a task to a user
UPDATE tasks
SET assigned_to = '<user_uuid>',  -- Replace with the UUID of the user
    updated_at = NOW()
WHERE id = '<task_uuid>';         -- Replace with the UUID of the task

