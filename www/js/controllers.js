angular.module('starter.controllers', [])

////////////////////////////////////////////////////////////////////////////////////////////////////////
//数据
.controller('MainCtrl', function($scope, $ionicSideMenuDelegate, $ionicPopover, $state, $timeout) {
  $scope.global = { cust_id : 0 };
  $scope.user = { Id: 1, Name: 'Admin', Email: 'admin@test.domain', Phone: '13609876543', Tel: '02129807893', 
                  EmergMan1: 'AdminEmerg1', EmergMan1Phone: '13609876542',EmergMan2: 'AdminEmerg2', 
                  EmergMan2Phone: '13609876541', address: '浦东新区耀华路120弄121号102' };
  $scope.subUsers = [{Id:1,Name:'AdminSub1'},{Id:2,Name:'AdminSub2'},{Id:3,Name:'AdminSub3'}];

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

  // $scope.nodesViewModel = {
  //   nodeType:"",
  //   nodes:[
  //               { id: '1', name: 'Door Magnet1', icon: 'ion-magnet', status: 'unarmed', nodeType: 'MEG'},
  //               { id: '2', name: 'Infra Sensor1', icon: 'ion-wifi', status: 'unarmed', nodeType: 'INF'},
  //               { id: '3', name: 'Smoke Sensor1', icon: 'ion-flame', status: 'unarmed', nodeType: 'SMK'},
  //               { id: '4', name: 'Smoke Sensor2', icon: 'ion-flame', status: 'unarmed', nodeType: 'SMK'},
  //               { id: '5', name: 'Gas Sensor1', icon: 'ion-bonfire', status: 'unarmed', nodeType: 'GAS'},
  //               { id: '6', name: 'Gas Sensor2', icon: 'ion-bonfire', status: 'unarmed', nodeType: 'GAS'},
  //             ],
  //   nodeList:[
  //                 { id: '1', name: '门磁', icon: 'ion-magnet', nodeType: 'MEG'},
  //                 { id: '2', name: '红外探测', icon: 'ion-wifi', nodeType: 'INF'},
  //                 { id: '3', name: '烟雾探测', icon: 'ion-flame',  nodeType: 'SMK'},
  //                 { id: '4', name: '燃气探测', icon: 'ion-bonfire',  nodeType: 'GAS'},
  //                 { id: '5', name: '电子钥匙', icon: 'ion-locked',  nodeType: 'SEC'},
  //                 { id: '6', name: '摄像监控', icon: 'ion-videocamera', nodeType: 'CAM'},
  //  ]};

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
            "name": "TY‘s 设备",
            "deviceId": "7CEC7939212C",
            "status": "ONLINE",
            "alertStatus": "SET",
            "deviceType": "HOMEGATEWAY",
            "lastHeartBeat": "2016-06-17T04:12:39Z",
            "isDeleted": false,
            "createAt": "2016-06-17T04:12:39Z",
            "account": {
                "accountId": 1,
                "cellPhone": "15687877676",
                "location": null,
                "createAt": "2016-06-17T04:12:39Z"
            }
        },
        {
            "id": 1,
            "name": "设备一",
            "deviceId": "7CEC793924C3",
            "status": "ONLINE",
            "alertStatus": "SET",
            "deviceType": "HOMEGATEWAY",
            "lastHeartBeat": "2016-06-17T04:12:39Z",
            "isDeleted": false,
            "createAt": "2016-06-17T04:12:39Z",
            "account": {
                "accountId": 1,
                "cellPhone": "15687877676",
                "location": null,
                "createAt": "2016-06-17T04:12:39Z"
            }
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
                          "name": null,
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
                          "name": null,
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
.controller('OverViewCtrl', function($q, $scope, $ionicSideMenuDelegate, $ionicPopover, $state, $timeout, $http,$ionicLoading) {
  $scope.DataReq = function(){
    $ionicLoading.show({
      templateUrl:"templates/loading.html",
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    //用户信息 dc接口
    var apibranch = '/account/detail';
    var reqd = {"cust_id":"740089105671409664"};
    var req = httpReqGen(apibranch,reqd);
    console.log($scope.global.cust_id);

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
.controller('ArmCtrl', function($scope) {
  $scope.pushNotificationChange = function() {
    console.log('Push Notification Change', $scope.ArmViewModel.checked);
  };
})
//摄像头 app.camera camera.html
.controller('CameraCtrl', function($scope){ 
})

//提供方法
.controller('Dashboard', function($scope, $interval) {
  var maximum = 150;
  $scope.data = [[]];
  $scope.labels = [];
  for (var i = 0; i < maximum; i++) {
    $scope.data[0].push(0);
    $scope.labels.push("");
  }
  $scope.options =  {
    responsive: true,
    showTooltips: false,
    animation: false,
    pointDot : false,
    scaleShowLabels: true,
    showScale: true,
    maintainAspectRatio: false,
    datasetStrokeWidth : 1,
    }; 

    function getLiveChartData () {
      if ($scope.data[0].length) {
        $scope.labels = $scope.labels.slice(1);
        $scope.data[0] = $scope.data[0].slice(1);
      }

      while ($scope.data[0].length < maximum) {
        $scope.labels.push('');
        $scope.data[0].push(getRandomValue($scope.data[0]));
      }
    }
  function getRandomValue (data) {
    var l = data.length, previous = l ? data[l - 1] : 50;
    var y = previous + Math.random() * 10 - 5;
    return y < 0 ? 0 : y > 100 ? 100 : y;
  }
  // Simulate async data update
  $interval(function () {
    getLiveChartData();
  }, 500);
})
////////////////////////////////////////////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
//添加设备 app.addNode add-node.html
.controller('addNode', function($scope) {
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
    var defaultForm = {
      id : "",
      name : "",
      icon : "",
      nodeSelect : "",
      deviceSelect : ""
    };
    $scope.newnode = defaultForm;
  };
})
////////////////////////////////////////////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
//用户 app.usersetting usersetting.html
.controller('usersetting', function($scope, $state) {
  $scope.setFormScope = function(scope){
    this.formScope = scope;
  }
  $scope.pageJump = function(route) {
    $state.go(route);
  };  
  $scope.newuser = {};
  $scope.userSubmit = function() {
    if(!$scope.newuser.username) {
      alert('Username required');
      return;
    }
    if(!$scope.newuser.avatar) {
      $scope.newuser.avatar = 'img/noavatar.png';
    }
    $scope.newuser.lastLogin = 'Last login: never';
    $scope.newuser.id = $scope.users.length + 1;
    $scope.users.push($scope.newuser);
    this.formScope.addUserForm.$setPristine();
    var defaultForm = {
      id : "",
      username : "",
      avatar : "",
      location: false
    };
    $scope.newuser = defaultForm;
  };
})
/////////////////////////////////////////////////       
//个人信息 app.userinfo userinfo.html
.controller('updateUser', function($scope, $q, $http, $state) {
  if (!$scope.global.cust_id){
        $state.go('app.login');
  }

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
.controller('addSubUser', function($scope) {
  $scope.setFormScope = function(scope){
    this.formScope = scope;
  }
  $scope.newuser = {};
  $scope.userSubmit = function() {
    if(!$scope.newuser.username) {
      alert('Username required');
      return;
    }
    if(!$scope.newuser.avatar) {
      $scope.newuser.avatar = 'img/noavatar.png';
    }
    $scope.newuser.lastLogin = 'Last login: never';
    $scope.newuser.id = $scope.users.length + 1;
    $scope.users.push($scope.newuser);
    this.formScope.addUserForm.$setPristine();
    var defaultForm = {
      id : "",
      username : "",
      avatar : "",
      location: false
    };
    $scope.newuser = defaultForm;
  };
})
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//更改密码 app.changepassword changepassword.html
.controller('PasswordCtrl', function($scope,$q,$http,$state) {
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
    var id = "740089105671409664";
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
.controller('VersionCtrl', function($scope){ 
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
.controller('settings', function($scope,$state) {
  $scope.setFormScope = function(scope){
    this.formScope = scope;
  }
  $scope.pageJump = function(route) {
    $state.go(route);
  };  
  $scope.newuser = {};
  $scope.userSubmit = function() {
    if(!$scope.newuser.username) {
      alert('Username required');
      return;
    }
    if(!$scope.newuser.avatar) {
      $scope.newuser.avatar = 'img/noavatar.png';
    }
    $scope.newuser.lastLogin = 'Last login: never';
    $scope.newuser.id = $scope.users.length + 1;
    $scope.users.push($scope.newuser);
    this.formScope.addUserForm.$setPristine();
    var defaultForm = {
      id : "",
      username : "",
      avatar : "",
      location: false
    };
    $scope.newuser = defaultForm;
  };
})
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//主机设备绑定管理 app.gatewaymanage gatewaymanage.html
.controller('DeviceNodeBindingManageCtrl', function($scope){ 
})
////////////////////
//添加主机 app.gatewayinfo gatewayinfo.html
.controller('addDevice', function($scope) {
  $scope.setFormScope = function(scope){
    this.formScope = scope;
  }
  $scope.newuser = {};
  $scope.userSubmit = function() {
    if(!$scope.newuser.username) {
      alert('Username required');
      return;
    }
    if(!$scope.newuser.avatar) {
      $scope.newuser.avatar = 'img/noavatar.png';
    }
    $scope.newuser.lastLogin = 'Last login: never';
    $scope.newuser.id = $scope.users.length + 1;
    $scope.users.push($scope.newuser);
    this.formScope.addUserForm.$setPristine();
    var defaultForm = {
      id : "",
      username : "",
      avatar : "",
      location: false
    };
    $scope.newuser = defaultForm;
  };
})
////////////////////
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//主机网络连接管理 app.gatewaynetwork gatewaynetwork.html
.controller('GateWayNetworkCtrl', function($scope){ 
})
/////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
//通知 app.notifies notifies.html
.controller('NotificationCtrl', function($scope,$state) {
  $scope.setFormScope = function(scope){
    this.formScope = scope;
  }
  $scope.pageJump = function(route) {
    $state.go(route);
  };  
  $scope.newuser = {};
  $scope.userSubmit = function() {
    if(!$scope.newuser.username) {
      alert('Username required');
      return;
    }
    if(!$scope.newuser.avatar) {
      $scope.newuser.avatar = 'img/noavatar.png';
    }
    $scope.newuser.lastLogin = 'Last login: never';
    $scope.newuser.id = $scope.users.length + 1;
    $scope.users.push($scope.newuser);
    this.formScope.addUserForm.$setPristine();
    var defaultForm = {
      id : "",
      username : "",
      avatar : "",
      location: false
    };
    $scope.newuser = defaultForm;
  };
})
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//支付 app.purchaseinfo purchaseinfo.html
.controller('PurchaseCtrl', function($scope,$state) {
  $scope.setFormScope = function(scope){
    this.formScope = scope;
  }
  $scope.pageJump = function(route) {
    $state.go(route);
  };  
  $scope.newuser = {};
  $scope.userSubmit = function() {
    if(!$scope.newuser.username) {
      alert('Username required');
      return;
    }
    if(!$scope.newuser.avatar) {
      $scope.newuser.avatar = 'img/noavatar.png';
    }
    $scope.newuser.lastLogin = 'Last login: never';
    $scope.newuser.id = $scope.users.length + 1;
    $scope.users.push($scope.newuser);
    this.formScope.addUserForm.$setPristine();
    var defaultForm = {
      id : "",
      username : "",
      avatar : "",
      location: false
    };
    $scope.newuser = defaultForm;
  };
})
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//报警 app.alarm alarm.html
.controller('AlarmCtrl', function($scope,$state) {
})
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//主板电池信息 app.battery battery.html
.controller('BatteryCtrl', function($scope,$state) {
  $scope.setFormScope = function(scope){
    this.formScope = scope;
  }
  $scope.pageJump = function(route) {
    $state.go(route);
  };  
  $scope.newuser = {};
  $scope.userSubmit = function() {
    if(!$scope.newuser.username) {
      alert('Username required');
      return;
    }
    if(!$scope.newuser.avatar) {
      $scope.newuser.avatar = 'img/noavatar.png';
    }
    $scope.newuser.lastLogin = 'Last login: never';
    $scope.newuser.id = $scope.users.length + 1;
    $scope.users.push($scope.newuser);
    this.formScope.addUserForm.$setPristine();
    var defaultForm = {
      id : "",
      username : "",
      avatar : "",
      location: false
    };
    $scope.newuser = defaultForm;
  };
})
/////////////////////////////////////////////////
///
///
/////////////////////////////////////////////////
//操作栈 app.manustack manustack.html
.controller('ManuStackCtrl', function($scope,$state) {
  $scope.setFormScope = function(scope){
    this.formScope = scope;
  }
  $scope.pageJump = function(route) {
    $state.go(route);
  };  
  $scope.newuser = {};
  $scope.userSubmit = function() {
    if(!$scope.newuser.username) {
      alert('Username required');
      return;
    }
    if(!$scope.newuser.avatar) {
      $scope.newuser.avatar = 'img/noavatar.png';
    }
    $scope.newuser.lastLogin = 'Last login: never';
    $scope.newuser.id = $scope.users.length + 1;
    $scope.users.push($scope.newuser);
    this.formScope.addUserForm.$setPristine();
    var defaultForm = {
      id : "",
      username : "",
      avatar : "",
      location: false
    };
    $scope.newuser = defaultForm;
  };
})
/////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
//测试用功能 app.vib vib.html
.controller('VibrationCtrl', function($scope,$cordovaVibration,$cordovaBarcodeScanner){ 
 
  $scope.startVib=function(){ 
    // 震动 1000ms 
    $cordovaVibration.vibrate(1000); 
  };


  $scope.scanBarcode = function() {

  $cordovaBarcodeScanner.scan().then(function(imageData) {

  alert(imageData.text);

  console.log("Barcode Format -> " + imageData.format);

  console.log("Cancelled -> " + imageData.cancelled);

  }, function(error) {

  console.log("An error happened -> " + error);

  });

  };
})
////////////////////////////////////////////////////////////////////////////////////////////////////////
//注册
.controller('register', function($q, $scope, $ionicSideMenuDelegate, $ionicPopover, $state, $timeout, $http) {

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
//登录
.controller('login', function($scope, $ionicSlideBoxDelegate, $timeout, $ionicLoading, $ionicPopup, $http, $state) {
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
    var urlp = 'http://139.196.13.82/xinlai' + apibranch + '?req_no=' + code;
    var reqParam = {
      code: code,
      url: urlp,
      requestData: reqData,
      method: 'POST',
      };
    return req = {
      method: reqParam.method,
      url: reqParam.url,
      data: reqParam.requestData
    };  
}





