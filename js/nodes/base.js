
/**
 * Represents a node
 */
export class Node {

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
		return 'Node()';
	}
}
