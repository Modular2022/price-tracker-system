import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";


@Injectable({
	providedIn: "root",
})
export class InterceptorsService implements HttpInterceptor {

	constructor(
    private messageService: MessageService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
    const request = req.clone({});
    return next.handle(request).pipe( catchError( this.handleError ) );
  }

  handleError( error: HttpErrorResponse ) {
    console.error( error );

    return throwError({
      status: error.status,
      msg: error.statusText
    });
  }

}
