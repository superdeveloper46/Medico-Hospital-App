import { Injectable, NgZone } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LoadingScreenService } from '../services/loading-screen.service';


@Injectable()
export class LoadingScreenInterceptor implements HttpInterceptor {

    activeRequests: number = 0;

    constructor(private loadingScreenService: LoadingScreenService,
        public zone: NgZone) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.activeRequests === 0) {
            this.loadingScreenService.startLoading();
        }

        this.activeRequests++;
        
        return next.handle(request).pipe(
            finalize(() => {
                this.activeRequests--;
                if (this.activeRequests === 0) {
                    this.zone.run(() => this.loadingScreenService.stopLoading());
                }
            })
        )
    }

}