import {InvalidInputError} from './exceptions';

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
	 * Retrieve the next symbol without moving the pointer
	 * @returns {null|Symbol}
	 */
	peek_symbol() {
		return this.end() ? null : this.tokens[this.current];
	}

	/**
	 * Retrieve the next token without moving the pointer
	 * @returns {null|Token}
	 */
	peek() {
		return this.peek_symbol() ? this.peek_symbol().token : null;
	}

	/**
	 * Move the pointer to the next token, if there is one
	 *
	 * If the first argument is provided, only move the pointer if the tokens match
	 *
	 * @param {Token|null} [token] Only advance the pointer if the next token matches this
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
	 * @throws {ParseError} if extra content is found at the end of input
	 * @returns {Node} the Node at the root of the tree
	 */
	parse() {
		if (this.end()) {
			throw new InvalidInputError('No input detected');
		}

		let node = this._parse();

		if (!this.end()) {
			console.log('tokens: ' + this.tokens);
			console.log('pointer: ' + this.current);
			throw new InvalidInputError('Expression contains malformed syntax');
		}

		return node;
	}

	/**
	 * Internal parse method to be overridden by subclass
	 *
	 * @abstract
	 * @private
	 * @returns {Node}
	 */
	_parse() {
		throw new TypeError('_parse() method not implemented');
	}
}
