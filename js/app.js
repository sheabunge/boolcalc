
import {BooleanParser} from './classes/bool-parser.js';
import angular from 'angular';

/**
 * The main app module
 * @type {angular.Module}
 */
let app = angular.module('app', []);


/**
 * The main controller
 */
app.controller('Parser', ['$scope', function ( $scope ) {
	$scope.exp = '';

	$scope.parse = () => {

		$scope.parser = new BooleanParser($scope.exp);

		$scope.tree = $scope.parser.parse();

		$scope.output = tree.toString();
	};
}]);
