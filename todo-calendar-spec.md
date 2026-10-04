# Todo Calendar Web — Full Specification

## 1. Tổng quan

Xây dựng một web application quản lý công việc cá nhân theo mô hình **Todo + Calendar**.

Ứng dụng cho phép người dùng:

- Đăng nhập bằng username/password.
- Quản lý nhiều user trên cùng browser.
- Tạo, sửa, xóa Todo.
- Xem Todo trên Calendar.
- Xem Todo của một ngày cụ thể.
- Tạo Todo bằng cách nhập text.
- Tạo Todo bằng cách kéo thả trên Calendar.
- Thiết lập thời gian bắt đầu/kết thúc.
- Thiết lập mức độ ưu tiên.
- Gán Category.
- Lọc và tìm kiếm Todo.
- Đánh dấu hoàn thành.
- Drag & drop để thay đổi ngày/giờ.
- Có Todo lặp lại.
- Có deadline.
- Có reminder.
- Có thống kê.
- Có Dark/Light mode.
- Dữ liệu được lưu local trên browser.
- **Không cần backend.**

---

# 2. Kiến trúc tổng thể

```text
Browser
│
├── Authentication
│   ├── Login
│   ├── Register
│   └── Logout
│
├── Todo Management
│   ├── Create
│   ├── Update
│   ├── Delete
│   ├── Complete
│   └── Recurring Todo
│
├── Calendar
│   ├── Month View
│   ├── Week View
│   ├── Day View
│   └── Drag & Drop
│
├── Category
│   ├── Create
│   ├── Edit
│   ├── Delete
│   └── Filter
│
├── Search / Filter
│
├── Statistics
│
├── Settings
│
└── Browser Storage
    ├── Users
    ├── Sessions
    ├── Todos
    ├── Categories
    └── Settings
```

---

# 3. Authentication

Vì không có backend nên authentication chỉ mang tính **local application authentication**.

Không được coi đây là authentication bảo mật thực sự.

## 3.1 Register

Form:

```text
Username
Password
Confirm Password
```

Validation:

- Username bắt buộc.
- Username tối thiểu 3 ký tự.
- Username không được trùng.
- Password tối thiểu 6–8 ký tự.
- Confirm password phải giống password.

Sau khi register:

```text
User created
→ automatically login
→ redirect Dashboard
```

## 3.2 Login

Form:

```text
Username
Password

[ Login ]

Don't have account?
[ Register ]
```

Nếu sai:

```text
Invalid username or password
```

Sau khi login:

```text
Login
 ↓
Create session
 ↓
Dashboard
```

Session được lưu trong browser.

Ví dụ:

```text
currentUserId
```

## 3.3 Logout

Có button:

```text
Logout
```

Sau logout:

```text
clear current session
→ redirect Login
```

Không xóa Todo.

---

# 4. Local Storage

Dùng browser storage.

Khuyến nghị:

```text
localStorage
```

hoặc tốt hơn nếu muốn app lớn:

```text
IndexedDB
```

Với project này, có thể bắt đầu bằng localStorage.

---

# 5. Data Model

## 5.1 User

```ts
User {
    id: string
    username: string
    password: string
    createdAt: string
}
```

> Nếu chỉ là project cá nhân/demo, có thể lưu password trực tiếp. Nếu muốn thực hành tốt hơn, hash password trước khi lưu.

## 5.2 Todo

```ts
Todo {
    id: string

    userId: string

    title: string
    description?: string

    date: string

    startTime?: string
    endTime?: string

    allDay: boolean

    priority: Priority

    categoryId?: string

    completed: boolean

    completedAt?: string

    reminder?: Reminder

    recurrence?: Recurrence

    deadline?: string

    tags?: string[]

    subtasks?: Subtask[]

    createdAt: string
    updatedAt: string
}
```

## 5.3 Category

```ts
Category {
    id: string
    userId: string
    name: string
    color: string
    icon?: string
}
```

## 5.4 Subtask

```ts
Subtask {
    id: string
    title: string
    completed: boolean
}
```

---

# 6. Priority

Có 4 mức:

```text
None
Low
Medium
High
```

Ví dụ:

```text
🔴 High
🟡 Medium
🔵 Low
⚪ None
```

Todo phải có visual khác nhau theo priority.

---

# 7. Category

User có thể tạo category.

Ví dụ:

```text
Work
Study
Personal
Exercise
Project
Meeting
```

Category có:

- Name
- Color
- Optional icon

---

# 8. Category Management

User có thể:

```text
Create Category
Edit Category
Delete Category
```

Ví dụ:

```text
+ Add Category

📚 Study
💼 Work
🏠 Personal
🏋 Exercise
```

---

# 9. Category Filter

Có thể filter:

```text
All
Study
Work
Personal
Exercise
```

Cho phép chọn nhiều category:

```text
☑ Study
☑ Work
☐ Personal
```

Calendar chỉ hiển thị Todo phù hợp với filter.

---

# 10. Todo Creation

Có nhiều cách tạo Todo.

## 10.1 New Todo Button

```text
+ New Todo
```

Modal:

```text
Title
Description

Date
Start time
End time

Priority
Category

Deadline
Reminder
Repeat
Tags

[Cancel] [Create]
```

## 10.2 Quick Add

Có input:

```text
What do you need to do?
```

Ví dụ:

```text
Study Node.js
```

→ tạo Todo.

## 10.3 Natural Text Input

Có thể hỗ trợ nhập đơn giản:

```text
Study Node.js tomorrow
Meeting at 14:00
Finish report Friday 18:00
```

Parser cố gắng nhận diện:

```text
title
date
time
```

Nếu không nhận diện được thì toàn bộ input được coi là title.

Không cần AI/backend.

---

# 11. Calendar

Calendar là phần quan trọng nhất của app.

Phải có:

```text
Month
Week
Day
Agenda
```

---

# 12. Month View

Ví dụ:

```text
        October 2026

Mon Tue Wed Thu Fri Sat Sun
                 1   2   3   4
 5   6   7   8   9  10  11
12  13  14  15  16  17  18
19  20  21  22  23  24  25
26  27  28  29  30  31
```

Todo hiển thị trong ngày.

Ví dụ:

```text
13

🔴 Finish project
🟡 Study Node.js
🔵 Gym
```

Nếu quá nhiều:

```text
+ 3 more
```

Click ngày:

```text
13
```

→ mở Day View.

---

# 13. Week View

Hiển thị:

```text
        Mon  Tue  Wed  Thu  Fri  Sat  Sun
08:00
09:00
10:00
11:00
...
18:00
```

Todo nằm đúng vị trí theo thời gian.

Ví dụ:

```text
09:00 ───────────────

        ┌───────────────┐
        │ Study Node.js │
        │ High          │
        └───────────────┘

10:00 ───────────────
```

---

# 14. Day View

Hiển thị riêng một ngày.

```text
Monday, October 5

08:00
09:00
10:00
11:00
...
23:00
```

Todo hiển thị theo timeline.

Có:

```text
Previous Day
Today
Next Day
```

---

# 15. Today

Có button:

```text
Today
```

Click:

```text
Calendar → current date
```

---

# 16. Date Navigation

Có:

```text
< Previous
Today
Next >
```

Và date picker:

```text
October 4, 2026
```

Click → chọn ngày.

---

# 17. Drag & Drop

Đây là feature quan trọng.

## 17.1 Calendar → Calendar

User kéo Todo:

```text
Monday 10:00
```

sang:

```text
Tuesday 14:00
```

Todo tự động update:

```text
date = Tuesday
startTime = 14:00
```

## 17.2 Resize Todo

Trong Week/Day view, kéo cạnh dưới Todo để thay đổi thời lượng.

Ví dụ:

```text
14:00
┌─────────────┐
│ Meeting     │
│             │
└─────────────┘
       ↓
15:30
```

→ endTime = 15:30.

## 17.3 Create bằng Drag

User kéo từ:

```text
10:00
```

đến:

```text
12:00
```

→ mở Create Todo modal với:

```text
Start = 10:00
End = 12:00
Date = selected date
```

User nhập title → Create.

## 17.4 Quick Create trên Calendar

Double click vào một time slot:

```text
Double click 14:00
```

→ Create Todo modal mở với:

```text
Date = selected date
Start = 14:00
```

---

# 18. All-day Todo

Todo có:

```text
☑ All day
```

Ví dụ:

```text
🎂 Birthday
📌 Submit assignment
📅 Deadline
```

Hiển thị phía trên timeline.

---

# 19. Todo Detail

Click Todo:

```text
┌─────────────────────────────┐
│ Study Node.js               │
│                             │
│ 📅 Oct 5                    │
│ 🕐 14:00 - 16:00            │
│ 🔴 High                     │
│ 📚 Study                    │
│                             │
│ Description                 │
│ Learn Event Loop            │
│                             │
│ 🔔 10 minutes before        │
│ 🔁 Does not repeat          │
│                             │
│ [Edit] [Complete] [Delete] │
└─────────────────────────────┘
```

---

# 20. Edit Todo

Có thể sửa:

```text
Title
Description
Date
Start time
End time
Priority
Category
Deadline
Reminder
Recurrence
Tags
Subtasks
```

---

# 21. Complete Todo

Todo:

```text
☐ Study Node.js
```

Click:

```text
☑ Study Node.js
```

Visual:

```text
line-through
reduced opacity
```

Không xóa Todo.

---

# 22. Uncomplete

Todo đã complete có thể click lại:

```text
☑ → ☐
```

---

# 23. Delete Todo

Delete phải có confirmation:

```text
Delete this task?

[Cancel] [Delete]
```

---

# 24. Undo Delete

Sau khi delete:

```text
Todo deleted

[Undo]
```

Toast tồn tại khoảng 5 giây.

---

# 25. Recurring Todo

Có:

```text
Repeat:
Never

Daily
Weekly
Monthly
Yearly
Custom
```

## Custom Recurrence

Ví dụ:

```text
Every 2 weeks
```

hoặc:

```text
Monday
Wednesday
Friday
```

Có:

```text
Repeat until:
Never
Date
```

## Recurring Behavior

Ví dụ:

```text
Gym
Every Monday, Wednesday, Friday
```

Khi complete một occurrence:

```text
chỉ occurrence đó complete
```

Không complete toàn bộ recurring series.

---

# 26. Reminder

Có thể chọn:

```text
No reminder
At time
5 minutes before
10 minutes before
15 minutes before
30 minutes before
1 hour before
1 day before
```

Có thể dùng Browser Notification API nếu user cấp permission.

### Limitation

Vì không có backend:

- Reminder phụ thuộc vào browser.
- Không đảm bảo notification khi browser/app bị đóng hoàn toàn.
- Phải giải thích rõ limitation này trong Settings.

---

# 27. Search

Có search bar:

```text
🔍 Search tasks...
```

Search:

- title
- description
- category
- tags

Ví dụ:

```text
Search: node
```

→

```text
Study Node.js
Learn Node Event Loop
Node API
```

---

# 28. Filter

Có filter:

```text
Status
Priority
Category
Date
```

## Status

```text
All
Completed
Incomplete
Overdue
```

## Priority

```text
All
High
Medium
Low
None
```

## Category

```text
All
Study
Work
Personal
...
```

Có thể kết hợp nhiều filter.

Ví dụ:

```text
Category = Work
Priority = High
Status = Incomplete
```

---

# 29. Sort

Cho phép:

```text
Time
Priority
Created date
Alphabetical
```

Ví dụ:

```text
Priority ↓
```

---

# 30. Overdue

Todo quá hạn phải được nhận diện.

Ví dụ:

```text
⚠ Overdue
```

Có filter:

```text
Overdue
```

---

# 31. Upcoming

Có section:

```text
Upcoming
```

Hiển thị:

```text
Today
Tomorrow
This week
Next week
```

---

# 32. Dashboard

Layout đề xuất:

```text
┌─────────────────────────────────────────────────────────┐
│ Todo Calendar                            🔍   👤        │
├─────────────┬───────────────────────────────────────────┤
│             │                                           │
│ + New Todo  │              October 2026                │
│             │                                           │
│ Calendar    │        Calendar                          │
│ Today       │                                           │
│ Upcoming    │                                           │
│             │                                           │
│ Categories  │                                           │
│ 📚 Study    │                                           │
│ 💼 Work     │                                           │
│ 🏠 Personal │                                           │
│             │                                           │
│ Settings    │                                           │
└─────────────┴───────────────────────────────────────────┘
```

---

# 33. Sidebar

Sidebar:

```text
Dashboard

Calendar
Today
Upcoming

Categories
  Study
  Work
  Personal

────────────

Completed

Statistics

────────────

Settings
```

---

# 34. Today Page

Hiển thị:

```text
Today
October 4, 2026

Completed: 3 / 7
```

Sau đó:

```text
All day
────────────
📌 Submit report

Timeline
────────────
09:00  Meeting
11:00  Study
14:00  Gym
```

---

# 35. Upcoming Page

Ví dụ:

```text
Tomorrow

Monday
────────────
Study Node.js
Meeting

Tuesday
────────────
Gym

Wednesday
────────────
Submit report
```

---

# 36. Completed Page

Hiển thị Todo đã hoàn thành:

```text
Completed today
Completed yesterday
Completed this week
```

Có thể:

```text
Restore
Delete permanently
```

---

# 37. Statistics

Trang Statistics:

```text
Tasks completed

Today       5
This week  28
This month 94
```

Completion rate:

```text
72%
```

Category:

```text
Study       35%
Work        40%
Personal    25%
```

Priority:

```text
High
Medium
Low
```

Productivity statistics:

```text
Tasks created
Tasks completed
Tasks overdue
Completion rate
Current streak
Longest streak
```

Ví dụ:

```text
🔥 7 day streak
```

---

# 38. Empty States

Không để màn hình trắng.

Today không có Todo:

```text
🎉 Nothing scheduled today.

Enjoy your free time!
```

Calendar không có task:

```text
No tasks

Drag on the calendar to create one.
```

---

# 39. Toast Notification

Các action phải có feedback:

```text
Todo created
Todo updated
Todo deleted
Todo completed
Category created
```

---

# 40. Confirmation

Các action nguy hiểm phải confirmation:

```text
Delete Todo
Delete Category
Clear all data
```

---

# 41. Category Delete Behavior

Nếu category đang được sử dụng:

```text
Delete "Work"?

12 tasks currently use this category.

○ Keep tasks but remove category
○ Delete associated tasks

[Cancel] [Delete]
```

Khuyến nghị mặc định:

```text
Keep tasks but remove category
```

---

# 42. Settings

Settings gồm:

```text
Appearance
Notifications
Calendar
Data
Account
```

---

# 43. Appearance

```text
Theme

○ Light
○ Dark
○ System
```

---

# 44. Calendar Settings

```text
First day of week:
Monday / Sunday

Time format:
12-hour / 24-hour

Default calendar view:
Month / Week / Day

Week start:
Monday
```

---

# 45. Default Todo Duration

Khi drag/click tạo task:

```text
Default duration:
30 minutes
```

Options:

```text
15
30
45
60
90
120
```

---

# 46. Working Hours

Cho phép:

```text
Working hours

08:00 ─ 18:00
```

Calendar có thể highlight vùng ngoài working hours.

---

# 47. Data Management

Vì app không có backend, đây là tính năng rất quan trọng.

Settings:

```text
Data

Export Data
Import Data
Clear All Data
```

---

# 48. Export

Cho phép export:

```text
todo-backup-2026-10-04.json
```

Bao gồm:

```text
Todos
Categories
Settings
```

Không nên export password nếu không cần.

---

# 49. Import

User chọn:

```text
Import JSON
```

→ validate file.

Nếu hợp lệ:

```text
Import successful
```

Nếu lỗi:

```text
Invalid backup file
```

---

# 50. Clear Data

Có:

```text
Clear all application data
```

Confirmation 2 bước:

```text
This will permanently delete all your data.

Type DELETE to confirm.
```

---

# 51. Multi-user

Support:

```text
User A
    ├── Todo
    ├── Categories
    └── Settings

User B
    ├── Todo
    ├── Categories
    └── Settings
```

User A không được nhìn thấy Todo của User B.

Mọi entity phải có:

```ts
userId
```

---

# 52. Storage Design

Có thể lưu:

```text
todo-app-users
todo-app-session
todo-app-todos
todo-app-categories
todo-app-settings
```

Hoặc:

```text
todo-app
{
    users: [],
    sessions: [],
    todos: [],
    categories: [],
    settings: []
}
```

---

# 53. ID

Không dùng array index làm ID.

Dùng:

```ts
crypto.randomUUID()
```

---

# 54. Date Handling

Thống nhất format.

Date:

```text
YYYY-MM-DD
```

Time:

```text
HH:mm
```

Datetime:

```text
ISO 8601
```

Ví dụ:

```text
2026-10-04
14:30
2026-10-04T14:30:00
```

Đặc biệt tránh bug timezone.

---

# 55. Responsive

Web phải hoạt động trên:

```text
Desktop
Tablet
Mobile
```

Desktop:

```text
Sidebar + Calendar
```

Mobile:

```text
Bottom navigation
Calendar
Floating + button
```

---

# 56. Mobile UX

Mobile có thể ưu tiên:

```text
Month
Day
Agenda
```

Week View có thể horizontal scroll.

---

# 57. Keyboard Shortcuts

Nên có:

```text
N       New Todo
T       Go to Today
/       Search
Esc     Close modal
← →     Previous / Next date
```

---

# 58. Accessibility

Phải hỗ trợ:

- Keyboard navigation.
- Focus states.
- Semantic HTML.
- ARIA labels.
- Đủ contrast.
- Không phụ thuộc hoàn toàn vào màu sắc.

---

# 59. Undo

Các thao tác có thể undo:

```text
Delete Todo
Complete Todo
Move Todo
```

Ít nhất phải có:

```text
Delete → Undo
```

---

# 60. Conflict / Overlap

Không nhất thiết cấm Todo overlap.

Ví dụ:

```text
Todo A
14:00–16:00

Todo B
14:30–15:30
```

Cho phép overlap nhưng có thể cảnh báo:

```text
⚠ This task overlaps with another task.
```

User vẫn có thể save.

---

# 61. Timezone

Settings:

```text
Timezone
```

Mặc định:

```text
Browser timezone
```

Không cần server timezone.

---

# 62. First Launch

Lần đầu mở app:

```text
Welcome to Todo Calendar

Manage your tasks visually.

[Get Started]
```

Sau đó:

```text
Create account
```

---

# 63. Onboarding

Có thể tạo sample data:

```text
📚 Study Node.js
💼 Finish report
🏋 Workout
```

User chọn:

```text
Create sample tasks
Skip
```

---

# 64. Error Handling

Các lỗi phải có UI rõ ràng.

Ví dụ:

```text
Unable to save task.

Your browser storage may be full.
```

Không để app crash.

---

# 65. Storage Limit

Nếu localStorage đầy:

```text
Storage quota exceeded
```

Hiển thị:

```text
Your browser storage is full.
Please export your data and remove unnecessary data.
```

---

# 66. Data Persistence

Reload page:

```text
F5
```

→ data vẫn còn.

Đóng browser → mở lại:

```text
data vẫn còn
```

---

# 67. No Backend Requirement

Architecture:

```text
Frontend
   │
   ├── React
   ├── State Management
   ├── Calendar
   └── Storage Service
           │
           └── localStorage / IndexedDB
```

Không cần:

```text
Node.js
Express
NestJS
PostgreSQL
MongoDB
API
Authentication Server
```

---

# 68. Recommended Frontend Architecture

Nếu dùng React/Next.js:

```text
src/
│
├── app/
│
├── components/
│   ├── calendar/
│   ├── todo/
│   ├── category/
│   ├── layout/
│   ├── modal/
│   └── ui/
│
├── features/
│   ├── auth/
│   ├── todos/
│   ├── categories/
│   ├── calendar/
│   └── statistics/
│
├── hooks/
│
├── services/
│   ├── storage/
│   └── notification/
│
├── types/
│
├── utils/
│
└── constants/
```

---

# 69. State Management

Global state cần quản lý:

```text
currentUser
todos
categories
filters
calendarDate
calendarView
settings
```

Có thể dùng:

```text
Zustand
```

hoặc Context nếu muốn đơn giản.

---

# 70. Storage Service

Không để component trực tiếp gọi:

```ts
localStorage.setItem(...)
```

khắp nơi.

Tạo:

```text
storageService
```

Ví dụ:

```text
userStorage
todoStorage
categoryStorage
settingsStorage
```

Architecture:

```text
UI
 ↓
Store
 ↓
Service
 ↓
localStorage
```

Điều này giúp sau này đổi sang backend dễ hơn.

---

# 71. Todo Service

Các operation:

```ts
createTodo()
updateTodo()
deleteTodo()
completeTodo()
restoreTodo()
moveTodo()
duplicateTodo()
```

---

# 72. Calendar Service

Các operation:

```ts
getTodosForDate()
getTodosForWeek()
getTodosForMonth()
moveTodo()
resizeTodo()
```

---

# 73. Duplicate Todo

Context menu:

```text
Edit
Duplicate
Complete
Delete
```

Duplicate:

```text
Study Node.js
```

→

```text
Study Node.js (Copy)
```

---

# 74. Context Menu

Right click Todo:

```text
Edit
Duplicate
Mark as completed
Change priority
Move to...
Delete
```

---

# 75. Move Todo

Cho phép:

```text
Move to today
Move to tomorrow
Move to specific date
```

---

# 76. Copy Todo

Cho phép:

```text
Copy to another date
```

Ví dụ:

```text
Copy "Study Node.js"
→ October 10
```

---

# 77. Bulk Actions

Khi list nhiều Todo:

```text
☑ Task A
☑ Task B
☑ Task C
```

Actions:

```text
Complete selected
Delete selected
Change category
Change priority
```

---

# 78. List / Agenda View

Ngoài Calendar nên có:

```text
List / Agenda
```

Ví dụ:

```text
Today

☐ 09:00 Meeting
☐ 11:00 Study
☑ 14:00 Gym
```

Điều này hữu ích khi có nhiều Todo.

---

# 79. Calendar View Switch

Top bar:

```text
Month | Week | Day | Agenda
```

---

# 80. Filter Indicator

Nếu đang filter:

```text
🔍 3 filters active
```

Có:

```text
Clear filters
```

---

# 81. Scheduled Time vs Deadline

Nên phân biệt:

```text
Scheduled:
14:00–16:00

Deadline:
October 10, 23:59
```

Điều này giúp Todo có cả thời gian thực hiện và deadline độc lập.

---

# 82. Subtasks

Một Todo có thể có checklist:

```text
Finish project

☑ Design database
☑ Implement API
☐ Write tests
☐ Deploy
```

Progress:

```text
2 / 4 completed
```

---

# 83. Notes / Description

Todo có Description multiline.

Ví dụ:

```text
Need to review:
- Event loop
- Promise
- Worker threads
```

---

# 84. Tags

Ngoài Category có thể thêm tag:

```text
#backend
#urgent
#exam
#project
```

Category dùng để phân loại chính.

Tag dùng để search/filter linh hoạt.

---

# 85. Smart Today

Today page nên ưu tiên:

```text
Overdue
↓
High priority
↓
Scheduled time
```

Ví dụ:

```text
⚠ Overdue
🔴 High priority
🟡 Medium
🔵 Low
```

---

# 86. Productivity Features

Có thể thêm:

## Daily goal

```text
Daily goal: 5 tasks

████████░░ 4/5
```

## Streak

```text
🔥 5 days
```

## Completion rate

```text
78%
```

Không cần quá phức tạp.

---

# 87. Focus Mode

Feature tùy chọn:

```text
Focus
```

Click một Todo:

```text
┌──────────────────────┐
│                      │
│    Study Node.js     │
│                      │
│       25:00          │
│                      │
│     [ Start ]        │
│                      │
└──────────────────────┘
```

Pomodoro:

```text
25 min work
5 min break
```

Có thể làm phase 2.

---

# 88. PWA

Có thể thêm:

- manifest
- service worker
- offline support
- installable app

Đây là **nice-to-have**, không bắt buộc MVP.

---

# 89. Offline

Vì data nằm local:

```text
Internet OFF
```

→ app vẫn hoạt động.

---

# 90. Security Note

Phải có disclaimer:

```text
This application stores data locally in the browser.
There is no server-side authentication or encryption.
Do not use it for sensitive information.
```

---

# 91. MVP

Không nên vibe code toàn bộ ngay từ đầu.

## Phase 1 — Core

```text
Authentication
Todo CRUD
localStorage
Category
Priority
```

## Phase 2 — Calendar

```text
Month Calendar
Day Calendar
Week Calendar
```

## Phase 3 — Interaction

```text
Drag & Drop
Resize
Quick Create
```

## Phase 4 — Productivity

```text
Search
Filter
Sort
Agenda
Today
Upcoming
```

## Phase 5 — Advanced Todo

```text
Recurring Todo
Reminder
Notification
Subtasks
Deadline
Tags
```

## Phase 6 — Data & Analytics

```text
Statistics
Export
Import
Backup
```

## Phase 7 — Polish

```text
Dark mode
Responsive
Keyboard shortcuts
PWA
Focus mode
Accessibility
```

---

# 92. Definition of Done

## Authentication

- [ ] Register
- [ ] Login
- [ ] Logout
- [ ] Multiple users
- [ ] User data isolation

## Todo

- [ ] Create
- [ ] Edit
- [ ] Delete
- [ ] Complete
- [ ] Restore
- [ ] Duplicate
- [ ] Description
- [ ] Priority
- [ ] Category
- [ ] Subtasks
- [ ] Deadline
- [ ] Reminder
- [ ] Recurrence
- [ ] Tags

## Calendar

- [ ] Month
- [ ] Week
- [ ] Day
- [ ] Agenda
- [ ] Today
- [ ] Previous
- [ ] Next
- [ ] Date picker
- [ ] All-day Todo
- [ ] Drag Todo
- [ ] Drop Todo
- [ ] Resize Todo
- [ ] Drag to create Todo
- [ ] Double-click to create Todo

## Search / Filter

- [ ] Search
- [ ] Category filter
- [ ] Priority filter
- [ ] Status filter
- [ ] Date filter
- [ ] Multiple filters
- [ ] Clear filters
- [ ] Sort

## UX

- [ ] Toast
- [ ] Confirmation
- [ ] Undo
- [ ] Empty state
- [ ] Loading state
- [ ] Error state
- [ ] Responsive
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Accessibility

## Data

- [ ] Persistent storage
- [ ] Export JSON
- [ ] Import JSON
- [ ] Clear data
- [ ] Storage error handling

## Statistics

- [ ] Completed count
- [ ] Completion rate
- [ ] Overdue count
- [ ] Category statistics
- [ ] Priority statistics
- [ ] Streak

---

# 93. Final UI Layout

```text
┌────────────────────────────────────────────────────────────────────┐
│ ☑ Todo Calendar       🔍 Search        + New Todo    🔔   👤       │
├───────────────┬────────────────────────────────────────────────────┤
│               │                                                    │
│ Dashboard     │  October 2026                    Month Week Day    │
│               │                                                    │
│ 📅 Calendar   │  <     Today     >                                │
│ 📌 Today      │                                                    │
│ 📋 Upcoming   │  Mon  Tue  Wed  Thu  Fri  Sat  Sun               │
│               │  ───────────────────────────────────────────────   │
│ Categories    │                                                    │
│               │  Calendar                                         │
│ 📚 Study      │                                                    │
│ 💼 Work       │  Tasks displayed here                             │
│ 🏠 Personal   │                                                    │
│               │                                                    │
│ ✓ Completed   │                                                    │
│ 📊 Statistics │                                                    │
│               │                                                    │
│ ⚙ Settings    │                                                    │
│               │                                                    │
└───────────────┴────────────────────────────────────────────────────┘
```

---

# 94. Master Prompt cho Vibe Coding

```text
Build a production-quality frontend-only Todo Calendar web application using React/Next.js and TypeScript.

The application must not require a backend. All user, todo, category, settings and session data must persist locally in the browser using a dedicated storage service abstraction.

The application must support multiple local users with username/password authentication. Each user's data must be isolated by userId.

The application must provide full Todo CRUD, completion/restore, duplicate, subtasks, descriptions, priorities, categories, tags, deadlines, reminders and recurring tasks.

The core UI must be a calendar application supporting Month, Week, Day and Agenda views.

Users must be able to:

- create Todo from a New Todo button
- create Todo by double-clicking a calendar time slot
- create Todo by dragging across a time range
- drag Todo between dates/times
- resize Todo duration
- edit Todo
- mark Todo complete
- delete Todo
- undo deletion
- create all-day Todo

Implement search, category filtering, priority filtering, completion filtering, overdue filtering, multi-filter combinations and sorting.

Provide Today, Upcoming and Completed pages.

Provide Category management with category name, color and optional icon.

Provide recurring Todo support including daily, weekly, monthly, yearly and custom recurrence. Completing one occurrence must not automatically complete the entire recurring series.

Provide browser notification reminders where supported. Clearly communicate that browser-only reminders are not guaranteed when the browser is completely closed.

Provide Statistics including completed tasks, completion rate, overdue tasks, category distribution, priority distribution and streaks.

Provide Settings for theme, calendar preferences, time format, first day of week, default Todo duration, working hours and notifications.

Provide data management including JSON export, JSON import and complete data deletion with confirmation.

Provide responsive desktop, tablet and mobile layouts.

Implement dark/light/system themes.

Implement keyboard shortcuts such as:

- N = new Todo
- T = today
- / = search
- Escape = close modal

Use semantic HTML and accessible components.

All destructive actions must require confirmation.

Show toast notifications for important actions.

Provide useful empty states and error states.

Use a clean modern productivity-app UI inspired by applications such as Google Calendar, Todoist and Notion, but do not copy their branding or exact UI.

Keep the architecture modular. Components must not directly manipulate localStorage. All persistence must go through a storage/repository layer.

Separate:

- UI components
- business logic
- state management
- storage layer
- calendar logic
- authentication logic
- notification logic

Use TypeScript types for all entities.

Use UUIDs instead of array indexes as entity IDs.

Store dates consistently using YYYY-MM-DD and times using HH:mm. Carefully avoid timezone-related bugs.

The application must continue working after page reload and without an internet connection.

Do not implement a fake backend or unnecessary API routes.

Before coding, create the project architecture and data models. Then implement the application incrementally in the following order:

1. Project setup and UI foundation
2. Storage layer
3. Authentication
4. Todo CRUD
5. Categories and priorities
6. Calendar Month view
7. Day/Week views
8. Drag and drop
9. Search/filter
10. Recurring tasks
11. Reminders
12. Statistics
13. Import/export
14. Responsive/mobile UI
15. Accessibility and keyboard shortcuts
16. Final testing and bug fixing

Do not skip core functionality in favor of visual polish. Keep the code maintainable and avoid putting the entire application into one or two large components.
```


---

# 95. Recommended Tech Stack

Project sử dụng **React + TypeScript** và frontend-only.

## Core

```text
React
TypeScript
Vite
```

Không cần Next.js vì project không có backend, SSR hoặc SEO requirement đáng kể.

## UI

```text
Tailwind CSS
shadcn/ui
Lucide React
```

## State Management

```text
Zustand
```

## Forms & Validation

```text
React Hook Form
Zod
```

## Calendar

```text
FullCalendar
```

## Date / Time

```text
date-fns
```

## Notifications / Toast

```text
Sonner
```

## Statistics

```text
Recharts
```

## Storage

MVP:

```text
localStorage
```

Optional khi project lớn hơn:

```text
Dexie
IndexedDB
```

---

# 96. Recommended Libraries

## 96.1 FullCalendar

FullCalendar là thư viện chính cho calendar.

Sử dụng để hỗ trợ:

```text
Month View
Week View
Day View
Agenda / List View
All-day events
Event click
Event selection
Event drag
Event resize
Date navigation
```

Các interaction chính cần tận dụng:

```text
eventDrop
eventResize
dateClick
select
eventClick
```

Không tự xây calendar engine từ đầu.

Mục tiêu của project là xây dựng Todo application, không phải xây dựng một calendar library.

---

# 97. Drag & Drop Strategy

Ưu tiên sử dụng interaction có sẵn của FullCalendar.

### Phase MVP

```text
FullCalendar
    ↓
eventDrop
eventResize
select
dateClick
```

Đáp ứng:

```text
Drag Todo
Move Todo
Resize Todo
Drag để tạo Todo
Click để tạo Todo
```

### dnd-kit

Có thể sử dụng:

```text
dnd-kit
```

chỉ khi cần custom drag & drop ngoài khả năng của FullCalendar.

Ví dụ:

```text
Todo List
    ↓ drag
Calendar

Sidebar
    ↓ drag
Calendar

Kanban
    ↓ drag
Calendar
```

Không cài dnd-kit nếu FullCalendar đã đáp ứng đầy đủ requirement.

---

# 98. State Management — Zustand

Dùng Zustand để quản lý global state.

Recommended stores:

```text
stores/
├── auth.store.ts
├── todo.store.ts
├── category.store.ts
├── calendar.store.ts
├── filter.store.ts
└── settings.store.ts
```

## Auth Store

Quản lý:

```text
currentUser
isAuthenticated
login()
register()
logout()
```

## Todo Store

Quản lý:

```text
todos
createTodo()
updateTodo()
deleteTodo()
completeTodo()
restoreTodo()
moveTodo()
resizeTodo()
duplicateTodo()
```

## Calendar Store

Quản lý:

```text
currentDate
currentView
setDate()
setView()
next()
previous()
goToToday()
```

## Filter Store

Quản lý:

```text
search
status
priority
categories
tags
dateRange
sort
```

## Settings Store

Quản lý:

```text
theme
timeFormat
firstDayOfWeek
defaultCalendarView
defaultTodoDuration
workingHours
notifications
timezone
```

---

# 99. Form — React Hook Form + Zod

Không quản lý một Todo form lớn bằng quá nhiều `useState`.

Sử dụng:

```text
React Hook Form
        +
Zod
```

Todo form có thể có:

```text
title
description
date
startTime
endTime
allDay
priority
categoryId
deadline
reminder
recurrence
tags
subtasks
```

Validation nằm trong schema.

Recommended:

```text
schemas/
├── auth.schema.ts
├── todo.schema.ts
├── category.schema.ts
└── settings.schema.ts
```

Ví dụ:

```ts
todoSchema
```

phải kiểm tra:

- title không rỗng.
- title không vượt quá giới hạn hợp lý.
- endTime không trước startTime.
- deadline hợp lệ.
- recurrence hợp lệ.
- category tồn tại.
- priority hợp lệ.

---

# 100. Date & Time — date-fns

Dùng `date-fns` thay vì tự viết date utility.

Các operation thường dùng:

```text
isToday()
isTomorrow()
isBefore()
isAfter()

startOfDay()
endOfDay()

startOfWeek()
endOfWeek()

startOfMonth()
endOfMonth()

addDays()
subDays()

addWeeks()
subWeeks()

addMonths()
subMonths()

format()
parse()
```

Không nên tự implement các logic calendar phức tạp.

---

# 101. UI — Tailwind CSS

Tailwind dùng cho:

```text
layout
spacing
responsive
dark mode
typography
colors
states
animations
calendar wrappers
sidebar
mobile navigation
```

Không để styling rải rác bằng inline style nếu không cần.

---

# 102. UI Components — shadcn/ui

Dùng shadcn/ui cho các component cơ bản:

```text
Button
Input
Textarea
Checkbox
Select
Popover
Dialog
AlertDialog
DropdownMenu
Tooltip
Tabs
Sheet
Command
Calendar
Badge
Card
Separator
```

Đặc biệt:

### Dialog

Dùng cho:

```text
Create Todo
Edit Todo
Todo Detail
Create Category
Edit Category
```

### AlertDialog

Dùng cho:

```text
Delete Todo
Delete Category
Clear Data
```

### Sheet

Dùng cho mobile:

```text
Sidebar
Todo Detail
Filter panel
```

### Command

Có thể dùng làm:

```text
Global Search
Quick Actions
Command Palette
```

---

# 103. Icons — Lucide React

Dùng Lucide React cho icon.

Ví dụ:

```text
Plus
Trash
Pencil
Calendar
Search
Settings
ChevronLeft
ChevronRight
Check
Filter
MoreVertical
Bell
Clock
Tag
Repeat
Circle
CircleCheck
```

Không trộn quá nhiều icon library.

---

# 104. Toast — Sonner

Dùng Sonner cho feedback.

Ví dụ:

```text
Todo created
Todo updated
Todo deleted
Todo completed
Category created
Import successful
Export successful
```

Error:

```text
Failed to save todo
Invalid backup file
Storage quota exceeded
```

Các toast không nên thay thế validation hoặc confirmation dialog.

---

# 105. Statistics — Recharts

Statistics có thể dùng Recharts.

Các chart:

```text
Tasks completed per day
Tasks by category
Tasks by priority
Completion rate
```

Không cần chart cho mọi metric.

Một số thông tin nên hiển thị bằng Card:

```text
Completed today
Overdue
Completion rate
Current streak
Longest streak
```

---

# 106. Storage Architecture

Không cho component gọi trực tiếp:

```ts
localStorage.getItem()
localStorage.setItem()
localStorage.removeItem()
```

Từ component.

Thay vào đó:

```text
React Component
       ↓
Zustand Store
       ↓
Repository
       ↓
Storage Adapter
       ↓
localStorage / IndexedDB
```

Recommended structure:

```text
repositories/
├── user.repository.ts
├── todo.repository.ts
├── category.repository.ts
└── settings.repository.ts

services/
└── storage/
    ├── storage.adapter.ts
    └── local-storage.adapter.ts
```

---

# 107. Repository Pattern

Repository chịu trách nhiệm truy cập data.

Ví dụ:

```ts
todoRepository.findByUser(userId)

todoRepository.findById(todoId)

todoRepository.create(todo)

todoRepository.update(todoId, data)

todoRepository.delete(todoId)
```

Store không cần biết data được lưu bằng localStorage hay IndexedDB.

---

# 108. Storage Adapter

Thiết kế abstraction:

```ts
interface StorageAdapter {
    get<T>(key: string): T | null
    set<T>(key: string, value: T): void
    remove(key: string): void
    clear(): void
}
```

MVP:

```text
LocalStorageAdapter
```

Sau này:

```text
IndexedDBAdapter
```

có thể thay thế mà không cần viết lại UI.

---

# 109. Local Storage Keys

Nếu dùng localStorage, thống nhất key:

```text
todo-app:users
todo-app:session
todo-app:todos
todo-app:categories
todo-app:settings
```

Không dùng key ngẫu nhiên rải rác trong code.

---

# 110. Data Versioning

Storage nên có version để sau này thay đổi schema.

Ví dụ:

```ts
{
    version: 1,
    data: [...]
}
```

Nếu schema thay đổi:

```text
version 1
    ↓ migration
version 2
```

Không nên giả định dữ liệu localStorage luôn có schema mới nhất.

---

# 111. Authentication Architecture

Authentication chỉ là local authentication.

Flow:

```text
Register
   ↓
Validate
   ↓
Create User
   ↓
Save User
   ↓
Create Session
   ↓
Dashboard
```

Login:

```text
Login
   ↓
Find User
   ↓
Verify Password
   ↓
Create Session
   ↓
Dashboard
```

Logout:

```text
Logout
   ↓
Remove Session
   ↓
Login Page
```

---

# 112. Local Authentication Security

Phải hiểu rằng:

```text
local authentication ≠ real authentication
```

Không có:

```text
server
database
secure session
HTTP-only cookie
server-side authorization
```

Nếu lưu password cho demo, đây chỉ là simulated/local authentication.

Nếu muốn thực hành tốt hơn:

```text
password
   ↓
hash
   ↓
local storage
```

Nhưng ngay cả password hash trên client cũng không biến ứng dụng thành authentication system an toàn.

---

# 113. Feature Services

Business logic phức tạp nên tách khỏi UI.

Recommended:

```text
services/
├── storage/
├── notification.service.ts
├── recurrence.service.ts
├── parser.service.ts
├── statistics.service.ts
└── export.service.ts
```

## recurrence.service

Xử lý:

```text
Daily
Weekly
Monthly
Yearly
Custom
```

## parser.service

Xử lý Quick Add:

```text
Study Node.js tomorrow
Meeting at 14:00
Finish report Friday 18:00
```

## statistics.service

Tính:

```text
completed count
overdue count
completion rate
streak
category distribution
priority distribution
```

---

# 114. Recommended Folder Structure

```text
src/
│
├── app/
│   ├── App.tsx
│   ├── routes.tsx
│   └── providers.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── todo/
│   ├── calendar/
│   ├── category/
│   ├── filter/
│   └── statistics/
│
├── features/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── auth.utils.ts
│   │
│   ├── todos/
│   ├── categories/
│   ├── calendar/
│   └── statistics/
│
├── stores/
│   ├── auth.store.ts
│   ├── todo.store.ts
│   ├── category.store.ts
│   ├── calendar.store.ts
│   ├── filter.store.ts
│   └── settings.store.ts
│
├── repositories/
│   ├── user.repository.ts
│   ├── todo.repository.ts
│   ├── category.repository.ts
│   └── settings.repository.ts
│
├── services/
│   ├── storage/
│   │   ├── storage.adapter.ts
│   │   └── local-storage.adapter.ts
│   ├── notification.service.ts
│   ├── recurrence.service.ts
│   ├── parser.service.ts
│   ├── statistics.service.ts
│   └── export.service.ts
│
├── schemas/
│   ├── auth.schema.ts
│   ├── todo.schema.ts
│   ├── category.schema.ts
│   └── settings.schema.ts
│
├── types/
│   ├── user.ts
│   ├── todo.ts
│   ├── category.ts
│   ├── recurrence.ts
│   └── calendar.ts
│
├── hooks/
│
├── utils/
│
├── constants/
│
└── styles/
```

Không bắt buộc phải copy chính xác structure này nếu project phát triển theo hướng khác, nhưng phải giữ separation of concerns.

---

# 115. Separation of Concerns

Không để một component làm tất cả:

```text
CalendarPage.tsx
```

không nên chứa:

```text
UI
Todo CRUD
localStorage
recurrence
filter
date calculation
notification
statistics
```

Thay vào đó:

```text
UI
 ↓
Hook / Store
 ↓
Service
 ↓
Repository
 ↓
Storage
```

---

# 116. Calendar Architecture

Calendar component chịu trách nhiệm chủ yếu về:

```text
render
user interaction
event callbacks
```

Không chịu trách nhiệm trực tiếp về persistence.

Ví dụ:

```text
User drags Todo
       ↓
Calendar
       ↓
onEventDrop()
       ↓
todoStore.moveTodo()
       ↓
todoRepository.update()
       ↓
Storage
```

---

# 117. Todo Component Architecture

Có thể chia:

```text
todo/
├── TodoCard.tsx
├── TodoList.tsx
├── TodoItem.tsx
├── TodoForm.tsx
├── TodoDetail.tsx
├── TodoFilters.tsx
├── TodoPriority.tsx
├── TodoStatus.tsx
├── SubtaskList.tsx
└── TodoContextMenu.tsx
```

Không tạo một `Todo.tsx` khổng lồ.

---

# 118. Calendar Component Architecture

```text
calendar/
├── CalendarView.tsx
├── CalendarToolbar.tsx
├── CalendarEvent.tsx
├── MonthView.tsx
├── WeekView.tsx
├── DayView.tsx
├── AgendaView.tsx
└── CalendarFilters.tsx
```

Nếu FullCalendar xử lý nhiều view trong một component thì vẫn có thể giữ abstraction này ở mức feature.

---

# 119. Routing

Có thể sử dụng React Router.

Routes đề xuất:

```text
/login
/register

/
/calendar
/today
/upcoming
/completed
/statistics
/settings
```

Nếu Todo detail cần URL:

```text
/todos/:todoId
```

Không cần route cho mọi modal.

---

# 120. Protected Routes

Các route:

```text
/
/calendar
/today
/upcoming
/completed
/statistics
/settings
```

phải yêu cầu login.

Nếu chưa login:

```text
→ /login
```

---

# 121. Vite Project Setup

Recommended:

```text
React
TypeScript
Vite
```

Project nên bắt đầu với:

```text
npm create vite@latest
```

Sau đó cài từng dependency cần thiết.

Không cài toàn bộ library ngay từ đầu nếu chưa dùng.

---

# 122. Recommended Dependency Set

Core:

```text
react
react-dom
typescript
vite
```

UI:

```text
tailwindcss
shadcn/ui
lucide-react
```

State:

```text
zustand
```

Forms:

```text
react-hook-form
zod
```

Calendar:

```text
@fullcalendar/core
@fullcalendar/react
@fullcalendar/daygrid
@fullcalendar/timegrid
@fullcalendar/list
@fullcalendar/interaction
```

Date:

```text
date-fns
```

Toast:

```text
sonner
```

Charts:

```text
recharts
```

Optional:

```text
dnd-kit
dexie
```

Chỉ cài optional dependencies khi thật sự cần.

---

# 123. Vibe Coding Rules

Khi sử dụng AI để code, phải giữ các nguyên tắc:

## Rule 1 — Không code toàn bộ một lần

Không prompt:

```text
Build the entire application.
```

rồi chấp nhận hàng nghìn dòng code một lần.

Chia theo milestone.

## Rule 2 — Architecture trước implementation

Trước khi code:

```text
Requirements
 ↓
Data model
 ↓
Architecture
 ↓
Folder structure
 ↓
State design
 ↓
Storage design
 ↓
Implementation
```

## Rule 3 — AI phải giải thích thay đổi

Mỗi task lớn yêu cầu AI trả lời:

```text
What files changed?
Why?
What architecture decision was made?
What remains?
```

## Rule 4 — Không tạo duplicate utility

Nếu đã có:

```text
dateUtils.ts
```

AI không được tự tạo:

```text
calendarUtils.ts
dateHelper.ts
dateHelper2.ts
```

chỉ để làm cùng một việc.

## Rule 5 — Không gọi localStorage trực tiếp từ UI

Luôn:

```text
UI
 ↓
Store
 ↓
Repository
 ↓
Storage
```

## Rule 6 — TypeScript strict

Bật:

```text
strict: true
```

Không lạm dụng:

```ts
any
```

## Rule 7 — Không over-engineer

Không tạo:

```text
20 abstraction
```

cho một chức năng đơn giản.

Architecture phải đủ tốt nhưng vẫn dễ hiểu.

---

# 124. Vibe Coding Milestones

Không build tất cả cùng lúc.

## M1 — Foundation

```text
React
TypeScript
Vite
Tailwind
shadcn/ui
Routing
Layout
Sidebar
Theme
```

Done khi:

- [ ] App chạy.
- [ ] Routing hoạt động.
- [ ] Light/Dark mode.
- [ ] Responsive layout.
- [ ] Sidebar hoạt động.

---

## M2 — Storage

```text
Storage Adapter
Repositories
Data Models
```

Done khi:

- [ ] CRUD data bằng repository.
- [ ] Reload vẫn giữ data.
- [ ] Storage có version.
- [ ] Không component nào gọi localStorage trực tiếp.

---

## M3 — Authentication

```text
Register
Login
Logout
Session
Protected routes
Multi-user
```

Done khi:

- [ ] User A không thấy data User B.
- [ ] Reload vẫn giữ session.
- [ ] Logout hoạt động.

---

## M4 — Todo CRUD

```text
Create
Read
Update
Delete
Complete
Restore
Duplicate
Priority
Category
Description
```

Done khi:

- [ ] Todo CRUD đầy đủ.
- [ ] Validation.
- [ ] Toast.
- [ ] Confirmation.
- [ ] Undo delete.

---

## M5 — Calendar

```text
Month
Week
Day
Agenda
Today
Navigation
```

Done khi:

- [ ] Todo hiển thị đúng ngày.
- [ ] Todo hiển thị đúng thời gian.
- [ ] All-day Todo hoạt động.
- [ ] Click event mở detail.

---

## M6 — Calendar Interaction

```text
Drag
Drop
Resize
Select
Double click
```

Done khi:

- [ ] Move Todo giữa ngày.
- [ ] Move Todo giữa giờ.
- [ ] Resize duration.
- [ ] Drag để tạo Todo.
- [ ] Double-click tạo Todo.

---

## M7 — Search / Filter

```text
Search
Status
Priority
Category
Tags
Overdue
Sort
```

Done khi:

- [ ] Có thể kết hợp nhiều filter.
- [ ] Clear filters.
- [ ] Search realtime.
- [ ] Không làm thay đổi data gốc.

---

## M8 — Advanced Todo

```text
Recurring
Reminder
Deadline
Tags
Subtasks
```

Done khi:

- [ ] Recurrence đúng.
- [ ] Complete từng occurrence.
- [ ] Deadline.
- [ ] Subtask progress.
- [ ] Reminder.

---

## M9 — Statistics

```text
Completed
Overdue
Completion rate
Category
Priority
Streak
Charts
```

---

## M10 — Data Management

```text
Export
Import
Backup
Clear data
```

Import phải validate schema trước khi ghi vào storage.

---

## M11 — Polish

```text
Responsive
Accessibility
Keyboard shortcuts
Empty states
Error states
Loading states
PWA
```

---

## M12 — Testing / Refactor

Kiểm tra:

```text
Authentication
Todo CRUD
Calendar
Drag & Drop
Recurring tasks
Storage
Import / Export
Responsive
```

Sau đó:

```text
Remove dead code
Remove duplicate logic
Fix TypeScript errors
Fix lint errors
Improve component boundaries
```

---

# 125. Things AI Must NOT Do

AI không được tự ý:

- Tạo backend.
- Tạo database server.
- Thêm API nếu không cần.
- Dùng Redux khi Zustand đã đủ.
- Dùng React Query cho local-only state.
- Viết calendar engine từ đầu.
- Dùng `any` để né TypeScript error.
- Gọi localStorage trực tiếp từ hàng chục component.
- Tạo một component hàng nghìn dòng.
- Copy cùng một business logic vào nhiều component.
- Tạo duplicate utility.
- Cài thêm library nếu native solution hoặc library hiện tại đã đủ.
- Rewrite toàn bộ project chỉ vì một bug nhỏ.
- Thay đổi architecture mà không giải thích.

---

# 126. Code Quality Requirements

Project phải:

```text
TypeScript strict
ESLint
Prettier
```

Không để:

```text
console.log()
unused imports
unused variables
implicit any
dead code
```

Các function quan trọng phải có type rõ ràng.

---

# 127. Testing Strategy

Không nhất thiết viết test cho mọi UI component.

Ưu tiên test business logic:

```text
Todo creation
Todo update
Todo completion
Recurrence
Date calculations
Filtering
Sorting
Statistics
Import validation
```

Có thể dùng:

```text
Vitest
```

và:

```text
React Testing Library
```

cho component behavior quan trọng.

---

# 128. Final Recommended Stack

```text
┌─────────────────────────────────────────────┐
│                 React + TS                  │
├─────────────────────────────────────────────┤
│ Vite                                        │
├─────────────────────────────────────────────┤
│ Tailwind CSS + shadcn/ui                    │
├─────────────────────────────────────────────┤
│ Zustand                                     │
├─────────────────────────────────────────────┤
│ React Hook Form + Zod                       │
├─────────────────────────────────────────────┤
│ FullCalendar + date-fns                     │
├─────────────────────────────────────────────┤
│ Lucide React + Sonner                       │
├─────────────────────────────────────────────┤
│ Recharts                                    │
├─────────────────────────────────────────────┤
│ Repository / Storage Adapter                │
├─────────────────────────────────────────────┤
│ localStorage                                │
└─────────────────────────────────────────────┘
```

Optional:

```text
dnd-kit
Dexie
Vitest
React Testing Library
PWA
```

---

# 129. Master Vibe Coding Prompt

```text
Build a production-quality frontend-only Todo Calendar web application using React, TypeScript and Vite.

Use:

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide React
- Zustand
- React Hook Form
- Zod
- FullCalendar
- date-fns
- Sonner
- Recharts

Use localStorage for the initial persistence layer. Do not create a backend.

Architecture requirements:

UI
↓
Zustand Store
↓
Repository
↓
Storage Adapter
↓
localStorage

Components must never directly manipulate localStorage.

Keep authentication, Todo business logic, recurrence, statistics, notifications and date calculations outside presentation components.

Use TypeScript strict mode and avoid any.

Use UUIDs for entity IDs.

Support multiple local users. Every user-owned entity must have userId and users must never see another user's data.

Implement:

1. Local authentication
2. Todo CRUD
3. Todo completion/restore
4. Todo duplication
5. Todo priority
6. Categories
7. Tags
8. Descriptions
9. Subtasks
10. Deadlines
11. Reminders
12. Recurring Todo
13. Month calendar
14. Week calendar
15. Day calendar
16. Agenda/List view
17. All-day Todo
18. Drag and drop
19. Resize Todo duration
20. Drag-to-create Todo
21. Double-click-to-create Todo
22. Search
23. Filters
24. Sorting
25. Today page
26. Upcoming page
27. Completed page
28. Statistics
29. Streaks
30. Import/export
31. Dark/light/system theme
32. Responsive mobile UI
33. Keyboard shortcuts
34. Accessibility
35. Error/empty/loading states

Use FullCalendar rather than implementing a calendar engine manually.

Use React Hook Form + Zod for complex forms.

Use date-fns for date calculations.

Use Zustand for application state.

Use shadcn/ui for reusable UI primitives.

Use Sonner for toast notifications.

Use Recharts for statistics.

Implement the application incrementally:

M1: Foundation
M2: Storage
M3: Authentication
M4: Todo CRUD
M5: Calendar
M6: Drag & Drop
M7: Search & Filter
M8: Advanced Todo
M9: Statistics
M10: Import/Export
M11: Polish
M12: Testing & Refactor

Before writing code:

1. Inspect the existing project.
2. Create the proposed architecture.
3. Define TypeScript data models.
4. Define storage keys and storage adapter.
5. Define Zustand stores.
6. Define repository interfaces.
7. Define Zod schemas.
8. Explain the implementation plan.

Then implement only the current milestone.

After each milestone:

- run TypeScript checks
- run lint
- test the affected features
- report changed files
- report remaining issues
- do not rewrite unrelated code

Do not add unnecessary libraries.

Do not create a backend.

Do not use Redux or React Query unless there is a specific architectural reason.

Do not put the entire application into one component.

Do not use any to bypass TypeScript errors.

Do not directly access localStorage from UI components.

Keep business logic reusable and testable.
```

---

# 130. Final Goal

Project cuối cùng phải có cảm giác như một **personal productivity application thực sự**, không chỉ là CRUD Todo.

Core experience:

```text
                Todo Calendar
                      │
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
      Todo         Calendar       Agenda
        │             │             │
        ↓             ↓             ↓
 Priority        Drag & Drop      Search
 Category        Resize           Filter
 Subtasks        Quick Create     Sort
 Reminder        Recurrence       Status
 Deadline        All-day
        │             │
        └─────────────┼─────────────┘
                      ↓
                Local Storage
                      │
              ┌───────┴───────┐
              ↓               ↓
          Statistics      Import/Export
```

Mục tiêu không phải xây càng nhiều feature càng tốt, mà là giữ **core Todo + Calendar thật chắc**, architecture sạch và để các feature nâng cao được thêm vào mà không phải rewrite project.
