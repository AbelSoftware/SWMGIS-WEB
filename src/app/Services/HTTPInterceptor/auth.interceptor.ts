import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenmanagementService } from '../token-service/tokenmanagement.service'; // Optional: Service to get the token

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenService = inject(TokenmanagementService);

  // Get the token from the TokenService
  const token = tokenService.getToken();
 // console.log("Token " + token)
  // Clone the request and add the Authorization header if token exists
  // Clone the request to modify it
  const modifiedRequest = req.clone({
    withCredentials: true, // Include cookies for every request
    ...(token && {
      setHeaders: {
        Authorization: `Bearer ${token}`, // Add Authorization header if token exists
      },
    }),
  });
  // const modifiedRequest = token
  //   ? req.clone({
  //       setHeaders: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //   : req;

  // Pass the modified request to the next handler
  return next(modifiedRequest);
};
