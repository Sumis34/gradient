# RxDB & Supabase `updated_at` Issue

## Problem

RxDB uses `updated_at` to detect the newest document during replication.  
If Supabase has a `NOW()` trigger on `updated_at`, it can overwrite client timestamps. This causes updates to flip back and forth — every second change may appear undone.

## Solution

- **Disable the `NOW()` trigger** in SQL for `updated_at`.  
- Client must set `updated_at` on every local change.  
- Optional: use a conflictHandler to resolve edge cases by timestamp.

This ensures stable two-way replication and prevents oscillating updates.
