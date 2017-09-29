export class LocalStorageService {
	constructor() {
		// code...
	}
	setItem(key: string ,data: string) {
		localStorage.setItem(key,data);
	}
	getItem(key: string) {
		return localStorage.getItem(key);
	}
	removeItem(key: string) {
		return localStorage.removeItem(key);
	}
}