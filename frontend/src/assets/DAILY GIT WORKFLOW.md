---

# 🔁 DAILY GIT WORKFLOW (PROJECT: `owar`)

---

## 🧑‍💻 FOR ALL TEAM MEMBERS (EVERY DAY)

### ✅ 1️⃣ Open Project in VS Code

```bash
cd owar
```

---

### 🔄 2️⃣ Update `main` FIRST (MANDATORY)

```bash
git checkout main
git pull origin main
```

⚠️ Never skip this step

---

### 🌿 3️⃣ Switch to Your Branch

```bash
git checkout your-branch-name
```

Example:

```bash
git checkout pritesh
```

If branch does not exist:

```bash
git checkout -b vaibhav
```

---

### 🔁 4️⃣ Sync Your Branch with `main`

```bash
git merge main
```

If conflict appears → **STOP & fix conflicts first**

---

### ✍️ 5️⃣ Do Your Daily Work

* Code changes
* Save files

---

### 📋 6️⃣ Check Changes

```bash
git status
```

---

### 💾 7️⃣ Commit Your Work (Small Commits)

```bash
git add .
git commit -m "Updated dashboard UI"
```

---

### ⬆️ 8️⃣ Push Your Branch

```bash
git push origin your-branch-name
```

Example:

```bash
git push origin vaibhav
```

---

### 🔀 9️⃣ Create Pull Request (GitHub)

* Base: `main`
* Compare: `your-branch`
* Create PR

⛔ Do NOT merge yourself

---

---

# 👑 FOR REPO OWNER / TEAM LEAD (DAILY)

---

### 🔍 10️⃣ Review Pull Request

* Check code
* Check conflicts
* Ask for changes if needed

---

### ✅ 11️⃣ Merge Pull Request

Click:

```
Merge pull request → Confirm merge
```

---

### 🧹 12️⃣ Delete Merged Branch (Optional but Recommended)

```bash
Delete branch
```

---

### 🔄 13️⃣ Update Local Main After Merge

```bash
git checkout main
git pull origin main
```

---

---

# 🧑‍🤝‍🧑 FOR ALL MEMBERS (AFTER PR MERGE)

### 🔁 14️⃣ Update Your Branch

```bash
git checkout main
git pull origin main
git checkout your-branch
git merge main
```

---

---

# 🚨 COMMON PROBLEMS & FIXES

---

### ❌ `pathspec 'branch' did not match`

```bash
git branch
git checkout -b branch-name
```

---

### ❌ Merge Conflict

```bash
git status
```

* Fix conflict in VS Code
* Save

```bash
git add .
git commit -m "Resolved merge conflict"
```

---

### ❌ Accidentally Worked on `main`

```bash
git checkout -b your-branch
git push origin your-branch
```

---

---

# 🧠 GOLDEN RULES (REMEMBER)

✔ Pull `main` every day
✔ One branch per person
✔ Never push to `main`
✔ PR is mandatory
✔ Small & clean commits

---

# 🏁 QUICK DAILY CHECKLIST (SAVE THIS)

```text
1. git checkout main
2. git pull origin main
3. git checkout my-branch
4. git merge main
5. code → add → commit
6. git push origin my-branch
7. create PR
```
add this file on 18-01-2026 at 12.00 pm for daily work
---
