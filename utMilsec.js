'use strict';

var ttMilsec = (liste, template, callback) => {
   var ref = '';
   liste.forEach((item, idx) => {
      if (item.startsWith('Military expenditures:')) {
         ref = 'expend';
         var lst = new Array();
         var nb = idx+1;
         while (liste[nb].indexOf(':') == -1) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.milsec.mil_expend.histo = lst;
      }
      if (item.startsWith('country comparison to the world:') && ref == 'expend') {
          template.milsec.mil_expend.rank = liste[idx+1].split('<')[0].trim();
       }
      if (item.startsWith('Military branches:')) template.milsec.branches = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Military service age and obligation:')) template.milsec.obligation = liste[idx+1].split('<')[0].trim();
      if (liste[idx+1] != undefined && item.startsWith('Military - note:')) template.milsec.notes = liste[idx+1].split('<')[0].trim();
   });
   callback(template);
}
module.exports.ttMilsec = ttMilsec;
