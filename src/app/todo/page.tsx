import type { Metadata } from 'next';
import TodoApp from './TodoApp';

export const metadata: Metadata = {
  title: 'Todo | Dat Nguyen',
  description: 'A private task list for Dat Nguyen.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TodoPage() {
  return <TodoApp />;
}
