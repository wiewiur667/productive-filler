# Productive automation for the modern developer

Everyone hates to put time into productive, so I've automated it for you. This service will help you to be more productive by automating your daily tasks.

## Features

- insert default tasks(standup, department standup, default implementation task) if none are provided for the day with total time of 8 hours

- insert missing time for the day using default task
- fully configurable with **entries.json** file and environment variables

## How to use

1. Clone the repository
2. Update /docker/.env file with your details
3. (Optional) Change CRON time - its running at 17:00 MON-FRI by default
4. Update src/entries.json with your tasks
5. Build Docker image
6. Run Docker container
7. There is no step 5
8. Profit
