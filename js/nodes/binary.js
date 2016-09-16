
import {Node} from './base';

/**
 * Represents a node with two children
 */
export class BinaryNode extends Node {

	/**
	 * @constructor
	 * @param {Node} left
	 * @param {Node} right
	 */
	constructor(left, right) {
		super();
		this.left = left;
		this.right = right;
	}

	/**
	 * Returns a string representation of the node
	 * @returns {string}
	 */
	pprint() {
		return 'Node(' + this.left + ', ' + this.right + ')'
	}
}

/**
 * Represents an "and" node
 */
export class AndNode extends BinaryNode {

	/**
	 * Evaluate the node
	 * @returns {boolean} The result of (L ^ R)
	 */
	eval() {
		return this.left.eval() && this.right.eval();
	}

	/**
	 * Returns a string representation of the node
	 * @returns {string}
	 */
	pprint() {
		return this.left + ' ^ ' + this.right;
	}
}

/**
 * Represents an "or" node
 */
export class OrNode extends BinaryNode {

	/**
	 * Evaluates the node
	 * @returns {boolean} The result of (L v R)
	 */
	eval() {
		return this.left.eval() || this.right.eval();
	}

	/**
	 * Returns a string representation of the node
	 * @returns {string}
	 */
	pprint() {
		return this.left + ' v ' + this.right;
	}
}

