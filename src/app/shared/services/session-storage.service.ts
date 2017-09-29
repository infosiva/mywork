export class SessionStorageService {
	constructor() {
		// code...
	}
	public setItem(key: string ,data: string) {
		sessionStorage.setItem(key,data);
	}
	public getItem(key: string) {
		return sessionStorage.getItem(key);
	}
	public removeItem(key: string) {
		return sessionStorage.removeItem(key);
	}
}