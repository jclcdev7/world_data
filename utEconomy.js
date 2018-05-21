'use strict';

var ttEconomy = (liste, template, callback) => {
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

     if (item.startsWith('Stock of direct foreign investment - abroad:')) {
        ref = 'invest_abroad';
        var lst = new Array();
        var nb = idx+1;
        while (liste[nb].indexOf(':') == -1) {
           lst.push(liste[nb].split('<')[0].trim())
           nb+=1
        }
        template.economy.foreign_abroad.histo = lst;
     }
     if (item.startsWith('country comparison to the world:') && ref == 'invest_abroad') {
        template.economy.foreign_abroad.rank = liste[idx+1].split('<')[0].trim();
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

  callback(template);
}
module.exports.ttEconomy = ttEconomy;
