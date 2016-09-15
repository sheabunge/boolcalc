
import {Node} from './node.js';

/**
 * Represents a boolean value
 */
export class BoolNode extends Node {

	/**
	 * @constructor
	 * @param {boolean} value the value of the node
	 */
	constructor(value) {
		super(null, null);

		if (typeof(value) !== 'boolean') {
			throw new TypeError('Node value must be boolean');
		}

		this.value = value;
	}

	/**
	 * Evaluate the node
	 * @returns {boolean} Value of the node
	 */
	eval() {
		return this.value;
	}
}

/**
 * Represents an "and" node
 */
export class AndNode extends Node {

	/**
	 * Evaluate the node
	 * @returns {boolean} The result of (L ^ R)
	 */
	eval() {
		return this.left.eval() && this.right.eval();
	}
}

/**
 * Represents an "or" node
 */
export class OrNode extends Node {

	/**
	 * Evaluates the node
	 * @returns {boolean} The result of (L v R)
	 */
	eval() {
		return this.left.eval() || this.right.eval();
	}
}
