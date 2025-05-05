Thought for a couple of seconds


**Guide: Keeping Your AstroPaper-Based Blog Up-to-Date**

Follow this workflow whenever you want to pull in new template changes from `satnaing/astro-paper` into your project.

---

## 1. Prerequisites

* You have a local git repo for your blog (with a `main` branch).
* You’ve already added the upstream remote:

  ```bash
  git remote add astro-paper https://github.com/satnaing/astro-paper.git
  ```

---

## 2. Daily/Weekly Update Workflow

1. **Fetch upstream changes**

   ```bash
   git fetch astro-paper
   ```

2. **Create or switch to your update branch**
   You can reuse the same branch each time (e.g. `update/astro-paper`):

   ```bash
   # If it already exists
   git checkout update/astro-paper  
   # Otherwise
   git checkout -b update/astro-paper
   ```

3. **Ensure a clean working directory**
   Commit or stash any local edits before merging:

   ```bash
   # Commit intentional changes
   git add <files>
   git commit -m "chore: save work before upstream merge"

   # Stash everything else (including untracked)
   git stash push --include-untracked -m "WIP before template update"
   ```

4. **Merge in the latest template**

   ```bash
   git merge astro-paper/main
   ```

   * If this is your first merge and histories differ, add `--allow-unrelated-histories`.
   * Resolve any conflicts in your editor, then `git add` and `git commit`.

5. **Re-apply your stash**

   ```bash
   git stash pop
   ```

   * If conflicts reappear here, resolve and `git add`, `git commit`.

6. **Install dependencies & test**

   ```bash
   pnpm install
   pnpm dev
   ```

   Confirm your site builds and runs as expected, and that your custom content still renders correctly.

7. **Merge update branch into `main`**

   ```bash
   git checkout main
   git merge update/astro-paper
   git branch -d update/astro-paper
   ```

8. **Push to your remote**

   ```bash
   git push origin main
   ```

---

## 3. Conflict-Resolution Tips

* When upstream changed a file you also customize (e.g. `astro.config.ts`), open the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) and choose whether to keep your options, upstream’s, or a combination.
* Use `git diff` to compare before/after.
* After resolving each file:

  ```bash
  git add <file>
  ```

  Then finish the merge with:

  ```bash
  git commit
  ```

---

## 4. Automating Notifications (Optional)

If you’d like a reminder to check for updates periodically:

1. Use a calendar or task tool to remind yourself (e.g. “Check AstroPaper update” every month).
2. At that time, run **Steps 2–8** above.

---

## 5. Rolling Back (If Something Breaks)

* If you need to undo the merge before pushing, run:

  ```bash
  git merge --abort
  git stash pop   # if you stashed
  ```
* If you already committed but haven’t pushed, you can reset:

  ```bash
  git reset --hard HEAD~1
  ```

---

**Now you have a repeatable process** to pull in upstream template improvements while preserving your custom content. Keep your blog fresh with minimal effort!
