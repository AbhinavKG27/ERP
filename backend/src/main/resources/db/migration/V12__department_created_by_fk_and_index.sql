CREATE INDEX IF NOT EXISTS idx_departments_created_by
    ON apex_erp.departments(created_by);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_departments_created_by_users'
    ) THEN
        ALTER TABLE apex_erp.departments
            ADD CONSTRAINT fk_departments_created_by_users
            FOREIGN KEY (created_by)
            REFERENCES apex_erp.users(id)
            ON DELETE SET NULL;
    END IF;
END $$;
