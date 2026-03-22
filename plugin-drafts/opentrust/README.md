# OpenTrust Plugin Draft

This directory contains **draft** OpenClaw plugin artifacts for packaging OpenTrust as a first-class plugin.

## Status

- planning / packaging prep only
- not yet bundled into the OpenClaw repo
- not yet authoritative runtime code

## Intended purpose

These files exist to make plugin packaging concrete while keeping all planning inside the OpenTrust repo.

## Draft scope

- plugin manifest
- plugin package metadata
- draft entrypoint
- draft config resolver
- draft bridge client
- draft tool wrappers
- draft plugin-owned HTTP handler

## Source of truth

The real runtime remains the OpenTrust app/runtime in this repo.
These plugin draft files are packaging-oriented projections of that runtime, not the canonical implementation.
