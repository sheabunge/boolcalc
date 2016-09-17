
/**
 * Custom exception class for a parse error
 */
export class ParseError {

	/**
	 * @constructor
	 * @param {string} message Error message
	 */
	constructor(message) {
		this.name = this.constructor.name;
		this.message = message;
		this.stack = (new Error(message)).stack;
	}
}

ParseError.prototype = Object.create(Error.prototype);

export class InvalidInputError extends ParseError {

}

export class ExpressionSyntaxError extends InvalidInputError {

}
