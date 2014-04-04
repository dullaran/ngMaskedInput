Angular Masked Input Plugin
=============

[![Build Status](https://travis-ci.org/dullaran/ngMaskedInput.svg?branch=master)](https://travis-ci.org/dullaran/ngMaskedInput)

This is a masked input plugin for the angular javascript library (no jQuery dependencies). It allows a user to more easily enter fixed width input where you would like them to enter the data in a certain format (dates, phone numbers, etc). A mask is defined by a format made up of mask literals and mask definitions. Any character not in the definitions list below is considered a mask literal. Mask literals will be automatically entered for the user as they type and will not be able to be removed by the user.The following mask definitions are predefined:

- A Represents an alpha character (A-Z,a-z);
- 9 Represents a numeric character (0-9);
- * Represents an alphanumeric character (A-Z,a-z,0-9).

Usage
-------------

1) Include the angular and masked input javascript files:

```
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular.js"></script>
  <script type="text/javascript" src="http://dullaran.github.io/ngMaskedInput/releases/ngmaskedinput-1.0.0alfa.js"></script>
```
  
2) Include the ngMaskedInput in requirements of your main app:

```
  var myApp = angular.module('myApp', ["ngMaskedInput"]);
```

3) Now set the mask on input:
```
  <input type="text" ng-model="input" mask="(99) 9999-9999"/>
```

Demo
-------------
Go to online demonstration http://dullaran.github.io/ngMaskedInput/

Changelog
-------------
**1.0.0 Alpha (04/04/2014)**
  - Initial Release
