export abstract class Result<T, E> {

    protected readonly _ok: T;
    protected readonly _err: E;

    constructor(ok: T, err: E){
        this._ok = ok;
        this._err = err;
    }


    public abstract ok(): T;
    public abstract err(): E;
    public abstract isOk(): boolean;
    public abstract isErr(): boolean;
}

export class Ok<T> extends Result<T, any>{

    constructor(ok: T) {
        super(ok, null);
    }

    public ok(): T{
        return this._ok;
    }

    public err(): any {
        throw new Error("Result is an Ok");
    }

    public isOk(): boolean {
        return true;
    }


    public isErr(): boolean{
        return false;
    }
}


export class Err<E> extends Result<any, E>{

    constructor(err: E) {
        super(null, err);
    }

    public ok(): any{
        throw new Error("Result is an Err");
    }

    public err(): E {
        return this._err;
    }

    public isOk(): boolean {
        return false;
    }

    public isErr(): boolean{
        return true;
    }
}

