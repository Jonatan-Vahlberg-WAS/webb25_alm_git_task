#!/usr/bin/env node
/**
 * Creates GitHub issues from issues-2026-5-11.md (one issue per "### Issue N -" section).
 *
 * Prerequisites:
 *   - GitHub CLI: https://cli.github.com/  (`brew install gh`)
 *   - `gh auth login`
 *   - Run from repo root (or any cwd; script resolves paths relative to this file)
 *
 * Usage:
 *   node scripts/create-github-issues-2026-5-11.mjs
 *
 * Dry run (print titles only, do not create):
 *   node scripts/create-github-issues-2026-5-11.mjs --dry-run
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const dryRun = process.argv.includes('--dry-run')

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const issuesPath = path.join(root, 'issues-2026-5-11.md')

const text = fs.readFileSync(issuesPath, 'utf8')
const chunks = text.split(/\n---\n/).map((s) => s.trim())

const issueBlocks = chunks.filter((c) => /^### Issue \d+ -/m.test(c))

if (issueBlocks.length === 0) {
  console.error('No "### Issue N -" sections found in', issuesPath)
  process.exit(1)
}

for (const block of issueBlocks) {
  const firstLine = block.split('\n')[0]
  const m = firstLine.match(/^### Issue (\d+) - (.+)$/)
  if (!m) continue
  const num = m[1]
  const restTitle = m[2].trim()
  const fullTitle = `Issue ${num} - ${restTitle}`
  const body = block.slice(firstLine.length).replace(/^\n+/, '').trim()

  if (dryRun) {
    console.log('[dry-run]', fullTitle)
    continue
  }

  const tmp = path.join(os.tmpdir(), `gh-issue-${num}-${Date.now()}.md`)
  fs.writeFileSync(tmp, `${body}\n`, 'utf8')
  try {
    execFileSync('gh', ['issue', 'create', '--title', fullTitle, '--body-file', tmp], {
      stdio: 'inherit',
      cwd: root
    })
  } finally {
    fs.unlinkSync(tmp)
  }
}

if (dryRun) {
  console.error(`\nDry run: ${issueBlocks.length} issue(s). Remove --dry-run to create on GitHub.`)
}
