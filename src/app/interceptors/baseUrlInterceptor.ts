import { HttpInterceptorFn } from "@angular/common/http";
import { environment } from "../../environments/environment";

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.startsWith('http') || req.url.startsWith('//')) {
        return next(req);
      }
    
      const apiUrl = environment.apiUrl;
      const newReq = req.clone({
        url: `${apiUrl}/${req.url.replace(/^\//, '')}`
      });
    
      return next(newReq);
}