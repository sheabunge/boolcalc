
import {BooleanParser} from './parser/boolean';
import {UnaryNode} from './nodes/unary';
import {BinaryNode} from './nodes/binary';
import {ValueNode} from './nodes/value';
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

let traverse_tree = (node, list) => {
	if (node === null || node instanceof ValueNode) {
		return;
	}

	list.add(node);

	if (node instanceof UnaryNode) {
		traverse_tree(node.child, list);
	} else if (node instanceof BinaryNode) {
		traverse_tree(node.left, list);
		traverse_tree(node.right, list);
	}
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

		let nodes = new Set();
		traverse_tree($scope.tree, nodes);

		$scope.nodes = Array.from(nodes);
		$scope.nodes.reverse();

		let vars = $scope.parser.get_vars();
		$scope.table = truth_table(vars, $scope.nodes);
	};
}]);
