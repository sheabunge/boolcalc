
import {BooleanParser} from './classes/bool-parser.js';
import angular from 'angular';

/**
 * The main app module
 * @type {angular.Module}
 */
let app = angular.module('app', []);

let pad = (text, size) => {
	while (text.length < size) {
		text = '0' + text;
	}

	return text;
};

/**
 * The main controller
 */
app.controller('Parser', ['$scope', function ( $scope ) {
	$scope.exp = '';
	$scope.table = [];

	$scope.parse = () => {
		$scope.parser = new BooleanParser($scope.exp);

		$scope.tree = $scope.parser.parse();
		console.log($scope.tree.toString());

		let vars = $scope.parser.vars;
		let num_tests = Math.pow(2, vars.length);
		$scope.table = [];

		for (let test = 0; test < num_tests; ++test) {
			let inputs = pad(test.toString(2), vars.length).split('');

			for (let i = 0; i < inputs.length; ++i) {
				vars[i].value = inputs[i] === '1';
			}

			inputs.push($scope.tree.eval() ? '1' : '0');

			$scope.table.push(inputs);
		}
	};
}]);
