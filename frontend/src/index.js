import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as bootstrap from 'bootstrap';
import './scss/main.scss';
import 'leaflet-layerjson';
import 'leaflet-search';
import $ from 'jquery';

window.$ = $;

/* This code is needed to properly load the images in the Leaflet CSS */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
	iconUrl: require('leaflet/dist/images/marker-icon.png').default,
	shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
});

const map = L.map('map');
/**
 * Copyright (c) 2011-2012 Andreas Heigl<andreas@heigl.org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
// Defining some markers
let lightIcon  = L.Icon.Default.mergeOptions({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
	iconUrl: require('leaflet/dist/images/marker-icon.png').default,
	shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
});
let darkIcon   = L.Icon.Default.extend({options: {iconUrl: 'img/marker-desat.png'}});
let redIcon    = L.Icon.Default.extend({options:{iconUrl: 'img/marker-icon-red.png'}});
let greenIcon  = L.Icon.Default.extend({options:{iconUrl: 'img/marker-icon-green.png'}});
let greenRedIcon = L.Icon.Default.extend({options:{iconUrl: 'img/marker-icon-green-red.png'}});
let orangeIcon = L.Icon.Default.extend({options:{iconUrl: 'img/marker-icon-orange.png'}});
let grayIcon   = L.Icon.Default.extend({options:{iconUrl: 'img/marker-gray.png'}});
let numberedIcon = L.Icon.extend({
	options: {
// EDIT THIS TO POINT TO THE FILE AT http://www.charliecroom.com/marker_hole.png (or your own marker)
		iconUrl: 'img/marker-green.png',
		number: '',
		shadowUrl: null,
		iconSize: new L.Point(25, 41),
		iconAnchor: new L.Point(13, 41),
		popupAnchor: new L.Point(0, -33),
		/*
		 iconAnchor: (Point)
		 popupAnchor: (Point)
		 */
		className: 'leaflet-div-icon'
	},

	createIcon: function () {
		var div = document.createElement('div');
		var img = this._createImg(this.options['iconUrl']);
		var numdiv = document.createElement('div');
		numdiv.setAttribute ( "class", "number" );
		numdiv.innerHTML = this.options['number'] || '';
		div.appendChild ( img );
		div.appendChild ( numdiv );
		this._setIconStyles(div, 'icon');
		return div;
	},

//you could change this to add a shadow like in the normal marker if you really wanted
	createShadow: function () {
		return null;
	}
});


//var oms = new OverlappingMarkerSpiderfier(map, {keepSpiderfied: true});
//oms.addListener('spiderfy', function(markers) {
//	map.closePopup();
//});

var openstreetmap = L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
	maxZoom: 18
})
// Create a tile-server for Esri-Satellite images
var esriSatellite = L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: '<a href="http://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP and the GIS User Community',
	maxZoom : 18
})

const cfp = L.layerJSON({
	url : 'https://api.joind.in/v2.1/events?filter=upcoming&verbose=yes&resultsperpage=100&tags[]=php',
	jsonpParam : 'callback',
	propertyLoc : ['latitude', 'longitude'],
	propertyTitle : 'name',
	filterData : function(e){
		let now = new Date();
		for (let i=0; i < e.events.length; i++) {
			delete e.events[i].icon;
			if (!e.events[i].cfp_end_date) {
				delete e.events[i];
				continue;
			}
			if (new Date(e.events[i].cfp_start_date) > now) {
				delete e.events[i];
				continue
			}
			if (new Date(e.events[i].cfp_end_date) < now) {
				delete e.events[i];
			}
		}
		return e.events;

	},
	buildPopup : function(e){
		var content = '<div class="popup">'
			+ '<h4>'
			+ '<a href="%url%" target="_blank">'
			+ '%name%'
			+ '</a>'
			+ '</h4>'
			+ '<dl><dt>CfP-Start:</dt><dd>%start%</dd><dt>CfP-End:</dt><dd>%end%</dd></dl>';

		if (center && center === e.shortname){
			map.setView(new L.LatLng(e.latitude,e.longitude), 8);
		}
		return content.replace('%url%', e.cfp_url)
			.replace('%name%', e.name)
			.replace('%start%', new Date(e.cfp_start_date).toUTCString())
			.replace('%end%', new Date(e.cfp_end_date).toUTCString())
	},
	buildIcon : function(e){
		var diff = Math.abs(new Date(e.cfp_end_date).getTime() - new Date().getTime());
		var days = Math.ceil(diff/(1000*3600*24));
		return new numberedIcon({number:days});
	},
	onEachMarker : function(e, marker) {
		oms.addMarker(marker);
		marker.bindLabel(e.name, {opacity:0.9});
		return;
	}
});

// Create a point-layer from the joind.in-API
const joindin = L.layerJSON({
	// Get the stuff from this URL
	url: "https://api.joind.in/v2.1/events?filter=upcoming&verbose=yes&resultsperpage=100&tags[]=php",
	// Add a json-callback to get around the same-origin-policy
	jsonpParam : 'callback',
	// Use the "latitude" and "longitude"-properties of the events as lat/lng
	propertyLoc : ['latitude', 'longitude'],
	// Use the "name"-Property as name for each point
	propertyTitle: 'name',
	// Filter the resultset from joind.in by removing the "icon"-property
	// of each event and returning only the "events"-property
	filterData: function(e){
		for (let i = 0; i< e.events.length; i++) {
			delete e.events[i].icon;
		}
		return e.events;
	},
	// Bind a popup to each event
	buildPopup : function(e){
		var content = '<div class="popup">'
			+ '<h4>'
			+ '<a href="%url%" target="_blank">'
			+ '%name%'
			+ '</a>'
			+ '</h4>'
			+ '<dl><dt>Start:</dt><dd>%start%</dd><dt>End:</dt><dd>%end%</dd></dl>';

		if (center && center === e.shortname){
			map.setView(new L.LatLng(e.latitude,e.longitude), 8);
		}
		return content.replace('%url%', e.website_uri)
			.replace('%name%', e.name)
			.replace('%start%', new Date(e.start_date).toUTCString())
			.replace('%end%', new Date(e.end_date).toUTCString())
	},
	buildIcon : function(data){
		return new orangeIcon;
	},
	onEachMarker : function(e, marker) {
		oms.addMarker(marker);
		marker.bindLabel(e.name, {opacity:0.9});
		return;
	}
});

var rawData;
var ugmarkers = [];

const phpug = L.layerJSON({
	caching       : false,
	url           : "https://api.php.ug/rest/listtype.json/1",
	propertyLoc   : ['latitude', 'longitude'],
	propertyTitle : 'name',
	buildPopup    : function (data) {
		var content = '<div class="popup">'
			+ '<h4>'
			+ '<a href="%url%" target="_blank">'
			+ '%name%'
			+ '</a>'
			+ '</h4>'
			+ '<h5>Next Event</h5>'
			+ '<div id="next_event_%shortname%" class="next_event">Getting next event...</div>'
			+ '%interests%'
			+ '<h5>Get in touch</h5>'
			+ '%contacts%'
			+ '</div>'
		;

		var interest = '<li class="label label-primary">%interest%</li>';
		var interests = [];

		var contact = '<a href="%url%" title="%value%" target="_blank">'
			+ '<i class="%cssClass% fa-solid"></i>'
			+ '</a>';
		var contacts = [];

		for (let i in data.tags){
			interests.push(
				interest.replace(/%interest%/, data.tags[i].name)
			);
		}
		let interestString = '';
		if (interests.length > 0) {
			interestString = '<h5 style="margin-bottom:0;">Interests</h5><ul>'
				+ interests.join("\n")
				+ '</ul>';
		}

		if (data.icalendar_url) {
			contacts.push(
				contact.replace(/%type%/, 'icalendar')
					.replace(/%url%/, data.icalendar_url)
					.replace(/%value%/, 'iCal-File')
					.replace(/%cssClass%/, 'fa-calendar fa-solid')
			);
		}

		for (let i in data.contacts) {
			let cont = data.contacts[i];
			contacts.push(
				contact.replace(/%type%/, cont.type.toLowerCase())
					.replace(/%url%/, cont.url)
					.replace(/%value%/, cont.name)
					.replace(/%cssClass%/, cont.cssClass)
			);
		}
		//if (data.edit) {
		//	var edit = '<a href="ug/edit/' + data.shortname + '" title="Edit"><i class="fa fa-edit"></i></a>';
		//	contacts.push(edit);
		//}
		contacts = contacts.join('</li><li>');
		if (contacts) {
			contacts = '<ul><li>' + contacts + '</li></ul>';
		}
		content = content.replace(/%url%/, data.url)
			.replace(/%name%/, data.name)
			.replace(/%shortname%/, data.shortname)
			.replace(/%contacts%/, contacts)
			.replace(/%interests%/, interestString)
		;

		if (center && center === data.shortname){
			map.setView(new L.LatLng(data.latitude,data.longitude), 8);
		}

		$('#ugtags').trigger('change');

		return content;
	},
	filterData : function(e){
		rawData = e.groups;
		// applyFilters();
		return rawData;
	},
	buildIcon : function(data){
		if (data.state === 0) {
			return new darkIcon();
		}
		if (data.state === 2) {
			return new grayIcon();
		}
		return new L.Icon.Default;
	},
	onEachMarker  : function(e, marker){
		//oms.addMarker(marker);
		marker.bindLabel(e.name, {opacity:0.9});
		ugmarkers.push(marker);
	}
});

// Overwrite layerjsons _onMove-function which then would call the update-function
// which then would reload the Markers...
phpug._onMove = function(){}

phpug.on('layeradd', function(){
	$('#custom-control-php  > div').show();
	//$('#ugtags').chosen({
	//	'placeholder_text_multiple' : 'Add tags to filter ...'
	//});
});

phpug.on('layerremove', function(){
	$('#custom-control-php > div').hide();
});


let currentFilters = [];

const addUgFilter = function(name){
	currentFilters.push(name);
}

const removeUgFilter = function(name){
	var index = currentFilters.indexOf(name);
	if (index > -1) {
		currentFilters.splice(index, 1);
	}
}

const removeAllUgFilters = function(){
	currentFilters = [];
}

const applyFilters = function() {
	for(let i = 0; i < ugmarkers.length; i++) {
		if(matchesFilters(ugmarkers[i])) {
			ugmarkers[i].setOpacity(1);
			$(ugmarkers[i]._icon).show();
		} else {
			ugmarkers[i].setOpacity(0);
			$(ugmarkers[i]._icon).hide();
		}
	}
}

const matchesFilters = function(marker)
{
	if (currentFilters.length === 0) {
		return true;
	}
	if (typeof marker.options.tags == 'undefined') {
		return false;
	}
	for(let i = 0; i < currentFilters.length; i++) {
		let items = $.grep(marker.options.tags, function(e){
			return e.name === currentFilters[i];
		});
		if(items.length === 0) {
			return false;
		}
	}
	return true;
}

var mentoringapp = L.layerJSON({
	url: "mentoring/app",
	propertyLoc : ['lat', 'lon'],
	propertyTitle : 'name',
	buildPopup : function(data){
		let url = 'https://php-mentoring.org/profile/';
		content = '<div class="popup">'
			+ '<h4>'
			+ '<a href="%url%" target="_blank">'
			+ '%name%'
			+ '</a> '
			+ '<a href="%github%"><i class="fa fa-github"></i></a>'
			+ '</h4>'
			+ '<h5>%location% - Looking for %looking%</h5>'
			+ '<p>%description%</p>';

		if (center && center.toLowerCase() === data.github.toLowerCase()){
			map.setView(new L.LatLng(data.lat,data.lon), 8);
		}
		var looking = 'apprentices';
		if (data.type === 'apprentice') {
			looking = 'mentorship';
		}
		if (data.type === 'both') {
			looking = 'mentorship and apprentices';
		}
		return content.replace('%url%', url + data.id)
			.replace('%name%', data.name)
			.replace('%location%', data.location)
			.replace('%github%', 'https://github.com/' + data.github)
			.replace('%description%', data.description)
			.replace('%looking%', looking)
			.replace('%type%', data.type);
	},
	filterData : function(e){
		items = [];
		for(let i in e) {
			if(e[i].lat == NaN) {
				e[i].lat = "0";
			}
			if(e[i].lon == NaN) {
				e[i].lon = "0";
			}
			e[i].lat = e[i].lat.toString();
			e[i].lon = e[i].lon.toString();
			items.push(e[i]);
		}

		return items;
	},
	onEachMarker : function(e,marker){
		oms.addMarker(marker);
		marker.bindLabel(e.name, {opacity:0.9});
		return;
	},
	buildIcon : function(data, title){
		if (data.type == 'mentor') {
			return new redIcon;
		}
		if (data.type == 'both') {
			return new greenRedIcon;
		}
		return new greenIcon;
	}
});

map.on('popupopen', function(p){
	var shortname = p.popup.getContent().match(/"next_event_([^"]+)"/)[1];
	if (! shortname){
		return false;
	}
	pushNextMeeting(p, shortname);
	return true;
});

var getQueryParameter = function(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split('&');
	for (let i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		if (decodeURIComponent(pair[0]) == variable) {
			return decodeURIComponent(pair[1]);
		}
	}

	return false;
}

var getUriGeolocation = function(){
	try {
		var obj = {
			lat : null,
			lng : null,
			zoom: 8
		};
		obj.lat = getQueryParameter('lat');
		obj.lng = getQueryParameter('lng');
		var mZoom = getQueryParameter('zoom');
		if (mZoom) obj.zoom = mZoom;
		if (!obj.lat || !obj.lng) return false;

		return obj;
	}catch(e){
		return false;
	}
}

var center = getQueryParameter('center');
var coord = new L.LatLng(0,0);
var zoom  = 2;
var loc = getUriGeolocation();
if(false !== loc) {
	coord.lat = loc.lat;
	coord.lng = loc.lng;
	zoom      = loc.zoom;
}else{
	navigator.geolocation.getCurrentPosition(function(position){
		coord.lat = position.coords.latitude;
		coord.lng = position.coords.longitude;
		zoom = 8;
		map.setView(coord, zoom);
		return true;
	},function(){
		return true;
	},{timeout:3000});
}

var tag=getQueryParameter('tag');
if (tag) {
	$('#ugtags').val(tag)
		.trigger('chosen:updated');
}

map.setView(coord, zoom);
map.addLayer(openstreetmap);

const layerControl = L.control.layers({
	'OpenStreetMap' : openstreetmap,
	'Satellite'  : esriSatellite
},{
	'PHP-Usergroups' : phpug,
//	'joind.in' : joindin,
//	'PHP-Mentoring': mentoringapp,
//	'Call for Papers' : cfp
},{
	'position' : 'bottomleft'
});

//map.addControl(layerControl);

switch(window.location.hash) {
	 case '#mentoring':
	 case '#mentoringapp':
	 	map.addLayer(mentoringapp);
	 	break;
	 case '#events':
	 case '#event':
	 case '#joindin':
	 case '#joind.in':
	 	map.addLayer(joindin);
	 	break;
	 case '#cfp':
	 	map.addLayer(cfp);
	 	break;

	 default:
		map.addLayer(phpug);
		break;
}

//var oms = new OverlappingMarkerSpiderfier(map, {keepSpiderfied: true});
//oms.addListener('spiderfy', function(markers) {
//	map.closePopup();
//});
//oms.clearListeners('click');
//oms.addListener('click', function(marker) {
//	var info = getContent(marker);
//	popup.setContent(info.desc);
//	popup.setLatLng(marker.getLatLng());
//	map.openPopup(popup, info.shortname);
//});

map.addControl( new L.Control.Search({
 	url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
 	jsonpParam: 'json_callback',
 	propertyName: 'display_name',
 	propertyLoc: ['lat','lon'],
 	circleLocation: true,
 	markerLocation: false,
 	autoType: false,
 	autoCollapse: true,
 	minLength: 2,
 	zoom:10
}));

var pushNextMeeting = function(popup, id)
{
	$.ajax({
		type: 'POST',
		url: "https://api.php.ug/v1/usergroup/next-event/" + id,
		dataTpye: 'json',
		context : {'id':id, 'popup':popup},
		success : function(a){
			var content='<h6><a href="%url%">%title%</a></h6><dl title="%description%"><dt>Starts</dt><dd>%startdate%</dd><dt>Ends</dt><dd>%enddate%</dd><dt>Location:</dt><dd>%location%</dd></dl>';
			content = content.replace(/%url%/g, a.url)
				.replace(/%title%/g, a.summary)
				.replace(/%startdate%/g, a.start)
				.replace(/%enddate%/g, a.end)
				.replace(/%description%/g, a.description)
				.replace(/%location%/g, a.location)
			;
			$('#next_event_' + this.id).html(content);
			var newContent = $('#next_event_' + this.id).closest('.popup').html();
			popup.popup.setContent(newContent);
			popup.popup.update();
		},
		error : function(a){
			$('#next_event_' + this.id).html('Could not retrieve an event.');
			var newContent = $('#next_event_' + this.id).parent('.popup').html();
			popup.popup.setContent(newContent);
			popup.popup.update();
		}
	})
}
