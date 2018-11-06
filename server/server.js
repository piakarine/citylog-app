
var common  = require('./common.js')
var config  = common.config
var mongo   = common.mongo
var util    = common.util
var uuid    = common.uuid
var oauth   = common.oauth
var url     = common.url
var request = common.request
var bodyParser = common.bodyParser;
var multer = common.multer;
var express = common.express;
var fs = common.fs

// API functions
function  upload(req,res) {
   console.error('upload started..')
   res.contentType('text/plain')
   if (req.files) {
      console.error(req.files);
      if (req.files.file.size == 0) {
         console.error('Error: no filename supplied for upload ')
         res.send(JSON.stringify({400: 'no filename sent to server'}))
         }
      fs.exists(req.files.file.path, function(exists) {
         if (exists) {
            console.error('File OK:')
            res.send(JSON.stringify({200: 'OK file recieved'}))
            }
         else {
            console.error('400, file upload failed')
            }
         })
      }
  };
  
function stream(req,res) {
  finduser(true,['stream'],req,res,function(user,coll){
    common.sendjson(res,{ok:true,stream:user.stream})
  })
}


function send_data(req, res) {
    var cityItem = req.body[0]
     var res = mongo.coll( 'logs', function(coll) { coll.insertMany( req.body) })
    console.log(res);
  }

function search(req,res){
  var merr = mongoerr400(res)
  mongo.coll(
    'logs',
    function(coll){
      coll.find(
        {cityOrigin:{$regex:new RegExp('^'+req.params.query)}},
        {fields:['time', 'location', 'contact', 'invoice', 'destination' ]},
        merr(function(cursor){
          var list = []
          cursor.each(merr(function(data){
            if( data ) {
              list.push(data)
            }
            else {
              common.sendjson(res,{ok:true,list:list})
            }
          }))
        })
      )
    }
  )
}


// utility functions


function mongoerr400(res){
  return function(win){
    return mongo.res(
      win,
      function(dataerr) {
        err400(res)(dataerr)
      }
    )
  }
}

function err400(res,why) {
  return function(details) {
    console.error('ERROR 400 '+why+' '+details)
    res.writeHead(400,''+why)
    res.end(''+details)
  }
}


var db  = null
var app = null

mongo.init(
  {
    name:     config.mongohq.name,
    host:     config.mongohq.host,
    port:     config.mongohq.port,
    username: config.mongohq.username,
    password: config.mongohq.password,
  }, 
  function(res){
    db = res
    var prefix = '/city/'
    app = express()
    // Configuration
    // header('Access-Control-Allow-Origin: *');
    app.use(bodyParser.json())
    //app.use(multer({dest: './images/'}), middle() )


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*'); // allows everyone to connect  

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


    app.get(  prefix+'search/:query', search)
    app.post(  prefix+':city_name/log', send_data)
    app.listen(3009)
    console.error('Server listening on port 3009')
  },
  function(err){
    console.error(err)
  }
)


