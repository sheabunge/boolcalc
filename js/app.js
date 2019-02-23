
import {BooleanParser} from './parser/boolean';
import {ParseError} from './parser/exceptions';
import angular from 'angular';

/**
 * The main app module
 * @type {angular.Module}
 */
let app = angular.module('app', []);

/**
 * Pad a string with '0' characters until it is a specified length
 * Returns the string unaltered if the string is not less than the specified length
 * @param {string} text String to alter
 * @param {number} size Desired string length
 * @returns {string} text altered so it is at least the specified length
 */
let pad = (text, size) => {
	while (text.length < size) {
		text = '0' + text;
	}

	return text;
};

/**
 * Generates a truth table
 * @param {Array} vars Array of VariableNodes
 * @param {Array} nodes Tree to use for evaluation
 * @returns {Array} Computed table
 */
let truth_table = (vars, nodes) => {
	let table = [];

	if (vars.length < 1) {
		let row = [];

		for (let node of nodes) {
			row.push(node.evalValue() ? '1' : '0');
		}

		table.push(row);
		return table;
	}

	// The number of tests will be 2^(number of vars)
	let num_tests = Math.pow(2, vars.length);

	for (let test = 0; test < num_tests; ++test) {

		// Construct a list of inputs by converting the test number to binary
		let inputs = pad(test.toString(2), vars.length).split('');

		// Set each variable value based on the digits of the binary string
		for (let i = 0; i < inputs.length; ++i) {
			vars[i].value = inputs[i] === '1';
		}

		// For each node, evaluate it with the new variable inputs
		for (let node of nodes) {
			inputs.push(node.evalValue() ? '1' : '0');
		}

		// Add the row to the table
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
	$scope.error = null;
	$scope.ext_info = false;

	$scope.toggle_ext_info = () => {
		$scope.ext_info = ! $scope.ext_info;
	};

	let parse_exp = () => {
		$scope.table = [];
		$scope.error = null;

		// Create a new instance of the parser for the expression
		$scope.parser = new BooleanParser($scope.exp);

		// Parse the expression and store the node tree
		$scope.tree = $scope.parser.parse();

		// Traverse the tree and construct a list of nodes
		let nodes = new Set();
		BooleanParser.traverse_tree($scope.tree, nodes);

		// Reverse the nodes before passing them to the template
		$scope.nodes = Array.from(nodes);
		$scope.nodes.reverse();

		// Construct the truth table
		let vars = $scope.parser.get_vars();
		$scope.table = truth_table(vars, $scope.nodes);
	};

	/**
	 * Run when the form is submitted
	 */
	$scope.parse = () => {

		try {
			parse_exp();
		} catch (e) {

			if (e instanceof ParseError) {
				console.log('Parse Error: ' + e.message);
				$scope.error = e.message;
			} else {
				throw e;
			}
		}
	};
}]);
