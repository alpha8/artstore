var express = require('express');
var config = require('./config/index');

var port = process.env.PORT || config.build.port;

var app = express();

var router = express.Router();

router.get('/', function (req, res, next) {
	req.url = '/index.html';
	next();
});

app.use(router);

var appData = require('./data.json');
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

var apiRoutes = express.Router();

apiRoutes.get('/seller', function (req, res) {
	res.json({
		errno: 0,
		data: seller
	});
});

apiRoutes.get('/goods', function (req, res) {
	res.json({
		errno: 0,
		data: goods
	});
});

router.get('/good/:id', function(req, res){
  var id = req.params.id;
  if (id) {
    var goods = goodsData.goods;
    goods.filter((good) => {
      good.items.forEach((item) => {
        if (item.id === id) {
          res.json({
            errno: 0,
            data: item
          });
          return;
        }
      });
    });
  }
  res.json({
    errno: 0,
    data: {}
  });
});

apiRoutes.get('/ratings', function (req, res) {
	res.json({
		errno: 0,
		data: ratings
	});
}); 

app.use('/api', apiRoutes);

app.use('/webapp', express.static('./dist'));

module.exports = app.listen(port, function (err) {
	if (err) {
		console.log(err);
		return;
	}
	console.log('Listening at http://localhost:' + port + '\n');
});