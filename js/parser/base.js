/**
 * Base parser class
 */
export class Parser {

	/**
	 * @constructor
	 * @param {Array} tokens List of tokens to parse
	 */
	constructor(tokens) {
		this.tokens = tokens;
		this.length = tokens.length;
		this.current = 0;
	}

	/**
	 * Check if the parser is at the end the list of tokens
	 * @returns {boolean} true if at the end
	 */
	end() {
		return this.current === this.length;
	}

	/**
	 * Retrieve the value of the next token without moving the pointer
	 * @returns {null|*}
	 */
	peek() {
		return this.end() ? null : this.tokens[this.current];
	}

	/**
	 * Move the pointer to the next token, if there is one
	 *
	 * If the first argument is provided, only move the pointer if the tokens match
	 *
	 * @param {*} [token] Only advance the pointer if the next token matches this
	 * @returns {boolean} Whether the pointer was advanced
	 */
	next(token = null) {

		if (this.end() || token && this.peek() !== token) {
			return false;
		}

		++this.current;
		return true;
	}

	/**
	 * Parse the tokens and return the root node
	 * @throws {Error} if extra content is found at the end of input
	 * @returns {Node} the Node at the root of the tree
	 */
	parse() {
		let node = this._parse();

		if (! this.end()) {
			console.log(this.tokens);
			console.log(this.current);
			throw new Error('extra content found at end of input');
		}

		return node;
	}

	/**
	 * Internal parse method to be overridden by subclass
	 *
	 * @abstract
	 * @private
	 */
	_parse() {
		throw new TypeError('_parse() method not implemented');
	}
}
