'use client';

import { FormEvent, useState } from 'react';
import styles from './todo.module.css';
import type { Category, Priority, Todo } from './todo-types';

const priorityLabel: Record<Priority, string> = { none: 'None', low: 'Low', medium: 'Medium', high: 'High' };

export default function AdvancedTodoModal({ todo, categories, onSave, onDelete, onClose }: { todo: Todo; categories: Category[]; onSave: (todo: Todo) => void; onDelete?: () => void; onClose: () => void }) {
  const [draft, setDraft] = useState(todo);
  const [tags, setTags] = useState(todo.tags.join(', '));
  const [subtaskTitle, setSubtaskTitle] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.title.trim()) return;
    onSave({ ...draft, title: draft.title.trim(), tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean), id: draft.id || crypto.randomUUID(), createdAt: draft.createdAt || new Date().toISOString() });
  }

  async function enableNotifications() {
    if ('Notification' in window && Notification.permission === 'default') await Notification.requestPermission();
  }

  function addSubtask() {
    if (!subtaskTitle.trim()) return;
    setDraft({ ...draft, subtasks: [...draft.subtasks, { id: crypto.randomUUID(), title: subtaskTitle.trim(), completed: false }] });
    setSubtaskTitle('');
  }

  return <div className={styles.modalBackdrop}><form className={styles.modal} onSubmit={submit}>
    <div className={styles.modalHeader}><div><p className={styles.overline}>Todo details</p><h2>{todo.id ? 'Edit task' : 'New task'}</h2></div><button type="button" className={styles.closeButton} onClick={onClose}>×</button></div>
    <input className={styles.titleInput} autoFocus required placeholder="Task title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
    <textarea placeholder="Description (optional)" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
    <div className={styles.formGrid}>
      <label>Date<input type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} /></label>
      <label>Priority<select value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value as Priority })}>{Object.entries(priorityLabel).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      <label>Start<input type="time" value={draft.startTime} disabled={draft.allDay} onChange={(event) => setDraft({ ...draft, startTime: event.target.value })} /></label>
      <label>End<input type="time" value={draft.endTime} disabled={draft.allDay} onChange={(event) => setDraft({ ...draft, endTime: event.target.value })} /></label>
      <label>Category<select value={draft.categoryId} onChange={(event) => setDraft({ ...draft, categoryId: event.target.value })}><option value="">No category</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label>
      <label>Deadline<input type="date" value={draft.deadline} onChange={(event) => setDraft({ ...draft, deadline: event.target.value })} /></label>
      <label>Repeat<select value={draft.recurrence?.frequency || 'never'} onChange={(event) => setDraft({ ...draft, recurrence: event.target.value === 'never' ? undefined : { frequency: event.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly', interval: draft.recurrence?.interval || 1 } })}><option value="never">Never</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></label>
      <label>Repeat every<input type="number" min="1" max="99" disabled={!draft.recurrence} value={draft.recurrence?.interval || 1} onChange={(event) => setDraft({ ...draft, recurrence: draft.recurrence ? { ...draft.recurrence, interval: Number(event.target.value) } : undefined })} /></label>
      <label>Reminder<select value={draft.reminder?.minutesBefore || 0} onChange={(event) => setDraft({ ...draft, reminder: Number(event.target.value) ? { minutesBefore: Number(event.target.value) } : undefined })}><option value="0">No reminder</option><option value="5">5 minutes before</option><option value="10">10 minutes before</option><option value="15">15 minutes before</option><option value="30">30 minutes before</option><option value="60">1 hour before</option></select></label>
      <label>Tags<input placeholder="work, focus" value={tags} onChange={(event) => setTags(event.target.value)} /></label>
    </div>
    <div className={styles.subtasks}><label>Subtasks</label>{draft.subtasks.map((subtask) => <div className={styles.subtaskRow} key={subtask.id}><input type="checkbox" checked={subtask.completed} onChange={(event) => setDraft({ ...draft, subtasks: draft.subtasks.map((item) => item.id === subtask.id ? { ...item, completed: event.target.checked } : item) })} /><span className={subtask.completed ? styles.subtaskDone : ''}>{subtask.title}</span><button type="button" onClick={() => setDraft({ ...draft, subtasks: draft.subtasks.filter((item) => item.id !== subtask.id) })}>×</button></div>)}<div className={styles.subtaskAdd}><input value={subtaskTitle} onChange={(event) => setSubtaskTitle(event.target.value)} placeholder="Add a subtask" /><button type="button" onClick={addSubtask}>Add</button></div></div>
    <div className={styles.advancedOptions}><label className={styles.checkLabel}><input type="checkbox" checked={draft.allDay} onChange={(event) => setDraft({ ...draft, allDay: event.target.checked })} /> All day</label>{draft.reminder && <button type="button" className={styles.textButton} onClick={enableNotifications}>Enable browser reminders</button>}</div>
    <div className={styles.modalActions}>{onDelete && <button type="button" className={styles.dangerButton} onClick={() => window.confirm('Delete this task?') && onDelete()}>Delete</button>}<span /><button type="button" onClick={onClose}>Cancel</button><button className={styles.primaryButton}>Save task</button></div>
  </form></div>;
}
