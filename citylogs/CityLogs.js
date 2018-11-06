
document.ontouchmove = function(e){
	e.preventDefault(); 
} 

//global variables
var server = ''// add server path and port
var cities = ["Home","Perth","Brisbane","Sydney","Melbourne","Adelaide"];
var userlocation = "0";
var city = 1;
var date = "";
var Perth_data = [];
var Brisbane_data = [];
var Sydney_data = [];
var Melbourne_data = [];
var Adelaide_data = [];

//refresh log list
$(document).on("#showlogs","pageshow", function() {
    $('#citylogs').listview('refresh');
});

// stores data in local storage back to city data arrays
$(document).ready(function(){
	Perth_data = JSON.parse(localStorage.Perth_data || '[]');
	Brisbane_data = JSON.parse(localStorage.Brisbane_data || '[]');
	Sydney_data = JSON.parse(localStorage.Sydney_data || '[]');
	Melbourne_data = JSON.parse(localStorage.Melbourne_data || '[]');
	Adelaide_data = JSON.parse(localStorage.Adelaide_data || '[]');
});


$(document).delegate("#citypage","pageinit", function() {
	// gets location and time when time botton is tapped
	$('#time').tap(function(){
		navigator.geolocation.getCurrentPosition(function(position){
			var latitude = position.coords.latitude;
			var longitude = position.coords.longitude;
			userlocation = latitude + " / " + longitude;
		});
		var d = new Date();
		date = d.getDate() +"/"+d.getMonth()+"/"+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
		$('#time').hide();
		$('#showtime').text(date).show();
		
	});
	
	// saves data from inputs and time into city data arrays
	$('#savelogs').tap(function(){
		
		if ($('#contact').val() == "")
			alert("Please enter a valid contact name");	
		else if ($('#invoice').val() == "")
			alert("Please enter a valid invoice number");	
		else if($('#select').val() == "")
			alert("Please select a destinaton");
		else if(date == "")
			alert("Log no saved. Tap Time button and try again");
		else {
			var id = new Date().getTime();
			var dataItem = {
				id:id,
				time: date,
				location: userlocation,
				contact: $('#contact').val(),
				invoice: $('#invoice').val(),
				destination:$('#select').val(),
				cityOrigin: $('#citypage h1').text()
			};
			
			switch (city) {
				case 1:
					Perth_data.push(dataItem);
					localStorage.Perth_data = JSON.stringify(Perth_data);
					break;
				case 2:
					Brisbane_data.push(dataItem);
					localStorage.Brisbane_data = JSON.stringify(Brisbane_data);
					break;
				case 3:
					Sydney_data.push(dataItem);
					localStorage.Sydney_data = JSON.stringify(Sydney_data);
					break;
				case 4:
					Melbourne_data.push(dataItem);
					localStorage.Melbourne_data = JSON.stringify(Melbourne_data);
					break;
				case 5:
					Adelaide_data.push(dataItem);
					localStorage.Adelaide_data = JSON.stringify(Adelaide_data);
					break;
			}
			alert("Log saved");
			clearPage();
		}	
	});
});

// identify which city page needs to be displayed
function getID(value){
	city = parseInt(value.id);
	pageChanger(city);
}

// moves forward in city pages
function next(){
	if(city == 5)
		city = 1;
	else
		city++;
	pageChanger(city);
}
// moves backward in city pages
function previous(){
	if(city == 1){
		city = 5;
	}
	else{
		city--;
	}
	pageChanger(city);
}
// personalise citypage based on which city is selected
function pageChanger(value){
	switch (value){
		case 1: 
			$.mobile.changePage("index.html#citypage");
			$('#citypage h1').text(cities[value]);
			clearPage();
			break;
		case 2: 
			$.mobile.changePage("index.html#citypage");
			$('#citypage h1').text(cities[value]);
			clearPage();
			break;
		case 3: 
			$.mobile.changePage("index.html#citypage");
			$('#citypage h1').text(cities[value]);
			clearPage();
			break;
		case 4: 
			$.mobile.changePage("index.html#citypage");
			$('#citypage h1').text(cities[value]);
			clearPage();
			break;
		case 5: 
			$.mobile.changePage("index.html#citypage");
			$('#citypage h1').text(cities[value]);
			clearPage();
			break;
	}
}

//clear city page entries
function clearPage(){
	$('#time').show();
	$('#showtime').hide();
	$('#contact').val("");
	$('#invoice').val("");
	$('#select').val("");
}

//change to city logs pages and present logs based on city selected
function showCityLogs(){
	clearPage();
	$('#citylogs').empty();
	switch(city){
		case 1: 
			$.mobile.changePage("index.html#showlogs");
			$('#title').text(cities[city]);
			for (var i = 0; i < Perth_data.length; i++){
				addLog(Perth_data[i]);
			}
			break;
		case 2: 
			$.mobile.changePage("index.html#showlogs");
			$('#title').text(cities[city]);
			for (var i = 0; i < Brisbane_data.length; i++){
				addLog(Brisbane_data[i]);
			}
			break;
		case 3: 
			$.mobile.changePage("index.html#showlogs");
			$('#title').text(cities[city]);
			for (var i = 0; i < Sydney_data.length; i++){
				addLog(Sydney_data[i]);
			}
			break;
		case 4: 
			$.mobile.changePage("index.html#showlogs");
			$('#title').text(cities[city]);
			for (var i = 0; i < Melbourne_data.length; i++){
				addLog(Melbourne_data[i]);
			}
			break;
		case 5: 
			$.mobile.changePage("index.html#showlogs");
			$('#title').text(cities[city]);
			for (var i = 0; i < Adelaide_data.length; i++){
				addLog(Adelaide_data[i]);
			}
			break;	
	}
}

//appends the data logs to the city log page
function addLog(datalog){
	var logstring = datalog.time +","+datalog.location+","+datalog.contact+","+datalog.invoice
	 +","+datalog.destination;
	var log = $('#logitem').clone();
	log.attr({id:datalog.id});
	log.find('span.text').text(logstring);
	$("#citylogs").append(log).listview('refresh');
}

// populates city cloud logs with the data imported from mlab
function addLogCloud(datalog){
	var logstring = datalog.time +","+datalog.location+","+datalog.contact+","+datalog.invoice
	 +","+datalog.destination;
	var log = $('#cloudlogitem').clone();
	log.attr({id:datalog.id});
	log.find('span.text').text(logstring);
	$("#cityCloudlogs").append(log).listview('refresh');
}

// get logs from mlab
 function getLogs() {

  	var city = $('#citypage h1').text();
  	var page = "cloudlogs";
	$('#cityCloudlogs').empty();
	$.mobile.changePage("index.html#" + page);
	$('.title').text(city);
  	http_get('search/'+escape(city),function(data){
      for (var i = 0; i < data.list.length; i++){
				addLogCloud(data.list[i]);
			}

    })
    alert("Logs retrieved from CloudServer successfully!");
  }

// delete and send logs based on city selected
function deleteAndSaveLogs(){
	$('#citylogs').empty();
	switch(city){
		case 1: 
			var p = Perth_data.length;
			// posting to the server 
			http_post('Perth/log', Perth_data, void(0) );
			// removing one by one
			for (var i = 0; i < p; i++){
				Perth_data.splice(0,1);
			}
			// Deleting from localstorage
			window.localStorage.removeItem(Perth_data);
			break;
		case 2: 
			var b = Brisbane_data.length;
			http_post('Brisbane/log', Brisbane_data, void(0) );
			for (var i = 0; i < b; i++){
				Brisbane_data.splice(0,1);
			}
			localStorage.removeItem(Brisbane_data);
			break;
		case 3: 
			var s = Sydney_data.length;
			http_post('Sydney/log', Sydney_data, void(0) );
			for (var i = 0; i < s; i++){
				Sydney_data.splice(0,1);
			}
			localStorage.removeItem(Sydney_data);
			break;
		case 4: 
			var m = Melbourne_data.length;
			http_post('Melbourne/log', Melbourne_data, void(0) );
			for (var i = 0; i < m; i++){
				Melbourne_data.splice(0,1);
			}
			localStorage.removeItem(Melbourne_data);
			break;
		case 5: 
			var a = Adelaide_data.length;
			http_post('Adelaide/log', Adelaide_data, void(0) );
			for (var i = 0; i < a; i++){
				Adelaide_data.splice(0,1);
			}
			localStorage.removeItem(Adelaide_data);
			break;	
	}
	alert("Logs sent to server and CloudServer");
}

// gets data from the server
 function http_get(suffix,win) {
    $.ajax(
      {
        url:'http://'+server+'/city/'+suffix, 
        dataType:'json',
        success:win,
        error:function(err){
          showalert('Network','Unable to contact server.')
        }
      }
    )
  }

 //Sends data to the server
 function http_post(suffix,data,win) {
    $.ajax(
      {
        url:'http://'+server+'/city/'+suffix, 
        type:'POST',        
        contentType:'application/json',
        data:JSON.stringify(data),
        dataType:'json',
        success:win,
        error:function(err){
          alert('Network','Unable to contact server.')
        }
      }
    )
  }



