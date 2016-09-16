
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
		return this.pprint();
	}

	/**
	 * Returns a nice representation of the node
	 * @returns {string}
	 */
	pprint() {
		return 'Node()';
	}
}
