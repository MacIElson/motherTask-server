
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongojs = require('mongojs')
  , MongoStore = require('connect-mongo')(express);

var app = express(), db;

app.configure(function () {
  db = mongojs(process.env.MONGOLAB_URI || 'olumni', ['friends','tasks']);
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('secret', process.env.SESSION_SECRET || 'terrible, terrible secret')
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(app.get('secret')));
  app.use(express.session({
    secret: app.get('secret'),
    store: new MongoStore({
      url: process.env.MONGOLAB_URI || 'mongodb://localhost/weachieve'
    })
  }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
  app.set('host', 'localhost:3000');
  app.use(express.errorHandler());
});

app.configure('production', function () {
  app.set('host', 'weachieveserver.herokuapp.com');
});

/**
 * Helpful
 */

function validateShort (name) {
  return String(name).substr(0, 25);
}

function validateLong (tweet) {
  return String(tweet).substr(0, 140);
}

function validateUsername (name) {
  return String(name).substr(0, 25);
}

function validateTweet (tweet) {
  return String(tweet).substr(0, 140);
}

/**
 * Routes
 */

app.get('/', function (req, res) {
  res.redirect('https://github.com/MaciCrowell/olumni-server');
})

app.get('/secret', function (req, res) {
  db.groups.find({
    published: true
  }).sort({date: -1}, function (err, docs) {
    console.log(docs);
    res.render('index', {
      title: 'motherTask',
      quotes: docs,
      user: {}
    });
  })
});

RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
};

/*
 * get all users
 */

app.get('/users', function (req, res) {
  db.friends.distinct('username', function (err, names) {
    res.json({"users": names});
  });
})

/**
 * get user's friends
 */

app.get('/:username/friends', function (req, res) {
  db.friends.find({
    username: validateUsername(req.params.username)
  }, function (err, docs) {
    res.json({
      "friends": docs.map(function (entry) {
        return entry.friend;
      })
    });
  })
});

/**
 * add friend
 */

app.post('/:username/addFriend', function (req, res) {
  if (req.params.username) {
    db.friends.findOne({
      username: validateShort(req.params.username),
      friend: validateShort(req.body.friend)
    }, function (err, found) {
      if (!found) {
        db.friends.save({
          username: validateShort(req.params.username),
          friend: validateShort(req.body.friend),
        }, res.json.bind(res, {"error": false, message: '1'}));
      } else {
        res.json({"error": false, message: '2'})
      }
    });
  } else {
    res.json({error: true, message: 'Invalid add friend request'}, 500);
  }
})

/**
 * delete friend for user
 */

app.post('/:username/removeFriend', function (req, res) {
  db.friends.remove({
    username: validateShort(req.params.username),
    friend: validateShort(req.body.friend)
  }, function (err) {
    res.json({"error": err})
  })
});

/**
 * create task
 */

app.post('/:username/createTask', function (req, res) {
  if (req.body.task && req.params.username) {
    id = db.ObjectId();
    db.tasks.save({
      username: req.params.username,
      task: req.body.task,
      completed: false,
      _id: id
    });
    res.json({error: false, taskid: id});
  } else {
    res.json({error: true, message: 'Invalid post add request'}, 500);
  }
})

/**
 * get all tasks
 */

app.get('/tasks', function (req, res) {
  var query = { 

  };
  if ('q' in req.query) {
    query.tasks = {$regex: ".*" + req.query.q + ".*"};
  }
  db.tasks.find(query).sort({date: -1}, function (err, docs) {
    res.json({"tasks": docs});
  })
});

/**
 * get tasks from user
 */

app.get('/:username/getTasks', function (req, res) {
  var query = { 
    username: validateShort(req.params.username)
  };
  if ('q' in req.query) {
    query.tasks = {$regex: ".*" + req.query.q + ".*"};
  }
  db.tasks.find(query).sort({date: -1}, function (err, docs) {
    res.json({"tasks": docs});
  })
});

/**
 * get tasks completed by user
 */

app.get('/:username/getTasksCompleted', function (req, res) {
  var query = { 
    username: validateShort(req.params.username),
    completed: true
  };
  console.log(db.tasks.count(query));
  db.tasks.find(query).count(function(err, count) {
    console.log(count);
    res.json({"tasksCompleted": count});
  })
});

/**
 * make task completed
 */

app.post('/:postID/completed', function (req, res) {
  db.tasks.findOne({
      _id: db.ObjectId(req.params.postID)
    }, function (err, found) {
      if (found) {
        db.tasks.update(
          {_id: db.ObjectId(req.params.postID)},
          { $set : { completed: true } }
        )
        res.json({error: false});
      } else {
        res.json({error: true, message: 'Invalid completion request'}, 500);
      }
  });
});


/**
 * delete post based on id
 */

app.post('/:postID/removeTask', function (req, res) {
  db.tasks.remove({
    _id: db.ObjectId(req.params.postID)
  }, function (err) {
    res.json({"error": err})
  })
});

/**
 * delete all posts
 */

app.del('/delAllTasks321', function (req, res) {
  db.tasks.drop();
  res.json({"error": "???"})
});

app.del('/delAllFriends321', function (req, res) {
  db.friends.drop();
  res.json({"error": "???"})
});

/**
 * Launch
 */

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on http://" + app.get('host'));
});