"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFound = exports.Forbidden = exports.Unauth = exports.BadRequest = exports.ExpressError = void 0;
class ExpressError extends Error {
    constructor(msg, status) {
        super();
        this.msg = msg;
        this.status = status;
        if (Array.isArray(this.msg)) {
            this.message = this.msg.join('\n');
        }
        else {
            this.message = this.msg;
        }
    }
}
exports.ExpressError = ExpressError;
class BadRequest extends ExpressError {
    constructor(msg = "Bad Request") {
        super(msg, 400);
    }
}
exports.BadRequest = BadRequest;
class Unauth extends ExpressError {
    constructor(msg = "Unauthorized") {
        super(msg, 401);
    }
}
exports.Unauth = Unauth;
class Forbidden extends ExpressError {
    constructor(msg = "Forbidden") {
        super(msg, 403);
    }
}
exports.Forbidden = Forbidden;
class NotFound extends ExpressError {
    constructor(msg = "Not Found") {
        super(msg, 404);
    }
}
exports.NotFound = NotFound;
