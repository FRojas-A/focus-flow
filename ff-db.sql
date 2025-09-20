-- Create academic_years table
CREATE TABLE academic_years (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    year_start DATE NOT NULL,
    year_end DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;

-- Create terms table
CREATE TABLE terms (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    academic_year_id INT NOT NULL,
    term_start DATE NOT NULL,
    term_end DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_term_year FOREIGN KEY (academic_year_id)
        REFERENCES academic_years(id)
        ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE terms ENABLE ROW LEVEL SECURITY;

-- Create subjects table
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Create classes table
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    building VARCHAR(100),
    room VARCHAR(20),
    module VARCHAR(50),
    teacher VARCHAR(100),
    term_id INT,
    academic_year_id INT NOT NULL,
    subject_id INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_class_subject FOREIGN KEY (subject_id)
        REFERENCES subjects(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_class_term FOREIGN KEY (term_id)
        REFERENCES terms(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_class_year FOREIGN KEY (academic_year_id)
        REFERENCES academic_years(id)
        ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Create class_schedule table (weekly recurrence)
-- days uses an explicit array of weekday abbreviations, e.g. {'Mon','Wed','Fri'}
CREATE TABLE class_schedule (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    class_id INT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    start_date DATE,                         -- optional first date of recurrence window
    end_date DATE,                           -- optional last date (inclusive); NULL = open-ended
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    days TEXT[] NOT NULL,                   -- e.g. {'Mon','Wed','Fri'}
    interval_weeks INT NOT NULL DEFAULT 1 CHECK (interval_weeks >= 1),
    timezone TEXT,                           -- optional IANA timezone name
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT chk_schedule_time_range CHECK (start_time < end_time),
    CONSTRAINT chk_schedule_date_order CHECK (end_date IS NULL OR start_date IS NULL OR start_date <= end_date),
    CONSTRAINT chk_days_valid CHECK (
        cardinality(days) >= 1 AND
        days <@ ARRAY['Sun','Mon','Tue','Wed','Thu','Fri','Sat']::text[]
    )
);

-- Indexes to help lookups by user/class and days
CREATE INDEX IF NOT EXISTS idx_class_schedule_user_class ON class_schedule(user_id, class_id);
CREATE INDEX IF NOT EXISTS idx_class_schedule_days ON class_schedule USING GIN (days);

-- Enable Row Level Security
ALTER TABLE class_schedule ENABLE ROW LEVEL SECURITY;

-- Create exams table
CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    class_id INT NOT NULL,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_minutes INT NOT NULL,  -- e.g. 90
    seat VARCHAR(20),
    room VARCHAR(50),
    building VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_exam_class FOREIGN KEY (class_id)
        REFERENCES classes(id)
        ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

-- Create tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    class_id INT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('assignment', 'reminder', 'revision')),
    name VARCHAR(100) NOT NULL,
    details TEXT,
    due_date DATE,
    completed_date DATE,
    progress INT CHECK (progress IN (0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100)),
    exam_id INT,  -- only used if type = 'revision'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_task_class FOREIGN KEY (class_id)
        REFERENCES classes(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_task_exam FOREIGN KEY (exam_id)
        REFERENCES exams(id)
        ON DELETE SET NULL,
    CONSTRAINT revision_exam_guard CHECK (
        type != 'revision' OR exam_id IS NOT NULL
    )
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create class_overrides table
CREATE TABLE class_overrides (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, 
    class_id INT NOT NULL,
    cancelled BOOLEAN DEFAULT FALSE,
    override_date DATE NOT NULL,               -- date being modified
    override_start TIME,                       -- optional new start time
    override_end TIME,                         -- optional new end time
    override_building VARCHAR(100),            -- optional new building
    override_room VARCHAR(20),                 -- optional new room
    override_teacher VARCHAR(100),             -- optional new teacher
    notes TEXT,                                -- optional notes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (class_id, override_date),
    CONSTRAINT fk_class_override FOREIGN KEY (class_id)
        REFERENCES classes(id)
        ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE class_overrides ENABLE ROW LEVEL SECURITY;