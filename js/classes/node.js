
/**
 * Represents a node
 */
export class Node {

	/**
	 * @constructor
	 * @param {Node} left
	 * @param {Node} right
	 */
	constructor(left, right) {
		this.left = left;
		this.right = right;
	}

	/**
	 * Evaluate the node
	 * @abstract
	 * @returns {*}
	 */
	eval() {
		throw new TypeError('eval() method not implemented');
	}
}
