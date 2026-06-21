-- AlterEnum
-- Adds the CIC_MANAGER access level (same permissions as SERVICE_MANAGER, different title).
ALTER TYPE "AdminRole" ADD VALUE IF NOT EXISTS 'CIC_MANAGER' AFTER 'SERVICE_MANAGER';
