webapp.factory("uuidFactory", function() {
	function r(r) {
		return Math.random() * r
	}
	return {
		v4 : function() {
			var n, a = "";
			for (n = 0; 36 > n; n++)
				a += 14 === n ? "4" : 19 === n ? "89ab".charAt(r(4)) : 8 === n
						|| 13 === n || 18 === n || 23 === n ? "-"
						: "0123456789abcdef".charAt(r(16));
			return a
		}
	};
});
