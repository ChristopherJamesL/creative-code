-- Add full-text content column to documents
alter table documents add column if not exists content text;
