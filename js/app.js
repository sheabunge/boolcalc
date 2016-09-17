
import {BooleanParser} from './parser/boolean';
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
 * @param {Array} nodes Tree to use for evaluation
 * @returns {Array} Computed table
 */
let truth_table = (vars, nodes) => {
	let num_tests = Math.pow(2, vars.length);
	let table = [];

	for (let test = 0; test < num_tests; ++test) {
		let inputs = pad(test.toString(2), vars.length).split('');

		for (let i = 0; i < inputs.length; ++i) {
			vars[i].value = inputs[i] === '1';
		}

		for (let node of nodes) {
			inputs.push(node.eval() ? '1' : '0');
		}

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

	/**
	 * Run when the form is submitted
	 */
	$scope.parse = () => {

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
}]);
