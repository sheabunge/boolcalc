
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
 * Generates a truth table
 * @param {Array} vars Array of VariableNodes
 * @param {Node} tree  Tree to use for evaluation
 * @returns {Array} Computed table
 */
let truth_table = (vars, tree) => {
	let num_tests = Math.pow(2, vars.length);
	let table = [];

	for (let test = 0; test < num_tests; ++test) {
		let inputs = pad(test.toString(2), vars.length).split('');
		console.log('inputs: ' + inputs);

		for (let i = 0; i < inputs.length; ++i) {
			vars[i].value = inputs[i] === '1';
		}

		console.log('vars: ' + vars);
		console.log('tree: ' + tree);

		inputs.push(tree.eval() ? '1' : '0');

		table.push(inputs);
	}

	return table;
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

		let vars = $scope.parser.get_vars();
		$scope.table = truth_table(vars, $scope.tree);
	};
}]);
