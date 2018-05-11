const execSync = require('child_process').execSync;

var liste = ['af', 'ax', 'al', 'ag', 'aq', 'an', 'ao', 'av', 'ay', 'ac', 'ar', 'am', 'aa', 'at', 'as', 'au', 'aj',
				'bf', 'ba', 'fq', 'bg', 'bb', 'bs', 'bo', 'be', 'bh', 'bn', 'bd', 'bt', 'bl', 'bk', 'bc', 'bv', 'br', 'io', 'vi', 'bx', 'bu', 'uv', 'bm', 'by',
				'cv', 'cb', 'cm', 'ca', 'cj', 'ct', 'cd', 'ci', 'ch', 'kt', 'ip', 'ck', 'co', 'cn', 'cg', 'cf', 'cw', 'cr', 'cs', 'iv', 'hr', 'cu', 'uc', 'cy', 'ez',
				'da', 'dx', 'dj', 'do', 'dr',
				'ec', 'eg', 'es', 'ek', 'er', 'en', 'et', 'eu',
				'fk', 'fo', 'fj', 'fi', 'fr', 'fg', 'fp', 'fs',
				'gb', 'ga', 'gz', 'gg', 'gm', 'gh', 'gi', 'go', 'gr', 'gl', 'gj', 'gp', 'gq', 'gt', 'gk', 'gv', 'pu', 'gy',
				'ha', 'hm', 'vt', 'ho', 'hk', 'hq', 'hu',
				'ic', 'in', 'id', 'ir', 'iz', 'ei', 'im', 'is', 'it',
            'jm', 'jn', 'ja', 'dq', 'je', 'jq', 'jo', 'ju',
            'kz', 'ke', 'kq', 'kr', 'kn', 'ks', 'kv', 'ku', 'kg',
            'la', 'lg', 'le', 'lt', 'li', 'ly', 'ls', 'lh', 'lu',
            'mc', 'mk', 'ma', 'mi', 'my', 'mv', 'ml', 'mt', 'rm', 'mb', 'mr', 'mp', 'mf', 'mx', 'fm', 'mq', 'md', 'mn', 'mg', 'mj', 'mh', 'mo', 'mz',
            'wa', 'nr', 'bq', 'np', 'nl', 'nt', 'nc', 'nz', 'nu', 'ng', 'ni', 'ne', 'nf', 'cq', 'no',
            'mu', 'pk', 'ps', 'lq', 'pm', 'pp', 'pf', 'pa', 'pe', 'rp', 'pc', 'pl', 'po', 'rq',
            'qa', 're', 'ro', 'rs', 'rw', 'ym', 'za', 'zi',
            'tb', 'sh', 'sc', 'st', 'rn', 'sb', 'vc', 'ws', 'sm', 'tp', 'sa', 'sg', 'ri', 'se', 'sl', 'sn', 'nn', 'lo',
            'si', 'bp', 'so', 'sf', 'sx', 'od', 'sp', 'pg', 'ce', 'su', 'ns', 'sv', 'wz', 'sw', 'sz', 'sy',
            'tw', 'ti', 'tz', 'th', 'tt', 'to', 'tl', 'tn', 'td', 'te', 'ts', 'tu', 'tx', 'tk', 'tv',
            'ug', 'up', 'ae', 'uk', 'us', 'uy', 'uz',
            'nh', 've', 'vm', 'vq', 'wq', 'wf', 'we', 'wi']

execSync('curl -X POST http://localhost:5984/world/ -d @liste.json -H "Content-Type:application/json"');

liste.forEach((ctry) => {
	execSync('curl -X POST http://localhost:5984/world/ -d @json/'+ctry+'.json -H "Content-Type:application/json"');
})

//curl -X POST http://localhost:5984/world/ -d @bb.json -H "Content-Type:application/json"
