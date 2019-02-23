
import {InvalidInputError} from './exceptions';

/**
 * Represents a token
 */
class Token {

	/**
	 * @constructor
	 * @param {string} label Token label. Should be the same as the key in the token_types object
	 */
	constructor(label) {
		this.label = label;
	}

	/**
	 * Represents the token as a string
	 * @returns {string}
	 */
	toString() {
		return this.label;
	}
}

/**
 * Object containing the Token object instances
 * @type Object
 */
export const token_types = {
	OP_AND:      new Token('OP_AND'),
	OP_OR:       new Token('OP_OR'),
	OP_NOT:      new Token('OP_NOT'),
	OP_XOR:      new Token('OP_XOR'),
	OP_EQUIV:    new Token('OP_EQUIV'),
	OP_IMPLIES:  new Token('OP_IMPLIES'),
	OP_PROVIDED: new Token('OP_PROVIDED'),
	CONST_TRUE:  new Token('CONST_TRUE'),
	CONST_FALSE: new Token('CONST_FALSE'),
	VAR:         new Token('VAR'),
	OPEN_BR:     new Token('OPEN_BR'),
	CLOSE_BR:    new Token('CLOSE_BR')
};

/**
 * Map of each token with the regular expression pattern used to match it.
 *
 * Each pattern should only match from the beginning of the string (^)
 * And should only match a single element (i.e. not global and no captures).
 *
 * @type {Map}
 */
export const patterns = new Map([
	[token_types.OP_AND, /^(?:[∧^&·*]|AND\b)/i],
	[token_types.OP_OR, /^(?:[∨v+∥|]|OR\b)/i],
	[token_types.OP_NOT, /^(?:[~'!¬]|NOT\b)/i],
	[token_types.OP_XOR, /^(?:[⊻⊕]|XOR\b)/i],
	[token_types.OP_EQUIV, /^(?:[⇔≡↔=]|EQUIV\b)/i],
	[token_types.OP_IMPLIES, /^(?:[⇒→⊃>]|IMPLIES\b)/i],
	[token_types.OP_PROVIDED, /^(?:[⇐←⊃<]|PROVIDED\b)/i],
	[token_types.CONST_TRUE, /^(?:[1⊤]|T\b|TRUE\b)/i],
	[token_types.CONST_FALSE, /^(?:[0⊥]|F\b|FALSE\b)/i],
	[token_types.VAR, /^[A-Za-z_]\w*/],
	[token_types.OPEN_BR, /^\(/],
	[token_types.CLOSE_BR, /^\)/]
]);

/**
 * Matches whitespace at the beginning of the string
 * @type {RegExp}
 */
const RE_WS = /^\s+/;

/**
 * Represents a symbol
 */
export class Symbol {

	/**
	 * @constructor
	 * @param {Token} token The symbol's token
	 * @param {string} value The actual value of the symbol
	 */
	constructor(token, value) {
		this.token = token;
		this.value = value;
	}

	/**
	 * Represents the symbol as a string
	 * @returns {string} string representation of symbol
	 */
	toString() {
		return this.token + '(' + this.value + ')';
	}
}

/**
 * Class for reading over data and extracting tokens
 */
export class Lexer {

	/**
	 * @constructor
	 * @param {string} data
	 */
	constructor(data) {
		this.data = data;
		this.size = data.length;
		this.pointer = 0;
	}

	/**
	 * Determine if we are at the end of the input
	 * @returns {boolean}
	 */
	end() {
		return this.pointer === this.size;
	}

	/**
	 * Return the remaining portion of the data that has not been read
	 * @returns {string} unread portion of data
	 */
	remaining() {
		return this.data.substr(this.pointer);
	}

	/**
	 * Move the pointer over any whitespace following the current position
	 */
	eat_whitespace() {
		let m = this.remaining().match(RE_WS);

		if (m) {
			this.pointer += m[0].length;
		}
	}

	/**
	 * Find the next symbol in the data without moving the pointer
	 * @throws {Error} if an unknown symbol is encountered
	 * @returns {Symbol} the next symbol in the data
	 */
	peek() {
		for (let [token, pattern] of patterns) {
			let m = this.remaining().match(pattern);

			if (m) {
				return new Symbol(token, m[0]);
			}
		}

		throw new InvalidInputError('Unknown symbol detected in expression');
	}

	/**
	 * Find the next symbol and remove the pointer to after it
	 * @returns {Symbol}
	 */
	read() {
		let symbol = this.peek();

		this.pointer += symbol.value.length;
		this.eat_whitespace();

		return symbol;
	}

	/**
	 * Read over all the data and extract the symbols
	 * @returns Array List of Symbol objects
	 */
	read_all() {
		let symbols = [];

		while (! this.end()) {
			let symbol = this.read();
			symbols.push(symbol);
		}

		return symbols;
	}
}
