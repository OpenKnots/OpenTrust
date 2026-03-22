# CRM Scaffolding Notes (Docs-Only)

## Status

Docs-only for now. No runtime implementation yet.

## Purpose

Define how OpenTrust could later support lightweight CRM-style memory for people, relationships, and meaningful follow-up context without turning the product into a generic sales CRM.

## Principle

This is **relationship memory**, not enterprise pipeline software.

The goal is to help users retain:
- who someone is
- why they matter
- what happened last
- what to remember next

## Suggested entity scaffolding

### Person
- id
- name
- preferred name
- pronouns
- role/title
- organization
- notes
- tags
- last_interaction_at
- importance
- relationship_type

### Interaction
- id
- person_id
- timestamp
- source_type (`chat`, `meeting`, `note`, `manual`, `memory-promotion`)
- summary
- sentiment
- follow_up_needed
- follow_up_at
- provenance refs

### Relationship memory
- id
- person_id
- type (`preference`, `bio`, `history`, `important-detail`, `commitment`, `gift-idea`, `family`, `health-note`)
- value
- confidence
- review_status
- retention_class
- provenance refs

### Organization
- id
- name
- domain
- notes
- tags

## UI scaffolding ideas

### People index
- searchable people list
- recent interactions
- important reminders
- next follow-ups

### Person profile
- summary card
- recent interactions timeline
- important remembered details
- linked memories
- linked calendar events

### Follow-up queue
- upcoming outreach
- stale relationships needing touchpoints
- unresolved commitments

## Import paths

Possible future sources:
- promoted memories mentioning a person repeatedly
- contact cards imported manually
- calendar attendee metadata
- chat history references
- notes tagged with people

## Recommendation logic ideas

OpenTrust could eventually suggest:
- "You’ve mentioned this person 5 times. Create a relationship card?"
- "You promised to follow up last week. Add to CRM memory?"
- "This looks like a stable preference. Save to relationship memory?"

## Guardrails

- CRM features should be opt-in
- avoid importing personal contacts automatically without review
- sensitive relationship notes should support stronger retention/privacy rules
- provenance should remain visible for remembered claims

## Why docs-first

This area touches privacy, sensitivity, and product scope. The right next step is design and guardrails first, implementation later.
