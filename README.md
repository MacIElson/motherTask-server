# mommyApp-server

## API

### Friends
add, remove friends.

&#x20;<a href="#api-GET-users" name="api-GET-users">#</a> <b>GET</b> /users 
Get all users. Returns:

```js
{
  "userss": [
    "maci",
    "alison"
  ]
}
```

&#x20;<a href="#api-POST-username-addFriend" name="api-POST-username-addFriend">#</a> <b>POST</b> /`:username`/addFriend 
Add a friend. Submit a payload:

```
{
  "friend": "...friend username..."
}
```

&#x20;<a href="#api-POST-username-removeFriend" name="api-POST-username-removeFriend">#</a> <b>POST</b> /`:username`/delGroup  
Remove friend. Submit a payload:

```
{
  "friend": "...friend username..."
}
```

&#x20;<a href="#api-GET-username-friends" name="api-GET-username-friends">#</a> <b>GET</b> /`:username`/friends  
Get all groups user is  in. Returns:

```js
{
  "friends": [
    "Amanda,
    "Allison"
  ]
}
```

### Tasks
Create, join, delete posts.

&#x20;<a href="#api-POST-username-createTask" name="api-POST-username-createTask">#</a> <b>POST</b> /createTask
Create task. Submit a payload:

```
{
      "task": "Make lunch for kids"
}
```

&#x20;<a href="#api-GET-tasks" name="api-GET-tasks">#</a> <b>GET</b> /tasks  
Get all tasks. Returns: 

```js
{
  "tasks": [
    {
      "username": "maci",
      "task": "Make lunch for kids",
      "completed": "false",
      _id: "52745d971e7d50211b000001"
    }
  ]
}
```

&#x20;<a href="#api-GET-username-tasks" name="api-GET-username-tasks">#</a> <b>GET</b> /:username/tasks  
Get tasks by user. Returns: 


```js
{
  "tasks": [
    {
      "username": "maci",
      "task": "Make lunch for kids",
      "completed": "false",
      _id: "52745d971e7d50211b000001"
    }
  ]
}
```

&#x20;<a href="#api-GET-username-getTasksCompleted" name="api-GET-username-getTasksCompleted">#</a> <b>GET</b> /:username/getTasksCompleted  
Get number of tasks completed by user. Returns: 

```js
{
  "tasksCompleted": 2
}
```

&#x20;<a href="#api-POST-postID-completed" name="api-POST-taskID-completed">#</a> <b>POST</b> /`:taskID`/completed 
Set completed status of task. No payload needed.

&#x20;<a href="#api-POST-postID-removeTask" name="api-POST-taskID-removeTask">#</a> <b>POST</b> /`:taskID`/removeTask 
Remove Task. No payload needed.

&#x20;<a href="#api-DELETE-delAllTasks321" name="api-DELETE-delAllTasks321">#</a> <b>DELETE</b> /delAllTasks321
Delete all Tasks. No payload needed.

&#x20;<a href="#api-DELETE-delAllFriends321" name="api-DELETE-delAllFriends321">#</a> <b>DELETE</b> /delAllFriends321
Delete all Friends. No payload needed.

## License

MIT
