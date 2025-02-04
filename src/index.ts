import axios from 'axios';
import { CronJob } from 'cron';
import { format } from 'date-fns';
import { EntryResult } from './EntryResult.interface';
import process from 'node:process';

const client = axios.create({
  baseURL: 'https://api.productive.io/api/v2',
  headers: {
    'X-Auth-Token': process.env.PRODUCTIVE_API_TOKEN,
    'X-Organization-Id': process.env.PRODUCTIVE_ORGANIZATION_ID,
    'Content-Type': 'application/vnd.api+json'
  }
});
console.log('Productive.io time filler!');
console.log('API token:', process.env.PRODUCTIVE_API_TOKEN);
console.log('Organization ID:', process.env.PRODUCTIVE_ORGANIZATION_ID);
console.log('Person ID:', process.env.PRODUCTIVE_PERSON_ID);
console.log('CRON:', process.env.CRON_SCHEDULE);
const date = new Date();
const formattedDate = format(date, 'yyyy-MM-dd');
const workingDayLength = 8 * 60;
const entries = (await import('./entries.json', { with: { type: 'json' } })).default;

let job: CronJob | null = null;

async function updateTime() {
  console.log('Running job...');
  console.log('Today is', formattedDate);


  try {
    const response = await client.get('/time_entries', {
      params: {
        'filter[after]': formattedDate,
        'filter[before]': formattedDate
      }
    });
    const result: EntryResult[] = response.data.data;
    if (result.length > 0) {
      const totalTime = result.reduce((acc, entry) => acc + entry.attributes.time, 0);
      console.log('Entries found, total time is:', totalTime);
      console.log(result.map(entry => ({
        id: entry.id,
        time: entry.attributes.time,
        note: entry.attributes.note
      })));

      if (totalTime < workingDayLength) {
        insertNewTimeEntry('task_feature', workingDayLength - totalTime);
      }
    } else {
      console.log('No entries found for today');
      let entiresTotalTime = 0;

      insertNewTimeEntry('standup');
      entiresTotalTime += entries['standup'].attributes.time;

      insertNewTimeEntry('department_standup');
      entiresTotalTime += entries['department_standup'].attributes.time;

      insertNewTimeEntry('task_feature', workingDayLength - entiresTotalTime);
    }
  } catch {
    console.error('Failed to fetch entries');
  }
  if (job)
    console.log('Job scheduled to run at:', job.nextDate().toString());
}


job = new CronJob(process.env.CRON_SCHEDULE?.toString() ?? '', async () => {
  await updateTime();
}, null, true);

console.log('Job scheduled to run at:', job.nextDate().toString());

async function insertNewTimeEntry(templateKey: keyof typeof entries, time?: number, note?: string) {
  const newEntry = JSON.parse(JSON.stringify(entries[templateKey])) as typeof entries['standup'];

  if (time)
    newEntry.attributes.time = time;

  if (note)
    newEntry.attributes.note = note;

  newEntry.relationships.person.data.id = process.env.PRODUCTIVE_PERSON_ID!;
  newEntry.attributes.date = formattedDate;
  try {
    await client.post('/time_entries', {
      data: newEntry
    });
    console.log('New time entry inserted', templateKey, time, note);
  } catch {
    console.error('Failed to insert new time entry');
  }
}

new CronJob('* * * * *', () => {
  console.log('KeepAlive ping');
}, null, true);