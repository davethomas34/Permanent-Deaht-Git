# Permanent-Deaht-Git

One error. No survivors.

Permanent-Deaht-Git is a joke CI gauntlet that behaves like a very serious workflow product with absolutely no chill. It blocks suspicious bulk imports, runs the normal project checks, prints theatrical failure logs, and awards a completion certificate when the build survives.

It does **not** delete anyone's real local repository. The annihilation is limited to the temporary GitHub Actions runner checkout after a failed run.

## What It Does

- Requires the project to look like it started from scratch.
- Rejects archive dumps, huge binary blobs, dependency folders, and suspicious first commits.
- Runs install, lint, test, and build when those scripts exist.
- Blocks merge when any check fails.
- Generates a survivor certificate when everything passes.

## Install the Guillotine

Copy these into a repo you want to challenge:

```txt
scripts/guillotine.mjs
scripts/certificate.mjs
.github/workflows/permanent-deaht.yml
```

Then require the `Permanent Deaht Git` check before merging to `main`.

## Local Demo

```bash
node scripts/guillotine.mjs
node scripts/certificate.mjs
```

Open `index.html` in a browser to view the site locally.

## The Joke

People can obviously save their work elsewhere and keep going. The ritual is that they cannot upload it through this method unless the repo survives the gauntlet.

Survive the workflow. Earn the ponytail.

