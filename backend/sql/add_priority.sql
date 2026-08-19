-- Run once against the existing database before starting the updated application.
ALTER TABLE complaints
    ADD COLUMN priority ENUM('High', 'Medium', 'Low') NOT NULL DEFAULT 'Low' AFTER image;

UPDATE complaints c
JOIN departments d ON c.department_id = d.department_id
SET c.priority = CASE
    WHEN d.department_name IN ('Water Leakage', 'Electrical', 'Lift') THEN 'High'
    WHEN d.department_name IN ('Fan', 'Light') THEN 'Medium'
    ELSE 'Low'
END;
