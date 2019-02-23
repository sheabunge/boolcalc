
/**
 * Represents a node
 */
export class Node {

	/**
	 * Evaluate the node
	 * @abstract
	 * @returns {*}
	 */
	evalValue() {
		throw new TypeError('evalValue() method not implemented');
	}

	/**
	 * Returns a string representation of the node
	 * @returns {string}
	 */
	toString() {
		return 'Node()';
	}
}
