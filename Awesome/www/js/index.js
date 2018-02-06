/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
addr_ip="localhost";
addr_server_insert="http://"+addr_ip+"/db_insert.php";
addr_server_select="http://"+addr_ip+"/db_select.php";
addr_server_update="http://"+addr_ip+"/db_update.php";

json_add=[];
json_add_new=[];

com_name=document.getElementById("com_name");
area_name=document.getElementById("area_name");
tmac=document.getElementById("tmac");
parentDiv=document.getElementById("list_area");
parentDiv_mod=document.getElementById("list_area_mod");
wrapper=document.getElementById("wrapper");
wrapper_mod=document.getElementById("wrapper_mod");
complete=true;
obj_tosave=[];
obj_tomodify=[];
//file_tosave=[];
db_returned=[];
gps_=[];
scan_time=15000;
scan_num=0;
id_area=-1;
var loc_enabled;
//index_change=-1;
wrapper.style.visibility = "hidden"; 
wrapper_mod.style.visibility = "hidden"; 

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

    coreDialog.create({    
		title: "Information: <br><b>Turn on</b> your Wifi and your GPS.<br>Give the <b>permissions</b> at App.",
	    	actions: [
		{
		    title: "Ok",
		    onclick: function(el){
                      //console.log("quattro");
                      successCallback(false);
		    },
		    cls: "js-dialog-close",
		    removeOnClose: true
		}
	    ]
	});
}
function successCallback(res){
 	loc_enabled=res;
}
function errorCallback(err){
  	loc_enabled=false;
}
function writeFile(fileEntry, data) {
		fileEntry.createWriter(function (fileWriter) {
		    fileWriter.onwriteend = function (e) {
		        // for real-world usage, you might consider passing a success callback
		        alert('Successful file write...');
			};

		    fileWriter.onerror = function (e) {
		        // you could hook this up with our global error handler, or pass in an error callback
		        alert('Write failed: ' + e.toString());
		    };
		    fileWriter.write(data);
	      },fail);      
}

function _save(){
	finish_scan();
	clearTimeout(myTimout);
	wrapper_mod.style.visibility = "hidden"; 
	if(obj_tosave.length==0){
		coreToasts.create('No data to store',null,3000);
	}
	else{
		uploadDB();
	}
 	/*window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {

	    dir.getFile("calibration_file.txt", { create: true}, function (fileEntry) {

		writeFile(fileEntry, file_tosave); //save on local File

	    });

	});*/
}

function uploadFile(fileURL){
	var options = new FileUploadOptions();
	options.fileKey = "file";
	options.fileName = "calibration_file.txt";
	options.mimeType = "text/plain";
	options.chunkedMode = false;

	var ft = new FileTransfer();
	ft.upload(fileURL, encodeURI(addr_server+"home/ubuntu/upload.php"), onSuccess_UPL, onError_UPL,options);
}
function remove_bar_load(){
	var item_to_remove = document.getElementById("loader");
	if(item_to_remove!=null){
		parentDiv.removeChild(item_to_remove);
	}
}
function uploadDB(){
	var form_data = new FormData();
		form_data.append('json',JSON.stringify(obj_tosave));
		//upload(fileEntry.toURL());
		$.ajax({
		 type: "POST",
		 url:addr_server_insert,
		 data: form_data,
		 cache: false,
		 processData: false,
    	 contentType: false,
  		 dataType: "json",
	 	 success : function(d){
			coreToasts.create('Data stored',null,3000);
			if(json_add_new.length>0)
				json_envio = create_json("1",json_add_new);

			if(json_add.length>0)
				json_envio = create_json("2",json_add);
			console.log(json_envio);
			empty_array();
			resetAll();
			remove_bar_load();
			//alert(d.msg);
	    		//console.log("Upload done");
	  	 },
	  	 error: function(d){
			coreToasts.create('Error, data not saved',null,3000);
			//alert(d.msg);
	    		//console.log("Upload Error");
	  	 }
	});

}
function create_json(x,json_add){
	var strg;
	strg='{ "accionDB" : '+x+', "zonas" :';
	strg=strg + JSON.stringify(json_add);
	strg=strg+"}";
	return strg;
}
function empty_array(){
	while(json_add.length > 0) {
    		json_add.pop();
	}
	while(json_add_new.length > 0) {
    		json_add_new.pop();
	}
	while(obj_tosave.length > 0) {
    		obj_tosave.pop();
	}
}
function _stopLocalisation(){
	finish_scan();
	remove_bar_load();
	clearTimeout(myTimout);
	wrapper_mod.style.visibility = "hidden"; 
}
function _fillList(gps_){
	obj_tosave.push({"company":com_name.textContent,"area":area_name.value,"idarea":id_area,"tmac":tmac.value,"latitude":gps_[0],"longitude":gps_[1],"timestamp":tt,"num":scan_num});
	//file_tosave.push({"company":com_name.textContent,"area":area_name.value,"tmac":tmac.value,"latitude":gps_[0],"longitude":gps_[1],"timestamp":tt,"num":num.value});
	console.log({"company":com_name.textContent,"area":area_name.value,"idarea":id_area,"tmac":tmac.value,"latitude":gps_[0],"longitude":gps_[1],"timestamp":tt,"num":scan_num});
	remove_bar_load();
	var div = document.createElement('div');
	div.setAttribute('class','div-example');
	var li = document.createElement('li');
	li.setAttribute('class','list-item with-second-label');
	var span = document.createElement('span');
	span.setAttribute('class','label');
	span.innerHTML= "Area: "+area_name.value;
	var secspan = document.createElement('span');
	secspan.innerHTML= tt;
	secspan.setAttribute('class','second-label');			
	li.appendChild(span);
	li.appendChild(secspan);
	div.appendChild(li);	
	parentDiv.appendChild(div);
	var div_line = document.createElement('div');
	div_line.setAttribute('class','div-line');	
	parentDiv.appendChild(div_line);
	var div = document.createElement('div');
	div.setAttribute('data-role','progress');
	div.setAttribute('data-type','circle');
	div.setAttribute('class','prog-b');

	div.id="loader";
	parentDiv.appendChild(div);
}


function onSuccess_GEO(position) {
	gps_[0]= position.coords.latitude;
	gps_[1]= position.coords.longitude;
	_fillList(gps_);
}
 
function onError_GEO(error) {
	gps_[0]= -1;
	gps_[1]= -1;
	_fillList(gps_);
}

function _startLocalisation(){
    successCallback(false);
    //cordova.plugins.diagnostic.isLocationEnabled(successCallback, errorCallback);
	if(complete){
		if(area_name.value!="" && tmac.value!=""){
			wrapper.style.visibility = "visible";
			wrapper_mod.style.visibility = "hidden"; 
			start_scan();
			get_scanNumber(scan_num);
		}
		else{
			coreToasts.create('You need to fill the form before scanning',null,3000);

		}
	}
	//localisation();
	   
}

function getMax(arr, prop) {
    var max=0;
    for (var i=0 ; i<arr.length ; i++) {
	if (parseInt(arr[i][prop]) > max)
	    max = parseInt(arr[i][prop]);
    }
    return max;
}

function get_scanNumber(scan_num){
		//upload(fileEntry.toURL());
		var form_data = new FormData();
		form_data.append('funct','getjustnumber');		
		form_data.append('c_name',com_name.textContent);
		form_data.append('area_name',area_name.value);
		$.ajax({
		 type: "POST",
		 url: addr_server_select,
		 data: form_data,
		 cache: false,
		 processData: false,
    	 	contentType: false,
  		 dataType: "json",
	 	 success : function(result){
			//num=getMax(result,'scantime');
			if((result[0]['max(scantime)'])!=""){
				swap_scan(result[0]['max(scantime)']);
			}
			incrementa();
			get_Areaid();
	  	 },
	  	 error: function(d){
			coreToasts.create('Error, data not retrieved',null,3000);
	  	 }
	});
}

function get_Areaid(){
		//upload(fileEntry.toURL());
		var form_data = new FormData();
		form_data.append('funct','getareaname');		
		form_data.append('c_name',com_name.textContent);
		$.ajax({
		 type: "POST",
		 url: addr_server_select,
		 data: form_data,
		 cache: false,
		 processData: false,
    	 	 contentType: false,
  		 dataType: "json",
	 	 success : function(result){
			id_area=-1;
			isnewarea=false;
			for (var i=0 ; i<result.length ; i++) {
				//console.log(result[i]['Area']+" "+result[i]['idArea']);
				if((result[i]['Area'])==area_name.value){
					swap_id(result[i]['idArea']);
					//console.log("swap "+id_area);
				}
			}
			if(id_area==-1){
				id_area=getArea(result,'idArea');
				isnewarea=true;
				//console.log("noswap "+id_area);		
			}
			if(isnewarea){
   	 	             json_add_new.push({"company":com_name.textContent,"area":area_name.value,"idarea":id_area,"mac":tmac.value});			
			}
			else{    			
			      json_add.push({"company":com_name.textContent,"area":area_name.value,"idarea":id_area,"mac":tmac.value});
			}
			//console.log("newarea "+id_area);		
			localisation();
	  	 },
	  	 error: function(d){
			coreToasts.create('Error, data not retrieved',null,3000);
	  	 }
	});
}

function _clear(){
	resetAll();
	remove_bar_load();
	wrapper.style.visibility = "hidden"; 
	wrapper_mod.style.visibility = "hidden"; 
	finish_scan()
	clearTimeout(myTimout);
	empty_array();
	//file_tosave=[];
	    

}
function onError_GEO_err(){
	coreToasts.create('Error with geolocalization',null,3000);
}
function incrementa(){
	scan_num=scan_num+1;
}
function swap_scan(x){
	scan_num=parseInt(x);
}
function swap_id(x){
	id_area=parseInt(x);
}
function localisation(){
	tt= new Date()
	gps_=[-1,-1];
	if(loc_enabled){
		navigator.geolocation.getCurrentPosition(onSuccess_GEO, onError_GEO_err);
	}
	else{
		onError_GEO();
	}
	myTimout=setTimeout(function(){
		if(!complete){
			localisation();
		}
	},scan_time);
}
function getArea(arr,prop) {
    var idx=0;
    found=false;
    while(!found){

	found=true;
	for (var i=0 ; i<arr.length ; i++) {
		if(arr[i][prop]==idx){
			found=false;
		}
	}
	if(!found){
		idx=idx+1;
	}
    }
    return idx;
}
function _showArea(){
	remove_bar_load();
	resetAll();
	index_change=-1;
	while(obj_tomodify.length > 0) {
    	obj_tomodify.pop();
	}
	var form_data = new FormData();
	form_data.append('funct','getareaname');		
	form_data.append('c_name',com_name.textContent);
	$.ajax({
		 type: "POST",
		 url:addr_server_select,
		 data: form_data,
		 cache: false,
		 processData: false,
    	 contentType: false,
  		 dataType: "json",
	 	 success :function(result){
	 	 	wrapper_mod.style.visibility = "visible";
			if(result.length==0){
					var li = document.createElement('li');
	   				li.setAttribute('class','list-item with-second-label');
	 				var span = document.createElement('span');
	   				span.setAttribute('class','label');
					span.innerHTML="No Area Found";
  					li.appendChild(span);
					parentDiv_mod.appendChild(li);	
			}
			else{
				for (var i=0 ; i<result.length ; i++) {
					obj_tomodify.push({"idarea":result[i]['idArea'],"area":result[i]['Area'],"company":result[i]['Company'],"idli":'li'+i});
	 				var li = document.createElement('li');
	   				li.setAttribute('class','list-item with-second-label');
	 				var span = document.createElement('span');
	   				span.setAttribute('class','label');
					span.innerHTML= result[i]['idArea']+" "+result[i]['Area']
	 				var secspan = document.createElement('span');
					secspan.innerHTML= result[i]['Company']
	   				secspan.setAttribute('class','second-label');
	   				li.id='li'+i;
    					li.appendChild(span);
	    				li.appendChild(secspan);
	    				li.addEventListener('click', function(){
					remove_select();	    				
	    				index_change=$("#"+this.id).index();
	    				document.getElementById(this.id).classList.add("list-selected");
	    			});
				
					parentDiv_mod.appendChild(li);					
	    			}
			}			
	  	 },
	  	 error: function(d){
			coreToasts.create('Error, data not retrieved',null,3000);
	  	 }
	});

}

function remove_select(){
	for (var i=0 ; i<obj_tomodify.length ; i++) {
		document.getElementById(obj_tomodify[i]['idli']).classList.remove("list-selected");
	}
}

function resetAll(){
	while (parentDiv.firstChild) {
    		parentDiv.removeChild(parentDiv.firstChild);
	}
	while (parentDiv_mod.firstChild) {
    		parentDiv_mod.removeChild(parentDiv_mod.firstChild);
	}
}
function _deleteArea(){
	json_del=[];
	if(index_change>=0){
    	coreDialog.create({    
			title: 'Are you sure to delete "'+obj_tomodify[index_change]['area']+'" ?',
		    actions: [
			{
			    	title: "Ok",
			    	onclick: function(el){
				json_del.push({"company":obj_tomodify[index_change]['company'],"area":obj_tomodify[index_change]['area'], "idarea":obj_tomodify[index_change]['idarea']});
					deleteOnDB(obj_tomodify[index_change]['area'],obj_tomodify[index_change]['company']);
				},
		   		cls: "js-dialog-close",
		    	removeOnClose: true
			},
			{
				    title: "Cancel",
				    cls: "js-dialog-close",
				    removeOnClose: true
			}]
		});
    }
    else{
    	coreToasts.create('No Area Selected',null,3000);
    }

}
function _renameArea(){
	json_ren=[];
	if(index_change>=0){
	    coreDialog.create({    
			title: 'New name for "'+obj_tomodify[index_change]['area']+'":<br><input type="text" id="new_name">',
		    	actions: [
			{
			    title: "Ok",
			    onclick: function(el){
					new_name=document.getElementById("new_name").value;
					if (new_name!=""){
						json_ren.push({"company":obj_tomodify[index_change]['company'],"area":obj_tomodify[index_change]['area'], "idarea":obj_tomodify[index_change]['idarea'],"newname":new_name});
						renameOnDB(new_name,obj_tomodify[index_change]['area'],obj_tomodify[index_change]['company']);
					}
			    },
			    cls: "js-dialog-close",
			    removeOnClose: true
			},
			{
			    title: "Cancel",
			    cls: "js-dialog-close",
			    removeOnClose: true
			}
		    ]
		});
	}
	else{
    	coreToasts.create('No Area Selected',null,3000);
    }
}
function deleteOnDB(areaname,compname){
	var form_data = new FormData();
	form_data.append('funct','deletearea');		
	form_data.append('areaname',areaname);
	form_data.append('compname',compname);
	$.ajax({
	 type: "POST",
	 url:addr_server_update,
	 data: form_data,
	 cache: false,
	 processData: false,
	 contentType: false,
	 dataType: "json",
 	 success: function(result){
		coreToasts.create('Area Deleted',null,3000);
		json_envio = create_json("4",json_del);
		console.log(json_envio);
		_showArea();
	 },
	 error: function(d){
		coreToasts.create('Error DB Internal',null,3000);
	 }
	});

}
function finish_scan(){
	complete=true;
}
function start_scan(){
	complete=false;
}
function renameOnDB(newname,oldname,compname){
	var form_data = new FormData();
	form_data.append('funct','setareaname');		
	form_data.append('newname',newname);
	form_data.append('areaname',oldname);
	form_data.append('compname',compname);
	$.ajax({
	 type: "POST",
	 url:addr_server_update,
	 data: form_data,
	 cache: false,
	 processData: false,
	 contentType: false,
	 dataType: "json",
 	 success: function(result){
 	 	console.log(result);
		coreToasts.create('Area Renamed',null,3000);
		json_envio = create_json("3",json_ren);
		console.log(json_envio);
		_showArea();
	 },
	 error: function(error){
	 	 	console.log(error);
		coreToasts.create('Error DB Internal',null,3000);
	 }
	});

}
function onSuccess_UPL (r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
}

function onError_UPL(error) {
    coreToasts.create('An error has occurred',null,3000);
    console.log("upload error source " + error.message);
    console.log("upload error target " + error.target);
}

