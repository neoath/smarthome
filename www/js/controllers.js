angular.module('starter.controllers', [])

////////////////////////////////////////////////////////////////////////////////////////////////////////
//数据
.controller('MainCtrl', function($scope, $ionicSideMenuDelegate, $ionicPopover, $state, $timeout) {
  $scope.global = { cust_id : 0 };
  $scope.user = { Id: 1, Name: 'Admin', Email: 'admin@test.domain', Phone: '13609876543', Tel: '02129807893', 
                  EmergMan1: 'AdminEmerg1', EmergMan1Phone: '13609876542',EmergMan2: 'AdminEmerg2', 
                  EmergMan2Phone: '13609876541', address: '浦东新区耀华路120弄121号102' };

  $scope.version = {"Platform":"","UpdateTime":"","DownloadAddr":"","CurrentVersion_no":"","LastestVersion_no":"","UpdateContent":"","IsUpdate":""};

  $scope.subUsers = [{Id:1,Name:'子账号1'}];

  $scope.users = [
		{ username: 'Admin', email: 'admin@test.domain', location: true, id: 'admin', avatar: 'img/men.jpg', enabled: 'true', lastLogin: 'Online' },
		{ username: 'Stacy S', email: 'stacy@test.domain', location: true, id: 'stacy', avatar: 'img/girl.jpg', enabled: 'true', lastLogin: 'Last login: 01/09/2014' },
		{ username: 'Mom', email: 'mom@test.domain', location: false, id: 'mom', avatar: 'img/noavatar.png', enabled: 'false', lastLogin: 'Last login: never' },
	];
	$scope.device = { id: null, name: 'No Device', icon: 'ion-ios7-help-empty', status: 'Offline' },
	$scope.devices = [
		{ id: '1', name: 'Thermostat (bedroom)', icon: 'ion-thermometer', status: 'Away', featured: true, userSelect: "stacy", actionSelect: "3" },
		{ id: '2', name: 'Coffee Machine', icon: 'ion-coffee', status: 'Finished', color: 'balanced', featured: true, userSelect: "mom", actionSelect: null },
		{ id: '3', name: 'Smoke Sensor', icon: 'ion-no-smoking', status: 'Idle', color: 'assertive', featured: true, userSelect: "admin", actionSelect: null },
		{ id: '4', name: 'Garage', icon: 'ion-model-s', status: 'Car Inside', featured: true, userSelect: "admin", actionSelect: "6" },
		{ id: '5', name: 'House Security', icon: 'ion-locked', status: 'Unarmed', color: 'assertive', featured: true, userSelect: "admin", actionSelect: "7"},
		{ id: '6', name: 'Fan (WC)', icon: 'ion-load-b', status: 'Working', color: 'balanced', userSelect: "admin", actionSelect: null },
		{ id: '7', name: 'Desktop PC', icon: 'ion-social-windows', status: 'Online', color: 'balanced', featured: true, userSelect: "admin", actionSelect: null },
		{ id: '8', name: 'Stacy\'s Laptop', icon: 'ion-social-apple', status: 'Online', color: 'balanced', userSelect: "stacy", actionSelect: null },
		{ id: '9', name: 'Media Center (torrent downloader)', icon: 'ion-social-tux', status: 'Online', color: 'balanced', userSelect: "admin", actionSelect: null },
		{ id: '10', name: 'Unknow Smartphone', icon: 'ion-social-android', status: 'Offline', color: 'assertive', userSelect: "admin", actionSelect: null },
		{ id: '11', name: 'Room 1 Lights', icon: 'ion-ios7-lightbulb', userSelect: "admin", actionSelect: "1" },
		{ id: '12', name: 'Room 2 Lights', icon: 'ion-ios7-lightbulb', userSelect: "admin", actionSelect: "1" },
		{ id: '13', name: 'Room 3 Lights', icon: 'ion-ios7-lightbulb', userSelect: "admin", actionSelect: "1" },
		{ id: '14', name: 'Lawn Lights', icon: 'ion-ios7-lightbulb', userSelect: "admin", actionSelect: "5" },
	];
	$scope.locations = [
		{ id: '1', name: 'Kitchen', icon: 'ion-fork', note: 'For mum', featured: true },
		{ id: '2', name: 'WC', icon: 'ion-waterdrop', note: 'Occupied', featured: true },
	];
	$scope.actions = [
		{ id: '1', name: 'Lawn Lights Brightness', type: "range", value: '68', minValue : "0", maxValue : "100", units: "%", iconBefore: 'ion-ios7-lightbulb-outline', iconAfter: 'ion-ios7-lightbulb', deviceSelect : "", script: "", featured: true },
		{ id: '2', name: 'Smart Grid Power', type: "range", value: '24', minValue : "0", maxValue : "100", units: "%", iconBefore: 'ion-ios7-bolt-outline', iconAfter: 'ion-ios7-bolt', deviceSelect : "", script: "", featured: false },
		{ id: '3', name: 'Temperature', type: "range", value: '40', minValue : "-20", maxValue : "80", units: "°", iconBefore: 'ion-ios7-snowy', iconAfter: 'ion-ios7-sunny-outline', deviceSelect : "", script: "", featured: true },
		{ id: '4', name: 'Popcorn Time', type: "toggle", featured: false },
		{ id: '5', name: 'Good Night', type: "toggle", featured: true },
		{ id: '6', name: 'Open Garage Doors', type: "toggle", featured: false },
		{ id: '7', name: 'Arm Securuty', type: "toggle", featured: false },
	];
   $scope.nodeViewModel = {
    node:""
   };

  $scope.OverViewViewModel = {
    OverStatus:"normal"
  };

  $scope.ArmViewModel = { checked: true };
  $scope.DevicesViewModel = {
    devices : [
        {
            "id": 2,
            "name": "TY's 设备",
            "deviceId": "7CEC7939212C",
            "status": "ONLINE",
            "alertStatus": "SET",
            "deviceType": "HOMEGATEWAY",
            "lastHeartBeat": "2016-06-17 04:12:39",
            "isDeleted": false,
            "createAt": "2016-06-17 04:12:39",
            "account": {
                "accountId": 1,
                "cellPhone": "15687877676",
                "location": null,
                "createAt": "2016-06-17 04:12:39"
            },
            "armStatus":false
        },
        {
            "id": 1,
            "name": "设备一",
            "deviceId": "7CEC793924C3",
            "status": "ONLINE",
            "alertStatus": "SET",
            "deviceType": "HOMEGATEWAY",
            "lastHeartBeat": "2016-06-17 04:12:39",
            "isDeleted": false,
            "createAt": "2016-06-17 04:12:39",
            "account": {
                "accountId": 1,
                "cellPhone": "15687877676",
                "location": null,
                "createAt": "2016-06-17T04:12:39Z"
            },
            "armStatus":false
        }
  ]
  };  
  $scope.NodesViewModel ={
    nodeType:"",
    nodes:[
                    {
                          "id": 1,
                          "nodeId": "A712736253627172837166ABF36379FA",
                          "nodeType": "红外感应",
                          "name": "红外感应1Name",
                          "alert": "正常",
                          "alertTime": "2016-06-17T06:09:33Z",
                          "dataset_set": [
                                                    {
                                                        "id": 1,
                                                        "dataSetId": 1,
                                                        "alert": true,
                                                        "alertTime": "2016-06-17T06:09:14Z",
                                                        "node": 1,
                                                        "dataSetMetaData": 1
                                                    },
                                                    {
                                                        "id": 2,
                                                        "dataSetId": 2,
                                                        "alert": false,
                                                        "alertTime": "2016-06-17T04:13:24Z",
                                                        "node": 1,
                                                        "dataSetMetaData": 1
                                                    },
                                                    {
                                                        "id": 4,
                                                        "dataSetId": 8,
                                                        "alert": false,
                                                        "alertTime": "2016-06-17T04:13:24Z",
                                                        "node": 1,
                                                        "dataSetMetaData": 1
                                                    },
                                                    {
                                                        "id": 6,
                                                        "dataSetId": 4,
                                                        "alert": false,
                                                        "alertTime": "2016-06-17T04:13:24Z",
                                                        "node": 1,
                                                        "dataSetMetaData": 4
                                                    }
                                                ]
                    },
                    {
                          "id": 2,
                          "nodeId": "FF12736253627172837166ABF36379FF",
                          "nodeType": "门磁",
                          "name": "门磁1Name",
                          "alert": "正常",
                          "alertTime": "2016-06-17T04:13:24Z",
                          "dataset_set": [
                                                    {
                                                        "id": 3,
                                                        "dataSetId": 1,
                                                        "alert": false,
                                                        "alertTime": "2016-06-17T04:13:24Z",
                                                        "node": 2,
                                                        "dataSetMetaData": 1
                                                    },
                                                    {
                                                        "id": 5,
                                                        "dataSetId": 2,
                                                        "alert": false,
                                                        "alertTime": "2016-06-17T04:13:24Z",
                                                        "node": 2,
                                                        "dataSetMetaData": 1
                                                    },
                                                    {
                                                        "id": 7,
                                                        "dataSetId": 8,
                                                        "alert": false,
                                                        "alertTime": "2016-06-17T04:13:24Z",
                                                        "node": 2,
                                                        "dataSetMetaData": 1
                                                    },
                                                    {
                                                        "id": 8,
                                                        "dataSetId": 4,
                                                        "alert": false,
                                                        "alertTime": "2016-06-17T04:13:24Z",
                                                        "node": 2,
                                                        "dataSetMetaData": 4
                                                    }
                                                ]
                    }
                ],
    nodeList:[
                    { id: '0', name: '电子钥匙', icon: 'ion-locked',  nodeType: '0'},
                    { id: '1', name: '门磁', icon: 'ion-magnet', nodeType: '1'},
                    { id: '2', name: '红外感应 ', icon: 'ion-wifi', nodeType: '2'},
                    { id: '3', name: '烟雾报警器', icon: 'ion-flame',  nodeType: '3'},
                    { id: '4', name: '温度传感器', icon: 'ion-bonfire',  nodeType: '4'}
                  ]
    
   }

	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
	$scope.deviceTap = function(route, device) {
		$scope.device = device;
		$state.go(route);
	};
  $scope.pageJump = function(route) {
    $state.go(route);
  };    
	$ionicPopover.fromTemplateUrl('templates/alerts.html', {
		scope: $scope,
	}).then(function(popover) {
		$scope.popover = popover;
	});
	$scope.openAlerts = function($event) {
		$scope.popover.show($event);
	};
	$scope.closeAlerts = function() {
		$scope.popover.hide();
	};
	$scope.$on('$destroy', function() {
		$scope.popover.remove();
	});
	$timeout(function () {
		ionic.EventController.trigger("resize", "", true, false);
	}, 1500);
})
////////////////////////////////////////////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
//首页 app.overview overview.html
.controller('OverViewCtrl', function($q, $scope, $ionicSideMenuDelegate, $ionicPopover, $state, $timeout, $http,$ionicLoading, locals) {
  $scope.DataReq = function(){
    $ionicLoading.show({
      templateUrl:"templates/loading.html",
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    console.log(locals.get("cust_id",""));
    if (!locals.get("cust_id",""))
      $state.go("app.login"); 

    //用户信息 dc接口
    var apibranch = '/account/detail';
    var reqd = {"cust_id":$scope.global.cust_id};
    var req = httpReqGen(apibranch,reqd);

    var deferred = $q.defer();
    $http(req).then(function(response) {
      var ssss = response;
      var resData = "";
      if(response.status == 200){
        var resData = $.parseJSON(response.data.result);
        var objectData = resData.data;
        $scope.newuser = $scope.user;
        
        $scope.newuser.Id = objectData.cust_id;
        $scope.newuser.Name = objectData.name;
        $scope.newuser.Email = objectData.email;
        $scope.newuser.Phone = objectData.phone;
        $scope.newuser.Tel = objectData.tel;
        $scope.newuser.EmergMan1 = "";
        $scope.newuser.EmergMan1Phone ="";
        $scope.newuser.EmergMan2 = "";
        $scope.newuser.EmergMan2Phone = "";
        $scope.newuser.Addr = objectData.address;
        
        $scope.user = $scope.newuser;
      }
        deferred.resolve();
    }, function(error) {
        deferred.reject();
    });

    //主机、节点信息 xw接口
    
    //天气
     var url = 'http://apis.baidu.com/heweather/weather/free?city=shanghai';
      var head = {
                    'apikey':'8c389785a8f4c903b97f64982ed199bb',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept': '*/*'
               };
      var wreq = httpTESTGen(url,head);           
      $http(wreq).success(function(data){
            var datas = data['HeWeather data service 3.0'][0];

            var aqi = datas.aqi.city.aqi;
            var pm25 = datas.aqi.city.pm25;
            var pm10 = datas.aqi.city.pm10;

            var code1 = datas.daily_forecast[0].cond.code_d;
            var desc1 = datas.daily_forecast[0].cond.txt_d;
            var hum1 = datas.daily_forecast[0].hum;
            var tmp1min = datas.daily_forecast[0].tmp.min;
            var tmp1max = datas.daily_forecast[0].tmp.max;

            var code2 = datas.daily_forecast[1].cond.code_d;
            var desc2 = datas.daily_forecast[1].cond.txt_d;
            var hum2 = datas.daily_forecast[1].hum;
            var tmp2min = datas.daily_forecast[1].tmp.min;
            var tmp2max = datas.daily_forecast[1].tmp.max;

            var result = {
                    PM25:pm25,  
                    TodayDesc: desc1,
                    TodayHum: hum1,
                    TodayMin: tmp1min,
                    TodayMax: tmp1max,

                    TomorrowDesc: desc2,
                    TomorrowHum: hum2,
                    TomorrowMin: tmp2min,
                    TomorrowMax: tmp2max,
                };
            console.log(result);
            $scope.weatherObj = result;         
          }).error(function(){});     
    
    $timeout(function () {
        $ionicLoading.hide();
      }, 500);
  }

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.nodeTypeTap = function(route, nodes, detType) {
    $scope.NodesViewModel.nodes = nodes;
    $scope.NodesViewModel.nodeType = detType;
    $state.go(route);
  };
  $scope.nodeTap = function(route, node) {
    $scope.nodeViewModel.node = node;
    $state.go(route);
  };  
  $scope.pageJump = function(route) {
    $state.go(route);
  };    
  $ionicPopover.fromTemplateUrl('templates/alerts.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });
  $scope.openAlerts = function($event) {
    $scope.popover.show($event);
  };
  $scope.closeAlerts = function() {
    $scope.popover.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  $timeout(function () {
    ionic.EventController.trigger("resize", "", true, false);
  }, 1500);  
})
//布防 app.arm arm.html
.controller('ArmCtrl', function($scope, $state, locals) {
    if (!locals.get("cust_id",""))
      $state.go("app.login"); 
})

//摄像头 app.camera camera.html
.controller('CameraCtrl', function($scope, $http, $state, locals){ 
    if (!locals.get("cust_id",""))
      $state.go("app.login"); 

  $scope.init = function() {
    var url = 'http://t.xinlaihome.cn:8001/api/app/1.0/account/1/device';
      var head = {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept': '*/*'
               };
          var wreq = httpTESTGen(url,head);           
          $http(wreq).success(function(data){
            
            alert(data.devices[1].name);
          }).error(function(){});    
     //alert("尚未提供添加摄像头接口");
    };
})

////////////////////////////////////////////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
//添加设备 app.addNode add-node.html
.controller('addNode', function($scope, $state, locals) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 

  $scope.nodes = [
    { nodename: 'Door Magnet', email: 'admin@test.domain', location: true, id: 'admin', avatar: 'img/men.jpg', enabled: 'true', lastLogin: 'Online',nodetype:'doormagnet' },
    { nodename: 'Infra Sensor', email: 'stacy@test.domain', location: true, id: 'stacy', avatar: 'img/girl.jpg', enabled: 'true', lastLogin: 'Online',nodetype:'infrasensor' },
    { nodename: 'Smoke Sensor', email: 'mom@test.domain', location: true, id: 'mom', avatar: 'img/men.png', enabled: 'true', lastLogin: 'Online' ,nodetype:'smokesensor'},
    { nodename: 'Gas Sensor', email: 'mom@test.domain', location: true, id: 'mom', avatar: 'img/men.png', enabled: 'true', lastLogin: 'Online' ,nodetype:'gassensor'},
    { nodename: 'E-Key', email: 'mom@test.domain', location: true, id: 'mom', avatar: 'img/men.png', enabled: 'true', lastLogin: 'Online' ,nodetype:'ekey'},
    { nodename: 'Camera', email: 'mom@test.domain', location: true, id: 'mom', avatar: 'img/men.png', enabled: 'false', lastLogin: 'Online' ,nodetype:'camera'},
  ]; 
  $scope.devices = [
    { devicename: 'Device1', id: 'dv1'},
    { devicename: 'Device2', id: 'dv2'},
    { devicename: 'Device3', id: 'dv3'},
  ];      
  $scope.setFormScope = function(scope){
    this.formScope = scope;
  }
  $scope.newnode = {};
  $scope.nodeSubmit = function() {
    alert("尚未提供添加节点接口");
  };
})
////////////////////////////////////////////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
//用户 app.usersetting usersetting.html
.controller('usersetting', function($scope, $state, locals) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 

  $scope.logout = function() {
    alert(locals.get("cust_id",""));
    //存储数据
    locals.set("username",'');
    locals.set("cust_id", '');
    console.log('cust_id: ' + locals.get("cust_id",""));
    $state.go('app.login');
  }
})
/////////////////////////////////////////////////       
//个人信息 app.userinfo userinfo.html
.controller('updateUser', function($scope, $q, $http, $state, locals) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 

  var requestData = {
      cust_id: $scope.global.cust_id,
    };
  console.log(requestData);
  var apibranch = '/account/detail';
  var request = httpReqGen(apibranch,requestData);

  $http(request).then(function(response) {
      console.log(response);
      var result = $.parseJSON(response.data.result);
      if (result.code == 0000){
          var data = result.data;
          console.log(data);
      } else {
        alert(result.msg);
      }
    }, function(error) {
      console.log(error);
    });

  $scope.setFormScope = function(scope){
    this.formScope = scope;
  }

  $scope.newuser = $scope.user;
  $scope.userSubmit = function() {
    if(!$scope.newuser.Name) {
      alert('Username required');
      return;
    }
    var userid = $scope.user.cust_id;
    var code = getReqNo();
    var requestdata = '{"cust_id":"' + $scope.newuser.Id + '", "tel":"' +$scope.newuser.Tel +
                '", "email": "' + $scope.newuser.Email + '", "address": "' + $scope.newuser.Addr +'"}';
    var reqParam = {
      code: code,
      url: 'http://139.196.13.82/xinlai/account/upgrade?req_no=' + code,
      requestData: requestdata,
      method: 'POST',
      };
    var req = {
      method: reqParam.method,
      url: reqParam.url,
      data: reqParam.requestData
    };

    var deferred = $q.defer();
    $http(req).then(function(response) {
      var resData = "";
      if(response.status == 200){
        alert('User Info updated!');
        $state.go('app.usersetting');
      }
        deferred.resolve();
    }, function(error) {
        deferred.reject();
    });
  };
})
//子账号 app.subusers subusers.html
.controller('subUserCtrl', function($scope, $state, $http) {

  $scope.delete = function(item){
    //删除子账号业务
  }
  $scope.edit = function(item){
    //编辑子账号业务
  }  

  $scope.pageJump = function(route) {
    $state.go(route);
  };  
})
//子账号 app.subuserinfo subuserinfo.html
.controller('addSubUser', function($scope, locals) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 

  $scope.setFormScope = function(scope){
    this.formScope = scope;
  }
  $scope.newuser = {};
  $scope.userSubmit = function() {
    alert("尚未提供添加子账户接口");
  };
})
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//更改密码 app.changepassword changepassword.html
.controller('PasswordCtrl', function($scope,$q,$http,$state, locals) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 
  
  $scope.setFormScope = function(scope){
    this.formScope = scope;

  }
  $scope.codeform = {};
  $scope.changePW = function() {
    if(!$scope.codeform.oldPW || !$scope.codeform.newPW || !$scope.codeform.confirmPW) {
      alert('请填写');
      return;
    }
    if($scope.codeform.newPW != $scope.codeform.confirmPW) {
      alert('新密码输入不一致');
      return;
    }    
    var apibranch = '/account/updatepwd';

    var oldpw = hex_md5($scope.codeform.oldPW).toUpperCase();
    var newpw = hex_md5($scope.codeform.newPW).toUpperCase();
    var id = $scope.global.cust_id;
    var reqobj = {
      "cust_id":id,
      "old_pwd":oldpw,
      "new_pwd":newpw
    };
    var req = httpReqGen(apibranch,reqobj);

    var deferred = $q.defer();
    $http(req).then(function(response) {
      var resData = "";
      if(response.status == 200){
        var resData = $.parseJSON(response.data.result);
        if(resData.code == "0000"){
          alert('密码已修改');
          $state.go("app.usersetting");           
        }
        else{
          alert('密码修改失败');
        }
      }
      else
        alert('密码修改失败');
      deferred.resolve();
    }, function(error) {
        deferred.reject();
    });
  };
})  
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//版本控制 app.version version.html
.controller('VersionCtrl', function($scope,$http,$q, locals){
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 

  $scope.init = function(){

    var apibranch = '/app/upgrade';
    var platform = "Android";
    var version = "2.0.0";
    var reqd = {"platform":platform,"app_version":version};
    reqd = JSON.stringify(reqd);
    var req = httpReqGen(apibranch,reqd);

    var deferred = $q.defer();
    $http(req).then(function(response) {
      var resData = "";
      if(response.status == 200){
        var resData = $.parseJSON(response.data.result);
        if(resData.code != "0000"){
          alert("数据接口有误: " + resData.code);
          //return;
        }
        var objectData = resData.data;

        $scope.newver = $scope.version;
        $scope.newver.Platform = objectData.platform;
        $scope.newver.UpdateTime = objectData.public_time;
        $scope.newver.DownloadAddr = objectData.down_addr;
        $scope.newver.CurrentVersion_no = version;
        $scope.newver.LastestVersion_no = objectData.version_no;
        $scope.newver.UpdateContent = objectData.update_content;
        $scope.newver.IsUpdate = objectData.is_update;       
        $scope.version = $scope.newver;
      }
        deferred.resolve();
    }, function(error) {
        deferred.reject();
    }); 
  }
})
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//帮助 app.help help.html
.controller('HelpCtrl', function($scope){ 
})
/////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
//设置 app.settings settings.html
.controller('settings', function($scope, $state, locals) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 

})
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//主机设备绑定管理 app.devicemanage devicemanage.html
.controller('DeviceNodeBindingManageCtrl', function($scope){ 
})
////////////////////
//添加主机 app.deviceinfo deviceinfo.html
.controller('addDevice', function($scope) {
  $scope.init = function(){
    alert("添加主机接口尚未提供");
  }
})
////////////////////
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//主机网络连接管理 app.devicenetwork devicenetwork.html
.controller('DeviceNetworkCtrl', function($scope){ 
  $scope.init = function(){
    alert("主机网络设置接口尚未提供");
  }
})
/////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
//通知 app.notifies notifies.html
.controller('NotificationCtrl', function($scope, $state, locals) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 

})
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//支付 app.purchaseinfo purchaseinfo.html
.controller('PurchaseCtrl', function($scope,$state) {
  $scope.init = function(){
    alert("支付接口尚未提供");
  }
})
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//报警 app.alarm alarm.html
.controller('AlarmCtrl', function($scope,$state) {
    $scope.init = function(){
    alert("报警接口尚未提供");
  }
})
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//主板电池信息 app.battery battery.html
.controller('BatteryCtrl', function($scope,$state) {
    $scope.init = function(){
    alert("主机电池信息接口尚未提供");
    }
})
/////////////////////////////////////////////////
///
///
/////////////////////////////////////////////////
//操作栈 app.manustack manustack.html
.controller('ManuStackCtrl', function($scope,$state) {
    $scope.init = function(){
    alert("操作记录接口尚未提供");
  }
})
/////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
//测试用功能 app.vib vib.html
.controller('VibrationCtrl', function($scope, $cordovaVibration, $cordovaBarcodeScanner, $state, locals){ 
 if (!locals.get("cust_id",""))
    $state.go("app.login"); 

  $scope.startVib=function(){ 
    // 震动 1000ms 
    $cordovaVibration.vibrate(1000); 
  };


  $scope.scanBarcode = function() {

  $cordovaBarcodeScanner.scan().then(function(imageData) {

  alert(imageData.text);

  console.log("Barcode Format -> " + imageData.format);

  console.log("Cancelled -> d" + imageData.cancelled);

  }, function(error) {

  console.log("An error happened -> " + error);

  });

  };
})
////////////////////////////////////////////////////////////////////////////////////////////////////////
//注册
.controller('register', function($q, $scope, $ionicSideMenuDelegate, $ionicPopover, $state, $timeout, $http, locals) {
  if (!locals.get("cust_id",""))
      $state.go("app.login"); 

  $scope.setFormScope = function(scope){
    this.formScope = scope;
  }
  $scope.registerData = {};

  $scope.submit = function(scope) {
    if(!$scope.registerData.mobileNo) {
      alert('mobileNo required');
      return;
    }
    if(!$scope.registerData.password) {
      alert('password required');
      return;
    }
    if(!$scope.registerData.code) {
      alert('code required');
      return;
    }

    var requestData = {
      phone: $scope.registerData.mobileNo,
      login_pwd: hex_md5($scope.registerData.password).toLocaleUpperCase(),
      sms_captcha: $scope.registerData.code,
    };

    var apibranch = '/account/register';
    var request = httpReqGen(apibranch,requestData);

    $http(request).then(function(response) {
      console.log(response);
      var result = $.parseJSON(response.data.result);
      if (result.code == 0000){
        $scope.global.cust_id = result.data.cust_id;
        console.log(result.data.cust_id);
        $state.go('app.userinfo');
      } else {
        alert(result.msg);
      }
    }, function(error) {
    });
  }
})

//本地存储数据===================================
.factory('locals',['$window',function($window){
      return{        //存储单个属性
        set :function(key,value){
          $window.localStorage[key]=value;
        },        //读取单个属性
        get:function(key,defaultValue){
          return  $window.localStorage[key] || defaultValue;
        },        //存储对象，以JSON格式存储
        setObject:function(key,value){
          $window.localStorage[key]=JSON.stringify(value);
        },        //读取对象
        getObject: function (key) {
          return JSON.parse($window.localStorage[key] || '{}');
        }
      }
  }])

//登录
.controller('login', function($scope, $ionicSlideBoxDelegate, $timeout, $ionicLoading, $ionicPopup, $http, $state, locals) {
  $scope.loginData = {};
  $scope.login = function() {
    if(!$scope.loginData.username) {
      alert('请输入用户名。');
      return;
    }
    if(!$scope.loginData.password) {
      alert('请输入密码。');
      return;
    }
    var requestData = {
      phone: $scope.loginData.username,
      login_pwd: hex_md5($scope.loginData.password).toLocaleUpperCase(),
    };

  var apibranch = '/account/login';
  var request = httpReqGen(apibranch,requestData);

  $http(request).then(function(response) {
      console.log(response);
      var result = $.parseJSON(response.data.result);
      if (result.code == 0000){
        $scope.global.cust_id = result.data.cust_id;

        //存储数据
        locals.set("username",requestData.phone);
        locals.set("cust_id", result.data.cust_id);
        //读取数据
        console.log(locals.get("username",""));
        console.log(locals.get("cust_id",""));

        $state.go('app.overview');
      } else {
        alert(result.msg);
      }
    }, function(error) {
      console.log(error);
    });
  }
  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  }
  $scope.prevSlide = function() {
    $ionicSlideBoxDelegate.previous();
  }
  $scope.setFormScope = function(scope){
    this.formScope = scope;
  }
})

////////////////////////////////////////////////////////////////////////////////////////////////////////
.directive('wrapOwlcarousel', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            var options = scope.$eval($(element).attr('data-options'));
            $(element).owlCarousel(options);
        }
    };
})
;

function getReqNo(){
    var newuuid = UUID.prototype.createUUID();
    var aesKey = "XinLaiWitHome___";
    var newAesKey = null;
    var aesEncrypt = function(data, keyStr, ivStr) {
                var sendData = CryptoJS.enc.Utf8.parse(data);
                var key = CryptoJS.enc.Utf8.parse(keyStr);
                var iv  = CryptoJS.enc.Utf8.parse(ivStr);
                var encrypted = CryptoJS.AES.encrypt(sendData, key,{iv:iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.Iso10126});
                return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    };
    var aesDecrypt = function(data, keyStr, ivStr) {
      var key = CryptoJS.enc.Utf8.parse(keyStr);
      var iv  = CryptoJS.enc.Utf8.parse(ivStr);
      var decrypted = CryptoJS.AES.decrypt(data, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Iso10126});
      return decrypted.toString(CryptoJS.enc.Utf8);
    };
    var code = aesEncrypt(newuuid, aesKey, aesKey);   
    return code;
}
function httpReqGen(apibranch,reqData){
    var code = getReqNo();
    var url = 'http://139.196.13.82/xinlai' + apibranch + '?req_no=' + code;
    return req = {
      headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept': '*/*'
                  },
      method: 'POST',
      url: url,
      data: reqData
    };  
}
function httpReqGETGen(apibranch){
    var code = getReqNo();
    var url = 'http://139.196.13.82/xinlai' + apibranch + '?req_no=' + code;
    return req = {
      headers: {
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                  'Accept': '*/*'
               },       
      method: 'GET',
      url: url
    };  
}
function httpTESTGen(url,head){
    return req = {
      headers: head,     
      method: 'GET',
      url: url
    };  
}
