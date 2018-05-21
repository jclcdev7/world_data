'use strict';

var fs = require("fs");
var ctry = require('./template.js', { env: 'NODEJS'});
var utIssue = require('./utIssue.js', { env: 'NODEJS'});
var utMilsec = require('./utMilsec.js', { env: 'NODEJS'});
var utTransport = require('./utTransport.js', { env: 'NODEJS'});
var utTerror = require('./utTerror.js', { env: 'NODEJS'});
var utComms = require('./utComms.js', { env: 'NODEJS'});
var utPeople = require('./utPeople.js', { env: 'NODEJS'});
var utEconomy= require('./utEconomy.js', { env: 'NODEJS'});
var utGov= require('./utGov.js', { env: 'NODEJS'});
var template = '';
var data = '';
var dataExpurge = '';

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

var readFile8 = (file, callback) => {
	fs.readFile(file, {encoding: 'UTF-8'}, function (err, data) {
		data = data.split('\n');
		callback(data);
	});
}

var copiedsk = () => {
   fs.writeFile('./expurge.html',dataExpurge, (err) => {
 		if (err) throw err;
 				console.log('write file expurge.html');
 	});
}

var expurge = () => {
   var deb = false;
   var fin = false;
   data.forEach((ligne) => {
      if (ligne.startsWith('<!-- generated content -->')) deb = true;
      if (ligne.startsWith('<!-- end generated content -->')) fin = true;
      if (deb && !fin)
         dataExpurge+= (ligne.replace('\n','').trim().replaceAll('>','>\n'))
   })
}

var clean = (callback) => {
   var res = '';
   var liste = dataExpurge.split('\n');
   liste.forEach((item, idx) => {
      if (!item.startsWith('<') && !item.startsWith('::') && !item.startsWith('×<') && !item.startsWith(' <'))
      res +=item+'\n';
   })
   callback(res);
}

var traiteTemplate = (gec) => {
   template = JSON.parse(JSON.stringify(ctry))
   var existTerror = false;
   var deb = 0;
   var liste = dataExpurge.split('\n');
   template.GEC= gec.toUpperCase();
   liste.forEach((item, idx) => {
      if (idx == 0) template.region = item.split('<')[0].trim();
      if (idx == 1) template.name = item.split('<')[0].trim();
      if (idx == 2) template.update = item.split('<')[0].trim();
      if (item.startsWith('Background:')) {
         deb = idx; //console.log('Introduction: ',idx)
      }
      if (item.startsWith('Geography ::')) { // console.log('Geography: ',idx)
         trtIntro(liste.slice(deb, idx));

         deb = idx;
      }
      if (item.startsWith('People and Society ::')) {
         //console.log('People and Society: ',idx)
         trtGeo(liste.slice(deb, idx));
         deb = idx;
      }
      if (item.startsWith('Government ::')) {
         //console.log('Government: ',idx)
         trtPeople(liste.slice(deb, idx));
         deb = idx;
      }
      if (item.startsWith('Economy ::')) {
         //console.log('Economy: ',idx)
         trtGov(liste.slice(deb, idx));
         deb = idx;
      }
      if (item.startsWith('Energy ::')) {
         //console.log('Energy: ',idx)
         trtEconomy(liste.slice(deb, idx));
         deb = idx;
      }
      if (item.startsWith('Communications ::')) {
         //console.log('Comms: ',idx);
         trtEngy(liste.slice(deb, idx));
         deb = idx;
      }
      if (item.startsWith('Transportation ::')) {
         //console.log('Transport: ',idx);
         trtComms(liste.slice(deb, idx));
         deb = idx;
      }
      if (item.startsWith('Military and Security ::')) {
         //console.log('milsec: ',idx);
         trtTrans(liste.slice(deb, idx));
         deb = idx;
      }
      if (item.startsWith('Terrorism ::')) {
         //console.log('Terror: ',idx);
         existTerror = true;
         trtMilsec(liste.slice(deb, idx));
         deb = idx;
      }
      if (item.startsWith('Transnational Issues ::')) {
         //console.log('Issues: ',idx);
         if(existTerror)
            trtTerror(liste.slice(deb, idx));
         else
            trtMilsec(liste.slice(deb, idx));
         deb = idx;
         trtIssues(liste.slice(deb, liste.length-1))
      }
   })
   //console.log(template);
   fs.writeFile('./json/'+gec+'.json',JSON.stringify(template, null, '\t'), (err) => {
 		if (err) throw err;
 				// console.log('write file '+gec+'.json');
 	});
}

var trtIssues = (liste) => {
   // verified on the 11-05-2018
   utIssue.ttIssues(liste, template, function(res) {
      template = res;
   })
}

var trtTerror = (liste) => {
   utTerror.ttTerror(liste, template, function(res) {
      template = res;
   });
}

var trtMilsec = (liste) => {
   // verified on the 11-05-2018
   utMilsec.ttMilsec(liste, template, function(res) {
      template = res;
   });
}

var trtTrans = (liste) => {
   utTransport.ttTransport(liste, template, function(res) {
      template = res;
   });
}

var trtComms = (liste) => {
   utComms.ttComms(liste, template, function(res) {
     template = res;
   })
}

var trtEngy = (liste) => {
   var ref = '';
   liste.forEach((item, idx) => {
      if (item.startsWith('electrification - total population:')) template.energy.elec_access = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Electricity - production:')) {
         template.energy.elec_prod.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2] != undefined && liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.elec_prod.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Electricity - consumption:')) {
         template.energy.elec_cons.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.elec_cons.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Electricity - exports:')) {
         template.energy.elec_exp.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.elec_exp.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Electricity - imports:')) {
         template.energy.elec_imp.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.elec_imp.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Electricity - installed generating capacity:')) {
         template.energy.elec_gene.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.elec_gene.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Electricity - from fossil fuels:')) {
         template.energy.elec_fossil.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.elec_fossil.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Electricity - from nuclear fuels:')) {
         template.energy.elec_nuclear.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.elec_nuclear.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Electricity - from hydroelectric plants:')) {
         template.energy.elec_hydro.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.elec_hydro.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Electricity - from other renewable sources:')) {
         template.energy.elec_other.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.elec_other.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Crude oil - production:')) {
         template.energy.crude_prod.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.crude_prod.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Crude oil - exports:')) {
         template.energy.crude_exp.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.crude_exp.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Crude oil - imports:')) {
         template.energy.crude_imp.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.crude_imp.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Crude oil - proved reserves:')) {
         template.energy.crude_rsv.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.crude_rsv.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Refined petroleum products - production:')) {
         template.energy.refined_prod.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.refined_prod.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Refined petroleum products - consumption:')) {
         template.energy.refined_cons.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.refined_cons.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Crude oil - exports:')) {
         template.energy.refined_exp.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.refined_exp.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Crude oil - imports:')) {
         template.energy.refined_imp.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.refined_imp.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Natural gas - production:')) {
         template.energy.gas_prod.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.gas_prod.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Natural gas - consumption:')) {
         template.energy.gas_cons.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.gas_cons.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Natural gas - exports:')) {
         template.energy.gas_exp.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.gas_exp.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Natural gas - imports:')) {
         template.energy.gas_imp.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.gas_imp.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Natural gas - proved reserves:')) {
         template.energy.gas_rsv.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2] != undefined && liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.gas_rsv.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Carbon dioxide emissions from consumption of energy:')) {
         template.energy.emission.total = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2].startsWith('country comparison to the world:'))
            template.energy.emission.rank = liste[idx+3].split('<')[0].trim();
      }
   });
}

var trtEconomy = (liste) => {
   utEconomy.ttEconomy(liste, template, function(res) {
     template = res;
   })
}

var trtGov = (liste) => {
   utGov.ttGov(liste, template, function(res) {
      template = res;
   })
}

var trtPeople = (liste) => {
   utPeople.ttPeople(liste, template, function(res) {
     template = res;
   })
}

var trtIntro = (liste) => {
   var lst = new Array()
   liste.forEach((item, idx) => {
      if (!item.startsWith('Background:') && !item.startsWith('Show</'))
      lst.push(item.split('<')[0].trim());
   })
   template.introduction.background = lst;
}

var trtGeo = (liste) => {
   var ref = '';
   liste.forEach((item, idx) => {
      //console.log(template.GEC, ' ,', item)
      if (item.startsWith('Location:')) template.geography.location = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Geographic coordinates:')) template.geography.coordinate = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Map references:')) template.geography.map = liste[idx+1].split('<')[0].trim();

      if (item.startsWith('Area:')) ref = 'area';
      if (item.startsWith('total:') && ref == 'area')
         template.geography.area.total = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('land:') && ref == 'area')
         template.geography.area.land = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('water:') && ref == 'area')
         template.geography.area.water = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('note:') && ref == 'area')
         template.geography.area.note = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('country comparison to the world:') && ref == 'area')
         template.geography.area.position = liste[idx+1].split('<')[0].trim();

      if (item.startsWith('Area - comparative:')) template.geography.area_com = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Land boundaries:')) {
         template.geography.boundaries.total = liste[idx+2].split('<')[0].trim();
         template.geography.boundaries.countries = liste[idx+4].split('<')[0].trim();
      }
      if (item.startsWith('Coastline:')) template.geography.coastlines = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Maritime claims:')) {
         var lst = []
         if (liste[idx+2].startsWith('Climate:'))
            template.geography.claims = liste[idx+1].split('<')[0].trim();
         else {
            var nb = idx+1
            while (!liste[nb].startsWith('Climate:')) {
               lst.push(liste[nb].split('<')[0].trim());
               nb +=1
            }
            template.geography.claims = lst;
         }
      }
      if (item.startsWith('Climate:')) template.geography.climate = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Terrain:')) template.geography.terrain = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Elevation:')) {
         template.geography.elevation.mean = liste[idx+2].split('<')[0].trim();
      }
      if (item.startsWith('elevation extremes:')) {
         template.geography.elevation.extremes.lowest = liste[idx+1].split('<')[0].split(':')[1].trim();
         template.geography.elevation.extremes.highest = liste[idx+2].split('<')[0].split(':')[1].trim();
      }
      if (item.startsWith('Natural resources:')) {
         template.geography.resources = liste[idx+1].split('<')[0].trim().split(', ');
      }
      if (item.startsWith('agricultural land:')) {
         template.geography.land_use.agricultural = liste[idx+1].split('<')[0].trim();
         template.geography.land_use.arable = liste[idx+2].split('<')[0].trim();
      }
      if (item.startsWith('forest:')) template.geography.land_use.forest = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('other:')) template.geography.land_use.others = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Irrigated land:')) template.geography.irrigated = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Population - distribution:')) template.geography.population = liste[idx+1].split('<')[0].trim();

      if (item.startsWith('Natural hazards:')) template.geography.hazards = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Environment - current issues:')) template.geography.environment = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('party to:')) template.geography.agreements.party = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('signed, but not ratified:')) template.geography.agreements.signed = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Geography - note:')) template.geography.notes = liste[idx+1].split('<')[0].trim();
   })
}

var launch = (path, file) => {
   readFile8(path+file+'.html', function(result) {
      dataExpurge = '';
      data = result;
      expurge();
      clean(function(res) {
         dataExpurge = res;
         //copiedsk();
         traiteTemplate(file);
      });
   });
}

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
liste.forEach((p) => {
   launch('./ctry/', p);
})
//launch('./ctry/', 'ch');
