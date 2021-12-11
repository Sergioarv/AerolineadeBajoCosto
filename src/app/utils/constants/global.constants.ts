import { environment } from "src/environments/environment";

export class GlobalConstant {

    // public static URL_ENDPOINT = 'http://localhost:8080';
    public static URL_ENDPOINT = environment.baseUrl;
    
}