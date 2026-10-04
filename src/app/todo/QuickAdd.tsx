'use client';

import { FormEvent, useState } from 'react';
import styles from './todo.module.css';

export default function QuickAdd({ onAdd }: { onAdd: (value: string) => void }) {
  const [value, setValue] = useState('');
  function submit(event: FormEvent) { event.preventDefault(); if (!value.trim()) return; onAdd(value.trim()); setValue(''); }
  return <form className={styles.quickAdd} onSubmit={submit}><span>⌕</span><input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Quick add: Study Node.js tomorrow at 14:00" /><button>Add</button></form>;
}
