import { useEffect, useState } from 'react';
import queue from './RequestQueue';

export default function useQueue() {
  const [jobs, setJobs] = useState(queue.getSnapshot());

  useEffect(() => {
    const unsubscribe = queue.subscribe(setJobs);
    return unsubscribe;
  }, []);

  return {
    jobs,
    retry: queue.retry.bind(queue),
    clearFailed: queue.clearFailed.bind(queue),
  };
}
