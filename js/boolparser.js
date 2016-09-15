
import {Parser, Node} from './parser.js';

/*
<e1> ::= <e2> ( "v" <e1> )?
<e2> ::= <e3> ( "^" <e1> )?
<e3> ::= "0" | "1" | "A" | "B" | ... | "Z"
<e3> ::= "(" <e1> ")"
*/

export class BoolNode extends Node {

	constructor(value) {
		super(null, null);

		if (typeof(value) !== 'boolean') {
			throw new TypeError('Node value must be boolean');
		}

		this.value = value;
	}

	eval() {
		return this.value;
	}
}

export class AndNode extends Node {

	eval() {
		return this.left.eval() && this.right.eval();
	}
}

class OrNode extends Node {

	eval() {
		return this.left.eval() || this.right.eval();
	}
}

export class BooleanParser extends Parser {

	constructor(tokens, vars) {
		tokens = tokens.replace(/\s+/g, '');
		super(tokens);
		this.vars = vars;
	}

	get_var(var_name) {

		if (this.vars.has(var_name)) {
			return this.vars.get(var_name);
		}

		if (var_name === '0' || var_name === '1') {
			return '0' !== var_name;
		}

		return null;
	}

	// <e3> ::= "A" | "B" | ... | "Z"
	// <e3> ::= "(" <e1> ")"
	_parse_e3() {
		let node;

		if (this.peek() === '(') {
			this.next();
			node = this._parse_e1();

			if (this.peek() !== ')') {
				throw new Error('Closing parenthesis not found');
			}
		} else if (this.get_var(this.peek()) !== null) {
			node = new BoolNode(this.get_var(this.peek()));
			this.next();
		}

		return node;
	}

	// <e2> ::= <e3> ( "^" <e1> )?
	_parse_e2() {
		let node = this._parse_e3();

		if (this.peek() === '^') {
			this.next();
			let term = this._parse_e2();
			node = new AndNode(node, term);
		}

		return node;
	}

	// <e1> ::= <e2> ( "v" <e1> )?
	_parse_e1() {
		let node = this._parse_e2();

		if (this.peek() === 'v') {
			this.next();
			let term = this._parse_e1();
			node = new OrNode(node, term);
		}

		return node;
	}

	_parse() {
		return this._parse_e1();
	}
}

