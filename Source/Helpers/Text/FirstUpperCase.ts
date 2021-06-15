export function firstUpperCase(s: string) {
	return s.split("").map((str, position) => {
		if(position === 0) return str.toUpperCase();
		else return str.toLowerCase();
	}).join("");
}