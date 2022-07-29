import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { finalize } from 'rxjs/operators';
import { Store } from '@ngrx/store';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
    totalRequests = 0;
    completedRequests = 0;

    constructor(private store: Store<any>) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        this.store.dispatch({ type: 'startSpinner' });
        this.totalRequests++;

        return next.handle(request).pipe(
            finalize(() => {
                this.completedRequests++;

                if (this.completedRequests === this.totalRequests) {
                    this.store.dispatch({ type: 'stopSpinner' });

                    this.completedRequests = 0;
                    this.totalRequests = 0;
                }
            })
        );
    }
}
