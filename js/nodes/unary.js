
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
	pprint() {
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
	eval() {
		return ! this.child.eval();
	}

	/**
	 * Returns a string representation of the node
	 * @returns {string}
	 */
	pprint() {
		if (this.child instanceof BinaryNode) {
			return '~ (' + this.child + ')'
		}

		return '~ ' + this.child;
	}
}
