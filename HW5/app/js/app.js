(function() {
    "use strict";

    var usStates = {
        AL: "ALABAMA",AK: "ALASKA",AS: "AMERICAN SAMOA",AZ: "ARIZONA",AR: "ARKANSAS",CA: "CALIFORNIA",CO: "COLORADO",
        CT: "CONNECTICUT",DE: "DELAWARE",DC: "DISTRICT OF COLUMBIA",FM: "FEDERATED STATES OF MICRONESIA",FL: "FLORIDA",
        GA: "GEORGIA",GU: "GUAM",HI: "HAWAII",ID: "IDAHO",IL: "ILLINOIS",IN: "INDIANA",IA: "IOWA",KS: "KANSAS",KY: "KENTUCKY",
        LA: "LOUISIANA",ME: "MAINE",MH: "MARSHALL ISLANDS",MD: "MARYLAND",MA: "MASSACHUSETTS",MI: "MICHIGAN",MN: "MINNESOTA",
        MS: "MISSISSIPPI",MO: "MISSOURI",MT: "MONTANA",NE: "NEBRASKA",NV: "NEVADA",NH: "NEW HAMPSHIRE",NJ: "NEW JERSEY",
        NM: "NEW MEXICO",NY: "NEW YORK",NC: "NORTH CAROLINA",ND: "NORTH DAKOTA",MP: "NORTHERN MARIANA ISLANDS",OH: "OHIO",
        OK: "OKLAHOMA",OR: "OREGON",PW: "PALAU",PA: "PENNSYLVANIA",PR: "PUERTO RICO",RI: "RHODE ISLAND",SC: "SOUTH CAROLINA",
        SD: "SOUTH DAKOTA",TN: "TENNESSEE",TX: "TEXAS",UT: "UTAH",VT: "VERMONT",VI: "VIRGIN ISLANDS",VA: "VIRGINIA",
        WA: "WASHINGTON",WV: "WEST VIRGINIA",WI: "WISCONSIN",WY: "WYOMING"};


    angular.module('contactApp', ['file-data-url', 'ngRoute', 'LocalStorageModule', 'ngMap'])
        .config(function($routeProvider, $locationProvider) {
            $routeProvider.when('/', {
                templateUrl: 'views/contactList.html',
                controller: 'contactListController'
            }).when('/contact', {
                templateUrl: 'views/contact.html',
                controller: 'contactController'
            }).when('/contact/:id', {
                templateUrl: 'views/contact.html',
                controller: 'contactController'
            });
            $locationProvider.html5Mode(false);
            $locationProvider.hashPrefix('!');
        })
        .config(function (localStorageServiceProvider) {
            localStorageServiceProvider
                .setPrefix('08724.hw5');
        })

        .controller('contactListController', function($scope, localStorageService, $location, $route) {
            $scope.datas = [];
            var lsKeys = localStorageService.keys();
            for (var i in lsKeys) {
                if (!lsKeys[i].endsWith("Image")) {
                    $scope.datas.push(JSON.parse(localStorageService.get(lsKeys[i])));
                }
            }            
            $scope.showDetails = function(name) {
                $location.path('/contact/' + name);
            };
            $scope.removePerson = function(name) {
                localStorageService.remove(name);
                localStorageService.remove(name + "Image");
                $route.reload();
            }
        })

        .controller('contactController', function($scope, localStorageService, $routeParams, $location) {
            var fullName = $scope.firstName + $scope.lastName;
            if ($routeParams.id !== undefined) {
                var thisPerson = JSON.parse(localStorageService.get($routeParams.id));

                $scope.firstName = thisPerson.firstName;
                $scope.lastName = thisPerson.lastName;
                $scope.email = thisPerson.email;
                $scope.phone = thisPerson.phone;
                $scope.address = thisPerson.address;
                $scope.city = thisPerson.city;
                $scope.state = thisPerson.state;
                $scope.zip = thisPerson.zip;

                this.address = thisPerson.address + " " + thisPerson.city + " " + thisPerson.state + " " + thisPerson.zip;

                var image = localStorageService.get($routeParams.id + "Image");
                $scope.image = image;

            } else {
                this.address = "Pittsburgh United States";
            }

            $scope.stateOptions = usStates;

            $scope.submit = function() {
                localStorageService.remove(fullName);
                localStorageService.remove(fullName + "Image");
                
                var personData = {
                    firstName : $scope.firstName,
                    lastName : $scope.lastName,
                    email : $scope.email,
                    phone : $scope.phone,
                    address : $scope.address,
                    city : $scope.city,
                    state : $scope.state,
                    zip : $scope.zip,
                };



                fullName = $scope.firstName + $scope.lastName;
                var imageName = fullName + "Image";
                localStorageService.set(imageName, $scope.image);
                localStorageService.set(fullName, JSON.stringify(personData));
                window.location.href="http://localhost:8000/#!/";
            }
        });

})();