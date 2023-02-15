const pm2 = require('pm2')

pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }
  pm2.start([
    {
      script: "routePug.js",
      output: "/dev/stdout",
      error: "/dev/stderr",
    },
  ]
    , function(err, proc) {
      if(err) {
        throw err
      }
    });
})