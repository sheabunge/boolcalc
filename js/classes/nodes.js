
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

	toString() {
		return this.left.toString() + ' ^ ' + this.right.toString();
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

	toString() {
		return this.left.toString() + ' v ' + this.right.toString();
	}
}
