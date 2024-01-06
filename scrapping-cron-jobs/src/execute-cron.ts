import 'dotenv/config';

import { Job } from './interfaces/job';
import jobs from './jobs';

const Job = jobs[String(process.argv[2])];

if (Job) {
  (async () => {
    const job: Job = new Job();
    await job.bootstrap();
  })();
}
