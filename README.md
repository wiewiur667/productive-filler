# Productive automation for the modern developer

Everyone hates to put time into productive, so I've automated it for you. This service will help you to be more productive by automating your daily tasks.

## Features

- insert default tasks(standup, department standup, default implementation task) if none are provided for the day with total time of 8 hours

- insert missing time for the day using default task
- fully configurable with **entries.json** file and environment variables

## How to use

**USE NPM**

1. Clone the repository
2. Install the dependencies
3. Update the **entries.json** file with your task names ids and time
4. Update cron time in index.ts
5. Build the project

6. Run

```bash
npm install -g node-windows
npm link node-windows
```

7. Run

```bash
node windows-service-install.cjs
```

8. Accept prompts and start the service
9. Check if service is running in services.msc
