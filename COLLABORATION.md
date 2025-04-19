# 🤝 GitHub Collaboration Guide

Welcome to the Eco-friendly Travel Planner project!  
This guide shows how we will collaborate using Git and GitHub.

---

## 🚀 Initial Setup (First Time Only)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/eco-travel-planner.git
cd eco-travel-planner
```

### 2. Install Project Dependencies

```bash
npm install
```

### 3. Start the App Locally

```bash
npm run dev
```

---

## 🌳 Working on a Feature (Best Practice)

### 1. Create a New Branch

Always use a new branch for your feature:

```bash
git checkout -b feature/<your-feature-name>
```

**Examples:**

```bash
git checkout -b feature/eco-options
git checkout -b feature/itinerary
git checkout -b feature/profile-management
```

---

### 2. Add and Commit Your Work

After making changes:

```bash
git add .
git commit -m "✅ <describe your work clearly>"
```

**Examples:**

```bash
git commit -m "✅ Added Eco Options search and favorite feature"
git commit -m "🎨 Styled navbar with Bootstrap"
```

---

### 3. Push Your Branch to GitHub

```bash
git push -u origin feature/<your-feature-name>
```

---

### 4. Open a Pull Request (PR)

1. Go to [GitHub Repo](https://github.com/your-username/eco-travel-planner)
2. Click **Compare & Pull Request**
3. Add a clear title and description
4. Assign teammates to review (if needed)

---

### 5. After PR is Merged

```bash
git checkout main
git pull origin main
```

Then delete your local branch (optional):

```bash
git branch -d feature/<your-feature-name>
```

---

## 🔄 Keep Your Branch Updated

Before working on your branch:

```bash
git checkout main
git pull origin main
git checkout feature/<your-feature-name>
git merge main
```

---

## 🧑‍💻 Suggested Branch Names by Feature

| Feature              | Branch Name                |
|----------------------|----------------------------|
| Sign In / Sign Up    | `feature/auth`             |
| Dashboard            | `feature/dashboard`        |
| Eco Options          | `feature/eco-options`      |
| Itinerary Planner    | `feature/itinerary`        |
| Weather Forecast     | `feature/weather`          |
| Carbon Calculator    | `feature/carbon-calculator`|
| Profile Management   | `feature/profile`          |

---

## 🛠️ Troubleshooting

### 🔁 Reset a File Before Commit
```bash
git checkout <filename>
```

### 🧹 Undo the Last Commit (Before Pushing)
```bash
git reset --soft HEAD~1
```

---

## ✅ Final Tips

- **Never push directly to `main`.**
- Always **pull from `main`** before starting your work.
- Keep your **branch names descriptive and consistent**.
- Use **clear commit messages** with emojis if you like 😄

---

Happy coding, team! 💻🌿
