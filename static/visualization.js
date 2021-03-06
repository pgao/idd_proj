$(function() {
  var updateDelay = 300;
  var numSensors = 6;

  // clear prev data
  for (var i = 0; i < numSensors; i++) {
    $.getJSON('https://api.thingspeak.com/update?api_key=D6QJVBI8TE96ONRK&field' + i + '=1');
  }

  // create a heatmap instance
  var heatmap = h337.create({
    container: document.getElementById('heatmap'),
    maxOpacity: .5,
    radius: 10,
    blur: .75
  });

  // boundaries for data generation
  var width = (+window.getComputedStyle(document.body).width.replace(/px/,''));
  var height = (+window.getComputedStyle(document.body).height.replace(/px/,''));

  var width = $('#heatmap').width();
  var height = $('#heatmap').height();

  var mappings = {
    // front
    3: {
      x: width/2,
      y: 80,
      value: 50,
      radius: 70
    },
    // back
    4: {
      x: width/2,
      y: 410,
      value: 50,
      radius: 70
    },
    // left
    2: {
      x: width * 1/3 - 10,
      y: height/2 - 25,
      value: 50,
      radius: 70
    },
    // right
    1: {
      x: width * 2/3 + 10,
      y: height/2 - 25,
      value: 50,
      radius: 70
    },
    // back
    6: {
      x: width/2,
      y: height/2 - 25,
      value: 50,
      radius: 70
    },
    // seat
    5: {
      x: width/2,
      y: 520,
      value: 50,
      radius: 50
    }
  }

  var getNewData = function() {
    var points = [];
    updateMappings = function(i) {
      $.getJSON('http://api.thingspeak.com/channels/17805/field/' + i + '/last.json', function(data) {
        console.log(i + " completed");
        var val = parseInt(data['field' + i]);
        mappings[i]['value'] = val;
      });
    }

    for (var i = 1; i < numSensors + 1; i++) {
      updateMappings(i);
    }

    for (var i = 1; i < numSensors + 1; i++) {
      points.push(mappings[i]);
    }

    // console.log(points);

    heatmap.setData({
      data: points,
      min: 0,
      max: 100
    });
  }

  // generate 1000 datapoints
  var generate = function() {
    // randomly generate extremas
    var extremas = [(Math.random() * 1000) >> 0,(Math.random() * 1000) >> 0];
    var max = Math.max.apply(Math, extremas);
    var min = Math.min.apply(Math, extremas);
    var t = [];


    for (var i = 0; i < 1000; i++) {
      var x = (Math.random()* width) >> 0;
      var y = (Math.random()* height) >> 0;
      var c = ((Math.random()* max-min) >> 0) + min;
      // btw, we can set a radius on a point basis
      var r = (Math.random()* 80) >> 0;
      // add to dataset
      t.push({ x: x, y:y, value: c, radius: r });
    }
    var init = +new Date;
    // set the generated dataset
    heatmap.setData({
      data: t
    });
  };
  // initial generate
  // generate();

  setTimeout(function updateHeatmap() {
    // generate();
    getNewData();
    setTimeout(updateHeatmap, updateDelay);
  }, updateDelay);

});