
import {Node} from './base';
import {BinaryNode} from './binary';

export class UnaryNode extends Node {

	/**
	 * @constructor
	 * @param {Node} child
	 */
	constructor(child) {
		super();
		this.child = child;
	}

	/**
	 * Returns a string representation of the node
	 * @returns {string}
	 */
	toString() {
		return 'Node(' + this.child + ')'
	}
}

/**
 * Represents a "not" Node
 */
export class NotNode extends UnaryNode {

	/**
	 * Evaluates the node
	 * @returns {boolean} The result of ~N
	 */
	evalValue() {
		return ! this.child.evalValue();
	}

	/**
	 * Returns a string representation of the node
	 * @returns {string}
	 */
	toString() {

		if (this.child instanceof BinaryNode) {
			return '~(' + this.child + ')'
		}

		return '~' + this.child;
	}
}
