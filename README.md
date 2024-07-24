## Steps to validate

1. Clone the project
2. Run `npm install`
3. Run `npm start`
4. Send a GET request to `localhost:3000/api/files`


## Approach

I used approach where even before server is started, we start to fetch data from external api, and cache it in order to serve it faster.

## What i tried?

1. Use streaming to fetch data from the external API. However, I encountered a delay of 10 seconds before receiving the first chunk of data. Unfortunately, I couldn't find a way to incrementally send the response to make it faster. (Even tho I understand that for example, when we watch video on youtube, we dont wait for whole video to get processed, but we continuously process data and watch the video). I would appreciate if my solution is not ok, if you could comment on where to educate myself to learn this thing

2. I tried using Redis and Docker to queue a job. The idea was that when a request is sent to our service, it would ask for data from the external API and send the job's progress/status as the response. In the background, the job would prepare the data, which could then be fetched using the job ID. However, I didn't find this approach satisfactory.

