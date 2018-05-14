'use strict';

var ttIssues = (liste, template, callback) => {
   var ref = '';
   liste.forEach((item, idx) => {
      if (item.startsWith('Disputes - international:')) template.issues.dispute = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('refugees (')) template.issues.refug_displaced.refugee = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('IDPs:')) template.issues.refug_displaced.idps = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('stateless persons:')) template.issues.refug_displaced.stateless = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('current situation:')) template.issues.traffic_pers.current = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('tier rating:')) template.issues.traffic_pers.tier = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Illicit drugs:')) {
         var nb = idx+1;
         var lst = new Array();
         while (nb < liste.length) {
            lst.push(liste[nb].split('<')[0].trim());
            nb+=1
         }
         template.issues.drugs = lst;
      }
   });
   callback(template);
}
module.exports.ttIssues = ttIssues;
