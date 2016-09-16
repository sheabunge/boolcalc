
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

	/**
	 * Returns a string representation of the node
	 * @returns {string}
	 */
	toString() {
		return 'Node(' + this.left + ', ' + this.right + ')'
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

	/**
	 * Returns a string representation of the node
	 * @returns {string}
	 */
	toString() {
		return this.left + ' ^ ' + this.right;
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

	/**
	 * Returns a string representation of the node
	 * @returns {string}
	 */
	toString() {
		return this.left + ' v ' + this.right;
	}
}

/**
 * Represents a "not" Node
 */
export class NotNode extends Node {

	/**
	 * @constructor
	 * @param {Node} node
	 */
	constructor(node) {
		super(node, null);
	}

	/**
	 * Evaluates the node
	 * @returns {boolean} The result of ~N
	 */
	eval() {
		return ! this.left.eval();
	}

	/**
	 * Returns a string representation of the node
	 * @returns {string}
	 */
	toString() {
		return '~ ' + this.left;
	}
}
