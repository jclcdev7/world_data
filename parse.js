'use strict';

var fs = require("fs");
var ctry = require('./template.js', { env: 'NODEJS'});
var utIssue = require('./utIssue.js', { env: 'NODEJS'});
var utMilsec = require('./utMilsec.js', { env: 'NODEJS'});
var utTransport = require('./utTransport.js', { env: 'NODEJS'});
var utTerror = require('./utTerror.js', { env: 'NODEJS'});
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
   var ref = '';
   liste.forEach((item, idx) => {
      if (item.startsWith('Telephones - fixed lines:'))  {
         template.comms.tel_fix.total = liste[idx+2].split('<')[0].trim();
         template.comms.tel_fix.sub_per100 = liste[idx+4].split('<')[0].trim();
         template.comms.tel_fix.rank = liste[idx+6].split('<')[0].trim();
      }
      if (item.startsWith('Telephones - mobile cellular:'))  {
         template.comms.tel_mob.total = liste[idx+2].split('<')[0].trim();
         template.comms.tel_mob.sub_per100 = liste[idx+4].split('<')[0].trim();
         template.comms.tel_mob.rank = liste[idx+6].split('<')[0].trim();
      }
      if (item.startsWith('general assessment:')) template.comms.tel_sys.general = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('domestic:')) template.comms.tel_sys.domestic = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('international:')) template.comms.tel_sys.internat = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Broadcast media:')) template.comms.broadcast = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Internet country code:')) template.comms.internet = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Internet users:'))  {
         template.comms.int_user.total = liste[idx+2].split('<')[0].trim();
         template.comms.int_user.percent = liste[idx+4].split('<')[0].trim();
         if (liste[idx+6] != undefined)
            template.comms.int_user.rank = liste[idx+6].split('<')[0].trim();
      }
   });
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
   var ref = '';
   liste.forEach((item, idx) => {
      if (item.startsWith('Economy - overview:')) {
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1 && !liste[nb].startsWith('GDP (purchasing power parity):')) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.overview = lst;
      }
      if (item.startsWith('GDP (purchasing power parity):')) {
         ref = 'gdp1';
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.gdp.gdp_histo = lst;
      }
      if (item.startsWith('note:') && ref == 'gdp1') template.economy.gdp.note = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('country comparison to the world:') && ref == 'gdp1') {
        template.economy.gdp.rank = liste[idx+1].split('<')[0].trim();
         //ref = '';
      }
      if (item.startsWith('GDP (official exchange rate):')) {
         ref = 'gdp2';
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.gdp_exch.gdp_histo = lst;
      }
      if (item.startsWith('GDP - real growth rate:')) {
         ref = 'gdp3';
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.gdp_growth.gdp_histo = lst;
      }
      if (item.startsWith('country comparison to the world:') && ref == 'gdp3') {
         template.economy.gdp_growth.rank = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('GDP - per capita (PPP):')) {
         ref = 'gdp4';
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.gdp_capita.gdp_histo = lst;
      }
      if (item.startsWith('note:') && ref == 'gdp4') template.economy.gdp_capita.note = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('country comparison to the world:') && ref == 'gdp4') {
         template.economy.gdp_capita.rank = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('Gross national saving:')) {
         ref = 'gdp5';
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.gdp_gross_sav.gdp_histo = lst;
      }
      if (item.startsWith('country comparison to the world:') && ref == 'gdp5') {
         template.economy.gdp_gross_sav.rank = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('household consumption:')) template.economy.gdp_compo.house = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('government consumption:')) template.economy.gdp_compo.gov = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('investment in fixed capital:')) template.economy.gdp_compo.inv_cap = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('investment in inventories:')) template.economy.gdp_compo.inv_invent = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('exports of goods and services:')) template.economy.gdp_compo.export = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('imports of goods and services:')) template.economy.gdp_compo.import = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('GDP - composition, by sector of origin:')) {
         template.economy.gdp_compo_sect.agri = liste[idx+2].split('<')[0].trim();
         template.economy.gdp_compo_sect.indus = liste[idx+4].split('<')[0].trim();
         template.economy.gdp_compo_sect.service = liste[idx+6].split('<')[0].trim();
      }
      if (item.startsWith('Agriculture - products:')) template.economy.agriculture = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Industries:')) template.economy.industries = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Industrial production growth rate:')) {
         template.economy.indus_prod.rate = liste[idx+1].split('<')[0].trim();
         template.economy.indus_prod.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Labor force:')) {
         template.economy.labor.rate = liste[idx+1].split('<')[0].trim();
         template.economy.labor.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Labor force - by occupation:')) {
         template.economy.labor_occup.agri = liste[idx+2].split('<')[0].trim();
         template.economy.labor_occup.indus = liste[idx+4].split('<')[0].trim();
         template.economy.labor_occup.service = liste[idx+6].split('<')[0].trim();
      }
      if (item.startsWith('Unemployment rate:')) {
         ref = 'ur';
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.unemploy.histo = lst;
      }
      if (item.startsWith('note:') && ref == 'ur') template.economy.unemploy.note = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('country comparison to the world:') && ref == 'ur') {
         template.economy.unemploy.rank = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('Population below poverty line:')) template.economy.poverty_line = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('lowest 10%:')) template.economy.house_income.lowest = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('highest 10%:')) template.economy.house_income.highest = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Distribution of family income - Gini index:')) {
         ref = 'gini';
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.gini_idx.histo = lst;
      }
      if (item.startsWith('country comparison to the world:') && ref == 'gini') {
         template.economy.gini_idx.rank = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('Budget:')) {
          template.economy.budget.revenues = liste[idx+2].split('<')[0].trim();
          template.economy.budget.expenditures = liste[idx+4].split('<')[0].trim();
      }
      if (item.startsWith('Taxes and other revenues:')) {
          template.economy.taxes.income = liste[idx+1].split('<')[0].trim();
          template.economy.taxes.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Budget surplus (+) or deficit (-):')) {
          template.economy.budget_bal.bal = liste[idx+1].split('<')[0].trim();
          template.economy.budget_bal.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Public debt:')) {
         ref = 'pubdebt';
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.pub_debt.histo = lst;
      }
      if (item.startsWith('country comparison to the world:') && ref == 'pubdebt') {
         template.economy.pub_debt.rank = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('Fiscal year:')) template.economy.fiscal = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Inflation rate (consumer prices):')) {
         ref = 'inflat';
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.inflation.histo = lst;
      }
      if (item.startsWith('country comparison to the world:') && ref == 'inflat') {
         template.economy.inflation.rank = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('Central bank discount rate:')) {
         ref = 'centbk';
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.cent_bank.histo = lst;
      }
      if (item.startsWith('country comparison to the world:') && ref == 'centbk') {
         template.economy.cent_bank.rank = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('Commercial bank prime lending rate:')) {
         ref = 'combk';
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.comerc_bank.histo = lst;
      }
      if (item.startsWith('country comparison to the world:') && ref == 'combk') {
         template.economy.comerc_bank.rank = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('Stock of narrow money:')) {
         ref = 'stknar';
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.stock_narrow.histo = lst;
      }
      if (item.startsWith('country comparison to the world:') && ref == 'stknar') {
         template.economy.stock_narrow.rank = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('Stock of broad money:')) {
         ref = 'stkbrd';
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.stock_broad.histo = lst;
      }
      if (item.startsWith('country comparison to the world:') && ref == 'stkbrd') {
         template.economy.stock_broad.rank = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('Stock of domestic credit:')) {
         ref = 'stkdom';
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.stock_dom.histo = lst;
      }
      if (item.startsWith('country comparison to the world:') && ref == 'stkdom') {
         template.economy.stock_dom.rank = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('Market value of publicly traded shares:')) template.economy.market_val = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Current account balance:')) {
         ref = 'curbal';
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.curr_bal.histo = lst;
      }
      if (item.startsWith('country comparison to the world:') && ref == 'curbal') {
         template.economy.curr_bal.rank = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('Exports:')) {
         ref = 'export';
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.exports.histo = lst;
      }
      if (item.startsWith('country comparison to the world:') && ref == 'export') {
         template.economy.exports.rank = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('Exports - commodities:')) template.economy.export_com = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Exports - partners:')) template.economy.export_partner = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Imports:')) {
         ref = 'import';
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.imports.histo = lst;
      }
      if (item.startsWith('country comparison to the world:') && ref == 'import') {
         template.economy.imports.rank = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('Imports - commodities:')) template.economy.import_com = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Imports - partners:')) template.economy.import_partner = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Reserves of foreign exchange and gold:')) {
         ref = 'rsv';
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.reserve.histo = lst;
      }
      if (item.startsWith('country comparison to the world:') && ref == 'rsv') {
         template.economy.reserve.rank = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('Debt - external:')) {
         ref = 'debext';
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.debt_ext.histo = lst;
      }
      if (item.startsWith('country comparison to the world:') && ref == 'debext') {
         template.economy.debt_ext.rank = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('Stock of direct foreign investment - at home:')) {
         ref = 'forinv';
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.foreign_invest.histo = lst;
      }
      if (item.startsWith('country comparison to the world:') && ref == 'forinv') {
         template.economy.foreign_invest.rank = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('Exchange rates:')) {
         ref = '';
         var lst = new Array();
         var nb = idx+1;
         while (nb < liste.length) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.economy.exch_rate = lst;
      }
   });
}

var trtGov = (liste) => {
   liste.forEach((item, idx) => {
      if (item.startsWith('conventional long form:')) template.government.country_name.conv_long = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('conventional short form:')) template.government.country_name.conv_short = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('local long form:')) template.government.country_name.loc_long = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('local short form:')) template.government.country_name.loc_short = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('former:')) template.government.country_name.former = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('etymology:')) template.government.country_name.etymology = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Government type:')) template.government.gov_type = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Capital:')) {
         template.government.capital.name = liste[idx+2].split('<')[0].trim();
         template.government.capital.coordinates = liste[idx+4].split('<')[0].trim();
         template.government.capital.timezone = liste[idx+6].split('<')[0].trim();
         template.government.capital.daylight = liste[idx+8].split('<')[0].trim();
      }
      if (item.startsWith('Administrative divisions:')) template.government.admin_div = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Independence:')) template.government.independence = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('National holiday:')) template.government.nat_hol = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Constitution:')) {
         template.government.constitution.history = liste[idx+2].split('<')[0].trim();
         template.government.constitution.amdt = liste[idx+4].split('<')[0].trim();
      }
      if (item.startsWith('Legal system:')) template.government.legal = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('International law organization participation:')) template.government.int_law = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('citizenship by birth:')) template.government.citizen.birth = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('citizenship by descent only:')) template.government.citizen.descent = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('dual citizenship recognized:')) template.government.citizen.dual = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('residency requirement for naturalization:')) template.government.citizen.residency = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Suffrage:')) template.government.suffrage = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('chief of state:')) template.government.executive.cos = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('head of government:')) template.government.executive.head_gov = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('cabinet:')) template.government.executive.cabinet = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('elections/appointments:')) template.government.executive.election = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('description:')) template.government.legislative.description = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('elections:')) template.government.legislative.election = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('election results:')) template.government.legislative.result = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('highest court(s):')) template.government.judicial.high_court = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('judge selection and term of office:')) template.government.judicial.judge_sel = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('subordinate courts:')) template.government.judicial.sub_court = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Political parties and leaders:')) {
         var lst = new Array();
         var nb = idx+1;
         while (!liste[nb].startsWith('Political pressure groups and leaders:')  &&
            !liste[nb].startsWith('International organization participation:')  &&
            !liste[nb].startsWith('Flag description:')) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.government.parties = lst;
      }
      if (item.startsWith('Political pressure groups and leaders:')) {
         var lst = new Array();
         var nb = idx+1;
         while (nb < liste.length && !liste[nb].startsWith('International organization participation:')) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.government.pressure = lst;
      }
      if (item.startsWith('International organization participation:')) template.government.int_org = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Flag description:')) template.government.flag = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('National symbol(s):')) template.government.symbol = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('National anthem:')) {
         if (liste[idx+1].startsWith('name:')) {
            template.government.anthem.name = liste[idx+2].split('<')[0].trim();
            template.government.anthem.lyr_mus = liste[idx+4].split('<')[0].trim();
            template.government.anthem.note = liste[idx+6].split('<')[0].trim();
         }
         else
            template.government.anthem.note = liste[idx+2].split('<')[0].trim();
      }
   })
}

var trtPeople = (liste) => {
   var ref = '';
   liste.forEach((item, idx) => {
      if (item.startsWith('Population:')) {
         template.peop_soc.population.total = liste[idx+1].split('<')[0].trim();
         if (item[idx+2].startsWith('country comparison to the world:'))
            template.peop_soc.population.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Nationality:')) {
         template.peop_soc.nationality.noun = liste[idx+2].split('<')[0].trim();
         template.peop_soc.nationality.adjective = liste[idx+4].split('<')[0].trim();
      }
      if (item.startsWith('Ethnic groups:')) template.peop_soc.ethnic.group = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Languages:')) template.peop_soc.language.lg = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Religions:')) template.peop_soc.religion = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Age structure:')) ref = 'age_struct';
      if (item.startsWith('0-14 years:') && ref == 'age_struct') {
         var age = {};
         age["age"] = liste[idx].split('<')[0].trim()
         age["note"] = liste[idx+1].split('<')[0].trim()
         template.peop_soc.age.push(age);
      }
      if (item.startsWith('15-24 years:') && ref == 'age_struct') {
         var age = {};
         age["age"] = liste[idx].split('<')[0].trim()
         age["note"] = liste[idx+1].split('<')[0].trim()
         template.peop_soc.age.push(age);
      }
      if (item.startsWith('25-54 years:') && ref == 'age_struct') {
         var age = {};
         age["age"] = liste[idx].split('<')[0].trim()
         age["note"] = liste[idx+1].split('<')[0].trim()
         template.peop_soc.age.push(age);
      }
      if (item.startsWith('55-64 years:') && ref == 'age_struct') {
         var age = {};
         age["age"] = liste[idx].split('<')[0].trim()
         age["note"] = liste[idx+1].split('<')[0].trim()
         template.peop_soc.age.push(age);
      }
      if (item.startsWith('65 years and over:') && ref == 'age_struct') {
         var age = {};
         age["age"] = liste[idx].split('<')[0].trim()
         age["note"] = liste[idx+1].split('<')[0].trim()
         template.peop_soc.age.push(age);
         ref = '';
      }
      if (item.startsWith('total dependency ratio:')) template.peop_soc.dependency.total = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('youth dependency ratio:')) template.peop_soc.dependency.youth = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('elderly dependency ratio:')) template.peop_soc.dependency.elderly = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('potential support ratio:')) template.peop_soc.dependency.support = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Median age:')) {
         template.peop_soc.median.total = liste[idx+2].split('<')[0].trim();
         template.peop_soc.median.male = liste[idx+4].split('<')[0].trim();
         template.peop_soc.median.female = liste[idx+6].split('<')[0].trim();
         template.peop_soc.median.rank = liste[idx+8].split('<')[0].trim();
      }
      if (item.startsWith('Population growth rate:')) {
         template.peop_soc.growth.rate = liste[idx+1].split('<')[0].trim();
         template.peop_soc.growth.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Birth rate:')) {
         template.peop_soc.birth.rate = liste[idx+1].split('<')[0].trim();
         template.peop_soc.birth.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Death rate:')) {
         template.peop_soc.death.rate = liste[idx+1].split('<')[0].trim();
         template.peop_soc.death.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Net migration rate:')) {
         template.peop_soc.migration.rate = liste[idx+1].split('<')[0].trim();
         template.peop_soc.migration.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith('Population distribution:')) template.peop_soc.distribution = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('urban population:')) template.peop_soc.urbanization.urban = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('rate of urbanization:')) template.peop_soc.urbanization.rate = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Major urban areas - population:')) template.peop_soc.urban_areas = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Sex ratio:')) ref = 'sex_ratio';
      if (item.startsWith('at birth:') && ref == 'sex_ratio') {
         var age = {};
         age["age"] = liste[idx].split('<')[0].trim()
         age["note"] = liste[idx+1].split('<')[0].trim()
         template.peop_soc.sex.push(age);
      }
      if (item.startsWith('0-14 years:') && ref == 'sex_ratio') {
         var age = {};
         age["age"] = liste[idx].split('<')[0].trim()
         age["note"] = liste[idx+1].split('<')[0].trim()
         template.peop_soc.sex.push(age);
      }
      if (item.startsWith('15-24 years:') && ref == 'sex_ratio') {
         var age = {};
         age["age"] = liste[idx].split('<')[0].trim()
         age["note"] = liste[idx+1].split('<')[0].trim()
         template.peop_soc.sex.push(age);
      }
      if (item.startsWith('25-54 years:') && ref == 'sex_ratio') {
         var age = {};
         age["age"] = liste[idx].split('<')[0].trim()
         age["note"] = liste[idx+1].split('<')[0].trim()
         template.peop_soc.sex.push(age);
      }
      if (item.startsWith('55-64 years:') && ref == 'sex_ratio') {
         var age = {};
         age["age"] = liste[idx].split('<')[0].trim()
         age["note"] = liste[idx+1].split('<')[0].trim()
         template.peop_soc.sex.push(age);
      }
      if (item.startsWith('65 years and over:') && ref == 'sex_ratio') {
         var age = {};
         age["age"] = liste[idx].split('<')[0].trim()
         age["note"] = liste[idx+1].split('<')[0].trim()
         template.peop_soc.sex.push(age);
      }
      if (item.startsWith('total population:') && ref == 'sex_ratio') {
         var age = {};
         age["age"] = liste[idx].split('<')[0].trim()
         age["note"] = liste[idx+1].split('<')[0].trim()
         template.peop_soc.sex.push(age);
         ref = '';
      }
      if (item.startsWith("Mother's mean age at first birth:")) template.peop_soc.mother_first_birth = liste[idx+1].split('<')[0].trim();
      if (item.startsWith("Maternal mortality ratio:")) {
         template.peop_soc.mother_death.rate = liste[idx+1].split('<')[0].trim();
         template.peop_soc.mother_death.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith("Infant mortality rate:")) {
         template.peop_soc.infant_death.total = liste[idx+2].split('<')[0].trim();
         template.peop_soc.infant_death.male = liste[idx+4].split('<')[0].trim();
         template.peop_soc.infant_death.female = liste[idx+6].split('<')[0].trim();
         template.peop_soc.infant_death.rank = liste[idx+8].split('<')[0].trim();
      }
      if (item.startsWith("Life expectancy at birth:")) {
         template.peop_soc.life_birth.total = liste[idx+2].split('<')[0].trim();
         template.peop_soc.life_birth.male = liste[idx+4].split('<')[0].trim();
         template.peop_soc.life_birth.female = liste[idx+6].split('<')[0].trim();
         template.peop_soc.life_birth.rank = liste[idx+8].split('<')[0].trim();
      }
      if (item.startsWith("Total fertility rate:")) {
         template.peop_soc.fertility.rate = liste[idx+1].split('<')[0].trim();
         if (liste[idx+2] != undefined && liste[idx+2].startsWith('country comparison to the world:'))
            template.peop_soc.fertility.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith("Contraceptive prevalence rate:")) template.peop_soc.contraceptive = liste[idx+1].split('<')[0].trim();
      if (item.startsWith("Health expenditures:")) {
         template.peop_soc.health_exp.rate = liste[idx+1].split('<')[0].trim();
         template.peop_soc.health_exp.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith("Physicians density:")) template.peop_soc.physicians = liste[idx+1].split('<')[0].trim();
      if (item.startsWith("Hospital bed density:")) template.peop_soc.hospital = liste[idx+1].split('<')[0].trim();
      if (item.startsWith("Drinking water source:")) {
         var nb = idx+2;
         template.peop_soc.drink_water.imp.urban = liste[idx+2].split('<')[0].split(': ')[1].trim();
         nb+=1
         if (liste[nb].startsWith('rural:')) {
            template.peop_soc.drink_water.imp.rural = liste[nb].split('<')[0].split(': ')[1].trim();
            nb+=1
         }
         if (liste[nb].startsWith('total:')) {
            template.peop_soc.drink_water.imp.total = liste[nb].split('<')[0].split(': ')[1].trim();
            nb+=1;
         }
         nb+=1
         template.peop_soc.drink_water.unimp.urban = liste[nb].split('<')[0].split(': ')[1].trim();
         nb+=1
         if (liste[nb].startsWith('rural:')) {
            template.peop_soc.drink_water.unimp.rural = liste[nb].split('<')[0].split(': ')[1].trim();
            nb+=1
         }
         if (liste[nb].startsWith('total:'))
            template.peop_soc.drink_water.unimp.total = liste[nb].split('<')[0].split(': ')[1].trim();
      }
      if (item.startsWith("Sanitation facility access:")) {
         template.peop_soc.sanitation.imp.urban = liste[idx+2].split('<')[0].split(': ')[1].trim();
         template.peop_soc.sanitation.imp.rural = liste[idx+3].split('<')[0].split(': ')[1].trim();
         template.peop_soc.sanitation.imp.total = liste[idx+4].split('<')[0].split(': ')[1].trim();
         template.peop_soc.sanitation.unimp.urban = liste[idx+6].split('<')[0].split(': ')[1].trim();
         if (liste[idx+7].indexOf(': ') != -1)
            template.peop_soc.sanitation.unimp.rural = liste[idx+7].split('<')[0].split(': ')[1].trim();
         else
            template.peop_soc.sanitation.unimp.rural = liste[idx+7].split('<')[0].trim();
         if (liste[idx+8].indexOf(': ') != -1)
            template.peop_soc.sanitation.unimp.total = liste[idx+8].split('<')[0].split(': ')[1].trim();
         else
            template.peop_soc.sanitation.unimp.total = liste[idx+8].split('<')[0].trim();
      }
      if (item.startsWith("HIV/AIDS - adult prevalence rate:")) {
         template.peop_soc.hiv_prevalence.rate = liste[idx+1].split('<')[0].trim();
         template.peop_soc.hiv_prevalence.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith("HIV/AIDS - people living with HIV/AIDS:")) {
         template.peop_soc.hiv_living.rate = liste[idx+1].split('<')[0].trim();
         template.peop_soc.hiv_living.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith("HIV/AIDS - deaths:")) template.peop_soc.hiv_death = liste[idx+1].split('<')[0].trim();
      if (item.startsWith("Obesity - adult prevalence rate:")) {
         template.peop_soc.obesity.rate = liste[idx+1].split('<')[0].trim();
         template.peop_soc.obesity.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith("Children under the age of 5 years underweight:")) {
         template.peop_soc.underweight.rate = liste[idx+1].split('<')[0].trim();
         template.peop_soc.underweight.rank = liste[idx+3].split('<')[0].trim();
      }
      if (item.startsWith("Education expenditures:")) {
         if (!liste[idx+1].startsWith('NA')) {
            template.peop_soc.educ_exp.rate = liste[idx+1].split('<')[0].trim();
            if (liste[idx+2] != undefined && liste[idx+2].startsWith('country comparison to the world:'))
               template.peop_soc.educ_exp.rank = liste[idx+3].split('<')[0].trim();
         }
      }
      if (item.startsWith("Literacy:")) {
         template.peop_soc.literacy.def = liste[idx+2].split('<')[0].trim();
         template.peop_soc.literacy.total = liste[idx+4].split('<')[0].trim();
         template.peop_soc.literacy.male = liste[idx+6].split('<')[0].trim();
         template.peop_soc.literacy.female = liste[idx+8].split('<')[0].trim();
      }
      if (item.startsWith("School life expectancy (primary to tertiary education):")) {
         template.peop_soc.school.total = liste[idx+2].split('<')[0].trim();
         template.peop_soc.school.male = liste[idx+4].split('<')[0].trim();
         template.peop_soc.school.female = liste[idx+6].split('<')[0].trim();
      }
      if (item.startsWith("Unemployment, youth ages 15-24:")) {
         template.peop_soc.unemploy.total = liste[idx+2].split('<')[0].trim();
         template.peop_soc.unemploy.male = liste[idx+4].split('<')[0].trim();
         template.peop_soc.unemploy.female = liste[idx+6].split('<')[0].trim();
         if (liste[idx+7] != undefined && liste[idx+7].startsWith('country comparison to the world:'))
            template.peop_soc.unemploy.rank = liste[idx+8].split('<')[0].trim();
      }
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
   liste.forEach((item, idx) => {
      if (item.startsWith('Location:')) template.geography.location = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Geographic coordinates:')) template.geography.coordinate = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Map references:')) template.geography.map = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Area:')) {
         template.geography.area.total = liste[idx+2].split('<')[0].trim();
         template.geography.area.land = liste[idx+4].split('<')[0].trim();
         template.geography.area.water = liste[idx+6].split('<')[0].trim();
         template.geography.area.position = liste[idx+8].split('<')[0].trim();
      }
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
//launch('./ctry/', 'af');
