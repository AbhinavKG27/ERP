ALTER TABLE apex_erp.departments
    ADD COLUMN IF NOT EXISTS created_by BIGINT;
