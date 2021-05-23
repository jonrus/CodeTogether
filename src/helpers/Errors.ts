export class ExpressError extends Error {
    msg: string | string[];
    status: number;

    constructor(msg: string | string[], status: number) {
        super();
        this.msg = msg;
        this.status = status
        if (Array.isArray(this.msg)) {
            this.message = this.msg.join('\n');
        }
        else {
            this.message = this.msg;
        }
    }
}

export class BadRequest extends ExpressError {
    constructor(msg: string | string[] = "Bad Request") {
        super(msg, 400);
    }
}

export class Unauth extends ExpressError {
    constructor(msg = "Unauthorized") {
        super(msg, 401);
    }
}

export class Forbidden extends ExpressError {
    constructor(msg = "Forbidden") {
        super(msg, 403);
    }
}

export class NotFound extends ExpressError {
    constructor(msg = "Not Found") {
        super(msg, 404);
    }
}
