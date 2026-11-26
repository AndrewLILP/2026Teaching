-- reef-answers.sql — TEACHER ANSWERS for Lesson 3 (Reef Data)
-- Run against reef.db AFTER the fixes in query 11:
--   UPDATE samples SET ss_mgl = NULL WHERE sample_id = 1595;
--   DELETE FROM samples WHERE sample_id = 1843;
-- Planted problems: sample 1595 SS = -42 (impossible), sample 796 DIN = NULL (missing; keep as NULL),
--   samples 1502 and 1843 are the same Burdekin sample entered twice (delete 1843).

-- 1. Sites on the Herbert River
SELECT site_name FROM sites WHERE river = 'Herbert';
--   Herbert River at John Row Bridge

-- 2. Number of Pioneer samples
SELECT COUNT(*) FROM samples WHERE site_id = 'PIO-DUM';
--   114

-- 3. Largest SS value ever recorded
SELECT MAX(ss_mgl) FROM samples;
--   1762.8

-- 3b. ...and where and when
SELECT site_id, sample_date, ss_mgl FROM samples ORDER BY ss_mgl DESC LIMIT 1;
--   FIT-FRW | 1996-03-10 | 1762.8

-- 4. Average DIN per site, highest first
SELECT site_id, ROUND(AVG(din_mgl), 3) AS avg_din FROM samples GROUP BY site_id ORDER BY avg_din DESC;
--   SJ-UCM | 0.332
--   NJ-GOO | 0.307
--   PIO-DUM | 0.269
--   TUL-EUR | 0.197
--   BAR-NTH | 0.171
--   HER-JRB | 0.112
--   FIT-FRW | 0.103
--   BUR-INK | 0.074
--   TUL-GOR | 0.049

-- 5. Average SS by land use (JOIN)
SELECT sites.land_use, ROUND(AVG(samples.ss_mgl), 1) AS avg_ss FROM samples JOIN sites ON samples.site_id = sites.site_id GROUP BY sites.land_use ORDER BY avg_ss DESC;
--   Grazing dominant, with cropping and upstream coal mining | 449.2
--   Grazing dominant; sugarcane and horticulture on the floodplain | 343.3
--   Grazing (about 76%) with irrigated sugarcane (about 19%) | 225.2
--   Mixed: rainforest, grazing, historical mining, sugarcane | 151.8
--   Mixed: grazing and forest upstream, sugarcane downstream | 122.7
--   Rainforest, sugarcane and bananas | 62.5
--   Rainforest and grazing, some sugarcane and bananas | 53.0
--   Sugarcane and bananas, mostly forested basin | 45.1
--   Rainforest (about 90% forest) | 8.7

-- 6. Example: Herbert SS, first and last 10 years
SELECT ROUND(AVG(ss_mgl),1) FROM samples WHERE site_id = 'HER-JRB' AND year BETWEEN 1991 AND 2000; -- then BETWEEN 2015 AND 2024
--   202.4
--   (last 10 years: 101.4)

-- 7. Extension: first and last decade for every site in one query
SELECT site_id,
       ROUND(AVG(CASE WHEN year <= (SELECT MIN(year) FROM samples s2 WHERE s2.site_id = samples.site_id AND s2.ss_mgl IS NOT NULL) + 9 THEN ss_mgl END), 1) AS first_10,
       ROUND(AVG(CASE WHEN year >= (SELECT MAX(year) FROM samples s3 WHERE s3.site_id = samples.site_id) - 9 THEN ss_mgl END), 1) AS last_10
FROM samples
GROUP BY site_id
ORDER BY site_id;
--   BAR-NTH | 277.4 | 184.6
--   BUR-INK | 475.6 | 210.1
--   FIT-FRW | 493.5 | 436.7
--   HER-JRB | 202.4 | 101.4
--   NJ-GOO | 68.6 | 43.5
--   PIO-DUM | 161.9 | 82.1
--   SJ-UCM | 55.7 | 60.3
--   TUL-EUR | 44.6 | 48.2
--   TUL-GOR | 15.1 | 3.6

-- 7b. Simpler extension version (fixed years, good enough for most sites)
SELECT site_id,
       ROUND(AVG(CASE WHEN year <= 2005 THEN ss_mgl END), 1) AS up_to_2005,
       ROUND(AVG(CASE WHEN year >= 2015 THEN ss_mgl END), 1) AS from_2015
FROM samples
GROUP BY site_id;
--   BAR-NTH | 259.3 | 184.6
--   BUR-INK | 475.6 | 210.1
--   FIT-FRW | 476.8 | 436.7
--   HER-JRB | 194.7 | 101.4
--   NJ-GOO | 63.6 | 43.5
--   PIO-DUM | None | 82.1
--   SJ-UCM | 62.3 | 60.3
--   TUL-EUR | 44.6 | 48.2
--   TUL-GOR | 12.9 | 3.4

